# Case Studies

ドメイン特化の Genai Skill レシピ例を文書として収録しています。各 case study は recipe YAML + fixture 例 + 使い方を含む「コピーして改造する」形式で書かれています。

データはすべて合成です（実在組織名・実在条文・特定マニュアル文言を含みません）。

将来的に `genai-marketplace`（v0.5 計画、D-009）が立ち上がった時点で、runnable 版はそちらに移植される予定です。

## 一覧

| Case Study | ドメイン | 主 input | execution | Skill のショーケース |
|---|---|---|---|---|
| [議会答弁ドラフター](./legislative-qa-drafter.md) | 自治体 | `longform_ref`（過去議事録） + `persona` | `local-rag`（declared） | `longform_ref` 型 / `local-rag` / `index: true` |
| [例規改正差分](./bylaw-amendment-diff.md) | 自治体 / 法務 | 現行条文 + 改正案文（`markdown`） | `local-file` | `artifact-json` + AJV スキーマ検証 |

## 汎用サンプルとの違い

`examples/` にある 5 つの Skill（contract-review-lite / meeting-to-actions など）は **業界横断的な generic テンプレート** として設計されています。

`docs/case-studies/` は特定ドメインの**実用性デモ**です。ダウンロードして `examples/` のように使い始めることも、recipe だけコピーして自分のプロジェクトに組み込むことも、両方できます。
