# used to format and translate notes created using chrome extension https://github.com/OlyaFilatova/page-notes
# IMPORTANT: uses service from https://github.com/OlyaFilatova/ai_projects/tree/main/03_translate
import json
from pathlib import Path
from typing import TypedDict
import requests

class Note(TypedDict):
  text: str

class Mapping(TypedDict):
  url: str
  notes: list[Note]


def get_script_dir():
  return Path(__file__).resolve().parent

def get_notes_dir(root_dir: Path):
  return root_dir / 'notes'

def get_files(dir: Path):
  return [f for f in dir.iterdir() if f.is_file() and f"{f}".endswith(".json")]

def read_files(files: list[Path]):
  def get_file_pages(file: Path):
    with open(file, 'r') as f:
      content = json.load(f)
      return content["mappingsByUrl"]
  return [get_file_pages(file) for file in files]

def format_pages(mappingsByUrlList: list[dict[str, Mapping]]):
  return [{
      "url": value["url"],
      "notes": [note["text"] for note in value["notes"]]
    } for mapping in mappingsByUrlList for value in mapping.values()]

def translate_pages(pages):
  def translate_page(page, counter):
    url = "http://localhost:8000/translate"
    notes = [*reversed(page["notes"])]
    payload = {
      "texts": notes,
      "direction": "en_to_uk"
    }

    response = requests.post(url, json=payload)

    translated = response.json()["translations"]

    thoughts = [{
      "uk": uk,
      "en": en
    } for en, uk in zip(notes, translated)]

    return counter, ({
      "kind": "unknown",
      "status": "first-read",
      "title": {
        "uk": "Unknown",
        "en": "Unknown"
      },
      "access": "free",
      "categories": [],
      "link": page["url"]
    }, thoughts)

  return [(idx, translate_page(page, idx)) for idx, page in enumerate(pages)]
    
def store_pages(pages, root_dir):
  def create_result_path(root_dir: Path, counter: int):
    return root_dir / 'formatted' / f'{counter}'

  def store_result(result_path: Path, meta, content):
    with open(result_path / 'meta.json', 'w') as f:
      json.dump(meta, f, ensure_ascii=False, indent=2)

    with open(result_path / 'content.json', 'w') as f:
      json.dump(content, f, ensure_ascii=False, indent=2)

  [store_result(create_result_path(root_dir, idx), meta, content) for idx, (meta, content) in pages]

script_dir = get_script_dir()

store_pages(
  translate_pages(
    format_pages(
      read_files(
        get_files(
          get_notes_dir(
            script_dir
          ))))),
  script_dir)
