"""
Minimum viable LLM call against Azure AI Foundry.

Loads env vars, builds the Azure OpenAI client, sends one chat completion,
prints the reply. ~30 lines on purpose — the shape stays the same once you
add tools, memory, or streaming.
"""

import os
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-08-01-preview"),
)

# ────────────────────────────────────────────────────────────────────
# CHANGE ME #1 — System prompt: who the model is, how it should behave.
# ────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT = "You are a concise assistant. Reply in one short paragraph."

# ────────────────────────────────────────────────────────────────────
# CHANGE ME #2 — User message: what you're sending in.
# ────────────────────────────────────────────────────────────────────
USER_MESSAGE = "In 2 sentences, what's the difference between a workflow and an agent?"


def main() -> None:
    response = client.chat.completions.create(
        model=os.environ["AZURE_OPENAI_DEPLOYMENT"],  # deployment name, not model name
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": USER_MESSAGE},
        ],
        temperature=0.7,
    )
    print(response.choices[0].message.content)


if __name__ == "__main__":
    main()
