const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const form = document.querySelector("[data-form]");
const contactForm = document.querySelector("[data-contact-form]");
const whatsappNumber = "526646105348";

const setFormStatus = (status, message, fallbackUrl = "") => {
  if (!status) return;
  status.textContent = message;
  if (!fallbackUrl) return;
  status.appendChild(document.createTextNode(" "));
  const link = document.createElement("a");
  link.href = fallbackUrl;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "Abrir WhatsApp";
  status.appendChild(link);
};

const buildWhatsappUrl = (payload = {}) => {
  const message = [
    "Hola Sonia, me interesa agendar un diagnóstico privado.",
    "",
    `Nombre: ${payload.name || ""}`,
    `Email: ${payload.email || ""}`,
    `Teléfono / WhatsApp: ${payload.phone || ""}`,
    `Ciudad: ${payload.city || ""}`,
    `País: ${payload.country || ""}`,
    `Interés: ${payload.service_interest || payload.service || ""}`,
    `Mensaje: ${payload.message || ""}`,
  ].join("\n");
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};

document.documentElement.classList.add("js-ready");

const syncHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".faq-answer-grid").forEach((grid) => {
  grid.addEventListener(
    "toggle",
    (event) => {
      const card = event.target;
      if (!(card instanceof HTMLDetailsElement) || !card.open) return;
      grid.querySelectorAll("details.faq-answer-card[open]").forEach((other) => {
        if (other !== card) other.open = false;
      });
    },
    true,
  );
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
  );

  document
    .querySelectorAll(".intent-card, .fit-card, .workflow-track li, .reading-path-card, .faq-answer-card, .footer-intelligence > *")
    .forEach((element) => revealObserver.observe(element));
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const status = form.querySelector(".form-status");
  const message = [
    "Hola Sonia, me interesa agendar un diagnóstico.",
    "",
    `Nombre: ${data.get("name") || ""}`,
    `Email: ${data.get("email") || ""}`,
    `Teléfono / WhatsApp: ${data.get("phone") || ""}`,
    `Tipo de servicio: ${data.get("service") || ""}`,
    `Persona o empresa: ${data.get("client_type") || ""}`,
    `¿Qué quiero trabajar?: ${data.get("message") || ""}`,
  ].join("\n");
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  setFormStatus(status, "Abriendo WhatsApp con tu diagnóstico listo para Sonia.");
  window.open(url, "_blank", "noopener");
});

if (contactForm) {
  const startedAt = contactForm.querySelector("[data-started-at]");
  if (startedAt) startedAt.value = String(Date.now());
  const params = new URLSearchParams(window.location.search);
  contactForm.querySelectorAll("[data-utm]").forEach((input) => {
    const key = input.getAttribute("data-utm");
    if (key) input.value = params.get(key) || "";
  });
}

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = contactForm.querySelector(".form-status");
  const submit = contactForm.querySelector('button[type="submit"]');
  const payload = Object.fromEntries(new FormData(contactForm).entries());
  payload.concierge_mode = Boolean(payload.concierge_mode);
  payload.source_page = window.location.pathname;
  const whatsappFallbackUrl = buildWhatsappUrl(payload);

  setFormStatus(status, "Enviando solicitud privada...");
  submit.disabled = true;

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (result.error === "contact_email_not_configured") {
        setFormStatus(
          status,
          "El envío privado está en configuración. Puedes enviar el mismo contexto por WhatsApp ahora.",
          whatsappFallbackUrl,
        );
        return;
      }
      if (result.error === "rate_limited") {
        setFormStatus(
          status,
          "Recibimos varias solicitudes en poco tiempo. Espera unos minutos o escribe por WhatsApp para contactar a Sonia.",
          whatsappFallbackUrl,
        );
        return;
      }
      throw new Error(result.error || "No se pudo enviar la solicitud.");
    }
    contactForm.reset();
    setFormStatus(status, "Solicitud enviada. Sonia recibirá tu contexto para responder con mayor precisión.");
  } catch (error) {
    setFormStatus(
      status,
      "No pudimos enviar el formulario en este momento. Puedes usar WhatsApp para contactar a Sonia directamente.",
      whatsappFallbackUrl,
    );
  } finally {
    submit.disabled = false;
  }
});

const registerAgentTools = () => {
  const modelContext = navigator.modelContext;
  if (!modelContext || (typeof modelContext.provideContext !== "function" && typeof modelContext.registerTool !== "function")) return;

  const origin = window.location.origin;
  const serviceRoutes = {
    asesoria_integral: "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/",
    presencia_profesional: "/servicios-asesoria-de-imagen-coaching/coaching-de-imagen/",
    talleres_empresas: "/servicios-asesoria-de-imagen-coaching/talleres/",
    seguridad_posicionamiento: "/servicios-asesoria-de-imagen-coaching/coaching-de-abundancia/",
    contacto: "/contacto/",
  };
  const publicationRoutes = {
    imagen_profesional: "/imagen-profesional/",
    presencia_ejecutiva: "/presencia-ejecutiva/",
    liderazgo: "/liderazgo/",
    comunicacion_no_verbal: "/comunicacion-no-verbal/",
    mentalidad: "/mentalidad/",
    empresarias: "/empresarias/",
    imagen_estrategica: "/imagen-estrategica/",
    publicaciones: "/imagen-presencia/",
  };

  const toAbsoluteUrl = (path) => `${origin}${path}`;
  const normalizeNeed = (value = "") => String(value).toLowerCase();
  const chooseRoute = ({ need = "", audience = "" } = {}) => {
    const normalized = normalizeNeed(`${need} ${audience}`);
    if (/empresa|equipo|taller|marca|colaborador|corporativa|organizacion|organización/.test(normalized)) return serviceRoutes.talleres_empresas;
    if (/seguridad|miedo|crecimiento|decisi|posicionamiento|sistema interno|autosabotaje|mentalidad/.test(normalized)) return serviceRoutes.seguridad_posicionamiento;
    if (/presencia|hablar|autoridad|liderazgo|visibilidad|confianza|comunicaci[oó]n/.test(normalized)) return serviceRoutes.presencia_profesional;
    if (/contact|diagn[oó]stico|agenda|whatsapp|cita/.test(normalized)) return serviceRoutes.contacto;
    return serviceRoutes.asesoria_integral;
  };
  const publicationRoute = ({ topic = "" } = {}) => {
    const normalized = normalizeNeed(topic);
    if (/presencia|ejecutiva|autoridad|confianza/.test(normalized)) return publicationRoutes.presencia_ejecutiva;
    if (/liderazgo|directiva|ceo|fundadora|decisi/.test(normalized)) return publicationRoutes.liderazgo;
    if (/comunicaci[oó]n|lenguaje|hablar|no verbal/.test(normalized)) return publicationRoutes.comunicacion_no_verbal;
    if (/mentalidad|seguridad|sistema nervioso|miedo|visibilidad/.test(normalized)) return publicationRoutes.mentalidad;
    if (/empresaria|mujer|fundadora|directora/.test(normalized)) return publicationRoutes.empresarias;
    if (/estrat[eé]gica|percepci[oó]n|posicionamiento|autoridad visual/.test(normalized)) return publicationRoutes.imagen_estrategica;
    if (/imagen|estilo|color|guardarropa|rostro|proporci[oó]n/.test(normalized)) return publicationRoutes.imagen_profesional;
    return publicationRoutes.publicaciones;
  };

  const controller = new AbortController();
  window.addEventListener("pagehide", () => controller.abort(), { once: true });
  const toolOptions = { signal: controller.signal };
  const shouldProvideContext = typeof modelContext.provideContext === "function";
  const providedTools = [];
  let contextHandle = null;
  const register = (tool) => {
    providedTools.push(tool);
    if (!shouldProvideContext && typeof modelContext.registerTool === "function") {
      return modelContext.registerTool(tool, toolOptions);
    }
    return undefined;
  };

  try {
    register({
      name: "coachdeimagen.choose_service_route",
      title: "Elegir ruta de servicio",
      description:
        "Recomienda la página pública más adecuada de Sonia McRorey según necesidad de imagen profesional, presencia, talleres, seguridad interna o diagnóstico.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          need: {
            type: "string",
            description: "Necesidad expresada por la persona: imagen, presencia, liderazgo, empresa, seguridad, posicionamiento o diagnóstico.",
          },
          audience: {
            type: "string",
            description: "Perfil opcional: empresaria, directivo, profesionista, equipo, marca personal o empresa.",
          },
        },
        required: ["need"],
      },
      execute: async (input = {}) => {
        const route = chooseRoute(input);
        return {
          route,
          url: toAbsoluteUrl(route),
          service_options: serviceRoutes,
          recommendation_basis: "Intención visible de coaching de imagen, presencia, posicionamiento profesional y contexto de audiencia.",
        };
      },
      annotations: { readOnlyHint: true },
    });

    register({
      name: "coachdeimagen.find_publication_context",
      title: "Encontrar contexto editorial",
      description:
        "Devuelve una ruta editorial o hub semántico para investigar temas de imagen profesional, presencia, liderazgo, comunicación, mentalidad o mujeres empresarias.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          topic: {
            type: "string",
            description: "Tema de búsqueda: imagen profesional, color, presencia ejecutiva, liderazgo, comunicación, seguridad interna o empresarias.",
          },
        },
        required: ["topic"],
      },
      execute: async (input = {}) => {
        const route = publicationRoute(input);
        return {
          route,
          url: toAbsoluteUrl(route),
          markdown_url: toAbsoluteUrl(route === "/" ? "/index.md" : `${route.replace(/\/$/, "")}.md`),
          related_index: toAbsoluteUrl("/agent/publications.json"),
        };
      },
      annotations: { readOnlyHint: true },
    });

    register({
      name: "coachdeimagen.get_contact_options",
      title: "Obtener opciones de contacto",
      description:
        "Devuelve las opciones públicas de contacto para diagnóstico privado con Sonia McRorey sin enviar datos ni modificar estado.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          message: {
            type: "string",
            description: "Contexto opcional para prellenar un mensaje de WhatsApp.",
          },
        },
      },
      execute: async ({ message = "" } = {}) => {
        const fallbackUrl = buildWhatsappUrl({ message });
        return {
          contact_page: toAbsoluteUrl(serviceRoutes.contacto),
          whatsapp_url: fallbackUrl,
          delivery_options: ["Presencial en Guadalajara", "Online para México y LATAM", "Conferencias y talleres para empresas"],
          note: "El formulario privado se envía desde /contacto/; esta herramienta solo devuelve opciones públicas.",
        };
      },
      annotations: { readOnlyHint: true },
    });

    register({
      name: "coachdeimagen.get_agent_resources",
      title: "Obtener recursos para agentes",
      description:
        "Devuelve archivos públicos de descubrimiento para agentes: OpenAPI, llms, índice semántico, servicios, publicaciones y contacto.",
      inputSchema: { type: "object", additionalProperties: false, properties: {} },
      execute: async () => ({
        openapi: toAbsoluteUrl("/openapi.json"),
        llms: toAbsoluteUrl("/llms.txt"),
        llms_full: toAbsoluteUrl("/llms-full.txt"),
        site_profile: toAbsoluteUrl("/agent/site-profile.json"),
        services: toAbsoluteUrl("/agent/services.json"),
        publications: toAbsoluteUrl("/agent/publications.json"),
        contact: toAbsoluteUrl("/agent/contact.json"),
        ontology: toAbsoluteUrl("/agent/ontology.json"),
      }),
      annotations: { readOnlyHint: true },
    });

    if (shouldProvideContext) {
      contextHandle = modelContext.provideContext({
        name: "coachdeimagen.browser-context",
        title: "Coach De Imagen Browser Tools",
        description:
          "Herramientas públicas de navegación, descubrimiento semántico y contacto para el sitio Coach De Imagen de Sonia McRorey.",
        tools: providedTools,
      });
      window.addEventListener(
        "pagehide",
        () => {
          if (contextHandle && typeof contextHandle.dispose === "function") contextHandle.dispose();
        },
        { once: true },
      );
    }

    window.__coachDeImagenWebMcpTools = [
      "coachdeimagen.choose_service_route",
      "coachdeimagen.find_publication_context",
      "coachdeimagen.get_contact_options",
      "coachdeimagen.get_agent_resources",
    ];
  } catch (error) {
    // Browsers without complete WebMCP support should continue as a static, fast site.
  }
};

registerAgentTools();
