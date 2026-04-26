import type { InputField, Recipe } from '../recipe/types.js';

export interface JsonSchema {
  $schema: string;
  type: 'object';
  required: string[];
  properties: Record<string, unknown>;
  additionalProperties: false;
}

export function generateInputSchema(recipe: Recipe): JsonSchema {
  const required: string[] = [];
  const properties: Record<string, unknown> = {};

  for (const [key, field] of Object.entries(recipe.inputs)) {
    if (field.required) required.push(key);
    properties[key] = fieldToSchema(field);
  }

  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    required,
    properties,
    additionalProperties: false,
  };
}

function fieldToSchema(field: InputField): Record<string, unknown> {
  const base: Record<string, unknown> = {};
  if (field.title) base.title = field.title;
  if (field.description) base.description = field.description;
  if (field.default_value !== undefined) base.default = field.default_value;

  switch (field.type) {
    case 'text':
    case 'markdown': {
      const s: Record<string, unknown> = { ...base, type: 'string' };
      if (typeof field.min_length === 'number') s.minLength = field.min_length;
      if (typeof field.max_length === 'number') s.maxLength = field.max_length;
      return s;
    }
    case 'number':
      return { ...base, type: 'number' };
    case 'boolean':
      return { ...base, type: 'boolean' };
    case 'select': {
      const s: Record<string, unknown> = { ...base, type: 'string' };
      if (field.items) s.enum = field.items.map((i) => i.value);
      return s;
    }
    case 'multi_select': {
      const inner: Record<string, unknown> = { type: 'string' };
      if (field.items) inner.enum = field.items.map((i) => i.value);
      return { ...base, type: 'array', items: inner };
    }
    case 'file':
    case 'files': {
      const inner: Record<string, unknown> = { type: 'string', description: 'file path' };
      if (field.accept) inner.accept = field.accept;
      return field.multiple || field.type === 'files'
        ? { ...base, type: 'array', items: inner }
        : { ...base, ...inner };
    }
    case 'directory':
      return { ...base, type: 'string', description: 'directory path' };
    case 'json':
      return { ...base, type: 'object' };
    case 'yaml':
      return { ...base, type: 'string', description: 'YAML payload' };
    default:
      return { ...base, type: 'string' };
  }
}
