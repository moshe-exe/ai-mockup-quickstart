# Starters

Project templates to clone and start from. Each one is **opinionated** and wired up so you can focus on the agent logic, not the plumbing.

Two are shipped and ready (`✅`). Two are planned (`🚧`) and will land based on demand.

| Starter | Stack | Best for | Status |
|---------|-------|----------|--------|
| [`python-fastapi-streamlit`](./python-fastapi-streamlit/) | FastAPI backend + Streamlit UI | Python-leaning teams. Fastest path to a chat UI. Data-science crowd will feel at home. | ✅ |
| [`nextjs-fullstack`](./nextjs-fullstack/) | Next.js with API routes | Frontend-leaning teams. Single repo, single deploy (Vercel-ready). | ✅ |
| [`python-fastapi-nextjs`](./python-fastapi-nextjs/) | FastAPI backend + Next.js frontend | Mixed team that wants production-shaped separation but Python on the backend. | 🚧 |
| [`nodejs-express-react`](./nodejs-express-react/) | Express backend + React (Vite) frontend | Node-first teams who want clear backend/frontend split. | 🚧 |

## How to pick

- **You don't know the stack yet?** Pick `python-fastapi-streamlit`. Lowest friction.
- **You want the demo to look "real" without spending UI time?** Pick `nextjs-fullstack`.
- **You have a frontend dev who insists on a real frontend?** Pick `python-fastapi-nextjs` (when it lands) or `nodejs-express-react`.

## Every starter ships with

- `docker-compose.yml` — single-command local setup
- Pre-wired Azure AI Foundry client
- A minimal but presentable UI (chat or form)
- `.env.example` with only the vars you actually need
- A README explaining what to change first
- A "deploy to Azure Container Apps" note
