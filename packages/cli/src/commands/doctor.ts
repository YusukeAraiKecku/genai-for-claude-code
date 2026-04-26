import { existsSync } from 'node:fs';
import { join } from 'node:path';
import kleur from 'kleur';

export function doctorCommand(): void {
  const cwd = process.cwd();
  const checks: Array<[string, () => boolean | string]> = [
    [
      'Node 22+',
      () => {
        const v = process.versions.node;
        const major = Number.parseInt(v.split('.')[0] ?? '0', 10);
        return major >= 22 ? `node ${v}` : false;
      },
    ],
    ['package.json', () => existsSync(join(cwd, 'package.json'))],
    ['.claude/skills', () => existsSync(join(cwd, '.claude/skills'))],
    ['.genai', () => existsSync(join(cwd, '.genai'))],
    [
      'recipe schema',
      () =>
        existsSync(join(cwd, 'schemas/genai.recipe.schema.json'))
          ? 'schemas/genai.recipe.schema.json'
          : 'using bundled schema',
    ],
  ];

  let bad = 0;
  for (const [label, fn] of checks) {
    const r = fn();
    if (r === false) {
      console.log(kleur.red('✗'), label);
      bad++;
    } else if (r === true) {
      console.log(kleur.green('✓'), label);
    } else {
      console.log(kleur.green('✓'), label, kleur.gray(`(${r})`));
    }
  }

  if (bad > 0) {
    console.error(kleur.red('✗'), `${bad} check(s) failed`);
    process.exit(3);
  }
  console.log(kleur.green('✓'), 'doctor ok');
}
