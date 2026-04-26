# Handoff

## 状態

Phase 0 (bootstrap) が進行中。governance / license / public docs / verify.sh / tasks/ は完了済み。
残りは monorepo の `package.json` / `tsconfig.json` / `biome.json` と、`packages/{core,cli,runtime}` の package.json 雛形。

## Next action

1. ルート `package.json` を npm workspaces で書く
2. `tsconfig.json` (strict, NodeNext, ESM)
3. `biome.json` (formatter / linter)
4. 各 package の `package.json` (TypeScript)
5. `bash scripts/verify.sh` を実行して通ることを確認 (この時点では smoke compile はスキップされる)
6. Phase 1 (compiler MVP) に着手

## 直近の決定事項

- 言語: TypeScript (Node 22+)
- パッケージマネージャ: npm workspaces (pnpm/yarn は使わない)
- フォーマッタ/Linter: Biome
- License: MIT
- リポジトリ名: `gennai-for-claude-code`

## オープンな論点

- Plugin marketplace の登録手続き (v0.3 でリサーチ)
- Skill 間合成構文 (未設計)
- `local-rag` のベクタ DB 統合 (v1.0+)
