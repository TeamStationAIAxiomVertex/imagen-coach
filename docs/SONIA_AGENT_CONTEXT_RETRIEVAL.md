# Sonia agent context retrieval

Last updated: 2026-10-10, America/Mexico_City.

Purpose: keep future Codex/Sonia site runs light. Read this file first, then only open deeper receipts when needed. Do not ingest full old task transcripts.

## Repository

- Repo path: `/Users/lonniemcrorey/Documents/New project/imagen-coach`
- GitHub remote: `TeamStationAIAxiomVertex/imagen-coach`
- Production domain: `https://coachdeimagen.com`
- Cloudflare Pages project: `imagen-coach`
- Production branch: `main`
- Canonical legacy source: `imagencoach.com`
- Guadalajara site is separate. Do not mix with `imagengdl.com` content.

## First-run recovery commands

From `/Users/lonniemcrorey/Documents/Codex/2026-09-08/wt`:

```bash
python3 outputs/check_sonia_recovery.py
```

From repo root:

```bash
git status --short --branch
npm run build
npm run validate
node scripts/test-page-seo.mjs
```

## Core operating rules

- Preserve Sonia's authored wording on articles. Do not rewrite approved prose without explicit instruction.
- Keep raw Drive/private/payment/old-pricing/logistics content out of public files.
- Do not copy secrets into docs, commits, handoffs, prompts, or logs.
- Contact is WhatsApp-only. `/api/contact` was intentionally removed and should stay gone unless user explicitly changes strategy.
- Do not claim ranking, indexing, AI citation, lead growth, or business outcome without external evidence.
- Use `coachdeimagen.com` as canonical site. Use exact Cloudflare project name `imagen-coach` when deploying.
- Commerce is optional and intentionally untouched.

## Current production state

Healthy as of 2026-10-10:

- Main branch aligned with `origin/main` after commit `9f8c125`.
- Cloudflare Pages production live on `coachdeimagen.com`.
- Agent Ready scan returns Level 5.
- Web Bot Auth returns `pass`.
- `/llms.txt` is valid Markdown with H1 and Markdown links.
- `/llms-full.txt` exists and includes AEO authority map references.
- `/agent/aeo-authority-map.json` returns 72 priority answer cards.
- `/aeo/cards/index.md` returns 72 Markdown card links.
- `/knowledge-sitemap.xml` includes AEO URLs.
- `/contacto/` routes users to WhatsApp.
- `/api/contact` intentionally returns 404.

## Recent important commits

- `25e8863335bf139a414088c9398499871b57276a` — `Route Sonia contact to WhatsApp only`
  - Deleted `functions/api/contact.js`.
  - Removed public `/api/contact` from OpenAPI/auth/agent registration.
  - Removed contact write scopes.
  - Rewrote `/contacto/` as WhatsApp handoff.

- `eeda560c66064d685b581cca4d67d3ab070e8552` — `Add Sonia AEO authority map`
  - Added `content/strategy/sonia-aeo-authority-map.json`.
  - Added 72 priority AEO cards across 6 layers.
  - Generated `dist/agent/aeo-authority-map.json`, `dist/aeo/cards/index.json`, `dist/aeo/cards/index.md`, and 72 individual Markdown card files.
  - Added AEO discovery to OpenAPI, `llms-full.txt`, and `knowledge-sitemap.xml`.

- `9f8c12581709746f97199daec228e3b315aeb062` — `Fix llms markdown links`
  - Converted root `llms.txt` bare URLs into Markdown links.
  - Added AEO map links to `llms.txt`.
  - Added validation for H1, Markdown links, and AEO authority map link.

## Cloudflare/AEO limits checked

Checked 2026-10-10 against Cloudflare AI Search docs:

- Workers Free maximum pages crawled per day: 500.
- Workers Paid maximum pages crawled per day: unlimited.
- Sonia AEO map adds 74 crawlable AEO files.
- 74 fits Free daily crawl budget.

## Key machine-readable live URLs

- `https://coachdeimagen.com/llms.txt`
- `https://coachdeimagen.com/llms-full.txt`
- `https://coachdeimagen.com/openapi.json`
- `https://coachdeimagen.com/knowledge-sitemap.xml`
- `https://coachdeimagen.com/agent/aeo-authority-map.json`
- `https://coachdeimagen.com/aeo/cards/index.md`
- `https://coachdeimagen.com/agent/publications.json`
- `https://coachdeimagen.com/agent/article-meta-cards.json`
- `https://coachdeimagen.com/.well-known/http-message-signatures-directory`

## Receipt files in Codex workspace

Use these when exact proof is needed:

- `/Users/lonniemcrorey/Documents/Codex/2026-09-08/wt/outputs/SONIA_SITE_RECOVERY.md`
- `/Users/lonniemcrorey/Documents/Codex/2026-09-08/wt/outputs/SONIA_AEO_AUTHORITY_MAP_2026-10-10.md`
- `/Users/lonniemcrorey/Documents/Codex/2026-09-08/wt/outputs/sonia-aeo-authority-live-validation-2026-10-10.json`
- `/Users/lonniemcrorey/Documents/Codex/2026-09-08/wt/outputs/sonia-agent-ready-scan-after-aeo-2026-10-10.json`
- `/Users/lonniemcrorey/Documents/Codex/2026-09-08/wt/outputs/sonia-llms-txt-live-validation-2026-10-10.json`
- `/Users/lonniemcrorey/Documents/Codex/2026-09-08/wt/outputs/sonia-agent-ready-scan-after-llms-2026-10-10.json`

## Safe next work

Good next steps:

1. Add Search Console/GSC evidence baseline.
2. Check indexing status for newest articles and AEO files.
3. Review Cloudflare AI Search dashboard ingestion after crawl.
4. Improve internal links from top service and authority pages to AEO-supported buyer-intent routes.
5. Build a small report from GSC impressions/clicks before changing ranking strategy.

Avoid next:

- Do not reintroduce email contact unless user explicitly asks.
- Do not add Commerce.
- Do not alter Web Bot Auth key/secret unless necessary.
- Do not push SEO claims into visible copy as hype.
- Do not convert Sonia article question sequences into FAQ schema when that changes reading experience.

## Deploy command

Use exact project name:

```bash
npx wrangler pages deploy dist --project-name imagen-coach --branch main
```

Wrangler may print a local log-file permission warning for `/Users/lonniemcrorey/Library/Preferences/.wrangler/logs/...`. Prior deployments still completed successfully despite that warning. Verify live URLs after deploy.
