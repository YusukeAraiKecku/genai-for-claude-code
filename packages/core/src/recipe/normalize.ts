import type { Recipe } from './types.js';

export function normalizeRecipe(recipe: Recipe): Recipe {
  const normalized: Recipe = JSON.parse(JSON.stringify(recipe));

  // ensure execution.allowed_modes contains default_mode
  const def = normalized.execution.default_mode;
  const allowed = normalized.execution.allowed_modes ?? [def];
  if (!allowed.includes(def)) {
    allowed.unshift(def);
  }
  normalized.execution.allowed_modes = allowed;

  // default security
  normalized.security = {
    network: 'deny-by-default',
    secrets: 'forbid-hardcoded',
    side_effects: 'read-only-by-default',
    allowed_tools: ['Read', 'Grep', 'Glob'],
    ...(normalized.security ?? {}),
  };

  // default claude block
  const skillName = normalized.claude?.skill_name ?? normalized.id;
  normalized.claude = {
    skill_name: skillName,
    auto_invocation: normalized.claude?.auto_invocation ?? true,
    allowed_tools: normalized.claude?.allowed_tools ??
      normalized.security.allowed_tools ?? ['Read', 'Grep', 'Glob'],
  };

  // tags fallback
  if (!normalized.tags || normalized.tags.length === 0) {
    normalized.tags = [normalized.id];
  }

  return normalized;
}
