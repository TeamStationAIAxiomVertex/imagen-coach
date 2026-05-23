# ImagenCoach Rebuild Agent Instructions

You are operating in the `imagen-coach` repository for the full rebuild of `imagencoach.com`.

This repository is the new source of truth for the larger/general Sonia McRorey site. Do not confuse it with `TeamStationAIAxiomVertex/guadalajara`, which powers the Guadalajara-specific `imagengdl.com` site.

## Mission

Rebuild `imagencoach.com` as a professional, production-ready static site and semantic authority engine for holistic coaching de imagen, presencia and posicionamiento profesional in Mexico and LATAM using:

- the exact canonical URL inventory from the current Weblium site
- the archived source content and images in this repo
- the cleaned migration content layer in this repo
- the UX/UI language and visual system proven in the Guadalajara site
- the holistic image coaching ontology in `docs/wiki.llm`

The result must preserve Sonia's authorship, existing URLs, source images, SEO surface, and professional tone while removing Weblium duplication, broken internal junk, implementation noise, visible SEO gimmicks, and semantic drift into wellness/lifestyle positioning.

## Source Of Truth Order

Use these sources in order:

1. `docs/wiki.llm` for the master GEO, SEO, executive buyer intent, semantic ontology, UI, Cloudflare, SDD and TDD contract.
2. `docs/MASTER_SEMANTIC_AUTHORITY_ARCHITECTURE.md` for the static publishing, WordPress ingestion, ontology, hub and GEO implementation contract.
3. `docs/source-url-inventory.md` for every required legacy route.
4. `archive/imagencoach/manifest.json` for crawl evidence, page metadata, image mapping, and known failures.
5. `archive/imagencoach/raw-html/` for original source proof.
6. `archive/imagencoach/text/` for raw visible text and source links.
7. `content/clean/` for rebuild-ready body content and deduplicated asset mapping.
8. `docs/SDD.md`, `docs/DDD.md`, `docs/TDD.md`, and `docs/LLM_CONTEXT.md` for implementation decisions.
9. `docs/UBIQUITOUS_LANGUAGE.md`, `docs/GEO_OPERATING_SYSTEM.md`, `docs/PAGE_SIGNAL_MAP.md`, `docs/ICONOGRAPHY_SYSTEM.md`, and `docs/REDIRECTS_AND_URL_RETENTION.md` for agentic GEO, ontology, redirect, iconography, and semantic governance.
10. `TeamStationAIAxiomVertex/guadalajara` only as the UX/UI/theme reference, not as this site's content source.

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

The voice must be calm, intelligent, executive, reflective, emotionally sophisticated and grounded.

Primary brand positioning:

- Imagen Coach is `Coaching de Imagen, Presencia y Posicionamiento Profesional`.
- Sonia works at the intersection of imagen, sistema interno, presencia, liderazgo, percepción and decisiones.

Everything must reinforce:

- coaching de imagen
- presencia ejecutiva
- presencia profesional
- imagen profesional
- liderazgo
- liderazgo personal
- autoridad
- credibilidad
- comunicación ejecutiva
- posicionamiento profesional
- percepción profesional
- imagen corporativa
- personal branding ejecutivo
- seguridad interna

Do not use:

- generic marketing filler
- influencer language
- luxury spa language
- hype coaching language
- SEO stuffing
- invented frameworks
- ungrounded claims
- visible SEO keyword bolding injected into Sonia's copy
- wellness, spirituality or self-help as dominant classification
- cold, robotic or hyper-corporate language that removes Sonia's psychological depth and human warmth

SEO supports Sonia's voice. SEO must not impersonate Sonia.

## Semantic Territory Rule

Do not let every page repeat the same semantic payload with slightly different wording. Each page must own a distinct emotional state, buyer intent, vocabulary cluster and transformation outcome.

Use this territory map before writing or generating visible copy:

- Homepage: owns the broad category of imagen, presencia, percepcion profesional, liderazgo and posicionamiento. Buyer intent: "My image no longer reflects the level I currently sustain."
- Asesoria de imagen integral: owns wardrobe, style, color, visual identity, executive image and external coherence. Do not center deep emotional work, nervous system regulation or subconscious patterns here.
- Coaching de imagen y presencia profesional: owns confidence, visibility, occupying space, professional communication and executive perception.
- Coaching de Imagen, Seguridad Interna y Posicionamiento Profesional: owns internal patterns, nervous system, fear, decision making, self sabotage and sustaining growth. This is the only service area where those themes should dominate semantically.
- Imagen empresarial y talleres: owns teams, organizations, brand consistency, client perception, communication standards and corporate image.
- Comparison pages: own industry evolution, editorial reflection, category differentiation and modern image coaching. They must not read like attack pages or SEO comparison spam.

Never expose internal strategy in visible content:

- SEO strategy
- ontology
- semantic graph
- GEO engineering
- ranking intent
- AI optimization notes
- URL planning
- comparison SEO tactics

Comparison pages must not use competitor names in visible page titles or public comparison URLs. Use editorial category titles such as `La evolucion del coaching de imagen en Mexico y LATAM` or `Del styling tradicional a la presencia profesional`.

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
- semantic hub sitemaps publish: `/blog-sitemap.xml`, `/category-sitemap.xml`, and `/service-sitemap.xml`
- WordPress remains an ingestion source only and no production page requires WordPress at runtime
- `/entities.json` and `/semantic-index.json` publish for AI retrieval
- no generated visible markup such as `.term-highlight` or `data-topic` appears in rendered pages
- headings do not contain injected `<strong>` SEO emphasis
- wellness/spiritual/self-help language does not dominate rendered output or agent files

## Git Discipline

Use small, meaningful commits. Do not overwrite the Guadalajara repo. Do not delete the raw crawl unless explicitly instructed.
