#!/usr/bin/env python3
"""
PreToolUse hook for Bash — blocks dangerous command patterns.
Reads tool input from stdin as JSON, writes decision to stdout.
"""
import json
import re
import sys

BLOCKED_PATTERNS = [
    (r"\brm\s+-rf\s+/", "rm -rf / detected"),
    (r"curl\s+[^|]*\|\s*(?:ba)?sh", "curl | sh pipe detected"),
    (r"\bsudo\b", "sudo usage detected — use explicit permissions instead"),
    (r"\beval\s+['\"`\$]", "eval with dynamic input detected"),
    (r"chmod\s+777", "chmod 777 detected — use least-privilege permissions"),
    (r":(){:|:&};:", "fork bomb pattern detected"),
    (r"\bdd\s+if=/dev/", "dd from device detected"),
    (r">\s*/dev/sd[a-z]", "direct device write detected"),
]

def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    command = payload.get("tool_input", {}).get("command", "")
    if not isinstance(command, str):
        sys.exit(0)

    for pattern, reason in BLOCKED_PATTERNS:
        if re.search(pattern, command, re.IGNORECASE):
            result = {
                "decision": "block",
                "reason": f"[pre_bash_guard] Blocked: {reason}\nCommand: {command[:200]}",
            }
            print(json.dumps(result))
            sys.exit(0)

    sys.exit(0)

if __name__ == "__main__":
    main()
