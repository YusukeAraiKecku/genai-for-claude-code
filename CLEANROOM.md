# Clean-room Statement

Genai for Claude Code is a clean-room, local-first reimplementation of the *general idea* of declarative AI app registration for Claude Code Skills.

It does not copy source code, UI, design assets, deployment templates, screenshots, or government-specific wording from any other GenAI repository.

## 日本語

本プロジェクトは、公開情報から読み取れる「AIアプリを宣言的に登録する」という一般的な設計思想を、Claude Code Skill 向けにローカルファーストで再実装するものです。源内のソースコード、UI、デザイン、デプロイテンプレート、行政向け固有文言はコピーしません。

## What we do NOT copy

- ❌ Source code
- ❌ UI / frontend code
- ❌ Design assets, screenshots, themes
- ❌ AWS / CDK / Lambda / Terraform deployment templates
- ❌ Government-specific wording or sample data
- ❌ Page structure or screen layouts

## What we reinterpret (concept-only)

- ✅ Declarative AI app registration
- ✅ Input contract pattern
- ✅ Output contract pattern
- ✅ Artifacts concept
- ✅ Sync / async execution distinction
- ✅ App catalog philosophy

## What we implement independently

- Genai Recipe schema (`genai.recipe.yml`)
- Skill Compiler pipeline
- Claude Code Skill templates (SKILL.md generator)
- Hook-based safety validation
- Subagent orchestration
- Three-layer evaluation (static / contract / qualitative)
- CLI (`genai init / new / compile / validate / test / doctor`)
- Plugin marketplace packaging

## Contributor checklist

For every Pull Request:

```text
[ ] No code copied from external repositories
[ ] If inspired by a public source, link to it explicitly
[ ] License compatibility verified
[ ] No reuse of government-style UI text or sample data
[ ] Implementation can be explained as original work
```
