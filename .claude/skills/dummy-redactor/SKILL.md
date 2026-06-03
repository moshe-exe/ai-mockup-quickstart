---
name: dummy-redactor
description: A meta-skill that writes itself based on your demo's use case. On first run it interviews the team about domain, demo objective, schema, and realism rules — then edits its own SKILL.md to bake those answers in. Subsequent runs use the captured rules to generate batches of synthetic items the team can drop into their mockup.
argument-hint: [init | generate <N> | refine | reset]
allowed-tools:
  - Read
  - Write
  - Edit
---

# Dummy Redactor

A skill that writes itself.

When you first invoke it, it has no domain — just structure. It asks the team about their case (what they're demoing, what kind of items need variety, what makes an item "realistic" in their context) and writes those answers into its own State sections below. Subsequent runs are case-aware.

## Why this pattern

Synthetic data is the cheapest path to a believable demo. Hand-writing 30 sample items takes hours. Hand-writing 3 and letting an LLM extend them under explicit rules takes minutes. This skill is the structure that makes those rules explicit, so the LLM generates variety without drifting into nonsense.

The reason the skill doesn't ship with content: rules for synthetic patients, products, support tickets, sensor readings, or conversations look nothing alike. Hardcoding one domain would make the skill useless for the next team. So the skill is empty until the team teaches it their case.

---

## Commands

| Command | What it does |
|---------|--------------|
| `/dummy-redactor init` | Interview the team, populate the State sections below |
| `/dummy-redactor generate <N>` | Generate N items using the populated State |
| `/dummy-redactor refine` | Adjust the rules based on outputs that didn't look realistic |
| `/dummy-redactor reset` | Clear the State sections back to empty |

If `$ARGUMENTS` is empty: check whether the State sections are populated. If not, suggest `init`. If yes, ask whether to `generate`, `refine`, or `reset`.

---

## State

The five sections below are this skill's memory of the team's case. They start empty and are populated by `init`, edited by `refine`, and read by `generate`. The team is free to edit them directly between runs.

### Domain
<!-- skill:domain:start -->
*(not set — run `/dummy-redactor init`)*
<!-- skill:domain:end -->

### Demo objective
<!-- skill:objective:start -->
*(not set)*
<!-- skill:objective:end -->

### Schema (fields per item)
<!-- skill:schema:start -->
*(not set)*
<!-- skill:schema:end -->

### Realism rules
<!-- skill:rules:start -->
*(not set)*
<!-- skill:rules:end -->

### Seed examples
<!-- skill:seeds:start -->
*(not set)*
<!-- skill:seeds:end -->

---

## Command: `init`

**Trigger:** `/dummy-redactor init`

Interview the team and edit the State sections above with their answers.

### Questions

1. **Domain.** What kind of items do you need? Examples: patients, products, conversations, transactions, support tickets, sensor readings, social posts. One sentence.

2. **Demo objective.** What is the synthetic data going to demo? Common answers: *"show the agent handling a variety of cases"*, *"stress-test the prompt with edge cases"*, *"populate the UI with believable content"*. Write the team's answer verbatim.

3. **Schema.** What fields does one item have? Name them and their types (e.g., string, number, enum, date, nested object). Aim for the minimum schema the demo actually shows — extra fields are dead weight.

4. **Realism rules.** What must be true for an item to look real to someone who knows the domain?
   - Required fields vs optional
   - Value ranges (numeric or enum)
   - Cross-field constraints ("if field X is value V, then field Y must be in range R")
   - Distribution targets ("60% category A, 40% category B")
   - Forbidden combinations
   - Natural language style (formal / casual / technical / first-person, etc.)

5. **Seeds.** Write 2–3 hand-crafted items that look exactly the way you want the rest to look. These anchor the LLM's style. Quality of seeds > quantity.

### Output

After the interview, **edit this SKILL.md file** to replace the five `*(not set)*` placeholders with the team's answers, keeping the `<!-- skill:*:start -->` and `<!-- skill:*:end -->` markers intact.

Then confirm with the team that the file reflects their case, and suggest they commit the change so the whole team shares the same rules.

---

## Command: `generate <N>`

**Trigger:** `/dummy-redactor generate <N>`

Generate N items using the populated State.

### Steps

1. Read the State sections (domain, objective, schema, rules, seeds). If any are still `*(not set)*`, abort and suggest running `init` first.
2. Build a prompt with this shape:
   - System: *"You generate synthetic data for a demo. Domain: {domain}. Objective: {objective}. Schema: {schema}. Rules: {rules}. Style anchors: {seeds}. Return a JSON array of N items, no commentary."*
   - User: *"Generate {N} items."*
3. Call the LLM. The team's LLM access is expected via env vars (typically `AZURE_OPENAI_*` set up by the `foundry-cli` skill).
4. Parse the output as JSON. If parsing fails, retry once with a stricter system prompt.
5. Validate every item against the schema and rules. Log any violations.
6. Write the validated items to a file (`dummies.json` by default, or a path the team specifies).
7. Spot-check: print 2–3 items in chat for the team to review.

### When validation fails

- **Schema mismatch:** patch the prompt with stronger schema enforcement (give the full JSON schema, not just a description), retry.
- **Rule violations:** add the specific violations to the prompt as explicit "do not" constraints, retry.
- **Style drift:** remind the LLM about the seeds and ask it to imitate their tone/structure.

---

## Command: `refine`

**Trigger:** `/dummy-redactor refine`

Adjust the rules based on outputs the team didn't like.

### Steps

1. Ask the team to point at specific generated items and explain *why* they don't look realistic.
2. Translate those gripes into rule additions or schema tightenings.
3. Edit the `<!-- skill:rules:start -->` section (or `<!-- skill:schema:start -->` if the gripe is structural) to incorporate the updates.
4. Optionally regenerate by calling `generate <N>` again.

---

## Command: `reset`

**Trigger:** `/dummy-redactor reset`

Clear all State sections back to `*(not set)*`. Confirm with the team first — this discards their captured case.

---

## Notes

- **This skill is the control layer.** The actual generation is best run via `examples/04-dummy-data-generator/` in this toolkit, which has working Python / Node / TypeScript implementations of the prompt-and-validate loop. The skill captures the *what* and *why*; the example code captures the *how*.
- **Treat the State sections as code.** Commit them. Review changes in PRs. They're the contract between the team's mental model and the LLM's output.
- **Seeds beat rules.** When in doubt, write better seeds before adding more rules.
