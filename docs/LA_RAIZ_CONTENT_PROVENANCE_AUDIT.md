# La Raíz Content Provenance Audit

## Audit objective

This audit separates Sonia McRorey's authored teaching from program logistics, editorial safeguards and third-party evidence. It applies to the visible La Raíz page, FAQ schema, public answer cards, LLM documents and Cloudflare-facing knowledge artifacts.

## Approved source boundary

- The approved July 2026 La Raíz presentation governs the program definition, journey, dates, pricing, testimonials, inclusion facts and Sonia's explanation of the sequence.
- Sonia's approved Drive documents govern exact excerpts about identity, visibility, repetition, curiosity, practice and professional authority.
- Sonia's public biography governs credentials and AICI statements.
- The Google Business Profile governs only the date-stamped aggregate rating and short attributed review excerpts.
- Legal, therapeutic, financial and guarantee boundaries are editorial safeguards. They are not presented as Sonia-authored teaching.

## Audited canonical collections

- 15 primary visible teaching passages: `verbatim` Sonia language.
- 9 journey items: `verbatim` Sonia language.
- 3 learning principles: `verbatim` Sonia language.
- 12 FAQs: 6 `verbatim`, 4 `factual-extract`, 2 `editorial-boundary`.
- 39 answer cards: 23 `verbatim`, 12 `factual-extract`, 1 `editorial-boundary`, 1 `editorial-metadata`, 2 `third-party-evidence`.
- 5 inclusion items: `factual-extract` from the approved program inclusion set.

## Corrections made

- Removed the invented explanation about spaced practice, returning to a topic, trying a response and reviewing what happened.
- Restored Sonia's exact explanation: “Cada sesión recorre un nivel energético distinto. Cada círculo abre lo que el anterior dejó expuesto. Y al final del proceso, no solo piensas diferente sobre el dinero: lo habitas diferente.”
- Removed the invented Zoom/practice bridge from the inclusion section.
- Replaced the duplicated hand-written FAQ markup with generated markup from the canonical sourced FAQ record.
- Removed answer-card source fallbacks. Missing provenance now stops the build instead of silently assigning a source.
- Added publication mode and source reference to public Markdown answer-card artifacts.

## Build enforcement

`npm run validate:raiz` must fail when:

- a governed item lacks `contentMode`, `sourceIds` or `sourceReference`;
- a source ID is not in the public source registry;
- a journey answer card diverges from its canonical Sonia passage;
- visible FAQs diverge from canonical FAQ data;
- generated cards lose provenance metadata;
- prohibited synthetic bridge phrases reappear.

## Editorial rule

If an approved Sonia passage does not answer a question, omit the teaching claim or ask Sonia for source language. Do not create a smoother explanation and attribute it to the program.
