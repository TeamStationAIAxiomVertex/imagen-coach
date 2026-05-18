# Implementation Roadmap

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
- 35 canonical URLs validated against crawl manifest

## Phase 2: Clean Content Layer

Status: complete.

Evidence:

- `content/clean/manifest.json`
- `content/clean/pages/`
- `scripts/build_clean_content.py`

Current cleanup removes Weblium duplicates and known junk while keeping raw source available.

## Phase 3: Theme Adoption

Status: not started.

Goal:

Bring the UX/UI system from `TeamStationAIAxiomVertex/guadalajara` into this repo without merging the two site identities.

Expected work:

- inspect `guadalajara` layout, CSS, assets, build scripts, and deployment config
- choose static implementation approach for this repo
- bring over typography, spacing, color tokens, header/footer rhythm, CTA style, cards, article layout, and mobile behavior
- adapt, do not copy, Guadalajara-specific content

## Phase 4: Route Implementation

Status: not started.

Goal:

Render all 35 canonical URLs from `content/clean/manifest.json`.

Expected page templates:

- home
- about
- service hub
- service detail
- article index
- article detail

## Phase 5: SEO And Agent Files

Status: partially started.

Done:

- root `llms.txt`
- documentation context

Remaining:

- production `sitemap.xml`
- `robots.txt`
- Open Graph metadata
- canonical tags
- JSON-LD schema
- article/service metadata model

## Phase 6: Validation

Status: not started.

Required validation:

- source URL coverage
- build
- route output
- asset existence
- internal links
- SEO metadata
- visual QA on desktop/mobile
- Cloudflare preview crawl

## Phase 7: Cloudflare Deployment

Status: not started.

Required work:

- configure Cloudflare Pages project
- set build command/output directory
- attach `imagencoach.com`
- test preview before DNS cutover
- keep rollback path to Weblium until production validation passes
