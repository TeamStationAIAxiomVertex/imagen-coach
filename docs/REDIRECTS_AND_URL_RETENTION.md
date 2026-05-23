# Redirects And URL Retention

## Purpose

The migration must preserve all current canonical `imagencoach.com` URLs while redirecting known non-canonical broken internal paths.

## Canonical URL Contract

The canonical list lives in:

`docs/source-url-inventory.md`

All 35 routes must return 200 in the rebuilt Cloudflare deployment.

Do not redirect a canonical URL unless a future migration decision is explicitly documented and approved.

## Current Production Domain

Canonical:

`https://imagencoach.com`

WWW must redirect to apex:

`https://www.imagencoach.com/* -> https://imagencoach.com/:splat`

## Known Non-Canonical 404 Redirects

These links were discovered in the crawl but are not canonical sitemap URLs:

- `/articulos/tu-color-tu-poder-el-impacto-de-la-colorimetria`
- `/articulos/aprende-a-resaltar-tus-proporciones`
- `/articulos/la-importancia-de-tu-imagen-personal`
- `/articulos/encuentra-tu-estilo`

They redirect to the matching `/imagen-presencia/*` routes in the generated `_redirects` file.

## Cloudflare Rules

Generated output:

- `_redirects`
- `sitemap.xml`
- `robots.txt`

Build validation must fail if:

- sitemap omits a canonical route
- `_redirects` loses the known legacy redirects
- canonical metadata points away from `https://imagencoach.com`
- generated content references localhost, preview domains or Weblium junk
