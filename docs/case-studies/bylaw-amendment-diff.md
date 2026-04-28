# Case Study: 例規改正差分（Bylaw Amendment Diff）

このケーススタディは「コピーして自分の用途に改造する」想定の汎用テンプレートです。fixture / rubric は合成データで、特定自治体・実在条文・特定マニュアルの文言は含みません。

## 概要

現行例規（条例・規則等）と改正案文を受け取り、構造化された新旧対照表（JSON artifact）と改正全体の説明文（Markdown）を生成する Skill のケーススタディです。Genai for Claude Code の `table` 型 artifact と AJV による JSON schema 検証のショーケースとして書かれています。

## 想定ユーザー

- 自治体の法務・法制執務担当者
- 条例改正を伴うプロジェクトの担当職員
- 法制担当者を支援する弁護士・行政書士

## なぜ Genai か

例規の新旧対照表作成は、条文ごとに「現行／改正案／改正理由」を対比させるルール明快な作業で、Skill 化に向く特徴を備えています。

- 現行文・改正案文は **ローカルファイルを読むだけ**（→ `local-file` モード）
- 出力は **構造化 JSON 形式**（→ `artifact-json` + AJV スキーマ検証）
- 条項ごとの差分は **繰り返し構造**（→ `table` 型 artifact として表現）
- 機微な条例案は **ローカル完結が望ましい**（→ local-first 思想）

## Recipe（コピーして自分のプロジェクトに）

```yaml
id: bylaw-amendment-diff
name: Bylaw Amendment Diff
version: 0.1.0
description: 現行例規と改正案文を受け取り、条項ごとの新旧対照表（JSON）と改正全体の要約（Markdown）を生成する Skill。

tags:
  - local-government
  - legislative
  - diff

origin:
  type: original
  source_code_copied: false

execution:
  default_mode: local-file
  allowed_modes:
    - local-file
    - claude-local
  remote_api_required: false

inputs:
  current_text:
    type: markdown
    title: 現行例規の全文
    description: 改正前の現行条文（条・項・号の階層で記述）。
    required: true
  revised_text:
    type: markdown
    title: 改正案の全文
    description: 改正後の案文（条・項・号の階層で記述）。
    required: true
  revision_notes:
    type: markdown
    title: 改正趣旨メモ
    description: 担当者が書いた改正の背景・目的のメモ（任意）。
    required: false

local_context:
  references:
    - path: ../../references/_shared/rubrics/general-quality.md
      description: 一般品質ルブリック
    - path: references/rubric_diff_format.md
      description: 新旧対照表の書式品質観点
  templates: []

outputs:
  primary: markdown
  artifacts:
    - name: comparison-table
      path: comparison-table.json
      format: json
      description: 条項ごとの新旧対照表（article / current / revised / rationale）
    - name: amendment-summary
      path: amendment-summary.md
      format: markdown
      description: 改正全体の説明（主要変更点・影響範囲）

quality:
  rules:
    - separate_facts_assumptions_opinions
    - list_open_questions
  eval:
    fixture_dir: ./tests/fixtures
    golden_dir: ./tests/golden

security:
  network: deny-by-default
  secrets: forbid-hardcoded
  side_effects: read-only-by-default
  allowed_tools:
    - Read
    - Grep
    - Glob

claude:
  skill_name: bylaw-amendment-diff
  auto_invocation: true
```

## Artifact JSON Schema

`comparison-table` artifact の出力を以下 JSON Schema で検証します（AJV 経由、`genai validate` で自動確認）。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["rows"],
  "additionalProperties": false,
  "properties": {
    "rows": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["article", "current", "revised", "rationale"],
        "additionalProperties": false,
        "properties": {
          "article":   { "type": "string", "description": "条番号（例: 第2条第1項）" },
          "current":   { "type": "string", "description": "現行文" },
          "revised":   { "type": "string", "description": "改正案文" },
          "rationale": { "type": "string", "description": "改正理由・背景（任意の長さで可）" }
        }
      }
    }
  }
}
```

このスキーマを `references/artifact.schema.json` として保存し、`eval.yml` の `contract` ステップで参照することで、LLM 出力が構造的に正しいかどうかを `genai validate` / `genai test` で自動検証できます。

## Sample fixture（合成データ）

`tests/fixtures/sample.current.md`（現行条文の例・完全架空）:

```markdown
# ○○施設利用条例（架空・例示専用）

第1条（目的）
本条例は、A 市が設置する○○施設（以下「施設」という。）の利用に関して必要な事項を定め、
市民の利便向上を図ることを目的とする。

第2条（利用料金）
施設の利用料金は、別表第1に定めるとおりとする。

第3条（利用の制限）
次の各号に該当する場合は、施設の利用を認めないことができる。
  一　公の秩序を乱し、または風俗を害するおそれがあるとき
  二　施設を損傷するおそれがあるとき
```

`tests/fixtures/sample.revised.md`（改正案文の例・完全架空）:

```markdown
# ○○施設利用条例（改正案・架空・例示専用）

第1条（目的）
本条例は、A 市が設置する○○施設（以下「施設」という。）の利用に関して必要な事項を定め、
市民の利便向上及び施設の適正な管理運営を図ることを目的とする。

第2条（利用料金）
施設の利用料金は、別表第1に定めるとおりとする。
２　市長は、特別の事情があると認めるときは、利用料金を減額し、または免除することができる。

第3条（利用の制限）
次の各号に該当する場合は、施設の利用を認めないことができる。
  一　公の秩序を乱し、または風俗を害するおそれがあるとき
  二　施設を損傷するおそれがあるとき
  三　前2号のほか、施設の管理上支障があると認めるとき
```

期待される `comparison-table.json` の出力例（架空）:

```json
{
  "rows": [
    {
      "article": "第1条",
      "current": "市民の利便向上を図ることを目的とする。",
      "revised": "市民の利便向上及び施設の適正な管理運営を図ることを目的とする。",
      "rationale": "施設管理の観点を目的規定に明示するため追加"
    },
    {
      "article": "第2条第2項（新設）",
      "current": "（規定なし）",
      "revised": "市長は、特別の事情があると認めるときは、利用料金を減額し、または免除することができる。",
      "rationale": "減免規定を整備し、条例上の根拠を明確化"
    },
    {
      "article": "第3条第3号（新設）",
      "current": "（規定なし）",
      "revised": "前2号のほか、施設の管理上支障があると認めるとき",
      "rationale": "包括的な利用制限根拠を追加し、管理の柔軟性を確保"
    }
  ]
}
```

## 使い方

1. 自分のプロジェクトで recipe を生成:

   ```bash
   genai new my-bylaw-diff
   ```

2. 生成された `genai.recipe.yml` を上の Recipe で置換、ID を環境に合わせて変更
3. `references/rubric_diff_format.md` を自前で作成（汎用観点のみ）
4. 上記 artifact schema を `references/artifact.schema.json` として保存
5. `eval.yml` に contract 検証ステップとして追加（スキーマを参照）
6. 現行文・改正案を fixture として配置し、コンパイル → 検証 → テスト:

   ```bash
   genai compile --recipe genai.recipe.yml
   genai validate .claude/skills/my-bylaw-diff
   genai test .claude/skills/my-bylaw-diff
   ```

7. Claude Code で `/my-bylaw-diff` を呼び出し、現行文と改正案を渡して新旧対照表を生成

## 適応のヒント

| 軸 | 拡張ポイント |
|---|---|
| 条文の粒度 | 条単位から項・号単位まで `article` フィールドの粒度を調整 |
| 出力形式 | Markdown テーブルが必要な場合は `amendment-summary.md` のテンプレートで表形式を指示 |
| 複数例規の一括処理 | `inputs.current_text` の代わりに `files` 型に変更して複数ファイルを受け取ることも可能 |
| 改正理由の詳細化 | `revision_notes` に改正経緯・審議会答申等の抜粋を入れると `rationale` の精度が上がる |

## 自分の用途に転用するときの注意

- fixture は合成または自分の組織の管理下にある条文のみを使う
- 実在の条例文を fixture に使うときは著作権・情報管理ポリシーを事前確認
- `references/rubric_diff_format.md` は汎用観点を自前で書き起こす（特定マニュアルの文言流用なし）
- 改正案は公表前の機微情報になりうる → local-first 運用を厳守

## 関連

- 共有ルブリック: `references/_shared/rubrics/`（v0.2.x で配置）
- artifact AJV 検証: `packages/core/src/eval/contract.ts`（v0.2.x B-(B) で追加）
- 入力型 `table` artifact 出力: `schemas/genai.recipe.schema.json`
