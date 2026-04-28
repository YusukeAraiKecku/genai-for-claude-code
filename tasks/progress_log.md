# Progress Log

## 2026-04-27

### Phase 0: Bootstrap (完了)

- [x] フォルダリネーム
- [x] `.gitignore`
- [x] `LICENSE` (MIT)
- [x] `README.md` / `README.ja.md`
- [x] `CLEANROOM.md` / `SECURITY.md` / `CONTRIBUTING.md` / `CHANGELOG.md`
- [x] `CLAUDE.md` / `AGENTS.md`
- [x] `scripts/verify.sh`
- [x] `tasks/{current_task,implementation_plan,progress_log,handoff,decision_log,backlog}.md`
- [x] `package.json` (workspaces) / `tsconfig.json` / `biome.json`
- [x] `packages/{core,cli,runtime}/package.json` 雛形

### Phase 1+2: v0.1+v0.2 MVP (実装済み)

- [x] `schemas/genai.recipe.schema.json` 設置
- [x] `packages/core/` 実装＋ build (loader / normalize / compiler / security / eval 3 層)
- [x] `packages/cli/` 実装＋ build (init / new / compile / validate / test / doctor)。CLI は `0.1.0-pre`、`genai new` の出力先は `genai-apps/<id>/`
- [x] `examples/{proposal-review, contract-review-lite, meeting-to-actions}/` 同梱

## 2026-04-28

### Phase v0.2.x: 自治体・士業ドメイン試用 + 汎用化アップデート (着手)

詳細プラン: `~/.claude/plans/virtual-sniffing-kitten.md`

- 段階A: 自治体 4 + 中小企業/士業 3 の 7 シナリオで recipe 試作 → compile/validate/test → `tasks/gap-log.md` に 17 件記録 ✓
- 段階B-(B): `references/_shared/rubrics/` 共有資産化、QualScorer IF 切り出し、artifact JSON Schema 検証、verify.sh に genai test 追加 ✓
- 段階B-(A): Recipe スキーマ拡張 — table / persona / longform_ref / files.min/max / json.schema 追加、select.options→enum GAP-COMPILE-1 修正 ✓
- 段階B-(C): local-rag declared (references[].index) / GFC108 Bash(wget) / GFC206 mcp warn / GFC207 endpoint_env / GFC401 PII warn / security.pii 追加、example 2 件昇格 (payroll-monthly-review, vendor-contract-redline) ✓
- `bash scripts/verify.sh` 全 pass (5 example: typecheck / lint / build / unit-test / smoke compile/validate/test) ✓
