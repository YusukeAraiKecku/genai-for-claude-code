# Contract Review Lite — Example Skill

Demonstrates the **local-file** execution mode: the skill reads a contract file from disk using Claude's Read tool, applies a reference checklist, and produces a risk report.

> **Disclaimer**: This skill produces a checklist, not legal advice. Always consult a qualified attorney before signing contracts.

## What it does

Reads a contract file and outputs:

- **リスク条項** (Risk clauses) — potentially unfavorable clauses with brief explanations
- **確認すべき点** (Points to clarify) — open questions for the other party or your legal team

## Try it

```bash
genai compile --recipe examples/contract-review-lite
genai validate .claude/skills/contract-review-lite
genai test examples/contract-review-lite
```

## Key difference from proposal-review

Uses `local-file` execution mode: Claude reads the file from disk instead of receiving content in the prompt. This is more appropriate for longer documents or binary files where pasting inline would be impractical.
