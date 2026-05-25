# Software Design Document

## Project

`imagen-coach`: full rebuild of Sonia McRorey's general site on the new canonical domain `https://coachdeimagen.com`.

## Objective

Rebuild the current Weblium site as a GitHub-managed, Cloudflare-deployed static site and holistic executive image coaching platform while preserving:

- all 35 canonical URLs
- Sonia McRorey's source content and authorship
- current image assets where available
- existing article archive
- SEO continuity
- the polished UX/UI quality of `imagengdl.com`

The master positioning is defined in `docs/wiki.llm`: Coach De Imagen is `Coaching de Imagen, Presencia y Posicionamiento Profesional`, and the site must preserve psychological depth plus executive clarity while reinforcing imagen, presencia, percepción, liderazgo and posicionamiento profesional.

## Current State

The current site is Weblium-hosted. This repo contains:

- raw HTML archive of 35 pages
- extracted text archive of 35 pages
- downloaded and de-duplicated image assets
- a clean content layer with obvious Weblium junk removed
- a formal URL inventory

## Target Architecture

The first production implementation should be a static site unless future requirements prove otherwise.

Recommended shape:

- source content: `content/clean/`
- source assets: `archive/imagencoach/images/_shared/` copied or referenced into the public asset tree during build
- page registry: generated or hand-curated from `content/clean/manifest.json`
- routes: one generated static page per canonical URL
- shared layout: header, footer, CTA, article cards, service cards, contact section
- generated output: Cloudflare Pages-compatible static artifact

The presentation architecture must separate:

- commercial pages: short, visual, decision-oriented conversion pages
- hub pages: category maps that organize services, articles, FAQs and comparisons
- article pages: long-form static authority pages with normal editorial reading flow

Do not reuse article rendering rules for service pages, and do not reuse service/pillar card treatments inside article body prose.

## Required Routes

The site must build every route in `docs/source-url-inventory.md`.

No canonical route may disappear during migration. If a page is consolidated, its old URL still needs a documented `301` redirect.

## UX/UI Requirements

Use the `guadalajara` site as the visual and interaction reference:

- editorial corporate elegance
- muted cool feminine palette
- restrained typography
- clean service cards
- structured article cards
- calm CTA rhythm
- mobile-first readability

Do not import Guadalajara positioning wholesale. `coachdeimagen.com` is the larger/general Sonia site, not the local Guadalajara-only funnel.

## Content Requirements

Use `content/clean/pages/*.md` as the implementation source. Keep raw crawl untouched for audit.

The implementation must:

- preserve Sonia's original ideas and wording where practical
- remove duplicated Weblium nav/footer/form junk
- map each page to its source URL and source archive file
- preserve image intent by using the archived asset mapping
- keep contact and CTA copy consistent across pages through shared components
- use Sonia's blog archive, quote bank and Drive source inventory as controlled domain knowledge before adding or refactoring source-grounded content
- sanitize any Drive-derived material before public use

Content density requirements:

- commercial pages target 850-1200 visible words
- hub pages target 450-900 visible words
- comparison pages target 650-1100 visible words
- article pages may be long, but must remain readable through article navigation, H2/H3 hierarchy, service bridges and related reading

Run `npm run audit:content` before large content refactors and use `docs/CONTENT_DENSITY_AUDIT.md` as the current baseline.

## Sonia Knowledgebase Sources

The design source-of-truth includes:

- `content/blog/soniamcrorey-blog.json`
- `content/sonia-knowledge/quote-bank.json`
- `content/sonia-knowledge/drive-source-inventory.json`
- `content/sonia-knowledge/drive-quote-bank.json`
- `docs/SONIA_KNOWLEDGEBASE_QUOTE_BANK.md`
- `docs/SONIA_DRIVE_KNOWLEDGEBASE.md`

These sources are used to align public pages with Sonia's own language, credentials, teaching frameworks, methodology and service architecture. They are not raw page copy. Agents must extract, compress and map material to page intent.

Drive material must never emit private banking/payment details, outdated contact details, old domains, program-only logistics or dated pricing into generated public HTML.

## SEO Requirements

Every page needs:

- canonical URL on `https://coachdeimagen.com`
- title and description
- Open Graph metadata
- sensible article/service schema where applicable
- sitemap inclusion
- internal links that preserve crawl flow
- raw HTML semantic chunking for AI retrieval
- executive buyer-intent headings and FAQs
- no visible SEO keyword bolding or generated emphasis inside Sonia's page copy

The sitemap must include all 35 canonical URLs.

## Agentic GEO Requirements

The rebuilt site must publish machine-readable discovery files:

- `/openapi.json`
- `/llms.txt`
- `/llms-full.txt`
- `/entities.json`
- `/semantic-index.json`
- `/agent/site-profile.json`
- `/agent/services.json`
- `/agent/contact.json`
- `/agent/publications.json`
- `/agent/ontology.json`
- `/agent/page-signals.json`
- `/agent/redirects.json`
- `/agent/conversion-map.json`

Each generated page must expose discovery links in the document head:

- `rel="service-desc"` for OpenAPI
- `rel="alternate"` for `llms.txt`
- `rel="alternate"` for `llms-full.txt`
- `rel="alternate"` for the structured site profile

Every page uses `lang="es-MX"` and a self-referencing `hreflang="es-MX"` link.

## Known Source Defects

The current site has internal `/articulos/...` links that return 404. These must be removed or redirected to their matching `/imagen-presencia/...` article routes.

One article has broken `undefined?w=...` image references in Weblium. These are not valid source assets and must not be implemented.

## Deployment

Target deployment is GitHub to Cloudflare Pages.

Before DNS cutover:

- preview build must pass
- URL contract crawl must pass
- asset validation must pass
- rendered pages must be checked on desktop and mobile
- redirects must be validated

## Definition Of Done

The rebuild is done only when:

- all canonical URLs return `200`
- planned legacy redirects return `301`
- no Weblium junk appears in rendered pages
- no broken local image paths exist
- sitemap and canonical tags match production domain
- Cloudflare Pages build is reproducible from a clean checkout
- the site visually matches the `imagengdl.com` UX/UI standard while retaining the Coach De Imagen content identity
- rendered pages avoid dominant wellness, spirituality, abundance or self-help classification
- all visible content preserves Sonia's wording without injected SEO emphasis
