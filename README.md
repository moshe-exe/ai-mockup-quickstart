# ai-mockup-quickstart

A toolkit for building competent Generative AI mockups fast — hackathons, demos, validation prototypes.

Born from the talk **"How to build a Generative AI product in less than 48 hours"** (Desafío IA Bagó Perú 2026), but designed to be reused anywhere you need to go from **idea → working demo** without losing days on infrastructure.

**Author:** [Moshe Ojeda](https://github.com/moshe-exe) · cofounder at [Agentman](https://github.com/agentman) and [Mentorium](https://github.com/mentoriumai)

---

## Who this is for

- Teams in a Generative AI hackathon with 24–48h
- Developers building rapid prototypes to validate a hypothesis
- Founders putting together a demo for a first round
- Anyone who needs to reach the **wow moment** as fast as possible

This is **not** for building production-grade products. It's for getting to a solid demo before time runs out.

---

## Repo structure

```
ai-mockup-quickstart/
├── .claude/skills/        # Claude Code skills to accelerate the flow
├── reference/             # Cheatsheets and decision tables
├── examples/              # Working code, copy-paste friendly, multi-language
└── starter/               # Recommended starter templates, multi-stack
```

### `.claude/skills/` — Claude Code skills

Drop-in skills for [Claude Code](https://claude.ai/code). Use them as-is or fork and customize — they're all editable markdown.

```
.claude/skills/
├── foundry-cli/           # Correct `az` commands for Azure AI Foundry
├── mockup-architect/      # Helps you cut scope and design minimal architecture
└── dummy-redactor/        # Generates synthetic data pools with realism rules
```

Each skill includes:
- `SKILL.md` — description, commands, mechanics
- Templates or helpers if applicable
- Install instructions

**To install in your Claude Code project:** copy any skill folder into your project's `.claude/skills/`.

### `reference/` — cheatsheets and decision tables

Quick answers to *"which command do I use?"* or *"agent or workflow?"* without reading 30 pages of docs.

```
reference/
├── agent-vs-workflow.md   # Decision table with healthcare examples
├── 48h-checklist.md       # The 4 blocks + checkpoints at hour 12 and 24
└── common-mistakes.md     # Patterns to avoid (premature multi-agent, unnecessary RAG, etc.)
```

> Note: the Azure AI Foundry CLI reference lives as a Claude skill (`.claude/skills/foundry-cli/`), not here — because an agent should be the one running those commands for you anyway.

### `examples/` — working code

Each example is **self-contained** (minimal dependencies, runs on its own) and **flexible** (clear variables, easy to adapt). Numbered for suggested learning order, but each one stands alone.

Every example ships in **Python**, **Node.js**, and **TypeScript** — pick the one that matches your team's stack.

```
examples/
├── 01-hello-llm/                 # Basic call to gpt-4o-mini
├── 02-function-calling/          # Giving tools to the LLM
├── 03-mini-agent/                # Agent with loop + tools + minimal memory
└── 04-dummy-data-generator/      # Pattern: agent that writes synthetic patients/cases
    ├── python/
    ├── nodejs/
    └── typescript/
```

Each language folder has:
- `README.md` — what it does, when to use it, how to run it
- Source code with one key comment per file pointing out where to customize
- `.env.example` with required variables
- `requirements.txt` / `package.json` / `*.csproj` as needed

### `starter/` — project templates

Recommended starting structures. Clone the one that fits your stack and only write the agent logic — everything else (container, env, LLM client, minimal UI) is already wired.

Two starters are shipped fully wired. The other two are planned and will land based on demand.

```
starter/
├── python-fastapi-streamlit/     # ✅ Python backend + Streamlit UI (fastest to ship)
├── nextjs-fullstack/             # ✅ Next.js with API routes (single repo, one deploy)
├── python-fastapi-nextjs/        # 🚧 TODO — Python backend + Next.js frontend
├── nodejs-express-react/         # 🚧 TODO — Node backend + React (Vite) frontend
└── README.md                     # Comparison table + recommendation per use case
```

Every starter ships with:
- `docker-compose.yml` — single-command local setup
- Pre-wired LLM client pointing to Azure AI Foundry
- Minimal but presentable UI (chat interface or form-based)
- `.env.example` with the variables you'll actually need
- A `README.md` explaining what to change first

---

## How to use this repo

**Before the hackathon:**
1. Clone the starter that matches your stack
2. Copy the skills you want into your project's `.claude/skills/`
3. Read `reference/48h-checklist.md` to understand the method

**During the hackathon:**
1. **Hour 0–4:** use the `mockup-architect` skill to lock in your scope
2. **Hour 4–20:** stand up the starter, adapt an `examples/` snippet for your case, deploy by hour 12
3. **Hour 20–36:** iterate prompts and agent logic on the happy path
4. **Hour 36–48:** polish UI, record a backup video, rehearse the pitch

**At any point:**
- Need synthetic data → `examples/04-dummy-data-generator/`
- Stuck on `az` commands → use the `foundry-cli` skill (or let an agent run it)
- Torn between agent and workflow → `reference/agent-vs-workflow.md`

---

## Philosophy

- **Cut with intention, even when it hurts.** Fear of pain isn't a reason to skip a good decision.
- **Your demo is what survives the cut.** Build that, nothing more.
- **The hour-12 deploy isn't for showing** — it's for discovering what doesn't work while you still have time to fix it.

---

## Status

| Section | Status |
|---------|--------|
| `.claude/skills/` (foundry-cli, mockup-architect, dummy-redactor) | ✅ Ready |
| `reference/` (agent-vs-workflow, 48h-checklist, common-mistakes) | ✅ Ready |
| `examples/` (01–04, all three languages each) | ✅ Ready |
| `starter/python-fastapi-streamlit/` | ✅ Ready |
| `starter/nextjs-fullstack/` | ✅ Ready |
| `starter/python-fastapi-nextjs/` | 🚧 Planned |
| `starter/nodejs-express-react/` | 🚧 Planned |

All source files pass syntax checks (Python `py_compile`, Node.js `node --check`, TypeScript `tsc --noEmit`). PRs and feedback welcome.

## License

MIT — use, modify, redistribute freely.
