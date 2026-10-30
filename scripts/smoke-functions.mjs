import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Boots the real Pages runtime (wrangler pages dev, reading wrangler.jsonc) on
// the built dist and asserts the contract of every backend behavior: HTML,
// markdown negotiation, assets, bot-auth directory, both APIs, 404, redirects.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WRANGLER = path.join(ROOT, "node_modules", ".bin", "wrangler");
const READY_TIMEOUT_MS = 90_000;

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function waitUntilReady(base, child) {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`wrangler exited early with code ${child.exitCode}`);
    try {
      const res = await fetch(`${base}/`, { redirect: "manual" });
      await res.arrayBuffer();
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new Error(`wrangler pages dev not ready after ${READY_TIMEOUT_MS} ms`);
}

const validEvent = {
  eventName: "whatsapp_handoff",
  site: "main",
  route: "/",
  placement: "hero",
  targetType: "whatsapp",
  targetPath: "https://wa.me/1",
  ctaLabel: "Agendar",
};

function checks(asset) {
  return [
    { name: "html home", path: "/", status: 200, type: "text/html" },
    { name: "markdown home", path: "/", headers: { accept: "text/markdown" }, status: 200, type: "text/markdown", body: (text) => text.startsWith("#") },
    { name: "markdown article", path: "/imagen-presencia/encuentra-tu-estilo/", headers: { accept: "text/markdown" }, status: 200, type: "text/markdown", body: (text) => text.startsWith("#") },
    { name: "static asset", path: `/assets/optimized/${asset}`, status: 200, type: "image/webp" },
    { name: "bot-auth directory", path: "/.well-known/http-message-signatures-directory", status: 200, type: "application/http-message-signatures-directory+json", body: (text) => Array.isArray(JSON.parse(text).keys) },
    { name: "bot-auth rejects POST", path: "/.well-known/http-message-signatures-directory", method: "POST", status: 405 },
    { name: "fx pricing MXN", path: "/api/fx-pricing?amount=1000&currency=MXN", status: 200, type: "application/json", body: (text) => JSON.parse(text).canonical?.currency === "MXN" },
    { name: "fx pricing needs amount", path: "/api/fx-pricing", status: 400 },
    { name: "conversion event accepted", path: "/api/conversion-event", method: "POST", headers: { "content-type": "application/json", origin: "https://coachdeimagen.com" }, payload: validEvent, status: 202, body: (text) => JSON.parse(text).accepted === true },
    { name: "conversion event bad origin", path: "/api/conversion-event", method: "POST", headers: { "content-type": "application/json", origin: "https://evil.example" }, payload: validEvent, status: 403 },
    { name: "unknown route 404", path: "/no-existe-xyz/", status: 404 },
    { name: "legacy redirect", path: "/articulos/aprende-a-resaltar-tus-proporciones", status: 301, location: "/imagen-presencia/aprende-a-resaltar-tus-proporciones" },
  ];
}

async function runCheck(base, check) {
  const res = await fetch(`${base}${check.path}`, {
    method: check.method || "GET",
    headers: check.headers,
    body: check.payload ? JSON.stringify(check.payload) : undefined,
    redirect: "manual",
  });
  const text = await res.text();
  const problems = [];
  if (res.status !== check.status) problems.push(`status ${res.status} != ${check.status}`);
  const type = res.headers.get("content-type") || "";
  if (check.type && !type.startsWith(check.type)) problems.push(`content-type "${type}" !~ ${check.type}`);
  if (check.location && !(res.headers.get("location") || "").includes(check.location)) problems.push(`location "${res.headers.get("location")}"`);
  if (check.body) {
    let ok = false;
    try { ok = check.body(text); } catch { ok = false; }
    if (!ok) problems.push("body assertion failed");
  }
  return problems;
}

const asset = readdirSync(path.join(ROOT, "dist", "assets", "optimized")).find((file) => file.endsWith(".webp"));
if (!asset) throw new Error("No optimized asset in dist; run the build first.");

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const child = spawn(WRANGLER, ["pages", "dev", "dist", "--port", String(port), "--ip", "127.0.0.1"], {
  cwd: ROOT,
  detached: true,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, WRANGLER_SEND_METRICS: "false" },
});
let log = "";
child.stdout.on("data", (chunk) => { log += chunk; });
child.stderr.on("data", (chunk) => { log += chunk; });

let failures = 0;
try {
  await waitUntilReady(base, child);
  for (const check of checks(asset)) {
    const problems = await runCheck(base, check);
    if (problems.length) failures += 1;
    console.log(`${problems.length ? "FAIL" : "PASS"}  ${check.name}${problems.length ? ` — ${problems.join("; ")}` : ""}`);
  }
} catch (error) {
  failures += 1;
  console.error(`FAIL  smoke harness — ${error.message}`);
  console.error(log.split("\n").slice(-20).join("\n"));
} finally {
  // Stop the whole process group (npm/wrangler/workerd) and wait for it, so the
  // next verify step never races a server that is still shutting down.
  const exited = child.exitCode !== null ? Promise.resolve() : new Promise((resolve) => child.once("exit", resolve));
  try { process.kill(-child.pid, "SIGTERM"); } catch { /* already gone */ }
  const timedOut = await Promise.race([exited.then(() => false), new Promise((resolve) => setTimeout(() => resolve(true), 10_000))]);
  if (timedOut) {
    try { process.kill(-child.pid, "SIGKILL"); } catch { /* already gone */ }
  }
}

if (failures) {
  console.error(`Functions smoke test: ${failures} failure(s).`);
  process.exit(1);
}
console.log("Functions smoke test passed.");
