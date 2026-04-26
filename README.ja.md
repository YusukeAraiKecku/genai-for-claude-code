# Gennai for Claude Code

> AIアプリを「呼び出す」のではなく、Claude Code に「習得」させる。

Gennai for Claude Code は、AIアプリ、業務フォーム、プロンプト、ローカルRAG手順、必要に応じた外部APIを、Claude Code で再利用可能な **Skill** に変換するための、クリーンルーム・ローカルファーストなハーネスです。

- **Local-first** — claude-local > local-file > local-script > local-rag > mcp > remote-api
- **APIキー不要がデフォルト**
- **クリーンルーム実装** — コード/UI/デザインの複製なし
- **セキュリティ優先** — ネットワーク deny-by-default、Bash allowlist、シークレット直書き禁止

English: [README.md](./README.md)

---

## Before / After

```text
Before:
  AIアプリのフォーム → ユーザが入力 → 外部API → 結果画面

After:
  gennai.recipe.yml → Skill Compiler → .claude/skills/<id>/
                                        → SKILL.md / input.schema.json
                                        → Claude Code 内蔵 LLM
                                        → markdown + 成果物 + eval
```

## 2分 Quick Start

```bash
git clone https://github.com/your-org/gennai-for-claude-code
cd gennai-for-claude-code
npm install
npm run build

npx gennai init
npx gennai new proposal-review
npx gennai compile examples/proposal-review
npx gennai validate examples/proposal-review
```

Claude Code で:

```text
/proposal-review この提案書を、リスク・論点・次アクションに分けてレビューしてください。
```

## 生成されるもの

```text
.claude/skills/<skill-id>/
  SKILL.md              ← 行動の source (frontmatter + 本文)
  gennai.recipe.yml     ← 意図の source
  input.schema.json     ← 入力契約 (自動生成)
  references/           ← 観点ルブリック・チェックリスト等
  templates/            ← 出力テンプレート
  scripts/              ← 決定的処理の補助 (任意)
  tests/                ← fixture と golden
  README.md             ← 利用ガイド
```

## なぜ local-first か

外部APIは便利ですが、Claude Code 文脈では setup 負担、Key 管理、レビュー難易度が増えます。Gennai は以下の優先順位で実行モードを選びます。

1. **`claude-local`** — Claude 自身の LLM
2. **`local-file`** — ローカル Markdown / JSON / YAML 参照
3. **`local-script`** — 決定的 Python / TS / Shell 補助
4. **`local-rag`** — Grep / Glob でローカル文書検索 (ベクタDBは後フェーズ任意)
5. **`mcp`** — MCP 経由の外部接続が本当に必要なとき
6. **`remote-api`** — 最終手段、明示的 opt-in、ユーザ確認必須

## ユースケース (同梱 example)

- `proposal-review` — 提案書・仕様書・PoC計画のレビュー
- `contract-review-lite` — 契約書のリスク条項・曖昧点の抽出
- `meeting-to-actions` — 議事録 → 決定事項 / TODO / 次回アジェンダ

## セキュリティ

```text
network:        deny-by-default
remote-api:     optional / explicit-allow
secrets:        env のみ、直書き禁止
Bash:           allowlist (Bash(*) / curl|bash / rm -rf / sudo は禁止)
side-effects:   read-only by default
```

Compiler は Skill 生成前に安全性チェックを走らせます。詳細は [SECURITY.md](./SECURITY.md)。

## クリーンルーム方針

本プロジェクトは、公開情報から読み取れる「AIアプリを宣言的に登録する」という一般的な設計思想を、Claude Code Skill 向けにローカルファーストで**再実装**するものです。源内のソースコード、UI、デザイン、デプロイテンプレート、行政向け固有文言は**コピーしません**。詳細は [CLEANROOM.md](./CLEANROOM.md)。

## ロードマップ

- **v0.1** — Compiler MVP、recipe schema、`proposal-review` example
- **v0.2** — Hooks、3層 eval skeleton、example 2 件追加 *(現リリース対象)*
- **v0.3** — Plugin marketplace、Gennai self-skills、subagent
- **v0.4** — Importer 群 (prompt / README / OpenAPI / workflow / script)
- **v1.0** — Skill catalog、eval leaderboard、コミュニティテンプレート

## Contributing

[CONTRIBUTING.md](./CONTRIBUTING.md) を参照。すべての PR は clean-room と local-first のチェックリスト通過が必須です。

## License

MIT — [LICENSE](./LICENSE)
