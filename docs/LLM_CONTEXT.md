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

Not done yet:

- copy/adapt Guadalajara UX/UI implementation
- build actual static site routes
- generate production sitemap/robots/metadata
- implement redirects for broken legacy internal links
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
