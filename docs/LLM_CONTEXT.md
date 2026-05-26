# LLM Context

Use this file to orient future agents quickly.

## Repository

`TeamStationAIAxiomVertex/imagen-coach`

Purpose: rebuild the larger/general `imagencoach.com` site.

## Do Not Confuse

`TeamStationAIAxiomVertex/guadalajara` is the Guadalajara-specific `imagengdl.com` repo. It is the UX/UI/theme reference, not the content source for this repo.

## Current Status

Done:

- new GitHub repo created
- current Weblium site crawled
- 35 canonical URLs archived
- images downloaded/mapped
- source URL inventory documented
- clean content layer generated
- static route generator implemented
- agentic discovery layer added to build output
- Sonia blog archive and Drive source material added as controlled domain knowledge sources

Not done yet:

- run browser visual QA
- configure Cloudflare Pages for `imagencoach.com`

## Critical Files

- `AGENTS.md`: operating rules
- `docs/source-url-inventory.md`: URL contract
- `archive/imagencoach/manifest.json`: raw crawl manifest
- `content/clean/manifest.json`: cleaned content manifest
- `content/clean/pages/`: rebuild-ready page text
- `scripts/crawl_imagencoach_full.py`: full source crawler
- `scripts/build_clean_content.py`: cleanup generator
- `docs/SDD.md`: software design
- `docs/DDD.md`: domain language and entities
- `docs/TDD.md`: validation plan
- `docs/wiki.llm`: ontology and agent-readable semantic governance
- `docs/UBIQUITOUS_LANGUAGE.md`: approved language and forbidden drift
- `docs/GEO_OPERATING_SYSTEM.md`: agentic GEO strategy
- `docs/PAGE_SIGNAL_MAP.md`: page-level signal map
- `docs/REDIRECTS_AND_URL_RETENTION.md`: URL and redirect rules
- `content/blog/soniamcrorey-blog.json`: Sonia blog archive knowledge source
- `content/sonia-knowledge/quote-bank.json`: candidate Sonia-authored quote bank
- `content/sonia-knowledge/drive-source-inventory.json`: Drive document and presentation inventory
- `content/sonia-knowledge/drive-quote-bank.json`: Drive-derived candidate quote and teaching-signal bank
- `content/sonia-knowledge/teaching-route-map.json`: source-validated public teaching module map
- `docs/SONIA_KNOWLEDGEBASE_QUOTE_BANK.md`: blog quote guidance
- `docs/SONIA_DRIVE_KNOWLEDGEBASE.md`: Drive source relevance and usage rules
- `docs/SONIA_TEACHING_ROUTE_MAP.md`: public teaching-module governance

## Sonia Source Material

Before writing or refactoring source-grounded content, use Sonia's own material:

- blog archive for long-tail language and article authority
- quote bank for candidate phrasing
- Drive inventory for service architecture, biography, methodology, presentations and visual assets

Do not publish raw Drive documents, private payment details, old contact details, old prices, bank information or dated program logistics. Use sanitized, page-specific extracts only.

## Public Teaching Layer

Sonia quote addendums are generated from `content/sonia-knowledge/teaching-route-map.json`. The build validates each `sourceSnippet` against reviewed quote banks. Add or revise public teaching modules there, not directly in page templates.

## Agentic Files

The Cloudflare build publishes:

- `https://imagencoach.com/openapi.json`
- `https://imagencoach.com/llms.txt`
- `https://imagencoach.com/llms-full.txt`
- `https://imagencoach.com/agent/site-profile.json`
- `https://imagencoach.com/agent/services.json`
- `https://imagencoach.com/agent/contact.json`
- `https://imagencoach.com/agent/publications.json`
- `https://imagencoach.com/agent/ontology.json`
- `https://imagencoach.com/agent/page-signals.json`
- `https://imagencoach.com/agent/redirects.json`
- `https://imagencoach.com/agent/conversion-map.json`

## Route Contract

There are 35 canonical URLs:

- 9 main/service/about/index pages
- 26 article pages under `/imagen-presencia`

Every route must survive the rebuild.

## Voice

Calm, intelligent, executive, reflective, grounded.

Never turn Sonia into a generic influencer, luxury spa brand, fashion makeover brand, or SEO-stuffed coaching funnel.

## Visual Target

Use the same UX/UI quality as `imagengdl.com`:

- editorial corporate elegance
- cool muted palette
- restrained typography
- strong spacing
- clean cards
- real image usage
- mobile polish

## Known Source Defects

Four internal `/articulos/...` links return 404 in the current site. They should be removed or redirected to matching `/imagen-presencia/...` article routes.

One article has `undefined?w=...` image references. Do not use those.
