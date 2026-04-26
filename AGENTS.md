# AGENTS.md

Claude Code 以外の AI coding agent (Cursor / Codex / OpenCode 等) にも読ませる共通エージェント指示です。Claude Code は本ファイルに加えて `CLAUDE.md` も読みます。

## Universal Rules

1. Do not start coding before reading `README.md`, `CLEANROOM.md`, and `tasks/current_task.md`.
2. Do not claim completion before `bash scripts/verify.sh` passes.
3. Do not expand scope beyond the explicit task. Refactor must not be mixed with feature work.
4. Preserve user intent, non-goals, and acceptance criteria over your own implementation preferences.
5. If the context becomes long or polluted, write a handoff summary to `tasks/handoff.md` and restart from the files.

## Files to read first

```text
README.md
CLEANROOM.md
SECURITY.md
tasks/current_task.md
tasks/implementation_plan.md
```

## Clean-room rule (mandatory)

The directories `../genai-ai-api-main/` and `../genai-web-main/` are **clean-room source material — do not open them**. Only the abstract concepts listed in `CLEANROOM.md` may be reinterpreted. Code, UI, design assets, deployment templates, and government-specific wording must not be copied or paraphrased.

## Local-first rule

When designing or generating Skills, prefer execution modes in this order:

```text
claude-local > local-file > local-script > local-rag > mcp > remote-api
```

`remote-api` is opt-in only and requires explicit user confirmation in the Skill design.

## Completion contract

An implementation is complete only when:

- The acceptance criteria in `tasks/current_task.md` are explicitly satisfied.
- `bash scripts/verify.sh` passes (typecheck, lint, build, smoke compile).
- Remaining risks are listed in `tasks/handoff.md`.
- No unrelated refactor is mixed in.
