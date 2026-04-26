# Backlog

## v0.3 (Plugin marketplace)

- `marketplace/plugins/gennai-core/plugin.json`
- `marketplace.json`
- `gennai-pack` / `gennai-publish` CLI コマンド
- 残り 3 self-skills (`gennai-import` / `gennai-security-review` / `gennai-pack`)
- 残り 4 subagents (`gennai-compiler` / `gennai-evaluator` / `gennai-doc-writer` / `gennai-cleanroom-reviewer`)

## v0.4 (Importers)

- `gennai import --from prompt` (`*.md` / `*.txt` から)
- `gennai import --from readme`
- `gennai import --from openapi`
- `gennai import --from workflow-doc`
- `gennai import --from script` (Python/TS スクリプトから)
- `gennai import --from genai-json` (源内風 request format)

## v1.0 (Skill catalog)

- Skill catalog UI (CLI で十分なら不要)
- Eval leaderboard
- Community contribution template
- Vector-DB integrated `local-rag` (LanceDB / Chroma optional)
- Skill versioning / alias / namespace policy

## 未スコープ

- Web UI / SaaS / ユーザ管理 / 課金 (永続的 non-goal)
- 複雑な非同期ジョブ管理 (Claude Code 側に委譲)
