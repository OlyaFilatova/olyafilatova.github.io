# Page Notes

A Manifest V3 Chrome extension that helps track page notes. All information is stored locally using IndexedDB.

## Install Dependencies

```bash
npm install
```

For Playwright E2E tests, install Chromium once:

```bash
npx playwright install chromium
```

## Build

```bash
npm run build
```

The unpacked Chrome extension is generated in:

```text
dist/
```

## Load In Chrome

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `dist/` folder from this project.

## Test

Run unit and DOM tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run Playwright extension smoke tests:

```bash
npm run test:e2e
```

Run the full test suite:

```bash
npm run test:all
```

## Development Notes

- Source files live in `extension/`.
- Build output lives in `dist/` and is ignored by git.
- Storage is backed by IndexedDB and accessed through a repository abstraction in `extension/shared/storage.ts`.
