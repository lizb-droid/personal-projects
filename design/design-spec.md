# Liz Performance App — UI Redesign Specification
**Version 1.0 · June 2026 · Prepared by: Designer Agent (Nike Digital)**
**Status: PROPOSAL — Liz has final vote on every decision in this document. Nothing here is locked.**

**Figma file:** https://www.figma.com/design/0bxqPqBglqRn29vvnCqrXo/Body-optimization-design-system?node-id=57-2&t=gVyaFa5faYEkng5K-1

---

## Overview

This document proposes a UI redesign of the existing workout tracker into a unified daily performance app. The workout logic, data model, and program content remain untouched. Everything here is additive UI — a new shell that houses the existing workout tracker alongside three new sections: Daily Log, Recovery, and Weekly Check-In.

Design principle: **five-AM-proof**. Every action takes one thumb, every screen loads instantly, every input is reachable without scrolling.

---

## 1. Navigation Architecture

### Bottom Tab Bar — 4 Tabs

```
[ Today ]  [ Workout ]  [ Log ]  [ Week ]
```

- Persistent bottom tab bar pinned above safe area
- Tab labels: DM Mono uppercase 10px, tracked wide
- Active: #e8006f. Inactive: #999999
- Active indicator: 2px top line in #e8006f
- Touch target: 44pt height minimum, full quarter-width

---

## 2. Header

```
LIZ                              [Phase 2]
MONDAY · JUNE 8 · WEEK 6 OF 17
```

- "LIZ": Bebas Neue 22px #111111
- Phase badge: #e8006f pill, white DM Mono 10px
- Date: DM Mono 11px #999999
- Background: #fafafa with backdrop-filter blur 8px

---

## 3. Today Screen (Tab 1 — Default Landing)

Three status cards stacked vertically.

### Card 1 — Workout Status (dark)
- Background: #111111
- Session name: Bebas Neue 26px white
- Progress bar: #00bcd4 fill, #333333 track, 6pt height
- Tap → Workout tab scrolled to today's day card

### Card 2 — Nutrition Status (light)
- Macro progress bars: #e8006f fill → #00bcd4 at 100% → #f59e0b at >110%
- Shows P / C / F vs targets + calorie total

### Card 3 — Recovery + Milk (light)
- Scores: Bebas Neue 24px #111111
- Milk indicator dot: green (Normal), yellow (Slightly lower), red (Lower)

### Card Specs
- Border radius: 12pt | Padding: 16pt | Gap: 12pt | Side margins: 16pt

---

## 4. Daily Log Screen (Tab 3)

### Quick Log Mode (default)

**Nutrition section:**
- Pill inputs: DM Mono 18px, #f5f5f5 bg, 80px wide, focus border 1px #e8006f
- Pre-WO fuel: 2 pill buttons YES/NO, 44pt height

**Recovery section:**
- 4 rows (Sleep / Energy / Soreness / Stress)
- 10 circles per row, full width
- Selected: #e8006f fill, white DM Mono 12px. Unselected: #f5f5f5
- Instant state swap — no animation (speed at 5 AM)

**Milk supply section:**
- 4 pills: Normal / Slightly lower / Lower / Higher
- Selected: #e8006f fill white DM Mono 12px

**Save button:** Full width, 52pt height, #e8006f, white Bebas Neue 20px, sticky above tab bar

### Full Entry Mode (toggled)
Expands to individual meal slots with P/C/F inputs. Auto-calculates totals.

---

## 5. Workout Screen (Tab 2)

All existing logic preserved. Visual refinements only:
- Phase tabs: 44pt height, DM Mono 12px uppercase, active = #e8006f underline
- Week tab for current live week: small #00bcd4 dot below number
- Today's day card: 3pt left border #e8006f
- Rest timer button: minimum 44pt tall, DM Mono 20px countdown
- Export/Import: prominent and easy to reach — Liz backs up daily to Notes

---

## 6. Weekly Check-In Screen (Tab 4)

**Monday (edit mode):**
- Weight entry, session checklist, nutrition + recovery averages (auto-calculated)
- Reflection fields: wins, challenges, questions for the team

**Tue–Sun (read-only):**
- Most recent check-in as static data
- 7-day sparklines: SVG polylines, 80×24pt
  - Nutrition lines: #e8006f | Recovery lines: #00bcd4

---

## 7. Component Specifications

### Macro Progress Bar
- Height: 6pt | Track: #ebebeb | Fill: #e8006f → #00bcd4 at 100% → #f59e0b at >110%

### Recovery Score Selector
- 10 circles, calculated width to fill available space
- No animation — instant for speed

### Pill Input
- Background: #f5f5f5 | Focus border: 1px #e8006f | Border radius: 8pt
- Font: DM Mono 18px center-aligned | Use `inputMode="decimal"`

### Bottom Sheet
- Overlay: #00000066, tap to close
- Sheet: white, border-radius 16pt top, slides up 300ms ease-out

---

## 8. Color Tokens (Current — Liz may change)

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#e8006f` | Primary actions, active states |
| `--teal` | `#00bcd4` | Secondary, workout progress |
| `--bg` | `#fafafa` | Screen background |
| `--surface` | `#ffffff` | Cards, inputs |
| `--border` | `#ebebeb` | Dividers, card borders |
| `--text` | `#111111` | Primary text |
| `--muted` | `#999999` | Secondary labels |
| `--input-bg` | `#f5f5f5` | Pill input backgrounds |
| `--warning` | `#f59e0b` | Over macro target |

## 9. Typography (Current — Liz may change)

| Role | Font | Size |
|---|---|---|
| Screen titles | Bebas Neue | 22px |
| Session names / PRs | Bebas Neue | 18–26px |
| Score values | Bebas Neue | 20–24px |
| Labels / data | DM Mono | 10–13px |
| Inputs | DM Mono | 16–20px |
| Body / notes | DM Sans | 14px |

---

## 10. Developer Implementation Notes

- Tab switching: instant, no animation
- Save button feedback: 300ms #00bcd4 pulse then back to #e8006f
- Keyboard detection: `window.visualViewport` resize → hide tab bar when keyboard open
- `inputMode="decimal"` throughout
- New data storage: keyed by date (`daily-log-YYYY-MM-DD`) and week (`checkin-YYYY-WNN`)
- Existing localStorage keys preserved (`lizdone2`, `lizweights2`, `liznotes2`, `lizprs2`, `lizweek2`)
