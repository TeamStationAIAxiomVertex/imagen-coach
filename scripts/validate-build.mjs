import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const manifest = JSON.parse(await readFile("content/clean/manifest.json", "utf8"));
const strategy = JSON.parse(await readFile("content/strategy/article-clusters.json", "utf8"));
const failures = [];
const SITE_URL = "https://imagencoach.com";
const routeSet = new Set(manifest.pages.map((page) => page.route));
const articleSet = new Set(manifest.pages.filter((page) => page.route.startsWith("/imagen-presencia/")).map((page) => page.route));
const clusteredArticles = new Set();

for (const page of manifest.pages) {
  const htmlPath = page.route === "/" ? "dist/index.html" : path.join("dist", page.route, "index.html");
  if (!existsSync(htmlPath)) failures.push(`Missing route output: ${page.route}`);
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
  if (!html.includes('lang="es-MX"')) failures.push(`Missing es-MX lang in ${file}`);
  if (!html.includes('rel="service-desc" type="application/openapi+json"')) failures.push(`Missing OpenAPI discovery link in ${file}`);
  if (!html.includes('href="https://imagencoach.com/llms-full.txt"')) failures.push(`Missing llms-full discovery link in ${file}`);
  if (!html.includes('hreflang="es-MX"')) failures.push(`Missing es-MX hreflang in ${file}`);
  const route = file === path.join("dist", "index.html") ? "/" : `/${path.dirname(path.relative("dist", file)).replaceAll(path.sep, "/")}`;
  const expectedCanonical = `${SITE_URL}${route === "/" ? "/" : route}`;
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)" \/>/);
  if (!canonicalMatch) failures.push(`Missing canonical link in ${file}`);
  else if (canonicalMatch[1] !== expectedCanonical) failures.push(`Canonical mismatch in ${file}: expected ${expectedCanonical}, got ${canonicalMatch[1]}`);
}

const sitemap = await readFile("dist/sitemap.xml", "utf8");
for (const page of manifest.pages) {
  if (!sitemap.includes(`https://imagencoach.com${page.route === "/" ? "/" : page.route}`)) {
    failures.push(`Missing sitemap URL: ${page.route}`);
  }
}

const requiredAgentFiles = [
  "dist/openapi.json",
  "dist/llms.txt",
  "dist/llms-full.txt",
  "dist/agent/site-profile.json",
  "dist/agent/services.json",
  "dist/agent/contact.json",
  "dist/agent/publications.json",
  "dist/agent/ontology.json",
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

const robots = await readFile("dist/robots.txt", "utf8");
for (const line of [
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  `OpenAPI: ${SITE_URL}/openapi.json`,
  `LLMs: ${SITE_URL}/llms.txt`,
  `LLMs-Full: ${SITE_URL}/llms-full.txt`,
  `Agent-Profile: ${SITE_URL}/agent/site-profile.json`,
]) {
  if (!robots.includes(line)) failures.push(`robots.txt missing ${line}`);
}

const redirects = await readFile("dist/_redirects", "utf8");
for (const line of [
  "https://www.imagencoach.com/*  https://imagencoach.com/:splat  301",
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
