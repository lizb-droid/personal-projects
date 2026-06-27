# Body Optimization

A 9-agent performance team for body recomposition, trail racing, and daily tracking — built on Liz's actual program files, athlete profile, and specialist frameworks.

## The Team

| Agent | File | Framework |
|---|---|---|
| Orchestrator | `agents/orchestrator.md` | Chief Performance Director |
| Nutritionist | `agents/nutritionist.md` | Dr. Stacy Sims — female physiology & fueling |
| Sleep & Recovery | `agents/sleep-recovery.md` | Dr. Matthew Walker — sleep science |
| Body Optimization | `agents/body-optimization.md` | Dr. Peter Attia — longevity & strength |
| Brain Health | `agents/brain-health.md` | Dr. Andrew Huberman — neuroscience & focus |
| Habit Coach | `agents/habit-coach.md` | James Clear — Atomic Habits |
| Data Analyst | `agents/data-analyst.md` | Precision Performance Analyst |
| Designer | `agents/designer.md` | Nike Digital Design — UI/UX |
| Developer | `agents/developer.md` | Full-Stack Engineering Lead |

## How to Use

### On Your Phone (Claude.ai Project) — daily
1. Claude.ai → Projects → "Performance Team"
2. Project instructions = contents of `prompts/claude-project-prompt.md`
3. Log daily with `tracking/daily-log-template.md`

### On Desktop (Cowork) — weekly + building
Install `plugin/body-optimization.plugin`. Skills:
- `/daily-log` — log and get routed to the right specialist
- `/weekly-checkin` — Monday full-team silent scan → one report
- `/app-session` — design + build the tracking app
- `/program-review` — Sims + Attia program review
- `/insights` — paste data, get trend analysis

## Folders

```
body-optimization/
├── agents/        ← the 9 agent instruction files (source of truth)
├── app/           ← liz-program.jsx + future app code
├── design/        ← app redesign spec
├── plugin/        ← Cowork plugin (body-optimization.plugin)
├── profile/       ← athlete profile (source of truth for all agents)
├── program/       ← 17-week program revisions
├── prompts/       ← Claude.ai project prompt
├── references/    ← original program PDFs (local only)
└── tracking/      ← daily + weekly log templates
```

## Program Details
- **17-week program:** Apr 20 – Aug 16, 2026
- **A-Race 1:** Cirque Alta — July 11 (~8 mi, ~3,000 ft)
- **A-Race 2:** Cirque Snowbird — August 15 (~8 mi, ~3,000 ft)
- **Goals:** Body recomposition · Trail race performance · Maintain milk supply · Feel good
