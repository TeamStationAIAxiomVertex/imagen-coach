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
const BODY_JUNK_LINES = new Set([
  "Contactame",
  "Consulta Gratis",
  "Primera Sesión",
  "Primera Sesion",
  "30 minutos",
  "Agendar Sesion",
  "Agendar",
  "Precios",
  "Leer Mas",
  "Leer mas?",
  "Leer mis publicaciones",
  "Ver Servicios",
  "Ver Talleres",
  "Conocer servicio",
  "Explorar el proceso",
  "Siguiente paso",
  "Contacto",
  "Contáctanos para transformar tu imagen personal o empresarial.",
  CONTACT.address,
  CONTACT.hours,
]);

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

function normalizeContentLines(lines) {
  const filtered = lines
    .map((item) => item.trim())
    .filter((item) => item && !BODY_JUNK_LINES.has(item));
  const normalized = [];

  for (let index = 0; index < filtered.length; index += 1) {
    let line = filtered[index];
    const next = filtered[index + 1];

    if (line.length <= 2 && next && /^[a-záéíóúñ]/.test(next)) {
      line = `${line}${next}`;
      index += 1;
    }

    const previous = normalized[normalized.length - 1];
    if (
      previous &&
      !isHeadingCandidate(line) &&
      !isListLine(line) &&
      !/[.!?…:]$/.test(previous) &&
      /^[a-záéíóúñ,]/.test(line)
    ) {
      normalized[normalized.length - 1] = `${previous}${line.startsWith(",") ? "" : " "}${line}`;
    } else {
      normalized.push(line);
    }
  }

  return normalized;
}

function isListLine(line) {
  return /^[-•●✔️👉🌟💌🎓🟣✨]/.test(line);
}

function isHeadingCandidate(line) {
  if (isListLine(line)) return false;
  if (line.length > 92) return false;
  if (/^https?:/.test(line)) return false;
  if (/^[¿?]/.test(line)) return true;
  if (/[.!]$/.test(line)) return false;
  return /^[A-ZÁÉÍÓÚÑ]/.test(line) && line.split(/\s+/).length <= 11;
}

function paragraphize(lines, { allowHeadings = false } = {}) {
  const blocks = [];
  for (const line of normalizeContentLines(lines)) {
    if (isListLine(line)) {
      blocks.push(`<p class="bullet-line">${escapeHtml(line)}</p>`);
    } else if (allowHeadings && isHeadingCandidate(line)) {
      blocks.push(`<h3>${escapeHtml(line)}</h3>`);
    } else {
      blocks.push(`<p>${escapeHtml(line)}</p>`);
    }
  }
  return blocks.join("\n");
}

function splitContent(markdown) {
  return normalizeContentLines(stripFrontMatter(markdown).split(/\r?\n/));
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
  const candidates = usableImages(page);
  const first =
    candidates.find((image) => /\.(jpe?g|webp)$/i.test(image.local_path) && Number(image.bytes || 0) > 50000) ||
    candidates.find((image) => /\.png$/i.test(image.local_path) && Number(image.bytes || 0) > 100000) ||
    candidates[0];
  if (!first) return "/assets/sonia-twitter-card.png";
  return `/assets/${path.basename(first.local_path)}`;
}

function usableImages(page) {
  return (page.images || [])
    .filter((image) => image.local_path && /\.(jpe?g|png|webp)$/i.test(image.local_path))
    .filter((image) => Number(image.bytes || 0) >= 50000);
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
  if (page.type === "article-index") {
    return `<nav class="breadcrumbs section" aria-label="Breadcrumbs"><a href="/">Inicio</a><span>/</span><span aria-current="page">Publicaciones</span></nav>`;
  }
  if (page.type === "service-hub") {
    return `<nav class="breadcrumbs section" aria-label="Breadcrumbs"><a href="/">Inicio</a><span>/</span><span aria-current="page">Servicios</span></nav>`;
  }
  if (page.type === "about") {
    return `<nav class="breadcrumbs section" aria-label="Breadcrumbs"><a href="/">Inicio</a><span>/</span><span aria-current="page">Sonia</span></nav>`;
  }
  const label = page.type === "article" ? "Imagen y Presencia" : "Servicios";
  const parent = page.type === "article" ? "/imagen-presencia" : "/servicios-asesoria-de-imagen-coaching";
  return `<nav class="breadcrumbs section" aria-label="Breadcrumbs"><a href="/">Inicio</a><span>/</span><a href="${parent}">${label}</a><span>/</span><span aria-current="page">${escapeHtml(page.heroTitle)}</span></nav>`;
}

function contentHeading(page) {
  if (page.type === "home") return ["Presencia profesional", "Cuando tu imagen sostiene tu nivel"];
  if (page.type === "about") return ["Sobre Sonia", "Trayectoria, enfoque y forma de trabajo"];
  if (page.type === "service-hub") return ["Servicios", "Elige el proceso que acompaña tu momento"];
  if (page.type === "service") return ["Proceso", "Qué trabaja este acompañamiento"];
  if (page.type === "article-index") return ["Publicaciones", "Archivo de Imagen, Presencia y Mentalidad"];
  if (page.type === "article") return ["Artículo", "Lectura completa"];
  return ["ImagenCoach", "Contenido principal"];
}

function hero(page, lines) {
  const image = pickImage(page);
  const lede = lines.slice(1, 3);
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
  const lead = body.slice(0, page.type === "article" ? 10 : 14);
  const rest = body.slice(lead.length);
  const chunks = [];
  for (let index = 0; index < rest.length; index += page.type === "article" ? 8 : 7) {
    chunks.push(rest.slice(index, index + (page.type === "article" ? 8 : 7)));
  }
  const [label, heading] = contentHeading(page);
  return `<section class="section content-flow">
    <div class="section-heading">
      <p class="section-label">${escapeHtml(label)}</p>
      <h2>${escapeHtml(heading)}</h2>
    </div>
    <article class="copy-panel lead-panel">${paragraphize(lead, { allowHeadings: true })}</article>
  </section>
  ${chunks
    .map((chunk, index) => `<section class="section split-section ${index % 2 ? "reverse" : ""}">
      <div class="copy-panel">${paragraphize(chunk, { allowHeadings: true })}</div>
      ${supportingVisual(page, index)}
    </section>`)
    .join("\n")}`;
}

function supportingVisual(page, index) {
  const images = usableImages(page);
  const image = images[index + 1] || images[0];
  if (!image?.local_path) {
    return `<aside class="quote-panel"><p>La imagen se sostiene cuando existe coherencia entre lo que haces, lo que decides y lo que proyectas.</p><span>Sonia McRorey</span></aside>`;
  }
  return `<figure class="support-media"><img src="/assets/${path.basename(image.local_path)}" alt="${escapeHtml(page.heroTitle)}" /></figure>`;
}

function articleCards(pages) {
  return pages
    .filter((page) => page.type === "article")
    .map((page) => `<a class="publication-link-card" href="${page.route}">
      <figure><img src="${pickImage(page)}" alt="${escapeHtml(page.heroTitle)}" /></figure>
      <span>Artículo</span>
      <strong>${escapeHtml(page.heroTitle)}</strong>
      <p>${escapeHtml(page.description)}</p>
      <small>Leer publicación</small>
    </a>`)
    .join("");
}

function serviceCards(pages) {
  return pages
    .filter((page) => page.type === "service")
    .map((page) => `<a class="service-card" href="${page.route}">
      <figure><img src="${pickImage(page)}" alt="${escapeHtml(page.heroTitle)}" /></figure>
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
