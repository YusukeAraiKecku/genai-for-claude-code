import { existsSync, readFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { StringMatchScorer } from './scorers/index.js';
import type { EvalCase, EvalFinding } from './types.js';

/**
 * Qualitative eval layer.
 *
 * v0.2.x: Uses StringMatchScorer to check must_include / must_not_include against
 * a golden output file in tests/golden/<fixture-basename>.
 * When no golden file exists, the case emits a warn (not pass) so gaps surface.
 *
 * v0.3+: Replace StringMatchScorer with an LLM-based scorer implementing QualScorer.
 */
export function qualitativeChecks(skillDir: string, evalCases: EvalCase[]): EvalFinding[] {
  const findings: EvalFinding[] = [];
  const scorer = new StringMatchScorer();

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

    const fixtureText = readFileSync(fixturePath, 'utf8');
    if (fixtureText.trim().length === 0) {
      findings.push({
        layer: 'qualitative',
        caseId: c.id,
        status: 'fail',
        message: `fixture is empty: ${c.fixture}`,
      });
      continue;
    }

    // Resolve golden file: tests/golden/<fixture-basename>
    const goldenPath = join(skillDir, 'tests', 'golden', basename(fixturePath));
    const golden = existsSync(goldenPath) ? readFileSync(goldenPath, 'utf8') : undefined;

    // Run string-match scoring
    const results = scorer.score({
      golden,
      mustInclude: c.must_include ?? [],
      mustNotInclude: c.must_not_include ?? [],
    });

    for (const r of results) {
      findings.push({
        layer: 'qualitative',
        caseId: c.id,
        status: r.pass ? 'pass' : golden === undefined ? 'warn' : 'fail',
        message: r.message,
      });
    }

    // Validate empty must_include entries
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

    // Artifact path safety
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

  if (evalCases.length === 0) {
    findings.push({
      layer: 'qualitative',
      status: 'warn',
      message: 'no eval cases declared in eval.yml — add at least one case with must_include',
    });
  }

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
