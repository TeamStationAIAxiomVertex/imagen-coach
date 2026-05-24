# Implementation Roadmap

## Current Status

The rebuild has moved from source capture into a working static site and agentic GEO platform.

Current verified state:

- 35 canonical routes build from `content/clean/manifest.json`
- generated output is static Cloudflare Pages-compatible HTML/CSS/JS
- sitemap, robots, redirects and canonical metadata are generated
- OpenAPI, `llms-full.txt` and `/agent/*.json` files are generated
- article clusters exist in `content/strategy/article-clusters.json`
- validation checks route coverage, assets, agent files, redirects, language/hreflang and junk leakage

Remaining work is no longer basic route generation. The next work is content restructuring, blog import, social proof integration, visual QA and Cloudflare launch hardening.

The current strategic pivot is content-density reduction and visual semantic compression. `coachdeimagen.com` must become a visual semantic authority engine, not a paragraph-first archive.

## Phase 0: Source Capture

Status: complete.

Evidence:

- `archive/imagencoach/manifest.json`
- `archive/imagencoach/raw-html/`
- `archive/imagencoach/text/`
- `archive/imagencoach/images/`

## Phase 1: Migration Contract

Status: complete.

Evidence:

- `docs/source-url-inventory.md`
- `docs/REDIRECTS_AND_URL_RETENTION.md`
- 35 canonical URLs validated against crawl manifest

## Phase 2: Clean Content Layer

Status: complete.

Evidence:

- `content/clean/manifest.json`
- `content/clean/pages/`
- `scripts/build_clean_content.py`

The clean layer removes obvious Weblium duplicates and known junk while keeping the raw crawl available for audit.

## Phase 3: Theme Adoption

Status: implemented, needs visual QA.

Evidence:

- `styles.css`
- `script.js`
- `assets/`
- `scripts/build-static.mjs`

The site uses the Guadalajara visual system as a restrained reference while keeping ImagenCoach positioning separate.

Remaining:

- desktop/laptop/tablet/mobile screenshots
- page-by-page image fit review
- no-overlap UI QA

## Phase 4: Route Implementation

Status: implemented.

Evidence:

- `scripts/build-static.mjs`
- `npm run build`
- `npm run validate`
- generated `dist/` output

Implemented templates:

- home
- about
- service hub
- service detail
- article index
- article detail

Remaining:

- replace arbitrary text chunking with structured semantic sections
- redesign core pages into visual modules using all source content

## Phase 5: SEO And Agent Files

Status: implemented, needs enrichment.

Implemented:

- `sitemap.xml`
- `robots.txt`
- `_redirects`
- canonical tags
- Open Graph metadata
- JSON-LD baseline
- `llms.txt`
- `llms-full.txt`
- `/openapi.json`
- `/agent/site-profile.json`
- `/agent/services.json`
- `/agent/contact.json`
- `/agent/publications.json`
- `/agent/ontology.json`
- `/agent/page-signals.json`
- `/agent/redirects.json`
- `/agent/conversion-map.json`

Remaining:

- richer `Person`, `ProfessionalService`, `FAQPage`, `BreadcrumbList`, `Article` and `BlogPosting` schema
- curated page signal map
- WordPress blog ingestion into publications graph
- Instagram feed ingestion as static social proof

## Phase 6: Content Restructure

Status: in progress.

Source plan:

- `docs/CONTENT_RESTRUCTURE_BLOG_SOCIAL_PLAN.md`
- `docs/CONTENT_DENSITY_AUDIT.md`

Goal:

Compress commercial pages into clear buyer decisions while keeping Sonia's long-form authority in article pages, hubs and structured FAQ blocks.

Commercial/service pages target 850-1200 visible words. Hubs target 450-900 visible words. Article pages keep long-form depth and should read as editorial posts, not pillar/service pages.

Expected output:

- `content/structured/pages/*.json`
- visible content budgets by page type
- service workflow modules
- decision trees and before/after state maps
- article cluster bridges instead of article dumps
- CTA bridges after major decision points
- `content/structured/manifest.json`
- semantic H1/H2/H3/H4 hierarchy
- redesigned core pages without loose text boxes

## Phase 7: Weblium Blog Import And WordPress Publishing

Status: planned.

Goal:

Before shutting down Weblium, archive every blog post and image. Then use WordPress as Sonia's blog authoring engine while the static site renders canonical public posts for interlinking, ontology and domain authority.

Expected output:

- `docs/blog-url-inventory.md`
- `scripts/crawl_weblium_blog.py`
- `scripts/import_wordpress_posts.mjs`
- `content/blog/posts/*.json`
- generated blog pages
- updated sitemap
- updated `/agent/publications.json`

## Phase 8: Instagram Social Proof

Status: planned.

Goal:

Pull a small approved Instagram feed into static cached data and display it as visual proof, not core SEO content.

Expected output:

- `scripts/import_instagram_feed.mjs`
- `content/social/instagram.json`
- static feed component
- validation for media and permalinks

## Phase 9: Validation

Status: implemented, expanding.

Current command:

```bash
npm run build && npm run validate
```

Current validation checks:

- route output
- image assets
- junk leakage
- `es-MX` language and hreflang
- discovery links
- sitemap URLs
- agentic files
- JSON parsing
- robots references
- redirect preservation
- canonical URL correctness
- localhost/Weblium host leakage

Remaining:

- internal link crawl
- structured data validation
- WordPress import validation
- Instagram import validation
- visual QA screenshots
- Cloudflare preview crawl

## Phase 10: Cloudflare Deployment

Status: not started.

Required work:

- configure Cloudflare Pages project
- build command: `npm run build`
- output directory: `dist`
- attach `imagencoach.com`
- test preview before DNS cutover
- keep rollback path to Weblium until production validation passes

## Launch Gate

Do not cut DNS from Weblium to Cloudflare until:

- all 35 canonical URLs return 200 in preview
- legacy redirects return 301
- imported Weblium blog inventory is complete
- WordPress canonical ownership is decided
- sitemap validates
- agent files validate
- visual QA passes desktop and mobile
- Search Console and analytics are ready for post-launch monitoring
