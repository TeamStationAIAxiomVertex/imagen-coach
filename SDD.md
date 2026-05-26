# SDD

Project: coachdeimagen.com

Owner: Sonia McRorey

Rendered route count: 113

Core category: Coaching de Imagen, Presencia y Posicionamiento Profesional.

Primary objective: make coachdeimagen.com the authoritative static, crawlable and AI-readable Spanish-language destination for coaching de imagen, presencia ejecutiva, imagen profesional, seguridad profesional and liderazgo visible across Mexico, Guadalajara, LATAM and Spanish-speaking executive markets.

Hard constraints:

- Static-first HTML
- Semantic headings and canonicals
- JSON-LD per route
- FAQ schema where search intent requires it
- Markdown variants for agent retrieval
- Internal link mesh across services, hubs, GEO, intent, comparisons and publications
- Cloudflare Pages compatible output from `dist/`

Source material contract:

- `content/blog/soniamcrorey-blog.json` is the long-form blog knowledge source.
- `content/sonia-knowledge/quote-bank.json` is the candidate quote bank.
- `content/sonia-knowledge/drive-source-inventory.json` is the controlled Drive document inventory.
- `content/sonia-knowledge/drive-quote-bank.json` is the candidate Drive quote and teaching-signal bank.
- `content/sonia-knowledge/teaching-route-map.json` is the controlled public quote and teaching addendum map.
- `docs/SONIA_DRIVE_KNOWLEDGEBASE.md` is the editorial usage guide for Sonia's documents and presentations.
- `docs/SONIA_TEACHING_ROUTE_MAP.md` is the implementation contract for page-specific teaching modules.

Do not emit raw Drive payment details, old contact details, bank data, dated pricing or private logistics into public pages.

Teaching addendum design:

- `scripts/build-static.mjs` loads and validates `teaching-route-map.json` before rendering.
- Each public teaching requires a `sourceSnippet` traceable to the reviewed quote banks.
- Public modules render as compact authority panels: quote, application title, short note and practical tips.
- Commercial pages should use these as decision support, not long-form content expansion.


## Generated Artifacts

- `audit/seo-audit.md`
- `audit/geo-audit.md`
- `audit/semantic-topology.md`
- `audit/crawl-graph.md`
- `audit/authority-gaps.md`
- `audit/orphan-pages.md`
- `audit/duplicate-intent.md`
- `audit/schema-audit.md`
- `audit/internal-link-map.md`
- `audit/geo-expansion-map.md`
- `ontology/semantic-entity-map.md`
- `ontology/topical-clusters.md`
- `ontology/query-intent-matrix.md`
