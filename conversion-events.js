(function () {
  const endpoint = "/api/conversion-event";
  const canonical = document.querySelector('link[rel="canonical"]');
  const canonicalUrl = canonical ? new URL(canonical.href) : new URL(window.location.href);
  const site = canonicalUrl.hostname.startsWith("raiz.") ? "raiz" : "main";
  const route = canonicalUrl.pathname || "/";
  const params = new URLSearchParams(window.location.search);

  function placementFor(element) {
    const declared = element.closest("[data-conversion-placement]")?.getAttribute("data-conversion-placement");
    if (declared) return declared;
    const section = element.closest("section[id]");
    if (section?.id) return section.id;
    if (element.closest("header")) return "site_header";
    if (element.closest("footer")) return "site_footer";
    if (element.closest(".whatsapp-float")) return "floating_whatsapp";
    if (element.closest(".hero")) return "hero";
    if (element.closest(".cta-bridge, .final-cta, .final-inner")) return "final_cta";
    return "page";
  }

  function classify(link) {
    let target;
    try {
      target = new URL(link.href, window.location.href);
    } catch (_) {
      return null;
    }

    const host = target.hostname.toLowerCase();
    if (host === "wa.me" || host.endsWith(".whatsapp.com")) {
      return { eventName: "whatsapp_handoff", targetType: "whatsapp", targetPath: host };
    }
    if (host === "instagram.com" || host === "www.instagram.com") {
      return { eventName: "instagram_visit", targetType: "instagram", targetPath: `${host}${target.pathname}` };
    }
    if (host === "raiz.coachdeimagen.com" && canonicalUrl.hostname !== host) {
      return { eventName: "raiz_interest", targetType: "program", targetPath: `${host}${target.pathname}${target.hash}` };
    }
    if (host.endsWith("coachdeimagen.com") || host === window.location.hostname) {
      if (target.pathname === "/contacto" || target.pathname === "/contacto/") {
        return { eventName: "contact_intent", targetType: "contact", targetPath: target.pathname };
      }
      if (target.pathname.startsWith("/servicios-asesoria-de-imagen-coaching")) {
        return { eventName: "service_interest", targetType: "service", targetPath: target.pathname };
      }
    }
    return null;
  }

  function send(payload) {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      try {
        const accepted = navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
        if (accepted) return;
      } catch (_) {
        // Keepalive fetch below is the compatibility path.
      }
    }
    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      credentials: "same-origin",
      keepalive: true,
    }).catch(() => {});
  }

  function basePayload(element) {
    return {
      site,
      route,
      placement: placementFor(element),
      ctaLabel: (element.getAttribute("aria-label") || element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100),
      utmSource: params.get("utm_source") || "",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "",
    };
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const classification = classify(link);
    if (!classification) return;
    send({ ...basePayload(link), ...classification });
  }, { capture: true, passive: true });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.matches("[data-form], [data-contact-form]")) return;
    send({
      ...basePayload(form),
      eventName: "contact_form_attempt",
      targetType: "contact",
      targetPath: form.getAttribute("action") || "/contacto/",
      ctaLabel: "contact_form",
    });
  }, { capture: true });

  window.__coachDeImagenConversionEvents = {
    endpoint,
    eventNames: ["whatsapp_handoff", "instagram_visit", "contact_intent", "contact_form_attempt", "service_interest", "raiz_interest"],
  };
}());
