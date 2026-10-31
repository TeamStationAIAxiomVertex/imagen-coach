import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

// The single definition of done for this repo. Runs every gate in order and
// stops at the first failure. CI runs exactly this; agents run it before
// claiming any change is complete.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUTS = ["dist", "dist-raiz"];
const ledger = [];

function run(command, args, env = {}) {
  const result = spawnSync(command, args, { cwd: ROOT, stdio: "inherit", env: { ...process.env, ...env } });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} exited ${result.status ?? result.signal}`);
}

function git(args) {
  const result = spawnSync("git", args, { cwd: ROOT, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
  return result.stdout;
}

function listFiles(dir, base = dir) {
  return readdirSync(dir).sort().flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full, base) : [path.relative(base, full)];
  });
}

function treeHashes(dir) {
  return new Map(listFiles(dir).map((file) => [file, createHash("sha256").update(readFileSync(path.join(dir, file))).digest("hex")]));
}

function treeDigest(hashes) {
  const hash = createHash("sha256");
  for (const [file, digest] of hashes) hash.update(`${file}\0${digest}\n`);
  return hash.digest("hex").slice(0, 16);
}

function step(name, fn) {
  const started = Date.now();
  try {
    const note = fn();
    ledger.push({ name, status: "PASS", seconds: (Date.now() - started) / 1000, note: note || "" });
  } catch (error) {
    ledger.push({ name, status: "FAIL", seconds: (Date.now() - started) / 1000, note: error.message });
    report();
    process.exit(1);
  }
}

function report() {
  console.log("\nVerify ledger");
  for (const row of ledger) {
    console.log(`${row.status}  ${row.name.padEnd(34)} ${row.seconds.toFixed(1).padStart(6)} s  ${row.note}`);
  }
}

const sourceStatusBefore = git(["status", "--porcelain"]);

step("build main site", () => run("node", ["scripts/build-static.mjs"]));
step("validate main site", () => run("node", ["scripts/validate-build.mjs"]));
step("build La Raíz", () => run("node", ["scripts/build-raiz.mjs"]));
step("validate La Raíz", () => run("node", ["scripts/validate-raiz.mjs"]));
step("test conversion events", () => run("node", ["scripts/test-conversion-events.mjs"]));
step("test La Raíz FX pricing", () => run("node", ["scripts/test-raiz-fx.mjs"]));
step("Pages routes present", () => {
  for (const output of OUTPUTS) {
    const routes = JSON.parse(readFileSync(path.join(ROOT, output, "_routes.json"), "utf8"));
    if (routes.version !== 1 || !routes.include?.length) throw new Error(`${output}/_routes.json is invalid`);
  }
  return OUTPUTS.map((output) => `${output}/_routes.json`).join(", ");
});
step("functions smoke test", () => run("node", ["scripts/smoke-functions.mjs"]));

step("determinism (rebuild, compare)", () => {
  const first = new Map(OUTPUTS.map((output) => [output, treeHashes(path.join(ROOT, output))]));
  const snapshot = mkdtempSync(path.join(os.tmpdir(), "verify-"));
  try {
    for (const output of OUTPUTS) cpSync(path.join(ROOT, output), path.join(snapshot, output), { recursive: true });
    // Rebuild under a far-off timezone so timezone-dependent output also fails here.
    const otherZone = { TZ: "Pacific/Kiritimati" };
    run("node", ["scripts/build-static.mjs"], otherZone);
    run("node", ["scripts/build-raiz.mjs"], otherZone);
    const notes = [];
    for (const output of OUTPUTS) {
      const before = first.get(output);
      const after = treeHashes(path.join(ROOT, output));
      const changed = [...new Set([...before.keys(), ...after.keys()])].filter((file) => before.get(file) !== after.get(file));
      if (changed.length) throw new Error(`${output}: ${changed.length} file(s) differ between builds, e.g. ${changed.slice(0, 5).join(", ")}`);
      notes.push(`${output} ${treeDigest(after)}`);
    }
    return notes.join(", ");
  } finally {
    if (existsSync(snapshot)) rmSync(snapshot, { recursive: true, force: true });
  }
});

step("build leaves source untouched", () => {
  const after = git(["status", "--porcelain"]);
  if (after !== sourceStatusBefore) throw new Error(`git status changed during verify:\n${after}`);
});

report();
console.log("\nVerify passed.");
