# Cognitive Load And Visual Content Plan

## Objective

Make every Imagen Coach page easier to understand without omitting, truncating, paraphrasing, or changing Sonia McRorey's source wording.

The next UI pass should preserve the full crawlable text while changing how the reader experiences it:

- long paragraphs become sentence-level visual reading units
- important terms are highlighted in place, not rewritten
- sections are grouped by intent, ontology, and next action
- service pages become process and decision systems
- articles become guided lessons, not loose text blocks
- short fragmented pages become visual argument sequences

## Content Rule

Source wording remains canonical.

Allowed transformations:

- wrap exact words or phrases in semantic markup such as `mark`, `strong`, or `span`
- split a long paragraph at sentence boundaries while preserving every sentence exactly
- group existing lines under visual containers
- create customer-facing labels, icons, counters, and navigation text around the source copy
- repeat exact source snippets only when they remain clearly tied to the original service or article context

Disallowed transformations:

- summarizing Sonia's copy as a replacement for the original copy
- deleting meaningful source sentences
- changing sentence wording to make it shorter
- hiding main content behind JavaScript-only interactions
- exposing internal planning language such as reading guides, decision maps, or content-orientation labels as customer-facing section headings

## Cognitive Load Findings

The site has two different reading problems.

1. Dense pages

These pages carry the most reading load because they have high word count, long paragraphs, or both.

- `/imagen-presencia/los-secretos-de-una-asesora-de-imagen-exitosa`
- `/servicios-asesoria-de-imagen-coaching/talleres`
- `/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen`
- `/servicios-asesoria-de-imagen-coaching/preguntas-frequentes`
- `/imagen-presencia/beneficios-de-asesoria-de-imagen`

2. Fragmented pages

These pages have shorter copy, but many small fragments. They need a visual sequence or argument map instead of more isolated boxes.

- `/imagen-presencia/mas-dinero-capacidad-interna-liderazgo-presencia`
- `/imagen-presencia/sostener-el-crecimiento`
- `/imagen-presencia/imagen-identidad-liderazgo`
- `/imagen-presencia/imagen-profesional-segun-industria-y-personalidad`

## Visual System To Add

### 1. Ontology Highlights

Add a source-preserving highlighter that wraps important terms already present in the copy.

Example markup:

```html
<mark class="term-highlight" data-topic="presencia">presencia profesional</mark>
```

Topic families:

- Identidad: identidad, autoconcepto, esencia, valores
- Presencia: presencia, proyección, comunicación, autoridad visible
- Percepción: percepción, confianza, credibilidad, lectura externa
- Decisión: decisión, claridad, criterio, siguiente nivel
- Liderazgo: liderazgo, responsabilidad, autoridad, dirección
- Empresa: empresa, equipo, organización, clientes, colaboradores
- Color: color, colorimetría, rostro, paleta
- Guardarropa: ropa, clóset, guardarropa, prendas, compras
- Mentalidad: mentalidad, abundancia, bloqueos, sistema nervioso, dinero

Implementation rule:

- highlight only the first 1 to 3 meaningful matches per paragraph
- never highlight every repeated term
- use subtle styling so it guides the eye without making the content noisy

### 2. Insight Flow Blocks

Long paragraphs should become grouped sentence cards. The copy stays exact, but each sentence gets space, rhythm, and an icon tied to the section ontology.

Use this when:

- a paragraph has 2 or more sentences and more than 45 words
- a paragraph introduces a transformation, warning, decision, or definition

### 3. Section Reading Cards

Each H2 section should start with a compact visual header:

- section number
- section intent label
- topic chips
- optional "lo que aclara" label

This gives the user a reason to keep reading before the paragraph begins.

### 4. Service Process Modules

Service pages should not read like essays. They should show:

- what problem this service solves
- who it is for
- what gets worked on
- how the process moves
- what result the client should understand
- what related service or article comes next

The original content remains below or inside each visual unit.

All headings must be service-facing and client-facing. They should name the actual service, result, method, topic, or article concept, never the internal reason the module exists.

### 5. Fragment Ladders

Short pages with many fragments should become vertical visual ladders:

- tension
- insight
- internal shift
- visible expression
- next action

This is especially important for the newer short-form leadership and internal-capacity articles.

## Page-by-Page Plan

| Priority | Route | Content Load | Recommended Visualization |
| --- | --- | ---: | --- |
| Critical | `/imagen-presencia/los-secretos-de-una-asesora-de-imagen-exitosa` | 2511 words, 32 long lines | Pillar article layout, topic navigation, source-preserving lesson cards, ontology highlights |
| Critical | `/servicios-asesoria-de-imagen-coaching/talleres` | 1918 words | Workshop decision paths, corporate/persona split, use-case grid, FAQ accordion, highlighted service terms |
| Critical | `/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen` | 1647 words, 9 long lines | Process map, module cards, highlighted terms, comparison panel vs coaching, sentence-level insight flow |
| Critical | `/servicios-asesoria-de-imagen-coaching/preguntas-frequentes` | 1405 words | Real FAQ accordion, topic grouping, answer highlights, related-service CTAs |
| Critical | `/imagen-presencia/beneficios-de-asesoria-de-imagen` | 1019 words, 9 long lines | Benefits matrix, lesson cards, source-preserving emphasis blocks, checklist extraction |
| High | `/imagen-presencia/la-importancia-de-tu-imagen-personal` | 911 words | Guided article cards, key-term highlights, impact ladder, related asesoría bridge |
| Medium | `/imagen-presencia/descubre-el-poder-de-tu-rostro` | 893 words | Face-analysis visual module, concept cards, highlighted rostro/color terms |
| Medium | `/imagen-presencia` | 780 words | Topic hub filters, article clusters, search-intent cards, pillar navigation |
| Medium | `/imagen-presencia/sostener-tu-siguiente-nivel-profesional` | 756 words | Internal-capacity ladder, leadership/presence chips, source-preserving cards |
| Medium | `/` | 669 words | Executive summary bands, audience matrix, proof/result strips, clearer service path |
| Medium | `/imagen-presencia/rebranding-imagen-mentalidad-abundancia` | 629 words | Before/after transformation map, mentalidad and abundancia highlights |
| Medium | `/servicios-asesoria-de-imagen-coaching/coaching-de-imagen` | 620 words | Internal-to-external system map, comparison vs asesoría, outcomes grid |
| Medium | `/servicios-asesoria-de-imagen-coaching` | 615 words | Service decision tree, comparison matrix, intent cards |
| Medium | `/imagen-presencia/como-mejorar-la-imagen-de-tus-colaboradores` | 590 words | Corporate use-case cards, team-impact grid, checklist module |
| Medium | `/imagen-presencia/como-vestirte-durante-los-festejos` | 549 words | Occasion guide cards, visual checklist, color/style highlights |
| Medium | `/imagen-presencia/como-puedo-ayudarte-hoy` | 544 words | Service selector, need-state cards, CTA bridge |
| Fragmented | `/imagen-presencia/mas-dinero-capacidad-interna-liderazgo-presencia` | 360 words | Leadership capacity ladder, money/presence/decision ontology chips |
| Fragmented | `/imagen-presencia/sostener-el-crecimiento` | 261 words | Growth-support ladder, internal/external contrast blocks |
| Fragmented | `/imagen-presencia/imagen-identidad-liderazgo` | 260 words | Leadership diagnosis sequence, client-facing visual flow |
| Fragmented | `/imagen-presencia/imagen-profesional-segun-industria-y-personalidad` | 251 words | Industry/personality comparison cards, professional identity matrix |
| Low | `/imagen-presencia/transforma-tu-imagen-consciente` | 498 words | Compact lesson cards, related service bridge |
| Low | `/imagen-presencia/encuentra-tu-estilo` | 470 words | Style identity cards, authenticity highlights |
| Low | `/imagen-presencia/aprende-a-resaltar-tus-proporciones` | 447 words | Body proportion visual checklist, exact-copy cards |
| Low | `/imagen-presencia/manifiesta-tu-imagen-autenticar-talleres-de-verano-2025` | 398 words | Workshop/event cards, schedule/context strip |
| Low | `/imagen-presencia/new-tu-guardarropa-te-refleja-o-te-limita` | 398 words | Closet reflection map, guardarropa highlights |
| Low | `/imagen-presencia/tu-color-tu-poder-el-impacto-de-la-colorimetria` | 389 words | Color-impact cards, colorimetry glossary chips |
| Low | `/imagen-presencia/soltar-lo-que-ya-no-vibra-y-vestir-tu-verdad` | 330 words | Release-to-truth ladder, emotional style cards |
| Low | `/imagen-presencia/tu-imagen-y-tu-negocio-una-conexion-mas-poderosa-de-lo-que-imaginas` | 324 words | Business/image connection diagram, authority highlights |
| Low | `/imagen-presencia/y-si-tu-imagen-no-fuera-un-disfraz-sino-una-puerta-para-regresar-a-ti-article` | 294 words | Identity return sequence, exact-copy cards |
| Low | `/imagen-presencia/la-ciencia-del-color-en-tu-imagen` | 249 words | Color science cards, color topic highlights |
| Low | `/imagen-presencia/tu-autoconcepto-el-punto-de-partida-para-transformar-tu-imagen` | 241 words | Autoconcept ladder, identity highlights |
| Low | `/servicios-asesoria-de-imagen-coaching/coaching-de-abundancia` | 215 words | Mentalidad system map, abundance decision cards |
| Low | `/imagen-presencia/amor-propio-estructura-interna-presencia-profesional` | 204 words | Internal structure ladder, leadership/presence chips |
| Low | `/imagen-presencia/presencia-profesional-estrategica` | 174 words | Strategic presence cards, authority highlights |
| Low | `/sobre-sonia-mcrorey-asesora-de-imagen` | 72 words | Authority timeline, credentials, method/proof modules |

## Implementation Phases

### Phase 1: Generator-Level Reading Intelligence

Update `scripts/build-static.mjs` with:

- `highlightOntologyTerms(text, topics)` for exact in-place term highlighting
- paragraph load scoring by word count, sentence count, and topic density
- section-level visual mode selection:
  - `insight-flow`
  - `comparison-panel`
  - `fragment-ladder`
  - `faq-accordion`

Acceptance criteria:

- all source text remains in generated HTML
- no page loses canonical URL, sitemap entry, schema, or internal links
- highlighted text is still readable without CSS

### Phase 2: Critical Pages First

Implement custom visual templates for:

1. `/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen`
2. `/servicios-asesoria-de-imagen-coaching/talleres`
3. `/servicios-asesoria-de-imagen-coaching/preguntas-frequentes`
4. `/imagen-presencia/los-secretos-de-una-asesora-de-imagen-exitosa`
5. `/imagen-presencia/beneficios-de-asesoria-de-imagen`

Acceptance criteria:

- user can understand each page by scanning section headers, chips, highlights, and visual modules
- long paragraphs no longer appear as dense text blocks
- no hidden JavaScript dependency for SEO content

### Phase 3: Article Families

Apply article-family templates:

- leadership and professional presence articles use a ladder layout
- color and style articles use visual checklist/card layouts
- business/team articles use use-case and outcome grids
- introspective image articles use identity/presence/decision flows

Acceptance criteria:

- all article pages have a clear "what this teaches" path
- every article links to the most relevant service pillar
- article clusters remain visible to crawlers and LLM agents

### Phase 4: Visual QA

For desktop and mobile:

- check no text overlaps
- check cards do not become too tall without rhythm
- check highlighted terms do not create visual noise
- check images remain contained
- check service pages are scannable above the fold and mid-page

Validation commands:

```bash
npm run build
npm run validate
```
