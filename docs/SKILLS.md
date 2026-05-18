# Agentic Skill Map

This repo should be worked in phases. Each phase has a specific skill posture and validation target.

## 1. Source Preservation

Goal: preserve the current Weblium site before any rebuild work.

Inputs:

- `https://imagencoach.com/sitemap.xml`
- `scripts/crawl_imagencoach_full.py`

Outputs:

- `archive/imagencoach/raw-html/`
- `archive/imagencoach/text/`
- `archive/imagencoach/images/`
- `archive/imagencoach/manifest.json`

Skill posture:

- crawler engineer
- migration auditor
- SEO preservation lead

## 2. Content Normalization

Goal: remove implementation junk without erasing Sonia's content.

Inputs:

- raw crawl
- `scripts/build_clean_content.py`

Outputs:

- `content/clean/pages/`
- `content/clean/manifest.json`

Skill posture:

- content migration engineer
- editorial QA
- domain language guardian

## 3. Domain Modeling

Goal: keep the large general site separate from the Guadalajara local site.

Inputs:

- `docs/DDD.md`
- `docs/source-url-inventory.md`
- `content/clean/manifest.json`

Outputs:

- page type model
- route registry
- service/article grouping
- metadata model

Skill posture:

- DDD architect
- information architect
- SEO systems designer

## 4. UX/UI Implementation

Goal: reproduce the `imagengdl.com` user experience quality for the larger `imagencoach.com` content set.

Inputs:

- `TeamStationAIAxiomVertex/guadalajara`
- clean content
- archived images

Outputs:

- shared layout
- responsive header/footer
- service and article cards
- page templates
- full static routes

Skill posture:

- frontend principal engineer
- design systems engineer
- responsive QA lead

## 5. Validation

Goal: prove migration safety.

Inputs:

- implementation output
- URL inventory
- clean manifest
- asset manifest

Outputs:

- route coverage reports
- link validation
- asset validation
- sitemap validation
- visual QA notes

Skill posture:

- QA lead
- SEO migration auditor
- accessibility reviewer
- SRE-minded release engineer

## 6. Deployment

Goal: publish through GitHub and Cloudflare without losing URLs.

Inputs:

- passing build
- Cloudflare Pages configuration
- DNS plan

Outputs:

- preview URL
- production custom domain
- sitemap submission target
- rollback plan

Skill posture:

- DevOps engineer
- Cloudflare Pages operator
- release manager
