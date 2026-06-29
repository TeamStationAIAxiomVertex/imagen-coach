# Sonia Cloudflare Corpus Governance

## Objective

Protect Sonia McRorey's corpus integrity while allowing Cloudflare retrieval, MCP tools and recurring agent loops to use her material safely.

The governing rule is simple:

Sonia corpus in.
Sonia artifacts out.
No external company memory crossing that boundary.

## Identity Boundary

This repository is for:

- Sonia McRorey
- `coachdeimagen.com`
- coaching de imagen
- presencia profesional
- posicionamiento profesional
- seguridad profesional
- liderazgo visible

It is not for:

- TeamStation
- Nebula
- Axiom Cortex
- DEOS
- another client
- a generalized coaching knowledge base

## Allowed Knowledge Reuse

Allowed from other projects:

- engineering process discipline
- validation order
- corpus-governance patterns
- MCP surface design patterns
- daily-loop design patterns

Not allowed from other projects:

- ontology terms
- company names
- route inventories
- buyer-language banks
- schema descriptions
- example content
- prompts treated as Sonia truth
- commercial claims

## Corpus Classes

### Class A: Public-safe and route-ready after review

Examples:

- short Sonia-authored definitions
- short teaching lines
- service differentiation criteria
- methodology statements
- glossary-ready concepts

Allowed outputs:

- public pages
- FAQs
- schema descriptions
- llms files
- agent surfaces

### Class B: Public-safe only after compression and reframing

Examples:

- transcripts
- workshop exercises
- long narrative passages
- promotional PDFs

Allowed outputs:

- summarized route support
- short FAQ evidence
- definition notes
- internal draft recommendation artifacts

### Class C: Restricted operational material

Examples:

- payment instructions
- banking details
- private logistics
- stale offer mechanics
- obsolete contact data

Allowed outputs:

- none in public artifacts
- exclusion flags in inventories only

### Class D: Off-category or high-drift material

Examples:

- chakra framing
- abundance-heavy spiritual framing
- social microcopy not suited for executive pages

Allowed outputs:

- private review only
- optional supporting interpretation when explicitly remapped to Sonia's executive category

## Public Extraction Rules

Before a Sonia source can become public page support, it must satisfy all of the following:

1. It is traceable to a Sonia-owned source.
2. It does not expose restricted operational data.
3. It reinforces Sonia's public category.
4. It matches the route's real search intent.
5. It is short enough to keep pages readable.
6. It does not create semantic drift.

If any condition fails, it stays out.

## Anti-Bleed Controls

### File-level control

Do not add TeamStation or non-Sonia artifacts into:

- `content/sonia-knowledge/`
- `docs/SONIA_*`
- `agent/*.json`
- `llms*.txt`
- Sonia route copy

### Language-level control

Do not introduce:

- TeamStation product language
- SaaS or ops jargon unrelated to coaching de imagen
- AI/platform buzzwords into public Sonia pages

### Ontology-level control

Sonia ontology centers on:

- imagen
- presencia
- percepción
- liderazgo
- posicionamiento
- seguridad interna
- resultados profesionales

Anything that weakens that graph is suspect.

## Review Gates

### No review required

- inventory timestamp refreshes
- new file classification
- doc-only governance updates

### Review required before public use

- new quotes from the active shared corpus
- new FAQ answers based on transcripts
- new definitions derived from workshop material
- new glossary terms derived from complex or secondary documents

### Explicit stop conditions

Stop and report if:

- a source appears to contain mixed-company content
- a file has unclear ownership
- a file is mostly pricing or payment operations
- the language would reposition Sonia away from coaching de imagen

## Daily Sync Governance

Every daily loop must record:

- source folder checked
- changed files
- new restricted files
- new quote candidates
- promoted public-safe snippets
- rejected snippets and why

If a daily run cannot preserve provenance, it should not promote content.

## Cloudflare Publishing Rule

Cloudflare may publish:

- sanitized artifacts
- approved agent surfaces
- route-ready evidence
- reviewed glossary and FAQ support

Cloudflare may not publish:

- raw Drive file content dumps
- restricted financial or operational data
- unreviewed transcript passages
- artifacts contaminated by another company's corpus

## Recommended Next Controlled Slice

After this governance layer, the next safe slice is:

`extract reviewed quote candidates from the active shared corpus into a new Sonia-only draft review file without changing public pages yet.`
