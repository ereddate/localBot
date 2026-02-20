import { Tool, ToolResult, Skill, ToolPermission } from '../types';
import { Logger } from '../utils/Logger';
import { registerDefaultTools } from './registerTools';

export class SkillManager {
  private tools: Map<string, Tool> = new Map();
  private skills: Map<string, Skill> = new Map();
  private permissions: Map<string, ToolPermission[]> = new Map();

  constructor() {
    registerDefaultTools(this);
  }

  registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
    Logger.info(`Tool registered: ${tool.name}`, { category: tool.category });
  }

  unregisterTool(toolName: string): boolean {
    const deleted = this.tools.delete(toolName);
    if (deleted) {
      Logger.info(`Tool unregistered: ${toolName}`);
    }
    return deleted;
  }

  getTool(toolName: string): Tool | undefined {
    return this.tools.get(toolName);
  }

  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  getToolsByCategory(category: string): Tool[] {
    return Array.from(this.tools.values()).filter(
      tool => tool.category === category
    );
  }

  registerSkill(skill: Skill): void {
    this.skills.set(skill.name, skill);
    
    if (skill.permissions && skill.permissions.length > 0) {
      this.permissions.set(skill.name, skill.permissions);
    }
    
    Logger.info(`Skill registered: ${skill.name}`, { 
      toolsCount: skill.tools.length,
      enabled: skill.enabled 
    });
  }

  unregisterSkill(skillName: string): boolean {
    const deleted = this.skills.delete(skillName);
    if (deleted) {
      this.permissions.delete(skillName);
      Logger.info(`Skill unregistered: ${skillName}`);
    }
    return deleted;
  }

  getSkill(skillName: string): Skill | undefined {
    return this.skills.get(skillName);
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  getEnabledSkills(): Skill[] {
    return Array.from(this.skills.values()).filter(skill => skill.enabled);
  }

  enableSkill(skillName: string): boolean {
    const skill = this.skills.get(skillName);
    if (skill) {
      skill.enabled = true;
      Logger.info(`Skill enabled: ${skillName}`);
      return true;
    }
    return false;
  }

  disableSkill(skillName: string): boolean {
    const skill = this.skills.get(skillName);
    if (skill) {
      skill.enabled = false;
      Logger.info(`Skill disabled: ${skillName}`);
      return true;
    }
    return false;
  }

  async executeTool(toolName: string, params: Record<string, unknown>): Promise<ToolResult> {
    const tool = this.tools.get(toolName);
    
    if (!tool) {
      return {
        success: false,
        error: `Tool not found: ${toolName}`
      };
    }

    const permission = this.checkPermission(toolName);
    if (!permission.allowed) {
      return {
        success: false,
        error: `Permission denied for tool: ${toolName}`
      };
    }

    try {
      Logger.info(`Executing tool: ${toolName}`, { params });
      const result = await tool.execute(params);
      Logger.info(`Tool execution completed: ${toolName}`, { 
        success: result.success 
      });
      return result;
    } catch (error) {
      Logger.error(`Tool execution failed: ${toolName}`, { 
        error: (error as Error).message 
      });
      return {
        success: false,
        error: `Tool execution failed: ${(error as Error).message}`
      };
    }
  }

  checkPermission(toolName: string): ToolPermission {
    for (const permissions of this.permissions.values()) {
      const perm = permissions.find(p => p.toolName === toolName);
      if (perm) {
        return perm;
      }
    }

    return {
      toolName,
      allowed: true,
      requireConfirmation: false
    };
  }

  setPermission(toolName: string, allowed: boolean, requireConfirmation: boolean = false): void {
    for (const [skillName, permissions] of this.permissions.entries()) {
      const index = permissions.findIndex(p => p.toolName === toolName);
      if (index >= 0) {
        permissions[index] = { toolName, allowed, requireConfirmation };
        Logger.info(`Permission updated for tool: ${toolName}`, { 
          skill: skillName,
          allowed,
          requireConfirmation 
        });
        return;
      }
    }
  }

  getToolStats(): { 
    total: number; 
    byCategory: Record<string, number>; 
    enabled: number 
  } {
    const tools = Array.from(this.tools.values());
    const byCategory: Record<string, number> = {};
    let enabled = 0;

    for (const tool of tools) {
      byCategory[tool.category] = (byCategory[tool.category] || 0) + 1;
      enabled++;
    }

    return {
      total: tools.length,
      byCategory,
      enabled
    };
  }

  getSkillStats(): { 
    total: number; 
    enabled: number; 
    disabled: number;
    totalTools: number 
  } {
    const skills = Array.from(this.skills.values());
    let enabled = 0;
    let totalTools = 0;

    for (const skill of skills) {
      if (skill.enabled) {
        enabled++;
      }
      totalTools += skill.tools.length;
    }

    return {
      total: skills.length,
      enabled,
      disabled: skills.length - enabled,
      totalTools
    };
  }

  searchTools(query: string): Tool[] {
    const queryLower = query.toLowerCase();
    const results: Array<{ tool: Tool; score: number }> = [];

    for (const tool of this.tools.values()) {
      let score = 0;

      if (tool.name.toLowerCase().includes(queryLower)) {
        score += 10;
      }

      if (tool.description.toLowerCase().includes(queryLower)) {
        score += 5;
      }

      if (tool.category.toLowerCase().includes(queryLower)) {
        score += 3;
      }

      if (score > 0) {
        results.push({ tool, score });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.map(r => r.tool);
  }

  searchSkills(query: string): Skill[] {
    const queryLower = query.toLowerCase();
    const results: Array<{ skill: Skill; score: number }> = [];

    for (const skill of this.skills.values()) {
      let score = 0;

      if (skill.name.toLowerCase().includes(queryLower)) {
        score += 10;
      }

      if (skill.description.toLowerCase().includes(queryLower)) {
        score += 5;
      }

      for (const tool of skill.tools) {
        if (tool.name.toLowerCase().includes(queryLower) ||
            tool.description.toLowerCase().includes(queryLower)) {
          score += 2;
        }
      }

      if (score > 0) {
        results.push({ skill, score });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.map(r => r.skill);
  }

  clearAll(): void {
    this.tools.clear();
    this.skills.clear();
    this.permissions.clear();
    Logger.info('All tools and skills cleared');
  }
}
