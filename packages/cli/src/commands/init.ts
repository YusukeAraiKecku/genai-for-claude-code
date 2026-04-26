import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import kleur from 'kleur';

interface InitOpts {
  withHooks?: boolean;
  withExamples?: boolean;
}

export function initCommand(opts: InitOpts): void {
  const cwd = process.cwd();
  const dirs = ['.genai', '.genai/runs', '.genai/evals', '.claude/skills', '.claude/agents'];
  if (opts.withHooks) dirs.push('.claude/hooks');
  if (opts.withExamples) dirs.push('genai-apps');

  for (const d of dirs) {
    const p = join(cwd, d);
    if (!existsSync(p)) mkdirSync(p, { recursive: true });
  }

  const registry = join(cwd, '.genai', 'registry.yml');
  if (!existsSync(registry)) {
    writeFileSync(registry, 'skills: []\n', 'utf8');
  }

  const wctx = join(cwd, '.genai', 'working-context.md');
  if (!existsSync(wctx)) {
    writeFileSync(
      wctx,
      '# Working context\n\n(Genai will write decisions and next-actions here.)\n',
      'utf8',
    );
  }

  console.log(kleur.green('✓'), 'Genai initialized at', cwd);
  for (const d of dirs) console.log('  ', d);
}
