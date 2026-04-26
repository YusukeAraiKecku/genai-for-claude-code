---
name: genai-validate
description: Validate a compiled Genai skill bundle or a genai.recipe.yml for correctness, safety, and eval coverage. Use when the user asks to validate, check, or verify a skill or recipe.
allowed-tools:
  - Bash
  - Read
  - Glob
---

# genai-validate

## Purpose

Run the 3-layer validator (static → contract → qualitative) against a compiled skill bundle, or validate a raw recipe YAML.

## When to use

Invoke this skill when the user asks to:
- Validate a skill bundle
- Check a recipe for safety issues
- Verify that a compiled skill is correct

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| target | text | yes | Path to compiled skill dir, recipe YAML, or directory containing a recipe |

## Process

1. Determine if target is a compiled bundle (has `SKILL.md`) or a raw recipe.
2. Run the appropriate validation:

```bash
# For compiled bundle:
node packages/cli/dist/index.js validate <skill_dir>

# For recipe:
node packages/cli/dist/index.js validate <recipe_path>
```

3. Report each finding with layer and status (`pass` / `warn` / `fail`).
4. If all pass, confirm with `✓ validation ok`.

## Output contract

Structured output per finding:
```
  ✓ pass  [static] found SKILL.md
  ✓ pass  [contract] input.schema.json is well-formed
  ✓ pass  [qualitative:case-id] fixture loaded (N chars)
```

## Safety rules

- Read-only — never modifies files
- Reports issues but never auto-fixes (fixes belong to `genai-compile`)

## Failure handling

On `fail` findings, explain what each failure means and which recipe field to edit to resolve it.
