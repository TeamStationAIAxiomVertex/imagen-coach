import { access, readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(root, "dist-raiz");
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const stripHtml = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&[^;]+;/g, " ")
  .replace(/\s+/g, " ")
  .trim();
const money = (amount) => `$${new Intl.NumberFormat("es-MX", {
  minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  maximumFractionDigits: 2,
}).format(amount)}`;
const today = new Date().toISOString().slice(0, 10);
const promotionIsActive = (promotion) => (
  (!promotion.validFrom || promotion.validFrom <= today)
  && (!promotion.validThrough || today <= promotion.validThrough)
);
const promotionOptions = (modality, promotion) => {
  if (!promotion) return modality.regular;
  if (Array.isArray(promotion.options)) return promotion.options;
  return modality.regular.map((item) => ({
    ...item,
    amount: Number((item.amount * (1 - promotion.discountPercent / 100)).toFixed(2)),
  }));
};

const html = await readFile(path.join(outputDir, "index.html"), "utf8");
const styles = await readFile(path.join(outputDir, "styles.css"), "utf8");
const program = JSON.parse(await readFile(path.join(root, "raiz/program.json"), "utf8"));
const questions = JSON.parse(await readFile(path.join(outputDir, "api/knowledge/questions.json"), "utf8"));
const cardIndex = JSON.parse(await readFile(path.join(outputDir, "api/knowledge/cards/index.json"), "utf8"));
const cardCorpus = JSON.parse(await readFile(path.join(outputDir, "api/knowledge/cards/la-raiz.json"), "utf8"));
const evidence = JSON.parse(await readFile(path.join(outputDir, "agent/evidence.json"), "utf8"));
const recommendations = JSON.parse(await readFile(path.join(outputDir, "agent/route-recommendations.json"), "utf8"));
const robots = await readFile(path.join(outputDir, "robots.txt"), "utf8");
const knowledgeSitemap = await readFile(path.join(outputDir, "knowledge-sitemap.xml"), "utf8");
const headers = await readFile(path.join(outputDir, "_headers"), "utf8");
const agentTools = await readFile(path.join(outputDir, "agent-tools.js"), "utf8");
const apiCatalog = JSON.parse(await readFile(path.join(outputDir, ".well-known/api-catalog"), "utf8"));
const skillsIndex = JSON.parse(await readFile(path.join(outputDir, ".well-known/agent-skills/index.json"), "utf8"));
const mcpCard = JSON.parse(await readFile(path.join(outputDir, ".well-known/mcp/server-card.json"), "utf8"));
const authMarkdown = await readFile(path.join(outputDir, "auth.md"), "utf8");
const oauthServer = JSON.parse(await readFile(path.join(outputDir, ".well-known/oauth-authorization-server"), "utf8"));
const protectedResource = JSON.parse(await readFile(path.join(outputDir, ".well-known/oauth-protected-resource"), "utf8"));
const organizationAgentIndex = JSON.parse(await readFile(path.join(outputDir, ".well-known/agent-index.json"), "utf8"));
const openApi = JSON.parse(await readFile(path.join(outputDir, "openapi.json"), "utf8"));
const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] || "";
const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1] || "";
const heroImageRule = styles.match(/\.hero-photo img\s*\{([\s\S]*?)\}/)?.[1] || "";
const heroShadeRule = styles.match(/\.hero-shade\s*\{([\s\S]*?)\}/)?.[1] || "";
const h1Count = (html.match(/<h1\b/gi) || []).length;
const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
const schemaTypes = [];
const schemas = [];
const decodedLinks = [...html.matchAll(/href="([^"]+)"/g)]
  .map(([, href]) => href.replaceAll("&amp;", "&"))
  .map((href) => {
    try {
      return decodeURIComponent(href);
    } catch {
      return href;
    }
  })
  .join("\n");
const visibleText = stripHtml(html);
const claimText = visibleText
  .replaceAll(/no garantiza/gi, "")
  .replaceAll(/no promete/gi, "")
  .replaceAll(/sin prometer/gi, "");

for (const [, text] of scripts) {
  try {
    const parsed = JSON.parse(text);
    schemaTypes.push(parsed["@type"]);
    schemas.push(parsed);
  } catch (error) {
    failures.push(`Invalid JSON-LD: ${error.message}`);
  }
}

assert(!html.includes("{{"), "Unresolved build placeholder remains in HTML.");
assert(h1Count === 1, `Expected one H1, found ${h1Count}.`);
assert(title.length >= 30 && title.length <= 60, `Title length is ${title.length}; expected 30-60.`);
assert(description.length >= 110 && description.length <= 145, `Description length is ${description.length}; expected 110-145.`);
assert(html.includes('<link rel="canonical" href="https://raiz.coachdeimagen.com/"'), "Canonical URL is missing or incorrect.");
assert(words >= 850 && words <= 2600, `Visible word count is ${words}; expected 850-2600.`);
assert(html.includes("8 sesiones en vivo + 1 bonus"), "Program duration is missing.");
assert(/top:\s*0;/.test(heroImageRule), "Hero portrait is shifted above its frame and can crop Sonia's head.");
assert(/height:\s*100%;/.test(heroImageRule), "Hero portrait does not use the full uncropped frame height.");
assert(/object-position:\s*center top;/.test(heroImageRule), "Hero portrait is not anchored to preserve Sonia's head.");
assert(/mask-image:\s*linear-gradient\(90deg,[^}]*#000 18%\)/.test(heroImageRule), "Desktop hero portrait is missing its photo-edge blend.");
assert(/rgba\(36, 21, 43, 0\) 68%/.test(heroShadeRule), "Desktop hero blend does not become transparent before Sonia's portrait.");
assert(styles.includes("padding-top: 390px"), "Mobile hero copy is not positioned below Sonia's portrait.");
assert(styles.includes("height: 390px"), "Mobile hero portrait height contract is missing.");
assert(styles.includes("-webkit-mask-image: none") && styles.includes("mask-image: none"), "Mobile hero does not disable the horizontal portrait mask.");
assert(html.includes("mujeres y hombres"), "Inclusive audience statement is missing.");
assert(html.includes("Guadalajara"), "Guadalajara delivery context is missing.");
assert(html.includes("modalidad online"), "Online delivery context is missing.");
assert(html.includes('id="inversion"'), "Visible pricing section is missing.");
assert(html.includes("Inversión de la edición de Julio 2026"), "Pricing edition and currency context are missing.");
assert(html.includes('class="price-primary"'), "Primary price hierarchy is missing.");
assert(html.includes('class="pricing-card-head"'), "Branded pricing card header is missing.");
assert(styles.includes(".pricing-featured .pricing-card-head"), "Semipresencial pricing card brand treatment is missing.");
assert(/styles\.[a-f0-9]{12}\.css/.test(html), "Content-hashed stylesheet filename is missing.");
assert((html.match(/"@type":"Offer"/g) || []).length === 2, "Expected two nested Offer schema entities.");
assert((html.match(/"priceCurrency":"MXN"/g) || []).length === 2, "Offer schema must use MXN.");
assert(decodedLinks.includes("me interesa La Raíz"), "WhatsApp program-interest message is missing.");
assert(!/cdn\.tailwindcss|fonts\.googleapis|unpkg\.com|jsdelivr\.net/i.test(html), "Runtime CDN dependency found.");
assert(!/garantiza (ingresos|ventas)|resultados garantizados|cura|tratamiento terapéutico/i.test(claimText), "Prohibited guarantee or health claim found.");
assert(html.includes('id="criterio-profesional"'), "Visible E-E-A-T trust section is missing.");
assert(html.includes("Última revisión editorial"), "Visible editorial review date is missing.");
assert(html.includes("AICI Guadalajara, 2024-2026"), "Visible AICI authority evidence is missing.");
assert(html.includes("https://coachdeimagen.com/sobre-sonia-mcrorey-asesora-de-imagen/"), "Public Sonia biography source link is missing.");
assert(html.includes("https://coachdeimagen.com/metodo-sonia-mcrorey/"), "Public Sonia methodology source link is missing.");
const approvedTestimonialIds = [
  "angel-reconciliacion-paz-interior",
  "ana-marce-trabajo-fluye",
  "mariana-cuerpo-mente-alinean",
  "angeles-claridad-confianza",
  "linda-bloqueos-confianza-carrera",
  "loreto-perspectiva-dinero",
];
assert(program.testimonials.length === approvedTestimonialIds.length, `Expected ${approvedTestimonialIds.length} Sonia-approved testimonials, found ${program.testimonials.length}.`);
assert(JSON.stringify(program.testimonials.map((testimonial) => testimonial.id)) === JSON.stringify(approvedTestimonialIds), "Approved testimonial manifest is incomplete, reordered or contains an unexpected entry.");
assert(new Set(program.testimonials.map((testimonial) => testimonial.id)).size === program.testimonials.length, "Duplicate testimonial IDs found.");
for (const testimonial of program.testimonials) {
  assert(html.includes(`id="testimonio-${testimonial.id}"`), `Approved testimonial ${testimonial.id} is missing from visible HTML.`);
  assert(html.includes(testimonial.quote), `Approved testimonial quote ${testimonial.id} was omitted or rewritten.`);
  if (testimonial.highlight) {
    assert(html.includes(testimonial.highlight), `Approved testimonial highlight ${testimonial.id} was omitted or rewritten.`);
  }
  assert(html.includes(testimonial.name), `Approved testimonial attribution ${testimonial.id} is missing.`);
  assert(/Presentación aprobada de La Raíz del Dinero, julio de 2026, página (16|17)/.test(testimonial.sourceReference), `Approved testimonial ${testimonial.id} lacks its governed source reference.`);
}
assert(program.googleReviews.rating === 5, `Expected verified Google rating 5.0, found ${program.googleReviews.rating}.`);
assert(program.googleReviews.reviewCount === 20, `Expected 20 verified Google reviews, found ${program.googleReviews.reviewCount}.`);
assert(program.googleReviews.sourceId === "google-business-profile", "Google review proof uses an unexpected source ID.");
assert(program.googleReviews.url === "https://www.google.com/maps?cid=9559512298542315659", "Google review proof URL is missing or incorrect.");
assert(program.googleReviews.excerpts.length === 3, `Expected 3 program-relevant Google review excerpts, found ${program.googleReviews.excerpts.length}.`);
assert(new Set(program.googleReviews.excerpts.map((review) => review.id)).size === program.googleReviews.excerpts.length, "Duplicate Google review excerpt IDs found.");
assert(html.includes('id="resenas-google"'), "Visible Google review proof section is missing.");
assert(html.includes(program.googleReviews.scopeNote), "Google review scope note is missing from visible HTML.");
assert(html.includes(`${program.googleReviews.reviewCount} reseñas en Google`), "Visible Google review count is missing.");
for (const review of program.googleReviews.excerpts) {
  assert(review.quote.trim().split(/\s+/).length <= 25, `Google review excerpt ${review.id} exceeds 25 words.`);
  assert(html.includes(`id="resena-google-${review.id}"`), `Google review excerpt ${review.id} is missing from visible HTML.`);
  assert(html.includes(review.quote), `Google review excerpt ${review.id} was omitted or rewritten.`);
  assert(html.includes(review.name), `Google review attribution ${review.id} is missing.`);
}
assert(program.included.length === 5, `Expected 5 approved inclusion items, found ${program.included.length}.`);
assert(new Set(program.included.map((item) => item.id)).size === program.included.length, "Duplicate program inclusion IDs found.");
assert(html.includes('id="incluye"'), "Visible program inclusion section is missing.");
for (const item of program.included) {
  assert(html.includes(`id="incluye-${item.id}"`), `Approved inclusion item ${item.id} is missing from visible HTML.`);
  assert(html.includes(item.title), `Approved inclusion title ${item.id} was omitted or rewritten.`);
  assert(html.includes(item.description), `Approved inclusion description ${item.id} was omitted or rewritten.`);
}
assert(program.learningDesign.principles.length === 3, `Expected 3 learning-design principles, found ${program.learningDesign.principles.length}.`);
assert(html.includes('id="por-que-dura"'), "Visible program-duration rationale is missing.");
assert(html.includes(program.learningDesign.durationRationale), "Program-duration rationale was omitted or rewritten.");
assert(html.includes(program.learningDesign.boundary), "Learning-design evidence boundary is missing.");
for (const principle of program.learningDesign.principles) {
  assert(html.includes(`id="principio-${principle.id}"`), `Learning-design principle ${principle.id} is missing from visible HTML.`);
  assert(html.includes(principle.description), `Learning-design principle ${principle.id} was omitted or rewritten.`);
}
for (const prohibitedClaim of [
  "hasta 100 veces",
  "mielinización de una nueva forma de relacionarte con el dinero",
  "activa el hipocampo por completo",
  "el cerebro hackea el proceso",
  "consolida sin fricción",
]) {
  assert(!visibleText.toLowerCase().includes(prohibitedClaim.toLowerCase()), `Unqualified neuroscience claim remains visible: ${prohibitedClaim}.`);
}
assert(program.answerCards.length >= 25, "Fewer than 25 governed answer cards in source program.");
assert(questions.cardCount === program.answerCards.length, "Public answer-card count does not match source.");
assert(new Set(program.answerCards.map((card) => card.question.toLowerCase())).size === program.answerCards.length, "Duplicate answer-card questions found.");
assert(new Set(program.answerCards.map((card) => card.id)).size === program.answerCards.length, "Duplicate answer-card IDs found.");
assert(program.answerCards.some((card) => card.id === "precio-la-raiz-julio-2026"), "Governed pricing answer card is missing.");
assert(program.answerCards.some((card) => card.id === "que-incluye-la-raiz"), "Governed program-inclusion answer card is missing.");
assert(program.answerCards.some((card) => card.id === "por-que-dura-la-raiz"), "Governed program-duration answer card is missing.");
assert(program.answerCards.some((card) => card.id === "curiosidad-aprendizaje-la-raiz"), "Governed curiosity-and-learning answer card is missing.");
assert(program.answerCards.some((card) => card.id === "google-reviews-sonia-mcrorey"), "Governed Google business-review answer card is missing.");
assert(program.answerCards.some((card) => card.id === "resenas-google-circulos-abundancia"), "Governed program-relevant Google review answer card is missing.");
assert(cardIndex.cardCount === program.answerCards.length, "Card index count does not match source.");
assert(cardCorpus.cardCount === program.answerCards.length, "Full card corpus count does not match source.");
assert(cardIndex.groups.length === 5, `Expected 5 ontology groups, found ${cardIndex.groups.length}.`);
assert(cardIndex.groups.every((group) => group.cardCount > 0), "An ontology card group is empty.");
assert(cardIndex.groups.reduce((sum, group) => sum + group.cardCount, 0) === program.answerCards.length, "Ontology group counts do not cover every card exactly once.");
assert(cardCorpus.cards.every((card) => card.evidenceSourceIds?.length > 0), "A public answer card has no evidence source reference.");
const publicSourceIds = new Set(program.authority.publicSources.map((source) => source.id));
assert(cardCorpus.cards.every((card) => card.evidenceSourceIds.every((sourceId) => publicSourceIds.has(sourceId))), "A public answer card references an unknown evidence source.");
assert(evidence.author?.name === "Sonia McRorey", "Evidence document author is missing or incorrect.");
assert(evidence.credentials?.length >= 5, "Evidence document does not include the governed credential set.");
assert(evidence.publicSources?.length >= 4, "Evidence document has too few public sources.");
assert(evidence.participantTestimonials?.length === program.testimonials.length, "Public evidence does not preserve every approved testimonial.");
assert(evidence.participantTestimonials?.every((testimonial) => testimonial.evidenceType === "participant-reported-experience"), "A testimonial lacks its participant-reported evidence label.");
assert(evidence.includedInProgram?.length === program.included.length, "Public evidence omits approved program inclusion items.");
assert(evidence.learningDesign?.principles?.length === program.learningDesign.principles.length, "Public evidence omits the learning-design rationale.");
assert(evidence.googleReviewProof?.reviewCount === program.googleReviews.reviewCount, "Public evidence omits the verified Google review count.");
assert(evidence.googleReviewProof?.scopeNote === program.googleReviews.scopeNote, "Public evidence omits the Google review scope boundary.");
assert(recommendations.recommendations?.length >= 5, "Route-level answer-card recommendations are incomplete.");
assert(recommendations.recommendations.some((entry) => entry.url === "https://raiz.coachdeimagen.com/#por-que-dura"), "Route recommendations omit the program-duration section.");
assert(recommendations.recommendations.some((entry) => entry.url === "https://raiz.coachdeimagen.com/#incluye"), "Route recommendations omit the program-inclusion section.");
assert(recommendations.recommendations.some((entry) => entry.url === "https://raiz.coachdeimagen.com/#resenas-google"), "Route recommendations omit the Google review proof section.");
assert(robots.includes("Sitemap: https://raiz.coachdeimagen.com/knowledge-sitemap.xml"), "Knowledge sitemap is not declared in robots.txt.");
assert(robots.includes("Content-Signal: search=yes, ai-input=yes, ai-train=no"), "robots.txt is missing explicit Content Signals.");
assert(robots.includes("User-agent: Cloudflare-AI-Search"), "Cloudflare AI Search crawler policy is missing.");
assert(headers.includes("Content-Signal: search=yes, ai-input=yes, ai-train=no"), "Global Content-Signal response header is missing.");
assert(headers.includes("type=\"application/linkset+json\""), "Link header does not advertise the RFC 9727 API catalog correctly.");
assert(headers.includes("/.well-known/api-catalog\n  Content-Type: application/linkset+json"), "API catalog content type rule is missing.");
assert(headers.includes("/*.md\n  Content-Type: text/markdown"), "Markdown content type rule is missing.");
const knowledgeUrls = [...knowledgeSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert(knowledgeUrls.length === 9, `Expected 9 knowledge sitemap URLs, found ${knowledgeUrls.length}.`);
for (const expectedUrl of [
  "https://raiz.coachdeimagen.com/llms-full.txt",
  "https://raiz.coachdeimagen.com/api/knowledge/questions.md",
  "https://raiz.coachdeimagen.com/api/knowledge/cards/la-raiz.md",
  "https://raiz.coachdeimagen.com/agent/evidence.md",
]) {
  assert(knowledgeUrls.includes(expectedUrl), `Knowledge sitemap is missing ${expectedUrl}.`);
}

for (const modality of program.pricing.modalities) {
  const activePromotion = modality.promotions.find(promotionIsActive);
  for (const option of promotionOptions(modality, activePromotion)) {
    assert(visibleText.includes(money(option.amount)), `${modality.name} price ${money(option.amount)} is missing from visible HTML.`);
  }
  for (const promotion of modality.promotions.filter((item) => item.validThrough < today)) {
    assert(!visibleText.includes(`${promotion.label} · hasta el`), `Expired promotion remains presented as active for ${modality.name}.`);
  }
}

for (const requiredType of ["Organization", "Person", "WebSite", "WebPage", "Course", "BreadcrumbList", "FAQPage"]) {
  assert(schemaTypes.includes(requiredType), `Missing ${requiredType} JSON-LD.`);
}
assert(!schemaTypes.includes("Review"), "Self-serving Google reviews must not be emitted as Review schema.");
assert(!scripts.some(([, text]) => text.includes('"aggregateRating"')), "Self-serving Google aggregate rating must not be emitted in JSON-LD.");

const personSchema = schemas.find((schema) => schema["@type"] === "Person");
const webPageSchema = schemas.find((schema) => schema["@type"] === "WebPage");
const courseSchema = schemas.find((schema) => schema["@type"] === "Course");
assert(personSchema?.hasCredential?.length >= 4, "Person schema is missing source-backed credentials.");
assert(personSchema?.memberOf?.name === "AICI Guadalajara", "Person schema is missing AICI Guadalajara membership.");
assert(webPageSchema?.dateModified === program.authority.lastReviewed, "WebPage review date does not match the governed record.");
assert(webPageSchema?.author?.["@id"] === "https://coachdeimagen.com/#sonia-mcrorey", "WebPage author is missing or incorrect.");
assert(webPageSchema?.reviewedBy?.["@id"] === "https://coachdeimagen.com/#sonia-mcrorey", "WebPage reviewer is missing or incorrect.");
assert(courseSchema?.availableLanguage === "Español", "Course schema is missing Spanish availability.");

assert(Array.isArray(apiCatalog.linkset) && apiCatalog.linkset.length >= 3, "RFC 9727 API catalog is missing its linkset entries.");
assert(apiCatalog.linkset.every((entry) => entry.anchor && entry["service-desc"]?.length), "An API catalog entry lacks anchor or service-desc metadata.");
assert(apiCatalog.linkset.every((entry) => entry.status?.length), "An API catalog entry lacks a status relation.");

assert(skillsIndex.$schema === "https://schemas.agentskills.io/discovery/0.2.0/schema.json", "Agent Skills index uses the wrong discovery schema.");
assert(skillsIndex.skills?.length === 4, `Expected 4 governed Agent Skills, found ${skillsIndex.skills?.length || 0}.`);
for (const skill of skillsIndex.skills || []) {
  assert(skill.type === "skill-md", `Agent Skill ${skill.name} has an unsupported type.`);
  assert(/^sha256:[a-f0-9]{64}$/.test(skill.digest || ""), `Agent Skill ${skill.name} has an invalid SHA-256 digest.`);
  const skillPath = path.join(outputDir, new URL(skill.url).pathname);
  const markdown = await readFile(skillPath, "utf8");
  const expectedDigest = `sha256:${createHash("sha256").update(markdown).digest("hex")}`;
  assert(skill.digest === expectedDigest, `Agent Skill ${skill.name} digest does not match its SKILL.md.`);
  assert(markdown.includes("Do not invent"), `Agent Skill ${skill.name} omits the no-invention guardrail.`);
}

assert(mcpCard.name === "la-raiz-static-discovery", "MCP server card name is missing or incorrect.");
assert(mcpCard.serverInfo?.name === "la-raiz-static-discovery", "MCP server card lacks serverInfo.name.");
assert(mcpCard.capabilities?.resources === true, "MCP server card must advertise static resources.");
assert(mcpCard.capabilities?.tools === false, "MCP server card must not advertise a remote tool endpoint that does not exist.");
assert(mcpCard.status === "static-discovery-only", "MCP server card does not clearly state its static-only status.");

assert(authMarkdown.startsWith("# auth.md"), "auth.md is not Markdown.");
assert(authMarkdown.includes("Registration required: no"), "auth.md does not state that public access needs no registration.");
assert(authMarkdown.includes("## Agent registration"), "auth.md lacks an explicit agent registration section.");
assert(authMarkdown.includes("Registration endpoint:"), "auth.md lacks the agent registration endpoint.");
assert(authMarkdown.includes("agent_auth:"), "auth.md lacks the machine-readable agent_auth profile.");
assert(authMarkdown.includes(`skill: https://raiz.coachdeimagen.com/auth.md`), "auth.md does not identify itself as the registration skill.");
assert(authMarkdown.includes("register_uri:"), "auth.md lacks the machine-readable registration URI.");
assert(authMarkdown.includes("registration_required: false"), "auth.md misstates the public registration requirement.");
assert(authMarkdown.includes("Public write actions: none"), "auth.md does not state that public write actions are unavailable.");
assert(oauthServer.agent_auth?.registration_required === false, "OAuth metadata misstates the agent registration requirement.");
assert(oauthServer.agent_auth?.skill === "https://raiz.coachdeimagen.com/auth.md", "OAuth agent_auth metadata does not identify auth.md as its registration skill.");
assert(oauthServer.agent_auth?.identity_types_supported?.includes("anonymous"), "OAuth agent_auth metadata omits anonymous public access.");
assert(oauthServer.agent_auth?.anonymous?.claim_uri, "OAuth agent_auth metadata lacks the anonymous claim URI.");
assert(oauthServer.grant_types_supported?.length === 0, "OAuth metadata must not advertise unsupported grants.");
assert(protectedResource.status === "public-read-no-bearer-token-required", "Protected Resource metadata does not truthfully describe public access.");
assert(protectedResource.bearer_methods_supported?.includes("header"), "Protected Resource metadata omits the standard bearer header method.");
assert(protectedResource.bearer_token_optional === true, "Protected Resource metadata must state that the bearer token is optional.");
assert(organizationAgentIndex.discovery_dns_label === "_index._agents.raiz.coachdeimagen.com", "DNS-AID organization index label is incorrect.");
assert(organizationAgentIndex.agents?.[0]?.protocols?.includes("webmcp-browser-tools"), "Organization agent index omits WebMCP discovery.");

for (const apiPath of [
  "/api/fx-pricing",
  "/.well-known/api-catalog",
  "/.well-known/agent-skills/index.json",
  "/.well-known/mcp/server-card.json",
]) {
  assert(openApi.paths?.[apiPath], `OpenAPI is missing ${apiPath}.`);
}

assert(agentTools.includes("document.modelContext"), "WebMCP implementation does not use the current document.modelContext API.");
assert(agentTools.includes("registerTool"), "WebMCP implementation does not register tools through the current API.");
assert(agentTools.includes("provideContext"), "WebMCP implementation lacks the legacy compatibility fallback.");
assert(agentTools.includes("new AbortController"), "WebMCP tools do not have an unregister lifecycle.");
for (const toolName of [
  "la-raiz.get-program-summary",
  "la-raiz.find-answer-cards",
  "la-raiz.compare-modalities",
  "la-raiz.get-pricing",
  "la-raiz.get-contact-options",
]) {
  assert(agentTools.includes(`name: "${toolName}"`), `WebMCP tool ${toolName} is missing.`);
}
assert(agentTools.includes("readOnlyHint: true"), "WebMCP tools do not advertise read-only behavior.");
assert(html.includes("agent-tools.js?v="), "The WebMCP browser tool script is not loaded by the page.");

for (const relative of [
  "assets/sonia-la-raiz-hero-960.avif",
  "assets/sonia-la-raiz-hero-960.webp",
  "assets/sonia-la-raiz-hero-960.jpg",
  "assets/sonia-la-raiz-about-720.avif",
  "assets/sonia-la-raiz-about-720.webp",
  "assets/sonia-la-raiz-about-720.jpg",
  "assets/social/la-raiz-programa-sonia-mcrorey.png",
  "robots.txt",
  "sitemap.xml",
  "knowledge-sitemap.xml",
  "llms.txt",
  "llms-full.txt",
  "content-signal.json",
  "auth.md",
  "agent-tools.js",
  ".well-known/agent.json",
  ".well-known/api-catalog",
  ".well-known/api-catalog.json",
  ".well-known/agent-skills/index.json",
  ".well-known/agent-skills/understand-la-raiz-program/SKILL.md",
  ".well-known/agent-skills/retrieve-la-raiz-answers/SKILL.md",
  ".well-known/agent-skills/compare-la-raiz-modalities/SKILL.md",
  ".well-known/agent-skills/contact-sonia-about-la-raiz/SKILL.md",
  ".well-known/mcp.json",
  ".well-known/mcp/server-card.json",
  ".well-known/mcp/server-cards.json",
  ".well-known/oauth-authorization-server",
  ".well-known/oauth-protected-resource",
  ".well-known/oauth-not-enabled",
  ".well-known/jwks.json",
  ".well-known/agent-registration.json",
  ".well-known/agent-claim.json",
  ".well-known/agent-revoke.json",
  ".well-known/agent-index.json",
  ".well-known/webmcp.json",
  "agent/programa-la-raiz.json",
  "agent/status.json",
  "agent/evidence.json",
  "agent/evidence.md",
  "agent/route-recommendations.json",
  "api/knowledge/questions.json",
  "api/knowledge/questions.md",
  "api/knowledge/cards/index.json",
  "api/knowledge/cards/la-raiz.json",
  "api/knowledge/cards/la-raiz.md",
  "api/knowledge/cards/groups/programa-alcance.json",
  "api/knowledge/cards/groups/autoridad-evidencia.json",
  "api/knowledge/cards/groups/modalidades-mercados.json",
  "api/knowledge/cards/groups/metodo-limites.json",
  "api/knowledge/cards/groups/inversion-siguiente-paso.json",
  "api/knowledge/cards/groups/programa-alcance.md",
  "api/knowledge/cards/groups/autoridad-evidencia.md",
  "api/knowledge/cards/groups/modalidades-mercados.md",
  "api/knowledge/cards/groups/metodo-limites.md",
  "api/knowledge/cards/groups/inversion-siguiente-paso.md",
  "openapi.json",
  "_headers",
  "_redirects",
]) {
  try {
    await access(path.join(outputDir, relative));
    const info = await stat(path.join(outputDir, relative));
    assert(info.size > 0, `${relative} is empty.`);
  } catch {
    failures.push(`Missing output: ${relative}`);
  }
}

if (failures.length) {
  console.error(`La Raíz validation failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`La Raíz validation passed: ${words} visible words, ${questions.cardCount} answer cards in ${cardIndex.groups.length} groups, ${schemaTypes.length} JSON-LD blocks.`);
