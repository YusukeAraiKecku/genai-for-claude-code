#!/usr/bin/env python3
"""
PreCompact hook — writes a handoff snapshot to tasks/handoff.md before context compression.
"""
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


def main() -> None:
    handoff_path = Path("tasks/handoff.md")
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    # Gather git status for context
    try:
        git_status = subprocess.run(
            ["git", "status", "--short"],
            capture_output=True,
            text=True,
            timeout=5,
        ).stdout.strip()
    except Exception:  # noqa: BLE001
        git_status = "(git unavailable)"

    try:
        git_log = subprocess.run(
            ["git", "log", "--oneline", "-5"],
            capture_output=True,
            text=True,
            timeout=5,
        ).stdout.strip()
    except Exception:  # noqa: BLE001
        git_log = "(git unavailable)"

    content = f"""# Handoff — {ts}

## Why this file exists

Written automatically by the PreCompact hook just before context compression.
Read this at the start of the next session to restore context quickly.

## Git status

```
{git_status or "(clean)"}
```

## Recent commits

```
{git_log or "(no commits yet)"}
```

## What to do next

1. Read `tasks/current_task.md` for the active task.
2. Read `tasks/implementation_plan.md` for the overall plan.
3. Run `bash scripts/verify.sh` to check current state.
4. Continue from where the previous session left off.
"""

    handoff_path.parent.mkdir(parents=True, exist_ok=True)
    handoff_path.write_text(content, encoding="utf-8")


if __name__ == "__main__":
    main()
