# Store Job Posting and return list of skills parsed

## Build Docker instance

Open Docker.

Create containers `docker compose up -d --build`

Start containers `docker compose up -d`

## setup python

`python3 -m venv .venv`

`source .venv/bin/activate`

## install python dependencies

`uv run poe install_all`

## using job_parser service

```ssh
curl -X POST http://localhost:9001/parse-job \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d {"body": "<Job Posting text>", "category": "<Job Posting category>", "company": "<Posting company name>", "url": "<url of the source page>"}
```

## maintenance

### regenerate types

```ssh
datamodel-codegen \
  --url http://localhost:9002/openapi.json \
  --input-file-type openapi \
  --allow-private-network \
  --output services/job_parser/generated/skills_models.py
```
