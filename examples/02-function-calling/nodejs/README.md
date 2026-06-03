# Function calling — Node.js

## Run it

```bash
cp .env.example .env       # then fill in your values
npm install
npm start
```

## What's in `function-calling.js`

- **`TOOLS`** — JSON schema the LLM sees. CHANGE ME #1.
- **`getCurrentTime({ timezone })`** — the actual JS function. CHANGE ME #2.
- **`TOOL_FUNCTIONS`** — dispatch table mapping tool name → function.
- **`USER_MESSAGE`** — what you're asking. CHANGE ME #3.
- **`main()`** — two LLM calls with tool execution in between.

## Adding more tools

```js
TOOLS.push({ type: 'function', function: { name: '...', ... } });
function myNewTool(args) { return ...; }
TOOL_FUNCTIONS.my_new_tool = myNewTool;
```
