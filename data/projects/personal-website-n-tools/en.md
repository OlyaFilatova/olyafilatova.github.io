# olyafilatova.github.io - Personal website and tools

The project is a monorepo that includes website sources, chrome extension to store page notes, various tools for preparing content and helper services.

The main goal of this project is to store my notes and thoughts without additional cost for hosting. Thus I decided to use GitHub pages based on public repo; the tools that require additional compute (eg. translate) are used only locally and storage solutions are either browser-based or are the static website content.

## Tech stack

Languages: TypeScript, Python.

Front-end: React.js, Manifest V3.

Infrastructure: Docker, docker-compose, GitHub Pages, GitHub Actions, monorepo (pnpm, uv).

## Project breakdown

### Website

Deployed on GitHub Pages, written using React.js with Functional Components.

Written in two languages: ukrainian and english. After using the language switch, the chosen language is stored in the browser cache.

Pages: main page, notes on knowledge sources, projects, experience history.

Content for pages is stored in the assets folders either as .json or .html files and loaded on-demand. Pages "projects" and "notes" use generated index objects to request content.

Preparation of the website before deploying uses tools "experience assemble", "thoughts assemble", "projects assemble".

### Services

#### Parse GitHub issue
#### Markdown to HTML
#### Translate

### Chrome extensions

#### Page notes

### scripts

#### experience assemble
#### thoughts assemble
#### projects assemble
#### format notes

### GitHub Actions

#### Deploy GitHub Pages
