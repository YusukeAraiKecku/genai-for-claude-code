---
name: genai-pack
description: Package a compiled Genai skill for sharing — creates a portable zip archive with SKILL.md, input.schema.json, README, and assets. Use when the user wants to distribute or share a compiled skill.
allowed-tools:
  - Bash
  - Read
  - Glob
---

# genai-pack

## Purpose

Create a portable `.zip` archive of a compiled skill bundle for sharing with teammates or publishing to the Genai marketplace (v0.3+).

## When to use

Invoke this skill when the user asks to:
- Package a skill for sharing
- Create a distributable archive of a compiled skill
- Prepare a skill for marketplace submission

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| skill_dir | text | yes | Path to the compiled skill directory (must contain `SKILL.md`) |
| out_path | text | no | Output `.zip` path. Defaults to `<skill-id>-<version>.zip` in CWD. |

## Process

1. Verify `skill_dir` contains `SKILL.md` and `input.schema.json`.
2. Read `genai.recipe.yml` from the bundle to get `id` and `version`.
3. Run validation to confirm the bundle is clean before packing:

```bash
node packages/cli/dist/index.js validate <skill_dir>
```

4. Create the zip archive:

```bash
cd <skill_dir> && zip -r <out_path> . --exclude "*.map" --exclude ".DS_Store"
```

5. Print the archive path and size.

## Output contract

```
✓ packed: <skill-id>-<version>.zip (42 KB)
  contains: SKILL.md, input.schema.json, README.md, genai.recipe.yml, tests/, eval.yml
```

## Safety rules

- Never include `.env`, secret keys, or `node_modules` in the archive
- Validate before pack — refuse to pack a bundle with `fail`-severity issues
- Output path must be within the current working directory

## Failure handling

If validation fails, show the issues and instruct the user to fix them before packing.
