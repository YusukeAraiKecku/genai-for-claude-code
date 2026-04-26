import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { CompileError, type SafetyIssue, compile } from '@genai/core';
import kleur from 'kleur';

interface CompileOpts {
  recipe?: string;
  out?: string;
  strict?: boolean;
}

export function compileCommand(opts: CompileOpts): void {
  const recipePath = resolveRecipePath(opts.recipe);
  if (!recipePath) {
    console.error(
      kleur.red('✗'),
      'pass --recipe <path-to-genai.recipe.yml> or run from a directory containing one',
    );
    process.exit(4);
  }

  // Determine outDir
  let outDir = opts.out;
  if (!outDir) {
    // Try to peek at the recipe id from path heuristic — load actually parses it
    outDir = join(process.cwd(), '.claude', 'skills');
  }

  try {
    const result = compile(recipePath, {
      outDir: finalOutDir(outDir, recipePath),
      strict: !!opts.strict,
    });
    printIssues(result.issues);
    console.log(kleur.green('✓'), `compiled: ${result.recipe.id}`);
    console.log('  out:', result.outDir);
    for (const f of result.files) console.log('  ', f);
  } catch (e) {
    if (e instanceof CompileError) {
      printIssues(e.issues);
      console.error(kleur.red('✗'), `compile failed: ${e.message}`);
      process.exit(2);
    }
    console.error(kleur.red('✗'), e instanceof Error ? e.message : String(e));
    process.exit(4);
  }
}

function resolveRecipePath(input?: string): string | null {
  const candidates = [input, join(process.cwd(), 'genai.recipe.yml')].filter(Boolean) as string[];
  for (const c of candidates) {
    const abs = resolve(c);
    if (!existsSync(abs)) continue;
    if (statSync(abs).isDirectory()) {
      const inside = join(abs, 'genai.recipe.yml');
      if (existsSync(inside)) return inside;
      continue;
    }
    return abs;
  }
  return null;
}

function finalOutDir(outDir: string, recipePath: string): string {
  // If outDir already looks like a per-skill dir, use as-is.
  // Otherwise append the recipe id by reading the file once.
  const lastSegment = outDir.split(/[\\/]/).pop() ?? '';
  if (lastSegment !== 'skills') return outDir;
  // Read recipe to get id
  const yaml = readFileSync(recipePath, 'utf8');
  const m = /^id:\s*([a-z][a-z0-9-]*[a-z0-9])\s*$/m.exec(yaml);
  const id = m?.[1] ?? 'unknown-skill';
  return join(outDir, id);
}

function printIssues(issues: SafetyIssue[]): void {
  for (const i of issues) {
    const tag =
      i.severity === 'block'
        ? kleur.red('✗ block')
        : i.severity === 'warn'
          ? kleur.yellow('⚠ warn ')
          : kleur.cyan('• note ');
    console.log(`  ${tag} [${i.code}] ${i.message}`);
  }
}
