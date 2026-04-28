import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { stringify as yamlStringify } from 'yaml';
import { loadRecipe } from '../recipe/load.js';
import { normalizeRecipe } from '../recipe/normalize.js';
import type { Recipe } from '../recipe/types.js';
import { type SafetyIssue, hasBlockers, runSafetyChecks } from '../security/check.js';
import { generateInputSchema } from './inputSchema.js';
import { generateSkillReadme } from './readme.js';
import { generateSkillMd } from './skillMd.js';

export interface CompileOptions {
  outDir: string;
  /** Treat warnings as errors (CI mode). */
  strict?: boolean;
}

export interface CompileResult {
  outDir: string;
  recipe: Recipe;
  files: string[];
  issues: SafetyIssue[];
}

export class CompileError extends Error {
  public issues: SafetyIssue[];
  constructor(message: string, issues: SafetyIssue[]) {
    super(message);
    this.name = 'CompileError';
    this.issues = issues;
  }
}

export function compile(recipePath: string, opts: CompileOptions): CompileResult {
  const { recipe: raw, recipeDir } = loadRecipe(recipePath);
  const recipe = normalizeRecipe(raw);

  const issues = runSafetyChecks(recipe);
  if (hasBlockers(issues)) {
    throw new CompileError('safety check failed', issues);
  }
  if (opts.strict && issues.length > 0) {
    throw new CompileError('strict mode: warnings present', issues);
  }

  const outDir = resolve(opts.outDir);
  ensureDir(outDir);
  const files: string[] = [];

  // SKILL.md
  const skillPath = join(outDir, 'SKILL.md');
  writeFileSync(skillPath, generateSkillMd(recipe), 'utf8');
  files.push(skillPath);

  // input.schema.json
  const schemaPath = join(outDir, 'input.schema.json');
  writeFileSync(schemaPath, `${JSON.stringify(generateInputSchema(recipe), null, 2)}\n`, 'utf8');
  files.push(schemaPath);

  // README.md
  const readmePath = join(outDir, 'README.md');
  writeFileSync(readmePath, generateSkillReadme(recipe), 'utf8');
  files.push(readmePath);

  // genai.recipe.yml (canonical normalized copy for traceability)
  const recipeOutPath = join(outDir, 'genai.recipe.yml');
  writeFileSync(recipeOutPath, yamlStringify(recipe), 'utf8');
  files.push(recipeOutPath);

  // copy local_context references / templates
  const refs = recipe.local_context?.references ?? [];
  const tmpls = recipe.local_context?.templates ?? [];

  for (const list of [refs, tmpls]) {
    for (const item of list) {
      const itemPath = typeof item === 'string' ? item : item.path;
      const src = resolve(recipeDir, itemPath);
      if (!existsSync(src)) continue;
      const rel = relative(recipeDir, src);
      // Flatten paths that escape the recipe dir (e.g. ../../references/_shared/...)
      // to prevent path traversal in the output bundle.
      const safeRel = flattenEscapingPath(rel);
      const dst = join(outDir, safeRel);
      ensureDir(dirname(dst));
      copyFileSync(src, dst);
      files.push(dst);
    }
  }

  // copy tests/ directory verbatim if present
  const testsSrc = join(recipeDir, 'tests');
  if (existsSync(testsSrc) && statSync(testsSrc).isDirectory()) {
    const dst = join(outDir, 'tests');
    copyDir(testsSrc, dst);
    files.push(dst);
  }

  // copy eval.yml if present
  const evalSrc = join(recipeDir, 'eval.yml');
  if (existsSync(evalSrc)) {
    const dst = join(outDir, 'eval.yml');
    copyFileSync(evalSrc, dst);
    files.push(dst);
  }

  return { outDir, recipe, files, issues };
}

function ensureDir(p: string): void {
  mkdirSync(p, { recursive: true });
}

/**
 * Strip leading `../` segments so references that escape the recipe directory
 * (e.g. `../../references/_shared/rubrics/foo.md`) are placed directly inside
 * the output bundle without path traversal.
 * Example: `../../references/_shared/rubrics/foo.md` → `_shared/rubrics/foo.md`
 */
function flattenEscapingPath(rel: string): string {
  const parts = rel.split('/');
  while (parts.length > 0 && parts[0] === '..') {
    parts.shift();
  }
  return parts.join('/') || 'unknown';
}

function copyDir(src: string, dst: string): void {
  ensureDir(dst);
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const s = join(src, entry.name);
    const d = join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else if (entry.isFile()) {
      copyFileSync(s, d);
    }
  }
}
