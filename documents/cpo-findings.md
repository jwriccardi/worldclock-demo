# CPO Findings: World Clock Demo — Issue Analysis

**Date:** 2026-04-23  
**Author:** Chief Product Officer (AI-assisted)  
**Repo:** jwriccardi/worldclock-demo

---

## Executive Summary

The World Clock Demo is a polished, zero-dependency single-page application deployed on Google Cloud Run. It displays live time across 6 global cities with a clean dark-themed UI. The GitHub issue backlog defines a well-structured 4-feature expansion plan, all gated behind a shared Foundation layer.

---

## Current State

- **App:** Single `index.html` (17KB) — embedded CSS + vanilla JS, no build step
- **Infrastructure:** nginx on Cloud Run, GitHub Actions CI/CD, Google Artifact Registry
- **UI:** Dark-themed 3-column grid, `Intl.DateTimeFormat` for timezones, 1-second tick loop
- **Tech debt:** `AGENTS.md` incorrectly states "greenfield project — no existing source code yet"
- **Testing:** None currently

---

## Issue Landscape

### Issue Hierarchy

```
#1 New Features (parent)
├── #2 Foundation [PREREQUISITE — gates all Build phases]
│   ├── #7  Research: Tooling survey & architecture
│   ├── #8  Spec: Requirements & file layout
│   ├── #9  Test Design: Test harness + CI gate
│   ├── #10 Build: Implement test framework, state util, module split
│   └── #11 Deploy: Roll to main + verify no regression
│
├── #3 Analog Clock Toggle
│   ├── #12 Research: SVG vs Canvas, 6-city performance
│   ├── #13 Spec: Toggle UX, per-card vs global, a11y
│   ├── #14 Test Design: Hand-angle math + visual snapshot
│   ├── #15 Build: Implement toggle + analog renderer
│   └── #16 Deploy: Verify both modes on prod (mobile + desktop)
│
├── #4 Visual Themes
│   ├── #17 Research: Token inventory + WCAG contrast audit
│   ├── #18 Spec: Theme catalog + selector UX
│   ├── #19 Test Design: Contrast + persistence + snapshot tests
│   ├── #20 Build: Implement theme system + selector UI
│   └── #21 Deploy: Verify each theme on prod, check FOUC
│
├── #5 Educational Content Panels
│   ├── #22 Research: Sources + reading level per topic
│   ├── #23 Spec: Panel pattern + content + a11y
│   ├── #24 Test Design: Content lint + a11y tests
│   ├── #25 Build: Implement panels + author 5 topics
│   └── #26 Deploy: Verify panels on prod
│
└── #6 Timers & Stopwatches
    ├── #27 Research: Timing accuracy + background-tab drift
    ├── #28 Spec: UX + state model (multi-instance?)
    ├── #29 Test Design: Timing accuracy + state machine tests
    ├── #30 Build: Implement stopwatch + timer widgets
    └── #31 Deploy: Release + verify in prod
```

---

## Dependency Analysis

| Phase | Foundation | Analog | Themes | Edu | Timers |
|-------|-----------|--------|--------|-----|--------|
| Research | ← can start now | ← can start now | ← can start now | ← can start now | ← can start now |
| Spec | depends on Research | depends on Research | depends on Research | depends on Research | depends on Research |
| Test Design | depends on Spec | depends on Spec | depends on Spec | depends on Spec | depends on Spec |
| **Build** | **independent** | **blocked by #10** | **blocked by #10** | **blocked by #10** | **blocked by #10** |
| Deploy | blocked by Build | blocked by Build | blocked by Build | blocked by Build | blocked by Build |

**Key insight:** Foundation Build (#10) is the critical path gate. All 4 feature builds are blocked until it merges.

---

## Feature Assessment

### Foundation (#2) — CRITICAL PATH
- **Value:** Infrastructure prerequisite — enables everything else
- **Risk:** Architectural decision (single file vs split) has downstream implications for ALL features
- **CPO Recommendation:** Prioritize immediately. Lean toward Vite + module split for long-term health. Keep current single-file for initial deploy verification.

### Analog Clock (#3) — HIGH ENGAGEMENT
- **Value:** Visual delight; differentiates from plain text clocks
- **Risk:** Low — well-understood SVG/Canvas rendering
- **CPO Recommendation:** Ship first after Foundation. Strong visual impact, simple state model.

### Visual Themes (#4) — HIGH RETENTION
- **Value:** Personalization drives return visits; WCAG compliance opens accessibility market
- **Risk:** Medium — FOUC (flash of unstyled content) requires careful inline script
- **CPO Recommendation:** Ship second. Midnight default already exists; themes layer cleanly.

### Educational Panels (#5) — STRATEGIC DIFFERENTIATION
- **Value:** Unique positioning — transforms a utility into a learning tool
- **Risk:** Low-code, high-content — bottleneck is content quality not engineering
- **CPO Recommendation:** Ship third. Parallel content authoring can start during Foundation build.

### Timers & Stopwatches (#6) — UTILITY EXPANSION
- **Value:** High utility; extends daily use beyond just "checking the time"
- **Risk:** Medium — background-tab throttling on mobile Safari is a real constraint
- **CPO Recommendation:** Ship fourth. Most complex feature; research phase critical for audio/notification APIs.

---

## CPO Strategic Observations

1. **The 5-phase methodology is excellent** — Research → Spec → Test → Build → Deploy prevents spec-less implementation and ensures quality gates.

2. **Parallelization opportunity:** All four feature Research and Spec phases can run concurrently with Foundation work. This compresses the timeline significantly.

3. **Content risk for Edu:** Educational copy quality matters enormously for brand perception. Source curation and tone decisions in Research (#22) deserve CPO-level attention.

4. **Mobile Safari is a recurring theme:** Background-tab drift (#27), analog rendering on iOS (#16), and theme persistence on iOS — mobile Safari testing must be a first-class concern in every Deploy phase.

5. **AGENTS.md accuracy:** Issue #10 flags that `AGENTS.md` currently has stale content. This should be fixed in the Foundation Build as specified.
