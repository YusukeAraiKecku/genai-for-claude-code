# Current Task

## Phase

v0.1 + v0.2 — Compiler MVP, Hooks/Eval skeleton, 3 example Skills.

## Goal

`bash scripts/verify.sh` が end-to-end で pass し、3 example (`proposal-review`, `contract-review-lite`, `meeting-to-actions`) を `gennai compile → validate → test` まで通せる状態にする。

## Acceptance Criteria

- [ ] `schemas/gennai.recipe.schema.json` が draft 2020-12 で valid
- [ ] `@gennai/core` が typecheck と build をパス
- [ ] `@gennai/cli` が build され、`gennai compile / validate / test / doctor / new / init` が動作
- [ ] 3 example の compile / validate / test が `verify.sh` 内で exit 0
- [ ] `.claude/hooks/hooks.json` + 4 Python hook が設置済み
- [ ] `.claude/skills/{gennai-new, gennai-compile, gennai-validate}/SKILL.md` が設置済み
- [ ] `.claude/agents/{gennai-architect, gennai-security-reviewer}.md` が設置済み
- [ ] CLEANROOM チェックリスト目視通過

## Non-goals (MVP外)

- Plugin marketplace (v0.3)
- Importers (v0.4)
- LLM-based qualitative scoring (v0.3)
- Vector-DB local-rag (v1.0)
- Skill versioning / namespace policy

## Next action

`packages/core/` に recipe loader と Skill generator を実装する (Phase 1 開始)。
