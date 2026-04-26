# Implementation Plan

詳細プランは `/Users/yusukearai/.claude/plans/misty-purring-muffin.md` に同期。本ファイルはリポジトリ内サマリ。

## Phase 0: Bootstrap (完了)

- フォルダリネーム: `genai for claude code` → `genai-for-claude-code`
- ガバナンス: `CLAUDE.md` / `AGENTS.md` / `scripts/verify.sh` / `tasks/`
- ライセンス: MIT
- 公開ドキュメント: `README.md` / `README.ja.md` / `CLEANROOM.md` / `SECURITY.md` / `CONTRIBUTING.md` / `CHANGELOG.md`
- monorepo skeleton: `package.json` (workspaces) / `tsconfig.json` / `biome.json` / `packages/{core,cli,runtime}/`

## Phase 1: v0.1 — Compiler MVP

順序:

1. `schemas/genai.recipe.schema.json` (JSON Schema draft 2020-12)
2. `packages/core/`:
   - `loadRecipe.ts` (YAML 読み込み + AJV 検証)
   - `normalizeRecipe.ts` (id kebab-case、execution mode 推定、tags 補完)
   - `generateInputSchema.ts` (recipe.inputs → JSON Schema)
   - `generateSkillMd.ts` (Handlebars + frontmatter)
   - `generateReadme.ts` (Skill README)
   - `securityCheck.ts` (Bash(*) / hardcoded secret / network 検査)
   - `writeSkill.ts` (artifact 書き出し)
3. `templates/skill_template.md.hbs` / `recipe_template.md.hbs`
4. `packages/cli/`:
   - `commands/init.ts` `commands/new.ts` `commands/compile.ts` `commands/validate.ts` `commands/doctor.ts`
   - エントリ `src/index.ts` (commander)
5. `examples/proposal-review/`:
   - `genai.recipe.yml` (spec のサンプルから)
   - `references/{review-rubric,risk-checklist}.md`
   - `templates/{review-output,action-items}.md`
   - `tests/fixtures/sample.input.md`
   - `tests/golden/sample.expected.md`
   - `eval.yml`
   - `README.md`

## Phase 2: v0.2 — Hooks + Eval + 2 Examples

1. `.claude/hooks/hooks.json` + 4 Python hook (`pre_bash_guard.py` `post_write_validate.py` `stop_context_saver.py` `pre_compact_handoff.py`)
2. `packages/core/eval/`:
   - `static.ts` — frontmatter / file existence / allowed-tools
   - `contract.ts` — input.schema.json 一致 / artifact path
   - `qualitative.ts` — must_include / must_not_include / 構造一致 (LLM 採点なし)
3. `packages/cli/commands/test.ts` (eval.yml ドリブン)
4. `examples/contract-review-lite/` と `examples/meeting-to-actions/`
5. `.claude/skills/{genai-new,genai-compile,genai-validate}/SKILL.md`
6. `.claude/agents/{genai-architect,genai-security-reviewer}.md`

## 検証

`bash scripts/verify.sh` で:

- npm typecheck / lint / build pass
- `genai compile` を 3 example に対して exit 0
- `genai validate` を生成物に対して exit 0
- `genai test` を 3 example の fixture に対して exit 0
