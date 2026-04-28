# Current Task

## Phase

v0.2.x — 自治体・士業ドメイン試用 + 汎用ハーネス・アップデート

詳細プラン: `~/.claude/plans/virtual-sniffing-kitten.md`

## Goal

7 シナリオ (自治体 4 + 中小企業/士業 3) で recipe を試作 → compile/validate/test を回し機能ギャップを `tasks/gap-log.md` に記録 → ギャップに基づき (A) Recipe スキーマ拡張、(B) Eval 汎用化、(C) 実行モード拡張を直列で実施。最終的に `bash scripts/verify.sh` を全 pass にする。

## Acceptance Criteria

### 段階A (試用)
- [ ] 全 7 シナリオで `genai compile` が exit 0、または失敗が `tasks/gap-log.md` に記録
- [ ] `tasks/gap-log.md` に **5 件以上、3 カテゴリ以上** のギャップ記録

### 段階B (汎用化)
- [ ] (A) `schemas/genai.recipe.schema.json` に `table` / `persona` / `longform_ref` / `files.min_files` / `files.max_files` / `json.schema` を追加。既存 3 example で `verify.sh` 回帰確認 pass
- [ ] (B) `references/_shared/rubrics/` 5 ファイル設置、`QualScorer` IF 切り出し、`scorers/string-match.ts` 新規、artifact JSON Schema 検証、`verify.sh` に `genai test` ステップ追加
- [ ] (C) `local-rag` declared モード（`references[].index`）、`security.pii` enum、GFC108/206/207/401 追加、`examples/{vendor-contract-redline, payroll-monthly-review}/` 昇格
- [ ] `bash scripts/verify.sh` 全 pass

### ガバナンス
- [ ] CLEANROOM チェックリスト目視通過（特定省庁・固有書式の混入なし）
- [ ] `tasks/progress_log.md` / `tasks/handoff.md` / `CHANGELOG.md` 更新

## Non-goals (本フェーズ外)

- Importer 群 (v0.4)
- Plugin marketplace (v0.3)
- LLM-based qualitative scoring の実装本体 (v0.3)
- Vector-DB local-rag (v1.0)
- Claude Code 内での出力品質評価
- `cli/commands/new.ts` の scaffold コメント拡張 (v0.3 で外部 templates 化のため省略)

## Next action

`genai-apps/` を `.gitignore` に追記し、7 シナリオの scaffold から開始する。
