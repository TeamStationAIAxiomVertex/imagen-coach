# SKILL

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


## Skill Contract

Use this project skill when building or reviewing Coach De Imagen pages. Required checks: unique H1, meta description <=145 chars, canonical, social card, JSON-LD, FAQ where relevant, internal links, no thin pages, no duplicate intent and no visible strategy leakage.

## Source Material Contract

Before source-grounded page writing, use:

- `content/blog/soniamcrorey-blog.json`
- `content/sonia-knowledge/quote-bank.json`
- `content/sonia-knowledge/drive-source-inventory.json`
- `content/sonia-knowledge/drive-quote-bank.json`
- `content/sonia-knowledge/teaching-route-map.json`
- `docs/SONIA_DRIVE_KNOWLEDGEBASE.md`
- `docs/SONIA_TEACHING_ROUTE_MAP.md`

Extract Sonia's language carefully. Do not expose raw Drive files, bank/payment details, old contact data, dated pricing or private logistics.

When adding Sonia-authored quote modules, update the teaching route map instead of hard-coding page copy. Validate with `npm run build` so untraceable quotes fail before deployment.
