# 02 — Function calling

How to give the LLM **tools** — functions it can choose to call when it needs information it doesn't have. The example uses one tool (`get_current_time`) to keep the loop visible. Once you understand this pattern, multi-tool agents are just "more of the same."

**When to use:** when your demo needs the LLM to fetch data, run a computation, or trigger an action — not just chat.

**When not to use:** if your demo is purely conversational. Stick with `01-hello-llm`.

---

## What you'll see

```
User: "What time is it in Lima right now?"
  ↓
LLM: "I need to call get_current_time('America/Lima')"
  ↓
Your code: executes the function, returns "2026-06-03T14:23:00-05:00"
  ↓
LLM: "It's 2:23 PM in Lima."
```

The pattern is **two LLM calls** with the tool execution in between. The example prints each step so you can trace what happens.

---

## Variants

| Variant | Folder |
|---------|--------|
| **Python** | [`python/`](./python/) |
| **Node.js** | [`nodejs/`](./nodejs/) |
| **TypeScript** | [`typescript/`](./typescript/) |

---

## Where to customize

Each variant has these marked sections:

1. **Tool definition** — the JSON schema describing what the tool does and what arguments it takes.
2. **Tool implementation** — the actual function that runs.
3. **User message** — what you're asking.

To add more tools: duplicate the tool definition + implementation, then handle the new tool name in the dispatch switch.

---

## Common pitfalls (read before extending)

- **Forgetting to send tool results back.** The flow is: LLM → tool_calls → execute → send results → LLM → final answer. If you skip the second LLM call, you only see the request, not the answer.
- **Tool argument types.** The LLM sends arguments as JSON. If your function expects an integer and the LLM sends `"42"` (string), parse it.
- **Long tool names.** Some models limit tool names to 64 chars. Keep them short and snake_case.
- **Too many tools at once.** More than ~5 tools and the LLM starts picking the wrong one. Split into sub-agents if you need more.
