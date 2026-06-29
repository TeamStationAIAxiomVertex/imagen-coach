# Sonia Cloudflare MCP Architecture

## Purpose

Define the Sonia-only knowledge architecture for `coachdeimagen.com` so Cloudflare Worker, MCP, agent files and retrieval surfaces can ground answers in Sonia McRorey's real corpus without mixing in external company data.

This is a retrieval and grounding system.

It is not model-weight training.

## Core Principle

The system must separate:

1. Sonia-owned source corpus
2. sanitized public evidence
3. route-ready teaching modules
4. machine-readable discovery surfaces
5. execution governance

That separation is what prevents contamination, hallucinated authority and TeamStation bleed.

## Sonia-Only Data Boundary

Allowed:

- Sonia website content
- Sonia blog archive
- Sonia Drive documents
- Sonia Drive presentations
- Sonia Drive transcripts
- Sonia-approved visual assets
- Sonia-only route metadata
- Sonia-only schema and ontology files

Forbidden:

- TeamStation copy
- TeamStation ontologies
- TeamStation client language
- TeamStation route structures copied as content
- TeamStation prompts pasted into Sonia artifacts
- any third-party company data treated as Sonia truth

Process lessons can transfer.
Content cannot.

## Architecture Layers

### Layer 1: Raw Sonia Corpus

Sources:

- `content/blog/soniamcrorey-blog.json`
- `content/sonia-knowledge/drive-source-inventory.json`
- Google Drive shared folder `1ysBIHhmGONy8-vECe7AKk18JQVE2lxlW`
- supporting reviewed Drive library `132lIVQigNgRpHfsSsuoZMewn8AwvgmhR`

Characteristics:

- source rich
- not fully public-safe
- mixed sensitivity
- not route-ready

### Layer 2: Reviewed Extraction Layer

Sources:

- `content/sonia-knowledge/quote-bank.json`
- `content/sonia-knowledge/drive-quote-bank.json`

Characteristics:

- short reviewed evidence
- public-safe candidate phrasing
- traceable snippets
- still not page-placement by default

### Layer 3: Route-Mapped Teaching Layer

Source:

- `content/sonia-knowledge/teaching-route-map.json`

Characteristics:

- page specific
- intent specific
- build validated
- public-safe

This is the only layer that should inject Sonia teaching modules into pages automatically.

### Layer 4: Cloudflare Retrieval Surfaces

Public machine-readable outputs:

- `llms.txt`
- `llms-full.txt`
- `openapi.json`
- `agent/*.json`
- `semantic-index.json`
- `glossary` and authority HTML routes

Private or semi-private runtime surfaces to add through Worker/MCP:

- Sonia corpus manifest
- route evidence lookup
- glossary lookup
- quote evidence lookup
- corpus governance lookup
- source inventory lookup

## Recommended Cloudflare Runtime Design

### Worker Role

Use one Cloudflare Worker as the Sonia knowledge gateway.

Responsibilities:

- expose MCP server metadata
- expose Sonia-safe retrieval tools
- negotiate markdown for agent requests where relevant
- serve or proxy sanitized corpus artifacts
- protect restricted source data from direct public leakage

### Storage Roles

Use storage by responsibility:

- `R2`: sanitized corpus snapshots, markdown derivatives, public-safe route evidence payloads
- `KV`: small manifests, corpus version IDs, route-to-source indexes, sync state
- `Vectorize` optional: embeddings for semantic retrieval across Sonia-only extracts
- `D1` optional: structured indexing if quote/source/route relationships become too large for flat JSON manifests

Do not use raw Google Drive files as the direct public response layer.
Normalize first.

## MCP Server Shape

Recommended discovery endpoints:

- `/.well-known/mcp/server-card.json`
- `/.well-known/mcp.json`
- `/.well-known/agent-skills/index.json`
- `/.well-known/api-catalog`

Recommended Worker/MCP tools:

1. `search_sonia_knowledge`
2. `get_route_evidence`
3. `get_quote_candidates`
4. `get_glossary_term`
5. `list_source_clusters`
6. `get_governance_rules`
7. `get_geo_context`
8. `get_service_support`

### Tool contract: `search_sonia_knowledge`

Inputs:

- `query`
- `cluster`
- `route`
- `audience`
- `geo`
- `source_type`

Output:

- ranked Sonia-only snippets
- source titles
- cluster labels
- confidence note
- public-safety flag

### Tool contract: `get_route_evidence`

Inputs:

- `route`

Output:

- related Sonia sources
- reviewed quotes already approved for route use
- pending corpus items worth extracting next

### Tool contract: `get_governance_rules`

Inputs:

- optional `surface` or `task`

Output:

- anti-bleed policy
- sensitivity rules
- what may be quoted
- what must remain private

## Daily Sync Pattern

Google Drive is the living corpus.
The repo is the normalized and governed mirror.
Cloudflare is the retrieval surface.

Daily sync sequence:

1. read active Drive folder metadata
2. compare file additions, removals and modified timestamps
3. update `drive-source-inventory.json`
4. classify new files into Sonia clusters
5. flag restricted files
6. extract candidate Sonia-only snippets into a draft review artifact
7. promote approved snippets into quote banks
8. promote approved page-specific teachings into `teaching-route-map.json`
9. rebuild public artifacts
10. validate before deploy

## Why This Wins

This architecture makes Sonia stronger in three ways:

1. Better grounding:
   answers can be tied back to Sonia's real language and materials

2. Better governance:
   private or off-category material does not leak into public pages or agent surfaces

3. Better retrieval:
   Cloudflare and AI agents can find structured definitions, evidence and route support without guessing

## Non-Goals

This system is not for:

- auto-publishing unreviewed Drive content
- exposing private docs directly
- replacing the website with a chatbot
- using TeamStation memory as Sonia memory
- creating synthetic Sonia doctrine not found in her corpus
