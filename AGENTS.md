# Coach De Imagen Rebuild Agent Instructions

You are operating in the `imagen-coach` repository for the full rebuild of Sonia McRorey's general site. The new production canonical domain is `coachdeimagen.com`; `imagencoach.com` is a legacy source domain that must redirect to the new canonical domain without losing paths.

This repository is the new source of truth for the larger/general Sonia McRorey site. Do not confuse it with `TeamStationAIAxiomVertex/guadalajara`, which powers the Guadalajara-specific `imagengdl.com` site.

## Mission

Rebuild `coachdeimagen.com` as a professional, production-ready static site and semantic authority engine for holistic coaching de imagen, presencia and posicionamiento profesional in Mexico and LATAM using:

- the exact legacy URL inventory from the current Weblium site
- the archived source content and images in this repo
- the cleaned migration content layer in this repo
- the UX/UI language and visual system proven in the Guadalajara site
- the holistic image coaching ontology in `docs/wiki.llm`

The result must preserve Sonia's authorship, existing URLs, source images, SEO surface, and professional tone while removing Weblium duplication, broken internal junk, implementation noise, visible SEO gimmicks, and semantic drift into wellness/lifestyle positioning.

The current repositioning is `coachdeimagen.com`, not ImagenCoach as the public category label. The site must feel like the definitive LATAM authority in Coach de Imagen, not a dump of every note Sonia has written.

## Source Of Truth Order

Use these sources in order:

1. `docs/wiki.llm` for the master GEO, SEO, executive buyer intent, semantic ontology, UI, Cloudflare, SDD and TDD contract.
2. `docs/MASTER_SEMANTIC_AUTHORITY_ARCHITECTURE.md` for the static publishing, WordPress ingestion, ontology, hub and GEO implementation contract.
3. `docs/source-url-inventory.md` for every required legacy route.
4. `archive/imagencoach/manifest.json` for crawl evidence, page metadata, image mapping, and known failures.
5. `archive/imagencoach/raw-html/` for original source proof.
6. `archive/imagencoach/text/` for raw visible text and source links.
7. `content/clean/` for rebuild-ready body content and deduplicated asset mapping.
8. `content/blog/soniamcrorey-blog.json` for Sonia's long-form article archive, language patterns, teaching concepts and long-tail topical evidence.
9. `content/sonia-knowledge/quote-bank.json` for candidate Sonia-authored quotes requiring editorial review before public injection.
10. `content/sonia-knowledge/drive-source-inventory.json` for Sonia's Drive document and presentation inventory.
11. `content/sonia-knowledge/drive-quote-bank.json` for candidate Drive-derived quotes and teaching signals requiring editorial review before public injection.
12. `content/sonia-knowledge/teaching-route-map.json` for the controlled public quote/addendum mapping used by the static build.
13. `docs/SONIA_DRIVE_KNOWLEDGEBASE.md` and `docs/SONIA_TEACHING_ROUTE_MAP.md` for Drive usage rules, source-to-page mapping and public teaching-module governance.
14. `docs/SDD.md`, `docs/DDD.md`, `docs/TDD.md`, and `docs/LLM_CONTEXT.md` for implementation decisions.
15. `docs/UBIQUITOUS_LANGUAGE.md`, `docs/GEO_OPERATING_SYSTEM.md`, `docs/PAGE_SIGNAL_MAP.md`, `docs/ICONOGRAPHY_SYSTEM.md`, and `docs/REDIRECTS_AND_URL_RETENTION.md` for agentic GEO, ontology, redirect, iconography, and semantic governance.
16. `TeamStationAIAxiomVertex/guadalajara` only as the UX/UI/theme reference, not as this site's content source.

Do not invent pages, slugs, services, images, schemas, or positioning without evidence.

## Sonia Drive Knowledgebase Rule

Sonia's Drive folder is an expert source library, not a public asset dump. Use it to learn her domain expertise, service framing, biography, methodology, presentations, idioms and teaching language before writing. Do not commit or expose raw Drive files that contain payment data, old contact information, dated pricing, bank details, private logistics or course-only material. Any public use must be sanitized, short, page-specific and aligned to the executive Coach De Imagen category.

## Sonia Teaching Route Map Rule

Public quote and teaching modules must come through `content/sonia-knowledge/teaching-route-map.json`. Do not hard-code Sonia quotes directly into templates unless the route map and docs are updated in the same change.

Every teaching entry must include a `sourceSnippet` that can be traced to `content/sonia-knowledge/drive-quote-bank.json` or `content/sonia-knowledge/quote-bank.json`. The static build validates this relationship and must fail if a public teaching cannot be traced.

The public module must stay compact: one short quote, one application title, one short explanatory note and up to three practical tips. Use one module per route by default. If a page needs deeper teaching, improve an article, methodology page, FAQ, glossary or audience page instead of overloading the commercial page.

Never expose source filenames, Drive document names, bank/payment data, old contact data, old prices, private logistics, raw internal notes or SEO/GEO strategy in public copy.

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

Do not turn `coachdeimagen.com` into a local Guadalajara landing page. It is the larger general site.

## Comparison Page UX Rule

Comparison pages are premium editorial category pages. They must not feel like SEO landing pages, internal strategy notes, generic cards, or repeated text boxes.

Before editing comparison pages, define the page-specific:

- buyer question
- emotional state
- category shift
- vocabulary cluster
- visual indicators
- next action

The visible UI must provide:

- compact page navigation for all comparison pages
- clear active-state indicator
- short section headings that do not compete with the hero
- explicit section rhythm on the 8px spacing grid so headings, card groups, tables and CTAs never visually collide
- icon-supported indicators that explain the specific comparison
- definitions only where they reduce cognitive load
- responsive comparison attributes that work on mobile without horizontal scanning
- one clear CTA after the comparison is understood

Do not repeat the same generic intro, ladder, indicator labels or related-card language across all comparison pages. Repetition creates weak buyer trust and weak retrieval differentiation.

On mobile:

- hero title must not consume the whole viewport
- breadcrumb current page text must not become a second page title
- hero image must not delay the comparison content by more than one viewport
- comparison navigation must be compact, not a long stack of oversized cards
- tables must become readable cards or compact rows

When QA finds title or text-area issues, record the concrete failure in `docs/TDD.md` before implementing the visual fix.

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
- article titles and body concepts on article routes
- testimonials where present
- contact details where still valid
- source image mappings
- page intent and route identity

Commercial and hub pages must not expose the entire migrated essay layer. Long-form depth belongs in static article pages and supporting hubs. Service and commercial pages must compress visible copy into decision modules, workflows, state maps, outcomes, FAQs, related article links and CTA bridges.

Content budgets:

- homepage: target 850-1200 visible words
- service and commercial pages: target 850-1200 visible words
- hub pages: target 450-900 visible words
- comparison pages: target 650-1100 visible words
- article pages: no sales-page cap; use normal article flow with H2/H3 sections, reading map, service bridge, related reading and CTA

Do not solve weak SEO by adding more prose. Solve it with clearer semantic identity, better internal links, better schema, stronger section hierarchy and visual compression.

## Search Intent Matrix Rule

The LATAM search intent matrix lives in the static agent layer, especially `dist/agent/search-intent-terms.json`, `dist/agent/page-signals.json`, `dist/semantic-index.json`, and `dist/llms-full.txt`.

Use it to connect each page to:

- direct commercial buyer intent
- executive transformation intent
- hidden psychological buyer intent
- leadership and authority positioning
- visibility and nervous system searches
- professional reinvention and business-growth searches
- Guadalajara, México and LATAM location intent

Do not expose matrix labels, SEO/GEO language, strategy notes, or internal phrases such as "hidden goldmine" in public-facing page copy. The visible UI must stay premium, calm, human and commercially clear.

## Brand Voice

The voice must be calm, intelligent, executive, reflective, emotionally sophisticated and grounded.

Primary brand positioning:

- Coach De Imagen is `Coaching de Imagen, Presencia y Posicionamiento Profesional`.
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

## Visual Semantic Authority Rule

The presentation layer must be semantic-first, visual-first, authority-first and conversion-first.

Every non-article page needs:

- clear semantic identity
- compressed cognitive load
- contextual imagery
- Sonia-specific iconography
- workflow or state visualization where useful
- service segmentation
- decision pathway
- CTA bridge after the user understands the section
- direct FAQ answers
- internal links to the article authority layer

Use visual modules for:

- service workflows
- before/after state maps
- decision trees
- outcome grids
- comparison matrices
- article clusters

Avoid:

- text walls
- article dumping
- repeated emotional framing across pages
- repeated generic terms such as presencia, liderazgo, claridad and coherencia without page-specific context
- visual boxes that exist only to hold loose paragraphs

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

## Global Title And Label Hierarchy Rule

Every route has one canonical semantic identity. Components must consume that identity instead of generating their own title, truncating strings, or inheriting a page H1 into cards, menus, breadcrumbs, schema, CTAs or support modules.

Route identity fields are:

- H1: primary commercial intent
- SEO title: title tag
- short label: breadcrumbs, related links and compact UI
- menu label: navigation
- card title: service and route cards
- support heading: secondary visual/process modules
- entity: visible category label where useful
- intent: machine-readable page-to-intent mapping

Rules:

- one H1 only per page
- no card title may repeat the page H1 on the same page
- no support section may reuse the page H1 as an H2
- no public heading may use ellipsis truncation
- no generic visible label such as `Sistema`, `Imagen`, `Transformación` or `Presencia` may appear without business context
- no visible label may expose SEO, GEO, ontology, ranking, agent, LLM or internal taxonomy language
- long semantic descriptors belong in schema and agent JSON, not repeated across nav, cards and footer

Use `docs/SEMANTIC_HIERARCHY_REPAIR_REPORT.md` as the current canonical naming and QA matrix.

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
- robots and canonical metadata point to `https://coachdeimagen.com`
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
