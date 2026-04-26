export type ExecutionMode =
  | 'claude-local'
  | 'local-file'
  | 'local-script'
  | 'local-rag'
  | 'mcp'
  | 'remote-api';

export type InputType =
  | 'text'
  | 'markdown'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multi_select'
  | 'file'
  | 'files'
  | 'directory'
  | 'json'
  | 'yaml';

export interface InputItem {
  title: string;
  value: string;
}

export interface InputField {
  type: InputType;
  title?: string;
  description?: string;
  required?: boolean;
  multiple?: boolean;
  default_value?: unknown;
  min_length?: number;
  max_length?: number;
  accept?: string[];
  options?: string[];
  items?: InputItem[];
}

export interface LocalContextRef {
  path: string;
  description?: string;
}

export interface ArtifactSpec {
  name: string;
  path: string;
  format?: 'markdown' | 'text' | 'json' | 'yaml';
  required?: boolean;
  description?: string;
}

export interface Recipe {
  id: string;
  name: string;
  version: string;
  description: string;
  tags?: string[];
  origin?: {
    type?: 'original' | 'clean-room-inspired';
    source_model?: string;
    source_code_copied?: false;
  };
  execution: {
    default_mode: ExecutionMode;
    allowed_modes?: ExecutionMode[];
    remote_api_required?: boolean;
  };
  inputs: Record<string, InputField>;
  local_context?: {
    references?: Array<string | LocalContextRef>;
    templates?: Array<string | LocalContextRef>;
    examples?: string[];
  };
  outputs: {
    primary: 'markdown' | 'text' | 'json' | 'yaml';
    artifacts?: ArtifactSpec[];
  };
  quality?: {
    rules?: string[];
    eval?: {
      fixture_dir?: string;
      golden_dir?: string;
    };
  };
  security?: {
    network?: 'deny-by-default' | 'explicit-allow';
    secrets?: 'forbid-hardcoded' | 'env-only';
    side_effects?: 'read-only-by-default' | 'explicit-write';
    allowed_tools?: string[];
    remote_api?: {
      enabled?: boolean;
      requires_user_confirmation?: boolean;
      endpoint_env?: string;
      api_key_env?: string;
    };
  };
  claude?: {
    skill_name?: string;
    auto_invocation?: boolean;
    allowed_tools?: string[];
  };
}
