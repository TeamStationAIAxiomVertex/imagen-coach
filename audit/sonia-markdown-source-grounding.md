# Sonia Markdown Source Grounding Audit

Date: 2026-07-14

## Scope

This audit covers the machine-readable Markdown emitted for every public route on `coachdeimagen.com`. It does not change the visible HTML, CSS, layout, navigation, pricing, forms, or route architecture.

## Source policy

Attributed Sonia McRorey language is limited to:

1. Quotations already validated against `drive-quote-bank.json` and `quote-bank.json` through `teaching-route-map.json`.
2. Verbatim excerpts fetched from Sonia's connected Google Drive corpus and recorded in `verbatim-route-excerpts.json` with Drive file ID and source revision time.

The build rejects a teaching quotation when its wording differs from its source snippet after whitespace, accent, and terminal-punctuation normalization.

## Drive sources verified for this slice

| Source ID | Drive file ID | Source revision |
| --- | --- | --- |
| `identity-visibility-abundance-2026` | `1SnVaIsP7R2itpmuAyIjeR8oUD6cvbnBN` | `2026-07-09T21:07:04.000Z` |
| `professional-image-context-2026` | `1nez8f_tSVseDkjKwiv-V09E96OIFFgls` | `2026-06-12T15:32:52.000Z` |
| `color-image-science-2026` | `1gQ9j9D8EKkn_T-Gra_5-I42IefPycCfM` | `2026-06-12T15:27:05.000Z` |

## Exclusions

The source-locked Markdown layer excludes:

- Generated Q&A card copy as evidence of Sonia's own wording.
- Editorial module titles, public notes, tips, and summaries as attributed quotations.
- Rough transcripts that have not been reviewed and approved.
- Material from unrelated companies or projects.
- Inferred neuroscience, financial, therapeutic, or outcome claims.

## Build controls

- Every public route must emit a `Palabras de Sonia McRorey` section.
- Every attributed line must exactly match the approved excerpt allowlist after normalization.
- Every route must appear in `agent/sonia-verbatim-route-evidence.json` with at least one approved excerpt.
- The public evidence map must not contain cross-project terminology.
- The former generic static-page and comparison filler paragraphs are prohibited.
- A missing, duplicate, unattributed, or untraceable excerpt fails validation.

## Verified result

- Public routes checked: 115
- Routes with source-locked Sonia excerpts: 115
- Unique approved excerpts used: 38
- Attributed excerpt placements: 345
- Build: passed
- Full validation: passed

## Operational rule

Future additions must first enter a reviewed source bank with provenance. Route matching may select among approved excerpts, but it may not rewrite, summarize, combine, or extend Sonia's words and present the result as a quotation.
