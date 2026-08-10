import os
from typing import TypedDict

from dotenv import load_dotenv

loaded = False
GITHUB_TOKEN = ""


class Env(TypedDict):
  GITHUB_TOKEN: str


def get_env() -> Env:
  global loaded, GITHUB_TOKEN
  if not loaded:
    load_dotenv()
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN") or ""
    loaded = True

  return {
    "GITHUB_TOKEN": GITHUB_TOKEN,
  }
