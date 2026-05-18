import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const manifest = JSON.parse(await readFile("content/clean/manifest.json", "utf8"));
const failures = [];

for (const page of manifest.pages) {
  const htmlPath = page.route === "/" ? "dist/index.html" : path.join("dist", page.route, "index.html");
  if (!existsSync(htmlPath)) failures.push(`Missing route output: ${page.route}`);
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
  for (const junk of ["87fd0a60", "bf0dcab6", "Can't send form", "Please try again later", "Miscellaneous 234_solid", ">undefined<"]) {
    if (html.includes(junk)) failures.push(`Junk leaked into ${file}: ${junk}`);
  }
}

const sitemap = await readFile("dist/sitemap.xml", "utf8");
for (const page of manifest.pages) {
  if (!sitemap.includes(`https://imagencoach.com${page.route === "/" ? "/" : page.route}`)) {
    failures.push(`Missing sitemap URL: ${page.route}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${manifest.pages.length} routes and mapped assets.`);
