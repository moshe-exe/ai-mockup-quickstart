# Mini agent — TypeScript

## Run it

```bash
cp .env.example .env       # then fill in your values
npm install
npm start
```

## What's in `mini-agent.ts`

- **`TOOLS`** (typed) + **`TOOL_FUNCTIONS`** — your agent's capabilities.
- **`SYSTEM_PROMPT`** + **`USER_MESSAGE`** + **`MAX_ITERATIONS`** — behaviour and safety.
- **`runAgent(userMessage)`** — the loop. Returns the final answer.

Uses top-level `await` (ESM, works under `tsx` and modern Node).
