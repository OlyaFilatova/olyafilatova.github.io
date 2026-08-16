# olyafilatova.github.io - Personal website and tools

[GitHub Repo](https://github.com/OlyaFilatova/olyafilatova.github.io)

The project is a monorepo that includes website sources, chrome extension to store page notes, various tools for preparing content and helper services.

The main goal of this project is to store my notes and thoughts without additional cost for hosting. Thus I decided to use GitHub pages based on public repo; the tools that require additional compute (eg. translate) are used only locally and storage solutions are either browser-based or are the static website content.

## Main tech stack

**Languages:** TypeScript, Python.

**Front-end:** React.js, Manifest V3, zod.

**Back-end:** Nest.js, FastAPI, Pydantic, requests, SQLAlchemy, python-dotenv, httpx.

**Infrastructure:** Docker, docker-compose, alembic, GitHub Pages, GitHub Actions, monorepo (pnpm, uv).

**Models:** Helsinki-NLP/opus-mt-en-uk, Helsinki-NLP/opus-mt-uk-en.

**Data storage**: localStorage, IndexedDB, PostgreSQL.

<details>
  <summary>Subprojects...</summary>

## Subprojects
### Website

Personal website.

**Deployed:** on GitHub Pages.

**Language:** TypeScript.

**Frameworks and libraries:** React.js with Functional Components, html-react-parser, zod.

**Storage:** localStorage, static assets.

**Supported languages:** ukrainian and english. After using the language switch, the chosen language is stored in the browser cache.

**Pages:** main page, notes on knowledge sources, projects, experience history.

Content for pages is stored in the assets folders either as `.json` or `.html` files and loaded on-demand. Pages "projects" and "notes" use generated index objects to request content. Content of JSON files is verified using zod library.

Preparation of the website before deploying uses tools "experience assemble", "thoughts assemble", "projects assemble".

### Services

#### Parse GitHub issue

Parse list of links of specific format from a GitHub issue.

**Deployed:** locally using Docker.

**Language:** Python

**Frameworks and libraries:** FastAPI, Pydantic, requests.

**Requirements:** GitHub token with **Read Issue** access.

**Functionality:** Accepts issue URL, fetches issue body from GitHub and extracts list of links from the text.

Expected format of the issue body:

- Checklist of links.
- Only one link per text line.
- Link must be at the end of the text line.

#### Markdown to HTML

Convert markdown text to HTML text.

**Deployed:** locally using Docker.

**Language:** TypeScript.

**Frameworks and libraries:** Nest.js, markdown-it.

**Functionality:** Accepts markdown text and returns HTML result.

#### Translate

Translate list of texts either from ukrainian to english or from english to ukrainian.

**Deployed:** locally using Docker.

**Language:** Python.

**Frameworks and libraries:** FastAPI, pydantic, torch, transformers

**Requirements:** Device that can run "Helsinki-NLP/opus-mt-*" models.

**Functionality:**
- On the first start preloads models.
- Accepts direction of translation and list of strings
- Returns list of translated strings in the same order as the input list.

#### Job Parser

**Deployed:** locally using Docker.

**Language:** Python

**Frameworks and libraries:** FastAPI, pydantic, requests, asyncpg, SQLAlchemy, python-dotenv

**Storage:** PostgreSQL

**Requirements:**
- skills service running on docker
- parse skills service running on docker (Not provided in the repo)

**Functionality:**
- store job posting text if not present yet and call parse skills service to get list of skills found.
- find what links in a list where already parsed.

#### Job Skills

**Deployed:** locally using Docker.

**Language:** Python

**Frameworks and libraries:** FastAPI, Pydantic, requests, asyncpg, SQLAlchemy, python-dotenv

**Storage:** PostgreSQL

**Requirements:** postgres service running on docker

**Functionality:**
- Filter skills, aggregate information for each skill.
- List skill categories.
- store job skill connection.

#### Skill Synonyms

**Deployed:** locally using Docker.

**Language:** Python

**Frameworks and libraries:** FastAPI, Pydantic, requests, asyncpg, SQLAlchemy, python-dotenv, rapidfuzz

**Storage:** PostgreSQL

**Requirements:**
- postgres service running on docker
- skills service running on docker

**Functionality:**
- Find groups of similar skills.
- Ignore suggested group of similar skills.

#### Skills

**Deployed:** locally using Docker.

**Language:** Python

**Frameworks and libraries:** FastAPI, pydantic, requests, asyncpg, SQLAlchemy, python-dotenv

**Storage:** PostgreSQL

**Requirements:** postgres service running on docker

**Functionality:**
- create skill
- edit skill (type, familiarity, temperature)
- get skills
- make skill a synonym
- delete synonym
- get all synonyms
- list skills with their synonyms
- get texts of skills (normalized, initial)

#### Skills Gateway

Redirects requests to 4 services (Job parser, Job skills, Skill synonyms, Skills) to unify API for the client under one authority.

**Deployed:** locally using Docker.

**Language:** Python

**Frameworks and libraries:** FastAPI, httpx

**Requirements:** Services Job parser, Job skills, Skill synonyms, Skills running on Docker.

### Chrome extensions

#### Page notes

Locally store notes grouped by pages.

Previous version of the chrome extension can be found in the repo https://github.com/OlyaFilatova/page-notes.

Extension in this repo is extended to use services, namely Parse GitHub Issue service.

**Deployed:** locally as unpacked extension.

**Language:** TypeScript

**Frameworks and libraries:** React.js

**Storage:** IndexedDB, localStorage.

**Requirements:** Parse Github Issue service up and running locally on port 8000.

**Functionality:** When extension Side Panel is opened the form of the current page is shown. Notes can be saved using the form or directly from the page: 1. select text, 2. click **Save Note** that appears near the selection. When textarea value is changed its value is stored in browser cache mapped to the current page URL.

Notes from other pages saved previously are listed below the block of the current page. Notes can be deleted. The list can be searched through. The list has pagination by 10/25/50 pages per page. Notes are stored using IndexedDB.

Button **Set current GitHub issue** opens a form using which it is possible to parse list of links from GitHub issue. These links will be listed under the form split by status: 

- **planned** - checkbox unchecked in the list in the issue
- **in progress** - link satisfies rules for planned status and has notes stored in the extension
- **done** - checkbox checked in the list in the issue. 

Button export JSON exports pages and their notes in JSON format. Pages are exported under their link, but if a current GitHub issue is configured all pages that are listed in the issue will be grouped and exported under the issue link instead.

Clear all button after confirmation clears all stored notes from the browser DB.

#### Highlight skills

Show skills on Job postings, stylize them based on their features.

Uses skills gateway for parsing and storage.

**Deployed:** locally as unpacked extension.

**Language:** TypeScript

**Frameworks and libraries:** React.js

**Storage:** Sends data to API.

**Requirements:** Gateway, services (Job parser, Job skills, Skill synonyms, Skills) and postgres service running on docker.

**Functionality:** 
Supports Djinni.co and Dou.ua platforms.

On page load identify type of the page.

If the page lists job postings, gathers links to job postings, identifies which where visited and stylizes them accordingly.

If the page displays a job posting:
- parses skills from job posting description and stylizes skills according to their type (Application, Approach, Non-skill), familiarity(know, study, unknown, etc.), and temperature(interesting, meh, avoid).
- on text selection suggests saving the skill.
- on click on the stylzed skill shows a skill edit popup.

In the side panel there are two tabs. Under the "skills" tab skills can be filtered and edited. Skills can be grouped as synonyms under their original skill. The list has pagination by 10/25/50 skills per page. Under the "suggested synonym groups" tab functionality to search for synonym groups based on text similarity can be triggered. Later suggested groups can be approved or disregarded.

### scripts

#### experience assemble

**Language:** TypeScript.

**Functionality:** Reads files from the `data/experience` folder and generates the `website/data/experience.ts` file that is used for loading "Experience Chronology" page.

#### thoughts assemble

**Language:** TypeScript.

**Functionality:** Reads list.txt file from the `data/knowledge-sources` folder. Loads data from each of the folders in the list, changes updatedAt using git file date for content.json files, stores files under `website/assets/knowledge-sources` folder. Updates `website/data/knowledge-sources-index.ts`: increments bustCache, indexes files by their status, type, access, categories.

#### projects assemble

**Language:** TypeScript.

**Functionality:** Reads files from `data/projects` folder for each of the website languages. Converts files from markdown format to html. Stores new files under `website/assets/projects` folder. Generates index at `website/data/projects-index.ts`.

#### format notes

Translate notes exported from Page Notes extension and prepare for website.

**Languages:** Python.

**Libraries:** requests.

**Prerequisites:** Export files from the Page Notes extension.

**Requirements:** translate service up and running locally at port 8001.

**Functionality:** Reads files from the `scripts/pytools/notes` folder. Assumes that content is in english. For each page from the files sends notes to the translate service and stores in a separate folder `{file_idx}-{page_idx}` under the `scripts/pytools/formatted` folder. Result is split into `meta.json` and `content.json` files. `meta.json` contains meta data like url, while `content.json` contains list of the translated notes.

After manual check of the translations the files are moved into the `data/knowledge-sources` folder.

### GitHub Actions

#### Deploy GitHub Pages

Builds and deploys /website on GitHub Pages.
</details>