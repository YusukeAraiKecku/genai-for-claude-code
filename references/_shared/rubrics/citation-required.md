# Citation Required Rubric

<!-- CLEANROOM: generic only, no jurisdiction-specific text -->

## 引用元記載の要件

- 本文中に文書・章・節を特定する情報を付ける
- 形式: `（出典: <ファイル名> § <章/節>）` または `（ref: <ファイル名>:<行番号>）`
- 推論・解釈は出典ではなく「示唆」と明記する

## 使うべき場面

- `execution.default_mode: local-file` または `local-rag` の skill
- 要約・Q&A・チェックリストを出力する skill

## eval での use_include 設定例

```yaml
must_include:
  - "## 引用"
must_not_include:
  - "（出典不明）"
```
