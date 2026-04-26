# Decision Log

## 2026-04-27

### D-001: 言語 TypeScript / Node 22 を採用

**決定**: 仕様書 `implementation/claude_code_implementation_plan.md` に従い、core / cli / runtime は TypeScript で実装する。
**理由**: 仕様参照、Claude Code エコシステムとの親和性、npm 公開のしやすさ。
**代替案**: Python (preflight harness 寄り)、Go (バイナリ単一)。npm 経由配布のしやすさで TS 優先。

### D-002: パッケージマネージャ npm workspaces

**決定**: pnpm / yarn / turbo は使わない。npm workspaces のみ。
**理由**: 依存を最小化、ユーザの初期セットアップを `npm install` だけで完結。
**代替案**: pnpm は速いが install が二段になる。turbo は MVP には過剰。

### D-003: ライセンス MIT

**決定**: code は MIT、docs も同じファイルで明示。CC-BY サブセットは v0.3 まで延期。
**理由**: 採用障壁の低さ。

### D-004: clean-room 運用ルール

**決定**: `../genai-ai-api-main/` `../genai-web-main/` は実装中に絶対に開かない。仕様書 `../genai_for_claude_code_spec/` のみ参照。
**理由**: clean-room 違反を構造的に防ぐ。

### D-005: v0.1 + v0.2 を 1 リリースにまとめる

**決定**: spec の v0.1 (compiler MVP) + v0.2 (hooks/eval) を一つのリリース 0.1.0-pre として出す。
**理由**: hooks / eval skeleton がないと v0.1 単体では公開時の魅力が弱い (CONTRIBUTING の checklist で eval を要求しているため)。
