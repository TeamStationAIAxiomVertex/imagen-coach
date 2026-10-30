import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Single source of "now" for every build script, so the same commit always
// produces the same output (reproducible-builds SOURCE_DATE_EPOCH convention).
// Order: SOURCE_DATE_EPOCH env var → HEAD commit time → fail.
// Date-windowed content (e.g. La Raíz promotions) therefore switches at a
// commit or an explicit SOURCE_DATE_EPOCH, never on a plain rebuild.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function resolveBuildEpochSeconds() {
  const fromEnv = process.env.SOURCE_DATE_EPOCH;
  if (fromEnv !== undefined && fromEnv !== "") {
    if (!/^\d+$/.test(fromEnv)) throw new Error(`SOURCE_DATE_EPOCH must be integer seconds, got "${fromEnv}"`);
    return Number(fromEnv);
  }
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%ct", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
    if (/^\d+$/.test(out)) return Number(out);
  } catch {
    // fall through to the explicit error below
  }
  throw new Error("Build clock unavailable: set SOURCE_DATE_EPOCH or build from a git checkout.");
}

export const BUILD_EPOCH_SECONDS = resolveBuildEpochSeconds();
export const BUILD_TIME = new Date(BUILD_EPOCH_SECONDS * 1000);
export const BUILD_DATE = BUILD_TIME.toISOString().slice(0, 10);
export const BUILD_YEAR = BUILD_TIME.getUTCFullYear();
