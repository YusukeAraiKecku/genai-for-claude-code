import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { EvalFinding } from './types.js';

export function contractChecks(skillDir: string): EvalFinding[] {
  const findings: EvalFinding[] = [];

  const schemaPath = join(skillDir, 'input.schema.json');
  if (!existsSync(schemaPath)) {
    return [{ layer: 'contract', status: 'fail', message: 'input.schema.json missing' }];
  }

  let schema: unknown;
  try {
    schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
  } catch (e) {
    return [
      {
        layer: 'contract',
        status: 'fail',
        message: `input.schema.json is not valid JSON: ${(e as Error).message}`,
      },
    ];
  }

  if (
    typeof schema !== 'object' ||
    schema === null ||
    (schema as { type?: unknown }).type !== 'object' ||
    typeof (schema as { properties?: unknown }).properties !== 'object'
  ) {
    findings.push({
      layer: 'contract',
      status: 'fail',
      message: 'input.schema.json must be a JSON Schema object with properties',
    });
  } else {
    findings.push({
      layer: 'contract',
      status: 'pass',
      message: 'input.schema.json is well-formed',
    });
  }

  return findings;
}
