# AI + Cloudflare Site Analysis

Date: 2026-07-03
Domain: https://coachdeimagen.com
Project: Coach De Imagen | Sonia McRorey

## Executive Summary

The HTTP-side AI discovery layer is live and readable by agents. Cloudflare Pages is serving the production site from the `imagen-coach` Pages project on branch `main`, currently at commit `350e36a`.

The site exposes:

- `robots.txt` with AI crawler access and Content-Signal directives.
- XML sitemaps for canonical, blog, category, service, geo, intent and authority routes.
- `llms.txt` and `llms-full.txt`.
- Markdown negotiation for crawlers and agents requesting `Accept: text/markdown`.
- OpenAPI, API catalog, MCP server card, OAuth protected resource metadata, OAuth authorization metadata, agent skills and static corpus files.
- 115 static HTML routes with canonical tags, JSON-LD and FAQ schema.
- 115 route-level answer recommendation records.
- An 8-link internal anchor phrase mesh for every route.

Main remaining gap:

- DNS-AID records are not visible for `_index._agents.coachdeimagen.com`, `_a2a._agents.coachdeimagen.com` or `_mcp._agents.coachdeimagen.com`. This is the likely blocker for full DNS-based agent discovery scoring.

## Live Endpoint Checks

All checked AI endpoints returned `200` with expected non-HTML content types:

| Endpoint | Status | Content type |
| --- | --- | --- |
| `/robots.txt` | 200 | `text/plain` |
| `/sitemap.xml` | 200 | `application/xml` |
| `/blog-sitemap.xml` | 200 | `application/xml` |
| `/category-sitemap.xml` | 200 | `application/xml` |
| `/service-sitemap.xml` | 200 | `application/xml` |
| `/geo-sitemap.xml` | 200 | `application/xml` |
| `/intent-sitemap.xml` | 200 | `application/xml` |
| `/authority-sitemap.xml` | 200 | `application/xml` |
| `/llms.txt` | 200 | `text/plain` |
| `/llms-full.txt` | 200 | `text/plain` |
| `/.well-known/agent.json` | 200 | `application/json` |
| `/.well-known/mcp.json` | 200 | `application/json` |
| `/.well-known/mcp/server-card.json` | 200 | `application/json` |
| `/.well-known/agent-skills/index.json` | 200 | `application/json` |
| `/.well-known/oauth-protected-resource` | 200 | `application/json` |
| `/.well-known/oauth-authorization-server` | 200 | `application/json` |
| `/auth.md` | 200 | `text/markdown` |
| `/openapi.json` | 200 | `application/json` |
| `/.well-known/api-catalog` | 200 | `application/linkset+json` |
| `/agent/site-profile.json` | 200 | `application/json` |
| `/agent/sonia-source-corpus.json` | 200 | `application/json` |
| `/agent/industry-answer-taxonomy.json` | 200 | `application/json` |
| `/agent/route-answer-recommendations.json` | 200 | `application/json` |

## Markdown Negotiation

Confirmed `Accept: text/markdown` returns markdown for representative live routes:

- `/`
- `/coach-de-imagen/`
- `/presencia-ejecutiva/`
- `/mexico/`
- `/imagen-presencia/presencia-profesional-estrategica/`

This means agents can request cleaner markdown instead of extracting text from HTML.

## Static SEO + GEO Checks

Local build validation passed:

- 115 routes built into `dist`.
- 115 routes validated with mapped assets.
- 115 HTML routes have canonical tags.
- 115 HTML routes include JSON-LD.
- 115 HTML routes include FAQ schema.
- No route is below 250 visible words in the generated SEO audit.

Sitemaps now cover the main semantic layers:

- Core canonical pages.
- Publications.
- Service routes.
- Category hubs.
- GEO market routes.
- Search intent pages.
- Authority pages.

## Agent Corpus Coverage

Public agent files in `dist/agent` include:

- `site-profile.json`
- `sonia-source-corpus.json`
- `industry-answer-taxonomy.json`
- `route-answer-recommendations.json`
- `internal-link-keyword-mesh.json`
- `geo-markets.json`
- `ontology.json`
- `page-signals.json`
- `services.json`
- `semantic-hubs.json`
- `authority-pages.json`
- `publications.json`

Key corpus counts after the 2026-07-03 corpus addendum:

- Active source files represented: 42
- Active Cloudflare corpus addenda: 4
- Blog archive posts available locally: 553
- Blog quote bank entries: 60
- Drive quote bank entries: 18
- Answer playbooks: 6
- Industry answer domains: 6
- Public knowledge cards: 117
- Approved daily batch cards: 75
- Route answer recommendations: 115
- Internal link mesh pages: 115
- Internal anchor links per page: 8

## Cloudflare Project Status

Cloudflare Pages project:

- Project name: `imagen-coach`
- Production branch: `main`
- Production source commit: `350e36a`
- Custom domain: `coachdeimagen.com`
- Pages preview: `https://bff6fb1f.imagen-coach.pages.dev`

## DNS-AID Gap

The following DNS queries returned no visible records:

- `_index._agents.coachdeimagen.com`
- `_a2a._agents.coachdeimagen.com`
- `_mcp._agents.coachdeimagen.com`

Recommended DNS entries to add in Cloudflare DNS:

```txt
_index._agents.coachdeimagen.com HTTPS 1 . alpn="h2" endpoint="https://coachdeimagen.com/.well-known/agent-index.json"
_a2a._agents.coachdeimagen.com HTTPS 1 . alpn="h2" endpoint="https://coachdeimagen.com/.well-known/a2a.json"
_mcp._agents.coachdeimagen.com HTTPS 1 . alpn="h2" endpoint="https://coachdeimagen.com/.well-known/mcp/server-card.json"
```

Also confirm DNSSEC is enabled for the zone so validating resolvers can trust the discovery records.

## Corpus Addendum Completed

The active Cloudflare shared corpus now includes four controlled Sonia-only grounding addenda:

- `cloudflare-corpus-servicios-arquitectura-sonia-mcrorey.md`
- `cloudflare-corpus-definicion-coaching-imagen-y-abundancia.md`
- `cloudflare-corpus-axiomas-imagen-sonia-mcrorey.md`
- `cloudflare-corpus-comunicacion-no-verbal-presencia.md`

These files activate the reviewed service architecture, coaching definition, image axioms and nonverbal communication doctrine for agent retrieval without exposing raw private Drive material.

## Risk Notes

- Public AI-facing files now use generic external-project boundary language. Named anti-bleed references are retained only in private governance documentation.
- Email delivery was not part of this audit. The agent surfaces can route users to contact and WhatsApp, but transactional email still needs separate Cloudflare Email Sending or Resend configuration if Sonia wants form delivery through `sonia@coachdeimagen.com`.

## Recommended Next Slice

1. Add DNS-AID records in Cloudflare DNS.
2. Generate 20-40 additional answer cards from the active foundational addenda:
   - category definition
   - service route decision logic
   - nonverbal communication
   - image axioms
   - executive presence and leadership positioning
3. Rebuild and redeploy.
4. Re-run IsItAgentReady and live endpoint checks.
