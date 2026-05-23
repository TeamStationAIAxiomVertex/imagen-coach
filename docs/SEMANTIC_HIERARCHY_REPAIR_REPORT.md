# Global Title And Semantic Hierarchy Repair Report

Date: 2026-05-23

## 1. Semantic Ontology Map

Primary entity: Coach de Imagen

Core category: Coaching de Imagen, Presencia y Posicionamiento Profesional

Primary subentities:

- Imagen profesional
- Presencia ejecutiva
- Posicionamiento profesional
- Liderazgo visible
- Seguridad interna
- Imagen empresarial
- Identidad visual personal

Guardrail: security, mindset, nervous-system and internal-pattern language supports the service category. It must not become the primary public title system.

## 2. Page-To-Intent Map

| Route | Canonical H1 | Primary intent |
|---|---|---|
| `/` | Coaching de Imagen, Presencia y Liderazgo Profesional | Broad category ownership for image, presence, leadership and positioning. |
| `/servicios-asesoria-de-imagen-coaching` | Servicios de Coaching de Imagen y Presencia Profesional | Help the buyer choose the right service path. |
| `/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen` | Asesoría de Imagen Integral | Wardrobe, color, style, visual identity and external coherence. |
| `/servicios-asesoria-de-imagen-coaching/coaching-de-imagen` | Coaching de Imagen y Presencia Profesional | Confidence, visibility, communication and professional presence. |
| `/servicios-asesoria-de-imagen-coaching/talleres` | Imagen Empresarial y Talleres | Teams, companies, brand consistency and communication standards. |
| `/servicios-asesoria-de-imagen-coaching/coaching-de-abundancia` | Coaching de Seguridad y Posicionamiento Profesional | Internal patterns, decisions, visibility and sustainable growth. |
| `/imagen-presencia` | Publicaciones sobre Imagen, Presencia y Liderazgo | Editorial archive organized by professional image and presence. |
| `/sobre-sonia-mcrorey-asesora-de-imagen` | Sonia McRorey | Authority, trust, trajectory and methodology. |

## 3. Duplicate Heading Report

Fixed in the generator:

- service visual sections were repeating the page H1 as an H2
- homepage and service hub repeated service-card titles in two adjacent card systems
- repeated article section headings were emitted as identical H2s
- punctuation-only source fragments could become headings
- source ellipses could appear inside headings

Validation now fails when:

- a page has anything other than one H1
- a lower heading repeats the H1 exactly
- same-level headings repeat
- headings contain visible truncation
- headings contain only punctuation

## 4. Cannibalization Report

The main cannibalization risk came from one repeated phrase appearing in nav, cards, footer, schema and content:

`Coaching de Imagen, Seguridad Interna y Posicionamiento Profesional`

Repair:

- canonical page H1 is now `Coaching de Seguridad y Posicionamiento Profesional`
- menu label is `Seguridad Profesional`
- card label is `Seguridad Profesional`
- support heading is `Estructura interna para sostener crecimiento`
- machine-readable semantic context still preserves the broader category through agent JSON

## 5. Broken Inheritance Report

Fixed inheritance sources:

- `PILLARS[].label` no longer carries long service names into nav/cards/footer
- `serviceSystemVisual()` no longer derives H2 from `page.heroTitle`
- `serviceLabel()` now returns route-level short labels
- `serviceCards()` and `pillarCards()` now use semantic card titles
- breadcrumbs use short service labels instead of repeating full H1s for service pages

## 6. Component Leakage Report

Removed or guarded visible leakage:

- `Pilar SEO`
- visible footer `LLM`
- `Sistema de imagen`
- `intención de búsqueda`
- old long security-positioning title in public HTML
- old abundance cluster label in public HTML

These concepts may exist only as machine-readable agent files when appropriate, never as customer-facing UI labels.

## 7. Mobile Truncation Report

The generator no longer creates heading truncation with `...`.

Validation fails if rendered headings contain:

- `...`
- `…`

Long mobile titles must be solved through layout, typography and short route labels, not string truncation.

## 8. GEO Entity Graph

Root:

Coach de Imagen

Primary commercial category:

Coaching de Imagen, Presencia y Posicionamiento Profesional

Support graph:

Imagen profesional -> Presencia ejecutiva -> Percepción profesional -> Liderazgo visible -> Posicionamiento profesional -> Seguridad interna -> Resultados profesionales

Geo anchors:

Guadalajara, México, LATAM, mercados hispanohablantes.

## 9. Recommended Canonical Naming Matrix

| Context | Use |
|---|---|
| H1 | Canonical commercial identity |
| Title tag | SEO title from route identity |
| OG title | Canonical H1 |
| Breadcrumb current label | Short label for services |
| Nav label | Menu label |
| Service card title | Card title |
| Schema name | Canonical H1 |
| Related links | Short label plus semantic entity |

Components must not invent titles. They must consume route identity.

## 10. Final Corrected Hierarchy

Every page follows:

- H1: one primary commercial intent
- H2: support category, section concept or source section
- H3: card, panel or subtopic
- visible labels: client-facing language only
- machine labels: agent files only

Current validation status:

- build passes
- validation passes
- 35 canonical legacy routes validated
- 42 static routes built
