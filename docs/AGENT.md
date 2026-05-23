# Imagen Coach Agent Engineering Directive

## Objective

Engineer and maintain `imagencoach.com` as the canonical AI-readable Imagen Coach authority platform for Sonia McRorey.

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

Always:

- preserve all 35 canonical URLs
- use semantic HTML
- keep important content in raw HTML
- expose structured data and agent files
- maintain `es-MX`
- keep internal links crawlable
- validate build output before deployment

## Required Read Order Before Coding

1. `AGENTS.md`
2. `docs/MASTER_SEMANTIC_AUTHORITY_ARCHITECTURE.md`
3. `docs/source-url-inventory.md`
4. `docs/wiki.llm`
5. `docs/UBIQUITOUS_LANGUAGE.md`
6. `docs/SEARCH_INTENT_BOLDING_STRATEGY.md`
7. `docs/SDD.md`
8. `docs/DDD.md`
9. `docs/TDD.md`
10. `docs/GEO_OPERATING_SYSTEM.md`
11. `docs/PAGE_SIGNAL_MAP.md`
12. `docs/REDIRECTS_AND_URL_RETENTION.md`
13. `content/clean/manifest.json`
14. `scripts/build-static.mjs`
15. `scripts/validate-build.mjs`

## Deployment Gate

Run:

```bash
npm run build
npm run validate
```

Do not push deploy-facing changes if either command fails.
