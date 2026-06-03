/**
 * Mini agent loop: LLM picks tools, code executes them, repeat until done.
 *
 * ~80 lines. Three safety guards (max iterations, tool whitelist, argument
 * parsing) make this safe to ship in a hackathon mockup.
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
// CHANGE ME — Tools (definitions + implementations).
// ────────────────────────────────────────────────────────────────────
const TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_current_time',
      description: 'Get the current time in a given IANA timezone.',
      parameters: {
        type: 'object',
        properties: { timezone: { type: 'string' } },
        required: ['timezone'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_numbers',
      description: 'Add two numbers and return the sum.',
      parameters: {
        type: 'object',
        properties: { a: { type: 'number' }, b: { type: 'number' } },
        required: ['a', 'b'],
      },
    },
  },
];

function getCurrentTime({ timezone }: { timezone: string }): string {
  return new Date().toLocaleString('sv', { timeZone: timezone, hour12: false });
}
function addNumbers({ a, b }: { a: number; b: number }): number {
  return a + b;
}

const TOOL_FUNCTIONS: Record<string, (args: any) => unknown> = {
  get_current_time: getCurrentTime,
  add_numbers: addNumbers,
};


// ────────────────────────────────────────────────────────────────────
// CHANGE ME — Agent behaviour.
// ────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT =
  "You are a concise assistant. Use tools when you need data you don't have. Reply in one short paragraph.";
const USER_MESSAGE = "What time is it in Lima right now, and what's 23 + 19?";
const MAX_ITERATIONS = 5;


async function runAgent(userMessage: string): Promise<string> {
  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ];

  for (let step = 1; step <= MAX_ITERATIONS; step++) {
    const response = await client.chat.completions.create({
      model: DEPLOYMENT,
      messages,
      tools: TOOLS,
    });
    const choice = response.choices[0].message;
    messages.push(choice);

    if (!choice.tool_calls?.length) {
      return choice.content ?? '';
    }

    console.log(`\n[step ${step}] tool calls:`);
    for (const call of choice.tool_calls) {
      const name = call.function.name;
      let result: unknown;
      if (!(name in TOOL_FUNCTIONS)) {
        result = `error: unknown tool '${name}'`;
      } else {
        try {
          const args = JSON.parse(call.function.arguments);
          result = TOOL_FUNCTIONS[name](args);
        } catch (exc) {
          result = `error: ${(exc as Error).message}`;
        }
      }
      console.log(`  → ${name}(${call.function.arguments}) = ${result}`);
      messages.push({
        role: 'tool',
        tool_call_id: call.id,
        content: JSON.stringify(result),
      });
    }
  }

  return '(stopped: max iterations reached)';
}

const answer = await runAgent(USER_MESSAGE);
console.log(`\n${answer}`);
