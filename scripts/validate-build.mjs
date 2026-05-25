import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const manifest = JSON.parse(await readFile("content/clean/manifest.json", "utf8"));
const strategy = JSON.parse(await readFile("content/strategy/article-clusters.json", "utf8"));
const failures = [];
const SITE_URL = "https://coachdeimagen.com";
const LEGACY_SITE_URL = "https://imagencoach.com";
const routeSet = new Set(manifest.pages.map((page) => page.route));
const pillarRoutes = new Set([
  "/imagen-presencia/rebranding-imagen-mentalidad-abundancia",
]);
const articleSet = new Set(manifest.pages
  .filter((page) => page.route.startsWith("/imagen-presencia/") && !pillarRoutes.has(page.route))
  .map((page) => page.route));
const clusteredArticles = new Set();
const semanticHubRoutes = [
  "/imagen-profesional",
  "/presencia-ejecutiva",
  "/liderazgo",
  "/comunicacion-no-verbal",
  "/mentalidad",
  "/empresarias",
  "/imagen-estrategica",
];
const comparisonRoutes = [
  "/comparaciones",
  "/comparaciones/coaching-de-imagen-vs-consultoria-tradicional",
  "/comparaciones/imagen-superficial-vs-presencia-profesional",
  "/comparaciones/coaching-motivacional-vs-posicionamiento-profesional",
  "/comparaciones/styling-vs-coaching-de-imagen",
  "/comparaciones/imagen-corporativa-vs-presencia-humana",
  "/comparaciones/evolucion-coaching-imagen-mexico-latam",
];
const contactRoutes = ["/contacto"];
const expectedRoutes = new Set([...routeSet, ...semanticHubRoutes, ...comparisonRoutes, ...contactRoutes]);
const deprecatedComparisonRoutes = [
  "/comparaciones/sonia-mcrorey-vs-gaby-vargas",
];
const comparisonHeroAssets = [
  "dist/assets/generated/comparison-panorama-imagen-profesional.jpg",
  "dist/assets/generated/comparison-coaching-imagen-consultoria-tradicional.jpg",
  "dist/assets/generated/comparison-imagen-superficial-presencia-profesional.jpg",
  "dist/assets/generated/comparison-motivacion-posicionamiento-profesional.jpg",
  "dist/assets/generated/comparison-styling-coaching-imagen.jpg",
  "dist/assets/generated/comparison-imagen-corporativa-presencia-humana.jpg",
  "dist/assets/generated/comparison-evolucion-coaching-imagen-latam.jpg",
];
const rejectedHeroImageStems = [
  "a1659cc99df8e64c",
  "fa5935c4970dc82a",
  "3d87f9c0beaeac46",
  "sonia-twitter-card",
];
const requiredExecutiveTerms = [
  "coaching de imagen",
  "coaching de imagen con estructura interna",
  "presencia ejecutiva",
  "presencia profesional",
  "imagen profesional",
  "liderazgo",
  "liderazgo personal",
  "autoridad",
  "credibilidad",
  "comunicación ejecutiva",
  "posicionamiento profesional",
  "percepción profesional",
  "imagen corporativa",
  "personal branding ejecutivo",
  "seguridad interna",
];
const requiredAuthorityGraphTerms = [
  "Coaching de Imagen con profundidad psicológica y posicionamiento profesional",
  "Semantic precision + emotional sophistication + executive positioning + AI readability",
  "Imagen",
  "Presencia",
  "Percepción",
  "Liderazgo",
  "Posicionamiento",
  "Seguridad interna",
  "Resultados profesionales",
];
const forbiddenDominanceTerms = ["abundancia", "manifestación", "energía", "sanación", "bloqueos energéticos"];
let renderedCorpus = "";

for (const page of manifest.pages) {
  const htmlPath = page.route === "/" ? "dist/index.html" : path.join("dist", page.route, "index.html");
  if (!existsSync(htmlPath)) failures.push(`Missing route output: ${page.route}`);
}

for (const route of semanticHubRoutes) {
  const htmlPath = path.join("dist", route, "index.html");
  if (!existsSync(htmlPath)) failures.push(`Missing semantic hub output: ${route}`);
}

for (const route of comparisonRoutes) {
  const htmlPath = path.join("dist", route, "index.html");
  if (!existsSync(htmlPath)) failures.push(`Missing comparison page output: ${route}`);
}

for (const route of contactRoutes) {
  const htmlPath = path.join("dist", route, "index.html");
  if (!existsSync(htmlPath)) failures.push(`Missing contact page output: ${route}`);
}

for (const route of deprecatedComparisonRoutes) {
  const htmlPath = path.join("dist", route, "index.html");
  if (existsSync(htmlPath)) failures.push(`Deprecated competitor-name comparison route still renders: ${route}`);
}

for (const asset of comparisonHeroAssets) {
  if (!existsSync(asset)) failures.push(`Missing generated comparison hero asset: ${asset}`);
}
for (const asset of ["dist/assets/sonia-logo-ai.png", "dist/assets/sonia-logo-source.png", "dist/assets/sonia-mcrorey-about-760.avif"]) {
  if (!existsSync(asset)) failures.push(`Missing supplied Sonia brand asset: ${asset}`);
}
const runtimeScript = await readFile("script.js", "utf8");
if (!runtimeScript.includes("navigator.modelContext") || !runtimeScript.includes("registerTool")) {
  failures.push("Runtime script does not register WebMCP tools with navigator.modelContext.registerTool");
}
if (runtimeScript.includes("provideContext")) {
  failures.push("Runtime script still uses deprecated WebMCP provideContext path");
}

for (const cluster of strategy.clusters) {
  if (!routeSet.has(cluster.primaryService)) failures.push(`Cluster ${cluster.id} has missing primary service: ${cluster.primaryService}`);
  for (const route of cluster.articles) {
    if (!routeSet.has(route)) failures.push(`Cluster ${cluster.id} references missing content route: ${route}`);
    if (clusteredArticles.has(route)) failures.push(`Article appears in multiple clusters: ${route}`);
    clusteredArticles.add(route);
  }
}

for (const route of articleSet) {
  if (!clusteredArticles.has(route)) failures.push(`Article is not assigned to an SEO cluster: ${route}`);
}

for (const page of manifest.pages) {
  for (const image of page.images) {
    const filename = path.basename(image.local_path);
    const assetPath = path.join("dist/assets", filename);
    if (!existsSync(assetPath)) failures.push(`Missing asset ${filename} for ${page.route}`);
    else await stat(assetPath);
  }
}

async function walkHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walkHtml(fullPath)));
    else if (entry.name.endsWith(".html")) files.push(fullPath);
  }
  return files;
}

const htmlFiles = await walkHtml("dist");
const renderedRoutes = new Set(htmlFiles.map((file) => (file === path.join("dist", "index.html") ? "/" : `/${path.dirname(path.relative("dist", file)).replaceAll(path.sep, "/")}`)));
for (const route of expectedRoutes) {
  if (!renderedRoutes.has(route)) failures.push(`Expected route did not render HTML: ${route}`);
}
for (const route of renderedRoutes) {
  if (!expectedRoutes.has(route)) failures.push(`Unexpected rendered route missing from route registry: ${route}`);
}

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const junk of ["87fd0a60", "bf0dcab6", "Can't send form", "Please try again later", "Miscellaneous 234_solid", ">undefined<", "Online Therapy", "localhost", "127.0.0.1", "weblium.site"]) {
    if (html.includes(junk)) failures.push(`Junk leaked into ${file}: ${junk}`);
  }
  for (const pattern of [/\bexpresión pe\b/i, /\bhe desarrolla\b/i, /\be visten\b/i, /\bSse visten\b/]) {
    if (pattern.test(html)) failures.push(`Broken source fragment leaked into ${file}: ${pattern}`);
  }
  if (html.includes("term-highlight")) failures.push(`Visible SEO term highlighting leaked into ${file}`);
  if (html.includes("data-topic=")) failures.push(`Visible ontology data-topic markup leaked into ${file}`);
  if (html.includes(">Pilar SEO<")) failures.push(`Internal SEO label leaked into ${file}`);
  if (html.includes(">LLM</a>")) failures.push(`Internal LLM footer link leaked into ${file}`);
  for (const visibleLeak of [
    "Sistema de imagen",
    "intención de búsqueda",
    "Coaching de Imagen, Seguridad Interna y Posicionamiento Profesional",
    "Mentalidad, abundancia y poder personal",
  ]) {
    if (html.includes(visibleLeak)) failures.push(`Public semantic hierarchy leak in ${file}: ${visibleLeak}`);
  }
  const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    level: Number(match[1]),
    text: match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    raw: match[0],
  }));
  const h1s = headings.filter((heading) => heading.level === 1);
  if (h1s.length !== 1) failures.push(`Expected exactly one H1 in ${file}, found ${h1s.length}`);
  const h1Text = h1s[0]?.text;
  if (h1Text) {
    for (const heading of headings.filter((item) => item.level > 1)) {
      if (heading.text === h1Text) failures.push(`H1 duplicated as lower heading in ${file}: ${h1Text}`);
    }
  }
  const seenHeadings = new Set();
  for (const heading of headings) {
    if (heading.text.includes("...") || heading.text.includes("…")) failures.push(`Truncated heading leaked into ${file}: ${heading.text}`);
    if (/^[¿?.,;:\-–—]+$/.test(heading.text)) failures.push(`Punctuation-only heading leaked into ${file}: ${heading.text}`);
    const key = `${heading.level}:${heading.text.toLowerCase()}`;
    if (seenHeadings.has(key)) failures.push(`Duplicate H${heading.level} heading in ${file}: ${heading.text}`);
    seenHeadings.add(key);
  }
  for (const headingMatch of html.matchAll(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi)) {
    if (/<strong\b/i.test(headingMatch[0])) failures.push(`Injected strong emphasis inside heading in ${file}`);
  }
  if (/<mark\b/i.test(html)) failures.push(`Injected mark emphasis leaked into ${file}`);
  if (!html.includes('lang="es-MX"')) failures.push(`Missing es-MX lang in ${file}`);
  if (!html.includes('rel="service-desc" type="application/openapi+json"')) failures.push(`Missing OpenAPI discovery link in ${file}`);
  if (!html.includes(`href="${SITE_URL}/llms-full.txt"`)) failures.push(`Missing llms-full discovery link in ${file}`);
  if (!html.includes('hreflang="es-MX"')) failures.push(`Missing es-MX hreflang in ${file}`);
  if (/rel="stylesheet"\s+href="\/styles\.css/.test(html)) failures.push(`Rendered page still blocks on external CSS in ${file}`);
  if (/@font-face|\.ttf/i.test(html)) failures.push(`Rendered page leaks font-face or TTF dependency in ${file}`);
  const jsonLdTypes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((match) => {
    try {
      const parsed = JSON.parse(match[1]);
      return Array.isArray(parsed["@type"]) ? parsed["@type"] : [parsed["@type"]].filter(Boolean);
    } catch {
      failures.push(`Invalid JSON-LD in ${file}`);
      return [];
    }
  });
  for (const requiredType of ["Organization", "Person", "ProfessionalService", "LocalBusiness", "WebSite", "BreadcrumbList"]) {
    if (!jsonLdTypes.includes(requiredType)) failures.push(`Missing ${requiredType} JSON-LD in ${file}`);
  }
  const routeForSchema = file === path.join("dist", "index.html") ? "/" : `/${path.dirname(path.relative("dist", file)).replaceAll(path.sep, "/")}`;
  if (routeForSchema.startsWith("/servicios-asesoria-de-imagen-coaching") && routeForSchema !== "/servicios-asesoria-de-imagen-coaching/preguntas-frequentes" && !jsonLdTypes.includes("Service")) {
    failures.push(`Service page missing Service JSON-LD in ${file}`);
  }
  if (articleSet.has(routeForSchema) && !jsonLdTypes.includes("Article")) failures.push(`Article page missing Article JSON-LD in ${file}`);
  if ((routeForSchema === "/contacto" || routeForSchema === "/servicios-asesoria-de-imagen-coaching/preguntas-frequentes" || routeForSchema.startsWith("/comparaciones")) && !jsonLdTypes.includes("FAQPage")) {
    failures.push(`FAQ-intent page missing FAQPage JSON-LD in ${file}`);
  }
  const visibleWords = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minWords = articleSet.has(routeForSchema) ? 500 : 250;
  if (visibleWords < minWords) failures.push(`Thin rendered page in ${file}: ${visibleWords} words`);
  for (const imgMatch of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = imgMatch[1];
    if (!/\bwidth="[^"]+"/.test(attrs) || !/\bheight="[^"]+"/.test(attrs)) failures.push(`Image missing fixed dimensions in ${file}: ${imgMatch[0].slice(0, 140)}`);
    if (!/\bdecoding="async"/.test(attrs)) failures.push(`Image missing async decoding in ${file}: ${imgMatch[0].slice(0, 140)}`);
    const src = attrs.match(/\bsrc="([^"]+)"/)?.[1];
    if (src?.startsWith("/assets/optimized/") && !existsSync(path.join("dist", src))) failures.push(`Optimized image referenced but not generated in ${file}: ${src}`);
  }
  const heroFigure = html.match(/<figure class="hero-media">([\s\S]*?)<\/figure>/i)?.[1] || "";
  if (heroFigure) {
    const heroImgAttrs = heroFigure.match(/<img\b([^>]*)>/i)?.[1] || "";
    if (!/fetchpriority="high"/.test(heroImgAttrs)) failures.push(`Hero image missing high fetchpriority in ${file}`);
    if (!/\bwidth="[^"]+"/.test(heroImgAttrs) || !/\bheight="[^"]+"/.test(heroImgAttrs)) failures.push(`Hero image missing dimensions in ${file}`);
    const heroSrc = heroImgAttrs.match(/\bsrc="([^"]+)"/)?.[1] || "";
    if (/\.(jpe?g|png|webp)$/i.test(heroSrc) && !heroSrc.startsWith("/assets/optimized/") && !heroSrc.includes("sonia-logo")) {
      failures.push(`Hero raster image is not using optimized delivery in ${file}: ${heroSrc}`);
    }
    for (const rejectedStem of rejectedHeroImageStems) {
      if (heroSrc.includes(rejectedStem)) failures.push(`Rejected hero image leaked into ${file}: ${heroSrc}`);
    }
  }
  const structuredIntroCount = (html.match(/class="[^"]*\bstructured-intro\b/g) || []).length;
  const semanticCardCount = (html.match(/class="semantic-card/g) || []).length;
  const openSemanticCardCount = (html.match(/class="semantic-card[^"]*"[^>]*\sopen\b/g) || []).length;
  const faqAnswerCount = (html.match(/class="faq-answer-card/g) || []).length;
  const routeForDensity = file === path.join("dist", "index.html") ? "/" : `/${path.dirname(path.relative("dist", file)).replaceAll(path.sep, "/")}`;
  if (routeForDensity === "/imagen-presencia" && structuredIntroCount > 0) failures.push("Publication hub should not render migrated essay body as structured intro");
  if (routeForDensity.startsWith("/servicios-asesoria-de-imagen-coaching") && routeForDensity !== "/servicios-asesoria-de-imagen-coaching/preguntas-frequentes" && openSemanticCardCount > 1) {
    failures.push(`Too many open service content cards in ${file}: ${openSemanticCardCount}`);
  }
  if (routeForDensity === "/servicios-asesoria-de-imagen-coaching/preguntas-frequentes" && faqAnswerCount < 8) failures.push("FAQ page did not render the answer-card structure");
  if (routeForDensity === "/servicios-asesoria-de-imagen-coaching/preguntas-frequentes" && semanticCardCount > 0) failures.push("FAQ page should not render generic semantic cards");
  if (pillarRoutes.has(routeForDensity)) {
    if (!/class="[^"]*\brebrand-framework\b/.test(html)) failures.push(`Pillar page missing rebrand framework: ${file}`);
    if (!/class="[^"]*\bcredential-timeline\b/.test(html)) failures.push(`Pillar page missing credential timeline: ${file}`);
    if (!html.includes("/assets/sonia-mcrorey-about-760.avif")) failures.push(`Pillar page missing Sonia authority image: ${file}`);
    if (jsonLdTypes.includes("Article")) failures.push(`Pillar page should not render Article JSON-LD: ${file}`);
  }
  if (articleSet.has(routeForDensity)) {
    if (!/class="[^"]*\barticle-reading-map\b/.test(html)) failures.push(`Article missing reading map navigation: ${file}`);
    if (!/class="[^"]*\barticle-layout\b/.test(html)) failures.push(`Article missing editorial layout: ${file}`);
    if (!/<div class="article-copy">\s*<p>/.test(html)) failures.push(`Article body is not rendering as prose paragraphs: ${file}`);
    if (/<div class="article-copy">[\s\S]*?class="insight-step"/.test(html)) failures.push(`Article body leaked service-style insight cards: ${file}`);
    if (/<div class="article-copy">[\s\S]*?class="signal-list"/.test(html)) failures.push(`Article body leaked service-style signal lists: ${file}`);
  }
  const route = file === path.join("dist", "index.html") ? "/" : `/${path.dirname(path.relative("dist", file)).replaceAll(path.sep, "/")}`;
  const expectedCanonical = `${SITE_URL}${route === "/" ? "/" : route}`;
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)" \/>/);
  if (!canonicalMatch) failures.push(`Missing canonical link in ${file}`);
  else if (canonicalMatch[1] !== expectedCanonical) failures.push(`Canonical mismatch in ${file}: expected ${expectedCanonical}, got ${canonicalMatch[1]}`);
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const metaDescriptionMatch = html.match(/<meta name="description" content="([^"]*)" \/>/i);
  if (!titleMatch) failures.push(`Missing title in ${file}`);
  else {
    const titleText = titleMatch[1].replace(/&amp;/g, "&").replace(/&quot;/g, "\"").trim();
    if (titleText.length > 64) failures.push(`SEO title too long in ${file}: ${titleText.length} characters`);
  }
  if (!metaDescriptionMatch) failures.push(`Missing meta description in ${file}`);
  else {
    const descriptionText = metaDescriptionMatch[1].replace(/&amp;/g, "&").replace(/&quot;/g, "\"").trim();
    if (descriptionText.length > 145) failures.push(`Meta description too long in ${file}: ${descriptionText.length} characters`);
    if (descriptionText.length < 50) failures.push(`Meta description too short in ${file}: ${descriptionText.length} characters`);
  }
  const socialSlug = route === "/" ? "inicio" : route.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
  const expectedSocialImage = `${SITE_URL}/assets/social/${socialSlug}.png`;
  const socialImagePath = path.join("dist", "assets", "social", `${socialSlug}.png`);
  for (const socialTag of [
    '<meta name="twitter:card" content="summary_large_image" />',
    '<meta name="twitter:title"',
    '<meta name="twitter:description"',
    '<meta name="twitter:image"',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
  ]) {
    if (!html.includes(socialTag)) failures.push(`Missing social metadata in ${file}: ${socialTag}`);
  }
  if (!html.includes(`content="${expectedSocialImage}"`)) failures.push(`Social image URL mismatch in ${file}: expected ${expectedSocialImage}`);
  if (!existsSync(socialImagePath)) failures.push(`Missing generated social card for ${route}: ${socialImagePath}`);
  renderedCorpus += ` ${html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")}`;
}

const sitemap = await readFile("dist/sitemap.xml", "utf8");
if (sitemap.includes(`${LEGACY_SITE_URL}/`)) failures.push("Sitemap still contains legacy imagencoach.com host");
for (const page of manifest.pages) {
  if (!sitemap.includes(`${SITE_URL}${page.route === "/" ? "/" : page.route}`)) {
    failures.push(`Missing sitemap URL: ${page.route}`);
  }
}
for (const route of semanticHubRoutes) {
  if (!sitemap.includes(`${SITE_URL}${route}`)) failures.push(`Missing semantic hub in sitemap: ${route}`);
}
for (const route of comparisonRoutes) {
  if (!sitemap.includes(`${SITE_URL}${route}`)) failures.push(`Missing comparison page in sitemap: ${route}`);
}
for (const route of contactRoutes) {
  if (!sitemap.includes(`${SITE_URL}${route}`)) failures.push(`Missing contact page in sitemap: ${route}`);
}

for (const route of deprecatedComparisonRoutes) {
  if (sitemap.includes(`${SITE_URL}${route}`)) failures.push(`Deprecated comparison page in sitemap: ${route}`);
}

for (const sitemapFile of ["dist/blog-sitemap.xml", "dist/category-sitemap.xml", "dist/service-sitemap.xml"]) {
  if (!existsSync(sitemapFile)) failures.push(`Missing sitemap file: ${sitemapFile}`);
  else {
    const text = await readFile(sitemapFile, "utf8");
    if (!text.includes("<urlset")) failures.push(`Invalid sitemap file: ${sitemapFile}`);
    if (text.includes(`${LEGACY_SITE_URL}/`)) failures.push(`${sitemapFile} still contains legacy imagencoach.com host`);
  }
}
const blogSitemap = existsSync("dist/blog-sitemap.xml") ? await readFile("dist/blog-sitemap.xml", "utf8") : "";
for (const route of articleSet) {
  if (!blogSitemap.includes(`${SITE_URL}${route}`)) failures.push(`Missing article in blog sitemap: ${route}`);
}

const requiredAgentFiles = [
  "dist/openapi.json",
  "dist/api-catalog.json",
  "dist/content-signal.json",
  "dist/entities.json",
  "dist/semantic-index.json",
  "dist/llms.txt",
  "dist/llms-full.txt",
  "dist/.well-known/api-catalog",
  "dist/.well-known/api-catalog.json",
  "dist/.well-known/agent.json",
  "dist/.well-known/agent-skills.json",
  "dist/.well-known/agent-skills/index.json",
  "dist/.well-known/mcp.json",
  "dist/.well-known/mcp/server-card.json",
  "dist/.well-known/mcp/server-cards.json",
  "dist/.well-known/http-message-signatures-directory",
  "dist/.well-known/oauth-authorization-server",
  "dist/.well-known/openid-configuration",
  "dist/.well-known/oauth-protected-resource",
  "dist/.well-known/oauth-not-enabled",
  "dist/.well-known/jwks.json",
  "dist/agent/site-profile.json",
  "dist/agent/services.json",
  "dist/agent/contact.json",
  "dist/agent/comparisons.json",
  "dist/agent/publications.json",
  "dist/agent/ontology.json",
  "dist/agent/semantic-hubs.json",
  "dist/agent/wordpress-ingestion.json",
  "dist/agent/search-intent-terms.json",
  "dist/agent/page-signals.json",
  "dist/agent/redirects.json",
  "dist/agent/conversion-map.json",
];
for (const file of requiredAgentFiles) {
  if (!existsSync(file)) {
    failures.push(`Missing agentic file: ${file}`);
    continue;
  }
  if (file.endsWith(".json") || file.includes(".well-known/api-catalog") || file.includes(".well-known/http-message-signatures-directory") || file.includes(".well-known/oauth-") || file.includes(".well-known/openid-configuration")) {
    const jsonText = await readFile(file, "utf8");
    for (const forbiddenHost of ["localhost", "127.0.0.1", "weblium.site"]) {
      if (jsonText.includes(forbiddenHost)) failures.push(`Host leakage in ${file}: ${forbiddenHost}`);
    }
    try {
      JSON.parse(jsonText);
    } catch (error) {
      failures.push(`Invalid JSON in ${file}: ${error.message}`);
    }
  }
}

for (const file of ["dist/entities.json", "dist/semantic-index.json", "dist/agent/site-profile.json", "dist/agent/ontology.json", "dist/agent/comparisons.json"]) {
  if (!existsSync(file)) continue;
  const text = await readFile(file, "utf8");
  if (!text.includes("Coaching de Imagen, Presencia y Posicionamiento Profesional")) failures.push(`${file} missing primary holistic image coaching classification`);
  for (const term of requiredExecutiveTerms) {
    if (!text.toLowerCase().includes(term.toLowerCase())) failures.push(`${file} missing executive semantic term: ${term}`);
  }
  for (const term of requiredAuthorityGraphTerms) {
    if (!text.includes(term)) failures.push(`${file} missing semantic authority graph term: ${term}`);
  }
}

if (existsSync("dist/agent/search-intent-terms.json")) {
  const searchIntent = JSON.parse(await readFile("dist/agent/search-intent-terms.json", "utf8"));
  const layers = searchIntent.masterIntentModel || [];
  const layerIds = layers.map((layer) => layer.id);
  for (const id of ["L1", "L2", "L3", "L4", "L5", "L6", "L7"]) {
    if (!layerIds.includes(id)) failures.push(`Search intent matrix missing layer ${id}`);
  }
  const intentCorpus = JSON.stringify(searchIntent).toLowerCase();
  for (const term of ["coach de imagen guadalajara", "miedo a ser visible profesionalmente", "cómo proyectar autoridad", "sistema nervioso y liderazgo", "imagen profesional para empresarias"]) {
    if (!intentCorpus.includes(term)) failures.push(`Search intent matrix missing term: ${term}`);
  }
  if (!Array.isArray(searchIntent.pageTargets) || searchIntent.pageTargets.length < 8) failures.push("Search intent matrix missing page targets");
}

const normalizedCorpus = renderedCorpus.toLowerCase();
const executiveHitCount = requiredExecutiveTerms.reduce((count, term) => count + (normalizedCorpus.match(new RegExp(term, "g")) || []).length, 0);
const forbiddenHitCount = forbiddenDominanceTerms.reduce((count, term) => count + (normalizedCorpus.match(new RegExp(term, "g")) || []).length, 0);
if (forbiddenHitCount > executiveHitCount) {
  failures.push(`Forbidden wellness/self-help terms dominate rendered corpus: forbidden=${forbiddenHitCount}, executive=${executiveHitCount}`);
}

const robots = await readFile("dist/robots.txt", "utf8");
if (robots.includes(`${LEGACY_SITE_URL}/`)) failures.push("robots.txt still points to legacy imagencoach.com host");
for (const line of [
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  `Sitemap: ${SITE_URL}/blog-sitemap.xml`,
  `Sitemap: ${SITE_URL}/category-sitemap.xml`,
  `Sitemap: ${SITE_URL}/service-sitemap.xml`,
  "Content-Signal: search=yes, ai-input=yes, ai-train=no",
]) {
  if (!robots.includes(line)) failures.push(`robots.txt missing ${line}`);
}
for (const invalidDirective of ["OpenAPI:", "API-Catalog:", "LLMs:", "LLMs-Full:", "Agent-Profile:", "Agent-Card:"]) {
  if (robots.includes(invalidDirective)) failures.push(`robots.txt contains non-standard directive ${invalidDirective}`);
}

const homepage = await readFile("dist/index.html", "utf8");
if (!homepage.includes('src="/assets/sonia-logo-ai.png"')) failures.push("Homepage is not using the supplied Sonia logo asset");
if (!homepage.includes('src="/assets/script-')) failures.push("Homepage is not using a versioned runtime script asset");
if (homepage.includes("<small>ImagenCoach</small>")) failures.push("Legacy ImagenCoach subtitle still appears on homepage");
const aboutPage = await readFile("dist/sobre-sonia-mcrorey-asesora-de-imagen/index.html", "utf8");
if (!aboutPage.includes('src="/assets/sonia-mcrorey-about-760.avif"')) failures.push("About page is not using the supplied Sonia headshot");

const redirects = await readFile("dist/_redirects", "utf8");
const headers = await readFile("dist/_headers", "utf8");
const agentRedirects = JSON.parse(await readFile("dist/agent/redirects.json", "utf8"));
for (const line of [
  "/assets/*",
  "Cache-Control: public, max-age=31536000, immutable",
  "/styles.css",
  "/script.js",
  "Cache-Control: public, max-age=600, stale-while-revalidate=86400",
]) {
  if (!headers.includes(line)) failures.push(`_headers missing performance cache rule: ${line}`);
}
for (const absoluteSource of ["https://", "http://"]) {
  if (redirects.includes(absoluteSource)) failures.push(`_redirects contains unsupported absolute source URL: ${absoluteSource}`);
}
for (const rule of [
  ["https://www.coachdeimagen.com/", `${SITE_URL}/`, 301],
  ["https://www.coachdeimagen.com/*", `${SITE_URL}/:splat`, 301],
  [`${LEGACY_SITE_URL}/`, `${SITE_URL}/`, 301],
  [`${LEGACY_SITE_URL}/sitemap_pages.xml`, `${SITE_URL}/sitemap.xml`, 301],
  [`${LEGACY_SITE_URL}/imagen-presencia/sitemap.xml`, `${SITE_URL}/blog-sitemap.xml`, 301],
  [`${LEGACY_SITE_URL}/*`, `${SITE_URL}/:splat`, 301],
  ["https://www.imagencoach.com/", `${SITE_URL}/`, 301],
  ["https://www.imagencoach.com/sitemap_pages.xml", `${SITE_URL}/sitemap.xml`, 301],
  ["https://www.imagencoach.com/imagen-presencia/sitemap.xml", `${SITE_URL}/blog-sitemap.xml`, 301],
  ["https://www.imagencoach.com/*", `${SITE_URL}/:splat`, 301],
]) {
  const found = agentRedirects.redirects?.some((redirect) => redirect.from === rule[0] && redirect.to === rule[1] && redirect.status === rule[2]);
  if (!found) failures.push(`agent redirect manifest missing host rule: ${rule.join(" -> ")}`);
}
for (const line of [
  "/sitemap_pages.xml  /sitemap.xml  301",
  "/imagen-presencia/sitemap.xml  /blog-sitemap.xml  301",
  "/comparaciones/sonia-mcrorey-vs-gaby-vargas  /comparaciones/evolucion-coaching-imagen-mexico-latam  301",
  "/articulos/tu-color-tu-poder-el-impacto-de-la-colorimetria  /imagen-presencia/tu-color-tu-poder-el-impacto-de-la-colorimetria  301",
  "/articulos/aprende-a-resaltar-tus-proporciones  /imagen-presencia/aprende-a-resaltar-tus-proporciones  301",
  "/articulos/la-importancia-de-tu-imagen-personal  /imagen-presencia/la-importancia-de-tu-imagen-personal  301",
  "/articulos/encuentra-tu-estilo  /imagen-presencia/encuentra-tu-estilo  301",
]) {
  if (!redirects.includes(line)) failures.push(`_redirects missing ${line}`);
}

for (const route of expectedRoutes) {
  const legacyUrl = `${LEGACY_SITE_URL}${route === "/" ? "/" : route}`;
  const targetUrl = `${SITE_URL}${route === "/" ? "/" : route}`;
  const coveredByWildcard = agentRedirects.redirects?.some((redirect) => redirect.from === `${LEGACY_SITE_URL}/*` && redirect.to === `${SITE_URL}/:splat` && redirect.status === 301);
  const exactRule = agentRedirects.redirects?.some((redirect) => redirect.from === legacyUrl && redirect.to === targetUrl && redirect.status === 301);
  if (!coveredByWildcard && !exactRule) {
    failures.push(`Legacy domain route is not covered by redirect contract: ${legacyUrl}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${expectedRoutes.size} routes and mapped assets.`);
