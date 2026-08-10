import json
import os
from pathlib import Path
from typing import TypedDict, cast

import requests


class Note(TypedDict):
  text: str


class Mapping(TypedDict):
  url: str
  notes: list[Note]


class Page(TypedDict):
  url: str
  notes: list[str]


class InternationalizedString(TypedDict):
  uk: str
  en: str


class Meta(TypedDict):
  kind: str
  status: str
  title: InternationalizedString
  access: str
  categories: list[str]
  link: str


def get_script_dir() -> Path:
  return Path(__file__).resolve().parent


def get_notes_dir(root_dir: Path) -> Path:
  return root_dir / "notes"


def get_files(dir: Path) -> list[Path]:
  return [f for f in dir.iterdir() if f.is_file() and f"{f}".endswith(".json")]


def read_file(file: Path) -> dict[str, Mapping]:
  with open(file) as f:
    content = json.load(f)
    return cast(dict[str, Mapping], content["mappingsByUrl"])


def format_file(mappingsByUrl: dict[str, Mapping]) -> list[Page]:
  return [
    {"url": value["url"], "notes": [note["text"] for note in value["notes"]]}
    for value in mappingsByUrl.values()
  ]


def translate_page(page: Page) -> list[tuple[str, str]]:
  url = "http://localhost:8001/translate"
  notes = [*reversed(page["notes"])]
  payload = {"texts": notes, "direction": "en_to_uk"}

  response = requests.post(url, json=payload)

  translated = response.json()["translations"]

  return list(zip(notes, translated, strict=True))


def format_page(
  page: Page, notes: list[tuple[str, str]]
) -> tuple[Meta, list[InternationalizedString]]:
  thoughts: list[InternationalizedString] = [{"uk": uk, "en": en} for en, uk in notes]

  return (
    {
      "kind": "unknown",
      "status": "first-read",
      "title": {"uk": "Unknown", "en": "Unknown"},
      "access": "free",
      "categories": [],
      "link": page["url"],
    },
    thoughts,
  )


def create_result_path(root_dir: Path, dir_name: str) -> Path:
  return root_dir / "formatted" / f"{dir_name}"


def store_page(result_path: Path, page: tuple[Meta, list[InternationalizedString]]) -> None:
  meta, content = page
  os.makedirs(result_path, exist_ok=True)
  with open(result_path / "meta.json", "w") as f:
    json.dump(meta, f, ensure_ascii=False, indent=2)

  with open(result_path / "content.json", "w") as f:
    json.dump(content, f, ensure_ascii=False, indent=2)


script_dir = get_script_dir()

pages = (
  (file_idx, page_idx, page)
  for file_idx, file in enumerate(get_files(get_notes_dir(script_dir)))
  for page_idx, page in enumerate(format_file(read_file(file)))
)

for file_idx, page_idx, page in pages:
  store_page(
    create_result_path(script_dir, f"{file_idx}-{page_idx}"),
    format_page(page, translate_page(page)),
  )
