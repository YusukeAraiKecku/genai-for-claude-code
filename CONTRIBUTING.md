# Contributing to Gennai for Claude Code

Gennai for Claude Code is a local-first harness that converts AI apps into Claude Code Skills. Contributions must preserve that philosophy.

## Pull Request checklist

```text
[ ] Local-first preserved (no API-first defaults)
[ ] Remote APIs are not enabled by default
[ ] allowed-tools is minimal
[ ] No Bash(*) / curl|bash / rm -rf / sudo
[ ] No hardcoded secrets (api_key_env only)
[ ] If inspired by an external source, the reference is cited
[ ] Clean-room policy not violated (see CLEANROOM.md)
[ ] README or example is updated
[ ] Eval skeleton or fixture added for new Skills
[ ] `bash scripts/verify.sh` passes locally
```

## Adding a new example Skill

Each example must include:

```text
examples/<skill-id>/
  README.md            ← purpose, inputs, outputs, safety notes
  gennai.recipe.yml    ← declarative recipe
  references/          ← (optional) rubric / checklist
  templates/           ← (optional) output templates
  tests/fixtures/      ← at least one fixture
  tests/golden/        ← expected structural matches (not exact text)
```

## Adding a new Skill (in `.claude/skills/`)

```text
.claude/skills/<skill-id>/SKILL.md
  - frontmatter: name + specific description + minimal allowed-tools
  - body: Purpose / When to use / Inputs / Process / Output contract
          / Quality rules / Safety rules / Failure handling
```

## Forbidden in any contribution

- Copying source code from external repositories without explicit permission
- API keys, passwords, or tokens in committed files
- Recommending `curl … | bash` install patterns
- `Bash(*)` or other wildcard tool permissions
- Destructive operations in generated Skills
- Reusing government-style UI text, screenshots, or design tokens

## Running the verification

```bash
bash scripts/verify.sh
```

This runs typecheck, lint, build, and a smoke compile of the example Skills. Failure means the change is not ready.
