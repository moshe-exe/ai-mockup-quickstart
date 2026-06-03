"""
FastAPI backend for the mockup.

One endpoint: POST /chat. Receives the conversation history, calls the LLM,
returns the reply. Replace the body of `chat()` with your real agent / workflow
logic — the rest is wiring you can leave alone.
"""

import os
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import AzureOpenAI
from pydantic import BaseModel

# ────────────────────────────────────────────────────────────────────
# CHANGE ME — System prompt: defines the model's role for your demo.
# ────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT = "You are a concise, helpful assistant. Reply in one short paragraph."


# ── Setup ────────────────────────────────────────────────────────────

client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-08-01-preview"),
)

DEPLOYMENT = os.environ["AZURE_OPENAI_DEPLOYMENT"]

app = FastAPI(title="Mockup Backend")

# CORS open for local dev. Lock down for deploy.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Types ────────────────────────────────────────────────────────────


class Message(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]


class ChatResponse(BaseModel):
    message: str


# ── Endpoints ───────────────────────────────────────────────────────


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    """
    Default implementation: a single LLM call with the system prompt prepended.
    Replace this body with your real agent loop, workflow, or RAG pipeline.
    """
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + [
        m.model_dump() for m in request.messages
    ]

    response = client.chat.completions.create(
        model=DEPLOYMENT,
        messages=messages,
        temperature=0.7,
    )

    return ChatResponse(message=response.choices[0].message.content or "")
