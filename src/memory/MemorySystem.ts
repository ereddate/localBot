import { MemoryEntry } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';

export class MemorySystem {
  private memories: Map<string, MemoryEntry> = new Map();
  private memoryFilePath: string;
  private autoSave: boolean;
  private maxMemories: number;

  constructor(memoryFilePath: string = './data/memories.json', autoSave: boolean = true, maxMemories: number = 1000) {
    this.memoryFilePath = memoryFilePath;
    this.autoSave = autoSave;
    this.maxMemories = maxMemories;
    this.initializeStorage();
  }

  private async initializeStorage(): Promise<void> {
    try {
      const dir = path.dirname(this.memoryFilePath);
      await fs.mkdir(dir, { recursive: true });
      
      const data = await fs.readFile(this.memoryFilePath, 'utf-8');
      const memories = JSON.parse(data);
      
      for (const memory of memories) {
        memory.timestamp = new Date(memory.timestamp);
        this.memories.set(memory.id, memory);
      }
      
      Logger.info(`Loaded ${this.memories.size} memories from storage`);
    } catch (error) {
      if ((error as any).code !== 'ENOENT') {
        Logger.warn('Could not load memories from storage', { error: (error as Error).message });
      }
    }
  }

  async addEntry(
    content: string,
    tags: string[] = [],
    importance: number = 1
  ): Promise<MemoryEntry> {
    const entry: MemoryEntry = {
      id: this.generateId(),
      content,
      tags,
      importance,
      timestamp: new Date(),
    };

    this.memories.set(entry.id, entry);
    
    if (this.autoSave) {
      await this.saveToDisk();
    }

    Logger.info('Memory entry added', { id: entry.id, tags, importance });
    return entry;
  }

  async getEntry(id: string): Promise<MemoryEntry | undefined> {
    return this.memories.get(id);
  }

  async search(query: string, limit: number = 10): Promise<MemoryEntry[]> {
    const queryLower = query.toLowerCase();
    const results: Array<{ entry: MemoryEntry; score: number }> = [];

    for (const entry of this.memories.values()) {
      let score = 0;
      const contentLower = entry.content.toLowerCase();

      if (contentLower.includes(queryLower)) {
        score += 10;
      }

      const tagMatch = entry.tags.some(tag => 
        tag.toLowerCase().includes(queryLower)
      );
      if (tagMatch) {
        score += 5;
      }

      const words = queryLower.split(/\s+/);
      for (const word of words) {
        if (contentLower.includes(word)) {
          score += 2;
        }
      }

      score += entry.importance;

      if (score > 0) {
        results.push({ entry, score });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit).map(r => r.entry);
  }

  async getRecentEntries(limit: number = 10): Promise<MemoryEntry[]> {
    const entries = Array.from(this.memories.values());
    entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return entries.slice(0, limit);
  }

  async getEntriesByTag(tag: string): Promise<MemoryEntry[]> {
    const results: MemoryEntry[] = [];
    const tagLower = tag.toLowerCase();

    for (const entry of this.memories.values()) {
      if (entry.tags.some(t => t.toLowerCase() === tagLower)) {
        results.push(entry);
      }
    }

    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return results;
  }

  async updateEntry(id: string, updates: Partial<MemoryEntry>): Promise<boolean> {
    const entry = this.memories.get(id);
    if (!entry) {
      return false;
    }

    Object.assign(entry, updates);
    
    if (this.autoSave) {
      await this.saveToDisk();
    }

    Logger.info('Memory entry updated', { id });
    return true;
  }

  async deleteEntry(id: string): Promise<boolean> {
    const deleted = this.memories.delete(id);
    
    if (deleted && this.autoSave) {
      await this.saveToDisk();
    }

    if (deleted) {
      Logger.info('Memory entry deleted', { id });
    }
    
    return deleted;
  }

  async clearAll(): Promise<void> {
    this.memories.clear();
    
    if (this.autoSave) {
      await this.saveToDisk();
    }

    Logger.info('All memories cleared');
  }

  async saveToDisk(): Promise<void> {
    try {
      const dir = path.dirname(this.memoryFilePath);
      await fs.mkdir(dir, { recursive: true });

      const entries = Array.from(this.memories.values());
      const data = JSON.stringify(entries, null, 2);
      
      await fs.writeFile(this.memoryFilePath, data, 'utf-8');
    } catch (error) {
      Logger.error('Failed to save memories to disk', { error: (error as Error).message });
    }
  }

  async loadFromDisk(): Promise<void> {
    try {
      const data = await fs.readFile(this.memoryFilePath, 'utf-8');
      const memories = JSON.parse(data);
      
      this.memories.clear();
      
      for (const memory of memories) {
        memory.timestamp = new Date(memory.timestamp);
        this.memories.set(memory.id, memory);
      }
      
      Logger.info(`Loaded ${this.memories.size} memories from disk`);
    } catch (error) {
      Logger.error('Failed to load memories from disk', { error: (error as Error).message });
    }
  }

  async cleanupOldEntries(days: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    let deletedCount = 0;
    for (const [id, entry] of this.memories.entries()) {
      if (entry.timestamp < cutoffDate && entry.importance < 3) {
        this.memories.delete(id);
        deletedCount++;
      }
    }

    if (deletedCount > 0 && this.autoSave) {
      await this.saveToDisk();
    }

    Logger.info(`Cleaned up ${deletedCount} old memory entries`);
    return deletedCount;
  }

  async enforceMaxMemories(): Promise<void> {
    if (this.memories.size <= this.maxMemories) {
      return;
    }

    const entries = Array.from(this.memories.values());
    entries.sort((a, b) => {
      if (a.importance !== b.importance) {
        return b.importance - a.importance;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    const toDelete = entries.slice(this.maxMemories);
    for (const entry of toDelete) {
      this.memories.delete(entry.id);
    }

    if (this.autoSave) {
      await this.saveToDisk();
    }

    Logger.info(`Deleted ${toDelete.length} entries to enforce max memories limit`);
  }

  getStats(): { total: number; byTag: Record<string, number>; avgImportance: number } {
    const entries = Array.from(this.memories.values());
    const byTag: Record<string, number> = {};
    let totalImportance = 0;

    for (const entry of entries) {
      for (const tag of entry.tags) {
        byTag[tag] = (byTag[tag] || 0) + 1;
      }
      totalImportance += entry.importance;
    }

    return {
      total: entries.length,
      byTag,
      avgImportance: entries.length > 0 ? totalImportance / entries.length : 0,
    };
  }

  private generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
