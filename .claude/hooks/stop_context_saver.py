#!/usr/bin/env python3
"""
Stop hook — appends a timestamped entry to tasks/progress_log.md.
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        payload = {}

    log_path = Path("tasks/progress_log.md")
    if not log_path.exists():
        sys.exit(0)

    stop_reason = payload.get("stop_hook_active", False)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    entry = f"\n## {ts}\n\n"
    if stop_reason:
        entry += "Session ended (stop hook active).\n"
    else:
        entry += "Session ended.\n"

    with log_path.open("a", encoding="utf-8") as f:
        f.write(entry)


if __name__ == "__main__":
    main()
