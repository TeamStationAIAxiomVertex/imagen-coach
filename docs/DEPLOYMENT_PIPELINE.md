# Deployment Pipeline

How a commit becomes the live `coachdeimagen.com` and `raiz.coachdeimagen.com`, and what must be true at each stage. Content rules live in `AGENTS.md`; this file covers build, backend and infrastructure.

## Stages

1. **Source.** Git is the only source of truth. `dist/` and `dist-raiz/` are generated, gitignored and rebuilt from scratch every time.
2. **Install.** `npm ci` from `package-lock.json` on the Node major in `.nvmrc` (22). `package.json` `engines` enforces the same range.
3. **Verify.** `npm run verify` is the single gate. CI (`.github/workflows/verify.yml`) runs it on every pull request and every push to `main`.
4. **Deploy.** Cloudflare Pages builds each project from GitHub and serves its output directory with the shared `functions/` directory.

## The verify gate

`scripts/verify.mjs` runs these steps in order and stops at the first failure:

| Step | What it proves |
| --- | --- |
| build main site | `scripts/build-static.mjs` produces `dist/` from an empty directory |
| validate main site | routes, assets, metadata, schema and content rules (`scripts/validate-build.mjs`) |
| build / validate La Raíz | `dist-raiz/` builds and passes `scripts/validate-raiz.mjs` |
| tests | conversion-event contract and La Raíz FX pricing |
| Pages routes present | both outputs contain a valid `_routes.json` |
| functions smoke test | `scripts/smoke-functions.mjs` boots `wrangler pages dev` and asserts 12 backend contracts |
| determinism | both sites rebuilt under another timezone are byte-identical, file by file |
| source untouched | the build did not modify any tracked or untracked source file |

A clean run takes about 95 seconds. Run `npm run smoke:functions` alone after a build to check only the backend.

## Determinism rules

- Builds never read the wall clock. `scripts/build-clock.mjs` is the only source of "now": `SOURCE_DATE_EPOCH` if set, otherwise the HEAD commit time, otherwise the build fails.
- No randomness, no environment-dependent ordering, no network reads during a build.
- Consequence: date-windowed content (La Raíz promotions in `raiz/program.json`) switches at a commit, not on a plain rebuild. To publish a promotion change on a schedule, commit on that date or rebuild with an explicit `SOURCE_DATE_EPOCH`.

## Cloudflare Pages projects

| Project config | Output | Build command | Compatibility |
| --- | --- | --- | --- |
| `wrangler.jsonc` (`name: coachdeimagen`) | `dist` | `npm run build` | `2026-05-23`, `nodejs_compat` |
| `wrangler.raiz.jsonc` (`name: raiz-coachdeimagen`) | `dist-raiz` | `npm run build:raiz` | `2026-07-11` |

Both projects deploy the root `functions/` directory. Each build writes `_routes.json` (from `scripts/pages-routes.mjs`) so `/assets/*` is served without invoking Functions.

Unverified from the repo: the dashboard build command, production branch and project name. `docs/CONTACT_CONCIERGE_SYSTEM.md` calls the production project `imagen-coach`, which does not match `wrangler.jsonc`. Confirm in the Cloudflare dashboard before relying on either name.

## Backend (Pages Functions)

| Path | File | Contract |
| --- | --- | --- |
| every page route | `functions/_middleware.js` | `Accept: text/markdown` returns the sibling `.md` via `env.ASSETS`, or HTML converted to Markdown |
| `/.well-known/http-message-signatures-directory` | `functions/[[path]].js`, `functions/_web-bot-auth.js` | signed directory when `WEB_BOT_AUTH_PRIVATE_JWK` is set, public fallback otherwise; GET/HEAD only |
| `/api/conversion-event` | `functions/api/conversion-event.js` | POST, 4 KB cap, origin allowlist, writes to `CONVERSION_EVENTS` Analytics Engine or logs |
| `/api/fx-pricing` | `functions/api/fx-pricing.js` | GET with `amount`; MXN is canonical, other currencies are estimates |

Any change under `functions/` or `lib/` must keep `npm run smoke:functions` passing and should add a check there for new behavior.

Bindings and secrets the code reads: `WEB_BOT_AUTH_PRIVATE_JWK`, `WEB_BOT_AUTH_PUBLIC_JWK` (optional) and `CONVERSION_EVENTS` (optional Analytics Engine dataset). Nothing else. Secrets set on the Pages projects for removed features (for example the contact concierge's `RESEND_*` and `OPENAI_*`) are unused and should be removed or rotated in the dashboard.

## Actions that need explicit owner approval

- Any production deploy, `wrangler pages deploy`, or change to Pages project settings, bindings or secrets.
- DNS, redirect rules, WAF, bot management or other zone settings.
- Force-pushing or rewriting published history.
- Changing the AI content policy (`Content-Signal`, robots rules).
