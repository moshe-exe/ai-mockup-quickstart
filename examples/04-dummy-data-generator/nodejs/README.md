# Dummy data generator — Node.js

## Run it

```bash
cp .env.example .env       # then fill in your values
npm install
npm start
```

Output: `dummies.json` in the current directory + a sample printed to stdout.

## What's in `generate.js`

- **`SCHEMA`** — JSON schema for one item. CHANGE ME #1.
- **`RULES`** — plain-English constraints. CHANGE ME #2.
- **`SEEDS`** — 2–3 style anchors. CHANGE ME #3.
- **`COUNT`** + **`OUTPUT_PATH`** — quantity and destination.
- **`validate(item)`** — tiny per-item check.
- **`main()`** — builds the prompt, calls LLM with `response_format: { type: 'json_object' }`, validates, writes.

## Tips

- **Seeds beat rules.** Write a 4th seed before adding a 6th rule.
- **For >50 items**, batch it. Call multiple times with `COUNT=20`, concatenate.
