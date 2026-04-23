# worldclock-demo

## Purpose
A self-contained World Clock web application used to demonstrate Claude Code and GitHub workflows. The frontend is modularized using ES Modules and served by nginx inside a Docker container.

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

### Testing Requirements
- **Automated Tests**: Always run `npm test` after modifying `clock.js` or `store.js`. Add new tests for new logic.
- **Manual Verification**: Validate UI changes by opening `index.html` in a browser or building the Docker container.

### Common Patterns
- **Styling**: Use CSS variables in `styles.css`.
- **Logic**: Keep UI logic in `app.js` and pure math/data in `clock.js`.
- **State**: Use `store.js` for anything needing persistence.
