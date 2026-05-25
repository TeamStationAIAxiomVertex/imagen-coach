const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

function wantsMarkdown(request) {
  const accept = request.headers.get("accept") || "";
  return /\btext\/markdown\b|\btext\/x-markdown\b/i.test(accept);
}

function isPageRequest(url) {
  if (url.pathname.startsWith("/api/")) return false;
  if (url.pathname.startsWith("/assets/")) return false;
  if (url.pathname.includes(".")) return false;
  return true;
}

function markdownPath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, "") || "/";
  return cleanPath === "/" ? "/index.md" : `${cleanPath}.md`;
}

function markdownHeaders(text) {
  return {
    "content-type": MARKDOWN_CONTENT_TYPE,
    "cache-control": "public, max-age=300, stale-while-revalidate=86400",
    "x-content-type-options": "nosniff",
    "x-markdown-tokens": String(Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length * 1.3))),
    vary: "Accept",
  };
}

function htmlToMarkdown(html) {
  const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "Coach De Imagen";
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return body.startsWith("#") ? `${body}\n` : `# ${title.replace(/<[^>]+>/g, " ").trim()}\n\n${body}\n`;
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (!["GET", "HEAD"].includes(request.method) || !wantsMarkdown(request) || !isPageRequest(url)) {
    return context.next();
  }

  const markdownUrl = new URL(markdownPath(url.pathname), url.origin);
  const markdownResponse = await fetch(markdownUrl, {
    headers: { accept: "text/plain, text/markdown;q=0.9,*/*;q=0.1" },
    cf: { cacheTtl: 300, cacheEverything: true },
  });

  if (markdownResponse.ok) {
    const text = await markdownResponse.text();
    if (!/<!doctype html|<html[\s>]/i.test(text)) {
      return new Response(request.method === "HEAD" ? null : text, {
        status: 200,
        headers: markdownHeaders(text),
      });
    }
  }

  const htmlResponse = await context.next();
  const html = await htmlResponse.text();
  const markdown = htmlToMarkdown(html);
  return new Response(request.method === "HEAD" ? null : markdown, {
    status: htmlResponse.status,
    headers: markdownHeaders(markdown),
  });
}
