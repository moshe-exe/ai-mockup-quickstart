# 04 — Dummy data generator

The **agent-redactor pattern**: hand-write 2–3 seed items, give the LLM explicit realism rules, and have it generate a pool of N more. 30 minutes of work vs 8 hours cleaning a real dataset.

This is the executor for the [`dummy-redactor`](../../.claude/skills/dummy-redactor/SKILL.md) skill. The skill captures the **what** and **why** for your team's case (domain, schema, rules, seeds). This example is the **how**.

**When to use:** any time your demo needs more than 5 sample items and you don't want to spend hours hand-writing them.

**When not to use:** if 3 hardcoded items are enough. Don't over-engineer.

---

## What you'll see

```
Reading: schema, rules, seeds (a tiny config in the source file)
   ↓
Sending: prompt with all three + a request for N items
   ↓
Receiving: JSON array of N items
   ↓
Validating: each item against the schema and rules
   ↓
Writing: dummies.json
```

The example uses a small toy schema (an item with `id`, `title`, `category`, `score`) so you can see the loop end-to-end without domain-specific noise. **Replace the schema, rules, and seeds with yours.**

---

## Variants

| Variant | Folder |
|---------|--------|
| **Python** | [`python/`](./python/) |
| **Node.js** | [`nodejs/`](./nodejs/) |
| **TypeScript** | [`typescript/`](./typescript/) |

---

## Where to customize

1. **`SCHEMA`** — the fields each item has and their types.
2. **`RULES`** — list of plain-English constraints (the LLM reads them, you don't need code).
3. **`SEEDS`** — 2–3 hand-written items the LLM imitates.
4. **`COUNT`** — how many items to generate.
5. **`OUTPUT_PATH`** — where to write the JSON.

---

## Why this pattern works

- **Seeds anchor style.** The LLM tends to drift unless you give it 2–3 high-quality examples.
- **Rules catch what schema can't.** Cross-field constraints ("if X then Y"), distributions, forbidden combos — these don't fit in a JSON schema but the LLM follows them in plain language.
- **Validation is cheap and catches drift.** Bad item → log the violation, retry with stricter prompt.

---

## When this isn't enough

- **You need >200 items:** consider batching (request 50 at a time, append).
- **You need the items to be referenced by ID across runs:** seed the prompt with prior items and ask the LLM not to duplicate.
- **You need strong distribution guarantees:** generate 2× what you need and post-filter to hit the target distribution.

For 48-hour mockups, none of the above usually matter. Generate 30, eyeball them, ship.
