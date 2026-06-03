/**
 * Dummy data generator (agent-redactor pattern).
 *
 * Hand-write 2-3 seeds, give the LLM explicit realism rules, let it produce
 * a pool of N more. Output is validated before being written to disk.
 *
 * Replace SCHEMA, RULES, SEEDS, COUNT to match your demo's case.
 */

import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { AzureOpenAI } from 'openai';

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview',
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
});
const DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT;


// ────────────────────────────────────────────────────────────────────
// CHANGE ME #1 — Schema.
// ────────────────────────────────────────────────────────────────────
const SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    category: { type: 'string', enum: ['A', 'B', 'C'] },
    score: { type: 'number', minimum: 0, maximum: 100 },
  },
  required: ['id', 'title', 'category', 'score'],
};


// ────────────────────────────────────────────────────────────────────
// CHANGE ME #2 — Realism rules (plain English).
// ────────────────────────────────────────────────────────────────────
const RULES = [
  'id is a slug (kebab-case), unique across the set.',
  'title is a short phrase, 3-7 words, not generic.',
  'category is roughly 40% A, 35% B, 25% C across the set.',
  'score is a realistic spread, not all 50s or 100s.',
  "Avoid placeholder words like 'example', 'test', 'lorem'.",
];


// ────────────────────────────────────────────────────────────────────
// CHANGE ME #3 — Seeds (2-3 hand-crafted items).
// ────────────────────────────────────────────────────────────────────
const SEEDS = [
  { id: 'harbor-sunset-watch', title: 'Harbor Sunset Watch', category: 'A', score: 78 },
  { id: 'quiet-trail-loop', title: 'Quiet Trail Loop', category: 'B', score: 64 },
  { id: 'rooftop-garden-tour', title: 'Rooftop Garden Tour', category: 'C', score: 91 },
];


const COUNT = 20;
const OUTPUT_PATH = 'dummies.json';


function validate(item) {
  const errors = [];
  for (const field of SCHEMA.required) {
    if (!(field in item)) errors.push(`missing field: ${field}`);
  }
  if (item.category && !['A', 'B', 'C'].includes(item.category)) {
    errors.push(`invalid category: ${item.category}`);
  }
  if (typeof item.score === 'number' && (item.score < 0 || item.score > 100)) {
    errors.push(`score out of range: ${item.score}`);
  }
  return errors;
}


async function main() {
  const system = 'You generate synthetic data for a demo. Return a JSON array, no commentary.';
  const user = `Generate ${COUNT} items matching this schema:

${JSON.stringify(SCHEMA, null, 2)}

Rules:
${RULES.map((r) => `- ${r}`).join('\n')}

Style anchors (imitate the tone and shape, do not repeat ids):
${JSON.stringify(SEEDS, null, 2)}

Return ONLY a JSON object with an "items" array of ${COUNT} entries.`;

  const response = await client.chat.completions.create({
    model: DEPLOYMENT,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  const raw = response.choices[0].message.content ?? '';
  const parsed = JSON.parse(raw);
  const items = Array.isArray(parsed) ? parsed : parsed.items ?? [];

  const valid = [];
  const bad = [];
  for (const item of items) {
    const violations = validate(item);
    (violations.length ? bad : valid).push({ item, violations });
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(valid.map((v) => v.item), null, 2));
  console.log(`✓ wrote ${valid.length} items to ${OUTPUT_PATH}`);

  if (bad.length) {
    console.log(`⚠ ${bad.length} items failed validation:`);
    for (const { item, violations } of bad.slice(0, 3)) {
      console.log(`  ${JSON.stringify(item)}: ${violations}`);
    }
  }

  console.log('\nSample of the first 3:');
  for (const { item } of valid.slice(0, 3)) {
    console.log(`  ${JSON.stringify(item)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
