from fastapi import FastAPI
from pydantic import BaseModel

from shared.load_env import get_env

from github_issue.extract_links import extract_links
from github_issue.format_url import format_issue_url
from github_issue.get_body import get_issue_body


app = FastAPI()

class LinksResponse(BaseModel):
  links: list[tuple[str, str]]

@app.get("/health")
def health():
  return {
    "status": "ok"
  }


@app.get("/issue-links", response_model=LinksResponse)
def translate(url: str):
  url = format_issue_url(url)
  body = get_issue_body(url, get_env()["GITHUB_TOKEN"])
  links = extract_links(body)

  return LinksResponse(links=links)
