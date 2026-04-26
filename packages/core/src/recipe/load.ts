import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ValidateFunction } from 'ajv';
import * as ajvFormats from 'ajv-formats';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { parse as parseYaml } from 'yaml';
import type { Recipe } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

let cachedValidate: ValidateFunction | null = null;

function getValidator(): ValidateFunction {
  if (cachedValidate) return cachedValidate;
  const schemaPath = resolveSchemaPath();
  const schema = JSON.parse(readFileSync(schemaPath, 'utf8')) as object;
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  (ajvFormats.default as unknown as (a: Ajv2020) => void)(ajv);
  cachedValidate = ajv.compile(schema);
  return cachedValidate;
}

function resolveSchemaPath(): string {
  const candidates = [
    resolve(__dirname, '../../../../schemas/genai.recipe.schema.json'),
    resolve(__dirname, '../../../schemas/genai.recipe.schema.json'),
    resolve(process.cwd(), 'schemas/genai.recipe.schema.json'),
  ];
  for (const c of candidates) {
    try {
      readFileSync(c, 'utf8');
      return c;
    } catch (_) {
      // try next
    }
  }
  throw new Error('Could not locate genai.recipe.schema.json');
}

export interface LoadResult {
  recipe: Recipe;
  recipePath: string;
  recipeDir: string;
}

export function loadRecipe(recipePath: string): LoadResult {
  const absPath = resolve(recipePath);
  const text = readFileSync(absPath, 'utf8');
  const data = parseYaml(text);
  const validate = getValidator();
  if (!validate(data)) {
    const errs = (validate.errors ?? [])
      .map((e) => `  - ${e.instancePath || '/'} ${e.message ?? ''}`)
      .join('\n');
    throw new Error(`[GFC001] Recipe schema validation failed:\n${errs}`);
  }
  return {
    recipe: data as unknown as Recipe,
    recipePath: absPath,
    recipeDir: dirname(absPath),
  };
}
