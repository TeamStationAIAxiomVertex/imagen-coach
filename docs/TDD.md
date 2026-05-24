# Test-Driven Development And QA Plan

## Purpose

The rebuild must be validated as a migration, not just a design exercise. Tests should prove URL preservation, content integrity, asset integrity, SEO correctness, and deployability.

## Current Validation

Already completed:

- crawled 35 canonical URLs
- archived raw HTML and extracted text
- downloaded/mapped available images
- documented URL inventory
- generated clean content layer
- validated clean inventory count against crawl manifest

## Required Test Layers

### 1. Source Inventory Tests

Assert:

- `docs/source-url-inventory.md` contains exactly the 35 canonical URLs from `archive/imagencoach/manifest.json`
- every canonical URL has a clean content page
- every clean page points back to source text and source HTML

### 2. Content Cleanup Tests

Assert rendered/source clean content does not contain:

- Weblium UUIDs
- repeated `logo` nav junk
- `Can't send form`
- `Please try again later`
- literal `undefined`
- `Miscellaneous 234_solid`

### 3. Asset Tests

Assert:

- every clean manifest image `local_path` exists
- no image record with `error` is used by implementation
- no generated page references missing assets
- asset filenames are stable and content-addressed where practical

### 4. Route Build Tests

Assert:

- every route in `docs/source-url-inventory.md` builds to an HTML file or framework route
- no canonical URL is omitted from sitemap
- route paths preserve old spelling and slugs exactly

### 5. Link Tests

Assert:

- internal links resolve to a valid route or documented redirect
- broken `/articulos/...` source links are not emitted as normal links
- external links use expected protocols and do not break the build

### 6. SEO Tests

Assert each page has:

- canonical URL
- title
- meta description
- Open Graph title and image
- valid sitemap entry
- `robots.txt` references the sitemap

Article pages should receive article-like metadata where applicable.

### 6a. Agentic GEO Tests

Assert generated output includes:

- `dist/openapi.json`
- `dist/llms.txt`
- `dist/llms-full.txt`
- `dist/entities.json`
- `dist/semantic-index.json`
- `dist/agent/site-profile.json`
- `dist/agent/services.json`
- `dist/agent/contact.json`
- `dist/agent/publications.json`
- `dist/agent/ontology.json`
- `dist/agent/page-signals.json`
- `dist/agent/redirects.json`
- `dist/agent/conversion-map.json`

Assert:

- each JSON file parses
- `robots.txt` references OpenAPI, LLM and Agent Profile files
- every rendered HTML page links to OpenAPI and LLM context
- every rendered HTML page uses `lang="es-MX"`
- every rendered HTML page has an `es-MX` hreflang alternate
- no rendered HTML page contains `.term-highlight`, `data-topic`, visible SEO keyword bolding, or injected `<strong>` emphasis inside headings
- machine-readable semantic terms remain in JSON files, not as visible page decoration

### 6b. Semantic Classification Tests

Assert:

- `Coaching de Imagen, Presencia y Posicionamiento Profesional` is present in agent/entity output
- `coaching de imagen`, `presencia ejecutiva`, `presencia profesional`, `posicionamiento profesional`, `imagen profesional`, `liderazgo`, `liderazgo personal`, `seguridad interna`, `autoridad`, `credibilidad`, `comunicación ejecutiva`, `percepción profesional`, `imagen corporativa`, and `personal branding ejecutivo` are exposed in machine-readable files
- wellness/spiritual/self-help terms such as `abundancia`, `manifestación`, `energía`, `sanación`, and `bloqueos energéticos` do not dominate rendered HTML or agent JSON
- service and footer language ladders into executive presence and professional positioning, not lifestyle, beauty, or influencer semantics

### 6c. Global Title And Semantic Hierarchy Tests

Assert every rendered HTML page:

- has exactly one H1
- does not repeat the H1 as an H2, H3, H4, H5 or H6
- does not emit same-level duplicate headings
- does not emit punctuation-only headings
- does not emit heading truncation using `...` or `…`
- does not expose internal labels such as `Pilar SEO`, `Sistema de imagen`, `intención de búsqueda`, or visible LLM/SEO utility labels
- uses route-level semantic identity for H1, title tag, Open Graph title, schema name, nav labels, card titles, breadcrumbs and related links

The canonical route identity must follow the matrix documented in `docs/SEMANTIC_HIERARCHY_REPAIR_REPORT.md`.

### 7. UI Regression Tests

Before launch, test at minimum:

- desktop wide viewport
- laptop viewport
- tablet viewport
- mobile viewport

Assert:

- no overlapping text
- header works on mobile
- CTA buttons fit
- article pages are readable
- images are not distorted
- cards do not resize unpredictably
- color/typography match the Guadalajara UX/UI standard

### 7a. Comparison Page UI/UX QA Findings

Current comparison pages need a dedicated visual QA pass before they are considered production-quality.

Observed issues on `/comparaciones/evolucion-coaching-imagen-mexico-latam/`:

- Mobile hero hierarchy is too heavy. The H1 wraps into a large block and pushes the visual proof, comparison navigation and page substance too far down.
- The breadcrumb exposes the full page title on mobile, creating a cramped title strip before the user reaches the actual page content.
- The hero image is visually strong but too dominant on mobile; it consumes an entire viewport after the CTA and delays access to the comparison content.
- The comparison switchboard stacks into tall repeated cards on mobile. It functions, but it feels like a list of text boxes rather than a compact decision/navigation control.
- Section headings use oversized editorial display type even in utility sections such as context, comparison matrix and related reading. This weakens hierarchy because too many sections feel like hero sections.
- Section-to-section rhythm is inconsistent. On desktop, the comparison matrix heading can visually collide with the preceding path cards, making the page feel broken even when the content is correct.
- Some text blocks still read as repeated category framing instead of page-specific buyer guidance. Each comparison page must carry a different emotional state and intent.
- Indicator cards, definition cards and path cards help, but they need tighter labels, more consistent vertical rhythm and less repeated "presencia/liderazgo/posicionamiento" phrasing.
- The comparison table remains desktop-oriented. On mobile it should become stacked comparison rows or compact attribute cards instead of forcing table scanning.
- Related comparison cards use large display type and long copy, which creates another wall of cards at the bottom of the page.
- CTA placement is not yet consistent after the comparison matrix; the user needs a clear next action after understanding the page.

These are not SEO defects. They are comprehension, hierarchy and buyer-trust defects.

### 7b. Comparison Page Execution Plan

Implement the comparison page UI in this order:

1. Hero compression

   - Keep the H1 editorial, but constrain mobile H1 size and line height.
   - Shorten breadcrumb current-page text on mobile.
   - Reduce hero vertical padding on mobile.
   - Keep CTA buttons above the fold and make them equal-width only when enough space exists.

2. Navigation redesign

   - Replace the mobile comparison switchboard card stack with a compact segmented navigation or horizontal scroll rail.
   - Use short labels such as `Mapa`, `Consultoria`, `Apariencia`, `Motivacion`, `Styling`, `Empresa`, `Evolucion`.
   - Preserve full descriptive titles in accessible labels and link text where appropriate without overwhelming the visible UI.

3. Page-specific content territories

   - Each comparison page must define its own `pain`, `shift`, `buyerQuestion`, `indicators`, `definitions`, `path` and `cta`.
   - No comparison page may reuse the same intro paragraph structure unless the wording is intentionally different and fits that page intent.
   - The evolution page owns industry evolution and Guadalajara/LATAM positioning.
   - The styling page owns clothing-to-identity transition.
   - The motivation page owns inspiration-to-positioning transition.
   - The corporate page owns team consistency and client perception.
   - The appearance page owns appearance-to-authority transition.
   - The traditional consulting page owns external coherence-to-integrated presence transition.

4. Section hierarchy

   - Reserve hero-scale display type for the hero only.
   - Use smaller, tighter H2 sizes for context, differentiator, table and related sections.
   - Enforce comparison-section vertical rhythm on the 8px spacing grid so headings never sit directly against the prior card group.
   - Keep copy panels to short paragraphs with a max line length around 60-72 characters.

5. Visual comprehension

   - Convert the comparison matrix to responsive attribute cards on mobile.
   - Add icon-supported summary cards only where they lower cognitive load.
   - Avoid repeated generic icons when a page has a more specific industry cue.
   - Use native `title` tooltips only as supplemental definitions; do not rely on tooltips for essential meaning.

6. Conversion clarity

   - Add one calm CTA after the comparison matrix.
   - CTA language must match the page intent, for example `Agendar diagnostico de presencia profesional`.
   - Avoid repeated generic CTAs between every section.

7. Browser validation

   - Validate desktop around 1280px.
   - Validate tablet around 768px.
   - Validate mobile around 375px.
   - Capture screenshots for hero, comparison navigation, content cards, matrix and related/CTA area.
   - Check console warnings/errors.
   - Confirm no visible internal terms: SEO strategy, ontology, semantic graph, GEO engineering, ranking intent, AI optimization notes or URL planning.

### 7c. Content Density And Article/Commercial Separation Tests

Current failure mode:

- commercial pages can become overloaded with article-like material
- article pages can accidentally inherit service/pillar card treatments
- hub pages can become article dumps instead of topic maps
- repeated semantic terms can make different pages feel identical

Required tests:

- `npm run audit:content` generates `docs/CONTENT_DENSITY_AUDIT.md`
- commercial pages are reviewed against an 850-1200 visible-word target
- hub pages are reviewed against a 450-900 visible-word target
- comparison pages are reviewed against a 650-1100 visible-word target
- article pages keep long-form depth, but render as editorial posts with reading map, H2/H3 section flow, service bridge, related reading and CTA
- service/pillar visual cards must not leak into article body prose
- long-tail article content must not be dumped into service pages just to increase keyword volume

Current audit baseline:

- overloaded non-article routes: `/servicios-asesoria-de-imagen-coaching/talleres`, `/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen`, `/servicios-asesoria-de-imagen-coaching/preguntas-frequentes`, `/imagen-presencia`
- thin but commercially important routes that need direct-answer authority and better service context: `/servicios-asesoria-de-imagen-coaching/coaching-de-abundancia`, `/sobre-sonia-mcrorey-asesora-de-imagen`

### 8. Deployment Tests

Assert:

- clean checkout installs dependencies
- build command succeeds
- Cloudflare Pages preview works
- production output directory is correct
- no secret/env dependency is required for static pages

## Suggested Commands

These commands should exist as the implementation matures:

```bash
npm run validate:source
npm run validate:content
npm run validate:assets
npm run validate:routes
npm run validate:seo
npm run build
```

## Launch Gate

Do not cut DNS from Weblium to Cloudflare until:

- source inventory tests pass
- build tests pass
- sitemap tests pass
- image tests pass
- link tests pass
- visual QA passes on desktop and mobile
- Cloudflare preview crawl confirms all 35 URLs return expected status
