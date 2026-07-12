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
- Editorial review date for this edition: July 11, 2026.

## Governed source layers

1. `raiz/program.json` is the canonical public program record.
2. The stronger previous La Raíz deck governs the program positioning: money is treated as visible consequence, the program is not finance, and the work is on the root from which a person generates, receives and sustains value.
3. Sonia's reviewed Drive corpus supports identity, value, visibility, limits, communication, deserving and internal safety concepts.
4. The current July 2026 commercial source is the approved source for dates and pricing; those facts are normalized in `raiz/program.json` before publication.
5. Sonia's public biography and methodology routes are the verification layer for visible E-E-A-T claims. Raw private source filenames are never exposed as public proof.

## Public agent retrieval layer

- `api/knowledge/cards/index.json` discovers five ontology groups.
- `api/knowledge/cards/la-raiz.json` contains the complete governed answer-card corpus.
- `api/knowledge/cards/groups/*.json` provides narrow retrieval by topic.
- `agent/evidence.json` publishes author, credentials, public sources, review date and professional boundaries.
- `agent/route-recommendations.json` tells agents which card groups to prefer for each page section.
- `llms-full.txt` provides the same grounded facts and cards in readable Spanish Markdown.

Cloudflare AI Search can index these public documents after its website source syncs. Publishing them does not train foundation-model weights and does not guarantee ranking.

## Excluded claims

- Neuroscience percentages or universal claims.
- Trauma, nervous-system or mental-health treatment claims.
- Guaranteed money, income, sales or business outcomes.
- Prices, discounts or payment plans outside the dated July 2026 terms in `raiz/program.json`.
- Claims that identity is the only cause of financial outcomes.
- Unverified testimonials or private participant details.

## Update checklist

Before each edition:

1. Update dates, venue, schedule and availability in `raiz/program.json` and the visible page.
2. Confirm WhatsApp wording.
3. Re-run `npm run build:raiz` and `npm run validate:raiz`.
4. Check JSON-LD course instances and the social card.
5. Remove an expired edition date rather than presenting it as current.
6. Update the editorial review date only after Sonia's public facts and commercial terms have been checked.
7. Keep every answer card mapped to a public evidence source or to the canonical program record.
