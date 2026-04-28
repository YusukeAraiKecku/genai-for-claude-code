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
      else if (field.options) s.enum = field.options;
      return s;
    }
    case 'multi_select': {
      const inner: Record<string, unknown> = { type: 'string' };
      if (field.items) inner.enum = field.items.map((i) => i.value);
      else if (field.options) inner.enum = field.options;
      return { ...base, type: 'array', items: inner };
    }
    case 'file': {
      const inner: Record<string, unknown> = { type: 'string', description: 'file path' };
      if (field.accept) inner.accept = field.accept;
      return field.multiple ? { ...base, type: 'array', items: inner } : { ...base, ...inner };
    }
    case 'files': {
      const inner: Record<string, unknown> = { type: 'string', description: 'file path' };
      if (field.accept) inner.accept = field.accept;
      const s: Record<string, unknown> = { ...base, type: 'array', items: inner };
      if (typeof field.min_files === 'number') s.minItems = field.min_files;
      if (typeof field.max_files === 'number') s.maxItems = field.max_files;
      return s;
    }
    case 'directory':
      return { ...base, type: 'string', description: 'directory path' };
    case 'json': {
      if (field.schema) return { ...base, ...field.schema };
      return { ...base, type: 'object' };
    }
    case 'yaml':
      return { ...base, type: 'string', description: 'YAML payload' };
    case 'table': {
      const typeMap: Record<string, string> = {
        string: 'string',
        number: 'number',
        boolean: 'boolean',
        date: 'string',
      };
      const rowProps: Record<string, unknown> = {};
      for (const col of field.columns ?? []) {
        const colSchema: Record<string, unknown> = {
          type: typeMap[col.type ?? 'string'] ?? 'string',
        };
        if (col.description) colSchema.description = col.description;
        rowProps[col.name] = colSchema;
      }
      const rowSchema: Record<string, unknown> = { type: 'object' };
      if (Object.keys(rowProps).length > 0) rowSchema.properties = rowProps;
      return { ...base, type: 'array', items: rowSchema };
    }
    case 'persona':
      return {
        ...base,
        type: 'string',
        description: base.description ?? 'role or persona identifier',
      };
    case 'longform_ref': {
      const itemSchema: Record<string, unknown> = {
        type: 'object',
        required: ['path'],
        properties: {
          path: { type: 'string' },
          label: { type: 'string' },
        },
        additionalProperties: false,
      };
      return { ...base, type: 'array', items: itemSchema };
    }
    default:
      return { ...base, type: 'string' };
  }
}
