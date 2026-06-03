# 48-hour checklist

A method, not a script. Adapt the times to your event's actual length, but keep the **structure** (4 blocks + 2 checkpoints) and the **non-negotiables** (deploy by hour 12, dummies not real data, single demo owner).

---

## The 4 blocks

| Block | Hours | Goal | Deliverable at the end |
|-------|-------|------|------------------------|
| **0. Decide** | 0 – 4 | Lock scope and architecture | One-sentence demo line, agent-vs-workflow pick, explicit cut list |
| **1. Skeleton** | 4 – 20 | End-to-end flow with dummies, all hardcoded | Live URL where the flow runs at hour 12 |
| **2. Polish logic** | 20 – 36 | Iterate prompts, tools, and the happy path | Demo runs smoothly start to finish, no awkward pauses |
| **3. Demo + pitch** | 36 – 48 | Polish UI, record backup video, rehearse pitch | A 5-minute script the demo owner has read aloud three times |

---

## Block 0 — Decide (0–4h)

By hour 4, the team must have a written one-page plan. If you don't, you'll re-debate scope every 6 hours for the rest of the event.

**Outputs:**
- [ ] Problem stated in one sentence, no buzzwords
- [ ] One named persona (not "patients" — "Juan, 45, diabetes, 6 months out from last visit")
- [ ] One demo line: "user does X → sees Y → wow moment"
- [ ] Architecture pick (workflow vs agent) with a one-line reason
- [ ] Stack pick — use what you already know
- [ ] **Cut list**: 5+ things you explicitly will NOT build
- [ ] **Demo owner** named — one person decides what enters and what gets cut
- [ ] Roles per teammate, with rough hour budget per role

**Anti-pattern:** "Let's start coding, we'll figure out scope as we go." You'll figure out at hour 30 that you needed to figure it out at hour 2.

> The `mockup-architect` skill (`scope` command) walks the team through this in under an hour.

---

## Block 1 — Skeleton (4–20h)

End-to-end flow with dummies. Container local. Deploy by hour 12.

**Outputs:**
- [ ] Frontend (even if it's Streamlit or one HTML file) that takes user input
- [ ] Backend with one endpoint that calls the LLM
- [ ] LLM call working against `gpt-4o-mini` (or your chosen model)
- [ ] Dummy data hardcoded (no DB, no real data, no auth, no users beyond one)
- [ ] **Deployed somewhere public by hour 12** — Azure Container Apps, Vercel, Render, whatever works
- [ ] The happy path runs end-to-end in the deployed environment

**Non-negotiables:**
- **Deploy at hour 12, not hour 47.** The deploy will reveal env-var bugs, container issues, missing permissions, CORS — all of which take longer to fix than to deploy. Discover them while you still have time.
- **Use dummies, not real data.** Real data is a 4–8h sink. Dummies that look real are 30 minutes (use the `dummy-redactor` skill).
- **No auth.** Hardcode one user. The judge won't ask about auth.

---

## Checkpoint at hour 12

Ask, out loud, three questions:

1. **Does the end-to-end run with dummies?** Y / N
2. **Is it deployed somewhere with a URL?** Y / N
3. **If N to either: what's blocking — tech, scope, or team coordination?**

| Result | Action |
|--------|--------|
| Y, Y | Good. Move to Block 2. |
| Y, N | Stop everything else. Deploy now. Nothing else matters until there's a URL. |
| N | **Scope problem, not tech problem.** Don't change frameworks. Cut more. Invoke `/mockup-architect cut`. |

> **The hour-12 rule:** *"If the end-to-end doesn't run with dummies by hour 12, it's a scope problem, not a tech problem. Don't change stack. Recut."*

---

## Block 2 — Polish logic (20–36h)

Iterate the core interaction. Quality only on the happy path.

**Outputs:**
- [ ] Prompts tuned (system prompt, few-shot examples if needed)
- [ ] Tool definitions clean (if agent)
- [ ] Flow runs smoothly through the entire demo without surprises
- [ ] Edge cases inside the demo path handled (not edge cases the judge won't see)
- [ ] Latency is acceptable (under ~3 seconds per response)
- [ ] Human-in-the-loop hooks in place (if domain demands it — healthcare always does)

**Anti-pattern:** "Let's also handle authentication / pagination / error recovery / different user roles." None of that helps the demo. The judge doesn't see it.

---

## Checkpoint at hour 24

Ask, out loud, two questions:

1. **Is the direction still viable?** Be honest. The team will be exhausted; the bias is to say yes.
2. **Will the next 24 hours close the gap to a memorable demo?**

| Result | Action |
|--------|--------|
| Y, Y | Keep going. |
| N to either | **Pivot conversation.** Pivoting at hour 24 is expensive but possible — you have 24h left. After hour 24 it's not. Don't postpone this conversation. |

---

## Block 3 — Demo + pitch (36–48h)

Polish UI. Record backup video. Rehearse pitch.

**Outputs:**
- [ ] UI presentable (basic typography, alignment, no debugging panels visible)
- [ ] **Backup video recorded by hour 40** — if the live demo fails on stage, you have the video
- [ ] 5-minute pitch script written
- [ ] Demo owner has rehearsed the pitch out loud **at least 3 times**
- [ ] Demo runs cleanly on the actual presentation device (projector, screen, etc.)
- [ ] The team knows exactly who says what and when

**Anti-pattern:** "We'll polish during the presentation." You won't. The judge will see the rough edges.

---

## Non-negotiables (read once, apply always)

1. **One demo owner.** Decides scope. Vetoes additions.
2. **Trunk-based dev.** No PRs between teammates. Commit straight to `main`.
3. **Deploy by hour 12.**
4. **Dummies, not real data.**
5. **Backup video by hour 40.**
6. **Rehearse the pitch three times before going on stage.**

---

## Related

- `agent-vs-workflow.md` — the architecture pick (locked in Block 0)
- `common-mistakes.md` — what to avoid across all blocks
- `../.claude/skills/mockup-architect/SKILL.md` — coaches the team through every block
- `../.claude/skills/foundry-cli/SKILL.md` — gets the LLM endpoint ready in Block 1
- `../.claude/skills/dummy-redactor/SKILL.md` — produces the synthetic data Block 1 needs
