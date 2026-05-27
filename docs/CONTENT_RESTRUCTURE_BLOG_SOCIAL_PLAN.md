# Imagen Coach Content Restructure, Blog Import And Social Authority Plan

## Objective

Rebuild the site content architecture so Sonia McRorey's authority remains present, but the user experience no longer feels like loose text fragments or all of Sonia's notes placed on every page.

The site must become:

- a structured authority platform for asesoría de imagen, coaching de imagen, imagen ejecutiva, presencia profesional, marca personal and talleres corporativos
- a static Cloudflare site with semantic HTML first
- a WordPress-fed publication system once Weblium is shut down
- a machine-readable GEO/LLM source with clean ontology, page signals and internal links
- a visual education experience, not a wall of paragraphs
- a conversion-first service system where long-form depth is routed into article pages

## Current Content Audit

The clean corpus has 35 canonical pages.

Content pressure points:

| Area | Routes | Main Issue |
| --- | ---: | --- |
| Core service pages | 5 | Highest word counts, mixed fragments, repeated CTAs, FAQ blocks and conceptual sections in one stream |
| Homepage | 1 | Strong positioning, but source text mixes hero, proof, services, audience, FAQ and testimonials in one long sequence |
| About Sonia | 1 | Important E-E-A-T content exists, but credentials and method need structured authority modules |
| Article index | 1 | Needs to become a topic hub, not a list |
| Articles | 26 | Some are long essays, some are short fragments, all need consistent article schema, sections and related service paths |

Highest-volume pages:

- `/imagen-presencia/los-secretos-de-una-asesora-de-imagen-exitosa` - 2609 words
- `/servicios-asesoria-de-imagen-coaching/talleres` - 2322 words
- `/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen` - 2032 words
- `/servicios-asesoria-de-imagen-coaching/preguntas-frequentes` - 1712 words
- `/` - 1168 words

Fragment-heavy pages:

- `/imagen-presencia/imagen-profesional-segun-industria-y-personalidad`
- `/imagen-presencia/sostener-el-crecimiento`
- `/imagen-presencia/amor-propio-estructura-interna-presencia-profesional`
- `/sobre-sonia-mcrorey-asesora-de-imagen`
- `/servicios-asesoria-de-imagen-coaching`

These pages need classification and visual presentation, not content removal.

## Non-Negotiable Content Rule

Do not delete Sonia's source content from the project or from the authority layer.

Instead:

- keep every meaningful source sentence in the raw archive, clean source layer, article layer or appropriate structured route
- classify each sentence into a named section
- remove only duplicated navigation, form, footer and known junk lines
- preserve source traceability to `content/clean/manifest.json` and `archive/imagencoach/`
- show long material where it belongs: article routes, FAQs, hubs and related-content blocks
- compress commercial pages into decision modules, process maps, outcome cards, FAQs and CTA bridges

Commercial pages do not need to display every migrated paragraph. Their job is to help the buyer understand fit and act. Article pages carry the long-form SEO/GEO depth.

## Content Budgets

| Page type | Visible word target | Primary job |
| --- | ---: | --- |
| Homepage | 850-1200 | Category authority plus service selection |
| Service/commercial pages | 850-1200 | Conversion and fit clarity |
| Hub pages | 450-900 | Topic organization and crawl distribution |
| Comparison pages | 650-1100 | Editorial category differentiation |
| Article pages | 500+ | Long-tail authority and thought leadership |

Use `npm run audit:content` to regenerate `docs/CONTENT_DENSITY_AUDIT.md` before and after major content refactors.

## New Content Model

Each page should render from a structured content model:

```json
{
  "route": "/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen",
  "pageType": "service",
  "primaryIntent": "asesoría de imagen integral",
  "audience": ["profesionistas", "ejecutivos", "marcas", "empresas"],
  "sections": [
    { "type": "hero", "headingLevel": "h1" },
    { "type": "definition", "headingLevel": "h2" },
    { "type": "fit", "headingLevel": "h2" },
    { "type": "process", "headingLevel": "h2" },
    { "type": "modules", "headingLevel": "h2" },
    { "type": "outcomes", "headingLevel": "h2" },
    { "type": "faq", "headingLevel": "h2" },
    { "type": "related-content", "headingLevel": "h2" }
  ]
}
```

The generator should stop chunking content by arbitrary line counts. It should classify lines into semantic sections before rendering.

## Page-by-Page Structure

### Homepage `/`

Primary intent:
entity hub and conversion path for Imagen Coach.

Recommended H structure:

- H1: Tu imagen ya debería reflejar el nivel que sostienes
- H2: Lo que cambia cuando imagen, presencia y decisiones se alinean
- H2: Elige tu ruta
- H2: Para quién es este trabajo
- H2: Modalidades de acompañamiento
- H2: Historias de transformación
- H2: Imagen, presencia y mentalidad
- H2: Preguntas frecuentes

Visual modules:

- proof strip: years, AICI, services, publications
- three-part transformation panel: identidad, presencia, decisiones
- audience matrix: líderes, profesionistas, empresas, marcas VIP
- service path cards
- testimonial cards with role labels
- latest WordPress/RSS posts once the blog engine is live
- Instagram evidence strip as visual social proof only

### Services Hub `/servicios-asesoria-de-imagen-coaching`

Primary intent:
service selection.

Recommended H structure:

- H1: Servicios de Asesoría y Coaching de Imagen
- H2: Qué necesitas sostener hoy
- H2: Comparar servicios
- H2: Modalidades de trabajo
- H2: Cómo elegir el proceso adecuado
- H2: Coaching de abundancia y poder personal
- H2: Artículos relacionados

Visual modules:

- decision tree: ordenar imagen, sostener presencia, alinear equipo, liberar bloqueo interno
- comparison table across asesoría, coaching, talleres and abundancia
- accordion for duplicated explanatory Q&A
- CTA block tied to WhatsApp diagnosis

### Asesoría de Imagen `/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen`

Primary intent:
asesoría de imagen integral / imagen ejecutiva / imagen profesional.

Recommended H structure:

- H1: Asesoría de Imagen Integral
- H2: Qué es la asesoría de imagen integral
- H2: Qué se trabaja
- H2: Cómo funciona el proceso
- H2: La imagen se sostiene desde adentro
- H2: Ámbitos del proceso
- H3: Colorimetría personal
- H3: Estilo personal
- H3: Análisis de rostro
- H3: Cuerpo y proporciones
- H3: Vestimenta y accesorios
- H3: Clóset consciente y funcional
- H3: Plan de compras estratégico
- H2: Diferencia con coaching de imagen
- H2: Este proceso es para ti si
- H2: Siguiente paso

Visual modules:

- process rail: diagnóstico, color, estilo, rostro, cuerpo, clóset, compras, integración
- module cards for each H3
- before/after decision map: de esfuerzo visual a presencia coherente
- comparison panel vs coaching de imagen
- related articles from imagen-estilo-profesional

### Coaching de Imagen `/servicios-asesoria-de-imagen-coaching/coaching-de-imagen`

Primary intent:
coaching de imagen, presencia profesional, identidad profesional.

Recommended H structure:

- H1: Coaching de Imagen
- H2: Cuando la imagen revela el verdadero bloqueo
- H2: Qué es el coaching de imagen
- H2: Diferencia con asesoría de imagen integral
- H2: Cuándo es para ti o tu equipo
- H2: Mentalidad y dinero cuando aplica
- H2: Beneficios
- H2: Para quién es este proceso

Visual modules:

- internal-to-external system map: creencias, valor personal, decisión, presencia, percepción
- comparison table vs asesoría
- outcomes grid
- related articles from presencia-liderazgo-identidad

### Talleres `/servicios-asesoria-de-imagen-coaching/talleres`

Primary intent:
talleres de imagen corporativa, talleres de colorimetría, marcas and teams.

Recommended H structure:

- H1: Talleres de Imagen y Colorimetría
- H2: Talleres prácticos para personas, marcas y empresas
- H2: En qué consisten
- H2: Talleres adaptados a personas, marcas y empresas
- H2: La base interna de una imagen sostenible
- H2: Formatos y contextos
- H2: Personas y grupos
- H2: Empresas y marcas
- H2: Imagen de equipos y cultura visual
- H2: Preguntas frecuentes

Visual modules:

- two-column path: personas/grupos vs empresas/marcas
- workshop card templates: problem, format, outcome
- corporate use-case grid: ventas, atención al cliente, directivos, marcas premium, eventos VIP
- FAQ accordion
- related articles from empresas-marcas-equipos

### Seguridad y Posicionamiento `/servicios-asesoria-de-imagen-coaching/coaching-de-abundancia`

Primary intent:
supporting pillar for mentalidad, poder personal and decision blocks.

Recommended H structure:

- H1: Coaching de Mentalidad y Poder Personal
- H2: Qué bloqueo resuelve
- H2: Qué transformas
- H2: Cómo se trabaja
- H2: Para quién es
- H2: El resultado

Visual modules:

- transformation table: de bloqueo a decisión alineada
- nervous-system/decision map
- clear guardrail that this supports image and leadership, not generic abundance content

### About Sonia `/sobre-sonia-mcrorey-asesora-de-imagen`

Primary intent:
E-E-A-T, authority and entity trust.

Recommended H structure:

- H1: Sonia McRorey
- H2: Imagen y presencia para tu siguiente nivel profesional
- H2: Quién soy
- H2: Qué hago
- H2: Credenciales y formación
- H2: Mi enfoque
- H2: La imagen como sistema

Visual modules:

- credential timeline
- AICI authority badge/module
- method map: imagen, identidad, mentalidad, percepción
- audience chips: individuos, profesionistas, ejecutivos, empresas
- Person JSON-LD expansion

### FAQ `/servicios-asesoria-de-imagen-coaching/preguntas-frequentes`

Primary intent:
answer high-intent service objections.

Recommended structure:

- H1: Preguntas Frecuentes sobre Asesoría de Imagen
- H2: Elegir el proceso adecuado
- H2: Método y enfoque
- H2: Empresas, marcas y talleres
- H2: Resultados y expectativas
- H2: Colorimetría y estilo
- H2: Mentalidad, valor y transformación

Visual modules:

- grouped FAQ accordions
- FAQPage JSON-LD
- internal links to each service page
- move unrelated article-like fragments into either a related article card or a future blog post, but keep them accessible until migrated

## Article Strategy

Articles should use the same readable template:

- H1: article title
- H2: Resumen estratégico
- H2: Idea central
- H2/H3: source-derived sections
- H2: Qué significa para tu imagen/presencia
- H2: Ruta relacionada
- H2: Artículos relacionados

Long articles should not be rendered as alternating text/image strips by line count. They need semantic blocks:

- definition
- problem
- misconception
- framework
- steps
- examples
- CTA
- related service

Short-fragment articles should use grouped cards or editorial sections so the page does not look like sentence debris.

## Blog Import Plan

### Phase 1: Weblium Blog Export

Before shutting down Weblium:

- crawl every blog URL, not only sitemap URLs
- save raw HTML, extracted text, images, publish dates, slugs and canonical URLs
- identify Weblium-only blog paths that are not in the current 35-route contract
- produce `docs/blog-url-inventory.md`
- decide which URLs remain canonical and which redirect into WordPress-backed routes

### Phase 2: WordPress As Source Of Truth

WordPress should be the editorial engine, not the main frontend.

Use WordPress for:

- authoring
- categories
- tags
- featured images
- publish dates
- revisions
- RSS/REST publishing source

Use this static site for:

- rendering canonical pages
- interlinking
- ontology
- search/GEO structure
- Cloudflare delivery

Preferred ingestion:

1. WordPress REST API for structured JSON posts.
2. RSS as a fallback or lightweight public feed.
3. Store normalized post snapshots in `content/blog/`.
4. Render static post pages during build.
5. Emit `/agent/publications.json` with both legacy articles and WordPress posts.

The WordPress REST API exposes post data as JSON and public content is generally accessible publicly through its endpoints, including post collections under `/wp/v2/posts`. WordPress also supports RSS feeds. See official WordPress REST API and feed documentation.

### Phase 3: Blog URL And Canonical Strategy

Recommended routes:

- legacy articles stay under `/imagen-presencia/*`
- new WordPress posts render under `/blog/{slug}` or `/imagen-presencia/{slug}` only after deciding a single canonical pattern
- avoid duplicate canonical URLs between WordPress and the static site
- WordPress origin should be noindex or private if the static site owns public canonicals
- every imported post must have canonical, OG, Article JSON-LD and cluster mapping

## Instagram Feed Plan

Instagram should support trust and freshness, not carry core SEO content.

Recommended approach:

- pull a small approved feed server-side at build time or on a scheduled job
- cache normalized media records in `content/social/instagram.json`
- render static cards with image, caption excerpt, permalink and date
- never depend on client-side Instagram widgets for core content
- do not treat Instagram captions as canonical blog content unless Sonia approves republishing them
- link selected posts to related services or article clusters when semantic match is clear

Implementation caution:

Instagram API access and permissions change often. Before implementation, verify the current Meta/Instagram API path and token requirements against official Meta documentation. Treat third-party widgets as fallback only because they add dependency, privacy, performance and styling risk.

## Ontology And Interlinking Model

Primary service ontology:

- Asesoría de Imagen Integral
- Coaching de Imagen
- Talleres de Imagen Corporativa
- Coaching de Mentalidad y Poder Personal

Primary topic ontology:

- Imagen ejecutiva
- Presencia profesional
- Marca personal
- Colorimetría ejecutiva
- Guardarropa estratégico
- Imagen corporativa
- Liderazgo femenino
- Percepción profesional
- Identidad profesional
- Mentalidad and poder personal

Every page should expose:

- primary intent
- secondary intents
- audience
- service relation
- cluster relation
- conversion action
- related canonical pages
- related WordPress posts
- related Instagram posts where available

## Implementation Phases

### Phase A: Content Parser

Build a section classifier that maps clean lines into:

- hero
- definition
- fit
- process
- modules
- outcomes
- FAQ
- testimonials
- related content
- CTA

Output:

- `content/structured/pages/*.json`
- `content/structured/manifest.json`

### Phase B: Core Page Redesign

Rebuild templates for:

- home
- about
- services hub
- service detail
- FAQ
- article index
- article detail

Output:

- semantic headings
- visual modules
- no arbitrary loose-text panels
- all source content still present

### Phase C: Blog Import

Output:

- `scripts/crawl_weblium_blog.py`
- `scripts/import_wordpress_posts.mjs`
- `content/blog/posts/*.json`
- `docs/blog-url-inventory.md`
- generated blog pages
- updated sitemap and publications agent file

### Phase D: Instagram Import

Output:

- `scripts/import_instagram_feed.mjs`
- `content/social/instagram.json`
- static Instagram proof component
- validation that social images and links resolve

### Phase E: Interlinking And GEO

Output:

- curated `content/strategy/page-signals.json`
- exact ontology term matching
- internal links from every article/post to service and cluster pages
- `BlogPosting`, `Article`, `FAQPage`, `Person`, `ProfessionalService`, `BreadcrumbList` JSON-LD

### Phase F: QA And Launch

Output:

- desktop/mobile visual QA
- route crawl
- redirect crawl
- Cloudflare preview validation
- Search Console submission after cutover

## Success Criteria

- All 35 current URLs remain 200.
- Imported blog posts have stable canonical URLs.
- Weblium can be shut down without losing crawled content or images.
- WordPress is used for authoring but does not split SEO authority.
- Core pages read as structured expert pages, not text dumps.
- Every page has a clear H1/H2/H3 hierarchy.
- Every article and blog post belongs to a cluster.
- Every cluster links to a service.
- Every service links back to its best supporting articles/posts.
- Instagram appears as static visual proof, not as a fragile SEO dependency.
- Agent files expose services, publications, ontology, page signals, redirects and conversion paths.
