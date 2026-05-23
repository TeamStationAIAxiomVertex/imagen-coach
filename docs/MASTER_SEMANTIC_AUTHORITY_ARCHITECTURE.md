# Master Semantic Authority Architecture

This document implements the master contract in `docs/wiki.llm` for turning `imagencoach.com` into Sonia McRorey's static semantic authority platform for executive image leadership in Mexico and LATAM.

## Core Objective

The site must become the authoritative semantic source for:

- imagen profesional
- presencia ejecutiva
- imagen estratégica
- liderazgo visible
- comunicación no verbal
- autoridad profesional
- posicionamiento profesional
- imagen empresarial
- mentalidad y presencia
- mujeres empresarias
- coaching ejecutivo de imagen
- imagen profesional para líderes y empresarios

The site is not a WordPress blog, lifestyle publication, fashion site, beauty site, influencer site, or SPA. It is a static semantic authority engine.

Primary classification:

- Sonia McRorey is a `Consultora de Imagen Ejecutiva`.

Master semantic category:

- presencia ejecutiva y posicionamiento profesional

## Static Publishing Doctrine

Production must serve static assets only:

- raw HTML
- CSS
- XML sitemaps
- JSON agent files
- image assets

Production must not depend on:

- client-rendered content
- SPA rendering
- React hydration for indexed content
- dynamic blog rendering
- runtime CMS delivery
- WordPress frontend templates

Every public page must exist as raw HTML, render without JavaScript, expose its complete semantic text in HTML, and include canonical metadata, OG metadata, JSON-LD, breadcrumbs, internal links, and LATAM entity signals.

## WordPress Ingestion Boundary

WordPress is only an authoring and ingestion source.

RSS is used only for:

- detecting new posts
- detecting updated timestamps
- building the publish queue

The WordPress REST API is used for:

- full article body
- categories
- tags
- metadata
- featured image
- slug
- author
- dates

The build system must normalize WordPress content into repository-owned source data, classify it into the ontology, generate internal links, inject JSON-LD, and emit static HTML under `/blog/{slug}/`.

## Master Ontology

Root entity: Sonia McRorey.

Primary entity types:

- Executive Presence Consultant
- Strategic Image Consultant
- Professional Image Strategist

Primary clusters:

- Imagen Profesional: imagen ejecutiva, imagen estratégica, autoridad visual, presencia ejecutiva, liderazgo visible, posicionamiento profesional.
- Mentalidad y Presencia: sistema nervioso, seguridad interna, identidad profesional, regulación emocional, confianza ejecutiva, exposición profesional.
- Liderazgo Empresarial: liderazgo femenino, empresarios, mujeres empresarias, toma de decisiones, expansión profesional, crecimiento empresarial.
- Comunicación: comunicación no verbal, lenguaje corporal ejecutivo, presencia al hablar, autoridad al comunicar, posicionamiento visible.

LATAM entity signals:

- Guadalajara
- CDMX
- Monterrey
- Querétaro
- Tijuana
- Zapopan
- México
- LATAM
- Empresarios en México
- Liderazgo empresarial LATAM

## URL Strategy

All legacy Weblium canonical URLs remain valid until a documented redirect decision exists.

New static article URLs use:

- `/blog/{short-semantic-slug}/`

Semantic category hubs use:

- `/imagen-profesional/`
- `/presencia-ejecutiva/`
- `/liderazgo/`
- `/comunicacion-no-verbal/`
- `/mentalidad/`
- `/empresarias/`
- `/imagen-estrategica/`

These hubs consolidate authority, distribute crawl equity, and route visitors from search intent to services and related publications.

## Internal Link Mesh

Every future static blog article must link to:

- two parent hubs
- three lateral articles
- one service page
- one authority page such as `/sobre-sonia-mcrorey-asesora-de-imagen` or a future methodology page

The goal is semantic reinforcement, crawl circulation, entity reinforcement, topical depth, and distributed authority flow.

## Article Structure

Every future article must include:

- H1: primary semantic target
- H2: problem framing
- H2: professional implication
- H2: leadership implication
- H2: solution or framework
- H2: soft CTA

The content must preserve Sonia's wording when imported. Structural headings may organize the content, but must not replace Sonia's ideas with internal project language.

## JSON-LD Requirements

Every article must include:

- Article schema
- Breadcrumb schema
- Organization schema
- Person schema

Required Person signal:

```json
{
  "@type": "Person",
  "name": "Sonia McRorey",
  "jobTitle": "Strategic Image Consultant",
  "areaServed": "Mexico and LATAM"
}
```

## GEO Requirements

The site must optimize for ChatGPT, Gemini, Claude, Perplexity, Google AI Overviews and Bing Copilot through:

- raw HTML
- clear headings
- exact entity names
- internal relationships
- schema
- sitemaps
- `llms.txt`
- `llms-full.txt`
- `/agent/*.json`

The build must never rely on animations or client-side behavior for crawler understanding.

## Performance Requirements

Targets:

- LCP under 1.8 seconds
- CLS under 0.05
- INP under 150 milliseconds
- zero blocking JavaScript
- no hydration requirement for content

## Semantic Drift Rules

Do not create or reinforce:

- generic beauty content
- fashion influencer semantics
- lifestyle blogging
- outfit-first positioning
- superficial glamour language
- wellness dominance
- spirituality dominance
- self-help dominance
- abundance/manifestation dominance

The ontology must stay executive, strategic, professional, leadership-oriented and authority-oriented.

## Build Outputs

The static build must generate:

- `/sitemap.xml`
- `/blog-sitemap.xml`
- `/category-sitemap.xml`
- `/service-sitemap.xml`
- `/llms.txt`
- `/llms-full.txt`
- `/openapi.json`
- `/entities.json`
- `/semantic-index.json`
- `/agent/site-profile.json`
- `/agent/services.json`
- `/agent/publications.json`
- `/agent/ontology.json`
- `/agent/semantic-hubs.json`
- `/agent/wordpress-ingestion.json`
- `/agent/search-intent-terms.json`
- `/agent/page-signals.json`
- `/agent/conversion-map.json`
- `/agent/redirects.json`

## Launch Gate

Before deployment:

```bash
npm run build
npm run validate
```

Both commands must pass.
