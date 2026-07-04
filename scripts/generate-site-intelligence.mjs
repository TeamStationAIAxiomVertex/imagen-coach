import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SITE_URL = "https://coachdeimagen.com";
const DIST = "dist";
const AUDIT_DIR = "audit";
const TODAY = new Date().toISOString().slice(0, 10);

const OUTPUTS = {
  scoreMd: path.join(AUDIT_DIR, "site-intelligence-score.md"),
  scoreJson: path.join(AUDIT_DIR, "site-intelligence-score.json"),
  promptMap: path.join(AUDIT_DIR, "ai-visibility-prompt-map.md"),
  pageCards: path.join(AUDIT_DIR, "page-answer-card-map.md"),
  actionQueue: path.join(AUDIT_DIR, "action-queue.md"),
};

const PROMPT_GROUPS = [
  {
    id: "core-image-coaching",
    title: "Coaching de imagen",
    prompts: [
      "¿Qué es coaching de imagen?",
      "¿Cuál es la diferencia entre asesoría de imagen y coaching de imagen?",
      "¿Vale la pena contratar una coach de imagen?",
      "¿Cómo trabaja Sonia McRorey el coaching de imagen?",
    ],
    preferredRoutes: ["/coach-de-imagen", "/servicios-asesoria-de-imagen-coaching/coaching-de-imagen", "/servicios-asesoria-de-imagen-coaching"],
  },
  {
    id: "executive-presence",
    title: "Presencia ejecutiva",
    prompts: [
      "¿Cómo proyectar autoridad profesional?",
      "¿Cómo mejorar mi presencia profesional?",
      "¿Cómo verme más segura en reuniones?",
      "¿Qué es presencia ejecutiva femenina?",
    ],
    preferredRoutes: ["/presencia-ejecutiva", "/como-proyectar-autoridad", "/como-mejorar-mi-presencia-profesional", "/presencia-ejecutiva-femenina"],
  },
  {
    id: "professional-image",
    title: "Imagen profesional",
    prompts: [
      "¿Cómo verme más profesional?",
      "¿Cómo ordenar mi imagen profesional?",
      "¿Qué comunica mi ropa en el trabajo?",
      "¿Cómo elegir color y guardarropa profesional?",
    ],
    preferredRoutes: ["/imagen-profesional", "/como-verme-mas-profesional", "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen"],
  },
  {
    id: "security-positioning",
    title: "Seguridad profesional y posicionamiento",
    prompts: [
      "¿Por qué no me siento segura aunque tenga experiencia?",
      "¿Cómo dejar de sentir síndrome del impostor?",
      "¿Cómo sostener más visibilidad profesional?",
      "¿Cómo proyectar seguridad sin fingir?",
    ],
    preferredRoutes: ["/seguridad-profesional", "/inseguridad-profesional", "/servicios-asesoria-de-imagen-coaching/coaching-de-abundancia"],
  },
  {
    id: "corporate-teams",
    title: "Imagen empresarial",
    prompts: [
      "¿Cómo mejorar la imagen de un equipo comercial?",
      "¿Qué es imagen empresarial coherente?",
      "¿Sonia da talleres para empresas?",
      "¿Cómo alinear presencia, marca y colaboradores?",
    ],
    preferredRoutes: ["/servicios-asesoria-de-imagen-coaching/talleres", "/empresarias", "/comunicacion-no-verbal-ejecutiva"],
  },
  {
    id: "geo-latam",
    title: "Mercados GEO",
    prompts: [
      "Coach de imagen en Guadalajara",
      "Coach de imagen en CDMX",
      "Coach de imagen para hispanas en Miami",
      "Presencia ejecutiva para mujeres latinas",
    ],
    preferredRoutes: ["/guadalajara", "/cdmx", "/miami-hispanos", "/mexico"],
  },
];

function normalizeRoute(route) {
  if (!route) return "/";
  route = route.replace(SITE_URL, "");
  route = route.split("#")[0].split("?")[0];
  if (!route.startsWith("/")) route = `/${route}`;
  return route.replace(/\/$/, "") || "/";
}

function pct(value, max) {
  return Math.max(0, Math.min(max, value));
}

function table(headers, rows) {
  return `| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n${rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}\n`;
}

async function latestAuditJson() {
  const files = (await readdir(AUDIT_DIR))
    .filter((file) => /^full-seo-geo-crawl-audit-\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .sort()
    .reverse();
  if (!files.length) throw new Error("Run node scripts/full-seo-geo-crawl-audit.mjs before site intelligence generation.");
  const file = path.join(AUDIT_DIR, files[0]);
  return { file, data: JSON.parse(await readFile(file, "utf8")) };
}

async function loadJson(file, fallback) {
  if (!existsSync(file)) return fallback;
  return JSON.parse(await readFile(file, "utf8"));
}

function scorePage(page, routeRecommendations) {
  const rec = routeRecommendations.get(normalizeRoute(page.route));
  const uniqueLinks = new Set((page.uniqueInternalLinks || page.internalLinks || []).map(normalizeRoute));
  const imageQuality = page.images?.length
    ? page.images.filter((image) => image.hasAlt && image.alt && image.width && image.height).length / page.images.length
    : 1;
  const type = page.type;
  const hasTypeSchema =
    (type === "article" && page.articleSchema) ||
    (type === "service" && (page.serviceSchema || page.schemaTypes?.includes("ProfessionalService"))) ||
    (type === "comparison" && page.schemaTypes?.includes("WebPage")) ||
    (type === "geo" && page.schemaTypes?.includes("LocalBusiness")) ||
    ["home", "faq", "publication-hub", "pillar", "authority", "intent", "page"].includes(type);

  const metadata =
    pct(page.titleLength >= 35 && page.titleLength <= 65 ? 6 : 2, 6) +
    pct(page.descriptionLength >= 90 && page.descriptionLength <= 155 ? 6 : 2, 6) +
    pct(page.canonical?.startsWith(SITE_URL) ? 4 : 0, 4) +
    pct(page.h1s?.length === 1 && page.h1Length <= 80 ? 4 : 1, 4);

  const schema =
    pct(page.schemaValid ? 5 : 0, 5) +
    pct(page.breadcrumbSchema ? 4 : 0, 4) +
    pct(hasTypeSchema ? 5 : 0, 5) +
    pct(page.faqSchema ? 3 : 0, 3) +
    pct(page.schemaTypes?.includes("Organization") && page.schemaTypes?.includes("Person") ? 3 : 0, 3);

  const llm =
    pct(page.markdownExists ? 6 : 0, 6) +
    pct(page.wordCount >= 450 ? 5 : page.wordCount >= 250 ? 3 : 0, 5) +
    pct((page.headings || []).length >= 4 ? 4 : 1, 4) +
    pct(page.ogImage && page.twitterCard === "summary_large_image" ? 4 : 0, 4) +
    pct(rec?.relatedKnowledgeCards?.length ? 6 : 0, 6);

  const links =
    pct(uniqueLinks.size >= 8 ? 8 : uniqueLinks.size >= 5 ? 5 : uniqueLinks.size, 8) +
    pct(uniqueLinks.size <= 85 ? 4 : 1, 4) +
    pct(rec?.recommendedAnchors?.length >= 3 ? 4 : 0, 4) +
    pct((page.internalLinks || []).length >= 6 ? 4 : 0, 4);

  const media = pct(Math.round(imageQuality * 10), 10) + pct(page.ogImage ? 5 : 0, 5);
  const score = Math.round(metadata + schema + llm + links + media);

  const actions = [];
  if (metadata < 15) actions.push(["medium", "metadata", "Tighten title, description, canonical or H1 length."]);
  if (schema < 15) actions.push(["medium", "schema", "Strengthen route-specific JSON-LD and breadcrumb coverage."]);
  if (llm < 18) actions.push(["high", "llm", "Add markdown/corpus mapping/answer-card retrieval support."]);
  if (links < 14) actions.push(["medium", "links", "Add contextual anchor links to services, GEO pages, articles and answer cards."]);
  if (media < 11) actions.push(["low", "media", "Improve image alt, dimensions, OpenGraph image or page media mapping."]);

  return {
    route: normalizeRoute(page.route),
    type,
    score,
    metadata,
    schema,
    llm,
    links,
    media,
    wordCount: page.wordCount,
    uniqueInternalLinks: uniqueLinks.size,
    recommendedCards: rec?.relatedKnowledgeCards || [],
    recommendedAnchors: rec?.recommendedAnchors || [],
    actions,
  };
}

function buildActionQueue(scoredPages) {
  const actionRows = [];
  for (const page of scoredPages) {
    for (const [severity, category, message] of page.actions) {
      actionRows.push({
        severity,
        category,
        route: page.route,
        score: page.score,
        message,
      });
    }
  }
  const severityOrder = { high: 0, medium: 1, low: 2 };
  return actionRows.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity] || a.score - b.score || a.route.localeCompare(b.route));
}

function promptCoverageRows(scoredByRoute, questions) {
  const cards = questions.cards || [];
  return PROMPT_GROUPS.map((group) => {
    const groupCards = cards.filter((card) => card.layerId === group.id || group.preferredRoutes.some((route) => (card.relatedRoutes || []).some((related) => normalizeRoute(related.route) === route)));
    const routeScores = group.preferredRoutes.map((route) => scoredByRoute.get(route)?.score || 0);
    const coverage = Math.round((groupCards.length * 4) + (routeScores.reduce((sum, score) => sum + score, 0) / Math.max(1, routeScores.length)) * 0.6);
    return {
      group,
      cardCount: groupCards.length,
      avgRouteScore: Math.round(routeScores.reduce((sum, score) => sum + score, 0) / Math.max(1, routeScores.length)),
      coverage: Math.min(100, coverage),
    };
  }).sort((a, b) => a.coverage - b.coverage);
}

function mdHeader(title) {
  return `# ${title}\n\nGenerated: ${TODAY}\n\n`;
}

async function main() {
  await mkdir(AUDIT_DIR, { recursive: true });
  const { file: auditFile, data: audit } = await latestAuditJson();
  const questions = await loadJson(path.join(DIST, "api/knowledge/questions.json"), { cards: [] });
  const mesh = await loadJson(path.join(DIST, "api/knowledge/internal-link-mesh.json"), { routeRecommendations: [] });
  const routeRecommendations = new Map((mesh.routeRecommendations || []).map((item) => [normalizeRoute(item.route), item]));

  const scoredPages = audit.pages.map((page) => scorePage(page, routeRecommendations)).sort((a, b) => a.score - b.score || a.route.localeCompare(b.route));
  const scoredByRoute = new Map(scoredPages.map((page) => [page.route, page]));
  const actionQueue = buildActionQueue(scoredPages);
  const promptRows = promptCoverageRows(scoredByRoute, questions);
  const avgScore = Math.round(scoredPages.reduce((sum, page) => sum + page.score, 0) / scoredPages.length);
  const scoreBands = {
    elite: scoredPages.filter((page) => page.score >= 90).length,
    strong: scoredPages.filter((page) => page.score >= 80 && page.score < 90).length,
    watch: scoredPages.filter((page) => page.score >= 70 && page.score < 80).length,
    weak: scoredPages.filter((page) => page.score < 70).length,
  };

  const scoreJson = {
    schemaVersion: "2026-07-04.site-intelligence.v1",
    generated: TODAY,
    siteUrl: SITE_URL,
    sourceAudit: auditFile,
    routeCount: scoredPages.length,
    averageScore: avgScore,
    scoreBands,
    knowledgeCards: questions.totals?.cards || questions.cards?.length || 0,
    knowledgeLayers: questions.totals?.layers || 0,
    routeRecommendations: mesh.totals?.routes || routeRecommendations.size,
    pages: scoredPages,
    actionQueue,
    promptGroups: promptRows.map((row) => ({
      id: row.group.id,
      title: row.group.title,
      cardCount: row.cardCount,
      averageRouteScore: row.avgRouteScore,
      coverageScore: row.coverage,
      prompts: row.group.prompts,
      preferredRoutes: row.group.preferredRoutes,
    })),
  };

  await writeFile(OUTPUTS.scoreJson, `${JSON.stringify(scoreJson, null, 2)}\n`);

  const scoreMd = `${mdHeader("Site Intelligence Score")}
Source audit: \`${auditFile}\`

Average score: **${avgScore}/100**

${table(["Band", "Routes"], [
    ["Elite 90-100", scoreBands.elite],
    ["Strong 80-89", scoreBands.strong],
    ["Watch 70-79", scoreBands.watch],
    ["Weak <70", scoreBands.weak],
  ])}

## Lowest Scoring Routes

${table(["Route", "Type", "Score", "Metadata", "Schema", "LLM", "Links", "Media", "Cards"], scoredPages.slice(0, 25).map((page) => [
    page.route,
    page.type,
    page.score,
    page.metadata,
    page.schema,
    page.llm,
    page.links,
    page.media,
    page.recommendedCards.length,
  ]))}

## Strongest Routes

${table(["Route", "Type", "Score", "Cards", "Internal Links"], [...scoredPages].sort((a, b) => b.score - a.score).slice(0, 20).map((page) => [
    page.route,
    page.type,
    page.score,
    page.recommendedCards.length,
    page.uniqueInternalLinks,
  ]))}
`;

  const promptMd = `${mdHeader("AI Visibility Prompt Map")}
Purpose: Spanish prompt groups for measuring whether AI systems can retrieve Sonia McRorey as source for image coaching, executive presence, professional image and LATAM GEO intent.

${table(["Group", "Coverage", "Cards", "Avg Route Score", "Preferred Routes"], promptRows.map((row) => [
    row.group.title,
    `${row.coverage}/100`,
    row.cardCount,
    row.avgRouteScore,
    row.group.preferredRoutes.join("<br>"),
  ]))}

${promptRows.map((row) => `## ${row.group.title}

Preferred routes: ${row.group.preferredRoutes.map((route) => `\`${route}\``).join(", ")}

Prompts:
${row.group.prompts.map((prompt) => `- ${prompt}`).join("\n")}
`).join("\n")}
`;

  const pageCardsMd = `${mdHeader("Page Answer Card Map")}
Purpose: route-level preferred cards and anchors for LLM retrieval. Use this map before adding visible copy, schema, internal links or corpus cards.

${table(["Route", "Score", "Cards", "Recommended Anchors"], [...scoredPages].sort((a, b) => a.route.localeCompare(b.route)).map((page) => [
    page.route,
    page.score,
    page.recommendedCards.slice(0, 6).join("<br>") || "missing",
    page.recommendedAnchors.slice(0, 5).map((anchor) => anchor.anchor).join("<br>") || "missing",
  ]))}
`;

  const actionQueueMd = `${mdHeader("Action Queue")}
Purpose: Searchable-style execution layer. Fix high items first. Every action must preserve Sonia-only corpus governance and public UI quality.

High: ${actionQueue.filter((item) => item.severity === "high").length}
Medium: ${actionQueue.filter((item) => item.severity === "medium").length}
Low: ${actionQueue.filter((item) => item.severity === "low").length}

${table(["Priority", "Category", "Route", "Score", "Action"], actionQueue.slice(0, 150).map((item) => [
    item.severity,
    item.category,
    item.route,
    item.score,
    item.message,
  ]))}
`;

  await writeFile(OUTPUTS.scoreMd, scoreMd);
  await writeFile(OUTPUTS.promptMap, promptMd);
  await writeFile(OUTPUTS.pageCards, pageCardsMd);
  await writeFile(OUTPUTS.actionQueue, actionQueueMd);

  console.log(JSON.stringify({
    routeCount: scoredPages.length,
    averageScore: avgScore,
    scoreBands,
    actions: {
      high: actionQueue.filter((item) => item.severity === "high").length,
      medium: actionQueue.filter((item) => item.severity === "medium").length,
      low: actionQueue.filter((item) => item.severity === "low").length,
    },
    outputs: OUTPUTS,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
