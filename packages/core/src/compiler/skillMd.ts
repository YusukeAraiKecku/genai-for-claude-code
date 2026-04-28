import type { Recipe } from '../recipe/types.js';

const GENERATED_BEGIN = '<!-- BEGIN GENAI GENERATED -->';
const GENERATED_END = '<!-- END GENAI GENERATED -->';

export function generateSkillMd(recipe: Recipe): string {
  const tools = recipe.claude?.allowed_tools ??
    recipe.security?.allowed_tools ?? ['Read', 'Grep', 'Glob'];
  const toolsBlock = tools.map((t) => `  - ${t}`).join('\n');

  const inputsBlock = renderInputs(recipe);
  const outputsBlock = renderOutputs(recipe);
  const qualityBlock = renderQuality(recipe);
  const safetyBlock = renderSafety(recipe);
  const whenToUse = renderWhenToUse(recipe);

  return `---
name: ${recipe.claude?.skill_name ?? recipe.id}
description: ${escapeFrontmatter(recipe.description)}
allowed-tools:
${toolsBlock}
---

${GENERATED_BEGIN}

# ${recipe.name}

## Purpose

${recipe.description}

## When to use

${whenToUse}

## Inputs

${inputsBlock}

## Process

1. ユーザーの依頼を確認する
2. 入力不足があれば、不足項目だけを聞き返す
3. 必要に応じて参照ファイルを読む${recipe.execution.default_mode === 'local-rag' ? '\n   - `index: true` が付いた references は RAG インデックス対象として優先的に参照する\n   - 回答には必ず引用元 (ファイル名:行番号) を記載する' : ''}
4. 実行モード (\`${recipe.execution.default_mode}\`) に従って処理する
5. 出力契約に沿って回答する
6. 必要なartifactを生成する

## Output contract

${outputsBlock}

## Quality rules

${qualityBlock}

## Safety rules

${safetyBlock}

## Failure handling

- 入力不足の場合は、不足項目を明示する
- 参照ファイルがない場合は、その前提を明記する
- 外部APIが必要そうでも、まずローカルで可能か検討する
- 不確かな情報は断定しない

${GENERATED_END}
`;
}

function escapeFrontmatter(s: string): string {
  // YAML-safe single-line description
  return s.replace(/\n+/g, ' ').replace(/"/g, '\\"');
}

function renderInputs(recipe: Recipe): string {
  const lines: string[] = [];
  for (const [key, field] of Object.entries(recipe.inputs)) {
    const req = field.required ? '**required**' : 'optional';
    const title = field.title ?? key;
    let extra = '';
    if (field.items) {
      extra = ` (choices: ${field.items.map((i) => i.value).join(', ')})`;
    } else if (field.options && field.options.length > 0) {
      extra = ` (choices: ${field.options.join(', ')})`;
    } else if (field.type === 'table' && field.columns && field.columns.length > 0) {
      extra = ` (columns: ${field.columns.map((c) => c.name).join(', ')})`;
    }
    lines.push(`- \`${key}\` — ${title} — ${field.type}${extra} — ${req}`);
  }
  return lines.join('\n');
}

function renderOutputs(recipe: Recipe): string {
  const lines: string[] = [`Primary output: \`${recipe.outputs.primary}\``];
  if (recipe.outputs.artifacts && recipe.outputs.artifacts.length > 0) {
    lines.push('');
    lines.push('Artifacts (生成した場合は回答内でファイルパスを明示する):');
    for (const a of recipe.outputs.artifacts) {
      lines.push(
        `- \`${a.path}\` — ${a.required ? 'required' : 'optional'}${a.description ? ` — ${a.description}` : ''}`,
      );
    }
  }
  return lines.join('\n');
}

function renderQuality(recipe: Recipe): string {
  const rules = recipe.quality?.rules ?? [];
  if (rules.length === 0) return '- (品質ルールはまだ定義されていません)';
  return rules.map((r) => `- ${r.replace(/_/g, ' ')}`).join('\n');
}

function renderSafety(recipe: Recipe): string {
  const sec = recipe.security;
  const lines = [
    `- network: ${sec?.network ?? 'deny-by-default'}`,
    `- secrets: ${sec?.secrets ?? 'forbid-hardcoded'}`,
    `- side effects: ${sec?.side_effects ?? 'read-only-by-default'}`,
  ];
  if (recipe.execution.default_mode === 'remote-api') {
    lines.push('- remote API: opt-in only, requires explicit user confirmation per call');
  }
  return lines.join('\n');
}

function renderWhenToUse(recipe: Recipe): string {
  const tags = recipe.tags ?? [];
  const tagPart = tags.length > 0 ? ` 関連タグ: ${tags.join(', ')}` : '';
  return `- ${recipe.description}${tagPart}`;
}
