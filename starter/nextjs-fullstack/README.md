# Starter — Next.js fullstack

A single Next.js app with App Router. Backend logic lives in API routes, the frontend is React + Tailwind. One repo, one deploy.

```
┌───────────────────────────────────────────────────┐         ┌────────────────────┐
│            Next.js (port 3000)                    │ ──HTTP─▶│  Azure AI Foundry  │
│  ┌─────────────────┐    ┌─────────────────────┐   │         │   (gpt-4o-mini)    │
│  │  app/page.tsx   │───▶│ app/api/chat/route  │   │         └────────────────────┘
│  │  (chat UI)      │    │ (POST /api/chat)    │   │
│  └─────────────────┘    └─────────────────────┘   │
└───────────────────────────────────────────────────┘
```

**Best for:** frontend-leaning teams, Vercel deployment, single-repo simplicity.

**Not the right fit if:** you need a Python backend (use `python-fastapi-streamlit`) or want a separated frontend/backend deploy (use `python-fastapi-nextjs`).

---

## Prerequisites

- Node.js `>= 20`
- A Foundry resource with `gpt-4o-mini` deployed (use `/foundry-cli create <name>`)

---

## Run it

```bash
cp .env.example .env.local    # then fill in your Foundry values
npm install
npm run dev
```

Open <http://localhost:3000> — you should see a chat UI. Type a message, get a reply.

---

## What's where

```
nextjs-fullstack/
├── app/
│   ├── layout.tsx                 # Root layout (Tailwind, fonts)
│   ├── page.tsx                   # Chat UI — customize here
│   ├── globals.css                # Tailwind base + a few resets
│   └── api/
│       └── chat/
│           └── route.ts           # POST /api/chat — replace agent logic here
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── Dockerfile                     # For Azure Container Apps (Vercel doesn't need it)
└── .env.example
```

### `app/api/chat/route.ts`

The backend. Receives a list of messages, calls the LLM, returns the reply. **This is where your agent logic lives.** Default is a single LLM call; swap it for whatever your demo needs.

### `app/page.tsx`

The chat UI. React + Tailwind, conversation history in `useState`. Customize the title, the layout, the styling.

---

## What to change first

1. **`app/api/chat/route.ts` — `SYSTEM_PROMPT`** — your demo's role.
2. **`app/api/chat/route.ts` — body of `POST`** — your real logic (tools, RAG, workflow).
3. **`app/page.tsx` — `APP_TITLE`** — the heading.
4. **`.env.local`** — your Foundry endpoint, key, deployment name.

Leave the rest alone unless it forces you to.

---

## Deploy

### Vercel (recommended, zero-config)

```bash
npx vercel
```

Add the four env vars in the Vercel dashboard (or via `vercel env add`). That's it.

### Azure Container Apps

The included `Dockerfile` produces a standalone Next.js image.

```bash
az containerapp up \
  --name <project> \
  --resource-group <rg> \
  --location <region> \
  --source . \
  --env-vars AZURE_OPENAI_ENDPOINT=$AZURE_OPENAI_ENDPOINT \
             AZURE_OPENAI_API_KEY=$AZURE_OPENAI_API_KEY \
             AZURE_OPENAI_DEPLOYMENT=$AZURE_OPENAI_DEPLOYMENT
```

Deploy by hour 12, not hour 47. (`reference/48h-checklist.md` for why.)
