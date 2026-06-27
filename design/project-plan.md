# App Redesign — Project Plan
**Updated: June 2026 · Design + build in parallel · One tab at a time**

---

## What's Done ✓

| Deliverable | Owner | Status |
|---|---|---|
| Design system — tokens.css | Designer | ✓ Done |
| Design system — design-system.md | Designer | ✓ Done |
| Figma variable system (organized, fully connected) | Designer | ✓ Done |
| User flow (strategy + Figma page) | Designer | ✓ Done |
| Workout tab wireframe — Direction B approved | Designer | ✓ Done |
| URL deep link conversational logging | Developer | ✓ Done |
| Existing app (1,130 lines) | Developer | ✓ Base |

---

## Phase 1 — Workout Tab
**Design → Build → Ship tab 1**

### Design (Designer)
- [ ] Session view — all states (loading, active, paused)
- [ ] Exercise card — collapsed, expanded, completed states
- [ ] Set tracker — empty, active, logged, all-done
- [ ] Rest timer overlay
- [ ] Session complete screen
- [ ] Edge cases: skip exercise, add note, first workout ever

### Build (Developer)
- [ ] New app shell — 3-tab navigation with light design system
- [ ] Design token implementation in React (CSS vars from tokens.css)
- [ ] Workout tab — session header + 17-week progress bar
- [ ] Exercise accordion (expand/collapse)
- [ ] Set tracker — tap to log, weight input
- [ ] Rest timer
- [ ] Session complete state
- [ ] localStorage schema for workout data

---

## Phase 2 — Program Tab
**Design → Build → Ship tab 2**

### Design (Designer)
- [ ] 17-week timeline view — phase markers, current week highlight
- [ ] Week badges — deload, luteal, race weeks
- [ ] Week detail — session cards for Mon–Sat
- [ ] Session preview — read-only exercise list
- [ ] "Start This Session" CTA → handoff to Workout tab

### Build (Developer)
- [ ] Program tab
- [ ] Phase + week data model
- [ ] Timeline scroll/navigation
- [ ] Session preview screen
- [ ] Cross-flow: "Start This Session" loads session into Workout tab

---

## Phase 3 — Log Tab
**Design → Build → Ship tab 3**

### Design (Designer)
- [ ] Quick log form — pre-WO fuel toggle, macro inputs
- [ ] Recovery score circles (sleep, energy, soreness, stress)
- [ ] Milk + notes section
- [ ] Claude import banner (URL deep link pre-fill state)
- [ ] Save confirmation + auto-export prompt

### Build (Developer)
- [ ] Log tab UI
- [ ] localStorage log schema (keyed by date)
- [ ] URL deep link import (already wired — UI polish)
- [ ] Partial save support (5 AM entry + evening completion)
- [ ] Export to Notes (JSON backup)
- [ ] Import from Notes (restore)

---

## Phase 4 — Polish + Ship
**Cross-flows, edge states, iPhone testing, deploy**

### Design + Build
- [ ] Session complete → Log tab soft prompt
- [ ] Program preview → Workout handoff animation
- [ ] Empty states (no workout today, log not started)
- [ ] Error states
- [ ] iPhone Add to Home Screen testing
- [ ] Safari viewport + safe area fixes
- [ ] Performance (no layout jank at 5 AM)
- [ ] Deploy to GitHub Pages
- [ ] Liz adds to Home Screen — daily use begins

---

## How We Work

**Design all tabs first, then build.**

```
Designer specs ALL 3 tabs in Figma
(Workout → Program → Log)
        ↓
Liz reviews + approves all designs
        ↓
Developer builds everything from specs
        ↓
Liz tests on iPhone
        ↓
Iterate → Ship
```

---

## Tab Priority Order
1. **Workout** — daily critical path at 5 AM
2. **Log** — nutrition + recovery data the team needs
3. **Program** — reference, planning, motivation

*Note: Log moved before Program because conversational Claude logging needs the Log tab UI to land properly.*

---

## Design Decisions Locked
- Light gray background: `#F6F6F6` (`--color-bg-light`)
- White cards: `#FFFFFF` with layered shadow
- Border radius: 4px / 8px / pill only
- Accent: Indigo `#4D5FFF`
- 3 tabs: WORKOUT · PROGRAM · LOG
- Font sizes: 9–48px bound to `font-size/*` variables
- Icons: Lucide (outline, 1.5px stroke)
