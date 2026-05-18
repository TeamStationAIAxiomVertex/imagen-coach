import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SITE_URL = "https://imagencoach.com";
const WHATSAPP = "https://wa.me/526646105348?text=Hola%20Sonia%2C%20me%20interesa%20agendar%20un%20diagn%C3%B3stico.";
const CONTACT = {
  phone: "+52 664 610 5348",
  address: "WeWork | Av. Adolfo López Mateos Norte 95, Col. Italia Providencia, Guadalajara, Jalisco, 44648, México.",
  hours: "Solo con Citas: Lunes a viernes, de 9:00 a.m. a 6:00 p.m.",
};

function rootPath(...parts) {
  return path.join(ROOT, ...parts);
}

function distPath(...parts) {
  return path.join(DIST, ...parts);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stripFrontMatter(markdown) {
  const match = markdown.match(/^---\n[\s\S]*?\n---\n\n?/);
  return match ? markdown.slice(match[0].length) : markdown;
}

function paragraphize(lines) {
  const blocks = [];
  for (const line of lines.map((item) => item.trim()).filter(Boolean)) {
    if (/^[-•●✔️👉🌟💌🎓🟣✨]/.test(line)) {
      blocks.push(`<p class="bullet-line">${escapeHtml(line)}</p>`);
    } else {
      blocks.push(`<p>${escapeHtml(line)}</p>`);
    }
  }
  return blocks.join("\n");
}

function splitContent(markdown) {
  const lines = stripFrontMatter(markdown).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines;
}

function titleFromLines(page, lines) {
  if (page.route === "/") return "Tu imagen ya debería reflejar el nivel que sostienes";
  return lines.find((line) => line.length > 8 && !line.startsWith("https://")) || page.title;
}

function descriptionFromLines(lines) {
  const line = lines.find((item) => item.length > 90) || lines.find((item) => item.length > 45) || "";
  return line.slice(0, 158);
}

function pageType(route) {
  if (route === "/") return "home";
  if (route === "/imagen-presencia") return "article-index";
  if (route.startsWith("/imagen-presencia/")) return "article";
  if (route === "/servicios-asesoria-de-imagen-coaching") return "service-hub";
  if (route.startsWith("/servicios-asesoria-de-imagen-coaching/")) return "service";
  if (route.startsWith("/sobre-sonia")) return "about";
  return "page";
}

function pickImage(page) {
  if (page.route === "/" && existsSync(rootPath("assets/797aeda1281e5d5e.png"))) {
    return "/assets/797aeda1281e5d5e.png";
  }
  const candidates = page.images?.filter((image) => image.local_path && /\.(jpe?g|png|webp)$/i.test(image.local_path)) || [];
  const first =
    candidates.find((image) => /\.(jpe?g|webp)$/i.test(image.local_path) && Number(image.bytes || 0) > 50000) ||
    candidates.find((image) => /\.png$/i.test(image.local_path) && Number(image.bytes || 0) > 100000) ||
    candidates[0];
  if (!first) return "/assets/sonia-twitter-card.png";
  return `/assets/${path.basename(first.local_path)}`;
}

function routeOutputPath(route) {
  if (route === "/") return distPath("index.html");
  return distPath(route.replace(/^\/+/, ""), "index.html");
}

function absoluteUrl(route) {
  return `${SITE_URL}${route === "/" ? "/" : route}`;
}

function nav(currentRoute) {
  const items = [
    ["/", "Inicio"],
    ["/sobre-sonia-mcrorey-asesora-de-imagen", "Sonia"],
    ["/servicios-asesoria-de-imagen-coaching", "Servicios"],
    ["/imagen-presencia", "Publicaciones"],
    ["#contacto", "Contacto"],
  ];
  return items
    .map(([href, label]) => {
      const active = href === currentRoute ? ' aria-current="page"' : "";
      return `<a href="${href}"${active}>${label}</a>`;
    })
    .join("");
}

function header(currentRoute) {
  return `<header class="site-header" data-header>
    <a class="brand" href="/" aria-label="Sonia McRorey ImagenCoach">
      <span class="brand-wordmark">Sonia McRorey</span>
      <small>ImagenCoach</small>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-label="Abrir navegación"><span></span><span></span></button>
    <nav class="site-nav" aria-label="Navegación principal">${nav(currentRoute)}</nav>
    <a class="header-cta" href="${WHATSAPP}" target="_blank" rel="noopener">Agendar</a>
  </header>`;
}

function footer() {
  return `<footer class="footer" id="contacto">
    <section class="section contact-grid">
      <div>
        <p class="section-label">Contacto</p>
        <h2>Conversemos sobre la imagen que necesitas sostener.</h2>
      </div>
      <div class="contact-card">
        <p>${CONTACT.address}</p>
        <p>${CONTACT.hours}</p>
        <div class="actions">
          <a class="btn primary" href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a>
          <a class="btn secondary" href="tel:+526646105348">${CONTACT.phone}</a>
        </div>
      </div>
    </section>
  </footer>`;
}

function breadcrumbs(page) {
  if (page.route === "/") return "";
  const label = page.type === "article" ? "Imagen y Presencia" : page.type.includes("service") ? "Servicios" : "Inicio";
  const parent = page.type === "article" ? "/imagen-presencia" : page.type.includes("service") ? "/servicios-asesoria-de-imagen-coaching" : "/";
  return `<nav class="breadcrumbs section" aria-label="Breadcrumbs"><a href="/">Inicio</a><span>/</span><a href="${parent}">${label}</a><span>/</span><span aria-current="page">${escapeHtml(page.heroTitle)}</span></nav>`;
}

function hero(page, lines) {
  const image = pickImage(page);
  const lede = lines.slice(1, 4);
  const eyebrow = page.type === "article" ? "Imagen, presencia y mentalidad" : page.type === "service" ? "Servicio" : page.type === "about" ? "Sobre Sonia" : "ImagenCoach";
  return `<section class="section hero imagen-hero">
    <div class="hero-copy">
      <p class="eyebrow">${eyebrow}</p>
      <h1>${escapeHtml(page.heroTitle)}</h1>
      <div class="hero-lede">${paragraphize(lede)}</div>
      <div class="actions">
        <a class="btn primary" href="${WHATSAPP}" target="_blank" rel="noopener">Agendar diagnóstico</a>
        <a class="btn secondary" href="${page.type === "article" ? "/imagen-presencia" : "/servicios-asesoria-de-imagen-coaching"}">${page.type === "article" ? "Ver publicaciones" : "Ver servicios"}</a>
      </div>
    </div>
    <figure class="hero-media">
      <img src="${image}" alt="${escapeHtml(page.heroTitle)}" />
      <figcaption><img src="/assets/sonia-icon.svg" alt="" /> Sonia McRorey · ImagenCoach</figcaption>
    </figure>
  </section>`;
}

function contentSections(page, lines) {
  const body = lines.slice(page.route === "/" ? 4 : 1);
  const lead = body.slice(0, page.type === "article" ? 12 : 20);
  const rest = body.slice(lead.length);
  const chunks = [];
  for (let index = 0; index < rest.length; index += 9) chunks.push(rest.slice(index, index + 9));
  return `<section class="section content-flow">
    <div class="section-heading">
      <p class="section-label">${page.type === "article" ? "Artículo" : "Contenido fuente"}</p>
      <h2>${escapeHtml(page.type === "article" ? "Lectura completa" : "Contenido principal")}</h2>
    </div>
    <article class="copy-panel">${paragraphize(lead)}</article>
  </section>
  ${chunks
    .map((chunk, index) => `<section class="section split-section ${index % 2 ? "reverse" : ""}">
      <div class="copy-panel">${paragraphize(chunk)}</div>
      ${supportingVisual(page, index)}
    </section>`)
    .join("\n")}`;
}

function supportingVisual(page, index) {
  const image = page.images?.[index + 1] || page.images?.[0];
  if (!image?.local_path) {
    return `<aside class="quote-panel"><p>La imagen se sostiene cuando existe coherencia entre lo que haces, lo que decides y lo que proyectas.</p><span>Sonia McRorey</span></aside>`;
  }
  return `<figure class="support-media"><img src="/assets/${path.basename(image.local_path)}" alt="${escapeHtml(page.heroTitle)}" /></figure>`;
}

function articleCards(pages) {
  return pages
    .filter((page) => page.type === "article")
    .map((page) => `<a class="publication-link-card" href="${page.route}">
      <span>Artículo</span>
      <strong>${escapeHtml(page.heroTitle)}</strong>
      <small>Leer publicación</small>
    </a>`)
    .join("");
}

function serviceCards(pages) {
  return pages
    .filter((page) => page.type === "service")
    .map((page) => `<a class="service-card" href="${page.route}">
      <img class="card-icon" src="/assets/sonia-icon.svg" alt="" />
      <h3>${escapeHtml(page.heroTitle)}</h3>
      <p>${escapeHtml(page.description)}</p>
      <span>Conocer servicio</span>
    </a>`)
    .join("");
}

function homeExtras(pages) {
  return `<section class="section services">
    <div class="section-heading">
      <p class="section-label">Servicios</p>
      <h2>Procesos para alinear imagen, presencia y decisiones.</h2>
    </div>
    <div class="service-grid">${serviceCards(pages)}</div>
  </section>
  <section class="section journal">
    <div class="section-heading">
      <p class="section-label">Publicaciones</p>
      <h2>Imagen, presencia y mentalidad.</h2>
    </div>
    <div class="publication-grid">${articleCards(pages).split("</a>").slice(0, 6).join("</a>")}</div>
  </section>`;
}

function indexExtras(pages) {
  return `<section class="section journal"><div class="publication-grid">${articleCards(pages)}</div></section>`;
}

function serviceHubExtras(pages) {
  return `<section class="section services"><div class="service-grid">${serviceCards(pages)}</div></section>`;
}

function schema(page) {
  const type = page.type === "article" ? "Article" : page.type.includes("service") ? "Service" : "WebPage";
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": type,
    name: page.heroTitle,
    url: absoluteUrl(page.route),
    image: `${SITE_URL}${pickImage(page)}`,
    author: { "@type": "Person", name: "Sonia McRorey" },
  })}</script>`;
}

function renderPage(page, pages) {
  const lines = splitContent(page.markdown);
  page.heroTitle = titleFromLines(page, lines);
  page.description = descriptionFromLines(lines);
  const image = pickImage(page);
  const extra = page.type === "home" ? homeExtras(pages) : page.type === "article-index" ? indexExtras(pages) : page.type === "service-hub" ? serviceHubExtras(pages) : "";
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(page.title || page.heroTitle)} | Sonia McRorey</title>
  <meta name="description" content="${escapeHtml(page.description)}" />
  <link rel="canonical" href="${absoluteUrl(page.route)}" />
  <meta property="og:title" content="${escapeHtml(page.heroTitle)}" />
  <meta property="og:description" content="${escapeHtml(page.description)}" />
  <meta property="og:url" content="${absoluteUrl(page.route)}" />
  <meta property="og:image" content="${SITE_URL}${image}" />
  <link rel="icon" href="/assets/sonia-icon.svg" />
  <link rel="stylesheet" href="/styles.css" />
  ${schema(page)}
</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  ${header(page.route)}
  <main id="contenido">
    ${breadcrumbs(page)}
    ${hero(page, lines)}
    ${extra}
    ${contentSections(page, lines)}
  </main>
  ${footer()}
  <script src="/script.js" defer></script>
</body>
</html>`;
}

async function loadPages() {
  const manifest = JSON.parse(await readFile(rootPath("content/clean/manifest.json"), "utf8"));
  const pages = [];
  for (const item of manifest.pages) {
    const markdown = await readFile(rootPath(item.clean_path), "utf8");
    pages.push({ ...item, markdown, type: pageType(item.route) });
  }
  return pages;
}

async function copyStatic() {
  await cp(rootPath("assets"), distPath("assets"), { recursive: true });
  for (const file of ["styles.css", "script.js", "_headers", "llms.txt"]) {
    if (existsSync(rootPath(file))) await cp(rootPath(file), distPath(file));
  }
}

function sitemap(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((page) => `  <url><loc>${absoluteUrl(page.route)}</loc></url>`)
    .join("\n")}\n</urlset>\n`;
}

async function main() {
  const pages = await loadPages();
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  await copyStatic();
  for (const page of pages) {
    const out = routeOutputPath(page.route);
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, renderPage(page, pages));
  }
  await writeFile(distPath("sitemap.xml"), sitemap(pages));
  await writeFile(distPath("robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  await writeFile(distPath("_redirects"), [
    "https://www.imagencoach.com/*  https://imagencoach.com/:splat  301",
    "/articulos/tu-color-tu-poder-el-impacto-de-la-colorimetria  /imagen-presencia/tu-color-tu-poder-el-impacto-de-la-colorimetria  301",
    "/articulos/aprende-a-resaltar-tus-proporciones  /imagen-presencia/aprende-a-resaltar-tus-proporciones  301",
    "/articulos/la-importancia-de-tu-imagen-personal  /imagen-presencia/la-importancia-de-tu-imagen-personal  301",
    "/articulos/encuentra-tu-estilo  /imagen-presencia/encuentra-tu-estilo  301",
    "",
  ].join("\n"));
  console.log(`Built ${pages.length} routes into dist`);
}

main();
