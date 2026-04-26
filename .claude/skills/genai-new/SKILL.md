---
name: genai-new
description: Create a new Genai recipe skeleton (genai.recipe.yml + directories) for a new skill. Use when the user asks to create a new Genai skill, recipe, or AI app scaffold.
allowed-tools:
  - Bash
  - Read
  - Write
---

# genai-new

## Purpose

Scaffold a new Genai skill recipe using the `genai new <skill-id>` CLI command. The skill ID must be kebab-case.

## When to use

Invoke this skill when the user asks to:
- Create a new Genai skill
- Scaffold a recipe for a new AI app
- Initialize a new skill directory

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| skill_id | text | yes | Kebab-case identifier for the new skill (e.g. `proposal-review`) |

## Process

1. Validate that `skill_id` is kebab-case (`^[a-z][a-z0-9-]*[a-z0-9]$`).
2. Run `genai new <skill_id>` from the repo root.
3. Show the user the created files and the next steps.

```bash
node packages/cli/dist/index.js new <skill_id>
```

4. Remind the user to edit `genai-apps/<skill_id>/genai.recipe.yml` before compiling.

## Output contract

- Confirms created path: `genai-apps/<skill_id>/`
- Lists next commands: `genai compile` → `genai validate`

## Safety rules

- Never create skills with IDs containing `..` or `/`
- Never overwrite an existing skill directory

## Failure handling

If the directory already exists, tell the user and suggest a different ID or that they delete the existing one first.
