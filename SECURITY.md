# Security Policy

Genai for Claude Code generates Skills that Claude Code will execute. A misconfigured allowed-tools list, a leaked secret, or a destructive Bash command in a published Skill can cause real harm — so the compiler treats security as **part of the build**, not as a follow-up.

## Defaults

```text
network:        deny-by-default
remote-api:     optional, opt-in, requires user confirmation
secrets:        env-only, never hardcoded
Bash:           allowlist (no wildcards)
side-effects:   read-only by default
file system:   no path traversal, artifact paths sandboxed
```

## allowed-tools policy

**Forbidden** in any generated Skill:

```yaml
allowed-tools:
  - Bash(*)        # ❌ wildcards
  - Bash(curl *)   # ❌ network egress
  - Bash(rm *)     # ❌ destructive
  - Bash(sudo *)   # ❌ privilege escalation
  - Bash(chmod 777 *)  # ❌
```

**Recommended**:

```yaml
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash(python ${CLAUDE_SKILL_DIR}/scripts/validate_input.py *)
```

The compiler emits an error if any forbidden pattern appears.

## Secret policy

- ❌ `api_key: sk-...` (hardcoded)
- ✅ `api_key_env: GENAI_REMOTE_API_KEY` (env reference)
- Distribute `.env.example` only — never `.env`.

## Pre-publish checklist

Before pushing a release tag:

```text
[ ] No `.env` committed
[ ] No real API keys in any file
[ ] Install scripts do not modify global config without consent
[ ] Plugin manifest does not request unintended permissions
[ ] All examples are safe to run on a fresh laptop
```

## Reporting a vulnerability

Please open a private **GitHub Security Advisory** (or a confidential issue) for:

- Secret leakage in generated Skills
- Dangerous `allowed-tools` patterns slipping past the safety checker
- Path traversal in artifact paths
- Remote APIs becoming enabled without explicit confirmation
- Destructive operations executable from a generated Skill
- Clean-room policy violations

Public issues are welcome for non-sensitive security improvements.
