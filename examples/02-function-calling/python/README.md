# Function calling — Python

## Run it

```bash
cp .env.example .env       # then fill in your values
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python function_calling.py
```

You should see the tool being invoked, the result, and the final answer printed in sequence.

## What's in `function_calling.py`

- **`TOOLS`** — JSON schema the LLM sees. CHANGE ME #1.
- **`get_current_time(timezone)`** — the actual Python function. CHANGE ME #2.
- **`TOOL_FUNCTIONS`** — dispatch table mapping tool name → function.
- **`USER_MESSAGE`** — what you're asking. CHANGE ME #3.
- **`main()`** — two LLM calls with tool execution in between.

## Adding more tools

```python
# 1. Add to TOOLS (schema)
TOOLS.append({"type": "function", "function": { "name": "...", ... }})

# 2. Implement the function
def my_new_tool(arg1: str) -> str:
    return ...

# 3. Register in the dispatch
TOOL_FUNCTIONS["my_new_tool"] = my_new_tool
```

That's the whole extension pattern.
