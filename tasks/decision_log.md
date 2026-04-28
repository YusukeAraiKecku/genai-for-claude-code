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

## 2026-04-28

### D-006: `QualScorer` IF を v0.2.x で切り出す（実装は v0.3）

**決定**: `packages/core/src/eval/qualitative.ts` に `interface QualScorer { score(input, fixture, rule): Promise<{pass, score, reason}> }` を導入し、デフォルト実装は現状の文字列マッチ (`scorers/string-match.ts`)。LLM 採点は v0.3 で `scorers/llm.ts` を追加するだけで完了する形に整える。
**理由**: `~/.claude/plans/misty-purring-muffin.md` の残タスク「Eval Phase 2 (LLM-based scoring) → v0.3」を前倒しせずに、ハーネス側の差し替え点を先に確定させるため。共有ルブリック (`references/_shared/rubrics/`) と `EvalCase.rubric_refs` 拡張は v0.2.x で完了。
**代替案**: IF を切らず v0.3 で一気に実装 → v0.3 着手時の差分が大きくなり、共有ルブリックを使う段階A 試用と整合しない。

### D-007: `vendor-contract-redline` は既存 `contract-review-lite` と併存

**決定**: 段階B-(C) で `examples/` に昇格させる `vendor-contract-redline` は、既存 `contract-review-lite` を置換せず併存させる。
**理由**: 観点軸が異なる。`contract-review-lite` は local-file モードでの汎用契約レビュー (リスク条項一覧化)、`vendor-contract-redline` は buyer/seller persona × `risk-matrix.json` 構造検証を含むベンダー契約レビューで、検証範囲が補完関係。examples 昇格時は混乱防止のため README で位置づけ差分を明記する。
**代替案**: `contract-review-lite` を `vendor-contract-redline` で置き換え → CHANGELOG への破壊的変更となり、本フェーズの後方互換方針に反する。

### D-009: Plugin Marketplace は別リポジトリ（`genai-marketplace`）に分離する

**決定**: v0.5 で実装するマーケットプレイスは、`genai-for-claude-code` 内に `marketplace/` ディレクトリを置く案（案1）ではなく、`genai-marketplace` という独立リポジトリをレジストリとする案（案2）を採用する。
**理由**: 外部コントリビューションへの自然な対応（fork → `genai publish` → PR）、独立した CI/バージョニング、本リポジトリのビルド時間や関心の分離。npm registry / Homebrew tap に近い構造。
**代替案**: 同一リポジトリ内の `marketplace/plugins/` に置く → シンプルだが、コミュニティ投稿が全て本リポジトリへの PR になり、review コストが集中する。
**影響**: `genai-for-claude-code` 側は `genai-pack` / `genai-publish` / `genai install` コマンドのみ持ち、レジストリ本体は持たない。

### D-008: `cli/commands/new.ts` の scaffold コメント拡張は v0.2.x では行わない

**決定**: v0.2.x で input 型を拡張するが、`packages/cli/src/commands/new.ts` 内のコード式 scaffold には拡張型の例を追加しない。新型の使い方ドキュメントは `docs/` 側で行う。
**理由**: `tasks/backlog.md` の v0.3 項目「recipe / skill template files for `genai new` (現状はコード内で scaffold 生成。v0.3 で `templates/` に外部化)」と直接ぶつかり、本フェーズで `new.ts` を編集しても v0.3 で外部テンプレートに置き換わって消える無駄作業になる。
**代替案**: `templates/recipe_template.md.hbs` を本フェーズで先行作成 → v0.3 の外部化スコープを侵食するため見送り。
