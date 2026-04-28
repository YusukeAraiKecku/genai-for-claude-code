export interface EvalCase {
  id: string;
  fixture: string; // path to fixture file (relative to recipe dir)
  must_include?: string[];
  must_not_include?: string[];
  artifacts?: Array<{ name: string; path: string }>;
  /** Optional references to shared rubric files (relative to skill bundle root). */
  rubric_refs?: string[];
}

export interface EvalSpec {
  skill: string;
  version?: string;
  cases: EvalCase[];
}

export type EvalLayer = 'static' | 'contract' | 'qualitative';

export interface EvalFinding {
  layer: EvalLayer;
  caseId?: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
}

export interface EvalReport {
  skillDir: string;
  findings: EvalFinding[];
  pass: boolean;
}
