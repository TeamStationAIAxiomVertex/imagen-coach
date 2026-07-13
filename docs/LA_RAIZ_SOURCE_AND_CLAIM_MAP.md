# La Raíz Source and Claim Map

## Purpose

This file governs the public program page at `https://raiz.coachdeimagen.com/`. It prevents program facts, Sonia's broader teaching corpus, and unsupported claims from being mixed.

## Public facts

- Program name: La Raíz del Dinero.
- Duration: 8 live sessions plus 1 bonus session.
- Facilitator: Sonia McRorey.
- Audience: adult women and men.
- Delivery: online in Spanish and semipresencial in Guadalajara.
- Current edition dates: July 14, 2026 online; July 18, 2026 semipresencial.
- Semipresencial structure: 4 in-person sessions, 4 online sessions and 1 online bonus session.
- Semipresencial venue: Casa Copal, Guadalajara.
- Maximum semipresencial group: 15 people.
- Currency: Mexican pesos (MXN).
- Online regular prices: $2,800 single payment; 2 payments of $1,500; 3 payments of $1,100.
- Online launch prices through July 11, 2026: $1,960 single payment; 2 payments of $1,050; 3 payments of $770.
- Semipresencial regular prices: $3,600 single payment; 2 payments of $1,900; 3 payments of $1,366.
- Semipresencial launch prices through July 11, 2026: $2,520 single payment; 2 payments of $1,330; 3 payments of $956.
- Semipresencial promotion from July 12 through July 15, 2026: 20% off the regular price.
- Current applicability and availability: confirmed by Sonia through WhatsApp.
- Author and facilitator: Sonia McRorey.
- Public experience statement: more than 15 years of professional experience.
- Public professional role: Vice President and VP of Education, AICI Guadalajara, 2024-2026.
- Public international formation signals: Maison Aubele (2010), Garbo Imagen (2012), Colegio de Imagen Pública (2019) and Psicología de la Imagen with Domingo Delgado (2022).
- Editorial review date for this edition: July 12, 2026.
- Approved public testimonials: Ángel, Ana Marce, Mariana, Ángeles, Linda and Loreto, using the complete wording selected by Sonia on pages 16-17 of the July 2026 program presentation.
- Approved inclusion set: 9 live sessions; exclusive WhatsApp group with weekly audios and activations; digital material with practical exercises; group accompaniment throughout; and a process addressing the relationship with money, body and energy.
- Sonia's approved explanation of the program sequence: “Cada sesión recorre un nivel energético distinto. Cada círculo abre lo que el anterior dejó expuesto. Y al final del proceso, no solo piensas diferente sobre el dinero: lo habitas diferente.”
- Google Business Profile proof verified July 12, 2026: 5.0 out of 5 from 20 public reviews for Sonia McRorey's overall professional practice.
- Program-relevant Google excerpts are limited to short passages about accompaniment, WhatsApp exercises, follow-up and abundance-related reflection. They do not establish a separate La Raíz rating.

## Governed source layers

1. `raiz/program.json` is the canonical public program record.
2. The stronger previous La Raíz deck governs the program positioning: money is treated as visible consequence, the program is not finance, and the work is on the root from which a person generates, receives and sustains value.
3. Sonia's reviewed Drive corpus supports identity, value, visibility, limits, communication, deserving and internal safety concepts.
4. The current July 2026 commercial source is the approved source for dates and pricing; those facts are normalized in `raiz/program.json` before publication.
5. Sonia's public biography and methodology routes are the verification layer for visible E-E-A-T claims. Raw private source filenames are never exposed as public proof.
6. Sonia's approved July 2026 program presentation governs the public testimonial set. Every selected testimonial must be retained in full, attributed as published and labeled as a participant's personal experience.
7. The earlier approved La Raíz program deck governs the complete `¿Qué incluye?` list. Current dates, delivery structure and prices still come from the July 2026 commercial record.
8. The July 2026 deck governs Sonia's explanation of why the program is distributed over several weeks. The explanation must be published verbatim or omitted. Agents and editors may not paraphrase, extend or invent a bridge rationale.
9. Sonia's approved Drive source on repetition, practice and curiosity may supply additional teaching language only as exact, source-identified excerpts. External research is not part of the current public La Raíz corpus and may not be converted into Sonia's voice or used to manufacture program claims.
10. Sonia's public Google Business Profile is the governed external source for the time-stamped aggregate rating and selected short review excerpts. The rating applies to Sonia's general business profile, not exclusively to La Raíz.

## Provenance modes

Every FAQ, answer card, journey item, learning passage and program-inclusion item must carry one of these explicit modes:

- `verbatim`: exact Sonia-authored language from an approved source. It may not be rewritten.
- `factual-extract`: normalized dates, prices, delivery details or inclusion facts taken from the canonical program record.
- `editorial-boundary`: legal, safety or scope language that is intentionally separate from Sonia's teaching voice.
- `editorial-metadata`: review dates, source-navigation facts or other publication metadata.
- `third-party-evidence`: short, attributed external review evidence that is never presented as Sonia's language.

Every governed item must also contain explicit `sourceIds` and a human-readable `sourceReference`. The build may not infer a source when one is absent.

## Public agent retrieval layer

- `api/knowledge/cards/index.json` discovers five ontology groups.
- `api/knowledge/cards/la-raiz.json` contains the complete governed answer-card corpus.
- `api/knowledge/cards/groups/*.json` provides narrow retrieval by topic.
- `agent/evidence.json` publishes author, credentials, public sources, review date and professional boundaries.
- `agent/route-recommendations.json` tells agents which card groups to prefer for each page section.
- `llms-full.txt` provides the same grounded facts and cards in readable Spanish Markdown.

Cloudflare AI Search can index these public documents after its website source syncs. Publishing them does not train foundation-model weights and does not guarantee ranking.

## Excluded claims

- Neuroscience percentages, universal timelines or claims that every participant's brain changes in the same way.
- Claims that myelination itself creates a new relationship with money, that curiosity removes the need for practice, or that the hippocampus is activated "completely."
- Trauma, nervous-system or mental-health treatment claims.
- Guaranteed money, income, sales or business outcomes.
- Prices, discounts or payment plans outside the dated July 2026 terms in `raiz/program.json`.
- Claims that identity is the only cause of financial outcomes.
- Testimonials or private participant details that Sonia did not select for public use.
- Rewritten, shortened or generalized versions of Sonia's approved testimonials.
- Synthetic bridge copy, editorial paraphrases or inferred explanations presented as Sonia's program rationale.
- Any answer about why La Raíz lasts several weeks that is not an exact approved Sonia passage with a governed source ID.
- Google review claims that imply a guaranteed financial, medical, fertility, therapeutic or universal outcome.
- `Review` or `AggregateRating` JSON-LD derived from self-hosted Google review excerpts. The proof remains visible and source-linked, not self-serving rich-result markup.

## Update checklist

Before each edition:

1. Update dates, venue, schedule and availability in `raiz/program.json` and the visible page.
2. Confirm WhatsApp wording.
3. Re-run `npm run build:raiz` and `npm run validate:raiz`.
4. Check JSON-LD course instances and the social card.
5. Remove an expired edition date rather than presenting it as current.
6. Update the editorial review date only after Sonia's public facts and commercial terms have been checked.
7. Keep every answer card mapped to a public evidence source or to the canonical program record.
8. Confirm that every testimonial selected by Sonia remains present, complete and unchanged in `raiz/program.json`, visible HTML and the public evidence document.
9. Confirm that all five approved inclusion items remain in canonical data, visible HTML and the public agent evidence.
10. Confirm that every learning-design passage exactly matches an approved Sonia source, carries its governed source ID and contains no synthetic bridge copy.
11. Re-verify the Google rating and review count before changing their date-stamped values; preserve the general-business scope note and source link.
12. Keep Google review excerpts below 25 words, verbatim, attributable and free of implied guarantees.
