# World Clock Demo — Product Roadmap

**Version:** 1.0  
**Date:** 2026-04-23  
**Owner:** Chief Product Officer  
**Horizon:** Q2–Q4 2026

---

## Vision

Transform World Clock Demo from a beautiful utility into the world's most delightful, educational, and personalized time-awareness app — shipped with engineering rigor and zero compromise on accessibility.

---

## North Star Metrics

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 95 |
| WCAG Accessibility | AA compliant across all themes |
| Test Coverage | > 80% of new features |
| Mobile Safari parity | No feature degradation vs desktop |
| Page load (Cold start) | < 1s on 4G |

---

## Release Plan

### Phase 0 — Foundation (Q2 2026, Weeks 1–4)
**Milestone:** Infrastructure complete, CI/CD gates enabled

| Issue | Title | Priority |
|-------|-------|----------|
| #7 | Research: Tooling survey & architecture | CRITICAL |
| #8 | Spec: Requirements & file layout | CRITICAL |
| #9 | Test Design: Test harness + CI gate | CRITICAL |
| #10 | Build: Implement test framework, state util, module split | CRITICAL |
| #11 | Deploy: Verify on Cloud Run | CRITICAL |

**Deliverables:**
- Test framework (Vitest recommended) wired to CI
- `store.js` — shared localStorage state utility
- CSS token structure extracted for theme layering
- `AGENTS.md` updated to reflect actual codebase
- No visual regression from current prod

**Parallelization opportunity:** While Foundation Research/Spec/Test are in flight, begin Research phases for Analog (#12), Themes (#17), Edu (#22), and Timers (#27) simultaneously.

---

### Phase 1 — Analog Clock Toggle (Q2 2026, Weeks 5–8)
**Milestone:** Users can switch between digital and analog display

| Issue | Title | Priority |
|-------|-------|----------|
| #12 | Research: SVG vs Canvas, 6-city performance | HIGH |
| #13 | Spec: Toggle UX, per-card vs global, a11y | HIGH |
| #14 | Test Design: Hand-angle math + visual snapshot | HIGH |
| #15 | Build: Toggle + analog renderer | HIGH |
| #16 | Deploy: Verify both modes on prod | HIGH |

**Deliverables:**
- Analog face for all 6 cities (SVG recommended for CSS theming)
- Global toggle with `aria-pressed`, keyboard accessible
- Smooth mode transition, `prefers-reduced-motion` respected
- Mode persisted via `store.js`
- Visual snapshot tests at 3 known timestamps

**Design principle:** Analog faces must be beautiful — hand-crafted SVG proportions, not generic. This is a brand moment.

---

### Phase 2 — Visual Themes (Q2–Q3 2026, Weeks 7–12)
**Milestone:** Users can personalize their clock experience

| Issue | Title | Priority |
|-------|-------|----------|
| #17 | Research: Token inventory + WCAG contrast audit | HIGH |
| #18 | Spec: Theme catalog + selector UX | HIGH |
| #19 | Test Design: Contrast + persistence + snapshots | HIGH |
| #20 | Build: Theme system + selector UI | HIGH |
| #21 | Deploy: Each theme on prod, FOUC check | HIGH |

**Deliverables:**
- 4 themes: Midnight (default), Daylight, High Contrast, Sepia
- `[data-theme="…"]` on `<html>`, inline pre-paint script prevents FOUC
- `prefers-color-scheme` respected on first load; user override persists
- WCAG AA contrast for every theme token combination
- Theme selector in header (keyboard accessible)

**Themes catalog:**
- **Midnight** (current) — deep navy + accent blue
- **Daylight** — warm white + amber accents
- **High Contrast** — pure black + white, max accessibility
- **Sepia** — warm parchment tones, eye-strain reduction

**Note:** Themes and Analog can run in parallel — they share only the CSS token layer, which Foundation establishes.

---

### Phase 3 — Educational Content Panels (Q3 2026, Weeks 13–18)
**Milestone:** App teaches as well as displays

| Issue | Title | Priority |
|-------|-------|----------|
| #22 | Research: Sources + reading level per topic | MEDIUM |
| #23 | Spec: Panel pattern + content + a11y | MEDIUM |
| #24 | Test Design: Content lint + a11y tests | MEDIUM |
| #25 | Build: Panels + 5 topic content | MEDIUM |
| #26 | Deploy: Verify panels on prod | MEDIUM |

**Deliverables:**
- 5 educational topics: Timezones, DST, Spacetime/Relativity, Leap Year & Second, Atomic Clocks
- Panel pattern: drawer (recommended — least disruptive to clock grid)
- Entry via info icons on each city card + "Learn" menu in header
- Authoritative sources: IERS, NIST, IANA tz database
- Full a11y: focus trap, Escape closes, focus returns to trigger
- Reading level: accessible adult (~8th grade)

**Content strategy:** Partner with authoritative sources. Link out. 100–200 words per topic — dense enough to be useful, brief enough to respect attention.

---

### Phase 4 — Timers & Stopwatches (Q3–Q4 2026, Weeks 17–24)
**Milestone:** World Clock becomes a full time-management companion

| Issue | Title | Priority |
|-------|-------|----------|
| #27 | Research: Timing accuracy + background-tab drift | MEDIUM |
| #28 | Spec: UX + state model (multi-instance?) | MEDIUM |
| #29 | Test Design: Accuracy + state machine tests | MEDIUM |
| #30 | Build: Stopwatch + timer widgets | MEDIUM |
| #31 | Deploy: Release + verify on prod | MEDIUM |

**Deliverables:**
- Stopwatch: start / stop / lap / reset
- Countdown timer: duration input, start / pause / reset, audible + visual alert on completion
- Persistence across hard reloads (timestamp-delta model, not counter)
- Single stopwatch + single timer (multi-instance deferred to v2)
- Reuse existing tick loop at `index.html:521–541`
- Audio: Web Audio API with `<audio>` fallback; autoplay policy handled
- Notification API: prompt once, degrade gracefully if denied

**Risk:** Mobile Safari background-tab throttling is the biggest unknown. Research phase must resolve timing model before spec is locked.

---

## Parallel Work Streams

```
WEEK:  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
       ├──Foundation Research+Spec──┤
       │        ├──Foundation Build+Deploy──┤
       │
       ├──Analog Research+Spec─────────┤
       │              ├──Analog Build+Deploy──────┤
       │
       ├──Themes Research+Spec────────────────┤
       │                    ├──Themes Build+Deploy──────────┤
       │
       ├──Edu Research+Spec───────────────────────────┤
       │                         ├──Edu Build+Deploy─────────────────┤
       │
       ├──Timers Research+Spec────────────────────────────────┤
                                      ├──Timers Build+Deploy──────────────────┤
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Foundation architectural choice (single file vs split) delays everything | Medium | HIGH | Decide in Research phase; prototype both quickly |
| Mobile Safari background-tab throttling breaks Timers | High | Medium | Research phase must test before spec lock |
| FOUC in Themes on slow connections | Medium | Medium | Inline pre-paint script in `<head>` |
| Educational copy quality below bar | Medium | Medium | CPO reviews all 5 topics before ship |
| Analog SVG rendering perf on low-end mobile | Low | Medium | Research phase benchmarks 6 simultaneous SVG clocks |

---

## Success Criteria (All Phases Complete)

- [ ] All 25 sub-issues closed (##7–31)
- [ ] CI/CD gate: PRs blocked when tests fail
- [ ] All 4 features ship with WCAG AA compliance
- [ ] Zero regressions in digital clock mode throughout
- [ ] Cloud Run health check `/healthz` always green
- [ ] `AGENTS.md` accurately reflects codebase at each milestone
