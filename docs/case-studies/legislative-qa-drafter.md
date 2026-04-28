# Case Study: 議会答弁ドラフター（Legislative Q&A Drafter）

このケーススタディは「コピーして自分の用途に改造する」想定の汎用テンプレートです。fixture / rubric は合成データで、特定自治体・特定マニュアルの文言は含みません。

## 概要

過去の議会議事録と今期の主要論点メモから、論点抽出 → 想定問答ドラフト → 答弁書骨子までを一気通貫で作成する Skill のケーススタディです。Genai for Claude Code の `local-rag` モード（declared）と `longform_ref` 入力型のショーケースとして書かれています。

## 想定ユーザー

- 自治体職員（議会対応・政策担当）
- 議会事務局のスタッフ
- 政策提言を行う民間シンクタンク

## なぜ Genai か

議会想定問答の作成は、過去議事録・論点メモ・部署横断の知見を読み合わせる作業で、Skill 化に向く特徴を備えています。

- 過去議事録は **長文参照**（→ `longform_ref`）
- 論点抽出と引用は **ローカル文書探索**（→ `local-rag` declared）
- 答弁の聞き手は **議員向け / 一般向け** で文体が変わる（→ `persona`）
- 個別案件の機微情報は **ローカル完結が望ましい**（→ local-first 思想）

## Recipe（コピーして自分のプロジェクトに）

```yaml
id: legislative-qa-drafter
name: Legislative Q&A Drafter
version: 0.1.0
description: 過去議事録と今期論点メモから、想定問答と答弁書骨子を作成する Skill。

tags:
  - local-government
  - legislative
  - qa-draft

origin:
  type: original
  source_code_copied: false

execution:
  default_mode: local-rag
  allowed_modes:
    - local-rag
    - claude-local
  remote_api_required: false

inputs:
  meeting_history:
    type: longform_ref
    title: 過去議事録
    description: 過去の定例会・委員会議事録。各エントリに path と label を付与。
    required: true
  current_topic:
    type: markdown
    title: 今期の主要論点メモ
    description: 担当者がまとめた今期の論点・背景・関連事業の概況。
    required: true
  audience:
    type: persona
    title: 想定する答弁の聞き手
    description: internal-council（議員向け） / general-public（一般公開向け）など。
    required: true

local_context:
  references:
    - path: ../../references/_shared/rubrics/general-quality.md
      description: 一般品質ルブリック
    - path: ../../references/_shared/rubrics/citation-required.md
      description: 引用必須ルブリック
    - path: references/rubric_qa_quality.md
      description: 想定問答品質の汎用観点
      index: true

outputs:
  primary: markdown
  artifacts:
    - name: qa-draft
      path: qa-draft.md
      format: markdown
      description: 想定問答（Q→A→根拠引用）の連続
    - name: talking-points
      path: talking-points.md
      format: markdown
      description: 答弁書骨子（要点・補足）

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
  pii: declared
  allowed_tools:
    - Read
    - Grep
    - Glob

claude:
  skill_name: legislative-qa-drafter
  auto_invocation: true
```

## Sample fixture（合成データ）

`tests/fixtures/sample.input.md`（今期の論点メモ）:

```markdown
# 今期の主要論点メモ（架空：A 市総合計画 第 3 章）

- テーマ: 中心市街地の歩行者回遊性向上
- 背景: 過去 2 期で関連事業の進捗と成果指標が議論されてきた
- 想定質問の方向性:
  1. 既存事業の成果指標と今期の目標値の関係
  2. 施設利用者数と事業費のバランス
  3. 公共交通アクセスとの統合方針

- 担当部署: A 市 都市計画部 / 観光商工部（仮）
- 関係条例: A 市都市再生推進条例（架空・例示用）
```

`tests/fixtures/sample.history.md`（過去議事録の placeholder インデックス）:

```markdown
# 過去議事録 リスト（架空・合成）

| path | label |
|---|---|
| archives/A-shi-council-2024-spring.md | A 市議会 2024 年春定例会（架空） |
| archives/A-shi-council-2024-autumn.md | A 市議会 2024 年秋定例会（架空） |
| archives/A-shi-council-2025-spring.md | A 市議会 2025 年春定例会（架空） |

各エントリは合成テキストで、実在の議事録は含みません。
```

> 上記 path は実在せず、利用者は自分の自治体の議事録（または合成された汎用議事録）を `archives/` 配下に置いてご利用ください。

## 使い方

1. 自分のプロジェクトで recipe を生成:

   ```bash
   genai new my-qa-drafter
   ```

2. 生成された `genai.recipe.yml` を上の Recipe で置換、ID を環境に合わせて変更
3. `references/rubric_qa_quality.md` を自前で作成（汎用観点のみ、特定マニュアルの流用なし）
4. 過去議事録を `archives/` に配置（fixture）
5. コンパイル → 検証 → テスト:

   ```bash
   genai compile --recipe genai.recipe.yml
   genai validate .claude/skills/my-qa-drafter
   genai test .claude/skills/my-qa-drafter
   ```

6. Claude Code で `/my-qa-drafter` を呼び出し、論点メモを渡して想定問答を生成

## 適応のヒント

| 軸 | 拡張ポイント |
|---|---|
| 自治体規模 | 小規模町村は `current_topic` を簡素化、政令市は部署横断の `meeting_history` 増量 |
| 公開範囲 | `audience: general-public` 時は専門用語の言い換え必須（`references/_shared/rubrics/general-quality.md` の汎用観点で担保） |
| 機微情報 | 個人名・住所等が含まれる議事録を扱う場合は `security.pii: declared` を保ち、出力で必ずマスク |
| 引用形式 | `references/_shared/rubrics/citation-required.md` を参照し、`source: <ファイル名>:<行番号>` 形式を強制 |

## 自分の用途に転用するときの注意

- fixture / archives は合成または自分の組織の管理下にある資料のみを使う
- 特定マニュアル等を `references/` にそのまま持ち込まず、汎用観点を自前で書き起こす
- 特定書式コード・通知文の言い回しを Skill 内に直書きしない
- 出力に個人名・住所・電話番号等が混入しないよう `pii: declared` の運用方針を明記

## 関連

- 共有ルブリック: `references/_shared/rubrics/`（v0.2.x で配置）
- 実行モード `local-rag`: `packages/core/src/compiler/skillMd.ts` で配線（declared mode）
- 入力型 `longform_ref` / `persona`: `schemas/genai.recipe.schema.json`
