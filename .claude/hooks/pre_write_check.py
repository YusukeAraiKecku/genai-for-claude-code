#!/usr/bin/env python3
"""
PreToolUse hook for Write — blocks writes to sensitive paths.
"""
import json
import sys

BLOCKED_PREFIXES = [
    "/etc/",
    "/usr/",
    "/bin/",
    "/sbin/",
    "/Library/",
    "/System/",
]

BLOCKED_PATTERNS = [".env", ".pem", ".key", ".p12", ".pfx", "id_rsa", "id_ed25519"]


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        sys.exit(0)

    file_path = payload.get("tool_input", {}).get("file_path", "")
    if not isinstance(file_path, str):
        sys.exit(0)

    for prefix in BLOCKED_PREFIXES:
        if file_path.startswith(prefix):
            result = {
                "decision": "block",
                "reason": f"[pre_write_check] Write to system path blocked: {file_path}",
            }
            print(json.dumps(result))
            return

    lower = file_path.lower()
    for pat in BLOCKED_PATTERNS:
        if pat in lower:
            result = {
                "decision": "block",
                "reason": f"[pre_write_check] Write to sensitive file blocked: {file_path}",
            }
            print(json.dumps(result))
            return


if __name__ == "__main__":
    main()
