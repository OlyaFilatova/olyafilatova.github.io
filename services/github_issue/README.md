# Extract links from a GitHub issue

## Getting Github token

Open settings. https://github.com/settings/profile

Go to Developer settings. https://github.com/settings/apps

In personal access tokens open Fine-grained tokens. https://github.com/settings/personal-access-tokens

Limit repo access as needed. 

Add permission Issues with read-only access.

Put the token in the .env file.

## Build Docker instance

Open Docker.

Create containers `docker compose up -d --build`

Start containers `docker compose up -d`

## setup python

`python3 -m venv .venv`

`source .venv/bin/activate`

`pip install -r requirements.txt`

## using parse_github_issue service

curl -G \
  -H "Accept: application/json" \
  -d "url=https://github.com/OlyaFilatova/olyafilatova.github.io/issues/6" \
  http://localhost:8000/issue-links

