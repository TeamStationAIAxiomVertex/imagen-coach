import assert from "node:assert/strict";
import { normalizeConversionEvent } from "../lib/conversion-events.mjs";

const valid = normalizeConversionEvent({
  eventName: "whatsapp_handoff",
  site: "raiz",
  route: "/#inversion?ignored=yes",
  placement: "inversion",
  targetType: "whatsapp",
  targetPath: "wa.me/526646105348?text=private-message",
  ctaLabel: "Preguntar por La Raíz",
  utmSource: "instagram",
  name: "This field must not be retained",
  email: "private@example.com",
}, { country: "mx", colo: "gdl" });

assert.equal(valid.ok, true);
assert.equal(valid.event.route, "/#inversion");
assert.equal(valid.event.targetPath, "wa.me/526646105348");
assert.equal(valid.event.country, "MX");
assert.equal(valid.event.colo, "GDL");
assert.equal("name" in valid.event, false);
assert.equal("email" in valid.event, false);

assert.deepEqual(
  normalizeConversionEvent({ eventName: "page_view", site: "main", route: "/", placement: "page", targetType: "service" }),
  { ok: false, error: "invalid_event_name" },
);
assert.deepEqual(
  normalizeConversionEvent({ eventName: "service_interest", site: "main", route: "external", placement: "hero", targetType: "service" }),
  { ok: false, error: "invalid_route" },
);
assert.deepEqual(
  normalizeConversionEvent({ eventName: "service_interest", site: "main", route: "/", placement: "", targetType: "service" }),
  { ok: false, error: "missing_placement" },
);

console.log("Conversion event contract passed.");
