import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "raiz");
const outputDir = path.join(root, "dist-raiz");
const assetsDir = path.join(outputDir, "assets");
const canonicalUrl = "https://raiz.coachdeimagen.com/";
const mainSiteUrl = "https://coachdeimagen.com";
const buildDate = new Date().toISOString().slice(0, 10);

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
const safeJson = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");
const whatsappUrl = (phone, message) => `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");
const money = (amount) => `$${new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  maximumFractionDigits: 2,
}).format(amount)}`;
const longDate = (value) => new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(`${value}T00:00:00Z`));

const answerCardGroups = [
  {
    id: "programa-alcance",
    name: "Programa, alcance y participación",
    description: "Definición, duración, recorrido, audiencia y preparación para La Raíz del Dinero.",
    intents: ["definicion_comercial", "elegibilidad", "duracion", "audiencia_inclusiva", "preparacion_programa", "estructura_programa", "incluye_programa"],
  },
  {
    id: "autoridad-evidencia",
    name: "Sonia McRorey, experiencia y fuentes",
    description: "Autoría, trayectoria profesional, afiliación, revisión editorial y fuentes públicas.",
    intents: ["perfil_autoridad", "credenciales_profesionales", "membresia_profesional", "verificacion_fuentes", "revision_editorial", "evidencia_resenas"],
  },
  {
    id: "modalidades-mercados",
    name: "Modalidades y mercados hispanohablantes",
    description: "Participación online, Guadalajara, idioma, horarios y elección de modalidad.",
    intents: ["modalidad_internacional", "modalidad_local", "idioma_servicio", "decision_modalidad", "confirmacion_horario"],
  },
  {
    id: "metodo-limites",
    name: "Método, temas y límites profesionales",
    description: "Identidad, visibilidad, límites, diferenciación y alcance profesional del coaching.",
    intents: ["diferenciacion", "limite_profesional", "explicacion_metodologica", "visibilidad_profesional", "limites_y_valor", "fundamento_aprendizaje"],
  },
  {
    id: "inversion-siguiente-paso",
    name: "Inversión, disponibilidad y contacto",
    description: "Precios publicados, opciones de pago, disponibilidad y conversación con Sonia.",
    intents: ["precio_comercial", "opciones_pago", "confirmacion_disponibilidad", "conversion"],
  },
];

function groupForCard(card) {
  return answerCardGroups.find((group) => group.intents.includes(card.intent)) || answerCardGroups[0];
}

function sourceIdsForCard(card) {
  if (!card.sourceIds?.length) {
    throw new Error(`Answer card ${card.id} has no explicit governed sourceIds.`);
  }
  return card.sourceIds;
}

function enrichedCards(program) {
  return program.answerCards.map((card) => ({
    ...card,
    ontologyGroup: groupForCard(card).id,
    evidenceSourceIds: sourceIdsForCard(card),
    canonicalSource: canonicalUrl,
    lastReviewed: program.authority.lastReviewed,
  }));
}

function cardGroupIndex(program, cards) {
  return {
    name: "La Raíz · índice de tarjetas de respuesta",
    canonicalUrl: `${canonicalUrl}api/knowledge/cards/index.json`,
    language: program.language,
    cardCount: cards.length,
    lastReviewed: program.authority.lastReviewed,
    evidence: `${canonicalUrl}agent/evidence.json`,
    routes: `${canonicalUrl}agent/route-recommendations.json`,
    groups: answerCardGroups.map((group) => {
      const groupCards = cards.filter((card) => card.ontologyGroup === group.id);
      return {
        id: group.id,
        name: group.name,
        description: group.description,
        cardCount: groupCards.length,
        cardIds: groupCards.map((card) => card.id),
        url: `${canonicalUrl}api/knowledge/cards/groups/${group.id}.json`,
      };
    }),
  };
}

const promotionIsActive = (promotion) => (
  (!promotion.validFrom || promotion.validFrom <= buildDate)
  && (!promotion.validThrough || buildDate <= promotion.validThrough)
);
const promotionOptions = (modality, promotion) => {
  if (!promotion) return modality.regular;
  if (Array.isArray(promotion.options)) return promotion.options;
  if (!promotion.discountPercent) return modality.regular;
  return modality.regular.map((item) => ({
    ...item,
    amount: Number((item.amount * (1 - promotion.discountPercent / 100)).toFixed(2)),
  }));
};

function pricingRows(modality, promotion) {
  const options = promotionOptions(modality, promotion).filter((option) => option.label !== "Pago único");
  return options.map((option) => {
    const regular = modality.regular.find((item) => item.label === option.label);
    return `<div class="price-row">
      <div>
        <span>${escapeHtml(option.label)}</span>
        ${promotion && regular ? `<s>Regular: ${money(regular.amount)} MXN cada pago</s>` : ""}
      </div>
      <div class="price-row-value">
        <strong>${money(option.amount)} <small>MXN cada pago</small></strong>
        <span class="fx-estimate" data-fx-price data-mxn-amount="${escapeHtml(option.amount)}" aria-hidden="true"></span>
      </div>
    </div>`;
  }).join("");
}

function pricingSection(program, onlineUrl, semipresencialUrl) {
  const pricingById = new Map(program.pricing.modalities.map((item) => [item.id, item]));
  const cards = program.modalities.map((modality) => {
    const pricing = pricingById.get(modality.id);
    const promotion = pricing.promotions.find(promotionIsActive);
    const scheduled = pricing.promotions.filter((item) => item.validFrom && item.validFrom > buildDate);
    const ctaUrl = modality.id === "online" ? onlineUrl : semipresencialUrl;
    const primary = promotionOptions(pricing, promotion).find((item) => item.label === "Pago único");
    const regularPrimary = pricing.regular.find((item) => item.label === "Pago único");
    return `<article class="pricing-card ${modality.id === "semipresencial" ? "pricing-featured" : ""}">
      <div class="pricing-card-head">
        <p class="mini-label">${escapeHtml(pricing.name)}</p>
        <h3>${escapeHtml(modality.sessions)}</h3>
        ${promotion ? `<p class="pricing-badge">${escapeHtml(promotion.label)} · vigente hasta ${escapeHtml(longDate(promotion.validThrough))}</p>` : `<p class="pricing-badge pricing-badge-regular">Precio regular vigente</p>`}
      </div>
      <div class="price-primary">
        <span>Pago único</span>
        <strong>${money(primary.amount)}</strong>
        <small>MXN · pesos mexicanos</small>
        ${promotion ? `<s>Precio regular: ${money(regularPrimary.amount)} MXN</s>` : ""}
        <em class="fx-estimate fx-estimate-primary" data-fx-price data-mxn-amount="${escapeHtml(primary.amount)}" aria-hidden="true"></em>
      </div>
      <div class="payment-options">
        <p>También puedes pagar en parcialidades</p>
        <div class="price-list">${pricingRows(pricing, promotion)}</div>
      </div>
      ${scheduled.map((item) => `<p class="pricing-schedule">Del ${escapeHtml(longDate(item.validFrom))} al ${escapeHtml(longDate(item.validThrough))}: ${escapeHtml(item.label)}.</p>`).join("")}
      <a class="button ${modality.id === "online" ? "button-primary" : "button-green"}" href="${escapeHtml(ctaUrl)}" target="_blank" rel="noopener">Elegir ${escapeHtml(pricing.name)}</a>
    </article>`;
  }).join("");
  return `<section id="inversion" class="band pricing-band" aria-labelledby="inversion-titulo">
    <div class="section band-inner">
      <div class="section-heading centered">
        <p class="eyebrow">Inversión</p>
        <h2 id="inversion-titulo">Elige la modalidad que puedes sostener.</h2>
        <p>Inversión de la edición de ${escapeHtml(program.pricing.edition)} en pesos mexicanos (MXN); convierte desde tu moneda local.</p>
        <div class="currency-toolbar" aria-label="Selector de moneda aproximada">
          <label for="currency-selector">Ver aproximado en</label>
          <select id="currency-selector" data-currency-selector aria-describedby="currency-disclaimer">
            <option value="MXN">🇲🇽 MXN</option>
          </select>
          <span class="exchange-rate-badge" data-fx-rate-badge hidden></span>
        </div>
      </div>
      <div class="pricing-grid">${cards}</div>
      <div id="currency-disclaimer" class="pricing-note">
        <p>El precio oficial y el cobro se realizan en pesos mexicanos (MXN).</p>
        <p>La conversión mostrada es aproximada y puede variar según el tipo de cambio de tu banco o proveedor de pago.</p>
        <p lang="en">Official pricing and payment are in Mexican Pesos (MXN). The displayed conversion is an estimate based on today's exchange rate. Your bank or payment provider may use a different rate.</p>
      </div>
    </div>
  </section>`;
}

function pricingMarkdown(program) {
  return program.pricing.modalities.map((modality) => {
    const regular = modality.regular.map((item) => `- ${item.label}: ${money(item.amount)} ${program.pricing.currency}${item.installments ? " cada pago" : ""}`).join("\n");
    const promotions = modality.promotions.map((promotion) => {
      const dates = promotion.validFrom
        ? `${longDate(promotion.validFrom)} a ${longDate(promotion.validThrough)}`
        : `hasta ${longDate(promotion.validThrough)}`;
      const options = promotionOptions(modality, promotion).map((item) => `  - ${item.label}: ${money(item.amount)} ${program.pricing.currency}${item.installments ? " cada pago" : ""}`).join("\n");
      return `- ${promotion.label} (${dates})${options ? `\n${options}` : ""}`;
    }).join("\n");
    return `### ${modality.name}\n\nPrecios regulares:\n\n${regular}\n\nPromociones publicadas:\n\n${promotions}`;
  }).join("\n\n");
}

function trustSection(program) {
  const biography = program.authority.publicSources.find((source) => source.id === "sonia-biografia");
  const method = program.authority.publicSources.find((source) => source.id === "metodo-sonia");
  const security = program.authority.publicSources.find((source) => source.id === "seguridad-profesional");
  return `<section id="criterio-profesional" class="section trust-section" aria-labelledby="criterio-titulo">
    <div class="section-heading centered">
      <p class="eyebrow">Autoría y criterio profesional</p>
      <h2 id="criterio-titulo">Experiencia verificable y límites claros.</h2>
      <p>Contenido creado y revisado por Sonia McRorey para ayudar a personas hispanohablantes a entender el programa antes de elegir.</p>
    </div>
    <div class="trust-grid">
      <article>
        <p class="mini-label">Quién responde</p>
        <h3>${escapeHtml(program.authority.author.name)}</h3>
        <p>${escapeHtml(program.authority.author.role)} con ${escapeHtml(program.authority.author.experienceLabel.toLowerCase())}.</p>
        <a class="text-link" href="${escapeHtml(biography.url)}">Ver trayectoria y formación →</a>
      </article>
      <article>
        <p class="mini-label">Experiencia profesional</p>
        <h3>AICI y formación internacional</h3>
        <p>Vicepresidenta y VP de Educación de AICI Guadalajara, 2024-2026, con formación en imagen en Argentina, Uruguay, México y España.</p>
        <a class="text-link" href="${escapeHtml(method.url)}">Conocer el método de Sonia →</a>
      </article>
      <article>
        <p class="mini-label">Alcance responsable</p>
        <h3>Coaching con fronteras claras</h3>
        <p>No es terapia ni asesoría financiera. No promete ingresos o resultados iguales. Las fechas y precios actuales se confirman con Sonia.</p>
        <a class="text-link" href="${escapeHtml(security.url)}">Entender seguridad profesional →</a>
      </article>
    </div>
    <p class="review-note">Última revisión editorial: <time datetime="${escapeHtml(program.authority.lastReviewed)}">${escapeHtml(longDate(program.authority.lastReviewed))}</time>. Fuentes públicas y criterios de respuesta disponibles para personas y agentes.</p>
  </section>`;
}

function testimonialSection(program) {
  const cards = program.testimonials.map((testimonial) => `<blockquote id="testimonio-${escapeHtml(testimonial.id)}" class="testimonial-card">
    <div class="testimonial-card-head">
      <span class="testimonial-number" aria-hidden="true">${escapeHtml(testimonial.number)}</span>
      <p class="mini-label">${escapeHtml(testimonial.theme)}</p>
    </div>
    <p class="testimonial-quote">“${escapeHtml(testimonial.quote)}”</p>
    ${testimonial.highlight ? `<p class="testimonial-highlight">${escapeHtml(testimonial.highlight)}</p>` : ""}
    <footer>
      <strong>${escapeHtml(testimonial.name)}</strong>
      <span>${escapeHtml(testimonial.role)}</span>
    </footer>
  </blockquote>`).join("");
  return `<section class="section testimonials" aria-labelledby="testimonios-titulo">
    <div class="section-heading centered">
      <p class="eyebrow">Testimonios</p>
      <h2 id="testimonios-titulo">En sus propias palabras.</h2>
      <p>Experiencias elegidas por Sonia para esta presentación de La Raíz del Dinero. Cada proceso es personal y no garantiza resultados iguales.</p>
    </div>
    <div class="testimonial-grid">${cards}</div>
  </section>`;
}

function googleReviewsSection(program) {
  const proof = program.googleReviews;
  const cards = proof.excerpts.map((review) => `<blockquote id="resena-google-${escapeHtml(review.id)}" class="google-review-card">
    <div class="google-review-card-head">
      <span class="google-stars" aria-label="${escapeHtml(review.rating)} de 5 estrellas">★★★★★</span>
      <span>Reseña de Google</span>
    </div>
    <p>“${escapeHtml(review.quote)}”</p>
    <footer>
      <strong>${escapeHtml(review.name)}</strong>
      <span>${escapeHtml(review.context)}</span>
    </footer>
  </blockquote>`).join("");
  return `<section id="resenas-google" class="band google-review-proof" aria-labelledby="resenas-google-titulo">
    <div class="section google-review-layout">
      <div class="google-score-panel">
        <p class="eyebrow">Reputación pública verificada</p>
        <div class="google-score" aria-label="${escapeHtml(proof.rating)} de 5 en ${escapeHtml(proof.reviewCount)} reseñas de Google">
          <strong>${escapeHtml(proof.rating.toFixed(1))}</strong>
          <div><span class="google-stars" aria-hidden="true">★★★★★</span><p>${escapeHtml(proof.reviewCount)} reseñas en Google</p></div>
        </div>
        <h2 id="resenas-google-titulo">Lo que clientes de Sonia publicaron en Google.</h2>
        <p>${escapeHtml(proof.scopeNote)}</p>
        <a class="button button-outline" href="${escapeHtml(proof.url)}" target="_blank" rel="noopener external">Ver el perfil y las reseñas en Google</a>
        <small>Calificación verificada el <time datetime="${escapeHtml(proof.verifiedOn)}">${escapeHtml(longDate(proof.verifiedOn))}</time>.</small>
      </div>
      <div class="google-review-excerpts">
        <p class="google-review-context">${escapeHtml(proof.programRelevanceNote)}</p>
        <div class="google-review-grid">${cards}</div>
        <p class="google-review-boundary">Las reseñas describen experiencias personales. No prometen ingresos, resultados de salud ni cambios iguales para todas las personas.</p>
      </div>
    </div>
  </section>`;
}

function learningDesignSection(program) {
  const sources = new Map(program.authority.publicSources.map((source) => [source.id, source]));
  const principles = program.learningDesign.principles.map((principle) => {
    const sourceLinks = principle.sourceIds.map((sourceId) => {
      const source = sources.get(sourceId);
      if (!source) return "";
      return `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.name)}</a>`;
    }).filter(Boolean).join(" · ");
    return `<li id="principio-${escapeHtml(principle.id)}">
      <span aria-hidden="true">${escapeHtml(principle.number)}</span>
      <div>
        <h3>${escapeHtml(principle.title)}</h3>
        <p>${escapeHtml(principle.description)}</p>
        <p class="research-source">Referencia: ${sourceLinks}</p>
      </div>
    </li>`;
  }).join("");
  return `<section id="por-que-dura" class="band band-soft learning-design" aria-labelledby="duracion-diseno-titulo">
    <div class="section learning-design-layout">
      <div class="learning-design-intro">
        <p class="eyebrow">${escapeHtml(program.learningDesign.eyebrow)}</p>
        <h2 id="duracion-diseno-titulo">${escapeHtml(program.learningDesign.title)}</h2>
        <p>${escapeHtml(program.learningDesign.introduction)}</p>
        <aside>${escapeHtml(program.learningDesign.durationRationale)}</aside>
      </div>
      <div>
        <ol class="learning-principles">${principles}</ol>
        <p class="learning-boundary">${escapeHtml(program.learningDesign.boundary)}</p>
      </div>
    </div>
  </section>`;
}

function journeySection(program) {
  const items = program.journey.map((item) => `<li${item.id === "bonus-sistema-nervioso" ? ' class="journey-final"' : ""} id="recorrido-${escapeHtml(item.id)}">
    <span>${escapeHtml(item.number)}</span>
    <div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
    </div>
  </li>`).join("");

  return `<section id="recorrido" class="section" aria-labelledby="recorrido-titulo">
    <div class="section-heading centered">
      <p class="eyebrow">El recorrido</p>
      <h2 id="recorrido-titulo">8 sesiones en vivo + 1 de bonus.</h2>
    </div>
    <aside class="plain-statement">${escapeHtml(program.learningDesign.durationRationale)}</aside>
    <ol class="journey-grid">${items}</ol>
  </section>`;
}

function faqSection(program) {
  const items = program.faqs.map((faq, index) => `<details${index === 0 ? " open" : ""}>
    <summary>${escapeHtml(faq.question)}<span aria-hidden="true">+</span></summary>
    <p>${escapeHtml(faq.answer)}</p>
  </details>`).join("");

  return `<section id="preguntas" class="band band-soft" aria-labelledby="faq-titulo">
    <div class="section band-inner faq-layout">
      <div class="section-heading faq-heading">
        <p class="eyebrow">Preguntas frecuentes</p>
        <h2 id="faq-titulo">Respuestas claras antes de elegir.</h2>
        <p>Si tu pregunta no aparece aquí, el WhatsApp abre una conversación directa con Sonia.</p>
      </div>
      <div class="faq-list">${items}</div>
    </div>
  </section>`;
}

function includedSection(program) {
  const items = program.included.map((item) => `<li id="incluye-${escapeHtml(item.id)}">
    <span aria-hidden="true">${escapeHtml(item.number)}</span>
    <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></div>
  </li>`).join("");
  return `<section id="incluye" class="band band-green included-band" aria-labelledby="incluye-titulo">
    <div class="section included-layout">
      <div class="section-heading light-heading">
        <p class="eyebrow">Tu inscripción</p>
        <h2 id="incluye-titulo">Qué incluye La Raíz.</h2>
        <p>9 sesiones en vivo. WhatsApp exclusivo. Material digital.</p>
      </div>
      <ol class="included-list">${items}</ol>
    </div>
  </section>`;
}

function authorityMarkdown(program) {
  const credentials = program.authority.credentials
    .map((credential) => `- ${credential.name} · ${credential.organization}${credential.period ? ` (${credential.period})` : credential.year ? ` (${credential.year})` : ""}${credential.country ? ` · ${credential.country}` : ""}`)
    .join("\n");
  const sources = program.authority.publicSources
    .map((source) => `- [${source.name}](${source.url}): ${source.supports.join(", ")}.`)
    .join("\n");
  const boundaries = program.authority.boundaries.map((item) => `- ${item}`).join("\n");
  return `## Autoría, experiencia y revisión

- Autora y facilitadora: ${program.authority.author.name}
- Rol: ${program.authority.author.role}
- Experiencia: ${program.authority.author.experienceLabel}
- Última revisión editorial: ${program.authority.lastReviewed}
- Reputación pública: ${program.googleReviews.rating.toFixed(1)} de 5 con ${program.googleReviews.reviewCount} reseñas en Google, verificada el ${program.googleReviews.verifiedOn}
- Propósito: ${program.authority.editorialPurpose}

### Trayectoria pública

${credentials}

### Fuentes públicas

${sources}

### Límites profesionales

${boundaries}`;
}

function includedMarkdown(program) {
  return `## Qué incluye la inscripción

${program.included.map((item) => `- **${item.title}:** ${item.description}\n  - Modo: ${item.contentMode}\n  - Referencia: ${item.sourceReference}\n  - Fuentes: ${item.sourceIds.join(", ")}`).join("\n")}`;
}

function learningDesignMarkdown(program) {
  const sources = new Map(program.authority.publicSources.map((source) => [source.id, source]));
  const principles = program.learningDesign.principles.map((principle) => {
    const references = principle.sourceIds.map((sourceId) => {
      const source = sources.get(sourceId);
      return source ? `[${source.name}](${source.url})` : sourceId;
    }).join(", ");
    return `### ${principle.number} · ${principle.title}\n\n${principle.description}\n\nModo: ${principle.contentMode}.\nReferencia: ${principle.sourceReference}.\nFuentes: ${references}.`;
  }).join("\n\n");
  return `## ${program.learningDesign.title}

${program.learningDesign.introduction}

${principles}

**Por qué se distribuye semana a semana:** ${program.learningDesign.durationRationale}

**Cierre textual de Sonia:** ${program.learningDesign.boundary}`;
}

function soniaLearningSourceMarkdown(program) {
  const source = program.authority.publicSources.find(
    (item) => item.id === "sonia-neurociencia-dinero-repeticion",
  );
  const principles = program.learningDesign.principles
    .filter((principle) => principle.sourceIds.includes(source.id))
    .map((principle) => `> ${principle.description}`)
    .join("\n\n");

  return `# Sonia McRorey: repetición, práctica y curiosidad

Fuente canónica pública: ${source.url}
Autora: Sonia McRorey
Modo de publicación: fragmentos textuales aprobados, sin paráfrasis editorial
Última revisión: ${program.authority.lastReviewed}

> ${program.learningDesign.introduction}

${principles}

> ${program.learningDesign.boundary}

## Explicación textual del recorrido de La Raíz

> ${program.learningDesign.durationRationale}
`;
}

function testimonialsMarkdown(program) {
  return program.testimonials.map((testimonial) => `### ${testimonial.number} · ${testimonial.theme}

> ${testimonial.quote}

${testimonial.highlight ? `**${testimonial.highlight}**\n` : ""}

${testimonial.name} · ${testimonial.role}`).join("\n\n");
}

function googleReviewsMarkdown(program) {
  const proof = program.googleReviews;
  const excerpts = proof.excerpts
    .map((review) => `- “${review.quote}” — ${review.name}, ${review.context}, ${review.rating}/5.`)
    .join("\n");
  return `## Reseñas verificadas en Google

- Perfil: [${proof.profileName}](${proof.url})
- Calificación observada: ${proof.rating.toFixed(1)} de 5
- Reseñas observadas: ${proof.reviewCount}
- Fecha de verificación: ${proof.verifiedOn}
- Alcance: ${proof.scopeNote}

${proof.programRelevanceNote}

${excerpts}

Estas reseñas describen experiencias personales y no constituyen una garantía de resultados.`;
}

function evidenceDocument(program) {
  return {
    name: "La Raíz · evidencia, autoría y límites",
    canonicalUrl: `${canonicalUrl}agent/evidence.json`,
    language: program.language,
    author: program.authority.author,
    lastReviewed: program.authority.lastReviewed,
    editorialPurpose: program.authority.editorialPurpose,
    credentials: program.authority.credentials,
    publicSources: program.authority.publicSources,
    boundaries: program.authority.boundaries,
    includedInProgram: program.included,
    learningDesign: program.learningDesign,
    googleReviewProof: program.googleReviews,
    participantTestimonials: program.testimonials.map((testimonial) => ({
      ...testimonial,
      evidenceType: "participant-reported-experience",
      source: `${canonicalUrl}#testimonio-${testimonial.id}`,
    })),
    evidencePolicy: [
      "Responder con hechos publicados y enlazar la fuente pública correspondiente.",
      "No convertir una observación de coaching en diagnóstico médico, psicológico o financiero.",
      "No extrapolar fechas, precios, cupos, testimonios o credenciales a partir de información no publicada.",
      "Conservar completos y sin reescritura los testimonios seleccionados por Sonia; presentarlos como experiencias personales, nunca como resultados generales.",
      "Presentar la calificación de Google con su fecha de verificación y aclarar que corresponde a la práctica profesional general de Sonia, no exclusivamente a La Raíz.",
      "No convertir una reseña pública en garantía médica, emocional o financiera ni atribuir al programa resultados que la fuente no demuestra.",
      "Presentar las referencias de aprendizaje y memoria como fundamento educativo del diseño, nunca como diagnóstico, tratamiento o plazo universal de cambio.",
      "Cuando la información comercial pueda cambiar, orientar a la confirmación directa por WhatsApp.",
    ],
  };
}

function routeRecommendations(cards) {
  const cardIds = (groupId) => cards
    .filter((card) => card.ontologyGroup === groupId)
    .map((card) => card.id);
  return {
    name: "La Raíz · tarjetas recomendadas por sección",
    canonicalUrl: `${canonicalUrl}agent/route-recommendations.json`,
    route: canonicalUrl,
    language: "es-MX",
    recommendations: [
      {
        section: "programa",
        url: `${canonicalUrl}#que-es`,
        preferredGroups: ["programa-alcance", "metodo-limites"],
        preferredCardIds: [...cardIds("programa-alcance"), "la-raiz-no-finanzas", "la-raiz-no-terapia"],
      },
      {
        section: "duracion-y-diseno",
        url: `${canonicalUrl}#por-que-dura`,
        preferredGroups: ["programa-alcance", "metodo-limites"],
        preferredCardIds: ["la-raiz-nueve-semanas", "por-que-dura-la-raiz", "curiosidad-aprendizaje-la-raiz"],
      },
      {
        section: "que-incluye",
        url: `${canonicalUrl}#incluye`,
        preferredGroups: ["programa-alcance"],
        preferredCardIds: ["que-incluye-la-raiz", "estructura-semanal-la-raiz", "la-raiz-bonus-sistema-nervioso"],
      },
      {
        section: "modalidades",
        url: `${canonicalUrl}#modalidades`,
        preferredGroups: ["modalidades-mercados"],
        preferredCardIds: cardIds("modalidades-mercados"),
      },
      {
        section: "inversion",
        url: `${canonicalUrl}#inversion`,
        preferredGroups: ["inversion-siguiente-paso"],
        preferredCardIds: cardIds("inversion-siguiente-paso"),
      },
      {
        section: "sonia",
        url: `${canonicalUrl}#sonia`,
        preferredGroups: ["autoridad-evidencia"],
        preferredCardIds: cardIds("autoridad-evidencia"),
      },
      {
        section: "resenas-google",
        url: `${canonicalUrl}#resenas-google`,
        preferredGroups: ["autoridad-evidencia"],
        preferredCardIds: ["google-reviews-sonia-mcrorey", "resenas-google-circulos-abundancia"],
      },
      {
        section: "preguntas",
        url: `${canonicalUrl}#preguntas`,
        preferredGroups: answerCardGroups.map((group) => group.id),
        preferredCardIds: cards.map((card) => card.id),
      },
    ],
    handoff: {
      channel: "WhatsApp",
      url: canonicalUrl,
      useWhen: ["horario actual", "cupo actual", "precio aplicable", "situación personal no publicada"],
    },
  };
}

function schemaOffer(program, modalityId) {
  const modality = program.pricing.modalities.find((item) => item.id === modalityId);
  const promotion = modality.promotions.find(promotionIsActive);
  const payment = promotionOptions(modality, promotion).find((item) => item.label === "Pago único");
  return {
    "@type": "Offer",
    url: `${canonicalUrl}#inversion`,
    price: String(payment.amount),
    priceCurrency: program.pricing.currency,
    ...(promotion?.validThrough ? { priceValidUntil: promotion.validThrough } : {}),
    availability: "https://schema.org/InStock",
    category: promotion?.label || "Precio regular",
  };
}

async function optimizePortrait(source, basename, width, height) {
  const pipeline = sharp(source).rotate().resize(width, height, {
    fit: "cover",
    position: "attention",
  });
  await Promise.all([
    pipeline.clone().avif({ quality: 64, effort: 5 }).toFile(path.join(assetsDir, `${basename}.avif`)),
    pipeline.clone().webp({ quality: 78, effort: 5 }).toFile(path.join(assetsDir, `${basename}.webp`)),
    pipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(assetsDir, `${basename}.jpg`)),
  ]);
}

async function buildSocialCard() {
  const photo = await sharp(path.join(root, "assets/sonia-mcrorey-latina-leadership-color.jpg"))
    .rotate()
    .resize(500, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  const icon = await sharp(path.join(root, "assets/sonia-icon.svg"))
    .resize(38, 38, { fit: "contain" })
    .png()
    .toBuffer();
  const logo = await sharp(path.join(root, "assets/sonia-logo-ai.png"))
    .resize({ width: 230, withoutEnlargement: true })
    .png()
    .toBuffer();
  const cardBase = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#24152b"/>
  </svg>`);
  const portraitBlend = Buffer.from(`<svg width="170" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blend" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#24152b" stop-opacity="1" />
        <stop offset="0.72" stop-color="#24152b" stop-opacity="0.32" />
        <stop offset="1" stop-color="#24152b" stop-opacity="0" />
      </linearGradient>
    </defs>
    <rect width="170" height="630" fill="url(#blend)" />
  </svg>`);
  const textLayer = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <circle cx="88" cy="72" r="28" fill="#f8f6f9"/>
    <text x="132" y="67" fill="#dfc9e4" font-family="Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="2.6">PROGRAMA EN VIVO · SONIA MCROREY</text>
    <text x="72" y="190" fill="#ffffff" font-family="Georgia, serif" font-size="86" font-weight="500">La Raíz</text>
    <text x="72" y="270" fill="#c985d5" font-family="Georgia, serif" font-size="72" font-style="italic">del Dinero</text>
    <text x="72" y="322" fill="#f3edf4" font-family="Arial, sans-serif" font-size="23">La raíz desde la que generas, recibes</text>
    <text x="72" y="354" fill="#f3edf4" font-family="Arial, sans-serif" font-size="23">y sostienes valor.</text>
    <line x1="72" y1="382" x2="642" y2="382" stroke="#8c4799" stroke-width="1"/>
    <rect x="72" y="407" width="260" height="48" rx="4" fill="#35203e" stroke="#8c4799" stroke-width="1"/>
    <text x="202" y="438" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.2">8 SESIONES + 1 BONUS</text>
    <rect x="344" y="407" width="298" height="48" rx="4" fill="#35203e" stroke="#8c4799" stroke-width="1"/>
    <text x="493" y="438" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="1.2">ONLINE · GUADALAJARA</text>
    <rect x="72" y="486" width="290" height="72" rx="4" fill="#f8f6f9"/>
    <text x="390" y="532" fill="#dfc9e4" font-family="Arial, sans-serif" font-size="18" font-weight="700" letter-spacing="1.4">RAIZ.COACHDEIMAGEN.COM</text>
  </svg>`);
  const socialCard = await sharp(cardBase)
    .composite([
      { input: photo, left: 700, top: 0 },
      { input: portraitBlend, left: 665, top: 0 },
      { input: textLayer, left: 0, top: 0 },
      { input: icon, left: 69, top: 53 },
      { input: logo, left: 102, top: 500 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
  await Promise.all([
    writeFile(path.join(assetsDir, "social/la-raiz-programa-sonia-mcrorey.png"), socialCard),
    writeFile(path.join(assetsDir, "social/la-raiz-programa-sonia-mcrorey-v2.png"), socialCard),
  ]);
}

function schemaStack(program) {
  const organizationId = `${mainSiteUrl}/#organization`;
  const personId = `${mainSiteUrl}/#sonia-mcrorey`;
  const courseId = `${canonicalUrl}#course`;
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: "Coach De Imagen",
    url: `${mainSiteUrl}/`,
    logo: `${mainSiteUrl}/assets/sonia-logo-ai.png`,
    founder: { "@id": personId },
  };
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: "Sonia McRorey",
    url: `${mainSiteUrl}/sobre-sonia-mcrorey-asesora-de-imagen/`,
    image: `${canonicalUrl}assets/sonia-la-raiz-about-720.jpg`,
    jobTitle: "Coach de Imagen, Presencia y Posicionamiento Profesional",
    description: `${program.authority.author.experienceLabel}. Facilitadora y autora del programa La Raíz del Dinero.`,
    worksFor: { "@id": organizationId },
    memberOf: {
      "@type": "Organization",
      name: "AICI Guadalajara",
    },
    knowsLanguage: {
      "@type": "Language",
      name: "Español",
      alternateName: "es",
    },
    hasCredential: program.authority.credentials
      .filter((credential) => credential.type === "formación profesional")
      .map((credential) => ({
        "@type": "EducationalOccupationalCredential",
        name: `${credential.name} · ${credential.organization}`,
        credentialCategory: credential.type,
        recognizedBy: { "@type": "Organization", name: credential.organization },
      })),
    knowsAbout: [
      "Coaching de imagen",
      "Identidad profesional",
      "Presencia profesional",
      "Visibilidad",
      "Comunicación de valor",
      "Seguridad profesional",
    ],
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${canonicalUrl}#website`,
    name: "La Raíz del Dinero · Sonia McRorey",
    url: canonicalUrl,
    inLanguage: "es-MX",
    publisher: { "@id": organizationId },
  };
  const course = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": courseId,
    name: program.name,
    description: program.description,
    url: canonicalUrl,
    inLanguage: program.language,
    availableLanguage: "Español",
    provider: { "@id": personId },
    timeRequired: program.duration,
    educationalLevel: "Personas adultas",
    coursePrerequisites: "Ser una persona adulta, participar en español y tener disposición para observar y practicar durante las 8 sesiones en vivo y la sesión bonus.",
    audience: { "@type": "Audience", audienceType: program.audience },
    teaches: [
      "Observar la raíz desde la que se genera, recibe y sostiene valor",
      "Comunicar valor con mayor claridad",
      "Practicar límites y capacidad de recibir",
      "Trabajar merecimiento, visibilidad, cuerpo y decisiones",
    ],
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        name: "La Raíz · modalidad online en vivo",
        startDate: program.modalities[0].startDate,
        courseMode: "Online",
        location: { "@type": "VirtualLocation", url: canonicalUrl },
        instructor: { "@id": personId },
        offers: schemaOffer(program, "online"),
      },
      {
        "@type": "CourseInstance",
        name: "La Raíz · modalidad semipresencial en Guadalajara",
        startDate: program.modalities[1].startDate,
        courseMode: "Blended",
        location: {
          "@type": "Place",
          name: "Casa Copal",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Guadalajara",
            addressRegion: "Jalisco",
            addressCountry: "MX",
          },
        },
        instructor: { "@id": personId },
        offers: schemaOffer(program, "semipresencial"),
      },
    ],
  };
  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonicalUrl,
    name: "La Raíz del Dinero: generar, recibir y sostener valor",
    description: program.description,
    url: canonicalUrl,
    inLanguage: program.language,
    dateModified: program.authority.lastReviewed,
    author: { "@id": personId },
    reviewedBy: { "@id": personId },
    publisher: { "@id": organizationId },
    isPartOf: { "@id": `${canonicalUrl}#website` },
    about: { "@id": courseId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${canonicalUrl}assets/sonia-la-raiz-hero-960.jpg`,
      width: 960,
      height: 1440,
      caption: "Sonia McRorey, facilitadora de La Raíz",
    },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Coach De Imagen", item: `${mainSiteUrl}/` },
      { "@type": "ListItem", position: 2, name: "La Raíz", item: canonicalUrl },
    ],
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: program.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return [organization, person, website, webpage, course, breadcrumb, faq]
    .map((entry) => `<script type="application/ld+json">${safeJson(entry)}</script>`)
    .join("\n  ");
}

function llmsSummary(program) {
  return `# La Raíz del Dinero · Sonia McRorey

> 8 sesiones para trabajar la raíz desde la que generas, recibes y sostienes valor.

- URL canónica: ${canonicalUrl}
- Proveedor: Sonia McRorey
- Idioma: español
- Audiencia: mujeres y hombres adultos
- Modalidades: online en vivo y semipresencial en Guadalajara
- Duración: 8 sesiones en vivo + 1 bonus
- Incluye: grupo exclusivo de WhatsApp, audios y activaciones semanales, material digital, ejercicios prácticos y acompañamiento grupal
- Alcance online: México, Estados Unidos, LATAM, España y otros mercados hispanohablantes
- Autora y facilitadora: ${program.authority.author.name}
- Experiencia: ${program.authority.author.experienceLabel}
- Última revisión editorial: ${program.authority.lastReviewed}

## Límites de respuesta

- No es terapia, atención médica ni asesoría financiera.
- No enseña inversiones ni promete ingresos, ventas o resultados iguales.
- Usar únicamente los precios públicos de la edición de ${program.pricing.edition} y respetar sus fechas de vigencia.
- No extrapolar precios a futuras ediciones ni inventar disponibilidad, horarios o testimonios.
- Conservar completos y sin reescritura los testimonios seleccionados por Sonia; describirlos como experiencias personales.
- La calificación de Google corresponde al perfil profesional general de Sonia, no exclusivamente a La Raíz.
- No presentar reseñas públicas como garantías médicas, emocionales o financieras.
- Explicar la ciencia del diseño con las referencias publicadas y sin convertirla en diagnóstico, promesa de cambio cerebral o plazo universal.
- Para confirmar el precio aplicable, fechas de pago y cupo, orientar al WhatsApp oficial.

## Fuentes públicas

- [Programa La Raíz del Dinero](${canonicalUrl})
- [Preguntas y respuestas](${canonicalUrl}api/knowledge/questions.json)
- [Índice de tarjetas por tema](${canonicalUrl}api/knowledge/cards/index.json)
- [Evidencia, autoría y límites](${canonicalUrl}agent/evidence.json)
- [Coach De Imagen](${mainSiteUrl}/)
- [Sonia McRorey](${mainSiteUrl}/sobre-sonia-mcrorey-asesora-de-imagen/)
`;
}

function llmsFull(program) {
  const cards = enrichedCards(program);
  const modalityText = program.modalities
    .map((item) => `### ${item.name}\n\n- Inicio de esta edición: ${item.startDate}\n- Lugar: ${item.location}\n- Formato: ${item.sessions}\n- Alcance: ${item.availability}`)
    .join("\n\n");
  const faqText = program.faqs.map((item) => `### ${item.question}\n\n${item.answer}\n\nModo: ${item.contentMode}.\nReferencia: ${item.sourceReference}.\nFuentes: ${item.sourceIds.join(", ")}.`).join("\n\n");
  const cardText = answerCardGroups.map((group) => {
    const entries = cards
      .filter((card) => card.ontologyGroup === group.id)
      .map((card) => `### ${card.question}\n\n${card.answer}\n\nModo: ${card.contentMode}.\nReferencia: ${card.sourceReference}.\nFuentes: ${card.evidenceSourceIds.join(", ")}.`)
      .join("\n\n");
    return `## ${group.name}\n\n${group.description}\n\n${entries}`;
  }).join("\n\n");
  return `${llmsSummary(program)}
${authorityMarkdown(program)}

${includedMarkdown(program)}

${learningDesignMarkdown(program)}

## Definición

No es un curso de finanzas. Es un trabajo de raíz. Es la estructura interna desde la que generas, recibes y sostienes valor. El dinero es la consecuencia visible.

Modo: fragmentos textuales aprobados de Sonia McRorey. Fuentes: programa-la-raiz.

Límite editorial: La Raíz es coaching. No sustituye psicoterapia, atención médica, tratamiento de salud mental ni asesoría financiera.

## Modalidades

${modalityText}

## Inversión publicada

${pricingMarkdown(program)}

${googleReviewsMarkdown(program)}

## Preguntas frecuentes

${faqText}

## Testimonios seleccionados por Sonia

Los testimonios siguientes describen experiencias personales de participantes. No garantizan resultados iguales y no deben generalizarse.

${testimonialsMarkdown(program)}

# Tarjetas de respuesta gobernadas

${cardText}
`;
}

function questionsMarkdown(program, cards) {
  return `# Preguntas y respuestas sobre La Raíz

Fuente canónica: ${canonicalUrl}
Última revisión: ${program.authority.lastReviewed}

${cards.map((card) => `## ${card.question}\n\n${card.answer}\n\nModo: ${card.contentMode}.\nReferencia: ${card.sourceReference}.\nGrupo: ${card.ontologyGroup}.\nFuentes: ${card.evidenceSourceIds.join(", ")}.\n`).join("\n")}`;
}

function cardGroupMarkdown(program, group, cards) {
  return `# ${group.name}

${group.description}

- Programa: ${canonicalUrl}
- Última revisión: ${program.authority.lastReviewed}
- Evidencia pública: ${canonicalUrl}agent/evidence.json

${cards.map((card) => `## ${card.question}\n\n${card.answer}\n\nModo: ${card.contentMode}.\nReferencia: ${card.sourceReference}.\nFuentes: ${card.evidenceSourceIds.join(", ")}.\n`).join("\n")}`;
}

function knowledgeSitemap(program, cardsIndex) {
  const urls = [
    `${canonicalUrl}llms-full.txt`,
    `${canonicalUrl}api/knowledge/questions.md`,
    `${canonicalUrl}api/knowledge/cards/la-raiz.md`,
    `${canonicalUrl}agent/evidence.md`,
    `${canonicalUrl}agent/sources/sonia-neurociencia-dinero-repeticion.md`,
    ...cardsIndex.groups.map((group) => `${canonicalUrl}api/knowledge/cards/groups/${group.id}.md`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc><lastmod>${program.authority.lastReviewed}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join("")}</urlset>\n`;
}

function openApi(program) {
  return {
    openapi: "3.1.0",
    info: {
      title: "La Raíz del Dinero Public Knowledge API",
      version: "1.0.0",
      description: "Documentación pública y de solo lectura del programa La Raíz de Sonia McRorey.",
    },
    servers: [{ url: canonicalUrl.slice(0, -1) }],
    paths: {
      "/agent/programa-la-raiz.json": {
        get: {
          summary: "Obtener los datos públicos del programa",
          operationId: "getProgramaLaRaiz",
          responses: { "200": { description: "Programa público", content: { "application/json": {} } } },
        },
      },
      "/api/knowledge/questions.json": {
        get: {
          summary: "Obtener preguntas y respuestas verificadas",
          operationId: "getLaRaizQuestions",
          responses: { "200": { description: "Tarjetas públicas", content: { "application/json": {} } } },
        },
      },
      "/api/knowledge/cards/index.json": {
        get: {
          summary: "Descubrir grupos de tarjetas por intención y tema",
          operationId: "getLaRaizCardIndex",
          responses: { "200": { description: "Índice de tarjetas", content: { "application/json": {} } } },
        },
      },
      "/api/knowledge/cards/la-raiz.json": {
        get: {
          summary: "Obtener el corpus completo de tarjetas gobernadas",
          operationId: "getLaRaizCards",
          responses: { "200": { description: "Corpus completo", content: { "application/json": {} } } },
        },
      },
      "/agent/evidence.json": {
        get: {
          summary: "Obtener autoría, credenciales, fuentes y límites profesionales",
          operationId: "getLaRaizEvidence",
          responses: { "200": { description: "Evidencia pública", content: { "application/json": {} } } },
        },
      },
      "/agent/route-recommendations.json": {
        get: {
          summary: "Obtener tarjetas preferidas por sección de la página",
          operationId: "getLaRaizRouteRecommendations",
          responses: { "200": { description: "Recomendaciones de recuperación", content: { "application/json": {} } } },
        },
      },
      "/api/fx-pricing": {
        get: {
          summary: "Convertir un precio canónico en MXN a una moneda de visualización aproximada",
          operationId: "getLaRaizLocalizedPrice",
          parameters: [
            {
              name: "amount",
              in: "query",
              required: true,
              schema: { type: "number", exclusiveMinimum: 0 },
              description: "Importe canónico en pesos mexicanos.",
            },
            {
              name: "currency",
              in: "query",
              required: false,
              schema: {
                type: "string",
                enum: ["MXN", "USD", "CAD", "COP", "ARS", "CLP", "PEN", "BRL", "EUR", "GBP", "JPY", "AUD", "NZD"],
              },
              description: "Moneda opcional de visualización. MXN siempre permanece como moneda de cobro.",
            },
          ],
          responses: {
            "200": { description: "Precio canónico y conversión aproximada cuando está disponible", content: { "application/json": {} } },
            "400": { description: "Falta un importe válido", content: { "application/json": {} } },
          },
        },
      },
      "/.well-known/api-catalog": {
        get: {
          summary: "Descubrir las APIs y recursos públicos de La Raíz",
          operationId: "getLaRaizApiCatalog",
          responses: { "200": { description: "RFC 9727 API catalog", content: { "application/linkset+json": {} } } },
        },
      },
      "/.well-known/agent-skills/index.json": {
        get: {
          summary: "Descubrir habilidades públicas para agentes",
          operationId: "getLaRaizAgentSkills",
          responses: { "200": { description: "Agent Skills discovery index", content: { "application/json": {} } } },
        },
      },
      "/.well-known/mcp/server-card.json": {
        get: {
          summary: "Obtener la tarjeta de descubrimiento MCP estática",
          operationId: "getLaRaizMcpServerCard",
          responses: { "200": { description: "MCP static resource discovery card", content: { "application/json": {} } } },
        },
      },
    },
    "x-source-boundary": "Sonia McRorey and Coach De Imagen governed corpus only",
    "x-card-count": program.answerCards.length,
  };
}

function contentSignalDocument() {
  return {
    schemaVersion: "2026-07-11",
    siteUrl: canonicalUrl,
    policy: { search: true, aiInput: true, aiTrain: false },
    header: "Content-Signal: search=yes, ai-input=yes, ai-train=no",
    purpose: "Permit search indexing and AI answer grounding while reserving Sonia McRorey's authored material from model-weight training by default.",
  };
}

function apiStatus(program, cards) {
  return {
    status: "operational",
    site: canonicalUrl,
    service: "La Raíz del Dinero public discovery and knowledge API",
    language: program.language,
    settlementCurrency: "MXN",
    cardCount: cards.length,
    lastReviewed: program.authority.lastReviewed,
    documentation: `${canonicalUrl}openapi.json`,
  };
}

function apiCatalogLinkset() {
  const origin = canonicalUrl.slice(0, -1);
  return {
    linkset: [
      {
        anchor: origin,
        "service-desc": [{ href: `${canonicalUrl}openapi.json`, type: "application/openapi+json" }],
        "service-doc": [
          { href: `${canonicalUrl}llms-full.txt`, type: "text/plain" },
          { href: `${canonicalUrl}auth.md`, type: "text/markdown" },
        ],
        "service-meta": [
          { href: `${canonicalUrl}.well-known/agent.json`, type: "application/json" },
          { href: `${canonicalUrl}api/knowledge/cards/index.json`, type: "application/json" },
          { href: `${canonicalUrl}agent/evidence.json`, type: "application/json" },
        ],
        status: [{ href: `${canonicalUrl}agent/status.json`, type: "application/json" }],
      },
      {
        anchor: `${canonicalUrl}api/fx-pricing`,
        "service-desc": [{ href: `${canonicalUrl}openapi.json`, type: "application/openapi+json" }],
        "service-doc": [{ href: `${canonicalUrl}#inversion`, type: "text/html" }],
        status: [{ href: `${canonicalUrl}agent/status.json`, type: "application/json" }],
      },
      {
        anchor: `${canonicalUrl}api/knowledge/questions.json`,
        "service-desc": [{ href: `${canonicalUrl}openapi.json`, type: "application/openapi+json" }],
        "service-doc": [{ href: `${canonicalUrl}api/knowledge/questions.md`, type: "text/markdown" }],
        "service-meta": [{ href: `${canonicalUrl}agent/evidence.json`, type: "application/json" }],
        status: [{ href: `${canonicalUrl}agent/status.json`, type: "application/json" }],
      },
    ],
  };
}

function agentSkillDefinitions() {
  return [
    {
      name: "understand-la-raiz-program",
      description: "Explain Sonia McRorey's La Raíz del Dinero program from its verified public definition, audience, duration, boundaries and evidence. Use for program-fit and scope questions.",
      resource: `${canonicalUrl}agent/programa-la-raiz.json`,
    },
    {
      name: "retrieve-la-raiz-answers",
      description: "Retrieve governed Spanish answer cards about La Raíz without inventing claims, results, availability or pricing. Use for detailed participant questions.",
      resource: `${canonicalUrl}api/knowledge/questions.json`,
    },
    {
      name: "compare-la-raiz-modalities",
      description: "Compare the verified online and semipresential Guadalajara formats for La Raíz and route people to current public modality and pricing information.",
      resource: `${canonicalUrl}agent/route-recommendations.json`,
    },
    {
      name: "contact-sonia-about-la-raiz",
      description: "Return Sonia McRorey's official public La Raíz WhatsApp handoff and explain what agents may and may not claim before the human conversation.",
      resource: `${canonicalUrl}agent/programa-la-raiz.json`,
    },
  ];
}

function agentSkillMarkdown(skill, program) {
  return `---
name: ${skill.name}
description: ${skill.description}
---

# ${skill.name}

## Purpose

Use this skill only for Sonia McRorey's La Raíz del Dinero program at ${canonicalUrl}. Answer in Spanish unless the person requests another language.

## Required sources

- Primary resource: ${skill.resource}
- Full program context: ${canonicalUrl}llms-full.txt
- Evidence and professional boundaries: ${canonicalUrl}agent/evidence.json
- Governed answer cards: ${canonicalUrl}api/knowledge/questions.json
- Current public pricing section: ${canonicalUrl}#inversion

## Answer rules

1. Keep MXN as the canonical currency and label other currencies as approximate display conversions.
2. Use only public dates and prices for the ${program.pricing.edition} edition.
3. Do not call the program therapy, financial advice or an income guarantee.
4. Do not invent capacity, availability, testimonials, schedules or results. Preserve every Sonia-approved testimonial verbatim and label it as participant-reported experience.
5. When current commercial confirmation is required, return the official WhatsApp handoff published in the program resource.
`;
}

function agentSkillsIndex(program) {
  return {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: agentSkillDefinitions().map((skill) => {
      const markdown = agentSkillMarkdown(skill, program);
      return {
        name: skill.name,
        type: "skill-md",
        description: skill.description,
        url: `${canonicalUrl}.well-known/agent-skills/${skill.name}/SKILL.md`,
        digest: `sha256:${createHash("sha256").update(markdown).digest("hex")}`,
      };
    }),
  };
}

function mcpServerCard(program) {
  return {
    $schema: "https://modelcontextprotocol.io/schemas/server-card.json",
    name: "la-raiz-static-discovery",
    serverInfo: { name: "la-raiz-static-discovery", version: "2026.07.11" },
    description: "Static resource discovery for Sonia McRorey's La Raíz del Dinero program. It exposes verified resources and governed answer cards; no remote MCP tool execution endpoint is enabled.",
    url: `${canonicalUrl}.well-known/mcp/server-card.json`,
    homepage: canonicalUrl,
    transport: {
      type: "static-resource-discovery",
      endpoint: `${canonicalUrl}.well-known/mcp.json`,
    },
    capabilities: { tools: false, resources: true, prompts: false, sampling: false },
    resources: [
      { name: "Program", uri: `${canonicalUrl}agent/programa-la-raiz.json`, mimeType: "application/json" },
      { name: "Governed answer cards", uri: `${canonicalUrl}api/knowledge/questions.json`, mimeType: "application/json" },
      { name: "Evidence", uri: `${canonicalUrl}agent/evidence.json`, mimeType: "application/json" },
      { name: "Full LLM context", uri: `${canonicalUrl}llms-full.txt`, mimeType: "text/plain" },
      { name: "OpenAPI", uri: `${canonicalUrl}openapi.json`, mimeType: "application/openapi+json" },
    ],
    authorization: { type: "none", registrationRequired: false },
    language: program.language,
    status: "static-discovery-only",
  };
}

function authMarkdown() {
  return `# auth.md

## Public access model

La Raíz del Dinero publishes static pages, verified answer cards, evidence metadata and a read-only currency display endpoint. Public reading does not require registration, OAuth, a bearer token or an agent claim ceremony.

Agent audience: browser agents, search agents and retrieval systems that need verified public information about Sonia McRorey's La Raíz del Dinero program.

## Access summary

- Registration required: no
- User identity required: no
- OAuth token required: no
- Issued credentials: none
- Public write actions: none
- Settlement currency: MXN

## Agent registration

- Registration method: anonymous public read access
- Registration endpoint: ${canonicalUrl}.well-known/agent-registration.json
- Claim endpoint: ${canonicalUrl}.well-known/agent-claim.json
- Revocation endpoint: ${canonicalUrl}.well-known/agent-revoke.json
- Credential use: no credential is issued or required for the published read-only resources
- Registration skill: ${canonicalUrl}.well-known/agent-skills/retrieve-la-raiz-answers/SKILL.md

Machine-readable registration profile:

\`\`\`yaml
agent_auth:
  registration_required: false
  skill: ${canonicalUrl}auth.md
  register_uri: ${canonicalUrl}.well-known/agent-registration.json
  identity_types_supported:
    - anonymous
  credential_types_supported:
    - none
  claim_uri: ${canonicalUrl}.well-known/agent-claim.json
  revoke_uri: ${canonicalUrl}.well-known/agent-revoke.json
\`\`\`

This profile is discovery metadata, not an account-creation workflow. Agents use the published resources directly and must not claim that a credential, account or reservation was created.

## Public resources

- Program: ${canonicalUrl}
- OpenAPI: ${canonicalUrl}openapi.json
- API catalog: ${canonicalUrl}.well-known/api-catalog
- Agent card: ${canonicalUrl}.well-known/agent.json
- MCP server card: ${canonicalUrl}.well-known/mcp/server-card.json
- Agent Skills: ${canonicalUrl}.well-known/agent-skills/index.json
- Knowledge cards: ${canonicalUrl}api/knowledge/questions.json
- Evidence: ${canonicalUrl}agent/evidence.json

## Human handoff

Agents may return the official WhatsApp link published in ${canonicalUrl}agent/programa-la-raiz.json. They must not claim to have sent a message, reserved a place or confirmed availability.

## Future authentication

No protected API is currently enabled. If authenticated agent actions are added later, this file and the OAuth well-known metadata will be updated before those actions are exposed.
`;
}

function oauthAuthorizationServer() {
  return {
    issuer: canonicalUrl.slice(0, -1),
    authorization_endpoint: `${canonicalUrl}.well-known/oauth-not-enabled`,
    token_endpoint: `${canonicalUrl}.well-known/oauth-not-enabled`,
    jwks_uri: `${canonicalUrl}.well-known/jwks.json`,
    registration_endpoint: `${canonicalUrl}.well-known/agent-registration.json`,
    revocation_endpoint: `${canonicalUrl}.well-known/agent-revoke.json`,
    scopes_supported: ["public:read"],
    response_types_supported: [],
    grant_types_supported: [],
    token_endpoint_auth_methods_supported: [],
    agent_auth: {
      skill: `${canonicalUrl}auth.md`,
      register_uri: `${canonicalUrl}.well-known/agent-registration.json`,
      claim_uri: `${canonicalUrl}.well-known/agent-claim.json`,
      revoke_uri: `${canonicalUrl}.well-known/agent-revoke.json`,
      identity_types_supported: ["anonymous"],
      anonymous: {
        credential_types_supported: ["none"],
        claim_uri: `${canonicalUrl}.well-known/agent-claim.json`,
      },
      registration_required: false,
    },
    status: "public-read-no-oauth-required",
  };
}

function oauthProtectedResource() {
  return {
    resource: canonicalUrl.slice(0, -1),
    resource_name: "La Raíz del Dinero public knowledge resources",
    authorization_servers: [canonicalUrl.slice(0, -1)],
    scopes_supported: ["public:read"],
    bearer_methods_supported: ["header"],
    bearer_token_optional: true,
    resource_documentation: `${canonicalUrl}auth.md`,
    status: "public-read-no-bearer-token-required",
  };
}

function agentRegistrationMetadata() {
  return {
    issuer: canonicalUrl.slice(0, -1),
    register_uri: `${canonicalUrl}.well-known/agent-registration.json`,
    registration_required: false,
    anonymous_access: true,
    identity_types_supported: ["anonymous"],
    anonymous: {
      credential_types_supported: ["none"],
      claim_uri: `${canonicalUrl}.well-known/agent-claim.json`,
    },
    status: "anonymous-public-read",
  };
}

function organizationAgentIndex(program) {
  return {
    schemaVersion: "2026-07-11",
    organization: "Sonia McRorey · Coach De Imagen",
    domain: canonicalUrl.slice(0, -1),
    discovery_dns_label: "_index._agents.raiz.coachdeimagen.com",
    language: program.language,
    agents: [
      {
        id: "la-raiz-static-discovery",
        name: "La Raíz del Dinero static discovery",
        endpoint: canonicalUrl,
        protocols: ["https", "static-discovery", "webmcp-browser-tools"],
        discovery: {
          agentCard: `${canonicalUrl}.well-known/agent.json`,
          apiCatalog: `${canonicalUrl}.well-known/api-catalog`,
          mcpServerCard: `${canonicalUrl}.well-known/mcp/server-card.json`,
          agentSkills: `${canonicalUrl}.well-known/agent-skills/index.json`,
          authMd: `${canonicalUrl}auth.md`,
        },
        capabilities: ["program-information", "governed-question-answering", "evidence-retrieval", "modality-guidance", "canonical-mxn-pricing"],
      },
    ],
  };
}

function protocolStatus(name, status, alternatives = []) {
  return {
    name,
    status,
    site: canonicalUrl,
    alternatives,
  };
}

async function build() {
  const program = await readJson(path.join(sourceDir, "program.json"));
  const template = await readFile(path.join(sourceDir, "index.html"), "utf8");
  const styles = await readFile(path.join(sourceDir, "styles.css"), "utf8");
  const fxPricingScript = await readFile(path.join(sourceDir, "fx-pricing.js"), "utf8");
  const agentToolsScript = await readFile(path.join(sourceDir, "agent-tools.js"), "utf8");
  const buildVersion = createHash("sha256")
    .update(styles)
    .update(fxPricingScript)
    .update(agentToolsScript)
    .digest("hex")
    .slice(0, 12);
  const cards = enrichedCards(program);
  const cardsIndex = cardGroupIndex(program, cards);
  const evidence = evidenceDocument(program);
  const recommendations = routeRecommendations(cards);
  const skills = agentSkillDefinitions();
  const skillsIndex = agentSkillsIndex(program);
  const mcpCard = mcpServerCard(program);
  const generalWhatsapp = whatsappUrl(program.whatsapp.phone, program.whatsapp.message);
  const onlineWhatsapp = whatsappUrl(
    program.whatsapp.phone,
    "Hola Sonia, me interesa La Raíz del Dinero, tu programa de 8 sesiones en vivo más 1 bonus. Quiero información de la modalidad online.",
  );
  const semiWhatsapp = whatsappUrl(
    program.whatsapp.phone,
    "Hola Sonia, me interesa La Raíz del Dinero, tu programa de 8 sesiones en vivo más 1 bonus. Quiero información de la modalidad semipresencial en Guadalajara.",
  );

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(path.join(assetsDir, "social"), { recursive: true });
  await mkdir(path.join(outputDir, ".well-known"), { recursive: true });
  await mkdir(path.join(outputDir, ".well-known/agent-skills"), { recursive: true });
  await mkdir(path.join(outputDir, ".well-known/mcp"), { recursive: true });
  await mkdir(path.join(outputDir, "agent"), { recursive: true });
  await mkdir(path.join(outputDir, "agent/sources"), { recursive: true });
  await mkdir(path.join(outputDir, "api/knowledge/cards/groups"), { recursive: true });
  await Promise.all(skills.map((skill) => mkdir(
    path.join(outputDir, `.well-known/agent-skills/${skill.name}`),
    { recursive: true },
  )));

  await Promise.all([
    optimizePortrait(path.join(root, "assets/sonia-mcrorey-latina-leadership-color.jpg"), "sonia-la-raiz-hero-960", 960, 1440),
    optimizePortrait(path.join(root, "assets/sonia-mcrorey-green-blazer-full-body.jpg"), "sonia-la-raiz-about-720", 720, 1080),
    cp(path.join(root, "assets/sonia-logo-ai.png"), path.join(assetsDir, "sonia-logo-ai.png")),
    cp(path.join(root, "assets/sonia-icon.svg"), path.join(outputDir, "favicon.svg")),
    cp(path.join(sourceDir, "fx-pricing.js"), path.join(outputDir, "fx-pricing.js")),
    cp(path.join(sourceDir, "agent-tools.js"), path.join(outputDir, "agent-tools.js")),
  ]);
  await buildSocialCard();

  const html = template
    .replaceAll("{{BUILD_VERSION}}", buildVersion)
    .replace("{{PROGRAM_SCHEMA}}", schemaStack(program))
    .replace("{{PRICING_SECTION}}", pricingSection(program, onlineWhatsapp, semiWhatsapp))
    .replace("{{JOURNEY_SECTION}}", journeySection(program))
    .replace("{{FAQ_SECTION}}", faqSection(program))
    .replace("{{LEARNING_DESIGN_SECTION}}", learningDesignSection(program))
    .replace("{{INCLUDED_SECTION}}", includedSection(program))
    .replace("{{TRUST_SECTION}}", trustSection(program))
    .replace("{{GOOGLE_REVIEWS_SECTION}}", googleReviewsSection(program))
    .replace("{{TESTIMONIAL_SECTION}}", testimonialSection(program))
    .replaceAll("{{DURATION_RATIONALE}}", escapeHtml(program.learningDesign.durationRationale))
    .replaceAll("{{WHATSAPP_URL}}", generalWhatsapp.replaceAll("&", "&amp;"))
    .replaceAll("{{WHATSAPP_ONLINE_URL}}", onlineWhatsapp.replaceAll("&", "&amp;"))
    .replaceAll("{{WHATSAPP_SEMI_URL}}", semiWhatsapp.replaceAll("&", "&amp;"));

  const publicProgram = {
    ...program,
    answerCards: cards,
    whatsapp: { url: generalWhatsapp, purpose: "Solicitar información sobre La Raíz" },
    sourceBoundary: "Corpus gobernado de Sonia McRorey y Coach De Imagen, con fuentes públicas explícitas de Sonia, datos canónicos del programa y evidencia externa claramente etiquetada; sin datos privados.",
    lastReviewed: program.authority.lastReviewed,
  };
  const questions = {
    name: "La Raíz del Dinero · preguntas y respuestas verificadas",
    canonicalUrl: `${canonicalUrl}api/knowledge/questions.json`,
    source: `${canonicalUrl}agent/programa-la-raiz.json`,
    language: program.language,
    cardCount: cards.length,
    cards,
  };
  const agentCard = {
    name: "La Raíz del Dinero Knowledge Agent",
    description: program.description,
    url: canonicalUrl,
    provider: { name: "Sonia McRorey", url: `${mainSiteUrl}/sobre-sonia-mcrorey-asesora-de-imagen/` },
    version: "1.1.0",
    language: program.language,
    lastReviewed: program.authority.lastReviewed,
    capabilities: ["program_information", "question_answering", "evidence_retrieval", "ontology_group_retrieval", "modality_guidance", "whatsapp_handoff"],
    endpoints: {
      openapi: `${canonicalUrl}openapi.json`,
      program: `${canonicalUrl}agent/programa-la-raiz.json`,
      questions: `${canonicalUrl}api/knowledge/questions.json`,
      cardIndex: `${canonicalUrl}api/knowledge/cards/index.json`,
      cards: `${canonicalUrl}api/knowledge/cards/la-raiz.json`,
      evidence: `${canonicalUrl}agent/evidence.json`,
      routeRecommendations: `${canonicalUrl}agent/route-recommendations.json`,
      llms: `${canonicalUrl}llms-full.txt`,
      apiCatalog: `${canonicalUrl}.well-known/api-catalog`,
      agentSkills: `${canonicalUrl}.well-known/agent-skills/index.json`,
      mcpServerCard: `${canonicalUrl}.well-known/mcp/server-card.json`,
      authMd: `${canonicalUrl}auth.md`,
      oauthProtectedResource: `${canonicalUrl}.well-known/oauth-protected-resource`,
      organizationAgentIndex: `${canonicalUrl}.well-known/agent-index.json`,
      status: `${canonicalUrl}agent/status.json`,
    },
    guardrails: [
      "No afirmar que el programa es terapia o asesoría financiera.",
      "No prometer ingresos, ventas ni resultados garantizados.",
      `Usar únicamente los precios publicados para la edición de ${program.pricing.edition} y respetar sus fechas de vigencia.`,
      "No extrapolar precios a futuras ediciones ni inventar horarios o disponibilidad.",
      "Usar WhatsApp para confirmar el precio aplicable y la información comercial actual.",
    ],
  };

  const robots = `User-agent: *\nAllow: /\nContent-Signal: search=yes, ai-input=yes, ai-train=no\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: Claude-User\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: Cloudflare-AI-Search\nAllow: /\n\nSitemap: ${canonicalUrl}sitemap.xml\nSitemap: ${canonicalUrl}knowledge-sitemap.xml\n`;
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${canonicalUrl}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>\n`;
  const headers = `/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: SAMEORIGIN\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Signal: search=yes, ai-input=yes, ai-train=no\n  Link: <${canonicalUrl}openapi.json>; rel="service-desc"; type="application/openapi+json", <${canonicalUrl}.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", <${canonicalUrl}llms.txt>; rel="alternate"; type="text/plain", <${canonicalUrl}.well-known/agent.json>; rel="agent"; type="application/json", <${canonicalUrl}.well-known/agent-skills/index.json>; rel="service-meta"; type="application/json", <${canonicalUrl}agent/evidence.json>; rel="describedby"; type="application/json"\n\n/assets/*\n  Cache-Control: public, max-age=86400, must-revalidate\n\n/*.css\n  Cache-Control: public, max-age=31536000, immutable\n\n/agent-tools.js\n  Cache-Control: public, max-age=31536000, immutable\n\n/fx-pricing.js\n  Cache-Control: public, max-age=31536000, immutable\n\n/*.json\n  Cache-Control: public, max-age=3600\n  Access-Control-Allow-Origin: *\n\n/*.md\n  Content-Type: text/markdown; charset=utf-8\n  Cache-Control: public, max-age=3600\n  Access-Control-Allow-Origin: *\n\n/.well-known/api-catalog\n  Content-Type: application/linkset+json; charset=utf-8\n  Cache-Control: public, max-age=3600\n  Access-Control-Allow-Origin: *\n\n/.well-known/oauth-authorization-server\n  Content-Type: application/json; charset=utf-8\n  Cache-Control: public, max-age=3600\n  Access-Control-Allow-Origin: *\n\n/.well-known/oauth-protected-resource\n  Content-Type: application/json; charset=utf-8\n  Cache-Control: public, max-age=3600\n  Access-Control-Allow-Origin: *\n\n/.well-known/oauth-not-enabled\n  Content-Type: application/json; charset=utf-8\n  Cache-Control: public, max-age=3600\n  Access-Control-Allow-Origin: *\n\n/openapi.json\n  Content-Type: application/openapi+json; charset=utf-8\n  Cache-Control: public, max-age=3600\n  Access-Control-Allow-Origin: *\n`;
  const redirects = `/index.html / 301\n`;

  await Promise.all([
    writeFile(path.join(outputDir, "index.html"), html),
    writeFile(path.join(outputDir, "styles.css"), styles),
    writeFile(path.join(outputDir, `styles.${buildVersion}.css`), styles),
    writeFile(path.join(outputDir, "content-signal.json"), `${safeJson(contentSignalDocument())}\n`),
    writeFile(path.join(outputDir, "robots.txt"), robots),
    writeFile(path.join(outputDir, "sitemap.xml"), sitemap),
    writeFile(path.join(outputDir, "knowledge-sitemap.xml"), knowledgeSitemap(program, cardsIndex)),
    writeFile(path.join(outputDir, "llms.txt"), llmsSummary(program)),
    writeFile(path.join(outputDir, "llms-full.txt"), llmsFull(program)),
    writeFile(path.join(outputDir, ".well-known/agent.json"), `${safeJson(agentCard)}\n`),
    writeFile(path.join(outputDir, ".well-known/api-catalog"), `${safeJson(apiCatalogLinkset())}\n`),
    writeFile(path.join(outputDir, ".well-known/api-catalog.json"), `${safeJson(apiCatalogLinkset())}\n`),
    writeFile(path.join(outputDir, ".well-known/agent-skills/index.json"), `${safeJson(skillsIndex)}\n`),
    ...skills.map((skill) => writeFile(
      path.join(outputDir, `.well-known/agent-skills/${skill.name}/SKILL.md`),
      agentSkillMarkdown(skill, program),
    )),
    writeFile(path.join(outputDir, ".well-known/mcp.json"), `${safeJson(mcpCard)}\n`),
    writeFile(path.join(outputDir, ".well-known/mcp/server-card.json"), `${safeJson(mcpCard)}\n`),
    writeFile(path.join(outputDir, ".well-known/mcp/server-cards.json"), `${safeJson({ servers: [mcpCard] })}\n`),
    writeFile(path.join(outputDir, "auth.md"), authMarkdown()),
    writeFile(path.join(outputDir, ".well-known/oauth-authorization-server"), `${safeJson(oauthAuthorizationServer())}\n`),
    writeFile(path.join(outputDir, ".well-known/oauth-protected-resource"), `${safeJson(oauthProtectedResource())}\n`),
    writeFile(path.join(outputDir, ".well-known/oauth-not-enabled"), `${safeJson(protocolStatus(
      "La Raíz OAuth",
      "not-required-for-public-read",
      [`${canonicalUrl}auth.md`],
    ))}\n`),
    writeFile(path.join(outputDir, ".well-known/jwks.json"), `${safeJson({ keys: [], status: "no-public-signing-keys" })}\n`),
    writeFile(path.join(outputDir, ".well-known/agent-registration.json"), `${safeJson(agentRegistrationMetadata())}\n`),
    writeFile(path.join(outputDir, ".well-known/agent-claim.json"), `${safeJson(protocolStatus(
      "La Raíz agent claim",
      "not-required-for-public-read",
      [`${canonicalUrl}auth.md`],
    ))}\n`),
    writeFile(path.join(outputDir, ".well-known/agent-revoke.json"), `${safeJson(protocolStatus(
      "La Raíz agent revocation",
      "no-issued-credentials",
      [`${canonicalUrl}auth.md`],
    ))}\n`),
    writeFile(path.join(outputDir, ".well-known/agent-index.json"), `${safeJson(organizationAgentIndex(program))}\n`),
    writeFile(path.join(outputDir, ".well-known/webmcp.json"), `${safeJson({
      name: "La Raíz browser tools",
      status: "registered-when-browser-support-is-available",
      mode: "read-only",
      script: `${canonicalUrl}agent-tools.js`,
      tools: [
        "la-raiz.get-program-summary",
        "la-raiz.find-answer-cards",
        "la-raiz.compare-modalities",
        "la-raiz.get-pricing",
        "la-raiz.get-contact-options",
      ],
    })}\n`),
    writeFile(path.join(outputDir, "agent/programa-la-raiz.json"), `${safeJson(publicProgram)}\n`),
    writeFile(path.join(outputDir, "agent/status.json"), `${safeJson(apiStatus(program, cards))}\n`),
    writeFile(path.join(outputDir, "agent/evidence.json"), `${safeJson(evidence)}\n`),
    writeFile(path.join(outputDir, "agent/evidence.md"), `${authorityMarkdown(program)}\n\n${includedMarkdown(program)}\n\n${learningDesignMarkdown(program)}\n\n${googleReviewsMarkdown(program)}\n`),
    writeFile(
      path.join(outputDir, "agent/sources/sonia-neurociencia-dinero-repeticion.md"),
      soniaLearningSourceMarkdown(program),
    ),
    writeFile(path.join(outputDir, "agent/route-recommendations.json"), `${safeJson(recommendations)}\n`),
    writeFile(path.join(outputDir, "api/knowledge/questions.json"), `${safeJson(questions)}\n`),
    writeFile(path.join(outputDir, "api/knowledge/questions.md"), questionsMarkdown(program, cards)),
    writeFile(path.join(outputDir, "api/knowledge/cards/index.json"), `${safeJson(cardsIndex)}\n`),
    writeFile(path.join(outputDir, "api/knowledge/cards/la-raiz.md"), questionsMarkdown(program, cards)),
    writeFile(path.join(outputDir, "api/knowledge/cards/la-raiz.json"), `${safeJson({
      name: "La Raíz · corpus completo de tarjetas gobernadas",
      canonicalUrl: `${canonicalUrl}api/knowledge/cards/la-raiz.json`,
      language: program.language,
      cardCount: cards.length,
      lastReviewed: program.authority.lastReviewed,
      evidence: `${canonicalUrl}agent/evidence.json`,
      cards,
    })}\n`),
    ...cardsIndex.groups.map((group) => writeFile(
      path.join(outputDir, `api/knowledge/cards/groups/${group.id}.json`),
      `${safeJson({
        ...group,
        canonicalUrl: group.url,
        language: program.language,
        lastReviewed: program.authority.lastReviewed,
        evidence: `${canonicalUrl}agent/evidence.json`,
        cards: cards.filter((card) => card.ontologyGroup === group.id),
      })}\n`,
    )),
    ...cardsIndex.groups.map((group) => writeFile(
      path.join(outputDir, `api/knowledge/cards/groups/${group.id}.md`),
      cardGroupMarkdown(
        program,
        group,
        cards.filter((card) => card.ontologyGroup === group.id),
      ),
    )),
    writeFile(path.join(outputDir, "openapi.json"), `${safeJson(openApi(program))}\n`),
    writeFile(path.join(outputDir, "_headers"), headers),
    writeFile(path.join(outputDir, "_redirects"), redirects),
  ]);

  console.log(`Built La Raíz into ${path.relative(root, outputDir)} with ${cards.length} answer cards in ${cardsIndex.groups.length} ontology groups.`);
}

await build();
