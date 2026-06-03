# 01 — Hello LLM

The minimum viable LLM call against Azure AI Foundry. Three language variants, same shape: load env, build a client, send one chat completion, print the response.

**When to use:** this is the first thing to run after the `foundry-cli` skill provisions your endpoint. If this works, your auth and deployment are correct.

**When not to use:** for anything beyond verifying your setup. The other examples (`02-function-calling`, `03-mini-agent`, `04-dummy-data-generator`) build on top of this pattern.

---

## Variants

| Variant | Pick if | Folder |
|---------|---------|--------|
| **Python** | Your team is most comfortable in Python, or you'll build the backend with FastAPI / Flask / Streamlit | [`python/`](./python/) |
| **Node.js** | You want JavaScript without the TypeScript tooling overhead | [`nodejs/`](./nodejs/) |
| **TypeScript** | Frontend-leaning team, or you want types end-to-end | [`typescript/`](./typescript/) |

---

## Prerequisites (any variant)

You need a Foundry resource with `gpt-4o-mini` deployed. Either:
- Run `/foundry-cli create <name>` (the skill in this toolkit), or
- Follow [Microsoft's docs](https://learn.microsoft.com/azure/ai-services/multi-service-resource?pivots=azcli) manually

After that, you should have these three values:
- `AZURE_OPENAI_ENDPOINT` — looks like `https://<name>.openai.azure.com/`
- `AZURE_OPENAI_API_KEY` — the resource key
- `AZURE_OPENAI_DEPLOYMENT` — the deployment name (typically `gpt-4o-mini`)

Each variant has a `.env.example`. Copy it to `.env` and fill in your values.

---

## What success looks like

You run the script, you see a one-paragraph reply printed in the terminal. No errors. No warnings. That's it. You're now wired into Foundry and can move on to the next example.

---

## Where to customize

Each variant has **two clearly-marked spots** to change:

1. **System prompt** — the role/behavior of the model. Change it to match your demo's voice.
2. **User message** — the actual input. Replace with whatever you want to test.

Everything else is plumbing.
