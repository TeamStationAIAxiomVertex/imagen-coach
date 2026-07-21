import { normalizeConversionEvent } from "../../lib/conversion-events.mjs";

const MAX_BODY_BYTES = 4096;
const PRODUCTION_ORIGINS = new Set([
  "https://coachdeimagen.com",
  "https://www.coachdeimagen.com",
  "https://raiz.coachdeimagen.com",
]);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
function originIsAllowed(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  if (PRODUCTION_ORIGINS.has(origin)) return true;
  try {
    const url = new URL(origin);
    return url.protocol === "http:" && ["127.0.0.1", "localhost"].includes(url.hostname);
  } catch {
    return false;
  }
}

async function readPayload(request) {
  const length = Number(request.headers.get("content-length") || "0");
  if (length > MAX_BODY_BYTES) throw new Error("payload_too_large");
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) throw new Error("payload_too_large");
  return JSON.parse(text || "{}");
}

function recordEvent(env, event) {
  const dataset = env.CONVERSION_EVENTS;
  if (dataset && typeof dataset.writeDataPoint === "function") {
    dataset.writeDataPoint({
      indexes: [`${event.site}:${event.eventName}`],
      blobs: [
        event.eventName,
        event.site,
        event.route,
        event.placement,
        event.targetType,
        event.targetPath,
        event.ctaLabel,
        event.utmSource,
        event.utmMedium,
        event.utmCampaign,
        event.country,
        event.colo,
      ],
      doubles: [1],
    });
    return "analytics_engine";
  }

  console.log("coachdeimagen_conversion_event", JSON.stringify(event));
  return "worker_log";
}

export async function onRequestPost({ request, env }) {
  if (!originIsAllowed(request)) return json({ error: "origin_not_allowed" }, 403);

  let raw;
  try {
    raw = await readPayload(request);
  } catch (error) {
    return json({ error: error.message === "payload_too_large" ? error.message : "invalid_json" }, 400);
  }

  const normalized = normalizeConversionEvent(raw, {
    country: request.cf?.country || request.headers.get("CF-IPCountry") || "",
    colo: request.cf?.colo || "",
  });
  if (!normalized.ok) return json({ error: normalized.error }, 400);

  const destination = recordEvent(env, normalized.event);
  return json({ accepted: true, destination }, 202);
}
