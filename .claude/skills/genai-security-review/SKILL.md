---
name: genai-security-review
description: Review a genai.recipe.yml or compiled skill bundle for security issues — unsafe tools, network access, hardcoded secrets, overly broad permissions. Use when the user asks for a security review or audit of a Genai skill.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
---

# genai-security-review

## Purpose

Perform a security-focused review of a Genai recipe or compiled skill, checking for violations of the secure-by-default policy.

## When to use

Invoke this skill when the user asks to:
- Security-review a recipe or skill
- Audit a skill for unsafe patterns
- Check whether a skill follows the local-first security model

## Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| target | text | yes | Path to `genai.recipe.yml` or compiled skill directory |

## Process

1. Run the built-in safety checker:

```bash
node packages/cli/dist/index.js validate <target>
```

2. Additionally review manually for:
   - `allowed_tools` containing `Bash(*)` wildcard
   - `remote_api_required: true` without justification
   - `network: explicit-allow` on a local-mode skill
   - Hardcoded URLs, tokens, or credentials in any file
   - Artifact paths that could escape the skill directory (`../`, absolute paths)
   - Description that reveals sensitive business logic

3. Classify each finding by severity: `block` / `warn` / `note`.

4. Produce a structured report.

## Output contract

```
## Security Review: <skill-id>

### Block issues (must fix before deploy)
- [GFC101] ...

### Warnings (should fix)
- [GFC301] ...

### Notes
- ...

### Overall: PASS / FAIL
```

## Safety rules

- Read-only review — never modifies files
- Never suggest adding `Bash(*)` as a workaround
- Recommend `claude-local` over `remote-api` whenever possible

## Failure handling

If the target path doesn't exist, ask the user to compile first with `genai compile`.
