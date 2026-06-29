# AGENT

Project: coachdeimagen.com

Owner: Sonia McRorey

Rendered route count: 115

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


## Agent Operating Contract

Agents must inspect rendered output before claiming SEO, GEO, schema, social, sitemap or deployment readiness. Do not expose SEO engineering language in public pages. Keep content Spanish, executive, human and category-clear.

## Source Material Contract

Sonia's domain knowledge sources are part of the operating contract:

- `content/blog/soniamcrorey-blog.json`
- `content/sonia-knowledge/quote-bank.json`
- `content/sonia-knowledge/drive-source-inventory.json`
- `content/sonia-knowledge/drive-quote-bank.json`
- `content/sonia-knowledge/teaching-route-map.json`
- `docs/SONIA_KNOWLEDGEBASE_QUOTE_BANK.md`
- `docs/SONIA_DRIVE_KNOWLEDGEBASE.md`
- `docs/SONIA_CLOUDFLARE_MCP_ARCHITECTURE.md`
- `docs/SONIA_CLOUDFLARE_CORPUS_GOVERNANCE.md`
- `docs/SONIA_TEACHING_ROUTE_MAP.md`

Use these before writing source-grounded pages, methodology pages, FAQs, GEO pages, service descriptions or schema descriptions. Public copy must use sanitized, reviewed extracts only. Never publish raw Drive payment details, old contact data, banking details, dated prices or private program logistics.

The source contract now has two Sonia-only Drive layers:

- the active shared Cloudflare grounding corpus
- the supporting reviewed foundational library

The active corpus is for ongoing retrieval and inventorying.
The reviewed quote bank remains the public teaching-validation layer until a dedicated extraction pass is completed from the active corpus.

## Teaching Module Contract

Sonia-authored quote addendums must be routed through `content/sonia-knowledge/teaching-route-map.json`. The static build validates each mapped teaching against the reviewed quote banks through `sourceSnippet`.

Use the modules to add proof, practical coaching criteria and decision clarity. Do not use them to pad copy. One compact module per route is the default.

## Daily Improvement Contract

The recurring Sonia improvement loop is governed by:

- `docs/SONIA_DAILY_ENGINEERING_META_AGENT.md`
- `docs/SONIA_CLOUDFLARE_MCP_ARCHITECTURE.md`
- `docs/SONIA_CLOUDFLARE_CORPUS_GOVERNANCE.md`
- `content/strategy/sonia-daily-meta-agent-queue.json`
- `audit/daily-meta-agent-baseline-2026-06-11.md`

That loop may reuse operating discipline learned elsewhere, but it must only use Sonia-owned ontology, routes, knowledge sources and buyer language when working in this repository.

## Authority Artifact Contract

The authority definition cluster now includes:

- `/coach-de-imagen`
- `/seguridad-profesional`
- `/metodo-sonia-mcrorey`
- `/sistema-presencia-profesional`
- `/framework-liderazgo-visible`
- `/modelo-imagen-estrategica`
- `/glosario`

Agents must project that cluster consistently into:

- `llms.txt`
- `llms-full.txt`
- `agent/site-profile.json`
- `agent/authority-pages.json`
- `agent/authority-cluster.json`
- `agent/glossary.json`
- `semantic-index.json`

These files are part of the retrieval contract for Cloudflare and AI systems. Do not let the authority pages exist only as HTML routes without matching machine-readable discovery surfaces.
