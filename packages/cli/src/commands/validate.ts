import { existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { evaluate, loadRecipe, normalizeRecipe, runSafetyChecks } from '@genai/core';
import kleur from 'kleur';

export function validateCommand(target: string): void {
  const abs = resolve(target);
  if (!existsSync(abs)) {
    console.error(kleur.red('✗'), `path not found: ${target}`);
    process.exit(1);
  }

  // Recipe-only validation (file or dir containing recipe)
  const recipePath = pickRecipePath(abs);
  if (recipePath && !isCompiledSkillDir(abs)) {
    validateRecipe(recipePath);
    return;
  }

  // Compiled skill bundle validation
  validateSkillDir(abs);
}

function pickRecipePath(p: string): string | null {
  if (statSync(p).isFile() && p.endsWith('.yml')) return p;
  if (statSync(p).isDirectory()) {
    const inside = join(p, 'genai.recipe.yml');
    if (existsSync(inside)) return inside;
  }
  return null;
}

function isCompiledSkillDir(p: string): boolean {
  return (
    statSync(p).isDirectory() &&
    existsSync(join(p, 'SKILL.md')) &&
    existsSync(join(p, 'input.schema.json'))
  );
}

function validateRecipe(recipePath: string): void {
  try {
    const { recipe: raw } = loadRecipe(recipePath);
    const recipe = normalizeRecipe(raw);
    const issues = runSafetyChecks(recipe);
    let blocked = false;
    for (const i of issues) {
      const tag =
        i.severity === 'block'
          ? kleur.red('✗ block')
          : i.severity === 'warn'
            ? kleur.yellow('⚠ warn ')
            : kleur.cyan('• note ');
      console.log(`  ${tag} [${i.code}] ${i.message}`);
      if (i.severity === 'block') blocked = true;
    }
    if (blocked) {
      console.error(kleur.red('✗'), 'recipe has blockers');
      process.exit(2);
    }
    console.log(kleur.green('✓'), `recipe valid: ${recipe.id}`);
  } catch (e) {
    console.error(kleur.red('✗'), e instanceof Error ? e.message : String(e));
    process.exit(1);
  }
}

function validateSkillDir(skillDir: string): void {
  const report = evaluate(skillDir);
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
    console.error(kleur.red('✗'), 'skill validation failed');
    process.exit(1);
  }
  console.log(kleur.green('✓'), `skill bundle ok: ${skillDir}`);
}
