# Sonia Daily Meta Agent Baseline

Date: 2026-06-11

## Intent

Establish a Sonia-specific daily engineering loop that compounds GEO, AI retrieval, internal linking, schema quality and source-grounded authority without contaminating the site with material or positioning from other projects.

## Evidence Reviewed

- `AGENTS.md`
- `wiki.llm`
- `agent.md`
- `docs/AGENT.md`
- `docs/GEO_OPERATING_SYSTEM.md`
- `docs/IMPLEMENTATION_ROADMAP.md`
- `docs/LLM_CONTEXT.md`
- `content/blog/soniamcrorey-blog.json`
- `content/sonia-knowledge/quote-bank.json`
- `content/sonia-knowledge/drive-source-inventory.json`
- `content/sonia-knowledge/drive-quote-bank.json`
- `content/sonia-knowledge/teaching-route-map.json`
- `audit/schema-audit.md`
- `audit/internal-link-map.md`

## Baseline Findings

### What is already strong

- The site already has a serious static agentic surface: `llms.txt`, `llms-full.txt`, `openapi.json`, route-level agent JSON, markdown negotiation, and sitemap generation.
- Sonia's source-of-truth hierarchy is already explicit in repo docs.
- The site already has a meaningful audit and ontology layer, which makes daily bounded improvements realistic.

### What still needs daily compounding

1. Sonia-source grounding is uneven across route clusters.
   - The source banks exist, but not every important page appears to fully benefit from them yet.

2. The internal-link mesh needs stronger ontology discipline.
   - The right pattern is not "more links everywhere" but a route-specific mesh tied to buyer intent, service fit and retrieval clarity.

3. Several route clusters still depend on weak or mismatched media.
   - This hurts both trust and semantic clarity.

4. FAQ and schema quality still need selective expansion.
   - High-value commercial pages should answer executive-intent questions more directly.

5. The highest-leverage new content is definitional and methodological.
   - Sonia can win with doctrine pages, not only with more articles.

## Recommended Daily Loop Priority

Start with:

`teaching-addendums-authority-routes`

Reason:

- It raises Sonia-specific authority fast.
- It uses her own blog and Drive-derived language.
- It improves both human trust and AI retrieval.
- It does not require a risky visual redesign.
- It can compound into FAQs, methodology pages and internal links later.

## Controlled Output Types For The First Week

Use one slice per day from this order:

1. teaching addendums on authority routes
2. FAQ and schema enhancement on commercial cluster
3. contextual interlink mesh improvement
4. media relevance cleanup on comparison and authority pages
5. methodology/definition page expansion

## Do Not Allow The Loop To Drift Into

- TeamStation naming or buyer language
- generic enterprise software terminology
- auto-generated LATAM doorway pages
- copy volume for its own sake
- unrelated UI churn
- automatic deployment or publish actions

## Success Signal For Daily Runs

After 7-10 runs, the site should show:

- stronger Sonia-authored teaching density on key routes
- cleaner route differentiation
- more disciplined anchor-text linking
- better FAQ answer coverage
- higher confidence in route intent and retrieval eligibility
- no cross-project contamination

## Execution Update

Completed first slice:

`teaching-addendums-authority-routes`

What changed:

- `imagen profesional` now uses a Sonia quote about when image no longer reflects leadership, clarity or growth.
- `presencia ejecutiva` now uses a Sonia quote about updating presence for visibility, influence and positioning.
- `imagen estratégica` now uses a Sonia quote that ties vestimenta profesional to business image, context and value.

What stayed intentionally unchanged:

- no UI structure changes
- no new page templates
- no extra quote density on service pages that already had a clear teaching fit

Next recommended slice:

`faq-schema-expansion-commercial-cluster`

## Execution Update 2

Completed second slice:

`faq-schema-expansion-commercial-cluster`

What changed:

- The homepage now exposes a visible FAQ block backed by the same `faqItemsForPage` source used for JSON-LD.
- The services hub now exposes a visible FAQ block that answers route choice, audience fit, online delivery and diagnosis-first questions.
- The contact page now exposes a visible FAQ block that clarifies what to send, privacy handling and online-first contact.
- Commercial-cluster FAQ answers were tightened to sound more executive, specific and retrieval-friendly without inflating page density.

What stayed intentionally unchanged:

- no new FAQ truth source outside the build system
- no layout redesign beyond inserting compact FAQ sections
- no broad copy expansion on the dedicated FAQ page

Next recommended slice:

`interlink-mesh-latam-buyer-intent`

## Execution Update 3

Completed third slice:

`interlink-mesh-latam-buyer-intent`

What changed:

- The in-page keyword mesh now uses Sonia-specific route priorities on five high-value pages instead of relying only on global scoring.
- `imagen profesional` now links more clearly into service fit, buyer-intent, methodology and Guadalajara/México context.
- `presencia ejecutiva` now links more clearly into authority, leadership, women-leadership intent, methodology and Guadalajara grounding.
- `imagen estratégica` now links more clearly into positioning, business-image intent, methodology and service adjacency.
- `guadalajara` now links more naturally into Zapopan, Sonia's trayectoria, contact intake and the main service hub.
- `miami-hispanos` now links more clearly into Latina executive intent, business-image intent, contact and Sonia's broader México/Guadalajara base.

What stayed intentionally unchanged:

- no manual link insertion inside editorial body copy
- no sitewide exact-match stuffing
- no broad rewrite of the existing keyword mesh system

Next recommended slice:

`media-relevance-cleanup`

## Execution Update 4

Completed fourth slice:

`media-relevance-cleanup`

What changed:

- `presencia-profesional-estrategica` now uses a stronger Sonia leadership portrait instead of the flatter neutral portrait, which better matches the page's authority-and-coherence theme.
- `imagen-superficial-vs-presencia-profesional` now uses Sonia's green blazer full-body photo, which reads more like presence and executive image than a recycled legacy blog graphic.
- `coaching-motivacional-vs-posicionamiento-profesional` kept its stronger Sonia portrait, but the hero alt text was corrected so it finally matches the actual image being rendered.
- `evolucion-coaching-imagen-mexico-latam` stayed on the existing event photo because it already matched the route's category and regional context well.

What stayed intentionally unchanged:

- no page layout changes
- no new image assets added to the repo
- no arbitrary media swaps on routes that were already semantically aligned

Next recommended slice:

`definition-methodology-cluster`

## Execution Update 5

Completed fifth slice:

`definition-methodology-cluster`

What changed:

- Added two Sonia-native authority pages: `/coach-de-imagen` and `/seguridad-profesional`.
- Strengthened `/metodo-sonia-mcrorey` with route-specific doctrine cards, clearer FAQ answers and Sonia-grounded teaching instead of flatter generic methodology copy.
- Bound the new definition pages to Sonia-reviewed teaching modules so `coach de imagen` now carries a visible-signals definition layer and `seguridad profesional` now carries the internal-capacity layer.
- Fixed the route-map mismatch for `/sistema-presencia-profesional`, so the presence-system page now resolves to its intended Sonia teaching instead of missing the direct route mapping.
- Fixed breadcrumb behavior on the authority cluster so `/metodo-sonia-mcrorey` no longer renders itself as its own parent.
- Updated the validator route registry so the build and validation layers now agree on the expanded authority cluster.

What stayed intentionally unchanged:

- no new frontend framework or template system
- no layout redesign
- no footer/nav expansion
- no broad copy rewrite on unrelated pages

Next recommended slice:

`authority-artifact-expansion`

## Execution Update 6

Completed sixth slice:

`authority-artifact-expansion`

What changed:

- Expanded Sonia's machine-readable authority surfaces so the new definition cluster now appears not only as HTML pages, but also inside `llms.txt`, `llms-full.txt`, `agent/site-profile.json`, `agent/authority-pages.json`, `agent/authority-cluster.json`, `agent/glossary.json` and `semantic-index.json`.
- Added a dedicated `authority-cluster` artifact that explains Sonia's owned category, methodology routes, route-specific summaries, glossary terms, related routes and Sonia teaching context in one retrieval-friendly JSON surface.
- Added a dedicated `glossary` artifact so AI systems can resolve key terms like `coach de imagen` and `seguridad profesional` from Sonia's actual site architecture instead of inferring them from scattered page copy.
- Updated the local agent docs and LLM context files so they now reference `coachdeimagen.com`, reflect the expanded authority cluster and stop carrying stale route-count or legacy-domain drift.

What stayed intentionally unchanged:

- no UI layout changes
- no new frontend components
- no changes to visible page hierarchy
- no new dependency or runtime service

Next recommended slice:

`geo-faq-authority-bridges`

## Execution Update 7

Completed seventh slice:

`geo-faq-authority-bridges`

What changed:

- Strengthened the FAQ layer on `/guadalajara`, `/mexico` and `/miami-hispanos` so those pages now explain Sonia's category definitions more directly instead of relying only on the generic GEO FAQ template.
- Strengthened the buyer-intent pages `/como-proyectar-autoridad` and `/inseguridad-profesional` so their FAQ answers now explicitly bridge to Sonia's `coach de imagen` and `seguridad profesional` definitions.
- Kept the change at the answer layer only: no new components, no new layout blocks and no visual rework.
- Improved AI-retrieval clarity by repeating Sonia's real category language in the exact places where commercial and GEO users are already asking direct questions.

What stayed intentionally unchanged:

- no layout or spacing changes
- no footer or navigation changes
- no new schema type or runtime dependency
- no broad rewrite of GEO page body copy

Next recommended slice:

`geo-proof-quote-distribution`
