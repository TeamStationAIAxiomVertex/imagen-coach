#!/usr/bin/env python3
"""
Build a cleaned migration content layer from the raw imagencoach.com archive.

This does not modify the raw crawl. It removes duplicated Weblium/navigation/form
noise and writes rebuild-ready Markdown plus a structured manifest.
"""

from __future__ import annotations

import json
import re
from pathlib import Path


ARCHIVE_DIR = Path("archive/imagencoach")
TEXT_DIR = ARCHIVE_DIR / "text"
OUT_DIR = Path("content/clean")
PAGE_OUT_DIR = OUT_DIR / "pages"

GLOBAL_JUNK_LINES = {
    "logo",
    "Cursos de Imagen",
    "Inicio",
    "Quien Soy?",
    "Servicios",
    "Asesoria de Imagen",
    "Coaching de Imagen",
    "Talleres",
    "Preguntas Frequentes",
    "Publicaciones",
    "Talleres y Eventos",
    "Illustration",
    "Servicioss",
    "Sonia McRorey es miembra de AICI",
    "Sonia McRorey | Asesora y Coach de Imagen Personal y Empresarial",
    "https://imagencoach.com/servicios-asesoria-de-imagen-coaching/coaching-de-abundancia",
    "undefined",
    ".",
}

FORM_AND_FOOTER_JUNK_LINES = {
    "Tu nombre",
    "Telefono",
    "Tu Email",
    "¿En qué puedo ayudarte?",
    "*",
    "Enviar mensaje",
    "Muchas Gracias!",
    "Gracias, nos pondremos en contacto contigo a la brevedad.",
    "Vamos!",
    "Can't send form",
    "Please try again later.",
    "Ok",
}

KNOWN_NOISY_LINES = {
    "Sonia McRorey la mas experta de Asesoria de Imagen en Latina America tiene su espacio en WeWork con las oficinas de TeamStation AI",
}

UUID_RE = re.compile(
    r"^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
    re.I,
)


def split_markdown_sections(text: str) -> dict[str, list[str]]:
    sections: dict[str, list[str]] = {}
    current = ""
    for line in text.splitlines():
        if line.startswith("# "):
            current = line[2:].strip()
            sections[current] = []
        elif current:
            sections[current].append(line.rstrip())
    return sections


def clean_title(title: str) -> str:
    return title.replace(" Miscellaneous 234_solid", "").strip()


def clean_lines(lines: list[str]) -> tuple[list[str], list[str]]:
    cleaned: list[str] = []
    removed: list[str] = []
    previous = ""

    for raw_line in lines:
        line = re.sub(r"\s+", " ", raw_line).strip()
        if not line:
            continue

        is_junk = (
            line in GLOBAL_JUNK_LINES
            or line in FORM_AND_FOOTER_JUNK_LINES
            or line in KNOWN_NOISY_LINES
            or UUID_RE.match(line) is not None
        )

        if is_junk:
            removed.append(line)
            continue

        if line == previous:
            removed.append(line)
            continue

        cleaned.append(line)
        previous = line

    return cleaned, removed


def clean_image_records(images: list[dict]) -> list[dict]:
    seen_paths: set[str] = set()
    cleaned: list[dict] = []

    for image in images:
        if image.get("error"):
            continue
        local_path = image.get("local_path")
        if not local_path or local_path in seen_paths:
            continue
        seen_paths.add(local_path)
        cleaned.append(
            {
                "source_url": image.get("source_url"),
                "local_path": local_path,
                "content_type": image.get("content_type"),
                "bytes": image.get("bytes"),
                "sha256": image.get("sha256"),
            }
        )

    return cleaned


def page_route(url: str) -> str:
    path = re.sub(r"^https://imagencoach\.com", "", url).strip()
    return path or "/"


def write_page(page: dict) -> dict:
    text_path = Path(page["text_path"])
    sections = split_markdown_sections(text_path.read_text(encoding="utf-8"))
    raw_lines = sections.get("Raw visible text", [])
    cleaned_lines, removed_lines = clean_lines(raw_lines)
    image_records = clean_image_records(page.get("images", []))

    PAGE_OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = PAGE_OUT_DIR / f"{page['slug']}.md"
    out_path.write_text(
        "---\n"
        f"url: {page['url']}\n"
        f"route: {page_route(page['url'])}\n"
        f"title: {json.dumps(clean_title(page.get('title', '')), ensure_ascii=False)}\n"
        f"sourceTextPath: {page['text_path']}\n"
        f"sourceHtmlPath: {page['raw_html_path']}\n"
        f"imageCount: {len(image_records)}\n"
        "---\n\n"
        + "\n".join(cleaned_lines)
        + "\n",
        encoding="utf-8",
    )

    return {
        "url": page["url"],
        "route": page_route(page["url"]),
        "slug": page["slug"],
        "title": clean_title(page.get("title", "")),
        "clean_path": str(out_path),
        "source_text_path": page["text_path"],
        "source_html_path": page["raw_html_path"],
        "raw_line_count": len([line for line in raw_lines if line.strip()]),
        "clean_line_count": len(cleaned_lines),
        "removed_line_count": len(removed_lines),
        "images": image_records,
    }


def main() -> None:
    manifest = json.loads((ARCHIVE_DIR / "manifest.json").read_text(encoding="utf-8"))
    pages = [write_page(page) for page in manifest["pages"]]

    unique_assets = {}
    for page in pages:
        for image in page["images"]:
            unique_assets[image["local_path"]] = image

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    clean_manifest = {
        "source_manifest": str(ARCHIVE_DIR / "manifest.json"),
        "page_count": len(pages),
        "unique_clean_asset_count": len(unique_assets),
        "total_removed_line_count": sum(page["removed_line_count"] for page in pages),
        "pages": pages,
    }
    (OUT_DIR / "manifest.json").write_text(
        json.dumps(clean_manifest, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print(
        f"Cleaned {len(pages)} pages, "
        f"removed {clean_manifest['total_removed_line_count']} junk/duplicate lines, "
        f"mapped {len(unique_assets)} unique clean assets"
    )


if __name__ == "__main__":
    main()
