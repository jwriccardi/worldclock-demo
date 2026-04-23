<!-- Generated: 2026-04-23 | Updated: 2026-04-23 -->

# worldclock-demo

## Purpose
A dark-themed World Clock web application displaying real-time local times for six cities. Built with vanilla JS ES modules, bundled by Vite into a single-file HTML output, deployed via Docker/nginx to Cloud Run.

## Architecture

### Build System
- **Vite** (`vite.config.js`) - Dev server and production bundler
- **Vitest** - Unit test runner with jsdom environment
- `npm run dev` - Start local dev server (hot reload)
- `npm run build` - Production build to `dist/index.html` (all assets inlined)
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run coverage` - Run tests with V8 coverage

### Source Modules (`src/`)

| File | Purpose |
|------|---------|
| `src/main.js` | Entry point - mounts cards, starts tick loop |
| `src/cities.js` | City data array (name, country, IANA timezone) |
| `src/formatters.js` | Intl.DateTimeFormat cache and time/date formatting |
| `src/card.js` | DOM builder for individual clock cards |
| `src/tick.js` | Creates the 1-second update function |
| `src/dom.js` | Tiny `el()` helper for createElement |
| `src/store.js` | localStorage wrapper with `wc.settings.*` namespace |
| `src/styles/tokens.css` | CSS custom properties (design tokens) |

### store.js API

```js
import { get, set, remove, subscribe } from './store.js';

get(key, defaultValue)    // Read from wc.settings.{key}
set(key, value)           // Write JSON to wc.settings.{key}, notify subscribers
remove(key)               // Delete wc.settings.{key}
subscribe(key, fn)        // Listen for changes; returns unsubscribe function
```

### Tests (`tests/`)

| File | Coverage |
|------|----------|
| `tests/store.test.js` | store.js - get/set/remove/subscribe (8 tests) |

### Deployment

| File | Purpose |
|------|---------|
| `Dockerfile` | Two-stage build: Node 20 (build) -> nginx 1.25 (serve) |
| `nginx.conf` | nginx config for port 8080 |
| `.github/workflows/test.yml` | CI gate - runs `npm test` on PRs and main pushes |
| `.github/workflows/deploy.yml` | Cloud Run deployment via Google Cloud |

### Key Files

| File | Description |
|------|-------------|
| `index.html` | App shell with CSS (no inline JS) - Vite entry |
| `package.json` | Dependencies: vite, vitest, jsdom |
| `vite.config.js` | Build config: inline all assets, jsdom test env |

## For AI Agents

### Working In This Directory
- All source code is in `src/` as ES modules
- CSS design tokens are in `src/styles/tokens.css`; component CSS remains in `index.html` `<style>` block
- The `id="clock-grid"` element in index.html is populated by `src/main.js`
- Vite inlines everything into a single `dist/index.html` for production

### Testing Requirements
- All new modules should have corresponding tests in `tests/`
- Tests run in jsdom environment with Vitest globals enabled
- Run `npm test` before committing

### Common Patterns
- Formatter caching in `src/formatters.js` (Intl objects are expensive to create)
- DOM building via `el()` helper - no innerHTML usage
- State persistence via `src/store.js` with `wc.settings.*` namespace
- CSS custom properties defined in `src/styles/tokens.css`

## Dependencies

### External (devDependencies)
- `vite` ^6.0.0 - Build tool and dev server
- `vitest` ^2.0.0 - Test runner
- `@vitest/coverage-v8` ^2.0.0 - Coverage provider
- `jsdom` ^25.0.0 - DOM environment for tests

<!-- MANUAL: -->
