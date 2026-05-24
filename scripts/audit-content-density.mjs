import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const manifest = JSON.parse(await readFile("content/clean/manifest.json", "utf8"));
const strategy = JSON.parse(await readFile("content/strategy/article-clusters.json", "utf8"));

const serviceRoutes = new Set([
  "/servicios-asesoria-de-imagen-coaching",
  "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen",
  "/servicios-asesoria-de-imagen-coaching/coaching-de-imagen",
  "/servicios-asesoria-de-imagen-coaching/talleres",
  "/servicios-asesoria-de-imagen-coaching/coaching-de-abundancia",
]);
const supportRoutes = new Set([
  "/",
  "/sobre-sonia-mcrorey-asesora-de-imagen",
  "/servicios-asesoria-de-imagen-coaching/preguntas-frequentes",
]);
const hubRoutes = new Set([
  "/imagen-presencia",
  "/imagen-profesional",
  "/presencia-ejecutiva",
  "/liderazgo",
  "/comunicacion-no-verbal",
  "/mentalidad",
  "/empresarias",
  "/imagen-estrategica",
]);
const comparisonPrefix = "/comparaciones";
const articlePrefix = "/imagen-presencia/";

const budgets = {
  commercial: { targetMin: 300, targetMax: 1200, paragraphMaxWords: 55 },
  hub: { targetMin: 450, targetMax: 900, paragraphMaxWords: 50 },
  comparison: { targetMin: 650, targetMax: 1100, paragraphMaxWords: 52 },
  faq: { targetMin: 900, targetMax: 1900, paragraphMaxWords: 70 },
  article: { targetMin: 500, targetMax: null, paragraphMaxWords: 85 },
};

const weightedTerms = [
  "presencia",
  "liderazgo",
  "claridad",
  "coherencia",
  "seguridad",
  "posicionamiento",
  "imagen",
  "decisiones",
];

function wordCount(value = "") {
  return (value.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu) || []).length;
}

function stripFrontMatter(markdown = "") {
  return markdown.replace(/^---[\s\S]*?---\s*/u, "");
}

function stripMarkdown(value = "") {
  return value
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[#>*_`~|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function classifyRoute(route) {
  if (route.startsWith(articlePrefix)) return "article";
  if (route.startsWith(comparisonPrefix)) return "comparison";
  if (route.endsWith("/preguntas-frequentes")) return "faq";
  if (serviceRoutes.has(route) || supportRoutes.has(route)) return "commercial";
  if (hubRoutes.has(route)) return "hub";
  return "commercial";
}

function cleanLines(markdown = "") {
  return stripFrontMatter(markdown)
    .split(/\r?\n/)
    .map((line) => stripMarkdown(line))
    .filter(Boolean)
    .filter((line) => !/^https?:\/\//i.test(line));
}

async function pageMetrics(page) {
  const markdown = await readFile(page.clean_path, "utf8");
  const type = classifyRoute(page.route);
  const budget = budgets[type];
  const renderedPath = page.route === "/" ? "dist/index.html" : path.join("dist", page.route, "index.html");
  const renderedHtml = existsSync(renderedPath) ? await readFile(renderedPath, "utf8") : "";
  const renderedMain = renderedHtml.match(/<main[\s\S]*?<\/main>/i)?.[0] || "";
  const renderedText = renderedMain
    ? renderedMain.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    : "";
  const lines = renderedText ? renderedText.split(/(?<=[.!?])\s+|\n+/u).map((line) => line.trim()).filter(Boolean) : cleanLines(markdown);
  const body = renderedText || lines.join("\n");
  const lineWordCounts = lines.map(wordCount);
  const longLines = lineWordCounts.filter((count) => count > budget.paragraphMaxWords).length;
  const repeatedTerms = Object.fromEntries(weightedTerms.map((term) => {
    const matches = body.toLowerCase().match(new RegExp(`\\b${term}\\b`, "g"));
    return [term, matches ? matches.length : 0];
  }));
  const totalWords = wordCount(body);
  const overload = budget.targetMax && totalWords > budget.targetMax;
  const sparse = totalWords < budget.targetMin;
  const cluster = strategy.clusters.find((item) => item.articles.includes(page.route));
  return {
    route: page.route,
    type,
    title: page.title,
    words: totalWords,
    cleanLines: lines.length,
    longLines,
    paragraphMaxWords: budget.paragraphMaxWords,
    targetMax: budget.targetMax,
    targetMin: budget.targetMin,
    status: overload ? "overloaded" : sparse ? "thin" : "within-budget",
    repeatedTerms,
    cluster: cluster?.label || "",
    measuredSource: renderedText ? "rendered-main" : "clean-source",
  };
}

function topTerms(metrics) {
  return Object.entries(metrics.repeatedTerms)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([term, count]) => `${term} (${count})`)
    .join(", ");
}

function row(metrics) {
  const max = metrics.targetMax ? `${metrics.targetMin}-${metrics.targetMax}` : `${metrics.targetMin}+`;
  return `| \`${metrics.route}\` | ${metrics.type} | ${metrics.words} | ${max} | ${metrics.longLines} | ${metrics.status} | ${topTerms(metrics)} |`;
}

function nextAction(metrics) {
  if (metrics.type === "article") {
    return "Keep long-form depth on this route; improve reading map, pull quotes, service bridge, related articles and CTA cadence without compressing Sonia's argument into a sales page.";
  }
  if (metrics.status === "overloaded") {
    return "Compress visible commercial copy into decision modules, process visuals, outcome cards, FAQ answers and article links. Move extended depth to related article routes.";
  }
  if (metrics.status === "thin") {
    return "Keep concise, but add enough direct answer structure, FAQ coverage and related links to make the page citeable.";
  }
  return "Preserve budget; improve visual hierarchy, CTA bridge and semantic uniqueness.";
}

const metrics = await Promise.all(manifest.pages.map(pageMetrics));
const byRisk = [...metrics].sort((a, b) => {
  const aScore = (a.status === "overloaded" ? 10000 : 0) + a.words + a.longLines * 50;
  const bScore = (b.status === "overloaded" ? 10000 : 0) + b.words + b.longLines * 50;
  return bScore - aScore;
});
const commercialOverload = metrics.filter((item) => item.type !== "article" && item.status === "overloaded");
const articleCount = metrics.filter((item) => item.type === "article").length;

const report = `# Content Density Audit

Generated from \`content/clean/manifest.json\` and \`content/clean/pages/*.md\`.

## Objective

Reduce cognitive load on commercial and hub pages without deleting Sonia's authority layer.

- Commercial pages become short, visual, decision-oriented conversion pages.
- Hub pages organize services, articles, FAQs and topic clusters.
- Article pages keep long-form depth and support SEO/GEO long-tail authority.

## Current Corpus

- Total routes: ${metrics.length}
- Article routes: ${articleCount}
- Non-article overloaded routes: ${commercialOverload.length}
- Highest-risk route: \`${byRisk[0].route}\` (${byRisk[0].words} words, ${byRisk[0].longLines} long lines)

## Budgets

| Page type | Target words | Paragraph max before redesign |
| --- | ---: | ---: |
| Commercial | ${budgets.commercial.targetMin}-${budgets.commercial.targetMax} | ${budgets.commercial.paragraphMaxWords} words |
| Hub | ${budgets.hub.targetMin}-${budgets.hub.targetMax} | ${budgets.hub.paragraphMaxWords} words |
| FAQ | ${budgets.faq.targetMin}-${budgets.faq.targetMax} | ${budgets.faq.paragraphMaxWords} words |
| Comparison | ${budgets.comparison.targetMin}-${budgets.comparison.targetMax} | ${budgets.comparison.paragraphMaxWords} words |
| Article | ${budgets.article.targetMin}+ | ${budgets.article.paragraphMaxWords} words |

## Route Audit

| Route | Type | Words | Target | Long lines | Status | Repeated semantic terms |
| --- | ---: | ---: | ---: | ---: | --- | --- |
${byRisk.map(row).join("\n")}

## Priority Actions

${byRisk.slice(0, 12).map((item, index) => `${index + 1}. \`${item.route}\` - ${nextAction(item)}`).join("\n")}

## Execution Rule

Do not solve overloaded pages by adding more explanatory text. Solve them by:

- compressing copy into shorter decision blocks
- moving long-tail depth into article pages
- adding visual workflows and state maps
- adding contextual service/article CTA bridges
- keeping every visible heading client-facing
- preserving long-form authority in static article HTML
`;

await mkdir("docs", { recursive: true });
await writeFile(path.join("docs", "CONTENT_DENSITY_AUDIT.md"), report);
console.log(`Wrote docs/CONTENT_DENSITY_AUDIT.md for ${metrics.length} routes.`);
