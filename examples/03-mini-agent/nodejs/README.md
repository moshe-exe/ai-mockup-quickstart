# Mini agent — Node.js

## Run it

```bash
cp .env.example .env       # then fill in your values
npm install
npm start
```

You should see each step's tool calls printed, then the final answer.

## What's in `mini-agent.js`

- **`TOOLS`** + **`TOOL_FUNCTIONS`** — your agent's capabilities. Replace.
- **`SYSTEM_PROMPT`** + **`USER_MESSAGE`** + **`MAX_ITERATIONS`** — behaviour and safety.
- **`runAgent(userMessage)`** — the loop.

Uses top-level `await` (works since Node 14+ in ESM mode).
