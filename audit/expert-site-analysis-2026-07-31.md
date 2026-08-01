# Expert SEO, GEO and AI Retrieval Analysis

Date: 2026-07-31
Domain: coachdeimagen.com
Owner: Sonia McRorey

## Executive finding

The current static system is technically healthy. The rendered audit covers 115 routes, reports an average intelligence score of 97/100, and found no duplicate titles, meta descriptions or H1s. The remaining work is concentrated in content authority distribution, not a broad technical rebuild.

No public copy was created during this audit. Any content expansion must use the reviewed Sonia source corpus and pass provenance validation before publication.

## Verified strengths

- 115 static routes build successfully.
- Route validation passes for all rendered routes.
- 112 routes are in the elite score band and 3 are in the strong band.
- 48 GEO routes render Service and LocalBusiness schema.
- Schema audit found route-appropriate WebPage, Service, Article, CollectionPage, FAQPage, Person, Organization, ProfessionalService, LocalBusiness and WebSite blocks.
- No duplicate title, description or H1 findings were reported.
- Main production endpoints return successfully: robots.txt, sitemap.xml, llms.txt, llms-full.txt, openapi.json, agent.json, MCP server card and Agent Skills index.
- Public AI-facing files were checked for cross-project terms; no TeamStation or AxiomVertex references were found.
- Sonia knowledge provenance audit reports 110 strict July cards with zero missing provenance, violations or warnings.

## Material gaps

### 1. Orphan publication routes

These articles have no inbound internal links in the current crawl graph:

- `/imagen-presencia/encuentra-tu-estilo`
- `/imagen-presencia/la-ciencia-del-color-en-tu-imagen`
- `/imagen-presencia/los-secretos-de-una-asesora-de-imagen-exitosa`
- `/imagen-presencia/transforma-tu-imagen-consciente`
- `/imagen-presencia/y-si-tu-imagen-no-fuera-un-disfraz-sino-una-puerta-para-regresar-a-ti-article`

This is an authority-distribution problem. The pages exist, but their topical value is not being passed through the internal link graph.

### 2. Low-inbound authority routes

Nine routes have one or fewer inbound links, including executive communication, women leaders, the face article, rebranding and the four orphan articles. These should receive contextual links from the nearest hub, two sibling articles and one relevant service page. Link text must describe the destination intent, not repeat a generic “leer más”.

### 3. FAQ page is thin

`/servicios-asesoria-de-imagen-coaching/preguntas-frequentes` renders 765 words against the project FAQ target of 900–1900 words. This should be expanded only from Sonia-approved FAQ material. Do not fill the gap with generic AI copy.

### 4. Content audit coverage is incomplete

The density report currently covers 35 source-manifest routes while the rendered site contains 115 routes. The report is useful for the clean content corpus, but it is not yet a complete page-level density audit for GEO, intent, authority and geographic routes.

### 5. AI training policy is deliberate

Production currently sends `Content-Signal: search=yes, ai-input=yes, ai-train=no`. This permits search and agent input while declining model training use. It is a policy decision, not an SEO defect. Changing it requires Sonia’s explicit approval because it changes how her content may be used.

## Performance evidence

The static build and local validation are green. Live sampling showed fast responses for sitemap and AI discovery documents, generally about 0.15–0.33 seconds after connection. A cold robots request was slower at about 1.87 seconds. These are endpoint timings, not Core Web Vitals.

There is no real-user CrUX dataset in this audit. LCP, CLS and INP must be confirmed with Lighthouse and PageSpeed against the canonical production domain before claiming a performance score.

## Priority execution order

1. Add source-backed internal links to the five orphan articles and the four low-inbound routes.
2. Expand the FAQ route with reviewed Sonia questions and answers; validate FAQ schema and visible answer content together.
3. Extend content-density auditing from 35 source-manifest routes to all 115 rendered routes.
4. Run Lighthouse/PageSpeed on the canonical domain and inspect image delivery, LCP resource choice, CLS and mobile layout.
5. Add more answer cards only after source coverage is mapped. Every card needs a Sonia source ID, locator, hash, route intent and related service.
6. Re-run intelligence, provenance, build and deployment checks after each bounded slice.

## Guardrails

- Sonia-only source material.
- No invented quotes, teachings, testimonials, prices or program claims.
- No TeamStation content in public outputs.
- No doorway-page expansion without distinct source-backed local context.
- No change to `ai-train=no` without explicit approval.
- No production deployment from a dirty or unverified build.

## Evidence files

- `audit/full-seo-geo-crawl-audit-2026-07-31.md`
- `audit/site-intelligence-score.md`
- `audit/schema-audit.md`
- `audit/geo-audit.md`
- `audit/authority-gaps.md`
- `audit/orphan-pages.md`
- `docs/CONTENT_DENSITY_AUDIT.md`
