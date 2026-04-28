# Handoff

## 状態 (2026-04-27 完了)

**v0.2.x — 自治体・士業ドメイン試用 + 汎用ハーネス・アップデート** すべて完了。`bash scripts/verify.sh` 全 pass 確認済み。

- monorepo build 済み (CLI `0.1.0-pre`)
- `examples/` に 5 件 (proposal-review / contract-review-lite / meeting-to-actions / payroll-monthly-review / vendor-contract-redline)
- `references/_shared/rubrics/` 共有 rubric 4 件 + README
- `genai-apps/` に試用 7 シナリオ (gitignore 対象、gap-log 生資料)
- `tasks/gap-log.md` に 17 件のギャップ記録

## 次フェーズ候補 (v0.3)

- Plugin marketplace パッケージング (`genai-pack`)
- LLM 採点 (`QualScorer` の実装を `StringMatchScorer` から切り替え)
- `genai new` の scaffold 外部テンプレート化 (`templates/recipe_template.md.hbs`)
- Skill 間合成構文の設計

## オープンな論点

- Plugin marketplace の登録手続き (v0.3 でリサーチ)
- Skill 間合成構文 (未設計)
- `local-rag` のベクタ DB 統合 (v1.0+)
- golden ファイルがないと qualitative は warn のみ → v0.3 LLM 採点で解消予定
