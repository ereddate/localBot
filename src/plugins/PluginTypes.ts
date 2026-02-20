import { Tool, ToolResult } from '../types';

export interface PluginMetadata {
  name: string;
  version: string;
  description: string;
  author?: string;
  category?: string;
  dependencies?: string[];
  permissions?: string[];
}

export interface Plugin {
  metadata: PluginMetadata;
  initialize?(): Promise<void>;
  getTools?(): Tool[];
  getTool?(name: string): Tool | undefined;
  execute?(name: string, params: Record<string, unknown>): Promise<ToolResult>;
  destroy?(): Promise<void>;
}

export interface PluginLoadResult {
  success: boolean;
  plugin?: Plugin;
  error?: string;
}

export interface PluginUnloadResult {
  success: boolean;
  error?: string;
}

export interface PluginInfo {
  metadata: PluginMetadata;
  tools: Tool[];
  loaded: boolean;
  loadTime: Date;
}
