import type { Recipe } from '../recipe/types.js';

export type SafetySeverity = 'block' | 'warn' | 'note';

export interface SafetyIssue {
  code: string;
  severity: SafetySeverity;
  message: string;
}

const FORBIDDEN_BASH_PATTERNS: Array<{ pattern: RegExp; code: string; message: string }> = [
  { pattern: /^Bash\(\*\)$/, code: 'GFC101', message: 'allowed-tools contains Bash(*) wildcard' },
  {
    pattern: /^Bash\(curl\b/i,
    code: 'GFC102',
    message: 'allowed-tools contains Bash(curl ...) — network egress not allowed',
  },
  {
    pattern: /^Bash\(rm\b/i,
    code: 'GFC103',
    message: 'allowed-tools contains Bash(rm ...) — destructive operation',
  },
  {
    pattern: /^Bash\(sudo\b/i,
    code: 'GFC104',
    message: 'allowed-tools contains Bash(sudo ...) — privilege escalation',
  },
  {
    pattern: /^Bash\(chmod\s+777/i,
    code: 'GFC105',
    message: 'allowed-tools contains chmod 777 — over-permissive',
  },
  {
    pattern: /^Bash\(wget\b/i,
    code: 'GFC108',
    message: 'allowed-tools contains Bash(wget ...) — network egress not allowed',
  },
];

// crude secret detector — looks for literal-looking keys in the recipe
const SECRET_KEY_PATTERN =
  /(?:api[_-]?key|secret|token|password|passwd|auth)\s*[:=]\s*['"]?([A-Za-z0-9_\-]{16,})/i;
const SECRET_FIELD_NAMES = new Set(['api_key', 'apikey', 'secret', 'token', 'password', 'passwd']);

export function runSafetyChecks(recipe: Recipe): SafetyIssue[] {
  const issues: SafetyIssue[] = [];
  const tools = recipe.claude?.allowed_tools ?? recipe.security?.allowed_tools ?? [];

  for (const t of tools) {
    for (const f of FORBIDDEN_BASH_PATTERNS) {
      if (f.pattern.test(t)) {
        issues.push({ code: f.code, severity: 'block', message: `${f.message} (tool: ${t})` });
      }
    }
  }

  // remote-api enabled by default without confirmation
  if (recipe.execution.default_mode === 'remote-api') {
    if (!recipe.security?.remote_api?.requires_user_confirmation) {
      issues.push({
        code: 'GFC201',
        severity: 'block',
        message:
          'default_mode is remote-api but security.remote_api.requires_user_confirmation is not true',
      });
    }
    if (!recipe.security?.remote_api?.api_key_env) {
      issues.push({
        code: 'GFC202',
        severity: 'block',
        message:
          'remote-api skill must declare security.remote_api.api_key_env (no hardcoded keys)',
      });
    }
  }

  // crude hardcoded-secret detection across the recipe
  const json = JSON.stringify(recipe);
  if (SECRET_KEY_PATTERN.test(json)) {
    issues.push({
      code: 'GFC203',
      severity: 'block',
      message: 'recipe appears to contain a hardcoded secret-like value',
    });
  }
  for (const k of Object.keys(recipe.inputs)) {
    if (SECRET_FIELD_NAMES.has(k.toLowerCase())) {
      issues.push({
        code: 'GFC204',
        severity: 'warn',
        message: `input field "${k}" looks like a secret — prefer security.remote_api.api_key_env reference`,
      });
    }
  }

  // remote-api endpoint_env naming convention
  const endpointEnv = recipe.security?.remote_api?.endpoint_env;
  if (endpointEnv && !/^[A-Z_][A-Z0-9_]*$/.test(endpointEnv)) {
    issues.push({
      code: 'GFC207',
      severity: 'warn',
      message: `security.remote_api.endpoint_env "${endpointEnv}" is not a valid env-var name (expected ^[A-Z_][A-Z0-9_]*$)`,
    });
  }

  // mcp mode without MCP tool declarations
  if (recipe.execution.default_mode === 'mcp') {
    const hasMcpTool = tools.some((t) => /^mcp__/i.test(t));
    if (!hasMcpTool) {
      issues.push({
        code: 'GFC206',
        severity: 'warn',
        message: 'default_mode is mcp but no mcp__ tools are listed in allowed_tools',
      });
    }
  }

  // network policy
  if (
    recipe.security?.network === 'explicit-allow' &&
    recipe.execution.default_mode !== 'remote-api' &&
    recipe.execution.default_mode !== 'mcp'
  ) {
    issues.push({
      code: 'GFC205',
      severity: 'warn',
      message:
        'security.network is explicit-allow but execution mode is local — keep network deny-by-default',
    });
  }

  // description quality
  if (recipe.description.length < 30) {
    issues.push({
      code: 'GFC301',
      severity: 'warn',
      message: 'description is short — Claude needs specifics to auto-invoke this Skill',
    });
  }

  // artifact path safety
  for (const a of recipe.outputs.artifacts ?? []) {
    if (a.path.includes('..') || a.path.startsWith('/') || a.path.startsWith('~')) {
      issues.push({
        code: 'GFC302',
        severity: 'block',
        message: `artifact path is unsafe: "${a.path}"`,
      });
    }
  }

  // PII field detection — warn if field names suggest personal data without a pii policy
  const PII_FIELD_PATTERN =
    /address|dob|phone|email|national[_-]?id|tax[_-]?id|ssn|mynumber|passport/i;
  if (!recipe.security?.pii) {
    for (const k of Object.keys(recipe.inputs)) {
      if (PII_FIELD_PATTERN.test(k)) {
        issues.push({
          code: 'GFC401',
          severity: 'warn',
          message: `input field "${k}" may contain personal data — declare security.pii (forbid | masked-only | declared)`,
        });
      }
    }
  }

  return issues;
}

export function hasBlockers(issues: SafetyIssue[]): boolean {
  return issues.some((i) => i.severity === 'block');
}
