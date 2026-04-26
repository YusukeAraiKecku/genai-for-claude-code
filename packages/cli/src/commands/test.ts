import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { evaluate } from '@genai/core';
import kleur from 'kleur';

export function testCommand(skillDir: string): void {
  const abs = resolve(skillDir);
  if (!existsSync(abs)) {
    console.error(kleur.red('✗'), `skill directory not found: ${skillDir}`);
    process.exit(1);
  }

  const report = evaluate(abs);
  let fail = false;
  for (const f of report.findings) {
    const tag =
      f.status === 'fail'
        ? kleur.red('✗ fail ')
        : f.status === 'warn'
          ? kleur.yellow('⚠ warn ')
          : kleur.green('✓ pass ');
    const layer = `[${f.layer}${f.caseId ? `:${f.caseId}` : ''}]`;
    console.log(`  ${tag} ${layer} ${f.message}`);
    if (f.status === 'fail') fail = true;
  }
  if (fail) {
    console.error(kleur.red('✗'), 'eval failed');
    process.exit(5);
  }
  console.log(kleur.green('✓'), 'eval ok');
}
