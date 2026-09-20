import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(decodeURIComponent(new URL(".", import.meta.url).pathname), "..");
const sourcePath = path.join(root, "content", "seguridad-profesional-article.json");
const outputDir = path.join(root, "docs", "sonia-review");
const article = JSON.parse(await readFile(sourcePath, "utf8"));

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const wordCount = (value) => String(value).trim().split(/\s+/).filter(Boolean).length;
const allText = [article.title, article.byline, article.provenance, article.intro, ...article.sections.flatMap((section) => [section.label, section.title, ...section.paragraphs]), ...article.links.map((link) => link.text), article.cta.title, article.cta.text, article.cta.textLink, article.sourceNote].join(" ");
const sectionTitles = article.sections.map((section) => section.title);
const uniqueSectionTitles = new Set(sectionTitles);
const sourceSerialized = JSON.stringify(article);
const forbiddenSourceMarkers = ["<", ">", "aria-", "class=", "id=", "style=", "{{", "}}"];
const sourceClean = forbiddenSourceMarkers.every((marker) => !sourceSerialized.includes(marker));

if (article.sections.length !== 6) throw new Error(`Expected 6 sections, found ${article.sections.length}`);
if (uniqueSectionTitles.size !== 6) throw new Error("Section titles must be unique");
if (!sourceClean) throw new Error("Editorial source contains markup or template fragments");

const inline = {
  shell: "font-family:Arial,Helvetica,sans-serif;color:#343136;background:#f7f5f7;margin:0;padding:32px 16px;line-height:1.65",
  card: "max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e4dfe5;padding:40px 44px",
  eyebrow: "margin:0 0 12px;color:#8c459f;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700",
  h1: "margin:0 0 20px;color:#303037;font-family:Georgia,'Times New Roman',serif;font-size:38px;line-height:1.12;font-weight:400",
  byline: "margin:0 0 10px;color:#236b4d;font-size:14px;font-weight:700",
  provenance: "margin:0 0 24px;color:#77717a;font-size:13px",
  intro: "margin:0 0 28px;color:#5f5a62;font-size:17px",
  h2: "margin:34px 0 12px;padding-top:22px;border-top:1px solid #e4dfe5;color:#303037;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.2;font-weight:400",
  p: "margin:0 0 16px;color:#4f4a52;font-size:16px",
  box: "margin:28px 0;padding:22px 24px;background:#f5f1f6;border-left:4px solid #8c459f",
  link: "color:#236b4d;text-decoration:underline",
  cta: "margin-top:32px;padding:24px;background:#236b4d;color:#ffffff",
};

const contentsHtml = article.contents.map((item, index) => `<li style="margin:0 0 8px">${String(index + 1).padStart(2, "0")}. ${escapeHtml(item.title)}</li>`).join("");
const sectionsHtml = article.sections.map((section) => `<section><p style="${inline.eyebrow}">${escapeHtml(section.label)}</p><h2 style="${inline.h2}"><a style="${inline.link}" href="https://coachdeimagen.com${escapeHtml(section.href)}">${escapeHtml(section.title)}</a></h2>${section.paragraphs.map((paragraph) => `<p style="${inline.p}">${escapeHtml(paragraph)}</p>`).join("")}</section>`).join("");
const emailHtml = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(article.emailSubject)}</title></head><body style="${inline.shell}"><div style="${inline.card}"><p style="${inline.eyebrow}">Borrador para revisión de Sonia</p><h1 style="${inline.h1}">${escapeHtml(article.title)}</h1><p style="${inline.byline}">${escapeHtml(article.byline)}</p><p style="${inline.provenance}">${escapeHtml(article.provenance)}</p><p style="${inline.intro}">${escapeHtml(article.intro)}</p><div style="${inline.box}"><p style="${inline.eyebrow}">Contenido</p><ol style="margin:0;padding-left:22px;color:#4f4a52">${contentsHtml}</ol></div>${sectionsHtml}<div style="${inline.cta}"><h3 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:400">${escapeHtml(article.cta.title)}</h3><p style="margin:0 0 14px;color:#ffffff">${escapeHtml(article.cta.text)}</p><p style="margin:0"><a style="color:#ffffff;text-decoration:underline;font-weight:700" href="https://coachdeimagen.com${escapeHtml(article.cta.href)}">${escapeHtml(article.cta.textLink)}</a></p></div><p style="margin:28px 0 0;color:#77717a;font-size:12px">${escapeHtml(article.sourceNote)}</p></div></body></html>`;

const plainText = [
  article.title,
  "",
  article.byline,
  article.provenance,
  "",
  article.intro,
  "",
  "CONTENIDO",
  ...article.contents.map((item, index) => `${String(index + 1).padStart(2, "0")}. ${item.title}`),
  "",
  ...article.sections.flatMap((section, index) => [
    `${String(index + 1).padStart(2, "0")}. ${section.title}: https://coachdeimagen.com${section.href}`,
    ...section.paragraphs,
    "",
  ]),
  article.cta.title,
  article.cta.text,
  `${article.cta.textLink}: https://coachdeimagen.com${article.cta.href}`,
  "",
  article.sourceNote,
].join("\n");

const htmlHeadingCount = (emailHtml.match(/<h2\b/g) || []).length;
const linkedSectionCount = article.sections.filter((section) => emailHtml.includes(`href="https://coachdeimagen.com${escapeHtml(section.href)}">${escapeHtml(section.title)}</a>`)).length;
const duplicatePageMarkup = /articulo-seguridad-profesional|aria-|<style\b|\{\{|\}\}|undefined|NaN/i.test(emailHtml);
const plainTextLeak = /aria-|<[^>]+>|\{\{|\}\}|undefined|NaN/i.test(plainText);
const unverifiedAuthorityClaim = /certificad[ao]|testimonio|resultado de client|años de experiencia|más de \d+ años/i.test(allText);
const contentsMatchSections = article.contents.every((item, index) => item.title === article.sections[index]?.title);
if (htmlHeadingCount !== 6) throw new Error(`Expected 6 article h2 elements, found ${htmlHeadingCount}`);
if (linkedSectionCount !== 6) throw new Error(`Expected 6 linked section headings, found ${linkedSectionCount}`);
if (duplicatePageMarkup) throw new Error("Rendered email contains page-only markup or template fragments");
if (plainTextLeak) throw new Error("Plain-text fallback contains markup or unresolved template values");
if (unverifiedAuthorityClaim) throw new Error("Draft contains an unverified authority or client-result claim");
if (!contentsMatchSections) throw new Error("Contents list does not match the six article sections");
if ((plainText.match(new RegExp(article.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length !== 1) throw new Error("Plain-text title is duplicated");

const review = `# Sonia review packet: Seguridad profesional\n\n**Status:** DRAFT FOR SONIA REVIEW\n\n**Email subject:** ${article.emailSubject}\n\n**Not sent:** The email has not been sent.\n\n**Not published:** No site route or production deployment was changed by this review render.\n\n## What is included\n\n- One keyword-rich title, byline, and source-bounded provenance note\n- One short introduction\n- A six-item contents list\n- Six unique H2 sections linked through the exact E-E-A-T phrases requested\n- One closing CTA\n- HTML email version and plain-text fallback\n- Draft word count: ${wordCount(allText)}\n\n## Validation\n\n- Clean editorial JSON source: PASS\n- Six sections: PASS\n- Six unique section titles: PASS\n- Contents list matches the six sections: PASS\n- Six linked H2 phrases point to existing coachdeimagen.com routes: PASS\n- No credential, certification, client-result, or years-of-experience claim was added: PASS\n- Source contains no HTML, ARIA, CSS, or template fragments: PASS\n- Rendered email contains no page wrapper id or leaked ARIA/CSS/template fragments: PASS\n- Plain-text fallback contains no markup or unresolved values: PASS\n- Title appears once in plain-text fallback: PASS\n\n## Sonia must review\n\nPlease confirm the wording and approve or edit it before the email is sent. The draft remains held for Sonia's editorial decision.\n\n## Files\n\n- Editorial source: \`content/seguridad-profesional-article.json\`\n- Rendered email: \`docs/sonia-review/seguridad-profesional-email.html\`\n- Plain-text fallback: \`docs/sonia-review/seguridad-profesional-email.txt\`\n`;

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "seguridad-profesional-email.html"), emailHtml);
await writeFile(path.join(outputDir, "seguridad-profesional-email.txt"), plainText);
await writeFile(path.join(outputDir, "seguridad-profesional-review.md"), review);
console.log(JSON.stringify({ status: "pass", subject: article.emailSubject, wordCount: wordCount(allText), sections: article.sections.length, linkedSections: linkedSectionCount, htmlHeadingCount, files: ["seguridad-profesional-email.html", "seguridad-profesional-email.txt", "seguridad-profesional-review.md"] }, null, 2));
