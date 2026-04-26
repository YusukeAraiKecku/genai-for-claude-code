# Meeting to Actions — Example Skill

Demonstrates **multiple artifact outputs**: a single skill run produces three separate Markdown files (decisions, actions, next-agenda).

## What it does

Given meeting notes, produces three artifacts:

- **decisions.md** — 決定事項の一覧
- **actions.md** — アクションアイテム（担当者・期限付き）
- **next-agenda.md** — 次回会議のアジェンダ案

## Try it

```bash
genai compile --recipe examples/meeting-to-actions
genai validate .claude/skills/meeting-to-actions
genai test examples/meeting-to-actions
```

## Key difference from proposal-review

Outputs **three artifacts** instead of one. Demonstrates that a recipe can produce multiple structured files in a single execution, useful when downstream tools consume different parts of the output.
