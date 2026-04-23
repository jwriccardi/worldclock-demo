# GEMINI.md - World Clock Demo

## Project Overview
**World Clock Demo** is a visually polished, single-page web application that displays live time for six major global cities. It serves as a demonstration project for AI-driven development workflows (Claude Code, Gemini CLI) and modern CI/CD practices using GitHub Actions and Google Cloud Run.

- **Current Version:** 1.0 (Phase 0: Foundation)
- **Status:** Functional prototype with a single-file frontend architecture.
- **Primary Goal:** Provide a "slightly more interesting" Hello World for testing toolchains.

## Technology Stack
- **Frontend:** Vanilla HTML5, CSS3 (Custom Properties), and JavaScript (ES6+).
- **Server:** Nginx 1.25 (Alpine-based).
- **Containerization:** Docker.
- **Deployment:** Google Cloud Run.
- **CI/CD:** GitHub Actions.

## Architecture
The project currently follows a **Single-File Application** pattern:
- **`index.html`**: Contains all structure, styling (embedded CSS), and logic (embedded JS).
- **`nginx.conf`**: Configured for performance (gzip) and reliability (health checks).
- **Infrastructure:** Containerized via a simple `Dockerfile` and deployed as a stateless service.

**Planned Evolution (Roadmap Q2 2026):**
- Transition to a modular file structure (splitting CSS/JS).
- Implementation of a test harness (Vitest).
- Addition of a state management utility (`store.js`).

## Building and Running

### Local Development
1.  **Direct Browser Access:** Open `index.html` directly in any modern browser for immediate UI/UX feedback.
2.  **Docker Preview:**
    ```bash
    docker build -t worldclock .
    docker run -p 8080:8080 worldclock
    ```
    Access the app at `http://localhost:8080`.

### Health Checks
- The server exposes a health endpoint at `/healthz` which returns `200 ok`. This is critical for Cloud Run deployment.

## Development Conventions

### Coding Style
- **Single-File Priority:** Until Phase 1 of the roadmap is initiated, all frontend changes should be made directly in `index.html`.
- **CSS Variables:** Use the custom properties defined in `:root` (e.g., `--accent-primary`, `--bg-card`) to maintain theme consistency.
- **Vanilla JS:** Avoid external libraries or frameworks. Use browser-native APIs (e.g., `Intl.DateTimeFormat`, `setInterval`).
- **Formatting:** Maintain the clean, commented structure found in the current `index.html`.

### Accessibility (a11y)
- Target: **WCAG AA compliance**.
- Use semantic HTML (e.g., `<article>`, `<header>`, `aria-label`).
- Ensure high contrast and keyboard navigability.

### Testing
- **Manual:** Verify UI changes across different screen sizes (responsive design) and browser engines.
- **Automated:** None currently implemented. Implementation of Vitest is planned for the next phase.

## Key Files
- `index.html`: The core application.
- `Dockerfile` & `nginx.conf`: Container and server configuration.
- `AGENTS.md`: Specialized instructions for AI agents working on this repo.
- `documents/product-roadmap.md`: Detailed future feature plans and milestones.

## AI Agent Guidance
- **Port:** Always use port **8080** for the web server.
- **Deployment:** CI/CD is handled via `.github/workflows/deploy.yml`. Do not modify deployment logic without consulting the roadmap.
- **Design:** The UI uses a "Midnight" dark theme. Refer to `index.html` styles for the exact color palette.
- **Persistence:** Future state (themes, toggles) should use `localStorage`.
