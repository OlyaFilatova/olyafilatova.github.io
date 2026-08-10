from fastapi import FastAPI
from github_issue.extract_links import extract_links
from github_issue.format_url import format_issue_url
from github_issue.get_body import get_issue_body
from pydantic import BaseModel

from shared.load_env import get_env

app = FastAPI()


class LinksResponse(BaseModel):
  links: list[tuple[str, str]]


class HealthResponse(BaseModel):
  status: str


@app.get("/health")
def health() -> HealthResponse:
  return HealthResponse(status="ok")


@app.get("/issue-links", response_model=LinksResponse)
def translate(url: str) -> LinksResponse:
  url = format_issue_url(url)
  body = get_issue_body(url, get_env()["GITHUB_TOKEN"])
  links = extract_links(body)

  return LinksResponse(links=links)
