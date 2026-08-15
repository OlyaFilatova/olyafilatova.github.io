# Personal GitHub Pages repo

## Repo contains

### GitHub Pages Deploy Workflow

### Github Pages website written on React

### Chrome extensions (depend on services)

- page notes
- skill highlight

### Scripts

- translate exported notes
- assemble data for the static website (notes, projects, experience)

### Services for extensions and scripts

#### For Page notes extension and scripts
- Extract links from github issue
- Translate list of texts
- Transflorm markdown text to HTML

#### For Highlight skills extension
- Gateway
- Job Posting parser (depends on Parse skills service that is not present in the repo)
- Skills service
- Skill synonyms service
- Job skills service

## build and run services for Highlight skills extension

`docker compose -f docker-compose.page-notes.yml up -d --build`

## build and run services for Page notes extension and scripts

`docker compose -f docker-compose.skill-highlight.yml up -d --build`

### run specific service

`docker compose -f docker-compose.page-notes.yml up -d parse_github_issue`

## install python dependencies

`uv run poe install_all`

## install node dependencies

`pnpm i`

## build specific TS package

`pnpm --filter @olyafilatova.github.io/skill-highlight build`

## Regenerate types

1. Start services
2. run `pnpm run generate-api-types`

## Seed DB
1. Put JSON file to scripts/pytools/seed_data/prefill-skills.json of format 
    ```json
    {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "normalizedText":     { "type": "string" },
          "text":               { "type": "string" },
          "synonymSkillId?":    { "type": "string" }
        }
      }
    }
    ```
2. Start postgres from docker compose for Highlight skills extension
3. run `python -m scripts.pytools.seed`

## Frequently used maintenance commands

- `uv run poe format`
- `uv run poe lint --fix`
- `uv run poe mypy`
- `uv lock`
- `uv run poe install_all`
- `alembic revision --autogenerate -m "<describe model changes>"`
- `alembic upgrade head`
- `docker exec -t parse_job_posting_db pg_dump -Fp -U postgres -d parse_job_posting > backup.sql`
- `pnpm lint --fix`
