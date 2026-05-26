# TDD

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

Source hygiene tests:

- `content/sonia-knowledge/drive-source-inventory.json` must parse as JSON.
- `content/sonia-knowledge/drive-quote-bank.json` must parse as JSON.
- `content/sonia-knowledge/drive-source-inventory.json` must keep `rawFilesCommitted` false.
- `content/sonia-knowledge/teaching-route-map.json` must parse as JSON.
- Every teaching in `teaching-route-map.json` must validate against a reviewed quote-bank `sourceSnippet` during `npm run build`.
- Public output must not contain raw bank details, CLABE numbers, card numbers, old contact data, old source domains, stale offer prices or private program logistics from Sonia's Drive documents.
- Drive-derived content must be sanitized and mapped to page intent before publication.
- Public output must not expose raw source filenames from Sonia's Drive folder.
- Teaching modules must remain compact and must not duplicate more than once on the same generated route unless explicitly approved for a long-form article or methodology page.


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
