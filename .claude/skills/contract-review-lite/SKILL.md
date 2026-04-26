---
name: contract-review-lite
description: 契約書・利用規約を読み込み、リスク条項・不利な条件・確認すべき点を一覧化するスキル。法的アドバイスではなくチェックリストとして使用する。
allowed-tools:
  - Read
  - Grep
  - Glob
---

<!-- BEGIN GENAI GENERATED -->

# Contract Review Lite

## Purpose

契約書・利用規約を読み込み、リスク条項・不利な条件・確認すべき点を一覧化するスキル。法的アドバイスではなくチェックリストとして使用する。

## When to use

- 契約書・利用規約を読み込み、リスク条項・不利な条件・確認すべき点を一覧化するスキル。法的アドバイスではなくチェックリストとして使用する。 関連タグ: review, contract, legal-lite

## Inputs

- `contract_file` — 契約書ファイル — file — **required**
- `contract_type` — 契約種別 — select — optional
- `party_role` — 自社の立場 — select — optional

## Process

1. ユーザーの依頼を確認する
2. 入力不足があれば、不足項目だけを聞き返す
3. 必要に応じて参照ファイルを読む
4. 実行モード (`local-file`) に従って処理する
5. 出力契約に沿って回答する
6. 必要なartifactを生成する

## Output contract

Primary output: `markdown`

Artifacts (生成した場合は回答内でファイルパスを明示する):
- `risk-checklist.md` — optional

## Quality rules

- separate facts assumptions opinions
- list open questions

## Safety rules

- network: deny-by-default
- secrets: forbid-hardcoded
- side effects: read-only-by-default

## Failure handling

- 入力不足の場合は、不足項目を明示する
- 参照ファイルがない場合は、その前提を明記する
- 外部APIが必要そうでも、まずローカルで可能か検討する
- 不確かな情報は断定しない

<!-- END GENAI GENERATED -->
