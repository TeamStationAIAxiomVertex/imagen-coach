# Sonia Control Matrix

This is the executable control map for `coachdeimagen.com`. It keeps the daily improvement loop grounded in Sonia McRorey's reviewed material and prevents public drift.

## Controls

| Control | What it protects | Enforcement |
| --- | --- | --- |
| Source boundary | Sonia-only corpus, routes and ontology | `AGENTS.md`, corpus governance, ontology audit |
| Provenance | Public teaching and answer cards remain traceable | `npm run audit:knowledge`, build provenance checks |
| Ontology integrity | Pillars, audiences, geographies and graph edges stay connected | `npm run audit:sonia-controls` |
| Public anti-bleed | Other-company terms do not enter generated public files | `npm run audit:sonia-controls` |
| Agent surfaces | Required static indexes remain present | `npm run audit:sonia-controls`, `npm run validate` |
| Draft-safe loop | Daily work cannot commit, deploy, publish or change Cloudflare settings automatically | `docs/SONIA_DAILY_ENGINEERING_META_AGENT.md` |
| Route/build integrity | Static routes, assets and schema remain valid | `npm run build`, `npm run validate`, `npm run validate:raiz` |

## ICE gate used for this repository

ICE is the short pre-edit gate:

1. **Intent:** What Sonia-specific outcome is being improved?
2. **Context:** Which approved Sonia source, route and audience support it?
3. **Evidence:** What validator or build output will prove it is safe?

If any part is missing, the loop produces a report or stops. It does not invent copy, sources, claims or route intent.

## Harness boundary

The local harness can validate repository artifacts. It cannot honestly claim that a live Cloudflare dashboard, shared Drive/MCP server, DNS zone, or deployed Worker was checked unless those systems are connected and the check returns evidence. A local pass is therefore a repository-readiness result, not a production certification.

## Required daily control order

```text
Intent -> allowed Sonia sources -> evidence review -> ICE gate -> one bounded slice
-> provenance audit -> build/route validation -> anti-bleed audit -> report
```

No daily run may silently turn a recommendation into a deployment.
