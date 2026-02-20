import { EventEmitter } from 'events';
import { Logger } from '../utils/Logger';
import { SkillManager } from '../skills/SkillManager';
import { SessionManager } from '../session/SessionManager';

export interface ReverseControlAction {
  id: string;
  type: 'system' | 'browser' | 'file' | 'network' | 'custom';
  command: string;
  params: Record<string, unknown>;
  permissions: string[];
  userId?: string;
  sessionId?: string;
  timestamp: Date;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
}

export interface ReverseControlConfig {
  enabled: boolean;
  requireApproval: boolean;
  allowedActions: string[];
  maxConcurrentActions: number;
  timeout: number;
  logActions: boolean;
}

export class ReverseControlEngine extends EventEmitter {
  private config: ReverseControlConfig;
  private skillManager: SkillManager;
  private sessionManager: SessionManager;
  private actionQueue: Map<string, ReverseControlAction>;
  private executingActions: Set<string>;

  constructor(
    config: ReverseControlConfig,
    skillManager: SkillManager,
    sessionManager: SessionManager
  ) {
    super();
    this.config = config;
    this.skillManager = skillManager;
    this.sessionManager = sessionManager;
    this.actionQueue = new Map();
    this.executingActions = new Set();
  }

  async initialize(): Promise<void> {
    Logger.info('Initializing Reverse Control Engine', {
      enabled: this.config.enabled,
      requireApproval: this.config.requireApproval,
    });

    if (!this.config.enabled) {
      Logger.warn('Reverse Control Engine is disabled');
      return;
    }

    this.emit('initialized');
  }

  async executeAction(action: ReverseControlAction): Promise<unknown> {
    if (!this.config.enabled) {
      throw new Error('Reverse Control Engine is disabled');
    }

    if (!this.isActionAllowed(action)) {
      throw new Error(`Action ${action.type} is not allowed`);
    }

    if (this.executingActions.size >= this.config.maxConcurrentActions) {
      throw new Error('Maximum concurrent actions reached');
    }

    action.status = 'pending';
    action.timestamp = new Date();
    this.actionQueue.set(action.id, action);

    if (this.config.requireApproval) {
      this.emit('approval-required', action);
      return new Promise((resolve, reject) => {
        this.once(`approved-${action.id}`, () => {
          this.performAction(action).then(resolve).catch(reject);
        });
        this.once(`rejected-${action.id}`, () => {
          action.status = 'failed';
          action.error = 'Action rejected by user';
          this.emit('action-rejected', action);
          reject(new Error('Action rejected'));
        });
      });
    }

    return this.performAction(action);
  }

  private async performAction(action: ReverseControlAction): Promise<unknown> {
    this.executingActions.add(action.id);
    this.emit('action-started', action);

    if (this.config.logActions) {
      Logger.info('Executing reverse control action', {
        id: action.id,
        type: action.type,
        command: action.command,
        userId: action.userId,
      });
    }

    try {
      const result = await this.executeActionByType(action);
      action.status = 'completed';
      action.result = result;
      this.emit('action-completed', action);
      return result;
    } catch (error) {
      action.status = 'failed';
      action.error = error instanceof Error ? error.message : String(error);
      this.emit('action-failed', action);
      throw error;
    } finally {
      this.executingActions.delete(action.id);
      this.actionQueue.delete(action.id);
    }
  }

  private async executeActionByType(action: ReverseControlAction): Promise<unknown> {
    switch (action.type) {
      case 'system':
        return this.executeSystemAction(action);
      case 'browser':
        return this.executeBrowserAction(action);
      case 'file':
        return this.executeFileAction(action);
      case 'network':
        return this.executeNetworkAction(action);
      case 'custom':
        return this.executeCustomAction(action);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async executeSystemAction(action: ReverseControlAction): Promise<unknown> {
    const { exec } = require('child_process');
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Action timeout'));
      }, this.config.timeout);

      exec(action.command, (error: any, stdout: string, stderr: string) => {
        clearTimeout(timeout);
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  private async executeBrowserAction(action: ReverseControlAction): Promise<unknown> {
    const tool = this.skillManager.getTool('browser_automation');
    if (!tool) {
      throw new Error('Browser automation tool not found');
    }

    return tool.execute(action.params);
  }

  private async executeFileAction(action: ReverseControlAction): Promise<unknown> {
    const fileTool = this.skillManager.getTool('file_operations');
    if (!fileTool) {
      throw new Error('File operations tool not found');
    }

    return fileTool.execute(action.params);
  }

  private async executeNetworkAction(action: ReverseControlAction): Promise<unknown> {
    const networkTool = this.skillManager.getTool('network');
    if (!networkTool) {
      throw new Error('Network tool not found');
    }

    return networkTool.execute(action.params);
  }

  private async executeCustomAction(action: ReverseControlAction): Promise<unknown> {
    const customTool = this.skillManager.getTool(action.command);
    if (!customTool) {
      throw new Error(`Custom tool ${action.command} not found`);
    }

    return customTool.execute(action.params);
  }

  private isActionAllowed(action: ReverseControlAction): boolean {
    return this.config.allowedActions.includes(action.type);
  }

  approveAction(actionId: string): void {
    const action = this.actionQueue.get(actionId);
    if (action) {
      this.emit(`approved-${actionId}`, action);
    }
  }

  rejectAction(actionId: string): void {
    const action = this.actionQueue.get(actionId);
    if (action) {
      this.emit(`rejected-${actionId}`, action);
    }
  }

  getActionStatus(actionId: string): ReverseControlAction | undefined {
    return this.actionQueue.get(actionId);
  }

  getAllActions(): ReverseControlAction[] {
    return Array.from(this.actionQueue.values());
  }

  getExecutingActions(): ReverseControlAction[] {
    return Array.from(this.executingActions)
      .map(id => this.actionQueue.get(id))
      .filter((action): action is ReverseControlAction => action !== undefined);
  }

  async shutdown(): Promise<void> {
    Logger.info('Shutting down Reverse Control Engine');

    for (const actionId of this.executingActions) {
      const action = this.actionQueue.get(actionId);
      if (action && action.status === 'executing') {
        Logger.warn('Terminating executing action', { actionId });
        action.status = 'failed';
        action.error = 'Engine shutdown';
      }
    }

    this.actionQueue.clear();
    this.executingActions.clear();
    this.emit('shutdown');
  }

  updateConfig(config: Partial<ReverseControlConfig>): void {
    this.config = { ...this.config, ...config };
    Logger.info('Reverse Control Engine config updated', this.config as unknown as Record<string, unknown>);
  }
}
