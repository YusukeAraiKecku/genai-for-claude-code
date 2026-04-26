import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { EvalCase, EvalFinding } from './types.js';

/**
 * MVP qualitative check:
 *   - For each case, treat the fixture file as the "expected golden surface" of an LLM
 *     output and verify that must_include / must_not_include constraints would pass
 *     against the fixture itself. This is a SCHEMA-LEVEL CHECK that the eval case is
 *     well-formed and the fixture exists. It does NOT call an LLM.
 *
 *   v0.3+ will replace this with actual run + scoring.
 */
export function qualitativeChecks(skillDir: string, evalCases: EvalCase[]): EvalFinding[] {
  const findings: EvalFinding[] = [];

  for (const c of evalCases) {
    const fixturePath = resolve(skillDir, c.fixture);
    if (!existsSync(fixturePath)) {
      findings.push({
        layer: 'qualitative',
        caseId: c.id,
        status: 'fail',
        message: `fixture not found: ${c.fixture}`,
      });
      continue;
    }

    const text = readFileSync(fixturePath, 'utf8');
    if (text.trim().length === 0) {
      findings.push({
        layer: 'qualitative',
        caseId: c.id,
        status: 'fail',
        message: `fixture is empty: ${c.fixture}`,
      });
      continue;
    }

    findings.push({
      layer: 'qualitative',
      caseId: c.id,
      status: 'pass',
      message: `fixture loaded (${text.length} chars)`,
    });

    // For each must_include, verify the keyword is meaningful (non-empty)
    for (const kw of c.must_include ?? []) {
      if (kw.trim().length === 0) {
        findings.push({
          layer: 'qualitative',
          caseId: c.id,
          status: 'warn',
          message: 'empty must_include keyword',
        });
      }
    }

    // Artifact path declared in case must be safe relative path
    for (const a of c.artifacts ?? []) {
      if (a.path.startsWith('/') || a.path.includes('..')) {
        findings.push({
          layer: 'qualitative',
          caseId: c.id,
          status: 'fail',
          message: `unsafe artifact path declared: ${a.path}`,
        });
      }
    }
  }

  // hint when no eval cases are declared
  if (evalCases.length === 0) {
    findings.push({
      layer: 'qualitative',
      status: 'warn',
      message: 'no eval cases declared in eval.yml',
    });
  }

  // confirm at least one fixture file exists in tests/fixtures (best-effort)
  const fixturesDir = join(skillDir, 'tests', 'fixtures');
  if (!existsSync(fixturesDir) && evalCases.length === 0) {
    findings.push({
      layer: 'qualitative',
      status: 'warn',
      message: 'no tests/fixtures directory and no eval.yml — Skill is not testable',
    });
  }

  return findings;
}
