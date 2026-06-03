/**
 * Minimum viable LLM call against Azure AI Foundry.
 *
 * Loads env vars, builds the Azure OpenAI client, sends one chat completion,
 * prints the reply. ~30 lines on purpose — the shape stays the same once you
 * add tools, memory, or streaming.
 */

import 'dotenv/config';
import { AzureOpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? '2024-08-01-preview',
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT!,
});

// ────────────────────────────────────────────────────────────────────
// CHANGE ME #1 — System prompt: who the model is, how it should behave.
// ────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = 'You are a concise assistant. Reply in one short paragraph.';

// ────────────────────────────────────────────────────────────────────
// CHANGE ME #2 — User message: what you're sending in.
// ────────────────────────────────────────────────────────────────────
const USER_MESSAGE = "In 2 sentences, what's the difference between a workflow and an agent?";

async function main(): Promise<void> {
  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: USER_MESSAGE },
  ];

  const response = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT!, // deployment name, not model name
    messages,
    temperature: 0.7,
  });

  console.log(response.choices[0]?.message?.content ?? '');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
