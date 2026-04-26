import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { contractChecks } from './contract.js';
import { qualitativeChecks } from './qualitative.js';
import { staticChecks } from './static.js';
import type { EvalCase, EvalReport, EvalSpec } from './types.js';

export type { EvalCase, EvalReport, EvalSpec, EvalFinding, EvalLayer } from './types.js';

export function evaluate(skillDir: string): EvalReport {
  const findings = [...staticChecks(skillDir), ...contractChecks(skillDir)];

  const evalPath = join(skillDir, 'eval.yml');
  let cases: EvalCase[] = [];
  if (existsSync(evalPath)) {
    try {
      const spec = parseYaml(readFileSync(evalPath, 'utf8')) as EvalSpec;
      cases = spec?.cases ?? [];
    } catch (e) {
      findings.push({
        layer: 'qualitative',
        status: 'fail',
        message: `eval.yml could not be parsed: ${(e as Error).message}`,
      });
    }
  }
  findings.push(...qualitativeChecks(skillDir, cases));

  const pass = !findings.some((f) => f.status === 'fail');
  return { skillDir, findings, pass };
}
