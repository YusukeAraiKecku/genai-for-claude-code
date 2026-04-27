# Backlog

## v0.3 (Plugin marketplace)

- `marketplace/plugins/genai-core/plugin.json`
- `marketplace.json`
- `genai-pack` / `genai-publish` CLI コマンド
- 残り 3 self-skills (`genai-import` / `genai-security-review` / `genai-pack`)
- 残り 4 subagents (`genai-compiler` / `genai-evaluator` / `genai-doc-writer` / `genai-cleanroom-reviewer`)
- recipe / skill template files for `genai new` (現状はコード内でscaffold生成。v0.3で `templates/` に外部化)

## v0.4 (Importers)

- `genai import --from prompt` (`*.md` / `*.txt` から)
- `genai import --from readme`
- `genai import --from openapi`
- `genai import --from workflow-doc`
- `genai import --from script` (Python/TS スクリプトから)
- `genai import --from genai-json` (源内風 request format)

## v1.0 (Skill catalog)

- Skill catalog UI (CLI で十分なら不要)
- Eval leaderboard
- Community contribution template
- Vector-DB integrated `local-rag` (LanceDB / Chroma optional)
- Skill versioning / alias / namespace policy

## 未スコープ

- Web UI / SaaS / ユーザ管理 / 課金 (永続的 non-goal)
- 複雑な非同期ジョブ管理 (Claude Code 側に委譲)
