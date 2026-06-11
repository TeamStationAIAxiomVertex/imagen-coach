# Sonia Daily Engineering Meta Agent

## Purpose

Run a controlled daily improvement loop for `coachdeimagen.com` without drifting from Sonia McRorey's real category, real voice, or real source material.

This loop exists to strengthen:

- GEO authority
- AI retrieval readiness
- semantic clarity
- internal-link density
- schema completeness
- audience fit
- media relevance
- crawl-visible machine-readable artifacts

It must not turn the site into:

- TeamStation content
- generic SEO sludge
- auto-generated doorway pages
- uncontrolled UI churn
- unreviewed infrastructure changes

## Sonia-Only Source Contract

The daily loop may use process lessons from other projects, but it may only use Sonia-owned content, routes, language, and ontology when producing work in this repository.

Required source stack:

1. `AGENTS.md`
2. `wiki.llm`
3. `docs/GEO_OPERATING_SYSTEM.md`
4. `docs/IMPLEMENTATION_ROADMAP.md`
5. `docs/PAGE_SIGNAL_MAP.md`
6. `docs/SONIA_DRIVE_KNOWLEDGEBASE.md`
7. `docs/SONIA_TEACHING_ROUTE_MAP.md`
8. `content/blog/soniamcrorey-blog.json`
9. `content/sonia-knowledge/quote-bank.json`
10. `content/sonia-knowledge/drive-source-inventory.json`
11. `content/sonia-knowledge/drive-quote-bank.json`
12. `content/sonia-knowledge/teaching-route-map.json`
13. `content/strategy/sonia-daily-meta-agent-queue.json`
14. `audit/*.md`

Hard rule:

- Never import TeamStation buyer language, route naming, prompt text, JSON artifacts, ontology terms, or content examples into Sonia's site.
- Reuse operating discipline only.

## Daily Loop

Each run must follow this order.

### 1. Preflight

- Read `AGENTS.md`.
- Check `git status --short`.
- If the repo is dirty, preserve unrelated changes and work only in clearly bounded files, or stop and report if the slice would collide.
- Inspect the current queue file and pick the highest-priority unblocked slice.

### 2. Evidence Review

Inspect only the sources relevant to the chosen slice:

- route copy
- route metadata
- route schema
- existing images
- current internal links
- Sonia quote banks
- Sonia Drive source inventory
- page signal maps
- audit documents

If live analytics or external data are unavailable, say so and use repo-visible evidence only.

### 3. Single-Slice Selection

Choose exactly one controlled output per run.

Allowed output types:

- one existing route enhancement
- one FAQ and schema enhancement pack
- one internal-link mesh refinement
- one methodology or definition page
- one audience or GEO page enhancement
- one image relevance correction set
- one comparison-page clarity improvement
- one recommendation-only report when implementation would be risky

Do not mix multiple large initiatives in one run.

### 4. Execute Conservatively

Make the smallest correct Sonia-specific change.

Allowed:

- source-grounded content addendums
- Sonia teaching-module route-map updates
- internal-link improvements
- metadata or schema improvements supported by visible content
- image swaps using approved repo assets
- FAQ improvements
- ontology-aligned audience clarification

Not allowed:

- Cloudflare settings changes
- DNS changes
- Workers settings changes
- Pages settings changes
- secret handling changes
- dependency additions
- lockfile churn
- auto-publishing
- auto-deploying
- TeamStation asset or content reuse
- broad redesigns

### 5. Verify

Run the narrowest relevant checks first.

Default validation order:

1. route-level or artifact-level inspection
2. `npm run build`
3. `npm run validate`

If a slice only changes docs or queue artifacts, explain why build validation is not required.

### 6. Report

Every run must report:

- selected slice
- evidence inspected
- unavailable evidence
- files changed
- validation run
- authority impact
- remaining risks
- recommended next slice

## Safety Defaults

The automation is draft-safe by default.

It may change source files in the workspace when the slice is low-risk and bounded, but it must not:

- commit
- push
- deploy
- publish
- mutate Cloudflare configuration

If a run encounters ambiguity around canonical positioning, source ownership, or route intent, it must stop and report instead of improvising.

## Success Criteria

The loop is successful when repeated runs compound Sonia's authority without semantic drift:

- stronger route specificity
- better Sonia-source grounding
- better link mesh
- better FAQ coverage
- better schema coverage
- better image-to-intent matching
- better AI retrieval surfaces
- no contamination from non-Sonia projects

## Current Working Principle

The goal is not "more pages" by default.

The goal is:

`better Sonia-specific authority per page, per audience, per route cluster, and per machine-readable artifact.`
