# Coach De Imagen Agent Engineering Directive

## Objective

Engineer and maintain `coachdeimagen.com` as the canonical AI-readable Coach De Imagen authority platform for Sonia McRorey.

## Priority Order

1. URL preservation
2. Semantic clarity
3. Crawlability
4. Machine readability
5. GEO authority
6. Conversion clarity
7. Human UX
8. Visual aesthetics

## Mandatory Rules

Never:

- confuse this repo with `TeamStationAIAxiomVertex/guadalajara`
- remove or redirect a canonical URL without documentation
- use SPA-only rendering
- hide SEO content
- add semantic duplication
- add excessive animation
- add bloated frameworks
- drift into influencer, fashion, beauty or generic coaching language
- invent credentials, rankings, clients or awards
- publish raw Drive source documents, banking data, payment details, old contact information, dated offer prices or private program logistics

Always:

- preserve all 35 canonical URLs
- use semantic HTML
- keep important content in raw HTML
- expose structured data and agent files
- maintain `es-MX`
- keep internal links crawlable
- validate build output before deployment
- consult Sonia's source-of-truth material before writing or changing source-grounded content
- use sanitized extracts from Sonia's Drive documents and blog archive instead of generic SEO copy

## Required Read Order Before Coding

1. `AGENTS.md`
2. `docs/MASTER_SEMANTIC_AUTHORITY_ARCHITECTURE.md`
3. `docs/source-url-inventory.md`
4. `docs/wiki.llm`
5. `docs/UBIQUITOUS_LANGUAGE.md`
6. `docs/SEARCH_INTENT_BOLDING_STRATEGY.md`
7. `docs/ICONOGRAPHY_SYSTEM.md`
8. `content/blog/soniamcrorey-blog.json`
9. `content/sonia-knowledge/quote-bank.json`
10. `content/sonia-knowledge/drive-source-inventory.json`
11. `content/sonia-knowledge/drive-quote-bank.json`
12. `content/sonia-knowledge/teaching-route-map.json`
13. `docs/SONIA_KNOWLEDGEBASE_QUOTE_BANK.md`
14. `docs/SONIA_DRIVE_KNOWLEDGEBASE.md`
15. `docs/SONIA_CLOUDFLARE_MCP_ARCHITECTURE.md`
16. `docs/SONIA_CLOUDFLARE_CORPUS_GOVERNANCE.md`
17. `docs/SONIA_TEACHING_ROUTE_MAP.md`
18. `docs/SDD.md`
19. `docs/DDD.md`
20. `docs/TDD.md`
21. `docs/GEO_OPERATING_SYSTEM.md`
22. `docs/PAGE_SIGNAL_MAP.md`
23. `docs/REDIRECTS_AND_URL_RETENTION.md`
24. `docs/SONIA_DAILY_ENGINEERING_META_AGENT.md`
25. `content/strategy/sonia-daily-meta-agent-queue.json`
26. `content/clean/manifest.json`
27. `scripts/build-static.mjs`
28. `scripts/validate-build.mjs`

## Sonia Domain Knowledge Source Stack

Sonia's expert source material now includes:

- the legacy Weblium crawl and clean migration layer
- the scraped blog archive in `content/blog/soniamcrorey-blog.json`
- the candidate quote bank in `content/sonia-knowledge/quote-bank.json`
- the Drive source inventory in `content/sonia-knowledge/drive-source-inventory.json`
- the Drive candidate quote bank in `content/sonia-knowledge/drive-quote-bank.json`
- the teaching route map in `content/sonia-knowledge/teaching-route-map.json`
- the human-readable Drive usage guide in `docs/SONIA_DRIVE_KNOWLEDGEBASE.md`
- the Cloudflare grounding and MCP design in `docs/SONIA_CLOUDFLARE_MCP_ARCHITECTURE.md`
- the Sonia-only corpus governance rules in `docs/SONIA_CLOUDFLARE_CORPUS_GOVERNANCE.md`
- the teaching-module governance guide in `docs/SONIA_TEACHING_ROUTE_MAP.md`

Use these sources to strengthen pages with Sonia's real domain language, proof, methodology, idioms and teaching concepts. Do not dump raw source text into pages. Extract, sanitize, compress and map each source to the correct page intent.

The active shared Drive corpus is the Cloudflare grounding root.
The supporting reviewed Drive library remains in the source contract for foundational service architecture, category-definition and doctrine files not yet mirrored into the active corpus.

Teaching modules must be added through the route map, not by hard-coding quotes into templates. Every public teaching requires source validation against the reviewed quote banks during `npm run build`.

## Daily Loop Rule

The recurring Sonia improvement loop must follow `docs/SONIA_DAILY_ENGINEERING_META_AGENT.md` and use `content/strategy/sonia-daily-meta-agent-queue.json` as the bounded-priority queue. The loop may reuse process discipline from other repos, but it may not import non-Sonia content, terminology, routes, or artifacts.

## Deployment Gate

Run:

```bash
npm run build
npm run validate
```

Do not push deploy-facing changes if either command fails.
