# General Quality Rubric

<!-- CLEANROOM: generic only, no jurisdiction-specific text -->

## 事実 / 示唆 / 推測の分離

- 文書内で確認できる記述は「事実」として扱う
- 文書から推論できるが明示されていないものは「示唆」と明記する
- 根拠のない仮定は「推測:」プレフィックスを付けるか、含めない

## 未解決問題の列挙

- 出力の末尾に「未解決の問い」または「追加確認が必要な情報」セクションを置く
- 問いは具体的に（「詳細不明」ではなく「第3条の適用条件が不明」）

## 構造と明確さ

- セクション見出しで構造化する（Markdown H2 / H2）
- 1 パラグラフの内容は1つのポイントに限定する
- 箇条書きは 7 項目以内。多い場合は小分け見出しを使う

## 適用方法

```yaml
quality:
  rules:
    - separate_facts_assumptions_opinions
    - list_open_questions
```
