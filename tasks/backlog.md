# Backlog

## v0.3 (Scaffold 整備 + LLM 採点)

このリリースはマーケットプレイス基盤の前提を整える。

- `genai new` の scaffold を `templates/recipe_template.md.hbs` に外部化（現状コード内生成）
- LLM 採点実装: `scorers/llm.ts` を追加して `StringMatchScorer` から差し替え可能にする（IF は v0.2.x で切り出し済み）
- `QualScorer` への `rubric_refs` 対応（shared rubric ファイルを LLM スコアリングの context として渡す）
- 残り self-skills: `genai-import` / `genai-security-review` / `genai-pack`
- 残り subagents: `genai-compiler` / `genai-evaluator` / `genai-doc-writer` / `genai-cleanroom-reviewer`

## v0.4 (Importers)

- `genai import --from prompt` (`*.md` / `*.txt` から)
- `genai import --from readme`
- `genai import --from openapi`
- `genai import --from workflow-doc`
- `genai import --from script` (Python/TS スクリプトから)
- `genai import --from genai-json`

## v0.5 (Plugin Marketplace — 別リポジトリ構成)

**方針**: マーケットプレイスは `genai-marketplace` という別リポジトリに分離する（D-009）。

### `genai-for-claude-code` 側の作業
- `genai-pack` コマンド: Skill バンドルを `.genai-pack` 形式にパッケージ化
- `genai-publish` コマンド: `genai-marketplace` リポジトリへ PR を自動作成 or `registry.json` を直接 push
- `plugin.json` 仕様の策定（name / version / description / entry / compatible_genai_version）
- `genai install <plugin-id>` コマンド: レジストリから取得してローカルに展開

### `genai-marketplace`（別リポジトリ、新規作成）
- `registry.json`: 全プラグインのインデックス（npm registry / Homebrew tap に近い構造）
- `plugins/<id>/plugin.json` + `SKILL.md` バンドル
- GitHub Actions による CI（schema 検証 + `genai validate` 実行）
- CONTRIBUTING.md（投稿フロー: fork → `genai publish` → PR → CI → マージ）
- 初期プラグイン: `genai-core` (本リポジトリの 5 example を移植)

## v1.0 (Skill Catalog + local-rag)

- Skill catalog UI (CLI で十分なら不要)
- Eval leaderboard（`genai-marketplace` 上で公開スコアを管理）
- Community contribution template
- Vector-DB integrated `local-rag` (LanceDB / Chroma optional、`references[].index: true` を活用)
- Skill versioning / alias / namespace policy

## 未スコープ

- Web UI / SaaS / ユーザ管理 / 課金 (永続的 non-goal)
- 複雑な非同期ジョブ管理 (Claude Code 側に委譲)
