import { Tool, ToolResult, ToolPermission } from '../types';
import { Logger } from '../utils/Logger';

export class PermissionManager {
  private permissions: Map<string, ToolPermission> = new Map();

  constructor() {
    this.loadDefaultPermissions();
  }

  private loadDefaultPermissions(): void {
    const defaultPermissions: ToolPermission[] = [
      { toolName: 'file_read', allowed: true, requireConfirmation: false },
      { toolName: 'file_write', allowed: true, requireConfirmation: true },
      { toolName: 'file_list', allowed: true, requireConfirmation: false },
      { toolName: 'file_delete', allowed: true, requireConfirmation: true },
      { toolName: 'shell_execute', allowed: true, requireConfirmation: true },
      { toolName: 'memory_add', allowed: true, requireConfirmation: false },
      { toolName: 'memory_search', allowed: true, requireConfirmation: false },
    ];

    defaultPermissions.forEach(p => this.permissions.set(p.toolName, p));
  }

  async checkPermission(toolName: string): Promise<boolean> {
    const permission = this.permissions.get(toolName);
    return permission?.allowed ?? false;
  }

  requiresConfirmation(toolName: string): boolean {
    const permission = this.permissions.get(toolName);
    return permission?.requireConfirmation ?? false;
  }

  setPermission(toolName: string, allowed: boolean, requireConfirmation?: boolean): void {
    const existing = this.permissions.get(toolName);
    this.permissions.set(toolName, {
      toolName,
      allowed,
      requireConfirmation: requireConfirmation ?? existing?.requireConfirmation ?? false,
    });
    Logger.info(`Permission updated for ${toolName}`, { allowed, requireConfirmation });
  }

  getPermission(toolName: string): ToolPermission | undefined {
    return this.permissions.get(toolName);
  }

  getAllPermissions(): ToolPermission[] {
    return Array.from(this.permissions.values());
  }
}
