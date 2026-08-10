import os
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request

load_dotenv()

app = FastAPI()

SERVICES = {
  "job-postings": os.getenv("JOB_PARSER_SERVICE"),
  "skills": os.getenv("SKILL_MANAGER_SERVICE"),
}

@app.api_route(
  "/api/{service}/{path:path}",
  methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def gateway(service: str, path: str, request: Request) -> Any:
  base_url = SERVICES.get(service)

  if not base_url:
    raise HTTPException(status_code=404, detail="Unknown service")

  url = f"{base_url}/{path}"

  body = await request.body()

  async with httpx.AsyncClient() as client:
    response = await client.request(
      request.method,
      url,
      params=request.query_params,
      content=body,
      headers={k: v for k, v in request.headers.items() if k.lower() != "host"},
    )

  return response.json()
