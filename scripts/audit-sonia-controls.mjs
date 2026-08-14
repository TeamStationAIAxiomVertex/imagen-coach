import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), "utf8"));

const ontology = await readJson("content/strategy/sonia-pillar-ontology.json");
const queue = await readJson("content/strategy/sonia-daily-meta-agent-queue.json");
const inventory = await readJson("content/sonia-knowledge/drive-source-inventory.json");
const quoteBank = await readJson("content/sonia-knowledge/drive-quote-bank.json");

const uniqueIds = (items, label) => {
  const ids = items.map((item) => item.id).filter(Boolean);
  assert(ids.length === new Set(ids).size, `${label} contains duplicate IDs.`);
};
const sourceIds = new Set((inventory.sources || inventory.files || []).map((item) => item.id).filter(Boolean));
const clusterIds = new Set((ontology.sourceClusters || []).map((item) => item.id));
const audienceIds = new Set((ontology.audiences || []).map((item) => item.id));
const geographyIds = new Set((ontology.geographies || []).map((item) => item.id));
const pillarIds = new Set((ontology.pillars || []).map((item) => item.id));
const routes = new Set((ontology.pillars || []).map((item) => item.route));

uniqueIds(ontology.pillars || [], "Pillar ontology");
uniqueIds(ontology.sourceClusters || [], "Source clusters");
uniqueIds(ontology.audiences || [], "Audiences");
uniqueIds(ontology.geographies || [], "Geographies");
assert(ontology.site === "https://coachdeimagen.com", "Ontology site is not coachdeimagen.com.");
assert(/Sonia McRorey/i.test(ontology.sourceBoundary || ""), "Ontology source boundary does not name Sonia McRorey.");
assert(!/teamstation|nebula|axiom cortex|deos/i.test(JSON.stringify(ontology)), "Forbidden cross-project term found in ontology.");

for (const pillar of ontology.pillars || []) {
  assert(pillar.sourceClusters?.length > 0, `Pillar ${pillar.id} has no source clusters.`);
  assert(pillar.sourceClusters.every((id) => clusterIds.has(id)), `Pillar ${pillar.id} references an unknown source cluster.`);
  assert(pillar.audiences?.every((id) => audienceIds.has(id)), `Pillar ${pillar.id} references an unknown audience.`);
  assert(pillar.geographies?.every((id) => geographyIds.has(id)), `Pillar ${pillar.id} references an unknown geography.`);
  assert(pillar.route?.startsWith("/"), `Pillar ${pillar.id} has an invalid route.`);
  assert(pillar.retrievalQuestions?.length >= 3, `Pillar ${pillar.id} needs at least three retrieval questions.`);
}
for (const edge of ontology.graphEdges || []) {
  assert(edge.from === "all-pillars" || edge.from === "guadalajara" || edge.from === "latam" || pillarIds.has(edge.from), `Graph edge has unknown source: ${edge.from}.`);
  assert(edge.to === "all-pillars" || pillarIds.has(edge.to), `Graph edge has unknown target: ${edge.to}.`);
}

assert(Array.isArray(quoteBank.quotes || quoteBank.entries || quoteBank.items), "Drive quote bank has no recognized entries collection.");
assert(Array.isArray(queue.queue), "Daily queue is missing its queue collection.");
assert(queue.queue.every((item) => item.id && item.objective && item.constraints?.length), "Every daily queue item needs an objective and constraints.");

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file));
    else files.push(file);
  }
  return files;
};
const publicRoot = path.join(root, "dist");
const publicFiles = await walk(publicRoot);
const publicTextFiles = publicFiles.filter((file) => /\.(html|md|txt|json)$/i.test(file));
const forbiddenPublic = /\b(teamstation|nebula|axiom cortex|deos)\b/i;
for (const file of publicTextFiles) {
  const text = await readFile(file, "utf8");
  assert(!forbiddenPublic.test(text), `Cross-project term found in public output: ${path.relative(root, file)}.`);
}

const requiredPublicFiles = [
  "dist/agent/pillar-ontology.json",
  "dist/semantic-index.json",
  "dist/llms.txt",
  "dist/llms-full.txt",
  "dist/.well-known/mcp/server-card.json",
];
for (const file of requiredPublicFiles) {
  try { await readFile(path.join(root, file)); }
  catch { failures.push(`Missing required public agent artifact: ${file}.`); }
}

if (failures.length) {
  console.error("Sonia control audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    status: "pass",
    site: ontology.site,
    pillars: ontology.pillars.length,
    sourceClusters: ontology.sourceClusters.length,
    audiences: ontology.audiences.length,
    geographies: ontology.geographies.length,
    publicTextFilesScanned: publicTextFiles.length,
    queueItems: queue.queue.length,
    crossProjectPublicTerms: 0,
  }, null, 2));
}
