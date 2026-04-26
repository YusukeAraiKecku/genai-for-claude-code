# Genai for Claude Code

> Turn AI apps into local-first Claude Code Skills.

Genai for Claude Code is a clean-room, local-first harness that converts AI app workflows, business forms, prompts, local RAG procedures, and (optional) REST APIs into reusable **Claude Code Skills**.

Instead of calling AI apps through a web form, **teach Claude Code the workflow as a Skill.**

- **Local-first** — claude-local > local-file > local-script > local-rag > mcp > remote-api
- **No API key required by default**
- **Clean-room** reimplementation — no copied code, UI, or design
- **Security-first** — network deny-by-default, Bash allowlist, no hardcoded secrets

Japanese: see [README.ja.md](./README.ja.md).

---

## Before / After

```text
Before:
  AI app form → user fills fields → remote API → result page

After:
  genai.recipe.yml → Skill Compiler → .claude/skills/<id>/
                                        → SKILL.md / input.schema.json
                                        → Claude Code's local LLM
                                        → markdown + artifacts + evals
```

## Quick Start

```bash
git clone https://github.com/your-org/genai-for-claude-code
cd genai-for-claude-code
npm install
npm run build

npx genai init
npx genai new proposal-review
npx genai compile examples/proposal-review
npx genai validate examples/proposal-review
```

Then in Claude Code:

```text
/proposal-review この提案書を、リスク・論点・次アクションに分けてレビューしてください。
```

## What it generates

```text
.claude/skills/<skill-id>/
  SKILL.md              ← source of behavior (frontmatter + body)
  genai.recipe.yml     ← source of intent
  input.schema.json     ← derived input contract
  references/           ← rubric, checklist, etc.
  templates/            ← output templates
  scripts/              ← safe deterministic helpers (optional)
  tests/                ← fixtures + golden expectations
  README.md             ← user-facing guide
```

## Why local-first

External APIs are convenient but in the Claude Code context they cost setup time, key management, and review burden. Genai's priority hierarchy is:

1. **`claude-local`** — Claude's own LLM
2. **`local-file`** — read local Markdown/JSON/YAML
3. **`local-script`** — deterministic Python / TS / shell helpers
4. **`local-rag`** — Grep/Glob over local docs (vector DB optional, post-MVP)
5. **`mcp`** — connect via MCP when truly needed
6. **`remote-api`** — last resort, opt-in, requires explicit user confirmation

## Use cases (examples included)

- `proposal-review` — Review proposals, specs, PoC plans
- `contract-review-lite` — Extract risks, ambiguities, and open questions from contracts
- `meeting-to-actions` — Notes → decisions / TODOs / next-meeting agenda
- `codebase-onboarding` *(planned)*
- `local-rag-docs` *(planned)*
- `remote-api-compat` *(planned)*

## Security model

```text
network:        deny-by-default
remote-api:     optional, explicit-allow
secrets:        env-only, never hardcoded
Bash:           allowlist (no Bash(*), no curl|bash, no rm -rf, no sudo)
side-effects:   read-only by default
```

The compiler runs safety checks before emitting a Skill package; see [SECURITY.md](./SECURITY.md).

## Clean-room policy

This project is a clean-room reimplementation of the *general idea* of declarative AI app registration for Claude Code Skills. **It does not copy** source code, UI, design assets, deployment templates, screenshots, or government-specific wording from any other GenAI repository. See [CLEANROOM.md](./CLEANROOM.md).

## Roadmap

- **v0.1** — Compiler MVP, recipe schema, `proposal-review` example
- **v0.2** — Hooks, 3-layer eval skeleton, 2 more examples *(this release)*
- **v0.3** — Plugin marketplace packaging, Genai self-skills, subagents
- **v0.4** — Importers (prompt / README / OpenAPI / workflow / source-script)
- **v1.0** — Skill catalog, eval leaderboard, community templates

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Every PR must pass the clean-room and local-first checklist.

## License

MIT — see [LICENSE](./LICENSE).
