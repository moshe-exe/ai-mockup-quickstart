# Dummy data generator — TypeScript

## Run it

```bash
cp .env.example .env       # then fill in your values
npm install
npm start
```

Output: `dummies.json` in the current directory + a sample printed to stdout.

## What's in `generate.ts`

- **`Item`** — TypeScript shape matching the schema. Edit both together.
- **`SCHEMA`** + **`RULES`** + **`SEEDS`** — CHANGE ME #1, #2, #3.
- **`COUNT`** + **`OUTPUT_PATH`** — quantity and destination.
- **`validate(item)`** — tiny per-item check.
- **`main()`** — builds prompt, calls LLM with `response_format: { type: 'json_object' }`, validates, writes.

## Tips

- **Seeds beat rules.** Write a 4th seed before adding a 6th rule.
- **For >50 items**, batch it. Call multiple times with `COUNT=20`, concatenate.
- **Keep the `Item` type and the JSON `SCHEMA` in sync** — when one changes the other should too.
