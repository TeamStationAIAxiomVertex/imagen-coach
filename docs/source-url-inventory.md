# ImagenCoach Source URL Inventory

This is the canonical migration contract for the `imagencoach.com` rebuild. Every URL listed here must be preserved as a working route in the rebuilt site unless an explicit redirect decision is documented.

Source sitemaps:

- `https://imagencoach.com/sitemap_pages.xml`
- `https://imagencoach.com/imagen-presencia/sitemap.xml`

Captured archive:

- Raw HTML: `archive/imagencoach/raw-html/`
- Extracted text: `archive/imagencoach/text/`
- Images: `archive/imagencoach/images/`
- Crawl manifest: `archive/imagencoach/manifest.json`

## Coverage Summary

- Main pages: 9
- `imagen-presencia` pages: 26
- Total canonical URLs: 35

## Main Pages

| URL | Rebuild requirement |
| --- | --- |
| `https://imagencoach.com/` | Preserve route as homepage |
| `https://imagencoach.com/sobre-sonia-mcrorey-asesora-de-imagen` | Preserve route |
| `https://imagencoach.com/servicios-asesoria-de-imagen-coaching` | Preserve route |
| `https://imagencoach.com/servicios-asesoria-de-imagen-coaching/asesoria-de-imagen` | Preserve route |
| `https://imagencoach.com/servicios-asesoria-de-imagen-coaching/coaching-de-imagen` | Preserve route |
| `https://imagencoach.com/servicios-asesoria-de-imagen-coaching/talleres` | Preserve route |
| `https://imagencoach.com/imagen-presencia` | Preserve route as article index |
| `https://imagencoach.com/servicios-asesoria-de-imagen-coaching/preguntas-frequentes` | Preserve route, including existing misspelling |
| `https://imagencoach.com/servicios-asesoria-de-imagen-coaching/coaching-de-abundancia` | Preserve route |

## Imagen, Presencia Articles

| URL | Rebuild requirement |
| --- | --- |
| `https://imagencoach.com/imagen-presencia/amor-propio-estructura-interna-presencia-profesional` | Preserve route |
| `https://imagencoach.com/imagen-presencia/aprende-a-resaltar-tus-proporciones` | Preserve route |
| `https://imagencoach.com/imagen-presencia/beneficios-de-asesoria-de-imagen` | Preserve route |
| `https://imagencoach.com/imagen-presencia/como-mejorar-la-imagen-de-tus-colaboradores` | Preserve route |
| `https://imagencoach.com/imagen-presencia/como-puedo-ayudarte-hoy` | Preserve route |
| `https://imagencoach.com/imagen-presencia/como-vestirte-durante-los-festejos` | Preserve route |
| `https://imagencoach.com/imagen-presencia/descubre-el-poder-de-tu-rostro` | Preserve route |
| `https://imagencoach.com/imagen-presencia/encuentra-tu-estilo` | Preserve route |
| `https://imagencoach.com/imagen-presencia/imagen-identidad-liderazgo` | Preserve route |
| `https://imagencoach.com/imagen-presencia/imagen-profesional-segun-industria-y-personalidad` | Preserve route |
| `https://imagencoach.com/imagen-presencia/la-ciencia-del-color-en-tu-imagen` | Preserve route |
| `https://imagencoach.com/imagen-presencia/la-importancia-de-tu-imagen-personal` | Preserve route |
| `https://imagencoach.com/imagen-presencia/los-secretos-de-una-asesora-de-imagen-exitosa` | Preserve route |
| `https://imagencoach.com/imagen-presencia/manifiesta-tu-imagen-autenticar-talleres-de-verano-2025` | Preserve route |
| `https://imagencoach.com/imagen-presencia/mas-dinero-capacidad-interna-liderazgo-presencia` | Preserve route |
| `https://imagencoach.com/imagen-presencia/new-tu-guardarropa-te-refleja-o-te-limita` | Preserve route |
| `https://imagencoach.com/imagen-presencia/presencia-profesional-estrategica` | Preserve route |
| `https://imagencoach.com/imagen-presencia/rebranding-imagen-mentalidad-abundancia` | Preserve route |
| `https://imagencoach.com/imagen-presencia/soltar-lo-que-ya-no-vibra-y-vestir-tu-verdad` | Preserve route |
| `https://imagencoach.com/imagen-presencia/sostener-el-crecimiento` | Preserve route |
| `https://imagencoach.com/imagen-presencia/sostener-tu-siguiente-nivel-profesional` | Preserve route |
| `https://imagencoach.com/imagen-presencia/transforma-tu-imagen-consciente` | Preserve route |
| `https://imagencoach.com/imagen-presencia/tu-autoconcepto-el-punto-de-partida-para-transformar-tu-imagen` | Preserve route |
| `https://imagencoach.com/imagen-presencia/tu-color-tu-poder-el-impacto-de-la-colorimetria` | Preserve route |
| `https://imagencoach.com/imagen-presencia/tu-imagen-y-tu-negocio-una-conexion-mas-poderosa-de-lo-que-imaginas` | Preserve route |
| `https://imagencoach.com/imagen-presencia/y-si-tu-imagen-no-fuera-un-disfraz-sino-una-puerta-para-regresar-a-ti-article` | Preserve route |

## Known Non-Canonical Internal 404s

The crawl discovered these internal links, but they are not present in the sitemap and returned `404 Not Found` during capture:

- `https://imagencoach.com/articulos/tu-color-tu-poder-el-impacto-de-la-colorimetria`
- `https://imagencoach.com/articulos/aprende-a-resaltar-tus-proporciones`
- `https://imagencoach.com/articulos/la-importancia-de-tu-imagen-personal`
- `https://imagencoach.com/articulos/encuentra-tu-estilo`

During rebuild, either remove these links or redirect them to the corresponding `/imagen-presencia/...` article URLs.
