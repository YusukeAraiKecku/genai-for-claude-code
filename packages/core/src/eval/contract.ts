import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { Recipe } from '../recipe/types.js';
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

  // Validate artifact JSON files that exist inside the skill bundle
  const recipePath = join(skillDir, 'genai.recipe.yml');
  if (existsSync(recipePath)) {
    let recipe: Recipe | undefined;
    try {
      recipe = parseYaml(readFileSync(recipePath, 'utf8')) as Recipe;
    } catch {
      // recipe parse failure is already caught elsewhere; skip artifact check
    }

    if (recipe) {
      for (const artifact of recipe.outputs?.artifacts ?? []) {
        if (artifact.format !== 'json') continue;
        const artifactPath = join(skillDir, artifact.path);
        if (!existsSync(artifactPath)) continue;
        try {
          JSON.parse(readFileSync(artifactPath, 'utf8'));
          findings.push({
            layer: 'contract',
            status: 'pass',
            message: `artifact JSON is valid: ${artifact.path}`,
          });
        } catch (e) {
          findings.push({
            layer: 'contract',
            status: 'fail',
            message: `artifact JSON is not valid JSON: ${artifact.path} — ${(e as Error).message}`,
          });
        }
      }
    }
  }

  return findings;
}
