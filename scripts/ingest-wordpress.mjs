import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WP_BASE_URL = process.env.WP_BASE_URL?.replace(/\/+$/, "");
const OUT_DIR = path.join(ROOT, "content", "blog", "posts");
const STATE_FILE = path.join(ROOT, "content", "blog", "wp-ingestion-state.json");

function usage() {
  console.log("Set WP_BASE_URL to the WordPress origin before ingestion, for example:");
  console.log("WP_BASE_URL=https://example.com npm run ingest:wordpress");
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stripTags(value = "") {
  return String(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Fetch failed ${response.status} ${url}`);
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { Accept: "application/rss+xml,text/xml" } });
  if (!response.ok) throw new Error(`Fetch failed ${response.status} ${url}`);
  return response.text();
}

async function readState() {
  try {
    return JSON.parse(await readFile(STATE_FILE, "utf8"));
  } catch {
    return { posts: {} };
  }
}

function normalizePost(post) {
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
  const author = post._embedded?.author?.[0]?.name || null;
  const contentHtml = post.content?.rendered || "";
  return {
    source: "wordpress-rest-api",
    id: post.id,
    slug: post.slug,
    canonicalRoute: `/blog/${post.slug}/`,
    sourceUrl: post.link,
    date: post.date_gmt || post.date,
    modified: post.modified_gmt || post.modified,
    title: stripTags(post.title?.rendered || ""),
    excerpt: stripTags(post.excerpt?.rendered || ""),
    contentHtml,
    categories: post.categories || [],
    tags: post.tags || [],
    featuredImage,
    author,
    sourceHash: hash(JSON.stringify({ title: post.title, excerpt: post.excerpt, content: post.content, modified: post.modified_gmt || post.modified })),
    ontology: {
      status: "pending-classification",
      parentHubs: [],
      lateralArticles: [],
      serviceRoute: null,
      authorityRoute: "/sobre-sonia-mcrorey-asesora-de-imagen",
    },
  };
}

async function main() {
  if (!WP_BASE_URL) {
    usage();
    process.exit(0);
  }

  await mkdir(OUT_DIR, { recursive: true });
  const rss = await fetchText(`${WP_BASE_URL}/feed/`);
  const posts = await fetchJson(`${WP_BASE_URL}/wp-json/wp/v2/posts?per_page=100&_embed=1`);
  const state = await readState();
  const nextState = {
    source: WP_BASE_URL,
    rssHash: hash(rss),
    checkedAt: new Date().toISOString(),
    posts: {},
  };
  let changed = 0;

  for (const post of posts) {
    const normalized = normalizePost(post);
    nextState.posts[normalized.slug] = {
      id: normalized.id,
      modified: normalized.modified,
      sourceHash: normalized.sourceHash,
      canonicalRoute: normalized.canonicalRoute,
    };
    if (state.posts?.[normalized.slug]?.sourceHash !== normalized.sourceHash) {
      changed += 1;
      await writeFile(path.join(OUT_DIR, `${normalized.slug}.json`), `${JSON.stringify(normalized, null, 2)}\n`);
    }
  }

  await writeFile(STATE_FILE, `${JSON.stringify(nextState, null, 2)}\n`);
  console.log(`WordPress ingestion complete. ${posts.length} posts checked, ${changed} changed.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
