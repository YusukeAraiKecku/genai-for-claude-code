# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added — v0.2.x (domain trial + harness generalization)

- **Stage A — domain trial**: 7 scenarios across local-government and SME/professional domains (`genai-apps/`); 17 gaps catalogued in `tasks/gap-log.md`
- **Stage B-(B) — eval generalization**:
  - `references/_shared/rubrics/` with `general-quality.md`, `pii-redaction.md`, `disclaimer.md`, `citation-required.md`
  - `QualScorer` interface + `StringMatchScorer` in `packages/core/src/eval/scorers/`
  - `EvalCase.rubric_refs` field in eval types
  - `contract.ts` now validates artifact JSON files present in skill bundles
  - `compiler/index.ts` flattens `../../references/_shared/…` paths safely into output bundle
  - `scripts/verify.sh` runs `genai test` after `genai validate` in smoke loop
- **Stage B-(A) — schema / input type expansion**:
  - New input types: `table` (with `columns`), `persona`, `longform_ref`
  - New `InputField` properties: `min_files`, `max_files`, `columns`, `schema` (inline JSON Schema for `json` type)
  - **Fix GAP-COMPILE-1**: `select` / `multi_select` now generate `enum` from `options` when `items` is absent
  - `files` type now emits `minItems` / `maxItems` constraints in generated schema
- **Stage B-(C) — execution mode expansion + security checks**:
  - `local_context.references[].index?: boolean` for `local-rag` declared mode; SKILL.md reflects indexing instruction
  - **GFC108**: block `Bash(wget …)` in `allowed_tools`
  - **GFC206**: warn when `default_mode: mcp` with no `mcp__*` tools declared
  - **GFC207**: warn when `security.remote_api.endpoint_env` is not a valid env-var name
  - **GFC401**: warn when input field names suggest personal data (address / email / phone / dob / mynumber) and `security.pii` is not declared
  - `security.pii` enum (`forbid | masked-only | declared`) added to schema and `Recipe` type
  - SKILL.md `renderInputs` now shows `options` (for select/multi_select/persona) and `columns` (for table)
  - 2 new examples promoted to `examples/`: `payroll-monthly-review` (uses `table` type), `vendor-contract-redline` (uses `persona` type + `multi_select` with `options`)

### Added — v0.1 (compiler MVP)

- `genai.recipe.yml` JSON Schema (`schemas/genai.recipe.schema.json`)
- `@genai/core` package: recipe loader, Skill generator, input.schema.json generator, safety checker
- `@genai/cli` package: `genai init / new / compile / validate / doctor`
- Skill / Recipe Handlebars templates
- Example: `proposal-review`
- README (en / ja), CLEANROOM, SECURITY, CONTRIBUTING

### Added — v0.2 (harness layer)

- `.claude/hooks/` skeleton: pre-bash guard, post-write validate, stop context saver, pre-compact handoff
- Three-layer eval (static / contract / qualitative — qualitative is structure-based for MVP)
- `genai test` command
- Examples: `contract-review-lite`, `meeting-to-actions`
- Self-skills: `genai-new`, `genai-compile`, `genai-validate`
- Subagents: `genai-architect`, `genai-security-reviewer`

### Not yet (deferred)

- v0.3: Plugin marketplace packaging, full subagent set, genai-pack
- v0.4: Importers (prompt / README / OpenAPI / workflow / script)
- v1.0: Skill catalog, eval leaderboard, vector-DB local-rag
