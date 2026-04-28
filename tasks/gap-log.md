# Gap Log — v0.2.x 試用フェーズ

詳細プラン: `~/.claude/plans/virtual-sniffing-kitten.md`

## 観測サマリ

7 シナリオすべてで `genai compile / validate / test` は exit 0。ただし以下の実用上のギャップを観測した。**「pass」=「機能して見える」だが「機能している」ではない**ケースが多い。段階B での修正対象。

## カテゴリ別

### GAP-COMPILE — コンパイラ素通し

- **[GAP-COMPILE-1]** `select` / `multi_select` の `options: [str, str, ...]` が input.schema.json に enum として転写されない | repro: `node packages/cli/dist/index.js compile --recipe genai-apps/policy-doc-summarize-multi/genai.recipe.yml --out /tmp/x && jq '.properties.target_audience' /tmp/x/input.schema.json` — `{"type":"string"}` だけで enum が消える。schema は `options` (string[]) と `items` ({title,value}[]) の両方を許容しているが、`packages/core/src/compiler/inputSchema.ts:47-54` は `items` のみ翻訳し `options` を silently drop。 | impact: high
- **[GAP-COMPILE-2]** `type: json` の input は `{"type":"object"}` 一行になる。内部スキーマ（必須キーや構造）を宣言できない | repro: `jq '.properties.form_payload' /tmp/genai-trial/form-fill-assistance/input.schema.json` | impact: high
- **[GAP-COMPILE-3]** `files` の `accept: [...]` は items に乗るが、最低/最大ファイル数 (`min_files` / `max_files`) を宣言できない | repro: policy-doc-summarize-multi の `source_files` を 0 個・100 個でもどちらも valid になる | impact: med

### GAP-SCHEMA — スキーマの表現力不足

- **[GAP-SCHEMA-1]** `table` 型なし。CSV/TSV/JSON 配列を表として宣言する標準型がない。payroll-monthly-review は `file accept: [.csv]` で代用したが、列名・型を宣言できない | repro: `genai-apps/payroll-monthly-review/genai.recipe.yml` | impact: high
- **[GAP-SCHEMA-2]** `persona` 型なし。立場・宛先切替（buyer/seller、internal/public）を `select` で表現するしかなく、SKILL.md 生成時に「persona に応じてプロンプト指示を変える」ヒントが落ちる | repro: vendor-contract-redline の `party_role` は select で表現できるが、SKILL.md は select という文字列としてしか扱わない | impact: med
- **[GAP-SCHEMA-3]** `longform_ref` 型なし。「過去スレッド」「PDF抽出済テキスト群」のように、各ファイルにメタラベル（年・件名・関係性）を付けて参照させたい場面で `files` (string[]) のみだとメタが落ちる | repro: tax-advisory-intake の `prior_threads` | impact: med

### GAP-EVAL-NO-RUN — Eval が実走しない

- **[GAP-EVAL-NO-RUN-1]** `qualitative` 層は fixture を読み込んで「fixture loaded (X chars)」と pass を返すだけで、`must_include` / `must_not_include` の文字列マッチを実行していない | repro: `node packages/cli/dist/index.js test /tmp/genai-trial/<id>` の出力に "fixture loaded" 以外の検査結果が出ない。`packages/core/src/eval/qualitative.ts:14-92` 参照。ソースコード上のコメント自体が "It does NOT call an LLM" と認めている | impact: high

### GAP-EVAL-EMPTY — 構造検証が空

- **[GAP-EVAL-EMPTY-1]** artifact が JSON でも `contract` 層が JSON Schema 検証をしない。`citations.json` `missing-fields.json` `anomalies.json` `risk-matrix.json` のような構造化出力に対して、形を強制できない | repro: 任意 JSON でも contract pass。`packages/core/src/eval/contract.ts:1-46` 参照 | impact: high
- **[GAP-EVAL-EMPTY-2]** `eval.yml` の `cases: []` (空配列) でも warn 1件で pass。最低1件の case を必須にする選択肢が無い | repro: `genai new` で生成された雛形は `cases: []` のまま | impact: med

### GAP-MODE — 実行モードの実体不足

- **[GAP-MODE-1]** `allowed_modes` に `local-rag` を含めても SKILL.md にRAG 指示が反映されない。`local-rag` は schema 上 enum 値だが、コンパイラ側の出力に何も影響しない | repro: policy-doc-summarize-multi の SKILL.md は `Process` セクションで `local-file` のみ言及、`local-rag` は無視 | impact: high
- **[GAP-MODE-2]** `mcp` `remote-api` の最小実装がない。`remote-api` は GFC201/202 の禁止チェックはあるが、有効化したときの runtime 振る舞いガイドが SKILL.md に出ない | repro: 実 default_mode を mcp にすると pass するが SKILL.md に MCP 言及なし | impact: med
- **[GAP-MODE-3]** `local_context.references[]` を index 対象 / 直接参照 で区別できない。検索用ナレッジ vs 出力テンプレが混在 | repro: schema 上 `references[]` は `path/description` のみ。`index?: boolean` のような区別属性なし | impact: med

### GAP-CONTEXT — references 共有不可

- **[GAP-CONTEXT-1]** 複数 skill で同じ汎用ルブリック（PII redaction / disclaimer / citation-required / general-quality）を使いたいが、共有ディレクトリ規約がなく、各 skill が個別 references/ に重複コピーする運命 | repro: contract-review-lite と vendor-contract-redline で「契約論点」references が分離。`tax-advisory-intake` の免責文・citizen-inquiry-triage の PII 取扱注意・全 skill 共通の "facts/assumptions/opinions 分離" ルールが各々別の references に書かれる | impact: high

### GAP-SECURITY-MISS — 検知漏れ

- **[GAP-SECURITY-MISS-1]** PII を含む入力（住民問い合わせ、過去スレッド、フォーム下書きの contact_email/phone）が来ることが明らかな skill でも、`security.pii` 宣言フィールドがなく、`security.check.ts` も警告しない | repro: form-fill-assistance fixture に `contact_email`, `contact_phone` あり、PII 宣言なくとも runSafetyChecks が無音 | impact: high
- **[GAP-SECURITY-MISS-2]** `Bash(wget` がブロック対象に入っていない（curl は GFC102、rm は GFC103、wget は素通し） | repro: recipe に `allowed_tools: [Bash(wget https://...)]` を追加しても compile pass | impact: low
- **[GAP-SECURITY-MISS-3]** `remote-api` の `endpoint_env` が envvar 名フォーマット（`^[A-Z_][A-Z0-9_]*$`）でなくとも警告しない。`endpoint_env: "http://example.com"` のような値も schema string として通る | repro: schemas/genai.recipe.schema.json:140 の `endpoint_env` は単なる string 型 | impact: low

### GAP-DOC — テンプレ・ガイドの薄さ

- **[GAP-DOC-1]** `genai new` の scaffold が単一の `request: markdown` 入力だけ。table/persona/files/multi_select/json などの実例を含まないため、recipe 作成時に schema 仕様を都度読みにいくコスト | repro: `node packages/cli/dist/index.js new sample-skill` で生成された `genai.recipe.yml` は inputs が 1 個 | impact: low（v0.3 で外部 templates 化されるため、本フェーズでは触らない方針 — `tasks/decision_log.md` D-008）

## カテゴリ集計

| カテゴリ | 件数 |
|---|---|
| GAP-COMPILE | 3 |
| GAP-SCHEMA | 3 |
| GAP-EVAL-NO-RUN | 1 |
| GAP-EVAL-EMPTY | 2 |
| GAP-MODE | 3 |
| GAP-CONTEXT | 1 |
| GAP-SECURITY-MISS | 3 |
| GAP-DOC | 1 |
| **合計** | **17** |

完了条件: 5 件以上、3 カテゴリ以上 → **17 件、8 カテゴリで充足**。

## 段階B への入力（優先度順）

1. **(B) Eval 汎用化**: GAP-EVAL-NO-RUN-1 / GAP-EVAL-EMPTY-1 が high。qualitative の実走（必要最低限の文字列マッチ実装＋ QualScorer IF 切り出し）と contract.ts の artifact JSON Schema 検証が不可欠
2. **(A) Recipe スキーマ拡張**: GAP-COMPILE-1（select の options→enum 翻訳バグ）は **本フェーズで先に修正**。GAP-SCHEMA 系は table/persona/longform_ref を拡張
3. **(B) GAP-CONTEXT-1**: `references/_shared/rubrics/` 共有資産化
4. **(C) 実行モード拡張**: GAP-MODE-1（local-rag の SKILL.md 反映）、GAP-SECURITY-MISS 系（GFC108/207/401）、`security.pii` enum 追加
