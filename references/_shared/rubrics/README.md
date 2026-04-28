# Shared Rubrics

<!-- CLEANROOM: generic only, no jurisdiction-specific text -->

Generic evaluation rubrics reusable across any Genai skill.

## Usage

Reference from any recipe with a relative path:

```yaml
local_context:
  references:
    - path: ../../references/_shared/rubrics/general-quality.md
      description: 汎用品質チェック観点
```

The compiler flattens `../../` prefix in the output bundle to avoid path traversal in the skill directory.

## Available rubrics

| File | Purpose |
|---|---|
| `general-quality.md` | 事実/示唆/推測の分離、未解決問題の列挙 |
| `pii-redaction.md` | PII 含む入力の取り扱い注意事項 |
| `disclaimer.md` | 法的助言・医療判断・財務判断の免責文 |
| `citation-required.md` | 引用元記載の要件 |

## CLEANROOM policy

すべての rubric ファイルは汎用文言のみ。特定自治体名・省庁名・固有書式コード・特定法域への言及を含まないこと。
