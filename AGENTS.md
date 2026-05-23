# ImagenCoach Rebuild Agent Instructions

You are operating in the `imagen-coach` repository for the full rebuild of `imagencoach.com`.

This repository is the new source of truth for the larger/general Sonia McRorey site. Do not confuse it with `TeamStationAIAxiomVertex/guadalajara`, which powers the Guadalajara-specific `imagengdl.com` site.

## Mission

Rebuild `imagencoach.com` as a professional, production-ready static site using:

- the exact canonical URL inventory from the current Weblium site
- the archived source content and images in this repo
- the cleaned migration content layer in this repo
- the UX/UI language and visual system proven in the Guadalajara site

The result must preserve Sonia's authorship, existing URLs, source images, SEO surface, and professional tone while removing Weblium duplication, broken internal junk, and implementation noise.

## Source Of Truth Order

Use these sources in order:

1. `docs/source-url-inventory.md` for every required route.
2. `archive/imagencoach/manifest.json` for crawl evidence, page metadata, image mapping, and known failures.
3. `archive/imagencoach/raw-html/` for original source proof.
4. `archive/imagencoach/text/` for raw visible text and source links.
5. `content/clean/` for rebuild-ready body content and deduplicated asset mapping.
6. `docs/SDD.md`, `docs/DDD.md`, `docs/TDD.md`, and `docs/LLM_CONTEXT.md` for implementation decisions.
7. `docs/wiki.llm`, `docs/UBIQUITOUS_LANGUAGE.md`, `docs/GEO_OPERATING_SYSTEM.md`, `docs/PAGE_SIGNAL_MAP.md`, and `docs/REDIRECTS_AND_URL_RETENTION.md` for agentic GEO, ontology, redirect, and semantic governance.
8. `TeamStationAIAxiomVertex/guadalajara` only as the UX/UI/theme reference, not as this site's content source.

Do not invent pages, slugs, services, images, schemas, or positioning without evidence.

## Non-Negotiable URL Contract

All 35 canonical URLs documented in `docs/source-url-inventory.md` must work in the rebuilt site.

Preserve existing paths exactly, including:

- `/servicios-asesoria-de-imagen-coaching/preguntas-frequentes`
- `/imagen-presencia/y-si-tu-imagen-no-fuera-un-disfraz-sino-una-puerta-para-regresar-a-ti-article`

If a route changes later, document a 301 redirect decision before implementation.

## UX/UI Rule

The main site must share the same visual system and interaction quality as `imagengdl.com`, but it is not a copy of the Guadalajara content strategy.

Use the Guadalajara repo as the design reference for:

- typography
- colors
- spacing
- header/footer rhythm
- CTA style
- service cards
- article cards
- mobile behavior
- clean editorial corporate tone

Do not turn `imagencoach.com` into a local Guadalajara landing page. It is the larger general site.

## Content Rules

The raw crawl is evidence. Do not edit it casually.

Use `content/clean/` for implementation. If cleanup rules need to change, update `scripts/build_clean_content.py`, regenerate, and explain why.

Remove:

- repeated nav/menu/logo text
- Weblium UUIDs
- Weblium form failure messages
- broken `undefined` artifacts
- duplicated boilerplate
- broken internal `/articulos/...` links unless redirected

Preserve:

- Sonia's wording and cadence
- article titles and body concepts
- testimonials where present
- contact details where still valid
- source image mappings
- page intent and route identity

## Brand Voice

The voice must be calm, intelligent, executive, reflective, and grounded.

Do not use:

- generic marketing filler
- influencer language
- luxury spa language
- hype coaching language
- SEO stuffing
- invented frameworks
- ungrounded claims

SEO supports Sonia's voice. SEO must not impersonate Sonia.

## Engineering Rules

- Read source files before editing.
- Trace impact across routes, content, sitemap, redirects, assets, metadata, schema, and Cloudflare deployment.
- Keep generated artifacts reproducible with scripts.
- Prefer static, inspectable output unless a stronger architecture is justified.
- Validate route coverage, broken links, image paths, metadata, and mobile layout before declaring work complete.
- Keep raw crawl, clean content, implementation, and generated `dist` conceptually separate.

## Testing Expectations

Before deployment, validation must prove:

- all 35 canonical URLs build
- all internal links resolve or intentionally redirect
- all referenced local images exist
- sitemap includes all canonical URLs
- robots and canonical metadata point to `https://imagencoach.com`
- no Weblium UUID/nav/form junk leaks into rendered content
- pages render cleanly on mobile and desktop
- Cloudflare Pages can build from GitHub
- the agentic files build and publish: `/openapi.json`, `/llms-full.txt`, and `/agent/*.json`

## Git Discipline

Use small, meaningful commits. Do not overwrite the Guadalajara repo. Do not delete the raw crawl unless explicitly instructed.
