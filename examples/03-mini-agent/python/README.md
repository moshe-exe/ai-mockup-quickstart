# Mini agent — Python

## Run it

```bash
cp .env.example .env       # then fill in your values
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python mini_agent.py
```

You should see each step's tool calls printed, then the final answer.

## What's in `mini_agent.py`

- **`TOOLS`** + **`TOOL_FUNCTIONS`** — your agent's capabilities. Replace with your own.
- **`SYSTEM_PROMPT`** — behaviour instructions.
- **`USER_MESSAGE`** — what kicks off the loop.
- **`MAX_ITERATIONS`** — safety guard. 5 is usually plenty.
- **`run_agent(...)`** — the loop. Same shape as a production agent, just smaller.

## Safety guards

1. **Max iterations** — the `for step in range(...)` cap.
2. **Tool whitelist** — `if name not in TOOL_FUNCTIONS` returns an error to the LLM (so it can self-correct) instead of crashing.
3. **Argument parsing in `try/except`** — malformed JSON or wrong types get reported back to the LLM, not exploded.
