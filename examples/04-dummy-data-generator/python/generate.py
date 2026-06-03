"""
Dummy data generator (agent-redactor pattern).

Hand-write 2-3 seed items, give the LLM explicit realism rules,
let it produce a pool of N more. Output is validated against the
schema before being written to disk.

Replace SCHEMA, RULES, SEEDS, COUNT to match your demo's case.
"""

import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-08-01-preview"),
)
DEPLOYMENT = os.environ["AZURE_OPENAI_DEPLOYMENT"]


# ────────────────────────────────────────────────────────────────────
# CHANGE ME #1 — Schema: the fields per item and their types.
# ────────────────────────────────────────────────────────────────────
SCHEMA = {
    "type": "object",
    "properties": {
        "id": {"type": "string"},
        "title": {"type": "string"},
        "category": {"type": "string", "enum": ["A", "B", "C"]},
        "score": {"type": "number", "minimum": 0, "maximum": 100},
    },
    "required": ["id", "title", "category", "score"],
}


# ────────────────────────────────────────────────────────────────────
# CHANGE ME #2 — Realism rules (plain English, the LLM reads them).
# ────────────────────────────────────────────────────────────────────
RULES = [
    "id is a slug (kebab-case), unique across the set.",
    "title is a short phrase, 3-7 words, not generic.",
    "category is roughly 40% A, 35% B, 25% C across the set.",
    "score is a realistic spread, not all 50s or 100s.",
    "Avoid placeholder words like 'example', 'test', 'lorem'.",
]


# ────────────────────────────────────────────────────────────────────
# CHANGE ME #3 — Seeds: 2-3 hand-crafted items to anchor style.
# ────────────────────────────────────────────────────────────────────
SEEDS = [
    {"id": "harbor-sunset-watch", "title": "Harbor Sunset Watch", "category": "A", "score": 78},
    {"id": "quiet-trail-loop", "title": "Quiet Trail Loop", "category": "B", "score": 64},
    {"id": "rooftop-garden-tour", "title": "Rooftop Garden Tour", "category": "C", "score": 91},
]


COUNT = 20
OUTPUT_PATH = Path("dummies.json")


def validate(item: dict) -> list[str]:
    """Tiny schema check. Returns list of violations (empty = ok)."""
    errors = []
    for field in SCHEMA["required"]:
        if field not in item:
            errors.append(f"missing field: {field}")
    if "category" in item and item["category"] not in ["A", "B", "C"]:
        errors.append(f"invalid category: {item['category']}")
    if "score" in item and not (0 <= item["score"] <= 100):
        errors.append(f"score out of range: {item['score']}")
    return errors


def main() -> None:
    system = "You generate synthetic data for a demo. Return a JSON array, no commentary."
    user = f"""Generate {COUNT} items matching this schema:

{json.dumps(SCHEMA, indent=2)}

Rules:
{chr(10).join(f"- {r}" for r in RULES)}

Style anchors (imitate the tone and shape, do not repeat ids):
{json.dumps(SEEDS, indent=2)}

Return ONLY a JSON array of {COUNT} items."""

    response = client.chat.completions.create(
        model=DEPLOYMENT,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        response_format={"type": "json_object"},
        temperature=0.8,
    )

    raw = response.choices[0].message.content or ""
    parsed = json.loads(raw)
    # The model wraps the array in {"items": [...]} when using json_object.
    items = parsed.get("items") if isinstance(parsed, dict) else parsed

    valid, bad = [], []
    for item in items:
        violations = validate(item)
        (bad if violations else valid).append((item, violations))

    OUTPUT_PATH.write_text(json.dumps([v[0] for v in valid], indent=2))
    print(f"✓ wrote {len(valid)} items to {OUTPUT_PATH}")
    if bad:
        print(f"⚠ {len(bad)} items failed validation:")
        for item, violations in bad[:3]:
            print(f"  {item}: {violations}")

    print("\nSample of the first 3:")
    for item in valid[:3]:
        print(f"  {item[0]}")


if __name__ == "__main__":
    try:
        main()
    except json.JSONDecodeError as exc:
        print(f"LLM returned invalid JSON: {exc}", file=sys.stderr)
        sys.exit(1)
