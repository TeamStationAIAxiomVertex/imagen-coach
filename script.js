const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const form = document.querySelector("[data-form]");
const contactForm = document.querySelector("[data-contact-form]");
const whatsappNumber = "526646105348";

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

  status.textContent = "Abriendo WhatsApp con tu diagnóstico listo para Sonia.";
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

  status.textContent = "Enviando solicitud privada...";
  submit.disabled = true;

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "No se pudo enviar la solicitud.");
    contactForm.reset();
    status.textContent = "Solicitud enviada. Sonia recibirá tu contexto para responder con mayor precisión.";
  } catch (error) {
    status.textContent = "No pudimos enviar el formulario en este momento. Puedes usar WhatsApp para contactar a Sonia directamente.";
  } finally {
    submit.disabled = false;
  }
});

const registerAgentContext = () => {
  const modelContext = navigator.modelContext;
  if (!modelContext || typeof modelContext.provideContext !== "function") return;

  const serviceRoutes = {
    asesoria_integral: "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen/",
    presencia_profesional: "/servicios-asesoria-de-imagen-coaching/coaching-de-imagen/",
    talleres_empresas: "/servicios-asesoria-de-imagen-coaching/talleres/",
    seguridad_posicionamiento: "/servicios-asesoria-de-imagen-coaching/coaching-de-abundancia/",
    contacto: "/contacto/",
  };

  const chooseRoute = ({ need = "" } = {}) => {
    const normalized = String(need).toLowerCase();
    if (/empresa|equipo|taller|marca/.test(normalized)) return serviceRoutes.talleres_empresas;
    if (/seguridad|miedo|crecimiento|decisi|posicionamiento|sistema interno/.test(normalized)) return serviceRoutes.seguridad_posicionamiento;
    if (/presencia|hablar|autoridad|liderazgo|visibilidad/.test(normalized)) return serviceRoutes.presencia_profesional;
    if (/contact|diagn[oó]stico|agenda|whatsapp/.test(normalized)) return serviceRoutes.contacto;
    return serviceRoutes.asesoria_integral;
  };

  try {
    const result = modelContext.provideContext({
      name: "coach-de-imagen-sonia-mcrorey",
      description:
        "Contexto público para agentes sobre Sonia McRorey, Coach De Imagen en Guadalajara, México y LATAM: servicios, publicaciones, preguntas frecuentes y diagnóstico privado.",
      tools: [
        {
          name: "elegir_ruta_de_servicio",
          description:
            "Recomienda una ruta pública de Coach De Imagen según intención: imagen profesional, presencia ejecutiva, talleres, seguridad interna o contacto.",
          inputSchema: {
            type: "object",
            properties: {
              need: {
                type: "string",
                description: "Necesidad expresada por la persona: imagen, presencia, empresa, seguridad, liderazgo o diagnóstico.",
              },
            },
            required: ["need"],
          },
          execute: async (input) => {
            const path = chooseRoute(input);
            return {
              url: `${window.location.origin}${path}`,
              route: path,
              reason: "Ruta seleccionada con base en intención visible de coaching de imagen, presencia y posicionamiento profesional.",
            };
          },
        },
        {
          name: "abrir_diagnostico_privado",
          description: "Devuelve la URL del formulario privado de diagnóstico con Sonia McRorey.",
          inputSchema: { type: "object", properties: {} },
          execute: async () => ({
            url: `${window.location.origin}${serviceRoutes.contacto}`,
            route: serviceRoutes.contacto,
            reason: "La conversación inicial permite elegir modalidad presencial en Guadalajara, online para México y LATAM, o talleres para empresas.",
          }),
        },
      ],
      resources: [
        { name: "LLMs full", url: `${window.location.origin}/llms-full.txt`, type: "text/plain" },
        { name: "OpenAPI", url: `${window.location.origin}/openapi.json`, type: "application/openapi+json" },
        { name: "Semantic index", url: `${window.location.origin}/semantic-index.json`, type: "application/json" },
      ],
    });
    if (result?.catch) result.catch(() => {});
  } catch (error) {
    // Browsers without WebMCP support should continue as a static, fast site.
  }
};

registerAgentContext();
