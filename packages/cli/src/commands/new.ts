import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import kleur from 'kleur';

const KEBAB = /^[a-z][a-z0-9-]*[a-z0-9]$/;

export function newCommand(skillId: string): void {
  if (!KEBAB.test(skillId)) {
    console.error(kleur.red('✗'), `skill id must be kebab-case: "${skillId}"`);
    process.exit(1);
  }

  const root = join(process.cwd(), 'genai-apps', skillId);
  if (existsSync(root)) {
    console.error(kleur.red('✗'), `directory already exists: ${root}`);
    process.exit(1);
  }

  for (const d of ['', 'references', 'templates', 'tests/fixtures', 'tests/golden']) {
    mkdirSync(join(root, d), { recursive: true });
  }

  const recipe = `id: ${skillId}
name: ${toTitle(skillId)}
version: 0.1.0
description: 「${toTitle(skillId)}」が何をするかを30文字以上で具体的に書く。Claudeはこれを見て自動起動を判断する。

tags:
  - ${skillId}

origin:
  type: original
  source_code_copied: false

execution:
  default_mode: claude-local
  allowed_modes:
    - claude-local
    - local-file
  remote_api_required: false

inputs:
  request:
    type: markdown
    title: 依頼内容
    required: true
    min_length: 5

local_context:
  references: []
  templates: []

outputs:
  primary: markdown
  artifacts: []

quality:
  rules:
    - separate_facts_assumptions_opinions
    - list_open_questions
  eval:
    fixture_dir: ./tests/fixtures
    golden_dir: ./tests/golden

security:
  network: deny-by-default
  secrets: forbid-hardcoded
  side_effects: read-only-by-default
  allowed_tools:
    - Read
    - Grep
    - Glob

claude:
  skill_name: ${skillId}
  auto_invocation: true
`;
  writeFileSync(join(root, 'genai.recipe.yml'), recipe, 'utf8');

  writeFileSync(
    join(root, 'README.md'),
    `# ${toTitle(skillId)}\n\nGenai recipe skeleton. Edit \`genai.recipe.yml\` then run:\n\n\`\`\`bash\ngenai compile --recipe genai-apps/${skillId}\ngenai validate .claude/skills/${skillId}\n\`\`\`\n`,
    'utf8',
  );

  writeFileSync(
    join(root, 'eval.yml'),
    `skill: ${skillId}
version: 0.1.0
cases: []
`,
    'utf8',
  );

  writeFileSync(
    join(root, 'tests/fixtures/sample.input.md'),
    `# Sample input\n\n(replace with realistic example for ${skillId})\n`,
    'utf8',
  );

  console.log(kleur.green('✓'), `created genai-apps/${skillId}/`);
  console.log('  next:', kleur.cyan(`genai compile --recipe genai-apps/${skillId}`));
}

function toTitle(id: string): string {
  return id
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}
