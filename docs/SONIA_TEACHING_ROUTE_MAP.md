# Sonia Teaching Route Map

Status: active implementation contract.

Purpose: use Sonia McRorey's reviewed blog and Drive knowledgebase as public authority signals without turning service pages into essays or exposing private source material.

Machine source:

- `content/sonia-knowledge/teaching-route-map.json`

Validated source banks:

- `content/sonia-knowledge/drive-quote-bank.json`
- `content/sonia-knowledge/quote-bank.json`
- `content/blog/soniamcrorey-blog.json`

## Public Rule

Each public teaching module must be short, source-grounded, page-specific and useful for a buyer decision. The module should feel like Sonia's coaching criterion, not like an SEO insert.

Do not publish:

- source filenames
- raw Drive document names
- payment details
- CLABE, bank, card or transfer data
- old contact details
- dated prices
- old program logistics
- private notes
- SEO, GEO or agentic strategy language

## Build Rule

`scripts/build-static.mjs` loads `teaching-route-map.json` during the static build. Each teaching must contain a `sourceSnippet` that is traceable to the reviewed quote banks. If a teaching cannot be traced, the build fails.

This makes Sonia's quotes and teaching addendums auditable instead of invented.

## UI Rule

The public module is intentionally compact:

- one quote
- one application title
- one short explanation
- up to three practical tips

Default limit: one module per route. Long-form teaching belongs on article, methodology, pillar and authority pages, not inside every commercial service section.

## Route Mapping Rule

Use direct route mapping for core pages:

- homepage
- services
- service detail pages
- comparison pages
- FAQ page
- About Sonia page
- semantic hubs
- methodology pages

Use fallback mapping only for:

- GEO pages
- search-intent pages
- article pages

Fallbacks must still map to the route's semantic intent. Do not use random quote rotation.

## Editorial Rule

Use Sonia's language where it increases trust, clarity or proof. Do not overquote. Do not make every page sound emotionally identical. Each page must keep its own buyer intent, vocabulary cluster and transformation outcome.

If a page needs more depth, create or improve a supporting article, methodology page, FAQ, glossary page or audience page instead of adding more paragraphs to the commercial page.

## Execution Plan

1. Maintain the reviewed source banks from Sonia's blog and Drive documents.
2. Promote only source-traceable, sanitized language into `teaching-route-map.json`.
3. Map each promoted teaching to a route, fallback family or semantic territory.
4. Render compact public modules through `scripts/build-static.mjs`.
5. Validate with `npm run build` so untraceable source snippets fail before deployment.
6. Validate public output with `npm run validate` and spot-check `dist/` for private-source leakage.
7. Use future source material to add pillar addendums, FAQs, methodology pages and audience pages without altering existing UI structure unless explicitly requested.
