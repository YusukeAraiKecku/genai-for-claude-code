<p align="center">
  <img src="./docs/genai_for_claude_code_title.png" alt="Genai for Claude Code" width="800" />
</p>

<h1 align="center">Genai for Claude Code</h1>

<p align="center">
  <strong>Turn AI apps into local-first Claude Code Skills.</strong><br>
  local-first Claude Code Skill compiler for Japanese local government, SMB, and legal practice — with generic templates and domain case studies.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/local--first-✓-brightgreen" alt="local-first" />
  <img src="https://img.shields.io/badge/API%20key-not%20required%20by%20default-blue" alt="no API key" />
  <img src="https://img.shields.io/badge/clean--room-reimplementation-lightgrey" alt="clean-room" />
  <img src="https://img.shields.io/badge/security-deny--by--default-orange" alt="security-first" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT" />
</p>

---

Genai for Claude Code is a **local-first compiler** that converts AI app workflows, business forms, prompts, local RAG procedures, and (optional) REST APIs into reusable **Claude Code Skills** — without copying code, UI, or design from any external repository.

Instead of calling AI apps through a web form, **teach Claude Code the workflow as a Skill.**

Japanese: [README.md](./README.md)

---

## Before / After

```text
Before
  AI app form → user fills fields → remote API call → result page
  (setup, API keys, network, review burden)

After
  genai.recipe.yml → genai compile → .claude/skills/proposal-review/
                                        SKILL.md          ← behavior
                                        input.schema.json ← input contract
                                        references/       ← rubric, checklist
                                        tests/            ← fixtures + golden
                                     → Claude Code's built-in LLM
                                     → markdown output + local artifacts
```

---

## 2-Minute Quick Start

```bash
git clone https://github.com/YusukeAraiKecku/genai-for-claude-code
cd genai-for-claude-code
npm install && npm run build

npx genai init                              # initialize .claude/ structure
npx genai new my-skill                      # scaffold a new recipe
npx genai compile --recipe examples/proposal-review # compile a bundled example
npx genai validate examples/proposal-review
```

Then open Claude Code and run:

```
/proposal-review この提案書を、リスク・論点・次アクションに分けてレビューしてください。
```

No API key. No server. Just Claude.

---

## How It Works

```text
  genai.recipe.yml         (your source of intent)
       │
       ▼
  genai compile
       │  ├─ validates schema + security rules
       │  ├─ generates SKILL.md  (Handlebars template)
       │  ├─ generates input.schema.json
       │  ├─ copies references / templates / tests
       │  └─ runs 3-layer eval: static → contract → qualitative
       ▼
  .claude/skills/<id>/     (deployable skill bundle)
       │
       ▼
  Claude Code              (reads SKILL.md as capability)
       │
       ▼
  /skill-name              (slash command, ready to use)
```

A **Recipe** is a YAML declaration of what a skill does. The **compiler** turns it into a self-contained bundle that Claude Code can invoke as a slash command.

---

## Recipe Example

```yaml
id: proposal-review
name: Proposal Review
version: 0.1.0
description: 提案書・企画書をレビューし、強み・懸念点・改善提案・未解決問題を構造化して出力するスキル。

execution:
  default_mode: claude-local   # no external API needed

inputs:
  proposal:
    type: markdown
    title: 提案内容
    required: true
  review_focus:
    type: select
    options: [feasibility, cost, risk, completeness, clarity]

outputs:
  primary: markdown
  artifacts:
    - name: review-report
      path: review-report.md

security:
  network: deny-by-default
  secrets: forbid-hardcoded
  allowed_tools: [Read, Grep, Glob]   # minimal, not Bash(*)
```

One YAML file → a fully testable, security-checked Claude Code Skill.

---

## What It Generates

```text
.claude/skills/<skill-id>/
  SKILL.md              ← source of behavior (frontmatter + instructions)
  genai.recipe.yml      ← source of intent (normalized)
  input.schema.json     ← derived input contract (JSON Schema draft 2020-12)
  references/           ← rubric, checklist, domain knowledge
  templates/            ← output format templates
  tests/
    fixtures/           ← sample inputs
    golden/             ← expected outputs
  eval.yml              ← 3-layer eval config
  README.md             ← user-facing usage guide
```

---

## Skill ≠ Prompt

A Genai skill is more than a system prompt. Each skill is a small package that encodes:

| What | Why |
|---|---|
| **When to invoke** | `description` + `auto_invocation` in frontmatter |
| **Input contract** | `input.schema.json` — typed, validated fields |
| **Reference materials** | rubrics, checklists, domain docs in `references/` |
| **Output templates** | structured Markdown/JSON layouts in `templates/` |
| **Quality rules** | `quality.rules` checked by the compiler |
| **Security rules** | `allowed_tools`, `network`, `secrets` enforced at compile time |
| **Failure handling** | recovery steps defined in `SKILL.md` body |
| **Regression tests** | `tests/fixtures` + `tests/golden` checked by `genai test` |

---

## Why Local-First

External APIs are convenient but in the Claude Code context they bring:
setup overhead, API key management, network security review burden, and difficulty sharing on GitHub.

Genai's execution mode hierarchy — from most to least preferred:

| Mode | When to use |
|---|---|
| `claude-local` | Uses Claude Code's built-in LLM as-is — no extra API key or service needed (inference runs on Anthropic's servers, not on-device) |
| `local-file` | Read local Markdown / JSON / YAML |
| `local-script` | Deterministic Python / TS / shell helpers |
| `local-rag` | Grep/Glob over local docs (vector DB optional, post-v1.0) |
| `mcp` | External SaaS connection truly needed |
| `remote-api` | Last resort — opt-in, requires explicit user confirmation |

Benefits:

- **Try it immediately** — no accounts, no keys, no config
- **Easy to share on GitHub** — nothing sensitive in the repo
- **Security review is simple** — network deny-by-default is self-documenting
- **Uses Claude Code's full capability** — the built-in LLM is the primary engine
- **Merges into existing projects** — drops a `.claude/skills/` folder, nothing else

---

## Included Examples

| Skill | Mode | What it does |
|---|---|---|
| `proposal-review` | `claude-local` | Review proposals: strengths, concerns, open questions, action items |
| `contract-review-lite` | `local-file` | Extract risk clauses, ambiguities, red flags from contracts |
| `meeting-to-actions` | `claude-local` | Meeting notes → decisions / TODOs / next-meeting agenda |

Planned: `codebase-onboarding`, `local-rag-docs`, `remote-api-compat`

Run an example:

```bash
npx genai compile --recipe examples/proposal-review --out /tmp/test-skill
npx genai validate /tmp/test-skill
```

---

## Security Model

The compiler enforces security rules **before** emitting a skill bundle.

```text
network:        deny-by-default
remote-api:     opt-in only, requires user confirmation
secrets:        env-only — hardcoded keys are a compile error
Bash:           allowlist — Bash(*), curl|bash, rm -rf, sudo are blocked
side-effects:   read-only by default
artifacts:      path traversal check (no .., no /, no ~)
```

See [SECURITY.md](./SECURITY.md) for the full policy and error codes (GFC101–GFC302).

---

## Clean-Room Policy

This project is a clean-room reimplementation of the *general idea* of declarative AI app registration for Claude Code Skills. **It does not copy** source code, UI, design assets, deployment templates, screenshots, or government-specific wording from any external repository.

See [CLEANROOM.md](./CLEANROOM.md).

---

## Roadmap

| Version | Status | Contents |
|---|---|---|
| **v0.1** | ✅ shipped | Compiler MVP, recipe JSON Schema, `proposal-review` example |
| **v0.2** | ✅ shipped | Hooks, 3-layer eval, `contract-review-lite` + `meeting-to-actions` examples, self-skills, subagents |
| **v0.3** | planned | Plugin marketplace packaging, `genai pack`, `genai publish` |
| **v0.4** | planned | Importers: prompt / README / OpenAPI / workflow / source-script |
| **v1.0** | planned | Skill catalog, eval leaderboard, community templates |

---

## Use Cases

**Local government**: legislative Q&A drafting, bylaw amendment diff (before/after comparison tables), citizen inquiry triage, policy document Q&A summarization. Genai Skills streamline the rule-heavy document work that dominates local government operations — from legislative drafting support to council prep.

**SMB / legal practice**: vendor contract review, monthly payroll review, tax advisory intake, proposal review. Local-first Skills are well-suited to document processing and structured output generation with sensitive information that should not leave the local environment.

---

## Case Studies

Domain-specific Skill recipes are documented in `docs/case-studies/`. Copy the recipe into your own project with `genai new`.

| Case Study | Domain | Mode | Description |
|---|---|---|---|
| [Legislative Q&A Drafter](./docs/case-studies/legislative-qa-drafter.md) | Local government | `local-rag` | Past minutes → topic extraction → Q&A draft → talking points |
| [Bylaw Amendment Diff](./docs/case-studies/bylaw-amendment-diff.md) | Local government / legal | `local-file` | Current text + revised draft → structured comparison table (JSON artifact) |

> **CLEANROOM**: All case study data is synthetic. No real jurisdiction names, ordinance text, or manual wording is included.

Runnable versions will migrate to [v0.5 genai-marketplace](tasks/backlog.md) once it launches.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Every PR must pass:

- clean-room checklist
- local-first principle check
- `bash scripts/verify.sh` (typecheck + lint + build + smoke compile × 3)

## License

MIT — see [LICENSE](./LICENSE).
