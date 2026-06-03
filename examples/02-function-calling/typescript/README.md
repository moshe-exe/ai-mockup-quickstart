# Function calling — TypeScript

## Run it

```bash
cp .env.example .env       # then fill in your values
npm install
npm start
```

## What's in `function-calling.ts`

- **`TOOLS`** — typed `ChatCompletionTool[]`. CHANGE ME #1.
- **`getCurrentTime`** — the TS function. CHANGE ME #2.
- **`TOOL_FUNCTIONS`** — typed dispatch table.
- **`USER_MESSAGE`** — CHANGE ME #3.
- **`main()`** — two LLM calls with tool execution in between.

## Adding more tools

```ts
TOOLS.push({ type: 'function', function: { name: '...', ... } });
function myNewTool(args: { ... }): string { return ...; }
TOOL_FUNCTIONS.my_new_tool = myNewTool;
```
