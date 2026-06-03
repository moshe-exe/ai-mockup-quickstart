# Hello LLM — TypeScript

## Run it

```bash
cp .env.example .env       # then fill in your values
npm install
npm start
```

You should see a one-paragraph reply printed in the terminal.

## What's in `hello.ts`

- **Lines 1–14:** load env vars and build the typed `AzureOpenAI` client.
- **`SYSTEM_PROMPT`:** change me #1 — defines the model's role.
- **`USER_MESSAGE`:** change me #2 — the actual input.
- **`main()`:** the chat completion call. `model` is the **deployment name**, not the model name.

## Stack notes

- Runs via [`tsx`](https://github.com/privatenumber/tsx) — no separate build step.
- `tsconfig.json` is ESM-flavored (matches `"type": "module"` in `package.json`).
- Strict mode is on. The `!` on env vars asserts they're set; for production add proper validation.

## Common errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module 'dotenv/config'` | Deps not installed | `npm install` |
| `401 Unauthorized` | Bad key | Re-fetch with `/foundry-cli get-creds` |
| `404 DeploymentNotFound` | Wrong deployment name | Verify `AZURE_OPENAI_DEPLOYMENT` matches what you deployed |
| `429 Too Many Requests` | Capacity too low | Re-deploy with higher `--sku-capacity` |
