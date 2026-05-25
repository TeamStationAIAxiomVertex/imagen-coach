# Imagen Coach Agent Engineering Directive

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
12. `docs/SONIA_KNOWLEDGEBASE_QUOTE_BANK.md`
13. `docs/SONIA_DRIVE_KNOWLEDGEBASE.md`
14. `docs/SDD.md`
15. `docs/DDD.md`
16. `docs/TDD.md`
17. `docs/GEO_OPERATING_SYSTEM.md`
18. `docs/PAGE_SIGNAL_MAP.md`
19. `docs/REDIRECTS_AND_URL_RETENTION.md`
20. `content/clean/manifest.json`
21. `scripts/build-static.mjs`
22. `scripts/validate-build.mjs`

## Sonia Domain Knowledge Source Stack

Sonia's expert source material now includes:

- the legacy Weblium crawl and clean migration layer
- the scraped blog archive in `content/blog/soniamcrorey-blog.json`
- the candidate quote bank in `content/sonia-knowledge/quote-bank.json`
- the Drive source inventory in `content/sonia-knowledge/drive-source-inventory.json`
- the Drive candidate quote bank in `content/sonia-knowledge/drive-quote-bank.json`
- the human-readable Drive usage guide in `docs/SONIA_DRIVE_KNOWLEDGEBASE.md`

Use these sources to strengthen pages with Sonia's real domain language, proof, methodology, idioms and teaching concepts. Do not dump raw source text into pages. Extract, sanitize, compress and map each source to the correct page intent.

## Deployment Gate

Run:

```bash
npm run build
npm run validate
```

Do not push deploy-facing changes if either command fails.
