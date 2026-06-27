# Body Optimization — CoWork Setup

## What this plugin is

A 9-agent performance system that runs automated weekly and monthly reviews. It does **not** handle daily logging — that happens in Chat.

---

## Step 1: Install the Plugin

1. Open Claude Code desktop
2. Go to **Plugins** → **Install from file**
3. Select `body-optimization.plugin`

---

## Step 2: Create the CoWork Project

1. Open **CoWork**
2. Create a new project: `Body Optimization`
3. When prompted to add agents, select all 9:
   - Data Manager
   - Weekly Review Agent
   - Monthly Data Analyst
   - Nutritionist (Dr. Stacy Sims)
   - Training Coach (Dr. Peter Attia)
   - Sleep & Recovery Coach (Dr. Matthew Walker)
   - Brain Health Coach (Dr. Andrew Huberman)
   - Mindset Coach
   - Habits Coach (James Clear)

---

## Step 3: Set Up Automations

### Weekly Review — Every Monday
1. In the CoWork project, go to **Automations**
2. Create new automation:
   - **Name:** Weekly Review
   - **Schedule:** Every Monday at 9:00 AM
   - **Starting agent:** Weekly Review Agent
   - **Prompt:**
     ```
     It's Monday. Run the weekly review.
     1. Request last week's summary from Data Manager
     2. Analyze the data
     3. Call only the specialists whose domain has an issue
     4. Deliver the unified weekly report
     ```

### Monthly Analysis — First of Every Month
1. Create another automation:
   - **Name:** Monthly Analysis
   - **Schedule:** 1st of every month at 9:00 AM
   - **Starting agent:** Monthly Data Analyst
   - **Prompt:**
     ```
     It's the 1st. Run the monthly analysis.
     1. Request last month's full summary from Data Manager
     2. Identify trends, correlations, and red flags
     3. Call relevant specialists for deeper insight
     4. Deliver the monthly report with next month's priorities
     ```

---

## Step 4: Paste Your Weekly Data

Before each Monday automation runs, paste the previous week's logs into the CoWork project so Data Manager has data to work with. Use the daily export from the app.

---

## How It Works

```
Monday automation fires
    → Weekly Review Agent wakes up
    → Requests clean summary from Data Manager
    → Scans for issues (macros, sleep, training, mood)
    → Routes to 1–3 specialists ONLY if their domain has a problem
    → Synthesizes one unified report

Monthly automation fires
    → Monthly Data Analyst wakes up
    → Requests 4-week summary from Data Manager
    → Spots trends and correlations
    → Calls relevant specialists for deeper analysis
    → Delivers monthly report + next month priorities
```

## Token Efficiency

Only the agents that are needed run. A clean week = Data Manager + Weekly Review only. Issues flagged = max 2–3 specialists. Never all 9 at once.

---

## Daily Logging (Separate from this Plugin)

Daily macros and workouts are logged in **Chat**, not CoWork:
- Open Chat → load **Nutritionist** → log your macros
- Open Chat → load **Training Coach** → log your workout

See the Chat project setup for instructions.
