import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const manifest = JSON.parse(await readFile("content/clean/manifest.json", "utf8"));
const strategy = JSON.parse(await readFile("content/strategy/article-clusters.json", "utf8"));
const failures = [];
const SITE_URL = "https://coachdeimagen.com";
const LEGACY_SITE_URL = "https://imagencoach.com";
const routeSet = new Set(manifest.pages.map((page) => page.route));
const articleSet = new Set(manifest.pages.filter((page) => page.route.startsWith("/imagen-presencia/")).map((page) => page.route));
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

for (const cluster of strategy.clusters) {
  if (!routeSet.has(cluster.primaryService)) failures.push(`Cluster ${cluster.id} has missing primary service: ${cluster.primaryService}`);
  for (const route of cluster.articles) {
    if (!articleSet.has(route)) failures.push(`Cluster ${cluster.id} references missing article: ${route}`);
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
  for (const headingMatch of html.matchAll(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi)) {
    if (/<strong\b/i.test(headingMatch[0])) failures.push(`Injected strong emphasis inside heading in ${file}`);
  }
  if (/<mark\b/i.test(html)) failures.push(`Injected mark emphasis leaked into ${file}`);
  if (!html.includes('lang="es-MX"')) failures.push(`Missing es-MX lang in ${file}`);
  if (!html.includes('rel="service-desc" type="application/openapi+json"')) failures.push(`Missing OpenAPI discovery link in ${file}`);
  if (!html.includes(`href="${SITE_URL}/llms-full.txt"`)) failures.push(`Missing llms-full discovery link in ${file}`);
  if (!html.includes('hreflang="es-MX"')) failures.push(`Missing es-MX hreflang in ${file}`);
  const route = file === path.join("dist", "index.html") ? "/" : `/${path.dirname(path.relative("dist", file)).replaceAll(path.sep, "/")}`;
  const expectedCanonical = `${SITE_URL}${route === "/" ? "/" : route}`;
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)" \/>/);
  if (!canonicalMatch) failures.push(`Missing canonical link in ${file}`);
  else if (canonicalMatch[1] !== expectedCanonical) failures.push(`Canonical mismatch in ${file}: expected ${expectedCanonical}, got ${canonicalMatch[1]}`);
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

for (const route of deprecatedComparisonRoutes) {
  if (sitemap.includes(`${SITE_URL}${route}`)) failures.push(`Deprecated comparison page in sitemap: ${route}`);
}

for (const sitemapFile of ["dist/blog-sitemap.xml", "dist/category-sitemap.xml", "dist/service-sitemap.xml"]) {
  if (!existsSync(sitemapFile)) failures.push(`Missing sitemap file: ${sitemapFile}`);
  else {
    const text = await readFile(sitemapFile, "utf8");
    if (!text.includes("<urlset")) failures.push(`Invalid sitemap file: ${sitemapFile}`);
  }
}

const requiredAgentFiles = [
  "dist/openapi.json",
  "dist/entities.json",
  "dist/semantic-index.json",
  "dist/llms.txt",
  "dist/llms-full.txt",
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
  if (file.endsWith(".json")) {
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

const normalizedCorpus = renderedCorpus.toLowerCase();
const executiveHitCount = requiredExecutiveTerms.reduce((count, term) => count + (normalizedCorpus.match(new RegExp(term, "g")) || []).length, 0);
const forbiddenHitCount = forbiddenDominanceTerms.reduce((count, term) => count + (normalizedCorpus.match(new RegExp(term, "g")) || []).length, 0);
if (forbiddenHitCount > executiveHitCount) {
  failures.push(`Forbidden wellness/self-help terms dominate rendered corpus: forbidden=${forbiddenHitCount}, executive=${executiveHitCount}`);
}

const robots = await readFile("dist/robots.txt", "utf8");
for (const line of [
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  `Sitemap: ${SITE_URL}/blog-sitemap.xml`,
  `Sitemap: ${SITE_URL}/category-sitemap.xml`,
  `Sitemap: ${SITE_URL}/service-sitemap.xml`,
  `OpenAPI: ${SITE_URL}/openapi.json`,
  `LLMs: ${SITE_URL}/llms.txt`,
  `LLMs-Full: ${SITE_URL}/llms-full.txt`,
  `Agent-Profile: ${SITE_URL}/agent/site-profile.json`,
]) {
  if (!robots.includes(line)) failures.push(`robots.txt missing ${line}`);
}

const homepage = await readFile("dist/index.html", "utf8");
if (!homepage.includes('src="/assets/sonia-logo-ai.png"')) failures.push("Homepage is not using the supplied Sonia logo asset");
if (homepage.includes("<small>ImagenCoach</small>")) failures.push("Legacy ImagenCoach subtitle still appears on homepage");
const aboutPage = await readFile("dist/sobre-sonia-mcrorey-asesora-de-imagen/index.html", "utf8");
if (!aboutPage.includes('src="/assets/sonia-mcrorey-about-760.avif"')) failures.push("About page is not using the supplied Sonia headshot");

const redirects = await readFile("dist/_redirects", "utf8");
for (const line of [
  `https://www.coachdeimagen.com/*  ${SITE_URL}/:splat  301`,
  `${LEGACY_SITE_URL}/*  ${SITE_URL}/:splat  301`,
  `https://www.imagencoach.com/*  ${SITE_URL}/:splat  301`,
  "/comparaciones/sonia-mcrorey-vs-gaby-vargas  /comparaciones/evolucion-coaching-imagen-mexico-latam  301",
  "/articulos/tu-color-tu-poder-el-impacto-de-la-colorimetria  /imagen-presencia/tu-color-tu-poder-el-impacto-de-la-colorimetria  301",
  "/articulos/aprende-a-resaltar-tus-proporciones  /imagen-presencia/aprende-a-resaltar-tus-proporciones  301",
  "/articulos/la-importancia-de-tu-imagen-personal  /imagen-presencia/la-importancia-de-tu-imagen-personal  301",
  "/articulos/encuentra-tu-estilo  /imagen-presencia/encuentra-tu-estilo  301",
]) {
  if (!redirects.includes(line)) failures.push(`_redirects missing ${line}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${manifest.pages.length} routes and mapped assets.`);
