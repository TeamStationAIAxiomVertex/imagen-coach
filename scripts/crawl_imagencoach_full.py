#!/usr/bin/env python3
"""
Archive imagencoach.com for the rebuild.

The crawler stores each source URL as:
- raw HTML
- extracted visible text
- link and image references
- downloaded image assets
- a JSON manifest for audit/rebuild work

It intentionally uses only the Python standard library so the migration archive
can be regenerated in a clean checkout without installing packages.
"""

from __future__ import annotations

import hashlib
import html
import json
import mimetypes
import re
import socket
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlparse, urlunparse
from urllib.request import Request, urlopen
from xml.etree import ElementTree


DOMAIN = "imagencoach.com"
START_URL = "https://imagencoach.com/"
SITEMAP_INDEX = "https://imagencoach.com/sitemap.xml"
OUT_DIR = Path("archive/imagencoach")
RAW_DIR = OUT_DIR / "raw-html"
TEXT_DIR = OUT_DIR / "text"
PAGE_ASSET_DIR = OUT_DIR / "images"
REQUEST_DELAY_SECONDS = 0.35
TIMEOUT_SECONDS = 12
USER_AGENT = "ImagenCoachMigrationCrawler/1.0 (+https://imagencoach.com)"
socket.setdefaulttimeout(TIMEOUT_SECONDS)


@dataclass
class PageParseResult:
    title: str = ""
    text_lines: list[str] = field(default_factory=list)
    links: set[str] = field(default_factory=set)
    images: set[str] = field(default_factory=set)


class PageParser(HTMLParser):
    ignored_tags = {"script", "style", "noscript", "svg", "template"}

    def __init__(self, base_url: str) -> None:
        super().__init__(convert_charrefs=True)
        self.base_url = base_url
        self.result = PageParseResult()
        self._tag_stack: list[str] = []
        self._in_title = False
        self._title_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        self._tag_stack.append(tag)
        attrs_dict = {key.lower(): value for key, value in attrs if value is not None}

        if tag == "title":
            self._in_title = True

        if tag == "a" and attrs_dict.get("href"):
            self.result.links.add(normalize_url(urljoin(self.base_url, attrs_dict["href"])))

        for attr in ("src", "href", "content"):
            value = attrs_dict.get(attr)
            if value and looks_like_image_url(value):
                self.result.images.add(normalize_url(urljoin(self.base_url, value)))

        for attr in ("srcset", "data-srcset"):
            value = attrs_dict.get(attr)
            if value:
                for image_url in parse_srcset(value):
                    self.result.images.add(normalize_url(urljoin(self.base_url, image_url)))

        for attr in ("data-src", "data-original", "data-lazy-src"):
            value = attrs_dict.get(attr)
            if value and looks_like_image_url(value):
                self.result.images.add(normalize_url(urljoin(self.base_url, value)))

        style = attrs_dict.get("style")
        if style:
            for image_url in parse_css_urls(style):
                self.result.images.add(normalize_url(urljoin(self.base_url, image_url)))

        if tag == "img":
            alt = attrs_dict.get("alt")
            if alt:
                self._append_text(alt)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "title":
            self._in_title = False
            self.result.title = clean_inline_text(" ".join(self._title_parts))

        for index in range(len(self._tag_stack) - 1, -1, -1):
            if self._tag_stack[index] == tag:
                del self._tag_stack[index:]
                break

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self._title_parts.append(data)
        if any(tag in self.ignored_tags for tag in self._tag_stack):
            return
        self._append_text(data)

    def _append_text(self, value: str) -> None:
        line = clean_inline_text(value)
        if line:
            self.result.text_lines.append(line)


def clean_inline_text(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def normalize_url(url: str) -> str:
    parsed = urlparse(url)
    if not parsed.scheme:
        return url
    path = parsed.path or "/"
    return urlunparse((parsed.scheme, parsed.netloc, path, "", parsed.query, ""))


def canonical_page_url(url: str) -> str:
    parsed = urlparse(normalize_url(url))
    return urlunparse((parsed.scheme, parsed.netloc.replace("www.", ""), parsed.path or "/", "", "", ""))


def is_same_domain_page(url: str) -> bool:
    parsed = urlparse(url)
    host = parsed.netloc.replace("www.", "")
    if host != DOMAIN:
        return False
    if parsed.path.startswith("/.sw/"):
        return False
    lower_path = parsed.path.lower()
    blocked_suffixes = (
        ".css",
        ".js",
        ".json",
        ".xml",
        ".png",
        ".jpg",
        ".jpeg",
        ".webp",
        ".gif",
        ".svg",
        ".ico",
        ".woff",
        ".woff2",
        ".ttf",
        ".pdf",
    )
    return not lower_path.endswith(blocked_suffixes)


def slug_for_url(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path.strip("/")
    if not path:
        return "homepage"
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", path).strip("-").lower()
    return slug or "homepage"


def looks_like_image_url(value: str) -> bool:
    value = value.strip()
    if value.startswith("data:"):
        return False
    parsed_path = urlparse(value).path.lower()
    return bool(
        re.search(r"\.(avif|gif|ico|jpe?g|png|svg|webp)(?:$|[?#])", value.lower())
        or "/res/" in parsed_path
        or "_optimized" in parsed_path
    )


def parse_srcset(value: str) -> Iterable[str]:
    for candidate in value.split(","):
        url = candidate.strip().split(" ")[0]
        if url:
            yield url


def parse_css_urls(value: str) -> Iterable[str]:
    for match in re.finditer(r"url\\((['\"]?)(.*?)\\1\\)", value):
        found = match.group(2).strip()
        if found and looks_like_image_url(found):
            yield found


def fetch_bytes(url: str) -> tuple[bytes, int, str]:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=TIMEOUT_SECONDS) as response:
        status = getattr(response, "status", 200)
        content_type = response.headers.get("Content-Type", "")
        return response.read(), int(status), content_type


def decode_response(body: bytes, content_type: str) -> str:
    charset_match = re.search(r"charset=([^;]+)", content_type, re.I)
    charset = charset_match.group(1).strip() if charset_match else "utf-8"
    try:
        return body.decode(charset, errors="replace")
    except LookupError:
        return body.decode("utf-8", errors="replace")


def parse_xml_locs(xml_text: str) -> list[str]:
    root = ElementTree.fromstring(xml_text.lstrip().encode("utf-8"))
    locs: list[str] = []
    for element in root.iter():
        if element.tag.endswith("loc") and element.text:
            locs.append(element.text.strip())
    return locs


def discover_sitemap_urls() -> list[str]:
    sitemap_body, _, content_type = fetch_bytes(SITEMAP_INDEX)
    sitemap_text = decode_response(sitemap_body, content_type)
    nested_sitemaps = parse_xml_locs(sitemap_text)
    page_urls = {START_URL}

    for sitemap_url in nested_sitemaps:
        body, _, nested_content_type = fetch_bytes(sitemap_url)
        text = decode_response(body, nested_content_type)
        for loc in parse_xml_locs(text):
            if is_same_domain_page(loc):
                page_urls.add(canonical_page_url(loc))
        time.sleep(REQUEST_DELAY_SECONDS)

    return sorted(page_urls)


def collapse_text_lines(lines: Iterable[str]) -> list[str]:
    collapsed: list[str] = []
    previous = ""
    for line in lines:
        if line and line != previous:
            collapsed.append(line)
            previous = line
    return collapsed


def extension_from_content_type(content_type: str, fallback_url: str) -> str:
    if "image/svg" in content_type:
        return ".svg"
    content_type = content_type.split(";")[0].strip().lower()
    guessed = mimetypes.guess_extension(content_type)
    if guessed:
        return ".jpg" if guessed == ".jpe" else guessed
    suffix = Path(urlparse(fallback_url).path).suffix
    return suffix if suffix else ".bin"


def download_image(
    image_url: str,
    page_slug: str,
    image_cache: dict[str, dict[str, str | int | None]],
) -> dict[str, str | int | None]:
    if image_url in image_cache:
        cached = dict(image_cache[image_url])
        cached["referenced_from_page"] = page_slug
        return cached

    try:
        body, status, content_type = fetch_bytes(image_url)
    except (HTTPError, URLError, TimeoutError, OSError) as exc:
        record = {
            "source_url": image_url,
            "status": None,
            "content_type": None,
            "bytes": 0,
            "sha256": None,
            "local_path": None,
            "referenced_from_page": page_slug,
            "error": str(exc),
        }
        image_cache[image_url] = record
        return record

    digest = hashlib.sha256(body).hexdigest()
    ext = extension_from_content_type(content_type, image_url)
    image_dir = PAGE_ASSET_DIR / "_shared"
    image_dir.mkdir(parents=True, exist_ok=True)
    local_path = image_dir / f"{digest[:16]}{ext}"
    if not local_path.exists():
        local_path.write_bytes(body)

    record = {
        "source_url": image_url,
        "status": status,
        "content_type": content_type,
        "bytes": len(body),
        "sha256": digest,
        "local_path": str(local_path),
        "referenced_from_page": page_slug,
        "error": None,
    }
    image_cache[image_url] = record
    return record


def write_page_archive(
    url: str,
    html_text: str,
    status: int,
    content_type: str,
    image_cache: dict[str, dict[str, str | int | None]],
) -> tuple[dict, list[str]]:
    page_slug = slug_for_url(url)
    parser = PageParser(url)
    parser.feed(html_text)

    text_lines = collapse_text_lines(parser.result.text_lines)
    same_domain_links = sorted(
        {
            canonical_page_url(link)
            for link in parser.result.links
            if is_same_domain_page(link)
        }
    )
    image_urls = sorted(image for image in parser.result.images if image.startswith(("http://", "https://")))

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    TEXT_DIR.mkdir(parents=True, exist_ok=True)
    (RAW_DIR / f"{page_slug}.html").write_text(html_text, encoding="utf-8")
    (TEXT_DIR / f"{page_slug}.md").write_text(
        "# Source URL\n"
        f"{url}\n\n"
        "# HTTP\n"
        f"status: {status}\n"
        f"content-type: {content_type}\n\n"
        "# Page title\n"
        f"{parser.result.title}\n\n"
        "# Raw visible text\n\n"
        + "\n".join(text_lines)
        + "\n\n# Links found on page\n\n"
        + "\n".join(f"- {link}" for link in same_domain_links)
        + "\n\n# Images found on page\n\n"
        + "\n".join(f"- {image}" for image in image_urls)
        + "\n",
        encoding="utf-8",
    )

    image_records = []
    for image_url in image_urls:
        image_records.append(download_image(image_url, page_slug, image_cache))
        time.sleep(REQUEST_DELAY_SECONDS)

    return (
        {
            "url": url,
            "slug": page_slug,
            "status": status,
            "content_type": content_type,
            "title": parser.result.title,
            "raw_html_path": str(RAW_DIR / f"{page_slug}.html"),
            "text_path": str(TEXT_DIR / f"{page_slug}.md"),
            "text_line_count": len(text_lines),
            "links": same_domain_links,
            "images": image_records,
        },
        same_domain_links,
    )


def crawl() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    queue = discover_sitemap_urls()
    seen: set[str] = set()
    pages: list[dict] = []
    failures: list[dict[str, str]] = []
    image_cache: dict[str, dict[str, str | int | None]] = {}

    print(f"Discovered {len(queue)} sitemap URLs", flush=True)

    while queue:
        url = queue.pop(0)
        if url in seen:
            continue
        seen.add(url)
        print(f"Crawling {url}", flush=True)

        try:
            body, status, content_type = fetch_bytes(url)
            html_text = decode_response(body, content_type)
            page_record, links = write_page_archive(url, html_text, status, content_type, image_cache)
            pages.append(page_record)
            for link in links:
                if link not in seen and link not in queue:
                    queue.append(link)
        except (HTTPError, URLError, TimeoutError, OSError, ElementTree.ParseError) as exc:
            failures.append({"url": url, "error": str(exc)})
            print(f"FAILED {url}: {exc}", flush=True)

        time.sleep(REQUEST_DELAY_SECONDS)

    image_count = sum(len(page["images"]) for page in pages)
    downloaded_image_count = sum(
        1
        for page in pages
        for image in page["images"]
        if image.get("local_path")
    )
    manifest = {
        "source_domain": DOMAIN,
        "start_url": START_URL,
        "sitemap_index": SITEMAP_INDEX,
        "crawled_at": datetime.now(timezone.utc).isoformat(),
        "page_count": len(pages),
        "image_reference_count": image_count,
        "downloaded_image_count": downloaded_image_count,
        "unique_image_url_count": len(image_cache),
        "failure_count": len(failures),
        "pages": pages,
        "failures": failures,
    }
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

    print(
        "Done. "
        f"Captured {len(pages)} pages, {downloaded_image_count}/{image_count} image references, "
        f"{len(failures)} failures into {OUT_DIR}"
        ,
        flush=True,
    )


if __name__ == "__main__":
    crawl()
