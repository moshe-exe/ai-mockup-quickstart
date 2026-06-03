"""
Mini agent loop: LLM picks tools, code executes them, repeat until done.

~80 lines. Three safety guards (max iterations, tool whitelist, argument
parsing) make this safe to ship in a hackathon mockup. Conversation history
lives in `messages` — that's all the memory the agent has.
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
# CHANGE ME — Tools (definitions + implementations).
# ────────────────────────────────────────────────────────────────────
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_current_time",
            "description": "Get the current time in a given IANA timezone.",
            "parameters": {
                "type": "object",
                "properties": {"timezone": {"type": "string"}},
                "required": ["timezone"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "add_numbers",
            "description": "Add two numbers and return the sum.",
            "parameters": {
                "type": "object",
                "properties": {"a": {"type": "number"}, "b": {"type": "number"}},
                "required": ["a", "b"],
            },
        },
    },
]


def get_current_time(timezone: str) -> str:
    return datetime.now(ZoneInfo(timezone)).isoformat()


def add_numbers(a: float, b: float) -> float:
    return a + b


TOOL_FUNCTIONS = {
    "get_current_time": get_current_time,
    "add_numbers": add_numbers,
}


# ────────────────────────────────────────────────────────────────────
# CHANGE ME — Agent behaviour.
# ────────────────────────────────────────────────────────────────────
SYSTEM_PROMPT = "You are a concise assistant. Use tools when you need data you don't have. Reply in one short paragraph."
USER_MESSAGE = "What time is it in Lima right now, and what's 23 + 19?"
MAX_ITERATIONS = 5  # safety guard against runaway loops


def run_agent(user_message: str) -> str:
    messages: list = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message},
    ]

    for step in range(1, MAX_ITERATIONS + 1):
        response = client.chat.completions.create(
            model=DEPLOYMENT,
            messages=messages,
            tools=TOOLS,
        )
        choice = response.choices[0].message
        messages.append(choice.model_dump(exclude_none=True))

        if not choice.tool_calls:
            return choice.content or ""

        print(f"\n[step {step}] tool calls:")
        for call in choice.tool_calls:
            name = call.function.name
            if name not in TOOL_FUNCTIONS:
                result = f"error: unknown tool {name!r}"
            else:
                try:
                    args = json.loads(call.function.arguments)
                    result = TOOL_FUNCTIONS[name](**args)
                except Exception as exc:
                    result = f"error: {exc}"
            print(f"  → {name}({call.function.arguments}) = {result}")
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": call.id,
                    "content": json.dumps(result),
                }
            )

    return "(stopped: max iterations reached)"


if __name__ == "__main__":
    answer = run_agent(USER_MESSAGE)
    print(f"\n{answer}")
