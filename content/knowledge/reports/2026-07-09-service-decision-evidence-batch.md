# 2026-07-09 Service Decision and Evidence Knowledge Batch

Status: approved for build.

Cards generated: 63 candidates.
Cards approved: 63.

Approval state:

- Candidate file: `content/knowledge/queue/2026-07-09-service-decision-evidence-batch-candidates.json`
- Approved file: `content/knowledge/approved/2026-07-09-service-decision-evidence-batch.json`
- Candidates promoted after ID, route, source-boundary, commercial-claim, medical-claim and duplicate review.

Primary coverage:

- Service decision: diagnosis, asesoría vs coaching, individual vs corporate routes, contact intake and FAQ boundaries.
- Appearance practice: guardarropa, colorimetry, proportions, rostro, hair, makeup, accessories and professional context.
- Executive presence: meetings, video calls, silence, voice, space, negotiation, difficult conversations, interviews and ascension contexts.
- Business positioning: LinkedIn, networking, independent consultants, founders, directors, women leaders and value communication without financial promises.
- Corporate layer: workshops, commercial teams, leaders, vocería, events and remote-team presence.
- Category education: styling, consulting, motivation, superficial image and LATAM category evolution.
- GEO and governance: Mexico, CDMX, Monterrey, Bogota, Miami Hispanos and Sonia-only corpus rules.

Validation results before build:

- JSON generation and 63-card count audit: passed.
- Existing approved ID collision audit: passed.
- Route relevance audit against current dist route inventory: passed; 158 route references checked.
- Affirmative forbidden claims, medical drift and external-company bleed scan: passed.

Build validation results:

- `npm run build`: passed; built 115 routes into `dist`.
- `npm run validate`: passed; validated 115 routes and mapped assets.

Generated knowledge layer counts after build:

- Public knowledge API count after build: 499 cards.
- Coaching de Imagen: 163.
- Presencia Ejecutiva: 94.
- Empresarias, empresarios y marca personal: 20.
- Empresas y equipos: 47.
- Mujeres profesionales: 18.
- Imagen visible, color y guardarropa: 32.
- Seguridad, identidad y autopercepción: 25.
- México, LATAM y mercados hispanos: 100.

Guardrail notes:

- No prices, guarantees, dates, availability, credentials, email routing status or medical claims introduced.
- No external-company material or non-Sonia corpus material used.
- GEO cards use market context and conservative scope language to avoid doorway-style duplication.
