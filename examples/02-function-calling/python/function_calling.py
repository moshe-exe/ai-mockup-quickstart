"""
Function calling: give the LLM a tool, let it call it, send the result back.

The example uses one tool (get_current_time) so you can see the full loop.
The pattern is the same for any number of tools — just extend the dispatch.
"""

import json
import os
from datetime import datetime
from zoneinfo import ZoneInfo

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
# CHANGE ME #1 — Tool DEFINITION: the schema the LLM sees.
# ────────────────────────────────────────────────────────────────────
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_current_time",
            "description": "Get the current time in a given IANA timezone.",
            "parameters": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "IANA timezone name, e.g. 'America/Lima' or 'Europe/Madrid'.",
                    },
                },
                "required": ["timezone"],
            },
        },
    },
]


# ────────────────────────────────────────────────────────────────────
# CHANGE ME #2 — Tool IMPLEMENTATION: the real Python function.
# ────────────────────────────────────────────────────────────────────
def get_current_time(timezone: str) -> str:
    now = datetime.now(ZoneInfo(timezone))
    return now.isoformat()


# Dispatch table — add a row per tool when you grow the list.
TOOL_FUNCTIONS = {
    "get_current_time": get_current_time,
}


# ────────────────────────────────────────────────────────────────────
# CHANGE ME #3 — User message: what you're asking the LLM.
# ────────────────────────────────────────────────────────────────────
USER_MESSAGE = "What time is it in Lima right now?"


def main() -> None:
    messages: list = [{"role": "user", "content": USER_MESSAGE}]

    # ── First LLM call: the LLM decides whether to call a tool ─────
    first = client.chat.completions.create(
        model=DEPLOYMENT,
        messages=messages,
        tools=TOOLS,
    )
    choice = first.choices[0].message
    messages.append(choice.model_dump(exclude_none=True))

    if not choice.tool_calls:
        # No tool needed — just print the reply.
        print(choice.content)
        return

    # ── Execute each requested tool and append its result ──────────
    for call in choice.tool_calls:
        name = call.function.name
        args = json.loads(call.function.arguments)
        print(f"→ tool: {name}({args})")

        fn = TOOL_FUNCTIONS[name]
        result = fn(**args)
        print(f"← result: {result}")

        messages.append(
            {
                "role": "tool",
                "tool_call_id": call.id,
                "content": json.dumps(result),
            }
        )

    # ── Second LLM call: now it has the tool result, give us the answer ──
    final = client.chat.completions.create(model=DEPLOYMENT, messages=messages)
    print("\n" + final.choices[0].message.content)


if __name__ == "__main__":
    main()
