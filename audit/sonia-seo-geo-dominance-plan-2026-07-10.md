# Sonia McRorey SEO, GEO and Answer Authority Plan

Generated: 2026-07-10

## Executive finding

`coachdeimagen.com` already has a technically strong static authority layer: 115 canonical routes, valid metadata and schema, complete route recommendations, AI-readable discovery endpoints and an approved Spanish answer corpus. The next gain will not come from adding generic location pages or more unstructured blog copy. It will come from making Sonia the clearest source for high-intent Spanish questions at the intersection of image, professional identity, nonverbal presence, internal security and positioning.

Sonia's defensible category is:

> Coaching de Imagen, Presencia y Posicionamiento Profesional that connects visible image, professional identity, nonverbal communication, internal security and decisions.

This territory is broader than color or wardrobe, more concrete than generic confidence coaching, and more human than rigid executive-image consulting.

## Verified baseline

- Canonical routes: 115.
- Internal intelligence score: 97/100 average.
- Routes at 90 or higher: 112.
- Duplicate titles, descriptions and H1s: 0.
- High, medium and low crawl-audit actions: 0.
- Local validated answer cards: 549.
- Live answer cards before this release: 499.
- Route recommendation coverage: 115 of 115.
- Source inputs represented by the build: 553 blog posts and 78 reviewed teaching signals.
- Cloudflare AI Search: 114 indexed documents, 0 errors and 1 outdated document before this release.
- DNSSEC: active.
- DNS-AID HTTPS records: still absent for `_index._agents` and `_mcp._agents`.
- Google/Bing-style web search currently returns the homepage, GEO pages, intent pages and articles from `coachdeimagen.com`; recent crawls were visible from one day to four weeks old.

## Competitive intent map

### Common competitor ownership

- Style, elegance and confidence for women.
- Colorimetry and executive image.
- Personal shopping and visible appearance.
- Executive authority through physical image and body language.
- Generic leadership or confidence coaching.

Representative public competitors reviewed:

- Lucie André: leadership for women plus holistic style and elegance.
- MIMAGEN: personal image, authenticity and online delivery.
- Tu Imagen es Poder: executive authority, physical presence and nonverbal communication.
- Clau García: colorimetry and executive image.
- A.M. Studio: C-level image, authority and high-impact decision environments.

### Sonia's unique intent

Sonia should own the questions competitors split across separate offers:

1. Why does my image no longer represent my current professional identity?
2. How do I project authority without acting rigid or becoming a character?
3. Why do I still minimize myself despite experience and preparation?
4. How do visible image, body language and internal security affect positioning?
5. Which route do I need: image consulting, presence coaching, corporate work or security and positioning?
6. How do I adapt professional presence across Spanish-speaking, bilingual and multicultural markets?

## Source-backed authority

The Drive corpus confirms five original Sonia doctrines that should organize future answers:

1. Results reflect the professional identity from which decisions are made.
2. Professional image is not a uniform; it is a contextual strategic tool.
3. Authority and credibility do not look identical across industries and personalities.
4. Nonverbal presence must be interpreted through context and congruence, not universal gestures.
5. Visible image supports identity and positioning; it does not replace internal structure.

Source classes used in this audit:

- Primary: Sonia's July identity documents and reviewed Drive corpus.
- Internal source-backed: governed service architecture, category definition, axioms and nonverbal corpus documents.
- Public source-backed: live competitor pages and live search results.
- Telemetry-backed: Lighthouse runs and live HTTP response measurements.

## E-E-A-T and source provenance plan

### Experience

- Keep first-person teachings tied to Sonia and route them through the governed teaching map.
- Add compact, verifiable case-context cards when testimonial permission and source evidence exist.
- Explain delivery modes precisely: Guadalajara in person, online for Spanish-speaking markets, selected corporate travel.

### Expertise

- Expand answer cards from Sonia's original documents before creating generic search copy.
- Give image, color, wardrobe, identity and nonverbal answers a clear professional context and practical decision.
- Avoid unsupported neuroscience, therapeutic diagnosis and guaranteed outcome language.

### Authority

- Keep Sonia's Person entity consistent across schema, articles, author pages, answer cards and agent files.
- Connect every major doctrine to one canonical pillar, one service route and supporting articles.
- Use comparison pages to define category boundaries without attacking named competitors.

### Trust

- Preserve canonical URLs, author attribution, dates, contact boundaries and service scope.
- Keep source provenance in internal governance; publish only sanitized, defensible answers.
- Continue rejecting invented prices, availability, credentials, client results and local-office claims.

## Spanish semantic publishing optimization

Every answer should use natural Spanish first, then map to ontology fields. Preferred answer pattern:

1. Direct answer in the first sentence.
2. Context or condition in the second sentence.
3. Practical distinction or decision.
4. Relevant canonical route.

Avoid literal keyword variants that sound generated. A country name must change the context, not only the noun. Use regional terminology only where supported by real buyer language or a clear intercultural need.

## Answer-card expansion

Current underweighted layers and next controlled targets:

| Layer | Current | Next target | Priority topics |
| --- | ---: | ---: | --- |
| Entrepreneurs | 20 | 60 | pricing confidence, client meetings, founder visibility, speaking, personal brand, sales presence |
| Women professionals | 19 | 60 | promotions, returning to work, authority without rigidity, visibility, leadership transitions |
| Appearance | 35 | 85 | color, wardrobe systems, face, hair, accessories, photography, travel, video presence |
| Security and identity | 29 | 75 | professional identity, impostor patterns, visibility, self-minimization, decisions, growth capacity |
| Corporate | 51 | 80 | commercial teams, client experience, leadership cohorts, workshops, intercultural teams |
| GEO | 118 | 160 | Spain, Central America, Caribbean, diaspora, bilingual markets and selected global contexts |

Release batches: 25 to 50 cards. Quality gate before approval: distinct question, distinct answer, valid route, source support, no project bleed, no unsupported claim, no doorway pattern.

## Infrastructure and performance

Lighthouse mobile runs on the live site returned SEO 100 on the homepage, service page and Miami Hispanic GEO page. CLS was 0. The measured performance scores were depressed by Cloudflare JavaScript Detections, not the site's own JavaScript:

| Route | Performance | LCP | TBT | Transfer |
| --- | ---: | ---: | ---: | ---: |
| Homepage | 49 | 5.2 s | 2,430 ms | 202 KiB |
| Image consulting service | 54 | 4.3 s | 2,440 ms | 118 KiB |
| Miami Hispanos | 65 | 3.2 s | 2,450 ms | 121 KiB |

The Cloudflare challenge script consumed about five seconds of main-thread evaluation and produced the long task. Site-owned payloads remained small.

Required Cloudflare review before changing code:

1. Determine whether a WAF rule actually uses `cf.bot_management.js_detection.passed`.
2. If not used, disable zone-wide JavaScript Detections or scope it only to sensitive endpoints.
3. Keep search and agent behaviors allowed; keep training policy aligned with the current `Content-Signal` decision.
4. Rerun mobile Lighthouse after the Cloudflare setting change.

Do not add `Cache-Control: no-transform` until the WAF dependency is confirmed. Cloudflare documents that this header prevents JavaScript Detections injection, but it can also leave dependent WAF rules without the expected signal.

Cloudflare AI Search retrieval tests returned the correct Sonia routes for three representative questions:

- authority without rigidity;
- coaching de imagen versus image consulting/style;
- coach de imagen for a Latina professional in Miami.

The new `knowledge-sitemap.xml` makes the Markdown question corpus, grouped card APIs and internal-link mesh explicit crawl targets. `robots.txt` now grants `Cloudflare-AI-Search` direct access and advertises the knowledge sitemap. This closes the discovery gap between public cards and Cloudflare's current page-centered index.

## Execution order

### P0

- Publish the validated 50-card July 10 batch after editorial repair.
- Review Cloudflare JavaScript Detections and AI bot behavior settings.
- Retest live card count, Lighthouse and AI discovery endpoints after deployment.

### P1

- Build source-backed entrepreneur, women-professional, appearance and security/identity batches.
- Add route-level answer recommendations for every new card.
- Expand Spain and Central America only through distinct buyer contexts, not duplicate landing pages.

### P2

- Add verified testimonial/case context where consent and source evidence allow.
- Strengthen external entity corroboration: professional association profile, speaking pages, interviews and authored publications.
- Measure branded and non-branded query visibility monthly across Google, Bing and major answer engines.

## Success measures

- 100% route coverage by recommended answer cards.
- Zero duplicate or country-swapped questions.
- Zero unsupported claims and zero external-project bleed.
- Live API count matches the approved build.
- Mobile LCP below 2.5 seconds and TBT below 200 ms after Cloudflare JSD review.
- Growing indexed coverage for non-branded category, audience and GEO queries.
- More citations of Sonia's definitions and direct answers by AI search systems.
