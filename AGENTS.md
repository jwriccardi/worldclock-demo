<!-- Generated: 2026-04-23 | Updated: 2026-05-01 -->

# worldclock-demo

## Purpose
A self-contained World Clock web application used to demonstrate Claude Code and GitHub workflows. The frontend is modularized using ES Modules and served by nginx inside a Docker container. Deployed to Google Cloud Run at `clock.johnriccardi.com` with auto-deployment from GitHub Actions.

## Key Files

| File | Description |
|------|-------------|
| `index.html` | App entry point: minimal HTML structure linking to `styles.css` and `app.js` |
| `styles.css` | All styling: dark-themed UI with CSS custom properties |
| `app.js` | UI orchestration: DOM building and live update loop |
| `clock.js` | Business logic: City definitions and time formatting math |
| `store.js` | Persistence: Simple utility for `localStorage` |
| `tests/` | Unit tests for `clock.js` and `store.js` using Vitest |
| `Dockerfile` | Copies all modular files into `nginx:1.25-alpine`, exposes port 8080 |
| `nginx.conf` | nginx config: listens on 8080, serves files with gzip and health checks |
| `.dockerignore` | Excludes .git, .github, .claude, *.md from container image |
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD — builds container, deploys to Cloud Run on push to main |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `.github/` | GitHub Actions CI/CD workflows |
| `tests/` | Unit tests for the application logic |
| `documents/` | Product roadmap, research, and findings |

## For AI Agents

### Working In This Directory
- **Modular Architecture**: The app is split into `app.js`, `clock.js`, `store.js`, and `styles.css`.
- **ES Modules**: Production uses browser-native ES Modules. No build step (Babel/Webpack) is used for the app itself.
- **Port**: nginx listens on **8080**.
- **Testing**: Run `npm test` to execute the Vitest suite.
- Any push to `main` triggers auto-deploy via GitHub Actions.

### Deployment
- **GCP Project:** `johnriccardi-com`
- **Region:** `us-central1`
- **Service:** `worldclock` on Cloud Run
- **Domain:** `clock.johnriccardi.com`
- **Image:** `us-central1-docker.pkg.dev/johnriccardi-com/worldclock/app`
- **Auth:** Workload Identity Federation (keyless, no secrets in GitHub)

### Testing Requirements
- **Automated Tests**: Always run `npm test` after modifying `clock.js` or `store.js`. Add new tests for new logic.
- **Manual Verification**: Validate UI changes by opening `index.html` in a browser or building the Docker container.
- **Deployment check**: `curl -I https://clock.johnriccardi.com`

### Common Patterns
- **Styling**: Use CSS variables in `styles.css`.
- **Logic**: Keep UI logic in `app.js` and pure math/data in `clock.js`.
- **State**: Use `store.js` for anything needing persistence.
- Timezone handling via `Intl.DateTimeFormat` with IANA timezone IDs.

## Dependencies

### External
- nginx:1.25-alpine (container base image)
- Vitest (dev dependency for testing)

<!-- MANUAL: -->
