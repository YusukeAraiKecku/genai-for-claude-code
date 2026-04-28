import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
process.chdir(repoRoot);

console.log('== Verify started ==');

function runNode(args, label) {
  if (label) console.log(`-- ${label} --`);
  const r = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`node ${args.join(' ')} failed (exit ${r.status})`);
    process.exit(r.status ?? 1);
  }
}

const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function npmRunIfPresent(scriptName) {
  const r = spawnSync(npmBin, ['run', scriptName, '--if-present'], {
    stdio: 'inherit',
  });
  if (r.status !== 0) {
    console.error(`npm run ${scriptName} failed (exit ${r.status})`);
    process.exit(r.status ?? 1);
  }
}

if (existsSync(join(repoRoot, 'package.json'))) {
  console.log('== Node project detected ==');
  console.log('-- typecheck --');
  npmRunIfPresent('typecheck');
  console.log('-- lint --');
  npmRunIfPresent('lint');
  console.log('-- build --');
  npmRunIfPresent('build');
  console.log('-- unit tests --');
  npmRunIfPresent('test');
} else {
  console.log('No package.json found. Bootstrap not complete; skipping Node gates.');
}

const cliEntry = join(repoRoot, 'packages', 'cli', 'dist', 'index.js');

const tempDirs = [];
function cleanup() {
  for (const d of tempDirs) {
    try {
      rmSync(d, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(130);
});

if (existsSync(cliEntry)) {
  const examples = [
    'proposal-review',
    'contract-review-lite',
    'meeting-to-actions',
    'payroll-monthly-review',
    'vendor-contract-redline',
  ];
  for (const ex of examples) {
    const recipe = join('examples', ex, 'genai.recipe.yml');
    if (!existsSync(join(repoRoot, recipe))) continue;
    const out = mkdtempSync(join(tmpdir(), `genai-verify-${ex}-`));
    tempDirs.push(out);
    runNode([cliEntry, 'compile', '--recipe', recipe, '--out', out], `compile example: ${ex}`);
    if (!existsSync(join(out, 'SKILL.md'))) {
      console.error(`SKILL.md missing in ${out}`);
      process.exit(1);
    }
    if (!existsSync(join(out, 'input.schema.json'))) {
      console.error(`input.schema.json missing in ${out}`);
      process.exit(1);
    }
    runNode([cliEntry, 'validate', out], `validate example: ${ex}`);
    runNode([cliEntry, 'test', out], `test example: ${ex}`);
  }
} else {
  console.log('CLI not built yet; skipping smoke compile.');
}

console.log('== Verify passed ==');
