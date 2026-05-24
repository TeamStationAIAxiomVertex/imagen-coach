# Redirects And URL Retention

## Purpose

The migration must preserve all current legacy `imagencoach.com` URL paths while making `coachdeimagen.com` the canonical production domain.

## Canonical URL Contract

The canonical list lives in:

`docs/source-url-inventory.md`

All 35 routes must return 200 on `coachdeimagen.com` in the rebuilt Cloudflare deployment.

Do not remove a legacy source path unless a future migration decision is explicitly documented and approved. Legacy `imagencoach.com` host requests should redirect to the matching `coachdeimagen.com` path.

## Current Production Domain

Canonical:

`https://coachdeimagen.com`

WWW and legacy hostnames must redirect to the new apex:

- `https://www.coachdeimagen.com/ -> https://coachdeimagen.com/`
- `https://www.coachdeimagen.com/* -> https://coachdeimagen.com/:splat`
- `https://imagencoach.com/ -> https://coachdeimagen.com/`
- `https://imagencoach.com/* -> https://coachdeimagen.com/:splat`
- `https://www.imagencoach.com/ -> https://coachdeimagen.com/`
- `https://www.imagencoach.com/* -> https://coachdeimagen.com/:splat`

Legacy sitemap endpoints must also be retained for crawler continuity:

- `https://imagencoach.com/sitemap_pages.xml -> https://coachdeimagen.com/sitemap.xml`
- `https://www.imagencoach.com/sitemap_pages.xml -> https://coachdeimagen.com/sitemap.xml`
- `https://imagencoach.com/imagen-presencia/sitemap.xml -> https://coachdeimagen.com/blog-sitemap.xml`
- `https://www.imagencoach.com/imagen-presencia/sitemap.xml -> https://coachdeimagen.com/blog-sitemap.xml`
- `/sitemap_pages.xml -> /sitemap.xml`
- `/imagen-presencia/sitemap.xml -> /blog-sitemap.xml`

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
- the legacy `imagencoach.com` wildcard redirect is removed
- legacy sitemap endpoints stop redirecting to current sitemap files
- canonical metadata points away from `https://coachdeimagen.com`
- generated content references localhost, preview domains or Weblium junk
