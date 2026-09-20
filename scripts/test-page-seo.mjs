import assert from "node:assert/strict";
import { test } from "node:test";
import { finalizePageHtml, pageUrl } from "./page-seo.mjs";

const origin = "https://coachdeimagen.com";
const routes = new Set(["/", "/guadalajara", "/contacto"]);

test("page links retain fragments, query values, and encoded HTML ampersands", () => {
  assert.equal(pageUrl("/guadalajara?x=1&amp;y=2#contenido", routes, origin), "/guadalajara/?x=1&amp;y=2#contenido");
  assert.equal(pageUrl(`${origin}/guadalajara/`, routes, origin), `${origin}/guadalajara/`);
  for (const url of ["/api/contact", "/assets/a.avif", "/missing", "#contenido", "https://imagengdl.com/guadalajara", "mailto:hello@example.com"]) {
    assert.equal(pageUrl(url, routes, origin), url);
  }
});

test("FAQ schema cannot use its own hidden content as evidence", () => {
  const faq = { "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "¿Dónde?", acceptedAnswer: { "@type": "Answer", text: "En Guadalajara." } },
    { "@type": "Question", name: "¿Cuándo?", acceptedAnswer: { "@type": "Answer", text: "Mañana." } },
  ] };
  const html = `<script type="application/ld+json">${JSON.stringify(faq)}</script><main><h2>¿Dónde?</h2><p>En <strong>Guadalajara.</strong></p></main>`;
  const result = finalizePageHtml(html, routes, origin);
  assert.equal(JSON.parse(result.match(/<script[^>]*>(.*?)<\/script>/)[1]).mainEntity.length, 1);
  assert.ok(!result.includes("¿Cuándo?"));
  assert.ok(!finalizePageHtml(html.replace("<h2>¿Dónde?</h2>", ""), routes, origin).includes("FAQPage"));
});

test("valid visible answers survive entities, nested graphs and URL normalization", () => {
  const schema = { "@graph": [{ "@type": "Person", url: `${origin}/contacto` },
    { "@type": "FAQPage", mainEntity: [{ name: "¿Color & estilo?", acceptedAnswer: { text: "Sí, con Sonia." } }] }] };
  const html = `<link rel="canonical" href="${origin}/guadalajara"><script type="application/ld+json">${JSON.stringify(schema)}</script><main><h2>¿Color &amp; estilo?</h2><p>Sí, con Sonia.</p><a href="/contacto">Contacto</a></main>`;
  const result = finalizePageHtml(html, routes, origin);
  assert.ok(result.includes('href="/contacto/"'));
  assert.ok(result.includes(`${origin}/guadalajara/`));
  assert.ok(result.includes('"url":"https://coachdeimagen.com/contacto/"'));
  assert.ok(result.includes('"@type":"FAQPage"'));
  assert.equal(result.match(/<main>.*?<\/main>/)[0], html.match(/<main>.*?<\/main>/)[0].replace('/contacto"','/contacto/"'));
});
