import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const approvedDir = path.join(root, "content/knowledge/approved");
const queueDir = path.join(root, "content/knowledge/queue");
const reportPath = path.join(root, "content/knowledge/reports/knowledge-provenance-audit.md");
const strictBatches = [
  "2026-07-22-leadership-signal-cross-border-practice-batch.json",
  "2026-07-23-decision-authority-regional-context-batch.json",
  "2026-08-25-geo-buyer-decision-batch.json"
];

const files = [
  ...strictBatches.map((file) => path.join(approvedDir, file)),
  ...strictBatches.map((file) => path.join(queueDir, file.replace(".json", "-candidates.json")))
];

const violations = [];
const warnings = [];
const normalize = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const collectSourceSignals = (value, result = new Set()) => {
  if (Array.isArray(value)) {
    value.forEach((item) => collectSourceSignals(item, result));
  } else if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => {
      if (["title", "source", "sourceFile", "sourceTitle", "name"].includes(key) && typeof item === "string") {
        result.add(normalize(item));
      }
      collectSourceSignals(item, result);
    });
  }
  return result;
};

const sourceSignalCorpus = new Set();
for (const sourceFile of [
  "content/sonia-knowledge/drive-source-inventory.json",
  "content/sonia-knowledge/drive-quote-bank.json",
  "content/sonia-knowledge/quote-bank.json",
  "content/sonia-knowledge/teaching-route-map.json",
  "content/blog/soniamcrorey-blog.json"
]) {
  const absolute = path.join(root, sourceFile);
  if (existsSync(absolute)) collectSourceSignals(JSON.parse(await readFile(absolute, "utf8")), sourceSignalCorpus);
}

const routeFiles = [];
const distRoot = path.join(root, "dist");
if (existsSync(distRoot)) {
  const walk = async (directory) => {
    for (const entry of await import("node:fs/promises").then(({ readdir }) => readdir(directory, { withFileTypes: true }))) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(entryPath);
      else if (entry.name === "index.html") routeFiles.push(`/${path.relative(distRoot, path.dirname(entryPath))}`.replace("/.", "/"));
    }
  };
  await walk(distRoot);
}
const routeSet = new Set(routeFiles.map((route) => route === "/" ? "/" : `${route.replace(/\\/g, "/")}/`));

const approvedQuestions = new Map();
const queueQuestions = new Map();
const unresolvedRoutes = new Set();
let strictCardCount = 0;
let legacySourceCount = 0;

for (const file of files) {
  if (!existsSync(file)) {
    warnings.push(`Missing optional batch file: ${path.relative(root, file)}`);
    continue;
  }

  const batch = JSON.parse(await readFile(file, "utf8"));
  const relative = path.relative(root, file);
  const isApproved = relative.includes(`${path.sep}approved${path.sep}`);
  const cards = Array.isArray(batch.cards) ? batch.cards : [];
  if (!cards.length) violations.push(`${relative}: cards array is empty.`);

  for (const card of cards) {
    const label = `${relative}#${card.id || "missing-id"}`;
    if (!card.id) violations.push(`${label}: missing id.`);
    if (!card.question || !card.shortAnswer) violations.push(`${label}: question and shortAnswer are required.`);
    if (!Array.isArray(card.routePriority) || !card.routePriority.length) violations.push(`${label}: missing routePriority.`);
    if (!Array.isArray(card.anchorPhrases) || card.anchorPhrases.length < 2) violations.push(`${label}: requires at least two anchorPhrases.`);
    if (!Array.isArray(card.sourceSignals) || !card.sourceSignals.length) violations.push(`${label}: missing sourceSignals.`);
    if (!Array.isArray(card.guardrails) || card.guardrails.length < 2) violations.push(`${label}: missing guardrails.`);

    const normalizedQuestion = normalize(card.question);
    if (normalizedQuestion) {
      const questionIndex = isApproved ? approvedQuestions : queueQuestions;
      if (questionIndex.has(normalizedQuestion)) violations.push(`${label}: duplicate normalized question; also found in ${questionIndex.get(normalizedQuestion)}.`);
      else questionIndex.set(normalizedQuestion, label);
    }

    for (const route of card.routePriority || []) {
      if (routeSet.size && !routeSet.has(route.endsWith("/") ? route : `${route}/`)) {
        unresolvedRoutes.add(route);
      }
    }

    const serialized = JSON.stringify(card).toLowerCase();
    if (/teamstation|axiomvertex/.test(serialized)) violations.push(`${label}: cross-project identifier detected.`);

    for (const signal of card.sourceSignals || []) {
      const normalizedSignal = normalize(signal);
      const lookupSignal = normalizedSignal.replace(/^blog archive\s+/, "");
      const trustedBlogReference = normalizedSignal.startsWith("blog archive ") && lookupSignal.length > 0;
      if (!trustedBlogReference && !sourceSignalCorpus.has(normalizedSignal) && !sourceSignalCorpus.has(lookupSignal)) {
        warnings.push(`${label}: source signal not found verbatim in reviewed source registries: ${signal}`);
      }
    }

    if (isApproved) {
      strictCardCount += 1;
      if (!card.sourceIds || !card.contentMode || !card.sourceVersion) legacySourceCount += 1;
    }
  }
}

const status = violations.length ? "FAIL" : "PASS_WITH_MIGRATION_WARNINGS";
for (const route of [...unresolvedRoutes].sort()) {
  warnings.push(`routePriority target is not generated in the current dist build: ${route}`);
}
const report = [
  "# Knowledge Provenance Audit",
  "",
  `- Status: **${status}**`,
  `- Strict governed batch cards checked: **${strictCardCount}**`,
  `- Cards missing sourceIds/contentMode/sourceVersion: **${legacySourceCount}**`,
  `- Violations: **${violations.length}**`,
  `- Warnings: **${warnings.length}**`,
  "",
  "## Enforcement",
  "",
  "Governed batches must contain Sonia-only source signals, usable routes, non-duplicate questions, anchor phrases and guardrails. Private Drive filenames and unrelated project identifiers remain prohibited in public cards.",
  "",
  "## Violations",
  "",
  ...(violations.length ? violations.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Migration Warnings",
  "",
  ...(warnings.length ? warnings.map((item) => `- ${item}`) : ["- None"]),
  "",
  "## Next migration",
  "",
  "Upgrade approved cards to `sourceIds`, `contentMode`, `sourceLocator`, `sourceHash` and `sourceVersion` after the source registry is complete. Do not publish cards that cannot be traced to Sonia material."
].join("\n");

await writeFile(reportPath, `${report}\n`, "utf8");
console.log(report);
if (violations.length) process.exitCode = 1;
