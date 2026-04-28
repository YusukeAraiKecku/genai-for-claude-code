<p align="center">
  <img src="./docs/genai_for_claude_code_title.png" alt="Genai for Claude Code" width="800" />
</p>

<h1 align="center">Genai for Claude Code</h1>

<p align="center">
  <strong>AIアプリを「呼び出す」のではなく、Claude Code に「習得」させる。</strong><br>
  業界横断的に使える local-first Claude Code Skill コンパイラ。汎用テンプレートを出発点に、自分のユースケースへ特化させていける。
</p>

<p align="center">
  <img src="https://img.shields.io/badge/local--first-✓-brightgreen" alt="local-first" />
  <img src="https://img.shields.io/badge/APIキー-デフォルト不要-blue" alt="no API key" />
  <img src="https://img.shields.io/badge/security-deny--by--default-orange" alt="security-first" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT" />
</p>

---

Genai for Claude Code は、AIアプリ、業務フォーム、プロンプト、ローカルRAG手順、必要に応じた外部APIを、Claude Code で再利用可能な **Skill** に変換する **ローカルファーストなコンパイラ** です。

English: [README.en.md](./README.en.md)

---

## Before / After

```text
Before
  AIアプリのフォーム → ユーザが入力 → 外部API → 結果画面
  （セットアップ・APIキー・ネットワーク・レビュー負担）

After
  genai.recipe.yml → genai compile → .claude/skills/proposal-review/
                                        SKILL.md          ← 行動の定義
                                        input.schema.json ← 入力契約
                                        references/       ← ルブリック・チェックリスト
                                        tests/            ← fixture + golden
                                     → Claude Code 内蔵 LLM
                                     → Markdown出力 + ローカル成果物
```

---

## 2分 Quick Start

```bash
git clone https://github.com/YusukeAraiKecku/genai-for-claude-code
cd genai-for-claude-code
npm install && npm run build

npx genai init                               # .claude/ 構造を初期化
npx genai new my-skill                       # レシピの雛形を生成
npx genai compile --recipe examples/proposal-review  # 同梱サンプルをコンパイル
npx genai validate examples/proposal-review
```

Claude Code で実行:

```
/proposal-review この提案書を、リスク・論点・次アクションに分けてレビューしてください。
```

APIキー不要。サーバー不要。Claudeだけで動きます。

---

## 仕組み

```text
  genai.recipe.yml         (意図の source)
       │
       ▼
  genai compile
       │  ├─ スキーマ + セキュリティルールを検証
       │  ├─ SKILL.md を生成（Handlebarsテンプレート）
       │  ├─ input.schema.json を生成
       │  ├─ references / templates / tests をコピー
       │  └─ 3層eval: static → contract → qualitative
       ▼
  .claude/skills/<id>/     (デプロイ可能なSkillバンドル)
       │
       ▼
  Claude Code              (SKILL.mdを作業能力として読み込む)
       │
       ▼
  /skill-name              (スラッシュコマンドとして即使用可能)
```

**Recipe** はSkillが何をするかを宣言するYAMLファイルです。**コンパイラ**がそれをClaude Codeのスラッシュコマンドとして実行できる自己完結型バンドルに変換します。

---

## Recipeの例

```yaml
id: proposal-review
name: Proposal Review
version: 0.1.0
description: 提案書・企画書をレビューし、強み・懸念点・改善提案・未解決問題を構造化して出力するスキル。

execution:
  default_mode: claude-local   # 外部API不要

inputs:
  proposal:
    type: markdown
    title: 提案内容
    required: true
  review_focus:
    type: select
    options: [feasibility, cost, risk, completeness, clarity]

outputs:
  primary: markdown
  artifacts:
    - name: review-report
      path: review-report.md

security:
  network: deny-by-default
  secrets: forbid-hardcoded
  allowed_tools: [Read, Grep, Glob]   # 最小限、Bash(*)は禁止
```

YAMLファイル1つ → テスト可能・セキュリティチェック済みのClaude Code Skillに変換。

---

## 生成されるもの

```text
.claude/skills/<skill-id>/
  SKILL.md              ← 行動の source（frontmatter + 指示）
  genai.recipe.yml      ← 意図の source（正規化版）
  input.schema.json     ← 入力契約（JSON Schema draft 2020-12）
  references/           ← ルブリック・チェックリスト・ドメイン知識
  templates/            ← 出力フォーマットテンプレート
  tests/
    fixtures/           ← サンプル入力
    golden/             ← 期待出力
  eval.yml              ← 3層eval設定
  README.md             ← 利用ガイド
```

---

## Skill ≠ プロンプト

Genai Skillはシステムプロンプト以上のものです。各Skillは以下をまとめた小さなパッケージです。

| 何を | なぜ |
|---|---|
| **呼び出し条件** | frontmatterの`description` + `auto_invocation` |
| **入力契約** | `input.schema.json` — 型付き・バリデーション済みフィールド |
| **参照資料** | `references/` のルブリック・チェックリスト・ドメイン文書 |
| **出力テンプレート** | `templates/` の構造化Markdown/JSONレイアウト |
| **品質ルール** | `quality.rules`（コンパイル時チェック） |
| **セキュリティルール** | `allowed_tools`、`network`、`secrets`（コンパイル時強制） |
| **失敗時の復旧** | `SKILL.md` 本文に定義した手順 |
| **回帰テスト** | `tests/fixtures` + `tests/golden`（`genai test`で実行） |

---

## なぜ Local-First か

外部APIは便利ですが、Claude Code 文脈では以下の問題があります。

- セットアップが重い
- APIキー管理が必要
- ネットワーク・セキュリティリスクが増える
- GitHubで公開しづらい

Genai の実行モード優先順位:

| モード | 使う場面 |
|---|---|
| `claude-local` | Claude Codeが元々持つLLMをそのまま使用（追加APIキー・サービス不要。推論はAnthropicサーバーで実行） |
| `local-file` | ローカルMarkdown / JSON / YAMLを参照 |
| `local-script` | 決定的なPython / TS / Shellの補助処理 |
| `local-rag` | Grep/Globでローカル文書検索（ベクタDBは後フェーズ任意） |
| `mcp` | 外部SaaS接続が本当に必要なとき |
| `remote-api` | 最終手段 — opt-in必須、ユーザ確認必須 |

メリット:

- **すぐ試せる** — アカウント・キー・設定不要
- **GitHubで共有しやすい** — 機密情報がリポジトリに入らない
- **セキュリティ説明が簡単** — deny-by-defaultは自己文書化される
- **Claude Codeの本来の能力を活かせる** — 内蔵LLMが主エンジン
- **既存プロジェクトに溶け込む** — `.claude/skills/` フォルダを追加するだけ

---

## 同梱サンプル

| Skill | モード | 内容 |
|---|---|---|
| `proposal-review` | `claude-local` | 提案書レビュー: 強み・懸念点・未解決問題・アクションアイテム |
| `contract-review-lite` | `local-file` | 契約書のリスク条項・曖昧点・要確認箇所の一覧化 |
| `meeting-to-actions` | `claude-local` | 議事録 → 決定事項 / TODO / 次回アジェンダ |

計画中: `codebase-onboarding`, `local-rag-docs`, `remote-api-compat`

---

## セキュリティ

コンパイラはSkillバンドルを出力する**前に**セキュリティルールを強制します。

```text
network:        deny-by-default
remote-api:     opt-in のみ、ユーザ確認必須
secrets:        env のみ — 直書きはコンパイルエラー
Bash:           allowlist — Bash(*)・curl|bash・rm -rf・sudo はブロック
side-effects:   read-only by default
artifacts:      パストラバーサルチェック（..・/・~ 禁止）
```

詳細は [SECURITY.md](./SECURITY.md)（エラーコード GFC101–GFC302）。

---

## ロードマップ

| バージョン | 状態 | 内容 |
|---|---|---|
| **v0.1** | ✅ リリース済み | Compiler MVP、recipe JSON Schema、`proposal-review` example |
| **v0.2** | ✅ リリース済み | Hooks、3層eval、`contract-review-lite` + `meeting-to-actions`、self-skills、subagents |
| **v0.3** | 計画中 | Plugin marketplace packaging、`genai pack`、`genai publish` |
| **v0.4** | 計画中 | Importer群: prompt / README / OpenAPI / workflow / script |
| **v1.0** | 計画中 | Skill catalog、eval leaderboard、コミュニティテンプレート |

---

## 想定ユースケース

業界を問わず、定型的な業務知識を Skill として整形・再利用したい場面に適します。

- **企業全般**: 提案書レビュー、契約書レビュー、議事録 → 決定事項・TODO 抽出、勤怠表の月次レビュー、ベンダー契約のレッドライン
- **士業・法務**: 契約レビュー、相談インテーク、免責文付きの方針整理
- **公共セクター**: 申請窓口の問い合わせトリアージ、制度説明文書の Q&A 要約、議会想定問答ドラフト、例規改正の新旧対照表
- **研究・教育・NPO** など: 構造化文書レビュー、引用必須の要約、ドメイン rubric の追加

ダウンロード時点では汎用テンプレートが揃っているだけです。`references/` に自前ルブリックを足す、`security.pii: declared` を宣言する、`local-rag` で `index: true` を付ける、といった**「育てる」操作で自分のユースケースに特化**させていくのが想定の使い方です。

---

## Case Studies

業界特化の Skill レシピ例は `docs/case-studies/` に文書として収録しています。Recipe をコピーして `genai new` で自分のプロジェクトに組み込む想定です（特定の業界専用ツールという位置づけではありません — 一例として読んでください）。

| Case Study | ドメイン例 | モード | 説明 |
|---|---|---|---|
| [議会答弁ドラフター](./docs/case-studies/legislative-qa-drafter.md) | 公共セクター | `local-rag` | 過去議事録 → 論点抽出 → 想定問答 → 答弁書骨子 |
| [例規改正差分](./docs/case-studies/bylaw-amendment-diff.md) | 公共セクター / 法務 | `local-file` | 現行条文 + 改正案 → 構造化新旧対照表（JSON artifact） |

ケーススタディのデータはすべて合成です（実在組織名・実在条文を含みません）。

将来的に [v0.5 genai-marketplace](tasks/backlog.md) が立ち上がった時点で runnable 版はそちらに移植予定です。

---

## Contributing

[CONTRIBUTING.md](./CONTRIBUTING.md) を参照。すべての PR は以下の通過が必須です。

- ローカルファーストの原則確認
- `npm run verify`（typecheck + lint + build + smoke compile × 5。macOS / Linux / Windows いずれでも動作）

本プロジェクトは外部リポジトリのコード・UI・デザインをコピーせずクリーンルームで再実装しています。詳細は [CLEANROOM.md](./CLEANROOM.md) を参照。

## License

MIT — [LICENSE](./LICENSE)
