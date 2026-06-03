/**
 * Function calling: give the LLM a tool, let it call it, send the result back.
 *
 * One tool (get_current_time) keeps the loop visible. The pattern is the
 * same for any number of tools — just extend the dispatch.
 */

import 'dotenv/config';
import { AzureOpenAI } from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/chat/completions';

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? '2024-08-01-preview',
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT!,
});
const DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT!;


// ────────────────────────────────────────────────────────────────────
// CHANGE ME #1 — Tool DEFINITION: the schema the LLM sees.
// ────────────────────────────────────────────────────────────────────
const TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_current_time',
      description: 'Get the current time in a given IANA timezone.',
      parameters: {
        type: 'object',
        properties: {
          timezone: {
            type: 'string',
            description: "IANA timezone name, e.g. 'America/Lima' or 'Europe/Madrid'.",
          },
        },
        required: ['timezone'],
      },
    },
  },
];


// ────────────────────────────────────────────────────────────────────
// CHANGE ME #2 — Tool IMPLEMENTATION: the real TS function.
// ────────────────────────────────────────────────────────────────────
function getCurrentTime({ timezone }: { timezone: string }): string {
  return new Date().toLocaleString('sv', { timeZone: timezone, hour12: false });
}


// Dispatch table — add a row per tool when you grow the list.
const TOOL_FUNCTIONS: Record<string, (args: any) => string> = {
  get_current_time: getCurrentTime,
};


// ────────────────────────────────────────────────────────────────────
// CHANGE ME #3 — User message: what you're asking the LLM.
// ────────────────────────────────────────────────────────────────────
const USER_MESSAGE = 'What time is it in Lima right now?';


async function main(): Promise<void> {
  const messages: ChatCompletionMessageParam[] = [{ role: 'user', content: USER_MESSAGE }];

  // ── First LLM call: the LLM decides whether to call a tool ───
  const first = await client.chat.completions.create({
    model: DEPLOYMENT,
    messages,
    tools: TOOLS,
  });
  const choice = first.choices[0].message;
  messages.push(choice);

  if (!choice.tool_calls?.length) {
    console.log(choice.content);
    return;
  }

  // ── Execute each requested tool and append its result ──────────
  for (const call of choice.tool_calls) {
    const name = call.function.name;
    const args = JSON.parse(call.function.arguments);
    console.log(`→ tool: ${name}(${JSON.stringify(args)})`);

    const result = TOOL_FUNCTIONS[name](args);
    console.log(`← result: ${result}`);

    messages.push({
      role: 'tool',
      tool_call_id: call.id,
      content: JSON.stringify(result),
    });
  }

  // ── Second LLM call: now it has the tool result, give us the answer ──
  const final = await client.chat.completions.create({ model: DEPLOYMENT, messages });
  console.log('\n' + (final.choices[0]?.message?.content ?? ''));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
