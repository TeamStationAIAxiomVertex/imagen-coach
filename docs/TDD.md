# Test-Driven Development And QA Plan

## Purpose

The rebuild must be validated as a migration, not just a design exercise. Tests should prove URL preservation, content integrity, asset integrity, SEO correctness, and deployability.

## Current Validation

Already completed:

- crawled 35 canonical URLs
- archived raw HTML and extracted text
- downloaded/mapped available images
- documented URL inventory
- generated clean content layer
- validated clean inventory count against crawl manifest

## Required Test Layers

### 1. Source Inventory Tests

Assert:

- `docs/source-url-inventory.md` contains exactly the 35 canonical URLs from `archive/imagencoach/manifest.json`
- every canonical URL has a clean content page
- every clean page points back to source text and source HTML

### 2. Content Cleanup Tests

Assert rendered/source clean content does not contain:

- Weblium UUIDs
- repeated `logo` nav junk
- `Can't send form`
- `Please try again later`
- literal `undefined`
- `Miscellaneous 234_solid`

### 3. Asset Tests

Assert:

- every clean manifest image `local_path` exists
- no image record with `error` is used by implementation
- no generated page references missing assets
- asset filenames are stable and content-addressed where practical

### 4. Route Build Tests

Assert:

- every route in `docs/source-url-inventory.md` builds to an HTML file or framework route
- no canonical URL is omitted from sitemap
- route paths preserve old spelling and slugs exactly

### 5. Link Tests

Assert:

- internal links resolve to a valid route or documented redirect
- broken `/articulos/...` source links are not emitted as normal links
- external links use expected protocols and do not break the build

### 6. SEO Tests

Assert each page has:

- canonical URL
- title
- meta description
- Open Graph title and image
- valid sitemap entry
- `robots.txt` references the sitemap

Article pages should receive article-like metadata where applicable.

### 7. UI Regression Tests

Before launch, test at minimum:

- desktop wide viewport
- laptop viewport
- tablet viewport
- mobile viewport

Assert:

- no overlapping text
- header works on mobile
- CTA buttons fit
- article pages are readable
- images are not distorted
- cards do not resize unpredictably
- color/typography match the Guadalajara UX/UI standard

### 8. Deployment Tests

Assert:

- clean checkout installs dependencies
- build command succeeds
- Cloudflare Pages preview works
- production output directory is correct
- no secret/env dependency is required for static pages

## Suggested Commands

These commands should exist as the implementation matures:

```bash
npm run validate:source
npm run validate:content
npm run validate:assets
npm run validate:routes
npm run validate:seo
npm run build
```

## Launch Gate

Do not cut DNS from Weblium to Cloudflare until:

- source inventory tests pass
- build tests pass
- sitemap tests pass
- image tests pass
- link tests pass
- visual QA passes on desktop and mobile
- Cloudflare preview crawl confirms all 35 URLs return expected status
