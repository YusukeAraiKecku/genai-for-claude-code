import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { EvalFinding } from './types.js';

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---/;

export function staticChecks(skillDir: string): EvalFinding[] {
  const findings: EvalFinding[] = [];

  const required = ['SKILL.md', 'input.schema.json', 'README.md', 'genai.recipe.yml'];
  for (const f of required) {
    const p = join(skillDir, f);
    if (!existsSync(p)) {
      findings.push({ layer: 'static', status: 'fail', message: `missing required file: ${f}` });
    } else {
      findings.push({ layer: 'static', status: 'pass', message: `found ${f}` });
    }
  }

  // SKILL.md frontmatter
  const skillMdPath = join(skillDir, 'SKILL.md');
  if (existsSync(skillMdPath)) {
    const text = readFileSync(skillMdPath, 'utf8');
    const m = FRONTMATTER_RE.exec(text);
    if (!m || !m[1]) {
      findings.push({ layer: 'static', status: 'fail', message: 'SKILL.md has no frontmatter' });
    } else {
      const fm = m[1];
      if (!/^name:\s*\S/m.test(fm)) {
        findings.push({
          layer: 'static',
          status: 'fail',
          message: 'SKILL.md frontmatter missing name',
        });
      }
      if (!/^description:\s*\S/m.test(fm)) {
        findings.push({
          layer: 'static',
          status: 'fail',
          message: 'SKILL.md frontmatter missing description',
        });
      } else {
        const descLine = fm.split(/\r?\n/).find((l) => l.startsWith('description:'));
        if (descLine && descLine.length < 30) {
          findings.push({
            layer: 'static',
            status: 'warn',
            message: 'SKILL.md description is short — Claude needs detail to auto-invoke',
          });
        }
      }
      // Bash(*) check in allowed-tools
      if (/Bash\(\*\)/.test(fm)) {
        findings.push({
          layer: 'static',
          status: 'fail',
          message: 'SKILL.md allowed-tools contains Bash(*)',
        });
      }
    }
  }

  return findings;
}
