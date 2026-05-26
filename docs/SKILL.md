# Imagen Coach Required Skill Stack

## GEO Engineering

Required skills:

- semantic SEO
- AI retrieval optimization
- entity architecture
- ontology engineering
- vector retrieval structuring
- conversational query optimization
- Spanish LATAM search intent modeling
- local service SEO

Execution standard:

- preserve all 35 canonical URLs
- map each page to one primary intent
- avoid keyword stuffing
- preserve entity consistency
- keep raw HTML crawlable
- use schema only when supported by visible content

## Frontend Engineering

Required skills:

- semantic HTML
- accessibility engineering
- static site architecture
- performance optimization
- Core Web Vitals
- CSS systems design
- responsive QA

Execution standard:

- do not redesign unless explicitly requested
- preserve the visual system
- do not add DOM noise
- keep content segmented and readable

## Cloudflare Skills

Required skills:

- Cloudflare Pages
- CDN behavior
- edge caching
- redirects
- production header safety
- deployment validation

Execution standard:

- build command is `npm run build`
- publish directory is `dist`
- redirects are generated into `_redirects`
- headers are copied from `_headers`

## Martech and Conversion Skills

Required skills:

- conversion optimization
- authority funnel design
- behavior analytics
- SERP intent analysis
- semantic funnel architecture

Execution standard:

- CTA remains diagnostic-focused
- WhatsApp is the primary contact action
- pages must reduce uncertainty, not add copy volume
- service pages must clarify fit and next step

## Sonia Source-Material Skills

Required skills:

- source synthesis
- editorial extraction
- sensitive-content redaction
- Spanish executive content strategy
- Sonia voice preservation
- service and methodology mapping

Execution standard:

- read `content/blog/soniamcrorey-blog.json`, `content/sonia-knowledge/quote-bank.json`, `content/sonia-knowledge/drive-source-inventory.json`, `content/sonia-knowledge/drive-quote-bank.json`, `content/sonia-knowledge/teaching-route-map.json`, `docs/SONIA_DRIVE_KNOWLEDGEBASE.md` and `docs/SONIA_TEACHING_ROUTE_MAP.md` before writing source-grounded pages
- use Sonia's actual language where it strengthens proof, clarity or authority
- do not publish raw Drive documents, payment details, old contact data, bank data, stale prices or private logistics
- do not use source material as generic quote stuffing
- map every extract to page intent, semantic cluster and buyer decision stage
- add public Sonia quote modules only through the teaching route map so build-time source validation can catch invented or untraceable language

## AI Engineering Skills

Required skills:

- LLM readability optimization
- AI citation optimization
- machine discoverability
- structured retrieval design
- agentic architecture
- OpenAPI static endpoint design
- MCP readiness

Execution standard:

- maintain generated `/openapi.json`
- maintain `/llms.txt`
- maintain generated `/llms-full.txt`
- maintain generated `/agent/*.json`
- validate agent files during build
