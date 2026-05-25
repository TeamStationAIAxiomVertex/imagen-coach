import { Resend } from "resend";

const MAX_BODY_BYTES = 12000;
const MIN_FORM_TIME_MS = 2500;
const MAX_FORM_TIME_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;
const RATE_LIMIT_MAX = 6;
const DEFAULT_LEAD_TO_EMAIL = "sonia@coachdeimagen.com";
const DEFAULT_RESEND_FROM_EMAIL = "no-reply@send.coachdeimagen.com";
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "tempmail.com",
  "yopmail.com",
]);
const ALLOWED_SERVICE_INTERESTS = new Set([
  "Imagen Profesional",
  "Presencia Ejecutiva",
  "Coaching de Imagen",
  "Imagen Estratégica",
  "Empresarias",
  "Comunicación No Verbal",
  "Posicionamiento Profesional",
  "Coaching de Mentalidad",
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function getClientIp(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function cleanText(value = "", max = 500) {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function suspiciousLinkCount(value = "") {
  return (String(value).match(/https?:\/\/|www\./gi) || []).length;
}

async function readPayload(request) {
  const length = Number(request.headers.get("content-length") || "0");
  if (length > MAX_BODY_BYTES) throw new Error("payload_too_large");
  return request.json();
}

async function checkRateLimit(env, ip) {
  if (!env.CONTACT_RATE_LIMIT || ip === "unknown") return true;
  const key = `contact:${ip}`;
  const current = Number((await env.CONTACT_RATE_LIMIT.get(key)) || "0");
  if (current >= RATE_LIMIT_MAX) return false;
  await env.CONTACT_RATE_LIMIT.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_WINDOW_SECONDS });
  return true;
}

function validatePayload(raw) {
  if (raw.company_website) return { ok: false, error: "blocked" };
  const startedAt = Number(raw.started_at || 0);
  const elapsed = Date.now() - startedAt;
  if (!startedAt || elapsed < MIN_FORM_TIME_MS || elapsed > MAX_FORM_TIME_MS) return { ok: false, error: "invalid_form_timing" };

  const lead = {
    name: cleanText(raw.name, 90),
    email: cleanText(raw.email, 140).toLowerCase(),
    phone: cleanText(raw.phone, 40),
    city: cleanText(raw.city, 90),
    country: cleanText(raw.country, 80),
    linkedin: cleanText(raw.linkedin, 220),
    service_interest: cleanText(raw.service_interest, 80),
    message: cleanText(raw.message, 1800),
    source_page: cleanText(raw.source_page, 220),
    utm_source: cleanText(raw.utm_source, 80),
    utm_medium: cleanText(raw.utm_medium, 80),
    utm_campaign: cleanText(raw.utm_campaign, 120),
    concierge_mode: Boolean(raw.concierge_mode),
  };

  const domain = lead.email.split("@")[1] || "";
  if (lead.name.length < 2) return { ok: false, error: "missing_name" };
  if (!isValidEmail(lead.email)) return { ok: false, error: "invalid_email" };
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) return { ok: false, error: "disposable_email" };
  if (lead.phone.length < 6) return { ok: false, error: "missing_phone" };
  if (!ALLOWED_SERVICE_INTERESTS.has(lead.service_interest)) return { ok: false, error: "invalid_service_interest" };
  if (lead.message.length < 20) return { ok: false, error: "message_too_short" };
  if (suspiciousLinkCount(`${lead.message} ${lead.linkedin}`) > 3) return { ok: false, error: "too_many_links" };
  return { ok: true, lead };
}

async function qualifyLead(env, lead) {
  if (!lead.concierge_mode || !env.OPENAI_API_KEY || !env.OPENAI_MODEL) {
    return "AI concierge not run. OPENAI_API_KEY and OPENAI_MODEL are optional Worker secrets.";
  }
  const prompt = [
    "Summarize this Spanish-language executive image coaching lead for Sonia McRorey.",
    "Return concise plain text with: Executive Level, Primary Need, Core Emotional Signal, Location, Recommended Service, Urgency.",
    "Do not invent facts. If unknown, write Unknown.",
    JSON.stringify(lead),
  ].join("\n\n");

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL,
        input: prompt,
        max_output_tokens: 350,
      }),
    });
    if (!response.ok) return `AI concierge unavailable: ${response.status}`;
    const data = await response.json();
    return cleanText(data.output_text || data.output?.[0]?.content?.[0]?.text || "AI concierge completed without text output.", 1800);
  } catch (error) {
    return "AI concierge unavailable due to provider error.";
  }
}

function emailHtml(lead, summary, leadId, timestamp) {
  const rows = [
    ["Nombre", lead.name],
    ["Email", lead.email],
    ["Teléfono", lead.phone],
    ["Ciudad", lead.city],
    ["País", lead.country],
    ["LinkedIn", lead.linkedin],
    ["Interés", lead.service_interest],
    ["Fuente", lead.source_page],
    ["UTM", [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ")],
  ];
  return `<div style="font-family:Inter,Arial,sans-serif;color:#2f2d31;line-height:1.55">
    <h1 style="font-family:Georgia,serif;font-weight:400">Nuevo diagnóstico privado</h1>
    <p><strong>Lead ID:</strong> ${escapeHtml(leadId)}<br><strong>Timestamp:</strong> ${escapeHtml(timestamp)}</p>
    <h2>Resumen concierge</h2>
    <pre style="white-space:pre-wrap;background:#f6f4f7;border:1px solid #e4dfe7;padding:16px">${escapeHtml(summary)}</pre>
    <h2>Datos del lead</h2>
    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
      ${rows.map(([label, value]) => `<tr><td style="border-bottom:1px solid #e4dfe7;width:160px"><strong>${escapeHtml(label)}</strong></td><td style="border-bottom:1px solid #e4dfe7">${escapeHtml(value || "No indicado")}</td></tr>`).join("")}
    </table>
    <h2>Mensaje completo</h2>
    <p>${escapeHtml(lead.message)}</p>
  </div>`;
}

async function sendLeadEmail(env, lead, summary, leadId, timestamp) {
  const to = env.LEAD_TO_EMAIL || DEFAULT_LEAD_TO_EMAIL;
  const from = env.RESEND_FROM_EMAIL || DEFAULT_RESEND_FROM_EMAIL;
  if (!env.RESEND_API_KEY || !to) throw new Error("email_configuration_missing");
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: lead.email,
    subject: `Nuevo lead Coach de Imagen: ${lead.service_interest}`,
    html: emailHtml(lead, summary, leadId, timestamp),
    text: [
      `Lead ID: ${leadId}`,
      `Timestamp: ${timestamp}`,
      "",
      "Resumen concierge:",
      summary,
      "",
      `Nombre: ${lead.name}`,
      `Email: ${lead.email}`,
      `Teléfono: ${lead.phone}`,
      `Ciudad: ${lead.city}`,
      `País: ${lead.country}`,
      `LinkedIn: ${lead.linkedin}`,
      `Interés: ${lead.service_interest}`,
      `Fuente: ${lead.source_page}`,
      `Mensaje: ${lead.message}`,
    ].join("\n"),
  });
  if (error) throw new Error(`resend_failed_${error.name || "unknown"}`);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const ip = getClientIp(request);
  try {
    if (!(await checkRateLimit(env, ip))) return json({ ok: false, error: "rate_limited" }, 429);
    const raw = await readPayload(request);
    const result = validatePayload(raw);
    if (!result.ok) return json({ ok: false, error: result.error }, result.error === "blocked" ? 200 : 400);
    const leadId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const summary = await qualifyLead(env, result.lead);
    await sendLeadEmail(env, result.lead, summary, leadId, timestamp);
    return json({ ok: true, lead_id: leadId });
  } catch (error) {
    console.error(JSON.stringify({ event: "contact_submit_failed", ip, error: error.message }));
    if (error.message === "email_configuration_missing") {
      return json({ ok: false, error: "contact_email_not_configured", fallback: "whatsapp" }, 503);
    }
    return json({ ok: false, error: "contact_unavailable" }, 500);
  }
}

export async function onRequestOptions() {
  return json({ ok: true });
}

export async function onRequestGet({ env }) {
  return json({
    ok: true,
    endpoint: "/api/contact",
    email_configured: Boolean(env.RESEND_API_KEY),
    lead_to_email: env.LEAD_TO_EMAIL || DEFAULT_LEAD_TO_EMAIL,
    ai_concierge_configured: Boolean(env.OPENAI_API_KEY && env.OPENAI_MODEL),
  });
}
