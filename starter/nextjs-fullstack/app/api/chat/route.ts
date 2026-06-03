/**
 * POST /api/chat — receives a list of messages, calls the LLM, returns the reply.
 * Replace the body of POST() with your real agent / workflow logic.
 */

import { NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// ────────────────────────────────────────────────────────────────────
// CHANGE ME — System prompt: defines the model's role for your demo.
// ────────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = 'You are a concise, helpful assistant. Reply in one short paragraph.';


const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? '2024-08-01-preview',
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT!,
});

type Body = { messages: { role: 'user' | 'assistant'; content: string }[] };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...body.messages,
  ];

  try {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT!, // deployment name, not model name
      messages,
      temperature: 0.7,
    });

    return NextResponse.json({
      message: response.choices[0]?.message?.content ?? '',
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
