const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const form = document.querySelector("[data-form]");
const contactForm = document.querySelector("[data-contact-form]");
const whatsappNumber = "526646105348";

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
