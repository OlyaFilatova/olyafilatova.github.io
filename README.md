# Personal GitHub Pages repo

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
