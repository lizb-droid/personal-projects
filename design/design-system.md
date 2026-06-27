# Liz Performance App — Design System
**Version 2.0 · June 2026**
**Status: LOCKED (Liz approved). See tokens.css for implementation values.**

---

## Overview

Dark performance aesthetic. Nike Training Club energy on a pure black canvas. Every decision optimized for 5 AM, one thumb, iPhone Safari.

---

## Fonts

| Role | Family | Weight | Usage |
|---|---|---|---|
| Display | Barlow Condensed | 700 | Session names, section headers, PR values |
| Display | Barlow Condensed | 600 | Card titles, metric labels |
| Mono | Space Mono | 400 | Data labels, tags, week/phase badges |
| Mono | Space Mono | 700 | Emphasized data values |
| Body | Barlow | 400 | Notes, body copy, descriptions |
| Body | Barlow | 500 | UI labels, button text |

**Google Fonts import:**
```
https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500&family=Space+Mono:wght@400;700&display=swap
```

**Typographic conventions:**
- Barlow Condensed is almost always `text-transform: uppercase` and `letter-spacing: 0.02–0.06em`
- Space Mono labels: `text-transform: uppercase`, `letter-spacing: 0.10–0.14em`
- Never mix Barlow Condensed and Space Mono at the same hierarchy level — one leads, one supports

---

## Type Scale

| Token | Value | Typical role |
|---|---|---|
| `--text-xs` | 10px | Space Mono micro labels, tags |
| `--text-sm` | 12px | Space Mono secondary labels |
| `--text-base` | 14px | Barlow body copy, notes |
| `--text-md` | 16px | Barlow UI labels, button text |
| `--text-lg` | 20px | Barlow Condensed card subheadings |
| `--text-xl` | 24px | Barlow Condensed metric values |
| `--text-2xl` | 32px | Barlow Condensed section headers |
| `--text-3xl` | 40px | Barlow Condensed display numbers |
| `--text-4xl` | 48px | Barlow Condensed hero/PR values |

---

## Color

### Backgrounds — Dark (existing performance system)

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0f0f0f` | App canvas |
| `--color-surface-1` | `#141414` | Cards |
| `--color-surface-2` | `#1c1c1c` | Nested cards, inputs |
| `--color-surface-3` | `#242424` | Hover states |
| `--color-surface-4` | `#2e2e2e` | Borders on hover |

### Backgrounds — Light (new app redesign, approved June 2026)

| Token | Value | Usage |
|---|---|---|
| `--color-bg-light` | `#F6F6F6` | App canvas — super light gray |
| `--color-surface-light` | `#ffffff` | Cards — white on gray, separated by shadow |
| `--color-surface-light-2` | `#F0F0F0` | Pressed / hover states |
| `--color-border-light` | `rgba(0,0,0,0.04)` | Hairline card border |

### Borders

| Token | Value | Usage |
|---|---|---|
| `--color-border` | `#222222` | Default card/input border |
| `--color-border-subtle` | `#1a1a1a` | Dividers |
| `--color-border-strong` | `#333333` | Emphasized |

### Text

| Token | Value | Contrast | Usage |
|---|---|---|---|
| `--color-text-primary` | `#ffffff` | 19.2:1 AAA | Headings, values |
| `--color-text-secondary` | `#a3a3a3` | 7.6:1 AAA | Supporting labels |
| `--color-text-tertiary` | `#7b7b7b` | 4.5:1 AA | Muted, disabled — **was #555555, updated for ADA** |
| `--color-text-inverse` | `#0f0f0f` | — | Text on light/colored bg |

### Brand & Semantic — 5-Color Palette (Locked June 2026)

Each color owns a specific data domain for instant at-a-glance reads.

| Token | Value | Domain | Usage |
|---|---|---|---|
| `--color-coral` | `#FF6230` | Primary / Protein | CTA buttons, active tab, protein macro bar |
| `--color-coral-dim` | `rgba(255,98,48,0.12)` | — | Coral tint backgrounds |
| `--color-pink` | `#FF9BD7` | Milk supply | Milk status dot, milk card accent |
| `--color-pink-dim` | `rgba(255,155,215,0.12)` | — | Pink tint backgrounds |
| `--color-indigo` | `#4D5FFF` | Workout / Carbs | Progress bars, borders, large text only (4.01:1 — not for small text) |
| `--color-indigo-text` | `#566BFF` | Workout / Carbs | Indigo labels &lt;18px — ADA AA 4.51:1 |
| `--color-indigo-dim` | `rgba(77,95,255,0.12)` | — | Indigo tint backgrounds |
| `--color-mint` | `#00E87A` | Recovery / Sleep | Recovery scores, sleep data, 100% macro hit |
| `--color-mint-dim` | `rgba(0,232,122,0.12)` | — | Mint tint backgrounds |
| `--color-yellow` | `#DADF0A` | Fat / Weekly data | Fat macro bar, weekly sparklines |
| `--color-yellow-dim` | `rgba(218,223,10,0.12)` | — | Yellow tint backgrounds |
| `--color-accent` | `→ coral` | — | Semantic alias for primary CTA |
| `--color-warning` | `#f59e0b` | — | Over macro target |
| `--color-danger` | `#ef4444` | — | Red flags, alerts |

### Glass (frosted/Apple-style)

| Token | Value | Usage |
|---|---|---|
| `--glass-bg` | `rgba(15,15,15,0.72)` | Tab bar, header, bottom sheets |
| `--glass-bg-light` | `rgba(28,28,28,0.68)` | Nested glass cards |
| `--glass-blur` | `blur(20px)` | Standard frosted blur |
| `--glass-blur-heavy` | `blur(32px)` | Modals, bottom sheets |
| `--glass-border` | `rgba(255,255,255,0.07)` | Rim on glass surfaces |
| `--glass-border-accent` | `rgba(255,98,48,0.30)` | Coral rim — active glass |
| `--glass-border-indigo` | `rgba(77,95,255,0.20)` | Indigo rim — workout glass |

**Implementation pattern (always include both for Safari):**
```css
.glass-surface {
  background: var(--glass-bg);
  -webkit-backdrop-filter: var(--glass-blur);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
}
```

**Where glass appears:**
- Header — scrolled state (glass replaces solid bg when content scrolls underneath)
- Tab bar — always glass
- Bottom sheets / modals — always glass
- Floating cards (Today screen status cards) — glass layer over bg

---

## Spacing

8px base scale. Use `--space-{n}` tokens only — no magic numbers.

| Token | Value | Common use |
|---|---|---|
| `--space-1` | 4px | Icon padding, tight internal gaps |
| `--space-2` | 8px | Base unit, icon-to-label gap |
| `--space-3` | 12px | Component internal padding |
| `--space-4` | 16px | Card padding, section gaps |
| `--space-5` | 20px | Medium gaps |
| `--space-6` | 24px | Section padding |
| `--space-8` | 32px | Large section gaps |
| `--space-10` | 40px | Between major sections |
| `--space-12` | 48px | |
| `--space-14` | 56px | Tab bar height |
| `--space-16` | 64px | |

---

## Grid

12-column mobile grid, designed for 390px (iPhone 15 Pro).

| Property | Value |
|---|---|
| Columns | 12 |
| Margin (left/right) | 16px |
| Gutter | 8px |
| Single column width | 22.5px |
| Full content width | 358px |

**Common span widths:**

| Span | Width | Use |
|---|---|---|
| 3 cols | 82px | Macro pill input |
| 4 cols | 114px | Small stat card |
| 6 cols | 175px | Half-width card |
| 12 cols | 358px | Full-width card |

---

## Border Radius

3-value system. Tight, standard, pill — nothing in between.

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | Tags, badges, set tracker circles |
| `--radius-md` | 8px | Cards, buttons, inputs, all containers |
| `--radius-full` | 9999px | Pills, circles, progress bars |

---

## Touch Targets

All interactive elements must meet minimum:

| Token | Value | Use |
|---|---|---|
| `--touch-min` | 44px | Apple HIG minimum (all tappable elements) |
| `--touch-base` | 48px | Comfortable standard |
| `--touch-lg` | 56px | Primary save/CTA buttons |

---

## Icons

**Library:** Lucide (`lucide-react` or CDN)
**Style:** Outline, 1.5px stroke
**Sizes:** 16px (inline), 20px (standard UI), 24px (tab bar)
**Color:** Inherit from parent — always use token colors, never hardcode

---

## Components

### Card
```css
background: var(--card-bg);       /* #141414 */
border: var(--card-border);       /* 1px solid #222 */
border-radius: var(--card-radius);/* 12px */
padding: var(--card-padding);     /* 16px */
```

### Glass Card (Today screen, header, tab bar)
```css
background: var(--glass-bg);
-webkit-backdrop-filter: var(--glass-blur);
backdrop-filter: var(--glass-blur);
border: 1px solid var(--glass-border);
border-radius: var(--card-radius);
```

### Input (pill)
```css
background: var(--input-bg);         /* #1c1c1c */
border: var(--input-border);         /* 1px solid #222 */
border-radius: var(--input-radius);  /* 8px */
height: var(--input-height);         /* 44px */
font-family: var(--font-mono);
font-size: var(--text-md);           /* 16px */
inputMode: decimal;                  /* iOS — no number spinner */
```
On focus:
```css
border: var(--input-border-focus);   /* 1px solid #0070f3 */
outline: none;
```

### Button — Primary
```css
background: var(--btn-primary-bg);      /* coral #FF6230 */
color: var(--btn-primary-color);        /* #0f0f0f — dark on coral, 6.43:1 AAA (white was 2.98:1, failed ADA large-text AA) */
height: var(--btn-primary-height);      /* 56px */
border-radius: var(--btn-primary-radius);/* 12px */
font-family: var(--font-display);
font-size: var(--text-lg);              /* 20px */
font-weight: var(--font-weight-bold);   /* 700 */
letter-spacing: var(--tracking-wide);   /* 0.06em */
text-transform: uppercase;
width: 100%;
```

### Progress Bar
```css
height: var(--progress-height);  /* 6px */
border-radius: var(--radius-full);
background: var(--progress-track); /* #242424 */
/* Fill: accent → teal at 100% → warning at >110% */
```

### Tab Bar
```css
background: var(--glass-bg);
-webkit-backdrop-filter: var(--glass-blur);
backdrop-filter: var(--glass-blur);
border-top: var(--tab-bar-border-top);   /* 1px solid #222 */
height: calc(var(--tab-bar-height) + env(safe-area-inset-bottom));
padding-bottom: env(safe-area-inset-bottom);
```

---

## Transitions

- **Score selectors, toggles:** `--transition-instant` (0ms) — speed matters at 5 AM
- **Button press, card tap:** `--transition-fast` (150ms ease)
- **Bottom sheet slide:** `--transition-slow` (350ms ease-out)
- **Tab switch:** `--transition-instant`

---

## Figma Variables

Mirror of this token system lives in Figma as:
- Color variables (all `--color-*` and `--glass-*` tokens)
- Text styles (all type scale + font family combos)
- Spacing primitives (all `--space-*` values)
- Effect styles: `glass-standard` (blur 20 + bg + border), `glass-heavy`

*(Figma variable setup: next session)*
