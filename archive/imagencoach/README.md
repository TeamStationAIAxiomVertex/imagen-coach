# ImagenCoach Source Archive

This folder is the migration archive for the current Weblium-hosted `imagencoach.com` site.

Generated with:

```bash
python3 scripts/crawl_imagencoach_full.py
```

## Crawl Result

- Pages captured: 35
- Raw HTML files: 35
- Extracted text files: 35
- Image references found: 563
- Image references downloaded or mapped to a downloaded asset: 559
- Unique image URLs found: 208
- Downloaded image files after content de-duplication: 139

## Known 404s Found During Crawl

These URLs were discovered from internal links but returned `404 Not Found`:

- `https://imagencoach.com/articulos/tu-color-tu-poder-el-impacto-de-la-colorimetria`
- `https://imagencoach.com/articulos/aprende-a-resaltar-tus-proporciones`
- `https://imagencoach.com/articulos/la-importancia-de-tu-imagen-personal`
- `https://imagencoach.com/articulos/encuentra-tu-estilo`

Four image references on `manifiesta-tu-imagen-autenticar-talleres-de-verano-2025` point to `undefined?w=...` and also return `404`. The real available image references for that page are still archived where present.
