# Imagen Coach Page Signal Map

## Purpose

This document defines how the 35 canonical routes map to SEO, GEO, conversion and internal linking signals.

The build also emits a machine-readable version at:

`/agent/page-signals.json`

## Route Groups

### Homepage

Route:
`/`

Role:
Entity hub for Sonia McRorey and Imagen Coach.

Primary intent:
asesoría de imagen, coaching de imagen and presencia profesional.

Conversion intent:
agendar diagnóstico.

### About

Route:
`/sobre-sonia-mcrorey-asesora-de-imagen`

Role:
authority and trust page.

Signals:
Sonia, methodology, professional background, AICI, philosophy, credibility.

### Services Hub

Route:
`/servicios-asesoria-de-imagen-coaching`

Role:
service selection page.

Signals:
asesoría, coaching, talleres, coaching de abundancia, modalities, fit.

### Service Pages

Routes:

- `/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen`
- `/servicios-asesoria-de-imagen-coaching/coaching-de-imagen`
- `/servicios-asesoria-de-imagen-coaching/talleres`
- `/servicios-asesoria-de-imagen-coaching/coaching-de-abundancia`
- `/servicios-asesoria-de-imagen-coaching/preguntas-frequentes`

Role:
clarify fit, process, service scope and next step.

### Article Index

Route:
`/imagen-presencia`

Role:
editorial authority hub.

Signals:
Imagen, Presencia y Mentalidad. Clustered article access, not an unstructured dump.

### Article Pages

Routes:
all 26 `/imagen-presencia/*` URLs from `docs/source-url-inventory.md`.

Role:
answer a specific question, strengthen topical authority and link back to a relevant service.

## Cluster Mapping

Source:
`content/strategy/article-clusters.json`

Current clusters:

- Imagen y estilo profesional
- Presencia, liderazgo e identidad
- Empresas, marcas y equipos
- Mentalidad, abundancia y poder personal

Each article must belong to exactly one cluster.

Each cluster must point to one primary service.

## Conversion Rules

Primary CTA:
Agendar diagnóstico.

Primary channel:
WhatsApp.

Do not add high-pressure sales copy or generic newsletter-first funnels.
