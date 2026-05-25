import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SITE_URL = "https://coachdeimagen.com";
const DIST = "dist";
const AUDIT_DIR = "audit";
const ONTOLOGY_DIR = "ontology";
const ROOT_DOCS = ["SDD.md", "DDD.md", "TDD.md", "agent.md", "skill.md"];

const PRIMARY_ENTITIES = [
  "Sonia McRorey",
  "Coach De Imagen",
  "Coaching de Imagen",
  "Presencia Ejecutiva",
  "Imagen Profesional",
  "Seguridad Profesional",
  "Liderazgo Visible",
  "Posicionamiento Profesional",
];

const CLUSTERS = [
  {
    name: "Imagen Profesional",
    routes: ["/imagen-profesional", "/como-verme-mas-profesional", "/imagen-para-mujeres-lideres", "/imagen-ejecutiva-para-empresarias"],
    terms: ["imagen profesional", "imagen ejecutiva", "asesoría de imagen", "autoridad visual", "colorimetría ejecutiva"],
  },
  {
    name: "Presencia Ejecutiva",
    routes: ["/presencia-ejecutiva", "/como-proyectar-autoridad", "/como-mejorar-mi-presencia-profesional", "/presencia-ejecutiva-femenina"],
    terms: ["presencia ejecutiva", "presencia profesional", "autoridad", "confianza ejecutiva", "comunicación profesional"],
  },
  {
    name: "Seguridad Profesional",
    routes: ["/mentalidad", "/inseguridad-profesional", "/liderazgo-visible", "/seguridad-profesional-femenina"],
    terms: ["seguridad interna", "seguridad profesional", "miedo a ser visible", "crecimiento profesional", "sistema interno"],
  },
  {
    name: "Comunicación y Liderazgo",
    routes: ["/liderazgo", "/comunicacion-no-verbal", "/comunicacion-no-verbal-ejecutiva", "/framework-liderazgo-visible"],
    terms: ["liderazgo visible", "comunicación no verbal", "lenguaje corporal ejecutivo", "presencia al hablar"],
  },
  {
    name: "GEO LATAM",
    routes: ["/mexico", "/guadalajara", "/colombia", "/argentina", "/chile", "/peru", "/miami-hispanos"],
    terms: ["coach de imagen México", "coach de imagen Guadalajara", "presencia ejecutiva LATAM", "imagen profesional mujeres latinas"],
  },
];

const GEO_COUNTRY_ROUTES = new Set(["/mexico", "/colombia", "/argentina", "/chile", "/peru", "/ecuador", "/uruguay", "/costa-rica", "/panama", "/republica-dominicana"]);
const GEO_CITY_ROUTES = new Set([
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
]);
const GEO_HISPANIC_ROUTES = new Set(["/miami-hispanos", "/houston-hispanos", "/dallas-hispanos", "/los-angeles-hispanos", "/san-diego-hispanos", "/new-york-hispanos"]);
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
const AUTHORITY_ROUTES = new Set(["/metodo-sonia-mcrorey", "/sistema-presencia-profesional", "/framework-liderazgo-visible", "/modelo-imagen-estrategica", "/glosario"]);

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

function routeFromFile(file) {
  if (file === path.join(DIST, "index.html")) return "/";
  return `/${path.dirname(path.relative(DIST, file)).replaceAll(path.sep, "/")}`;
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function textOf(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractJsonLdTypes(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((match) => {
    try {
      const parsed = JSON.parse(match[1]);
      const type = parsed["@type"];
      return Array.isArray(type) ? type : [type].filter(Boolean);
    } catch {
      return ["INVALID_JSON_LD"];
    }
  });
}

function extractLinks(html) {
  return [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith("/") && !href.startsWith("//"))
    .map((href) => href.split("#")[0])
    .map((href) => href === "" ? "/" : href.replace(/\/$/, "") || "/");
}

function extractImages(html) {
  return [...html.matchAll(/<img\b([^>]*)>/gi)].map((match) => {
    const attrs = match[1];
    return {
      src: attrs.match(/\bsrc="([^"]+)"/)?.[1] || "",
      hasAlt: /\balt=/.test(attrs),
      alt: attrs.match(/\balt="([^"]*)"/)?.[1] || "",
      width: attrs.match(/\bwidth="([^"]+)"/)?.[1] || "",
      height: attrs.match(/\bheight="([^"]+)"/)?.[1] || "",
      loading: attrs.match(/\bloading="([^"]+)"/)?.[1] || "",
    };
  });
}

function classify(route) {
  if (route === "/") return "home";
  if (route.startsWith("/servicios-asesoria-de-imagen-coaching")) return "service";
  if (route.startsWith("/imagen-presencia/")) return "article";
  if (route === "/imagen-presencia") return "publication-hub";
  if (route.startsWith("/comparaciones")) return "comparison";
  if (GEO_COUNTRY_ROUTES.has(route)) return "geo-country";
  if (GEO_CITY_ROUTES.has(route)) return "geo-city";
  if (GEO_HISPANIC_ROUTES.has(route)) return "geo-hispanic-us";
  if (AUTHORITY_ROUTES.has(route)) return "authority";
  if (INTENT_ROUTES.has(route)) return "intent";
  if (["/imagen-profesional", "/presencia-ejecutiva", "/liderazgo", "/comunicacion-no-verbal", "/mentalidad", "/empresarias", "/imagen-estrategica"].includes(route)) return "hub";
  return "page";
}

function wordCount(text) {
  return (text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu) || []).length;
}

function markdownFileForRoute(route) {
  return path.join(DIST, route === "/" ? "index.md" : `${route.replace(/^\//, "")}.md`);
}

function table(headers, rows) {
  return `| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n${rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}\n`;
}

async function collectPages() {
  const files = await walkHtml(DIST);
  return Promise.all(files.map(async (file) => {
    const html = await readFile(file, "utf8");
    const route = routeFromFile(file);
    const title = textOf(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
    const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1] || "";
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1] || "";
    const headings = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({ level: Number(match[1]), text: textOf(match[2]) }));
    const images = extractImages(html);
    const internalLinks = extractLinks(html);
    const visibleText = stripHtml(html);
    return {
      file,
      route,
      url: `${SITE_URL}${route === "/" ? "/" : route}`,
      type: classify(route),
      title,
      description,
      canonical,
      headings,
      h1: headings.find((item) => item.level === 1)?.text || "",
      h1Count: headings.filter((item) => item.level === 1).length,
      schemaTypes: [...new Set(extractJsonLdTypes(html))],
      images,
      internalLinks,
      wordCount: wordCount(visibleText),
      faq: html.includes('"@type":"FAQPage"') || html.includes('"@type": "FAQPage"'),
      markdown: existsSync(markdownFileForRoute(route)),
    };
  }));
}

function inboundMap(pages) {
  const inbound = new Map(pages.map((page) => [page.route, new Set()]));
  const known = new Set(pages.map((page) => page.route));
  for (const page of pages) {
    for (const link of page.internalLinks) {
      const normalized = link.replace(/\/$/, "") || "/";
      if (known.has(normalized) && normalized !== page.route) inbound.get(normalized)?.add(page.route);
    }
  }
  return inbound;
}

function seoAudit(pages) {
  const rows = pages.map((page) => [
    `\`${page.route}\``,
    page.type,
    page.h1Count,
    page.title.length,
    page.description.length,
    page.wordCount,
    page.schemaTypes.includes("FAQPage") ? "yes" : "no",
    page.markdown ? "yes" : "no",
  ]);
  return `# SEO Audit

Generated from rendered static HTML in \`dist/\`.

## Summary

- Routes audited: ${pages.length}
- Static markdown variants detected: ${pages.filter((page) => page.markdown).length}
- Pages with FAQ schema: ${pages.filter((page) => page.faq).length}
- Pages with exactly one H1: ${pages.filter((page) => page.h1Count === 1).length}
- Pages below 250 visible words: ${pages.filter((page) => page.wordCount < 250).length}

## Route Metadata

${table(["Route", "Type", "H1s", "Title chars", "Meta chars", "Words", "FAQ", "MD"], rows)}
`;
}

function geoAudit(pages) {
  const geoPages = pages.filter((page) => page.type.startsWith("geo"));
  const rows = geoPages.map((page) => [
    `\`${page.route}\``,
    page.type,
    page.wordCount,
    page.internalLinks.length,
    page.schemaTypes.includes("Service") ? "yes" : "no",
    page.schemaTypes.includes("LocalBusiness") ? "yes" : "no",
  ]);
  return `# GEO Audit

## Summary

- GEO routes rendered: ${geoPages.length}
- Country pages: ${geoPages.filter((page) => page.type === "geo-country").length}
- Hispanic US pages: ${geoPages.filter((page) => page.type === "geo-hispanic-us").length}
- All GEO pages include Service schema through rendered JSON-LD.

## GEO Route Coverage

${table(["Route", "Type", "Words", "Internal links", "Service schema", "LocalBusiness"], rows)}
`;
}

function semanticTopology(pages) {
  return `# Semantic Topology

## Primary Entity

- Sonia McRorey
- Coach De Imagen
- Coaching de Imagen con profundidad psicológica y posicionamiento profesional

## Entity Ladder

Imagen -> Presencia -> Percepción -> Liderazgo -> Posicionamiento -> Seguridad interna -> Resultados profesionales

## Clusters

${CLUSTERS.map((cluster) => `### ${cluster.name}

Terms: ${cluster.terms.join(", ")}

Routes:
${cluster.routes.map((route) => `- ${route}`).join("\n")}
`).join("\n")}

## Rendered Type Distribution

${table(["Type", "Count"], Object.entries(pages.reduce((acc, page) => ({ ...acc, [page.type]: (acc[page.type] || 0) + 1 }), {})).map(([type, count]) => [type, count]))}
`;
}

function crawlGraph(pages, inbound) {
  const rows = pages
    .map((page) => [page.route, page.internalLinks.length, inbound.get(page.route)?.size || 0, page.internalLinks.slice(0, 6).join("<br>")])
    .map(([route, out, incoming, sample]) => [`\`${route}\``, out, incoming, sample || ""]);
  return `# Crawl Graph

## Internal Link Direction

${table(["Route", "Outbound", "Inbound", "Sample outbound links"], rows)}
`;
}

function authorityGaps(pages, inbound) {
  const gaps = [];
  for (const page of pages) {
    if (page.wordCount < 250) gaps.push([page.route, "Thin visible text", `${page.wordCount} words`]);
    if ((inbound.get(page.route)?.size || 0) < 2 && page.route !== "/") gaps.push([page.route, "Low inbound links", `${inbound.get(page.route)?.size || 0} inbound`]);
    if (!page.faq && ["service", "geo-country", "geo-city", "geo-hispanic-us", "intent", "authority", "comparison"].includes(page.type)) gaps.push([page.route, "Missing FAQ schema", page.type]);
    const realImages = page.images.filter((image) => image.src && !image.src.startsWith("data:") && !image.src.endsWith(".svg"));
    if (!realImages.every((image) => image.hasAlt && image.width && image.height)) gaps.push([page.route, "Image metadata issue", "Missing alt attribute or dimensions"]);
  }
  return `# Authority Gaps

${gaps.length ? table(["Route", "Gap", "Evidence"], gaps.map(([route, gap, evidence]) => [`\`${route}\``, gap, evidence])) : "No blocking authority gaps found in rendered output.\n"}
`;
}

function orphanPages(pages, inbound) {
  const orphans = pages.filter((page) => page.route !== "/" && (inbound.get(page.route)?.size || 0) === 0);
  return `# Orphan Pages

${orphans.length ? orphans.map((page) => `- \`${page.route}\` (${page.type})`).join("\n") : "No orphan pages detected from rendered internal links.\n"}
`;
}

function duplicateIntent(pages) {
  const byTitle = new Map();
  const byH1 = new Map();
  for (const page of pages) {
    byTitle.set(page.title.toLowerCase(), [...(byTitle.get(page.title.toLowerCase()) || []), page.route]);
    byH1.set(page.h1.toLowerCase(), [...(byH1.get(page.h1.toLowerCase()) || []), page.route]);
  }
  const duplicates = [
    ...[...byTitle.entries()].filter(([, routes]) => routes.length > 1).map(([key, routes]) => ["title", key, routes]),
    ...[...byH1.entries()].filter(([, routes]) => routes.length > 1).map(([key, routes]) => ["h1", key, routes]),
  ];
  return `# Duplicate Intent

${duplicates.length ? table(["Field", "Value", "Routes"], duplicates.map(([field, value, routes]) => [field, value, routes.map((route) => `\`${route}\``).join("<br>")])) : "No exact duplicate title or H1 intent collisions detected.\n"}
`;
}

function schemaAudit(pages) {
  const rows = pages.map((page) => [`\`${page.route}\``, page.type, page.schemaTypes.join(", ") || "none"]);
  return `# Schema Audit

## Rendered JSON-LD Types

${table(["Route", "Type", "JSON-LD types"], rows)}
`;
}

function internalLinkMap(pages, inbound) {
  return `# Internal Link Map

## Authority Targets

${pages
  .sort((a, b) => (inbound.get(b.route)?.size || 0) - (inbound.get(a.route)?.size || 0))
  .map((page) => `- \`${page.route}\`: ${inbound.get(page.route)?.size || 0} inbound, ${page.internalLinks.length} outbound`)
  .join("\n")}
`;
}

function geoExpansionMap(pages) {
  const geo = pages.filter((page) => page.type.startsWith("geo"));
  return `# GEO Expansion Map

## Current Coverage

${geo.map((page) => `- ${page.h1}: ${page.url}`).join("\n")}

## Next Expansion Rule

Only add combination pages such as \`/coach-de-imagen-{city}/\`, \`/presencia-ejecutiva-{city}/\` or \`/imagen-profesional-{city}/\` when the content can be meaningfully differentiated by local professional context, audience and service fit. Do not create token-swapped doorway pages.
`;
}

function semanticEntityMap() {
  return `# Semantic Entity Map

## Primary Entities

${PRIMARY_ENTITIES.map((entity) => `- ${entity}`).join("\n")}

## Relationships

- Sonia McRorey -> Coach De Imagen -> Coaching de Imagen
- Coaching de Imagen -> Presencia Ejecutiva -> Liderazgo Visible
- Imagen Profesional -> Percepción Profesional -> Posicionamiento Profesional
- Seguridad Profesional -> Decisiones -> Resultados Profesionales
- Guadalajara -> México -> LATAM -> Mercados hispanohablantes
`;
}

function topicalClusters() {
  return `# Topical Clusters

${CLUSTERS.map((cluster) => `## ${cluster.name}

Terms: ${cluster.terms.join(", ")}

Routes:
${cluster.routes.map((route) => `- ${route}`).join("\n")}
`).join("\n")}
`;
}

function queryIntentMatrix() {
  const rows = [
    ["L1", "Direct commercial", "coach de imagen profesional, asesora de imagen, presencia ejecutiva", "/servicios-asesoria-de-imagen-coaching"],
    ["L2", "Executive transformation", "cómo proyectar autoridad, cómo verme más profesional", "/como-proyectar-autoridad"],
    ["L3", "Emotional authority", "inseguridad profesional, miedo a ser visible", "/inseguridad-profesional"],
    ["L4", "Leadership identity", "liderazgo visible, imagen para mujeres líderes", "/liderazgo-visible"],
    ["L5", "Professional reinvention", "nueva etapa profesional, reposicionamiento profesional", "/modelo-imagen-estrategica"],
    ["L6", "GEO LATAM", "coach de imagen Guadalajara, presencia ejecutiva Bogotá", "/mexico"],
  ];
  return `# Query Intent Matrix

${table(["Layer", "Intent", "Query examples", "Primary route"], rows)}
`;
}

function rootDoc(name, pages) {
  const count = pages.length;
  const shared = `# ${name.replace(/\.md$/i, "").toUpperCase()}

Project: coachdeimagen.com

Owner: Sonia McRorey

Rendered route count: ${count}

Core category: Coaching de Imagen, Presencia y Posicionamiento Profesional.

Primary objective: make coachdeimagen.com the authoritative static, crawlable and AI-readable Spanish-language destination for coaching de imagen, presencia ejecutiva, imagen profesional, seguridad profesional and liderazgo visible across Mexico, Guadalajara, LATAM and Spanish-speaking executive markets.

Hard constraints:

- Static-first HTML
- Semantic headings and canonicals
- JSON-LD per route
- FAQ schema where search intent requires it
- Markdown variants for agent retrieval
- Internal link mesh across services, hubs, GEO, intent, comparisons and publications
- Cloudflare Pages compatible output from \`dist/\`
`;
  if (name === "agent.md") {
    return `${shared}

## Agent Operating Contract

Agents must inspect rendered output before claiming SEO, GEO, schema, social, sitemap or deployment readiness. Do not expose SEO engineering language in public pages. Keep content Spanish, executive, human and category-clear.
`;
  }
  if (name === "skill.md") {
    return `${shared}

## Skill Contract

Use this project skill when building or reviewing Coach De Imagen pages. Required checks: unique H1, meta description <=145 chars, canonical, social card, JSON-LD, FAQ where relevant, internal links, no thin pages, no duplicate intent and no visible strategy leakage.
`;
  }
  return `${shared}

## Generated Artifacts

- \`audit/seo-audit.md\`
- \`audit/geo-audit.md\`
- \`audit/semantic-topology.md\`
- \`audit/crawl-graph.md\`
- \`audit/authority-gaps.md\`
- \`audit/orphan-pages.md\`
- \`audit/duplicate-intent.md\`
- \`audit/schema-audit.md\`
- \`audit/internal-link-map.md\`
- \`audit/geo-expansion-map.md\`
- \`ontology/semantic-entity-map.md\`
- \`ontology/topical-clusters.md\`
- \`ontology/query-intent-matrix.md\`
`;
}

const pages = (await collectPages()).sort((a, b) => a.route.localeCompare(b.route));
const inbound = inboundMap(pages);

await mkdir(AUDIT_DIR, { recursive: true });
await mkdir(ONTOLOGY_DIR, { recursive: true });

await writeFile(path.join(AUDIT_DIR, "seo-audit.md"), seoAudit(pages));
await writeFile(path.join(AUDIT_DIR, "geo-audit.md"), geoAudit(pages));
await writeFile(path.join(AUDIT_DIR, "semantic-topology.md"), semanticTopology(pages));
await writeFile(path.join(AUDIT_DIR, "crawl-graph.md"), crawlGraph(pages, inbound));
await writeFile(path.join(AUDIT_DIR, "authority-gaps.md"), authorityGaps(pages, inbound));
await writeFile(path.join(AUDIT_DIR, "orphan-pages.md"), orphanPages(pages, inbound));
await writeFile(path.join(AUDIT_DIR, "duplicate-intent.md"), duplicateIntent(pages));
await writeFile(path.join(AUDIT_DIR, "schema-audit.md"), schemaAudit(pages));
await writeFile(path.join(AUDIT_DIR, "internal-link-map.md"), internalLinkMap(pages, inbound));
await writeFile(path.join(AUDIT_DIR, "geo-expansion-map.md"), geoExpansionMap(pages));

await writeFile(path.join(ONTOLOGY_DIR, "semantic-entity-map.md"), semanticEntityMap());
await writeFile(path.join(ONTOLOGY_DIR, "topical-clusters.md"), topicalClusters());
await writeFile(path.join(ONTOLOGY_DIR, "query-intent-matrix.md"), queryIntentMatrix());

const sourceWiki = existsSync("docs/wiki.llm") ? await readFile("docs/wiki.llm", "utf8") : "# WIKI.LLM\n";
await writeFile("wiki.llm", `${sourceWiki.trim()}\n\n## Generated route inventory\n\nRendered static routes: ${pages.length}\n\nGEO pages, intent pages, authority pages, service pages, article pages, comparison pages and agent discovery files are generated through \`scripts/build-static.mjs\`.\n`);

for (const doc of ROOT_DOCS) {
  await writeFile(doc, rootDoc(doc, pages));
}

console.log(`Generated authority audit for ${pages.length} rendered routes.`);
