# Agent vs. Workflow — decision reference

The single most consequential architecture question in a 48-hour mockup: **do you build a deterministic workflow, or a non-deterministic agent?**

This reference exists so you stop debating it for 90 minutes at hour 3.

---

## The one-line decision rule

> **Ask: what decision does my system make at runtime?**
>
> - If it fits in an `if/else` → **workflow**
> - If it shifts with context → **agent**

That's 80% of cases. The other 20% is the gray zone — see below.

---

## What they look like

| | **Workflow** | **Agent** |
|---|---|---|
| **UI shape** | Forms, buttons, stepper ("step 2 of 4"), guided flow | Open chat + a "thinking" panel showing tool calls |
| **Control flow** | Code calls the LLM at fixed points | LLM decides what to call next, in a loop |
| **Determinism** | High — same input, same output | Low — same input may produce different paths |
| **Demo feel** | "First X happens, then Y" — judge follows easily | "Watch it figure it out" — wow moment is the reasoning trace |
| **Risk during demo** | The flow itself is rigid — works or doesn't | The LLM may go off-script in front of the judge |

---

## The spectrum (and the gray zone)

```
Workflow ━━━━━━━━━━━━━━━━━━━━━━ Agent
   ↑                              ↑
 obvious case                  obvious case
```

Obvious workflow cases:
- "Log a symptom → check against rules → respond"
- "Upload a receipt → extract fields → categorize → save"
- "Answer 3 questions → score → recommend a tier"

Obvious agent cases:
- "Help me understand this lab result"
- "Plan a treatment summary from these visits"
- "Triage this support ticket and route it"

**The gray zone** appears when the same problem can be framed either way. This is more common in some domains than others:

- **Healthcare:** the decision is partly clinical (structured) and partly conversational (ambiguous). Auditability also pulls toward workflow.
- **Customer support:** routing logic is workflow-y, but the response itself is agent-y.
- **Knowledge work:** depends on whether the user is doing a known task or exploring.

---

## The contraintuitive insight

> **Workflow** = the more optimal choice in production, but more orchestration code to write.
>
> **Agent** = often overkill from an engineering standpoint, but the LLM handles the orchestration *for you*.
>
> In a 48-hour mockup, **"less code to write" beats "more optimal in production."**

That's why, in the gray zone, the bias for hackathons should be toward **agent**. You ship faster, the demo *feels* smarter, and you avoid debating the exact flow at 3 AM.

---

## Common traps

- **Multi-agent before mono-agent.** Coordinator + 3 sub-agents = 4× debugging, 4× latency. Start with one agent and add specialization only when it visibly breaks.
- **Agentifying a clear if/else.** If the decision is genuinely deterministic, an agent is just a slower, more expensive `if`. Use a workflow.
- **Workflow-ifying a clear chat.** If the user is talking to your system in natural language, a workflow forces awkward UI shapes (modals, steppers) that fight the use case.

---

## Cheat-sheet

| Symptom | Pick |
|---------|------|
| "User picks from 3 buttons and we run code" | Workflow |
| "User types whatever, we figure out what to do" | Agent |
| "Latency must be under 500ms" | Workflow |
| "We need tool calls, retries, planning" | Agent |
| "Auditability is non-negotiable" | Workflow |
| "I don't know what the user will ask" | Agent |
| "We need to ship in 48h and we're in the gray zone" | Agent (less code) |

---

## Related

- `48h-checklist.md` — when to lock the decision (hour 4)
- `common-mistakes.md` — what to avoid once you've picked
- `../.claude/skills/mockup-architect/SKILL.md` — coaches you through this at hour 0
