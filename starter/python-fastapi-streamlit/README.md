# Starter — Python FastAPI + Streamlit

A two-service template (backend + frontend) wired up to Azure AI Foundry. Clone it, fill in `.env`, run one command, and you have a chat UI talking to a model.

```
┌──────────────────┐         ┌──────────────────┐         ┌────────────────────┐
│    Streamlit     │ ──HTTP─▶│     FastAPI      │ ──HTTP─▶│  Azure AI Foundry  │
│  (chat UI :8501) │         │  (/chat :8000)   │         │   (gpt-4o-mini)    │
└──────────────────┘         └──────────────────┘         └────────────────────┘
```

**Best for:** Python-leaning teams, data-science crowd, fastest path to a presentable chat UI.

**Not the right fit if:** you need a "real" frontend (use `nextjs-fullstack` or `python-fastapi-nextjs`).

---

## Prerequisites

- Docker + Docker Compose
- A Foundry resource with `gpt-4o-mini` deployed (use `/foundry-cli create <name>`)

---

## Run it

```bash
cp .env.example .env       # then fill in your Foundry values
docker compose up --build
```

Open <http://localhost:8501> — you should see a chat UI. Type a message, get a reply.

---

## What's where

```
python-fastapi-streamlit/
├── docker-compose.yml         # Two services: backend + frontend
├── .env.example               # Foundry + service URL config
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── main.py                # FastAPI app — replace agent logic here
└── frontend/
    ├── Dockerfile
    ├── requirements.txt
    └── app.py                 # Streamlit UI — customize layout here
```

### `backend/main.py`

One endpoint: `POST /chat`. Receives a list of messages, calls the LLM, returns the reply. **This is where your agent logic lives.** The default implementation is a single LLM call; replace it with whatever your demo needs.

### `frontend/app.py`

A standard Streamlit chat UI (`st.chat_message`, `st.chat_input`). Maintains conversation history in `st.session_state`, posts to the backend on each turn. Customize the title, the system prompt, and the layout.

---

## What to change first

1. **`backend/main.py` — `SYSTEM_PROMPT`** — replace with your demo's role.
2. **`backend/main.py` — `chat()` endpoint body** — replace the single LLM call with your actual logic (tools, RAG, workflow, etc.).
3. **`frontend/app.py` — `APP_TITLE`** — your demo's name.
4. **`.env`** — your Foundry endpoint, key, deployment name.

Everything else is plumbing — leave it alone until something forces you to touch it.

---

## Deploy to Azure Container Apps

The two services can be deployed independently. Rough sketch:

```bash
# Backend
az containerapp up \
  --name <project>-backend \
  --resource-group <rg> \
  --location <region> \
  --source ./backend \
  --env-vars AZURE_OPENAI_ENDPOINT=$AZURE_OPENAI_ENDPOINT \
             AZURE_OPENAI_API_KEY=$AZURE_OPENAI_API_KEY \
             AZURE_OPENAI_DEPLOYMENT=$AZURE_OPENAI_DEPLOYMENT

# Frontend (point at the backend's public URL)
az containerapp up \
  --name <project>-frontend \
  --resource-group <rg> \
  --location <region> \
  --source ./frontend \
  --env-vars BACKEND_URL=https://<backend-url>
```

Deploy by hour 12, not hour 47. (`reference/48h-checklist.md` for why.)

---

## Local dev without Docker

If `docker compose` is heavy for your machine, run each service directly:

```bash
# Terminal 1 — backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend
pip install -r requirements.txt
BACKEND_URL=http://localhost:8000 streamlit run app.py
```

Less reproducible than Docker but easier to iterate during the first hours.
