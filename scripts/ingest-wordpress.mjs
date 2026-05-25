import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WP_BASE_URL = process.env.WP_BASE_URL?.replace(/\/+$/, "");
const OUT_DIR = path.join(ROOT, "content", "blog", "posts");
const STATE_FILE = path.join(ROOT, "content", "blog", "wp-ingestion-state.json");
const AGGREGATE_FILE = path.join(ROOT, "content", "blog", "soniamcrorey-blog.json");
const WRITE_POST_FILES = process.env.WRITE_POST_FILES === "1";

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
  const maxAttempts = 4;
  const timeoutMs = 75000;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Fetch failed ${response.status} ${url}`);
      const json = await response.json();
      return {
        json,
        total: Number(response.headers.get("x-wp-total") || 0),
        totalPages: Number(response.headers.get("x-wp-totalpages") || 1),
      };
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        console.warn(`Retrying ${url} after ${error.message || error.name}`);
        await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError;
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
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || post.yoast_head_json?.og_image?.[0]?.url || null;
  const author = post._embedded?.author?.[0]?.name || post.yoast_head_json?.author || null;
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
    contentText: stripTags(contentHtml),
    categories: post.categories || [],
    tags: post.tags || [],
    featuredMediaId: post.featured_media || null,
    featuredImage,
    media: post._embedded?.["wp:featuredmedia"]?.[0]
      ? {
          id: post._embedded["wp:featuredmedia"][0].id,
          sourceUrl: post._embedded["wp:featuredmedia"][0].source_url || null,
          altText: post._embedded["wp:featuredmedia"][0].alt_text || "",
          caption: stripTags(post._embedded["wp:featuredmedia"][0].caption?.rendered || ""),
          mediaType: post._embedded["wp:featuredmedia"][0].media_type || null,
          mimeType: post._embedded["wp:featuredmedia"][0].mime_type || null,
        }
      : null,
    author,
    yoast: post.yoast_head_json || null,
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

function normalizeTerm(term) {
  return {
    id: term.id,
    slug: term.slug,
    name: stripTags(term.name || ""),
    taxonomy: term.taxonomy,
    link: term.link,
    count: term.count,
    parent: term.parent || 0,
    description: stripTags(term.description || ""),
  };
}

async function fetchAllWp(endpoint, params = {}, pageSize = 100) {
  const records = [];
  let total = 0;
  let totalPages = 1;

  for (let page = 1; page <= totalPages; page += 1) {
    const url = new URL(`${WP_BASE_URL}/wp-json/wp/v2/${endpoint}`);
    url.searchParams.set("per_page", String(pageSize));
    url.searchParams.set("page", String(page));
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }

    const response = await fetchJson(url);
    if (!Array.isArray(response.json)) {
      throw new Error(`Expected array response for ${url}`);
    }
    total = response.total || total;
    totalPages = response.totalPages || totalPages;
    records.push(...response.json);
    console.log(`Fetched ${endpoint} page ${page}/${totalPages} (${records.length}/${total || "unknown"})`);
  }

  return { records, total, totalPages };
}

async function main() {
  if (!WP_BASE_URL) {
    usage();
    process.exit(0);
  }

  await mkdir(path.dirname(AGGREGATE_FILE), { recursive: true });
  if (WRITE_POST_FILES) {
    await mkdir(OUT_DIR, { recursive: true });
  }
  const rss = await fetchText(`${WP_BASE_URL}/feed/`);
  const postsResult = await fetchAllWp("posts", {}, 50);
  const categoriesResult = await fetchAllWp("categories");
  const tagsResult = await fetchAllWp("tags");
  const posts = postsResult.records;
  const categories = categoriesResult.records.map(normalizeTerm);
  const tags = tagsResult.records.map(normalizeTerm);
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const tagById = new Map(tags.map((tag) => [tag.id, tag]));
  const state = await readState();
  const nextState = {
    source: WP_BASE_URL,
    rssHash: hash(rss),
    checkedAt: new Date().toISOString(),
    totalPosts: postsResult.total,
    totalPostPages: postsResult.totalPages,
    totalCategories: categoriesResult.total,
    totalTags: tagsResult.total,
    aggregateFile: path.relative(ROOT, AGGREGATE_FILE),
    posts: {},
  };
  let changed = 0;
  const normalizedPosts = [];

  for (const post of posts) {
    const normalized = normalizePost(post);
    normalized.categoryTerms = normalized.categories.map((id) => categoryById.get(id)).filter(Boolean);
    normalized.tagTerms = normalized.tags.map((id) => tagById.get(id)).filter(Boolean);
    normalizedPosts.push(normalized);
    nextState.posts[normalized.slug] = {
      id: normalized.id,
      modified: normalized.modified,
      sourceHash: normalized.sourceHash,
      canonicalRoute: normalized.canonicalRoute,
    };
    if (state.posts?.[normalized.slug]?.sourceHash !== normalized.sourceHash) {
      changed += 1;
      if (WRITE_POST_FILES) {
        await writeFile(path.join(OUT_DIR, `${normalized.slug}.json`), `${JSON.stringify(normalized, null, 2)}\n`);
      }
    }
  }

  normalizedPosts.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const aggregate = {
    source: {
      site: WP_BASE_URL,
      api: `${WP_BASE_URL}/wp-json/wp/v2/posts`,
      rss: `${WP_BASE_URL}/feed/`,
      fetchedAt: nextState.checkedAt,
      method: "wordpress-rest-api-pagination",
    },
    totals: {
      posts: posts.length,
      categories: categories.length,
      tags: tags.length,
      apiReportedPosts: postsResult.total,
      apiPostPages: postsResult.totalPages,
    },
    taxonomies: {
      categories,
      tags,
    },
    posts: normalizedPosts,
  };

  await writeFile(AGGREGATE_FILE, `${JSON.stringify(aggregate, null, 2)}\n`);
  await writeFile(STATE_FILE, `${JSON.stringify(nextState, null, 2)}\n`);
  console.log(`WordPress ingestion complete. ${posts.length} posts checked, ${changed} changed.`);
  console.log(`Aggregate JSON written to ${path.relative(ROOT, AGGREGATE_FILE)}.`);
  if (WRITE_POST_FILES) {
    console.log(`Per-post JSON files written to ${path.relative(ROOT, OUT_DIR)}.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
