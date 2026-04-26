---
name: proposal-review
description: 提案書・企画書をレビューし、強み・懸念点・改善提案・未解決問題を構造化して出力するスキル。
allowed-tools:
  - Read
  - Grep
  - Glob
---

<!-- BEGIN GENAI GENERATED -->

# Proposal Review

## Purpose

提案書・企画書をレビューし、強み・懸念点・改善提案・未解決問題を構造化して出力するスキル。

## When to use

- 提案書・企画書をレビューし、強み・懸念点・改善提案・未解決問題を構造化して出力するスキル。 関連タグ: review, document, proposal

## Inputs

- `proposal` — 提案内容 — markdown — **required**
- `context` — 背景・目的 — markdown — optional
- `review_focus` — レビュー重点 — select — optional

## Process

1. ユーザーの依頼を確認する
2. 入力不足があれば、不足項目だけを聞き返す
3. 必要に応じて参照ファイルを読む
4. 実行モード (`claude-local`) に従って処理する
5. 出力契約に沿って回答する
6. 必要なartifactを生成する

## Output contract

Primary output: `markdown`

Artifacts (生成した場合は回答内でファイルパスを明示する):
- `review-report.md` — optional

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
