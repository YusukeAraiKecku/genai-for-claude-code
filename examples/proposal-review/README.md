# Proposal Review — Example Skill

Demonstrates the simplest Genai recipe: a **claude-local** skill that reviews proposals and produces a structured report.

## What it does

Given a proposal document (Markdown), outputs:

- **強み** (Strengths) — what the proposal does well
- **懸念点** (Concerns) — risks, gaps, or weak points
- **改善提案** (Improvement suggestions) — concrete next steps
- **未解決の問題** (Open questions) — things that need answers before proceeding

## Try it

```bash
# Compile the recipe into a Claude Code skill
genai compile --recipe examples/proposal-review

# Validate the compiled bundle
genai validate .claude/skills/proposal-review

# Run eval against the sample fixture
genai test examples/proposal-review
```

## Files

| File | Purpose |
|------|---------|
| `genai.recipe.yml` | Declarative spec — the single source of truth |
| `eval.yml` | Eval cases and quality assertions |
| `tests/fixtures/` | Sample inputs for eval |
| `tests/golden/` | Reference outputs for qualitative comparison |
