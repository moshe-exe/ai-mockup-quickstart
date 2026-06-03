# Dummy data generator — Python

## Run it

```bash
cp .env.example .env       # then fill in your values
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python generate.py
```

Output: `dummies.json` in the current directory + a sample printed to stdout.

## What's in `generate.py`

- **`SCHEMA`** — JSON schema for one item. CHANGE ME #1.
- **`RULES`** — plain-English constraints (the LLM reads them, you don't need code). CHANGE ME #2.
- **`SEEDS`** — 2–3 hand-crafted items for style anchoring. CHANGE ME #3.
- **`COUNT`** and **`OUTPUT_PATH`** — quantity and where to write.
- **`validate(item)`** — tiny per-item check. Extend with your invariants.
- **`main()`** — builds the prompt, calls the LLM with `response_format=json_object`, parses, validates, writes.

## Tips

- **`temperature=0.8`** gives you variety without going off the rails. Drop to 0.5 if items look too random; bump to 1.0 if they look too samey.
- **Seeds beat rules.** When in doubt, write a 4th seed instead of adding a 6th rule.
- **For >50 items**, batch: call the script 3 times with `COUNT=20` and concatenate. Most models start drifting past ~50 in one shot.
