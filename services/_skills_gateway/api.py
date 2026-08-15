import os

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, Response

load_dotenv()

app = FastAPI()

SERVICES = {
  "job-postings": os.getenv("JOB_PARSER_SERVICE"),
  "skills": os.getenv("SKILLS_SERVICE"),
  "job-skills": os.getenv("JOB_SKILLS_SERVICE"),
  "skill-synonyms": os.getenv("SKILL_SYNONYMS_SERVICE"),
}

long_requests = ["skill-synonyms/"]


@app.api_route(
  "/api/{service}/{path:path}",
  methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def gateway(service: str, path: str, request: Request) -> Response:
  base_url = SERVICES.get(service)

  if not base_url:
    raise HTTPException(status_code=404, detail="Unknown service")

  url = f"{base_url.rstrip('/')}/{path}"

  body = await request.body()

  async with httpx.AsyncClient() as client:
    response = await client.request(
      request.method,
      url,
      params=request.query_params,
      content=body,
      headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
      timeout=100.0 if f"{service}/{path}" in long_requests else 5.0,
    )

  return Response(
    content=response.content,
    status_code=response.status_code,
    headers={
      k: v
      for k, v in response.headers.items()
      if k.lower() not in {"content-length", "transfer-encoding", "connection"}
    },
    media_type=response.headers.get("content-type"),
  )
