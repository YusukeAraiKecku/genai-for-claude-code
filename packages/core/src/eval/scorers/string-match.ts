export interface QualResult {
  type: 'must_include' | 'must_not_include' | 'general';
  keyword?: string;
  pass: boolean;
  message: string;
}

export interface QualScorer {
  score(opts: {
    golden: string | undefined;
    mustInclude: string[];
    mustNotInclude: string[];
  }): QualResult[];
}

/**
 * Checks must_include / must_not_include keywords against a golden output file.
 * When no golden file exists, emits a warn result so the case does not silently pass.
 * v0.3+ will replace this with an LLM-based scorer implementing the same interface.
 */
export class StringMatchScorer implements QualScorer {
  score({
    golden,
    mustInclude,
    mustNotInclude,
  }: {
    golden: string | undefined;
    mustInclude: string[];
    mustNotInclude: string[];
  }): QualResult[] {
    if (golden === undefined) {
      return [
        {
          type: 'general',
          pass: false,
          message:
            'no golden file found — create tests/golden/<fixture-name> to enable string matching',
        },
      ];
    }

    const results: QualResult[] = [];

    for (const kw of mustInclude) {
      const found = golden.includes(kw);
      results.push({
        type: 'must_include',
        keyword: kw,
        pass: found,
        message: found ? `found: "${kw}"` : `missing required string: "${kw}"`,
      });
    }

    for (const kw of mustNotInclude) {
      const found = golden.includes(kw);
      results.push({
        type: 'must_not_include',
        keyword: kw,
        pass: !found,
        message: found ? `prohibited string found: "${kw}"` : `not present (ok): "${kw}"`,
      });
    }

    return results;
  }
}
