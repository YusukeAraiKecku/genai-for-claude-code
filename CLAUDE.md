# CLAUDE.md

このファイルは、Claude Code が `genai-for-claude-code` リポジトリで作業するときに毎セッション読む最小ルールです。詳細手順は `.claude/skills/` と `specs/` (ある場合) に分離します。

## このプロジェクトは何か

**Genai for Claude Code** は、AIアプリ仕様 → Claude Code Skill への local-first コンパイラです。
clean-room 実装であり、外部 GenAI リポジトリのコード/UI/デザインはコピーしません。

## Core Rule

実装の前に、必ず以下を確認する。

1. `README.md` (プロダクトの目的)
2. `CLEANROOM.md` (やってよいこと/だめなこと)
3. `tasks/current_task.md`
4. `tasks/implementation_plan.md`
5. 関係する `examples/<skill>/README.md`

仕様参照のみの read-only 場所:

- `../genai_for_claude_code_spec/` (本リポジトリ祖先の仕様書)
- `../claude_code_preflight_harness_ja/` (governance pattern の出典)

`../genai-ai-api-main/` および `../genai-web-main/` は **clean-room 対象、開かない**。

## Workflow

- いきなり実装しない。大きな変更は Plan Mode で探索・計画する。
- 仕様 → 受け入れ条件 → 非対象 を確認してから実装する。
- 1 ステップずつ実装し、関連する verify を走らせる。
- 仕様にない機能を勝手に追加しない。
- 完成前に必ず `npm run verify` を実行する。
- `npm run verify` が失敗する限り、完成と言わない。

## Completion Definition

完了は以下すべてを満たすこと。

- `tasks/current_task.md` の Acceptance Criteria に対して状態が説明されている
- `npm run verify` が pass
- typecheck / lint / build / smoke compile すべて pass
- 仕様外の差分が混入していない (refactor 混合禁止)
- `tasks/progress_log.md` と `tasks/handoff.md` が更新されている

## Clean-room operating rule

- 実装中、`../genai-ai-api-main/` と `../genai-web-main/` は **絶対に開かない**
- 概念マッピング (web の form → recipe の inputs など) は `CLEANROOM.md` の許容範囲のみ
- 外部リポジトリの code / UI / design / 行政固有文言を持ち込まない
- 公開前は CONTRIBUTING.md の clean-room チェックリストを目視通過させる

## Context Management

コンテキスト圧縮時には必ず以下を残す。

- 現在の目的 (どの phase / 何を作っているか)
- 対応中の Acceptance Criteria
- 変更済みファイル一覧
- 実行した検証コマンド
- 失敗中のテストとエラー要約
- 未解決の設計判断
- 次にやるべき最小作業

長時間セッションで同じ問題を 2 回以上修正しても失敗する場合、`tasks/handoff.md` を更新し、`/clear` して新しいセッションで再開する。

## Safety

- 本番データを削除しない。
- `.env` / 秘密鍵 / 認証情報を出力しない。
- 破壊的コマンドは実行前に理由と対象を明示する。
- テストを削除して通さない。エラーを握りつぶして通さない。
- `Bash(*)` `curl | bash` `rm -rf` `sudo` `chmod 777` を生成 Skill に含めない。

## Git

- 変更前に `git status` を確認する。
- 他人の変更を巻き戻さない。
- コミット前に `npm run verify` を実行する。
- コミットメッセージには 目的・主な変更・検証結果 を含める。
