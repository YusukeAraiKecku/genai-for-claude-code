#!/usr/bin/env python3
"""
PostToolUse hook for Write/Edit — runs `genai validate` when a SKILL.md is written.
Non-blocking: prints warnings but never exits non-zero (to avoid interrupting Claude).
"""
import json
import subprocess
import sys
from pathlib import Path


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    file_path = payload.get("tool_input", {}).get("file_path", "")
    if not isinstance(file_path, str):
        sys.exit(0)

    p = Path(file_path)

    # Only react to SKILL.md writes
    if p.name != "SKILL.md":
        sys.exit(0)

    skill_dir = p.parent
    genai = Path("packages/cli/dist/index.js")
    if not genai.exists():
        sys.exit(0)

    try:
        result = subprocess.run(
            ["node", str(genai), "validate", str(skill_dir)],
            capture_output=True,
            text=True,
            timeout=15,
        )
        if result.returncode != 0:
            print(
                f"[post_write_validate] WARNING: genai validate found issues in {skill_dir}:",
                file=sys.stderr,
            )
            print(result.stdout, file=sys.stderr)
            print(result.stderr, file=sys.stderr)
    except subprocess.TimeoutExpired:
        print("[post_write_validate] validate timed out — skipping", file=sys.stderr)
    except Exception as e:  # noqa: BLE001
        print(f"[post_write_validate] error: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
