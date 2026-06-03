# 03 — Mini agent

An agent loop: the LLM chooses tools, executes them, sees the results, and keeps going until it produces a final answer. Same idea as `02-function-calling`, but **iterating** until done instead of just two calls.

**When to use:** when the task requires the LLM to call several tools (possibly the same one multiple times) before it knows the answer. E.g., *"compare X and Y across A, B, C dimensions"*.

**When not to use:** if a single tool call is enough. Use `02-function-calling` — simpler.

---

## The loop

```
while not done:
    response = llm(messages + tools)
    if response.has_tool_calls:
        execute each tool, append results
    else:
        return response.content
```

Three guards make it safe:
1. **Max iterations** — stops runaway loops.
2. **Tool whitelist** — only registered tools can run.
3. **Argument parsing errors** are caught and surfaced to the LLM so it can self-correct.

---

## What you'll see

```
User: "What time is it in Lima, and what's the math: 23 + 19?"
  ↓
LLM calls get_current_time('America/Lima') and add_numbers(23, 19) (parallel)
  ↓
Code executes both, appends results
  ↓
LLM produces final answer using both results
```

The example uses 2 tools so you can see parallel tool calls + a small composition. Conversation history is kept in memory so the loop can refer back to prior steps.

---

## Variants

| Variant | Folder |
|---------|--------|
| **Python** | [`python/`](./python/) |
| **Node.js** | [`nodejs/`](./nodejs/) |
| **TypeScript** | [`typescript/`](./typescript/) |

---

## Where to customize

1. **`TOOLS` + tool implementations** — your agent's actual capabilities.
2. **`SYSTEM_PROMPT`** — how the agent should behave (be concise, always cite sources, etc.).
3. **`MAX_ITERATIONS`** — safety guard. 5 is enough for most demos.

---

## When to graduate to a framework

This example is intentionally framework-free so you understand the moving parts. Once your agent gets more than ~5 tools or needs structured state, look at:

- **OpenAI Agents SDK** — minimal, official
- **LangGraph** — explicit graph of states
- **Vercel AI SDK** — if you're already on Next.js

But: try this hand-rolled loop first. For a 48-hour mockup it's usually enough.
