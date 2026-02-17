import { Tool, ToolResult } from '../types';
import { MemorySystem } from '../memory/MemorySystem';
import { Logger } from '../utils/Logger';
import { ConsoleLogger } from '../utils/ConsoleLogger';

export class MemoryTool implements Tool {
  name = 'memory_add';
  description = 'Add an entry to memory';
  category = 'memory' as const;
  private memorySystem: MemorySystem;

  constructor(memorySystem?: MemorySystem) {
    this.memorySystem = memorySystem || new MemorySystem();
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      ConsoleLogger.logSkillCall(this.name, params);
      const content = params.content as string;
      const tags = (params.tags as string[]) || [];
      const importance = (params.importance as number) || 1;

      if (!content) {
        return { success: false, error: 'content is required' };
      }

      const entry = await this.memorySystem.addEntry(content, tags, importance);
      Logger.info(`Memory entry added`, { id: entry.id, tags });
      ConsoleLogger.logSkillSuccess(this.name, { id: entry.id, tags });
      return { success: true, data: entry };
    } catch (error) {
      ConsoleLogger.logSkillError(this.name, (error as Error).message);
      Logger.error(`Error adding memory`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class MemorySearchTool implements Tool {
  name = 'memory_search';
  description = 'Search memory entries';
  category = 'memory' as const;
  private memorySystem: MemorySystem;

  constructor(memorySystem?: MemorySystem) {
    this.memorySystem = memorySystem || new MemorySystem();
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const query = params.query as string;
      const limit = (params.limit as number) || 10;

      if (!query) {
        return { success: false, error: 'query is required' };
      }

      const entries = await this.memorySystem.search(query, limit);
      Logger.info(`Memory search completed`, { query, results: entries.length });
      return { success: true, data: entries };
    } catch (error) {
      Logger.error(`Error searching memory`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}
