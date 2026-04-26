---
name: genai-import
description: Import and adapt an existing AI app concept (prompt, web form, API spec) into a Genai recipe skeleton following the clean-room philosophy. Use when the user wants to port or convert an existing AI application into a Genai skill.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Write
---

# genai-import

## Purpose

Help the user convert an existing AI app concept into a `genai.recipe.yml` by asking structured questions and producing a recipe skeleton. This is a clean-room operation: ideas are reinterpreted, code is never copied.

## When to use

Invoke this skill when the user asks to:
- Import an existing AI app as a Genai skill
- Convert a prompt / web form / API spec into a recipe
- Port an AI workflow to Claude Code

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| description | markdown | yes | Description of the AI app to import — what it does, its inputs, its outputs |
| skill_id | text | yes | Kebab-case identifier for the new skill |

## Process

1. Ask clarifying questions if the description is ambiguous:
   - What are the required inputs?
   - What does the output look like (format, structure)?
   - Does it need network access or files from disk?
   - Are there security constraints?

2. Map inputs to Genai input types (`text`, `markdown`, `file`, `select`, etc.)

3. Determine the appropriate execution mode:
   - `claude-local` — pure text in/out, no files needed
   - `local-file` — needs to read files from disk
   - `remote-api` — last resort, only if external API is unavoidable

4. Generate a `genai.recipe.yml` skeleton.

5. Write the skeleton to `genai-apps/<skill_id>/genai.recipe.yml`.

6. Tell the user to review and run `genai compile`.

## Output contract

- Creates `genai-apps/<skill_id>/genai.recipe.yml` with realistic defaults
- Prints a summary of mapping decisions made

## Safety rules

- **Clean-room**: never read or copy source code from external repos
- Always prefer `claude-local` over `remote-api`
- Never include hardcoded API keys or credentials in the recipe

## Failure handling

If the user's description is too vague to produce a useful recipe, ask 2-3 specific clarifying questions before proceeding.
