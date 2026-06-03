# Hello LLM — Python

## Run it

```bash
cp .env.example .env       # then fill in your values
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python hello.py
```

You should see a one-paragraph reply printed in the terminal.

## What's in `hello.py`

- **Lines 1–14:** load env vars and build the `AzureOpenAI` client.
- **`SYSTEM_PROMPT`:** change me #1 — defines the model's role.
- **`USER_MESSAGE`:** change me #2 — the actual input.
- **`main()`:** the chat completion call. `model` is the **deployment name**, not the model name.

## Common errors

| Error | Cause | Fix |
|-------|-------|-----|
| `KeyError: 'AZURE_OPENAI_ENDPOINT'` | `.env` not loaded | Check `.env` exists, `python-dotenv` is installed |
| `401 Unauthorized` | Bad key | Re-fetch with `/foundry-cli get-creds` |
| `404 DeploymentNotFound` | Wrong deployment name | Verify `AZURE_OPENAI_DEPLOYMENT` matches what you actually deployed |
| `429 Too Many Requests` | Capacity too low | Re-deploy with higher `--sku-capacity` |
