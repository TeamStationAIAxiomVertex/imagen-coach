import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SITE_URL = "https://coachdeimagen.com";
const DIST = "dist";
const AUDIT_DIR = "audit";
const TODAY = new Date().toISOString().slice(0, 10);

const SERVICE_TYPES = new Set(["Service"]);
const ROUTE_TYPES = {
  service: /^\/servicios-asesoria-de-imagen-coaching/,
  article: /^\/imagen-presencia\/.+/,
  comparison: /^\/comparaciones\/.+/,
};

const FAQ_ROUTE = "/servicios-asesoria-de-imagen-coaching/preguntas-frequentes";
const PILLAR_PUBLICATION_ROUTES = new Set([
  "/imagen-presencia/rebranding-imagen-mentalidad-abundancia",
]);

const GEO_ROUTES = new Set([
  "/mexico",
  "/colombia",
  "/argentina",
  "/chile",
  "/peru",
  "/ecuador",
  "/uruguay",
  "/costa-rica",
  "/panama",
  "/republica-dominicana",
  "/guadalajara",
  "/cdmx",
  "/monterrey",
  "/queretaro",
  "/puebla",
  "/merida",
  "/tijuana",
  "/san-pedro-garza-garcia",
  "/zapopan",
  "/leon",
  "/aguascalientes",
  "/bogota",
  "/medellin",
  "/cali",
  "/barranquilla",
  "/cartagena",
  "/buenos-aires",
  "/cordoba",
  "/rosario",
  "/mendoza",
  "/santiago",
  "/vina-del-mar",
  "/las-condes",
  "/lima",
  "/san-isidro",
  "/miraflores",
  "/quito",
  "/guayaquil",
  "/montevideo",
  "/san-jose-costa-rica",
  "/panama-city",
  "/santo-domingo",
  "/miami-hispanos",
  "/houston-hispanos",
  "/dallas-hispanos",
  "/los-angeles-hispanos",
  "/san-diego-hispanos",
  "/new-york-hispanos",
]);

const AUTHORITY_ROUTES = new Set([
  "/coach-de-imagen",
  "/seguridad-profesional",
  "/metodo-sonia-mcrorey",
  "/sistema-presencia-profesional",
  "/framework-liderazgo-visible",
  "/modelo-imagen-estrategica",
  "/glosario",
]);

const INTENT_ROUTES = new Set([
  "/como-proyectar-autoridad",
  "/como-verme-mas-profesional",
  "/como-mejorar-mi-presencia-profesional",
  "/inseguridad-profesional",
  "/presencia-ejecutiva-femenina",
  "/imagen-para-mujeres-lideres",
  "/comunicacion-no-verbal-ejecutiva",
  "/imagen-ejecutiva-para-empresarias",
  "/liderazgo-visible",
  "/seguridad-profesional-femenina",
]);

function routeType(route) {
  if (route === "/") return "home";
  if (route === "/imagen-presencia") return "publication-hub";
  if (route === FAQ_ROUTE) return "faq";
  if (PILLAR_PUBLICATION_ROUTES.has(route)) return "pillar";
  if (ROUTE_TYPES.service.test(route)) return "service";
  if (ROUTE_TYPES.comparison.test(route) || route === "/comparaciones") return "comparison";
  if (GEO_ROUTES.has(route)) return "geo";
  if (AUTHORITY_ROUTES.has(route)) return "authority";
  if (INTENT_ROUTES.has(route)) return "intent";
  if (route.startsWith("/imagen-presencia/")) return "article";
  return "page";
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (entry.name.endsWith(".html")) files.push(fullPath);
  }
  return files;
}

function routeFromFile(file) {
  if (file === path.join(DIST, "index.html")) return "/";
  return `/${path.dirname(path.relative(DIST, file)).replaceAll(path.sep, "/")}`;
}

function textOnly(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function attr(block, name) {
  return block.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1] || "";
}

function words(text) {
  return (text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu) || []).length;
}

function extractJsonLd(html) {
  const entries = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(match[1]);
      const graph = parsed["@graph"] || [parsed];
      for (const item of graph) {
        const types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]].filter(Boolean);
        entries.push({ valid: true, types, item });
      }
    } catch (error) {
      entries.push({ valid: false, types: ["INVALID_JSON_LD"], error: error.message });
    }
  }
  return entries;
}

function normalizeInternalHref(href) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("https://wa.me")) return null;
  if (href.startsWith(SITE_URL)) href = href.slice(SITE_URL.length) || "/";
  if (!href.startsWith("/")) return null;
  href = href.split("#")[0].split("?")[0];
  return href.replace(/\/$/, "") || "/";
}

function extractPage(html, file) {
  const route = routeFromFile(file);
  const title = textOnly(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
  const description = attr(html.match(/<meta name="description"[^>]*>/i)?.[0] || "", "content");
  const canonical = attr(html.match(/<link rel="canonical"[^>]*>/i)?.[0] || "", "href");
  const robots = attr(html.match(/<meta name="robots"[^>]*>/i)?.[0] || "", "content");
  const ogTitle = attr(html.match(/<meta property="og:title"[^>]*>/i)?.[0] || "", "content");
  const ogDescription = attr(html.match(/<meta property="og:description"[^>]*>/i)?.[0] || "", "content");
  const ogImage = attr(html.match(/<meta property="og:image"[^>]*>/i)?.[0] || "", "content");
  const twitterCard = attr(html.match(/<meta name="twitter:card"[^>]*>/i)?.[0] || "", "content");
  const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    level: Number(match[1]),
    text: textOnly(match[2]),
  }));
  const h1s = headings.filter((heading) => heading.level === 1);
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)].map((match) => {
    const attrs = match[1];
    return {
      src: attr(attrs, "src"),
      hasAlt: /\balt=/i.test(attrs),
      alt: attr(attrs, "alt"),
      width: attr(attrs, "width"),
      height: attr(attrs, "height"),
      loading: attr(attrs, "loading"),
      decoding: attr(attrs, "decoding"),
    };
  });
  const internalLinks = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)]
    .map((match) => normalizeInternalHref(match[1]))
    .filter(Boolean);
  const schema = extractJsonLd(html);
  const schemaTypes = [...new Set(schema.flatMap((entry) => entry.types))];
  const text = textOnly(html);

  return {
    route,
    type: routeType(route),
    file,
    title,
    titleLength: title.length,
    description,
    descriptionLength: description.length,
    canonical,
    robots,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    h1s,
    h1: h1s[0]?.text || "",
    h1Length: h1s[0]?.text.length || 0,
    headings,
    images,
    internalLinks,
    uniqueInternalLinks: [...new Set(internalLinks)],
    schemaValid: schema.every((entry) => entry.valid),
    schemaTypes,
    faqSchema: schemaTypes.includes("FAQPage"),
    serviceSchema: schemaTypes.some((type) => SERVICE_TYPES.has(type)),
    articleSchema: schemaTypes.includes("Article") || schemaTypes.includes("BlogPosting"),
    breadcrumbSchema: schemaTypes.includes("BreadcrumbList"),
    imageObjectSchema: schemaTypes.includes("ImageObject"),
    wordCount: words(text),
    markdownExists: existsSync(path.join(DIST, route === "/" ? "index.md" : `${route.replace(/^\//, "")}.md`)),
  };
}

function issue(severity, route, category, message) {
  return { severity, route, category, message };
}

function pageIssues(page, routeSet) {
  const issues = [];
  const expectedCanonical = `${SITE_URL}${page.route === "/" ? "/" : page.route}`;
  if (!page.title) issues.push(issue("critical", page.route, "title", "Missing title tag."));
  if (page.titleLength > 70) issues.push(issue("high", page.route, "title", `Title too long: ${page.titleLength} chars.`));
  if (page.titleLength < 25) issues.push(issue("medium", page.route, "title", `Title likely too short: ${page.titleLength} chars.`));
  if (!page.description) issues.push(issue("critical", page.route, "meta", "Missing meta description."));
  if (page.descriptionLength > 165) issues.push(issue("high", page.route, "meta", `Meta description too long: ${page.descriptionLength} chars.`));
  if (page.descriptionLength > 0 && page.descriptionLength < 115) issues.push(issue("medium", page.route, "meta", `Meta description likely too short: ${page.descriptionLength} chars.`));
  if (page.descriptionLength > 145) issues.push(issue("low", page.route, "meta", `Meta description exceeds project 145-character target: ${page.descriptionLength} chars.`));
  if (page.h1s.length !== 1) issues.push(issue("critical", page.route, "h1", `Expected one H1, found ${page.h1s.length}.`));
  if (page.h1Length > 95) issues.push(issue("high", page.route, "h1", `H1 too long for crawler and layout clarity: ${page.h1Length} chars.`));
  if (page.h1Length > 0 && page.h1Length < 12) issues.push(issue("medium", page.route, "h1", `H1 likely too short: ${page.h1Length} chars.`));
  if (!page.canonical) issues.push(issue("critical", page.route, "canonical", "Missing canonical."));
  else if (page.canonical !== expectedCanonical) issues.push(issue("high", page.route, "canonical", `Canonical mismatch: ${page.canonical}`));
  if (/noindex/i.test(page.robots)) issues.push(issue("critical", page.route, "indexing", `Noindex detected: ${page.robots}`));
  if (!page.schemaValid) issues.push(issue("critical", page.route, "schema", "Invalid JSON-LD."));
  if (!page.breadcrumbSchema && page.route !== "/") issues.push(issue("medium", page.route, "schema", "Missing BreadcrumbList schema."));
  if (!page.faqSchema && ["service", "geo", "intent", "authority", "faq"].includes(page.type)) issues.push(issue("medium", page.route, "schema", "Missing FAQPage schema on high-intent route."));
  if (page.type === "service" && !page.serviceSchema) issues.push(issue("high", page.route, "schema", "Service route missing Service schema."));
  if (page.type === "article" && !page.articleSchema) issues.push(issue("medium", page.route, "schema", "Article route missing Article schema."));
  if (!page.ogTitle || !page.ogDescription || !page.ogImage) issues.push(issue("medium", page.route, "social", "Incomplete OpenGraph metadata."));
  if (!page.twitterCard) issues.push(issue("low", page.route, "social", "Missing Twitter card metadata."));
  if (page.wordCount < 300) issues.push(issue("high", page.route, "thin", `Visible word count under 300: ${page.wordCount}.`));
  if (page.uniqueInternalLinks.length < 6) issues.push(issue("medium", page.route, "internal-links", `Only ${page.uniqueInternalLinks.length} unique internal links.`));
  if (!page.markdownExists) issues.push(issue("low", page.route, "markdown", "Route markdown file missing for agent negotiation."));

  for (const heading of page.headings) {
    if (heading.text.length <= 3) issues.push(issue("high", page.route, "headings", `Suspicious short heading: "${heading.text}".`));
    if (/^(un|una|es|y|el|la|de)$/i.test(heading.text)) issues.push(issue("high", page.route, "headings", `Malformed article heading: "${heading.text}".`));
  }

  for (const image of page.images) {
    if (!image.src) issues.push(issue("high", page.route, "images", "Image missing src."));
    if (image.src?.startsWith("/") && !existsSync(path.join(DIST, image.src))) issues.push(issue("critical", page.route, "images", `Image file missing: ${image.src}.`));
    if (!image.hasAlt) issues.push(issue("medium", page.route, "images", `Image missing alt attribute: ${image.src}.`));
    if (!image.width || !image.height) issues.push(issue("medium", page.route, "images", `Image missing width/height: ${image.src}.`));
  }

  for (const href of page.uniqueInternalLinks) {
    if (!routeSet.has(href)) issues.push(issue("high", page.route, "internal-links", `Internal link target missing: ${href}.`));
  }

  return issues;
}

function duplicateIssues(pages, field, label) {
  const byValue = new Map();
  for (const page of pages) {
    const value = page[field];
    if (!value) continue;
    const list = byValue.get(value) || [];
    list.push(page.route);
    byValue.set(value, list);
  }
  return [...byValue.entries()]
    .filter(([, routes]) => routes.length > 1)
    .map(([value, routes]) => ({ value, routes, label }));
}

function mdTable(headers, rows) {
  if (!rows.length) return "_None._\n";
  return `| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n${rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}\n`;
}

function esc(value) {
  return String(value ?? "").replaceAll("|", "\\|").replace(/\s+/g, " ").trim();
}

function topIssues(issues, severity, limit = 80) {
  return issues.filter((item) => item.severity === severity).slice(0, limit);
}

await mkdir(AUDIT_DIR, { recursive: true });

const files = await walk(DIST);
const pages = [];
for (const file of files) {
  pages.push(extractPage(await readFile(file, "utf8"), file));
}
pages.sort((a, b) => a.route.localeCompare(b.route));

const routeSet = new Set(pages.map((page) => page.route));
const issues = pages.flatMap((page) => pageIssues(page, routeSet));
const duplicateTitles = duplicateIssues(pages, "title", "Duplicate title");
const duplicateDescriptions = duplicateIssues(pages, "description", "Duplicate meta description");
const duplicateH1s = duplicateIssues(pages, "h1", "Duplicate H1");
for (const duplicate of duplicateTitles) {
  issues.push(issue("high", duplicate.routes.join(", "), "duplicates", `Duplicate title: ${duplicate.value}`));
}
for (const duplicate of duplicateDescriptions) {
  issues.push(issue("medium", duplicate.routes.join(", "), "duplicates", `Duplicate meta description: ${duplicate.value}`));
}
for (const duplicate of duplicateH1s) {
  issues.push(issue("medium", duplicate.routes.join(", "), "duplicates", `Duplicate H1: ${duplicate.value}`));
}

const bySeverity = issues.reduce((acc, item) => {
  acc[item.severity] = (acc[item.severity] || 0) + 1;
  return acc;
}, {});
const byType = pages.reduce((acc, page) => {
  acc[page.type] = (acc[page.type] || 0) + 1;
  return acc;
}, {});
const schemaCoverage = pages.reduce((acc, page) => {
  for (const type of page.schemaTypes) acc[type] = (acc[type] || 0) + 1;
  return acc;
}, {});

const report = `# Full SEO + GEO Crawl Audit

Date: ${TODAY}
Domain: ${SITE_URL}
Built routes audited: ${pages.length}

## Summary

${mdTable(
  ["Metric", "Count"],
  [
    ["Routes", pages.length],
    ["Critical issues", bySeverity.critical || 0],
    ["High issues", bySeverity.high || 0],
    ["Medium issues", bySeverity.medium || 0],
    ["Low issues", bySeverity.low || 0],
    ["Duplicate titles", duplicateTitles.length],
    ["Duplicate descriptions", duplicateDescriptions.length],
    ["Duplicate H1s", duplicateH1s.length],
  ],
)}

## Route Type Coverage

${mdTable(["Type", "Routes"], Object.entries(byType).sort().map(([type, count]) => [type, count]))}

## Schema Coverage

${mdTable(["Schema type", "Routes"], Object.entries(schemaCoverage).sort().map(([type, count]) => [type, count]))}

## Critical Issues

${mdTable(["Route", "Category", "Issue"], topIssues(issues, "critical").map((item) => [esc(item.route), item.category, esc(item.message)]))}

## High Issues

${mdTable(["Route", "Category", "Issue"], topIssues(issues, "high", 120).map((item) => [esc(item.route), item.category, esc(item.message)]))}

## Medium Issue Sample

${mdTable(["Route", "Category", "Issue"], topIssues(issues, "medium", 120).map((item) => [esc(item.route), item.category, esc(item.message)]))}

## Title / Meta / H1 Detail

${mdTable(
  ["Route", "Type", "Title chars", "Meta chars", "H1 chars", "Words", "Links"],
  pages.map((page) => [
    esc(page.route),
    page.type,
    page.titleLength,
    page.descriptionLength,
    page.h1Length,
    page.wordCount,
    page.uniqueInternalLinks.length,
  ]),
)}

## Duplicate Titles

${mdTable(["Title", "Routes"], duplicateTitles.map((item) => [esc(item.value), esc(item.routes.join(", "))]))}

## Duplicate Descriptions

${mdTable(["Description", "Routes"], duplicateDescriptions.map((item) => [esc(item.value), esc(item.routes.join(", "))]))}

## Duplicate H1s

${mdTable(["H1", "Routes"], duplicateH1s.map((item) => [esc(item.value), esc(item.routes.join(", "))]))}

## Image Detail

${mdTable(
  ["Route", "Images", "Missing alt", "Missing dimensions", "Missing files"],
  pages.map((page) => [
    esc(page.route),
    page.images.length,
    page.images.filter((image) => !image.hasAlt).length,
    page.images.filter((image) => !image.width || !image.height).length,
    page.images.filter((image) => image.src?.startsWith("/") && !existsSync(path.join(DIST, image.src))).length,
  ]),
)}

## Recommended Fix Order

1. Fix critical indexing, canonical, JSON-LD or missing image-file issues first.
2. Fix high H1/title/headline parsing issues on article and comparison pages.
3. Fix service schema and social metadata gaps on commercial routes.
4. Tune meta descriptions into the project 115-145 character target where commercially important.
5. Increase internal contextual links on pages below 6 unique internal links.
6. Repair image alt/dimensions and wrong hero-image mappings where the audit flags asset issues.
`;

const json = {
  date: TODAY,
  domain: SITE_URL,
  routeCount: pages.length,
  issueCounts: bySeverity,
  routeTypeCoverage: byType,
  schemaCoverage,
  duplicateTitles,
  duplicateDescriptions,
  duplicateH1s,
  issues,
  pages,
};

await writeFile(path.join(AUDIT_DIR, `full-seo-geo-crawl-audit-${TODAY}.md`), report);
await writeFile(path.join(AUDIT_DIR, `full-seo-geo-crawl-audit-${TODAY}.json`), JSON.stringify(json, null, 2));

console.log(JSON.stringify({
  routeCount: pages.length,
  issueCounts: bySeverity,
  duplicateTitles: duplicateTitles.length,
  duplicateDescriptions: duplicateDescriptions.length,
  duplicateH1s: duplicateH1s.length,
  report: path.join(AUDIT_DIR, `full-seo-geo-crawl-audit-${TODAY}.md`),
  json: path.join(AUDIT_DIR, `full-seo-geo-crawl-audit-${TODAY}.json`),
}, null, 2));
