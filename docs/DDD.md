# Domain-Driven Design Document

## Domain

Professional image, executive presence, identity, perception, leadership, and personal/professional coherence for Sonia McRorey.

This is not a fashion site, influencer brand, spa/luxury site, or generic coaching funnel.

## Bounded Contexts

### General ImagenCoach Site

Domain: `imagencoach.com`

Purpose:

- primary/general Sonia McRorey brand site
- source of broad service explanations
- article archive under `/imagen-presencia`
- larger body of Sonia's authorship

### Guadalajara Local Site

Domain: `imagengdl.com`

Purpose:

- Guadalajara-focused local SEO and service conversion
- visual/UX reference for this rebuild
- separate content strategy

Do not merge these contexts.

## Core Entities

### Sonia McRorey

The primary person/entity. Sonia is represented as a consultora de imagen and coach whose work connects image, identity, presence, perception, and professional decision-making.

### Page

A canonical route from the current sitemap. Every page has:

- URL
- route
- title
- source text
- source HTML
- images
- page type
- rebuild status

### Service

A conversion-oriented offering, currently represented by:

- asesoría de imagen integral
- coaching de imagen
- talleres
- coaching de abundancia
- services hub
- FAQ

### Article

Editorial content under `/imagen-presencia`. Articles preserve Sonia's deeper thought leadership and support internal linking into services.

### Asset

Downloaded source image or graphic. Assets are content-addressed in the archive and mapped from page records.

### Redirect

A documented routing decision for a non-canonical or broken old URL.

### Agentic File

A machine-readable file that supports AI retrieval, GEO, service discovery, ontology consistency, redirects, conversion actions, or publication retrieval.

Examples:

- `openapi.json`
- `llms-full.txt`
- `agent/site-profile.json`
- `agent/ontology.json`
- `agent/page-signals.json`
- `agent/conversion-map.json`

## Ubiquitous Language

Approved language:

- imagen ejecutiva
- asesoría de imagen
- asesoría de imagen integral
- coaching de imagen
- presencia profesional
- percepción profesional
- identidad profesional
- coherencia
- liderazgo
- posicionamiento
- visibilidad
- autoconcepto
- claridad
- autoridad profesional
- guardarropa estratégico
- talleres corporativos

Guarded language:

- abundancia
- transformación
- premium
- marca personal
- lujo

These terms may appear when grounded in source content, but they must not dominate the brand.

Forbidden drift:

- fashionista
- influencer
- makeover
- glam coach
- high-ticket coaching
- energía femenina de lujo
- imagen magnética
- manifestación cuántica
- gurú

## Agentic GEO Bounded Context

The agentic GEO layer must describe existing content and routes. It must not invent services, credentials, rankings, clients, awards or regional presence.

Its job is to make the current 35-page authority graph easier for search engines, AI systems and agents to parse.

## Page Types

### Home

Route: `/`

Purpose: entity hub and high-level conversion path.

### About

Route: `/sobre-sonia-mcrorey-asesora-de-imagen`

Purpose: authority, biography, method, credibility.

### Service Hub

Route: `/servicios-asesoria-de-imagen-coaching`

Purpose: explain service families and route users to the correct offering.

### Service Detail

Routes under `/servicios-asesoria-de-imagen-coaching/...`

Purpose: deep explanation and conversion for a specific service.

### Editorial Index

Route: `/imagen-presencia`

Purpose: article archive entry point.

### Article

Routes under `/imagen-presencia/...`

Purpose: preserve thought leadership and search traffic.

## Invariants

- A canonical route cannot disappear.
- Source content must remain traceable to the crawl archive.
- Clean content must be generated from raw content through documented rules.
- The Guadalajara theme can influence presentation, not content identity.
- Broken source references must be documented, removed, or redirected.

## Domain Events

- `SourceSiteCrawled`
- `ContentCleaned`
- `RouteContractUpdated`
- `ThemeAdopted`
- `PageImplemented`
- `RedirectDocumented`
- `StaticBuildValidated`
- `CloudflarePreviewApproved`
- `DNSCutoverCompleted`

## Anti-Corruption Rules

The rebuild must protect Sonia's domain language from:

- Weblium implementation junk
- generic SEO copy
- Guadalajara-local-only assumptions
- invented services
- unverified image substitutions
- broad content rewrites that erase authorship
