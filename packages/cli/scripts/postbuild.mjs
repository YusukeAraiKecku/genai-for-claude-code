import { chmodSync } from 'node:fs';

try {
  chmodSync(new URL('../dist/index.js', import.meta.url), 0o755);
} catch (err) {
  if (err?.code !== 'EPERM' && err?.code !== 'ENOENT') {
    console.warn('[postbuild] chmod skipped:', err.message);
  }
}
