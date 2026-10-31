# CLAUDE.md

Agent entry point for this repository. Read these before changing anything:

- `AGENTS.md`: the content, SEO, voice, URL and Sonia-corpus contract. It wins on anything about what the site says.
- `docs/DEPLOYMENT_PIPELINE.md`: build, backend, Cloudflare Pages and the verify gate.

## Definition of done

A change is done only when `npm run verify` passes on the final revision and you have read its ledger. Do not report a change as complete, push deploy-facing work, or open a PR on a failing or unrun verify. If a step cannot run here, say which step and why; never substitute a weaker check without saying so.

## Order of work

Infrastructure, build and pipeline fixes land on `main` before front-end, SEO or content changes. Front-end branches rebase onto `main` after infrastructure merges and must pass `npm run verify` again.

## Determinism

- Builds must be a pure function of the commit. Never read the wall clock, use randomness, or fetch the network during a build.
- Get dates only from `scripts/build-clock.mjs` (`BUILD_DATE`, `BUILD_YEAR`, `BUILD_TIME`).
- `dist/` and `dist-raiz/` are rebuilt from empty and are never edited or committed.
- If verify's determinism step fails, find the source of variation; do not loosen the check.

## Backend

- `functions/` serves both Pages projects. Any change there or in `lib/` must keep `npm run smoke:functions` green, and new behavior gets a new check in `scripts/smoke-functions.mjs`.
- Keep `/assets/*` out of Functions (`scripts/pages-routes.mjs`).
- Never commit secrets, account IDs for bindings, or placeholder binding IDs. Code may read only the bindings listed in `docs/DEPLOYMENT_PIPELINE.md`.

## Git

- Never commit to `main` directly. Use a feature branch and small commits that each pass verify.
- Commit with the repository's configured identity. Do not override author or committer with `-c user.*` or `--author`.
- Never force-push or rewrite published history without the owner's explicit approval.

## Needs explicit owner approval

Production deploys, Cloudflare Pages settings, bindings or secrets, DNS and zone settings (redirect rules, WAF, bot management), changes to the AI content policy, and editing approved Sonia knowledge batches or quote banks. Prepare the change and the evidence, then ask.

## Tooling notes

- Node 22 (`.nvmrc`). Install with `npm ci`.
- Local Pages runtime: `npm run build && npx wrangler pages dev dist`.
- Stop local servers by PID or port. A `pkill -f` pattern that appears in your own command line kills your shell.
