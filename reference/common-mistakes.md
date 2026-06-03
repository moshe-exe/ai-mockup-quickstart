# Common mistakes (and how to avoid them)

Patterns observed across hackathon teams building Generative AI mockups. None of these are about being a worse engineer — they're about misallocating limited time. Read once at hour 0. Re-read at hour 12.

---

## 1. Building features instead of the demo

**Looks like:** "Let's add authentication, then a settings page, then a history view, then..."

**Why it kills you:** every feature that doesn't appear in the 5-minute demo is hours that didn't contribute to winning. Judges don't see auth. They don't see your settings page.

**Do instead:** start every implementation decision by asking *"does this appear in the 5-minute demo?"* If not, hardcode it or skip it.

---

## 2. Wanting "real" data

**Looks like:** "Let's clean up this medical dataset from Kaggle / scrape this catalog / import this CSV."

**Why it kills you:** real datasets eat 4–8 hours and the demo doesn't get better. Real data has missing fields, weird encodings, edge cases that distract the team, and IP issues you can't resolve in 48h.

**Do instead:** hand-write 3–5 high-quality seed items. Use the `dummy-redactor` skill to generate a pool of 20–50 more under explicit realism rules. Total time: 30 minutes. The result looks more curated than real data ever does.

---

## 3. Premature multi-agent

**Looks like:** "We'll have a coordinator agent, then a research agent, then a writing agent..."

**Why it kills you:** 4× the debugging surface, 4× the latency, 4× the chances something hallucinates. In 48h the mono-agent almost never collapses; the multi-agent setup collapses on day 1.

**Do instead:** start with one agent and good tools. Specialize only when you've **proven** the mono-agent breaks under your actual demo flow. (You won't prove it. Mono-agent is enough.)

---

## 4. RAG when you don't need it

**Looks like:** "We need AI Search to retrieve relevant content."

**Why it kills you:** RAG setup is index design + chunking + embeddings + retrieval tuning + a Connection. That's a day. And most demos don't need it — the context fits in the prompt.

**Do instead:** paste the relevant context directly into the model's input. If you can fit 5–10 paragraphs of reference material in the prompt, you don't need RAG. Only reach for AI Search when your demo *literally cannot work* without searching over hundreds of items.

---

## 5. Forgetting the human-in-the-loop

**Looks like:** "Our agent recommends medication" / "Our agent approves the loan" / "Our agent diagnoses the patient."

**Why it kills you:** in regulated domains (especially healthcare, finance, legal), this framing is an instant red flag for any judge with industry experience. They stop listening to the rest.

**Do instead:** show explicitly where the human approves, modifies, or rejects what the AI does. *"The agent suggests, the doctor approves with one click. The system records who approved what."* Same technical flow, different story. The "trace of responsibility" is what makes the demo credible.

---

## 6. Deploying at hour 47

**Looks like:** "We'll deploy once everything else is done."

**Why it kills you:** the first deploy always surfaces problems — missing env vars, container quirks, permission issues, CORS, network rules. At hour 12 you have 36 hours to debug. At hour 47 you have one.

**Do instead:** deploy in Block 1 (by hour 12). The deployed version may be ugly. That's fine. The point is to flush out integration problems while there's still time to fix them.

---

## 7. Building a product instead of a demo

**Looks like:** auth, persistence, error handling for paths the demo doesn't traverse, scaling considerations, multi-tenancy, dark mode, mobile responsive, accessibility audits.

**Why it kills you:** all of that is "product" engineering. You're building a *demo* — a controlled narrative experience. None of that adds value to the 5 minutes the judge watches.

**Do instead:** for every choice, ask *"is this in the demo, or am I building a product?"* If product, drop it.

---

## 8. Over-engineering the prompt

**Looks like:** 300-line system prompt with 12 sections, 8 examples, and elaborate output formatting instructions.

**Why it kills you:** beyond a certain length, models start ignoring half of what's in the prompt. You spend hours debugging output drift caused by the prompt being too long.

**Do instead:** ~30 lines of system prompt. 2–3 few-shot examples. Iterate by removing instructions, not adding them. If the output isn't right, the issue is usually the *structure* of your prompt, not its length.

---

## 9. Postponing the pitch rehearsal

**Looks like:** "We'll figure out the talk track on the way to the venue."

**Why it kills you:** the team that owns the demo at hour 47 is exhausted. The pitch flows badly. The demo runs into awkward pauses. The judge senses it.

**Do instead:** rehearse the 5-minute pitch out loud, **three times**, by hour 44. The demo owner reads it. They time it. They rewrite the parts that don't land.

---

## 10. No backup video

**Looks like:** "We'll do everything live."

**Why it kills you:** networks fail. Models throttle. Deploys regress. Live demos that work flawlessly in rehearsal break the moment you stand on stage.

**Do instead:** record a clean run of the demo by hour 40. Keep it on the laptop, ready to play if the live version misbehaves. Telling the judge *"here's the recorded version"* is far better than visible panic.

---

## Cheat-sheet

| Mistake | Cost | Fix in one line |
|---------|------|-----------------|
| Features over demo | hours lost on invisible work | Does it appear in the demo? If no, drop it. |
| Real data | 4–8h | Hand-write 3 seeds + dummy-redactor for the rest |
| Multi-agent | 4× debug surface | Start mono-agent. Specialize only when it breaks. |
| Unnecessary RAG | 1 day | Paste context into the prompt first. |
| No HITL | credibility | Show where the human approves. |
| Late deploy | no time to debug | Deploy by hour 12. |
| Product mindset | scope creep | Building a demo, not a product. |
| Bloated prompt | output drift | 30 lines max. Remove > add. |
| No pitch rehearsal | bad delivery | 3 read-throughs by hour 44. |
| No backup video | one bad break = lost demo | Record clean run by hour 40. |

---

## Related

- `48h-checklist.md` — when each fix applies in the timeline
- `agent-vs-workflow.md` — the architecture decision that triggers many of these mistakes
- `../.claude/skills/mockup-architect/SKILL.md` — the skill is designed to catch most of these
