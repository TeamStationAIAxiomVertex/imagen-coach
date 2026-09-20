// Normalize only registered page routes. API, asset, external and unknown URLs stay intact.
export function pageUrl(value, routes, origin) {
  if (typeof value !== "string" || !/^(\/|https?:\/\/)/.test(value)) return value;
  const url = new URL(value, origin);
  const route = url.pathname.replace(/\/+$/, "") || "/";
  if (url.origin !== origin || !routes.has(route)) return value;
  url.pathname = route === "/" ? "/" : `${route}/`;
  return value.startsWith("/") && !value.startsWith("//")
    ? `${url.pathname}${url.search}${url.hash}`
    : url.href;
}

export function pageText(html) {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, number) => String.fromCodePoint(Number.parseInt(number.replace(/^x/i, ""), /^x/i.test(number) ? 16 : 10)))
    .replace(/&(nbsp|amp|quot|apos|lt|gt);/g, (_, name) => ({ nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" })[name])
    .replace(/\s+/g, " ").trim();
}

export function faqIsVisible(item, visibleText) {
  const question = pageText(item.name || "");
  const answer = pageText(item.acceptedAnswer?.text || "");
  return Boolean(question && answer && visibleText.includes(question) && visibleText.includes(answer));
}

// The existing templates own copy and schema. This output boundary keeps their URLs
// consistent and omits FAQ claims not supported by the actual page body.
export function finalizePageHtml(html, routes, origin) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || "";
  const visibleText = pageText(main);
  function normalize(value) {
    if (Array.isArray(value)) return value.map(normalize).filter((item) => item !== null);
    if (!value || typeof value !== "object") return typeof value === "string" ? pageUrl(value, routes, origin) : value;
    const result = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalize(item)]));
    const types = [].concat(result["@type"] || []);
    if (types.includes("FAQPage")) {
      result.mainEntity = (result.mainEntity || []).filter((item) => faqIsVisible(item, visibleText));
      if (!result.mainEntity.length) return null;
    }
    return result;
  }
  return html
    .replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (_, body) => {
      const schema = normalize(JSON.parse(body));
      return schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : "";
    })
    .replace(/\b(href|content)="([^"]*)"/g, (attribute, name, value) => {
      const normalized = pageUrl(value, routes, origin);
      return normalized === value ? attribute : `${name}="${normalized}"`;
    });
}
