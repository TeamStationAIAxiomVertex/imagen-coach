# Sonia McRorey Spanish Knowledge API Expansion Plan

## Objective

Build a large, static, AI-readable Spanish question-and-answer corpus for `coachdeimagen.com` that helps agents answer real user questions about coaching de imagen, presencia ejecutiva, imagen profesional, imagen empresarial, seguridad profesional, liderazgo visible, colorimetría, mujeres profesionales, empresarios, directivos, México, LATAM and Hispanic markets.

This is not a generic FAQ. It is a governed knowledge API built from Sonia McRorey's source corpus, public pages, reviewed blog archive, reviewed Drive signals and route-level ontology.

## Public Endpoints

- `/api/knowledge/questions.json`
- `/api/knowledge/questions.md`
- `/api/knowledge/cards/index.json`
- `/api/knowledge/cards/core-image-coaching.json`
- `/api/knowledge/cards/executive-presence.json`
- `/api/knowledge/cards/entrepreneurs.json`
- `/api/knowledge/cards/corporate.json`
- `/api/knowledge/cards/women-professionals.json`
- `/api/knowledge/cards/appearance.json`
- `/api/knowledge/cards/psychology.json`
- `/api/knowledge/cards/country-city-pages.json`
- `/api/knowledge/internal-link-mesh.json`

Discovery:

- `/knowledge-sitemap.xml` advertises the public question corpus, grouped card endpoints and internal-link mesh to Cloudflare AI Search and other compliant crawlers.
- `robots.txt` explicitly allows `Cloudflare-AI-Search` and references the knowledge sitemap.

## Card Contract

Each card must include:

- One primary Spanish question.
- One concise authoritative Spanish answer.
- Layer and ontology node.
- Buyer intent.
- Related routes.
- Related questions.
- Anchor phrases.
- Entities.
- Evidence topics.
- Optional source signals.
- Conversion bridge.
- Guardrails.

## Target Scale

Current state after the July 10 governed batch:

- Built-in governed foundation cards: 42.
- Repository-approved cards: 507.
- Validated public Knowledge API: 549 cards across eight retrieval layers.
- Route-level recommendation coverage: 115 of 115 canonical routes.
- Source inventory represented by the build: 553 blog posts and 78 reviewed teaching signals.

Current public layer distribution:

- Core Image Coaching: 174.
- Executive Presence: 103.
- Entrepreneurs and personal brands: 20.
- Corporate, workshops and teams: 51.
- Women professionals and leadership: 19.
- Appearance, color and wardrobe: 35.
- Security, identity and self-perception: 29.
- Country, city and Hispanic markets: 118.

Next card priority is depth, not raw volume. The four underweighted layers are entrepreneurs, women professionals, appearance practice, and security/identity. New GEO cards must answer a distinct local or intercultural buyer question; country-name substitution is not sufficient.

Target 2,000 to 3,000 cards over multiple controlled batches:

- Core Image Coaching: 150 to 200 cards.
- Executive Presence: 150 cards.
- Entrepreneurs and marcas personales: 150 cards.
- Corporate, talleres and equipos: 150 cards.
- Women professionals and leadership: 200 cards.
- Appearance, color, guardarropa, style and photography: 250 cards.
- Psychology, autoconcepto, seguridad, visibility and positioning: 200 cards.
- Country, city and Hispanic market pages: 500+ cards.
- Articles, comparisons, methodology and glossary: remaining supporting cards.

## Batch Rules

File pipeline:

- `content/knowledge/queue/`: generated candidates awaiting review.
- `content/knowledge/approved/`: source-of-truth files loaded into public API at build time.
- `content/knowledge/rejected/`: rejected cards retained for audit and duplicate prevention.
- `content/knowledge/reports/`: daily batch reports.

1. Add cards in batches of 25 to 75.
2. Every card must map to a real page route or planned canonical route.
3. Every answer must be grounded in Sonia's corpus, not generic marketing language.
4. No answer may invent pricing, guarantees, agenda, credentials, client results or email-routing status.
5. No card may expose internal strategy, private Drive content, bank/payment data, old contact data, old pricing or private logistics.
6. Do not create doorway-style GEO cards. Local answers must include modality, context, service fit and truthful boundaries.
7. Keep answers concise. Long teaching belongs in articles, glossary, methodology pages or source-corpus addenda.

## Expansion Sequence

1. Strengthen direct commercial cards first:
   - coach de imagen
   - asesora de imagen
   - asesoría de imagen
   - presencia ejecutiva
   - imagen profesional
   - imagen empresarial

2. Build high-intent psychological cards:
   - inseguridad profesional
   - no me siento suficiente
   - miedo a ser visible
   - síndrome del impostor
   - cómo proyectar seguridad sin fingir
   - mi imagen ya no refleja quién soy

3. Add audience cards:
   - empresarias
   - directivos
   - profesionistas
   - mujeres líderes
   - equipos comerciales
   - conferencistas
   - marcas personales
   - latinas e hispanas profesionales

4. Add GEO cards:
   - México
   - Guadalajara
   - CDMX
   - Monterrey
   - Querétaro
   - Colombia
   - Chile
   - Perú
   - Argentina
   - Miami hispanos
   - Houston hispanos
   - Dallas hispanos
   - New York hispanos

5. Add visual practice cards:
   - colorimetría
   - guardarropa
   - cabello
   - accesorios
   - maquillaje ejecutivo
   - fotografía profesional
   - entrevistas
   - juntas importantes

## Validation

Every batch must pass:

```bash
npm run build
npm run validate
```

In addition, every release must pass:

```bash
npm run audit:intelligence
```

Editorial validation must reject:

- repeated country-swap questions or answers;
- unsupported scientific, medical, psychological or financial claims;
- local-presence claims where Sonia only offers online or selected corporate travel;
- generic answers that do not identify a decision, context or service route;
- raw Drive filenames, private source details or material from another project;
- cards without a canonical route recommendation.

Recommended spot checks:

```bash
node -e "const q=require('./dist/api/knowledge/questions.json'); console.log(q.totals, q.layers.map(g=>[g.id,g.cardCount]))"
# Run the private project-bleed scan from governance notes before release.
```

## Non-Bleed Rule

The architecture can reuse engineering patterns that have worked elsewhere, but the content, language, examples, entities, buyer psychology, prompts, schemas and routes must remain Sonia McRorey and Coach De Imagen only.
