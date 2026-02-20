export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ToolParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  enum?: string[];
  default?: unknown;
}

export interface Tool {
  name: string;
  description: string;
  category: 'file' | 'shell' | 'memory' | 'network' | 'system' | 'other' | 'lifestyle' | 'frontend' | 'dynamic' | 'generated' | 'business';
  parameters?: ToolParameter[] | Record<string, unknown>;
  execute: (params: Record<string, unknown>) => Promise<ToolResult>;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface Skill {
  name: string;
  description: string;
  tools: Tool[];
  enabled: boolean;
  permissions: ToolPermission[];
}

export interface ToolPermission {
  toolName: string;
  allowed: boolean;
  requireConfirmation: boolean;
}

export interface MemoryEntry {
  id: string;
  content: string;
  timestamp: Date;
  tags: string[];
  importance: number;
  embedding?: number[];
}

export interface AgentContext {
  sessionId: string;
  userId?: string;
  messages: Message[];
  memory: MemoryEntry[];
  availableTools: Tool[];
  createdAt: Date;
  lastActivity: Date;
}

export interface SessionData {
  sessionId: string;
  userId?: string;
  platform?: PlatformType;
  platformUserId?: string;
  platformData?: Record<string, unknown>;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}

export type PlatformType = 'cli' | 'api' | 'mcp' | 'telegram' | 'discord' | 'slack' | 'whatsapp' | 'web' | 'wecom';

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface LogLevel {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

export interface ScheduledTask {
  id: string;
  name: string;
  cronExpression?: string;
  intervalMs?: number;
  execute: () => Promise<void>;
  active: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export interface WorkflowStep {
  id: string;
  name: string;
  tool: Tool;
  params: Record<string, unknown>;
  dependsOn?: string[];
  onSuccess?: string[];
  onError?: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  active: boolean;
}

export interface WorkflowExecution {
  workflowId: string;
  executionId: string;
  startTime: Date;
  endTime?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  stepResults: Map<string, { success: boolean; result?: unknown; error?: string }>;
  context: Record<string, unknown>;
}

export interface MonitorRule {
  id: string;
  name: string;
  type: 'filesystem' | 'process' | 'network' | 'custom';
  condition: (data: any) => boolean;
  action: (data: any) => Promise<void>;
  active: boolean;
  description: string;
}
