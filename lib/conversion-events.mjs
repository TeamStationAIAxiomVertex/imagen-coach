export const CONVERSION_EVENT_NAMES = new Set([
  "whatsapp_handoff",
  "instagram_visit",
  "contact_intent",
  "contact_form_attempt",
  "service_interest",
  "raiz_interest",
]);

const TARGET_TYPES = new Set(["whatsapp", "instagram", "contact", "service", "program"]);
const SITES = new Set(["main", "raiz"]);

function cleanText(value = "", max = 120) {
  return String(value)
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}
function cleanPath(value = "", max = 240) {
  const withoutQuery = String(value).split("?")[0];
  return cleanText(withoutQuery, max);
}

export function normalizeConversionEvent(raw = {}, edge = {}) {
  const eventName = cleanText(raw.eventName, 48);
  const site = cleanText(raw.site, 12);
  const targetType = cleanText(raw.targetType, 20);
  const route = cleanPath(raw.route, 220);
  const placement = cleanText(raw.placement, 80);

  if (!CONVERSION_EVENT_NAMES.has(eventName)) return { ok: false, error: "invalid_event_name" };
  if (!SITES.has(site)) return { ok: false, error: "invalid_site" };
  if (!TARGET_TYPES.has(targetType)) return { ok: false, error: "invalid_target_type" };
  if (!route.startsWith("/")) return { ok: false, error: "invalid_route" };
  if (!placement) return { ok: false, error: "missing_placement" };

  return {
    ok: true,
    event: {
      eventName,
      site,
      route,
      placement,
      targetType,
      targetPath: cleanPath(raw.targetPath, 220),
      ctaLabel: cleanText(raw.ctaLabel, 100),
      utmSource: cleanText(raw.utmSource, 80),
      utmMedium: cleanText(raw.utmMedium, 80),
      utmCampaign: cleanText(raw.utmCampaign, 120),
      country: cleanText(edge.country, 2).toUpperCase(),
      colo: cleanText(edge.colo, 8).toUpperCase(),
    },
  };
}
