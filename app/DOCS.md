# App Documentation

Live: https://lizb-droid.github.io/body-optimization/app/

---

## What it is

A single-file PWA (Progressive Web App) that tracks Liz's 17-week strength + trail running program. It runs entirely in the browser — no backend, no database. All data lives in `localStorage` on the device and syncs to GitHub via the Save button.

---

## Architecture

Everything is in one file: `app/index.html`.

- **Program data** — the full 17-week schedule (weeks, days, exercises, sets/reps, rest times) is hardcoded as a JavaScript constant `WEEKS[]` inside the HTML. No external data fetches needed to render the program.
- **User data** — weights logged, completed days, notes, PRs — stored in `localStorage` under keys `lizdone2`, `lizweights2`, `liznotes2`, `lizprs2`, `lizweek2`.
- **State object** — `let S = {tab, weekIdx, weights, done, notes, prs, openDays, macros, progress}` holds everything in memory. `loadState()` reads from localStorage on startup. `saveWorkout()` writes back to localStorage after any change.
- **Service worker** — `app/service-worker.js` (cache name `liz-app-v7`). Navigation requests are always fetched fresh (`cache: 'no-cache'`) to pick up code updates. Assets (fonts, CDN scripts) are cache-first.

---

## Key Features

### Week/Day Navigation
- Week tabs scroll horizontally. `S.weekIdx` (0–16) tracks the current week.
- Day cards expand/collapse. Today's card auto-expands on load.
- Completed days show a green check. Tab persists across page refreshes via `localStorage.getItem('liztab')`.

### Workout Logging
- Each exercise row shows sets. Tapping a weight field opens a number input.
- **Reps auto-fill** from the program (e.g. "3×8" → shows 8 in the reps field).
- **Auto-checkmark** — entering a weight automatically checks that set as done.
- **Jump to next exercise** — when all sets in an exercise are filled, the view scrolls to the next exercise.
- Weight data format: `S.weights['w{week}d{day}-ex{n}'][setIndex]` = `{w: '85', r: '8'}` (weight + reps).

### Rest Timer
- Bottom sheet timer modal. Recommended rest time comes from the program per exercise.
- Closing the timer always resets to the recommended time (not the user's last preset).

### PR Tracking
- PRs stored in `S.prs` as `{exerciseName: maxWeight}`.
- Updated automatically when a new weight exceeds the stored PR.

### GitHub Sync
- **Save button** in the header — pushes all data to `app/data/backup.json` via the GitHub Contents API.
- First tap prompts for a fine-grained GitHub PAT (token stored in `localStorage` as `lizghtoken`).
- Token needs: repository `lizb-droid/body-optimization` → Contents: Read and Write.
- On fresh install with empty localStorage (0 completed days), the app auto-loads from `backup.json` via `tryLoadFromGitHub()` at startup.

---

## Data Flow

```
App starts
  └── loadState() → reads localStorage
  └── tryLoadFromGitHub() → if no completed days, fetch backup.json and populate S
        └── saveWorkout() → writes loaded data back to localStorage
        └── re-renders UI

User logs a weight
  └── handleWeight2() → updates S.weights
        └── saveWorkout() → persists to localStorage

User taps Save
  └── saveToGitHub() → buildBackup() → pushes JSON to GitHub API
```

---

## GitHub Sync Setup (one time)

1. Go to `github.com/settings/tokens` → Fine-grained tokens → Generate new token
2. Resource owner: `lizb-droid`
3. Repository access: Only select repositories → `body-optimization`
4. Permissions → Repositories → Contents: Read and write
5. Generate → copy token
6. Open app → tap Save → paste token when prompted

Token is saved to `localStorage` after first use. Tap Save after each workout to back up.

---

## Deploying Updates

The app is deployed via GitHub Pages from the `main` branch. Push to `main` → live in ~30 seconds.

Cache buster: append `?v=N` (increment N) to the URL to force a fresh load past GitHub Pages' 10-minute CDN cache (`max-age=600`). The service worker navigation strategy always fetches HTML fresh, so `?v=N` is mainly needed for the first visit after a CDN-cached update.

To force the service worker to reinstall: bump `CACHE_NAME` in `service-worker.js` (currently `liz-app-v7`).

---

## File Structure

```
app/
├── index.html          ← entire app (HTML + CSS + JS in one file)
├── service-worker.js   ← PWA caching strategy
├── manifest.json       ← PWA metadata (name, icons, theme color)
├── icons/              ← PWA home screen icons
├── data/
│   └── backup.json     ← GitHub sync target (written by Save button)
└── DOCS.md             ← this file
```
