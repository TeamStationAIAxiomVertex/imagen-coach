# imagen-coach
General Coach De Imagen site rebuild for Sonia McRorey.

Production canonical domain: `https://coachdeimagen.com`.
Legacy source domain: `https://imagencoach.com`.

## Source crawl

Archive the current Weblium site before rebuilding:

```bash
python3 scripts/crawl_imagencoach_full.py
```

The crawl writes to `archive/imagencoach/`:

- `raw-html/`: original HTML by URL
- `text/`: extracted visible text, links, and image references by URL
- `images/`: downloaded image assets grouped by page
- `manifest.json`: auditable URL, status, title, link, and image inventory

The canonical URL migration contract is documented in `docs/source-url-inventory.md`.
