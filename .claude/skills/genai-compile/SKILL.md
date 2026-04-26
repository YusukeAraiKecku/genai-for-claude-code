---
name: genai-compile
description: Compile a genai.recipe.yml into a deployable Claude Code skill bundle (SKILL.md + input.schema.json + README). Use when the user asks to compile, build, or generate a skill from a recipe.
allowed-tools:
  - Bash
  - Read
  - Glob
---

# genai-compile

## Purpose

Run the Genai compiler to turn a recipe YAML into a Claude Code skill bundle ready for deployment to `.claude/skills/`.

## When to use

Invoke this skill when the user asks to:
- Compile a recipe
- Build a skill from a `genai.recipe.yml`
- Regenerate a skill bundle after editing the recipe

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| recipe_path | text | no | Path to `genai.recipe.yml` or its containing directory. Defaults to CWD. |
| out_dir | text | no | Output directory. Defaults to `.claude/skills/<skill-id>`. |
| strict | boolean | no | Treat warnings as errors (CI mode). |

## Process

1. Resolve the recipe path.
2. Run the compiler:

```bash
node packages/cli/dist/index.js compile --recipe <recipe_path> [--out <out_dir>] [--strict]
```

3. Report compiled files and any safety warnings.
4. Suggest running `genai validate` on the output.

## Output contract

- Prints compiled file list
- Prints any `block` or `warn` safety issues
- Exits 0 on success, non-zero on failure

## Safety rules

- Never use `Bash(*)` wildcard
- Never write outside the declared `--out` directory
- If `block`-severity safety issues are found, the compile fails — do not bypass

## Failure handling

If compile fails due to schema errors, show the exact validation messages and point the user to the relevant recipe fields.
