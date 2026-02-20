import { MemoryEntry } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface DiaryEntry {
  date: string;
  content: string;
  tags: string[];
  timestamp: Date;
}

export interface LongTermMemory {
  id: string;
  content: string;
  tags: string[];
  importance: number;
  timestamp: Date;
  accessCount: number;
  lastAccessed: Date;
}

export class EnhancedMemorySystem {
  private memories: Map<string, MemoryEntry> = new Map();
  private diaryEntries: Map<string, DiaryEntry[]> = new Map();
  private longTermMemories: Map<string, LongTermMemory> = new Map();
  private memoryFilePath: string;
  private diaryDir: string;
  private longTermMemoryPath: string;
  private autoSave: boolean;
  private maxMemories: number;
  private maxDiaryEntries: number = 100;
  private maxLongTermMemories: number = 500;

  constructor(
    memoryFilePath: string = './data/memories.json',
    diaryDir: string = './memory',
    autoSave: boolean = true,
    maxMemories: number = 1000
  ) {
    this.memoryFilePath = memoryFilePath;
    this.diaryDir = diaryDir;
    this.longTermMemoryPath = path.join(diaryDir, 'MEMORY.md');
    this.autoSave = autoSave;
    this.maxMemories = maxMemories;
    this.initializeStorage();
  }

  private async initializeStorage(): Promise<void> {
    try {
      // Initialize regular memories
      const dir = path.dirname(this.memoryFilePath);
      await fs.mkdir(dir, { recursive: true });
      
      const data = await fs.readFile(this.memoryFilePath, 'utf-8');
      const memories = JSON.parse(data);
      
      for (const memory of memories) {
        memory.timestamp = new Date(memory.timestamp);
        this.memories.set(memory.id, memory);
      }
      
      Logger.info(`Loaded ${this.memories.size} regular memories from storage`);
    } catch (error) {
      if ((error as any).code !== 'ENOENT') {
        Logger.warn('Could not load memories from storage', { error: (error as Error).message });
      }
    }

    try {
      // Initialize diary memories
      await fs.mkdir(this.diaryDir, { recursive: true });
      const diaryFiles = await fs.readdir(this.diaryDir);
      const diaryPattern = /^(\d{4}-\d{2}-\d{2})\.md$/;
      
      for (const file of diaryFiles) {
        const match = file.match(diaryPattern);
        if (match) {
          const date = match[1];
          const content = await fs.readFile(path.join(this.diaryDir, file), 'utf-8');
          const entries = this.parseDiaryContent(content);
          this.diaryEntries.set(date, entries);
        }
      }
      
      Logger.info(`Loaded ${this.diaryEntries.size} diary entries from ${diaryFiles.length} files`);
    } catch (error) {
      Logger.warn('Could not load diary entries', { error: (error as Error).message });
    }

    try {
      // Initialize long-term memories
      const longTermContent = await fs.readFile(this.longTermMemoryPath, 'utf-8');
      const longTermMemories = this.parseLongTermMemoryContent(longTermContent);
      
      for (const memory of longTermMemories) {
        this.longTermMemories.set(memory.id, memory);
      }
      
      Logger.info(`Loaded ${this.longTermMemories.size} long-term memories`);
    } catch (error) {
      if ((error as any).code !== 'ENOENT') {
        Logger.warn('Could not load long-term memories', { error: (error as Error).message });
      }
    }
  }

  private parseDiaryContent(content: string): DiaryEntry[] {
    const entries: DiaryEntry[] = [];
    const lines = content.split('\n');
    let currentEntry: Partial<DiaryEntry> | null = null;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentEntry && currentEntry.content) {
          entries.push(currentEntry as DiaryEntry);
        }
        currentEntry = {
          date: line.substring(3).trim(),
          content: '',
          tags: [],
          timestamp: new Date()
        };
      } else if (line.startsWith('Tags: ')) {
        if (currentEntry) {
          currentEntry.tags = line.substring(6).split(',').map(t => t.trim());
        }
      } else if (currentEntry) {
        currentEntry.content += line + '\n';
      }
    }

    if (currentEntry && currentEntry.content) {
      entries.push(currentEntry as DiaryEntry);
    }

    return entries;
  }

  private parseLongTermMemoryContent(content: string): LongTermMemory[] {
    const memories: LongTermMemory[] = [];
    const lines = content.split('\n');
    let currentMemory: Partial<LongTermMemory> | null = null;

    for (const line of lines) {
      if (line.startsWith('### ')) {
        if (currentMemory && currentMemory.content) {
          memories.push(currentMemory as LongTermMemory);
        }
        const id = line.substring(4).trim();
        currentMemory = {
          id,
          content: '',
          tags: [],
          importance: 1,
          timestamp: new Date(),
          accessCount: 0,
          lastAccessed: new Date()
        };
      } else if (line.startsWith('Tags: ')) {
        if (currentMemory) {
          currentMemory.tags = line.substring(6).split(',').map(t => t.trim());
        }
      } else if (line.startsWith('Importance: ')) {
        if (currentMemory) {
          currentMemory.importance = parseInt(line.substring(12), 10);
        }
      } else if (currentMemory) {
        currentMemory.content += line + '\n';
      }
    }

    if (currentMemory && currentMemory.content) {
      memories.push(currentMemory as LongTermMemory);
    }

    return memories;
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

  async addDiaryEntry(
    content: string,
    tags: string[] = []
  ): Promise<DiaryEntry> {
    const today = new Date().toISOString().split('T')[0];
    const entry: DiaryEntry = {
      date: today,
      content,
      tags,
      timestamp: new Date()
    };

    if (!this.diaryEntries.has(today)) {
      this.diaryEntries.set(today, []);
    }
    
    this.diaryEntries.get(today)!.push(entry);
    
    // Auto-save diary entry
    await this.saveDiaryEntry(today);
    
    Logger.info('Diary entry added', { date: today, tags });
    return entry;
  }

  async addLongTermMemory(
    content: string,
    tags: string[] = [],
    importance: number = 3
  ): Promise<LongTermMemory> {
    const entry: LongTermMemory = {
      id: this.generateId(),
      content,
      tags,
      importance,
      timestamp: new Date(),
      accessCount: 0,
      lastAccessed: new Date()
    };

    this.longTermMemories.set(entry.id, entry);
    
    // Auto-save long-term memory
    await this.saveLongTermMemory();
    
    Logger.info('Long-term memory added', { id: entry.id, tags, importance });
    return entry;
  }

  private async saveDiaryEntry(date: string): Promise<void> {
    try {
      const entries = this.diaryEntries.get(date) || [];
      const content = this.formatDiaryContent(date, entries);
      const filePath = path.join(this.diaryDir, `${date}.md`);
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      Logger.error('Failed to save diary entry', { error: (error as Error).message });
    }
  }

  private formatDiaryContent(date: string, entries: DiaryEntry[]): string {
    let content = `# Diary - ${date}\n\n`;
    
    for (const entry of entries) {
      content += `## ${entry.date}\n`;
      content += `Tags: ${entry.tags.join(', ')}\n\n`;
      content += `${entry.content}\n\n`;
    }
    
    return content;
  }

  private async saveLongTermMemory(): Promise<void> {
    try {
      const content = this.formatLongTermMemoryContent();
      await fs.writeFile(this.longTermMemoryPath, content, 'utf-8');
    } catch (error) {
      Logger.error('Failed to save long-term memory', { error: (error as Error).message });
    }
  }

  private formatLongTermMemoryContent(): string {
    let content = `# Long-Term Memory\n\n`;
    
    const sortedMemories = Array.from(this.longTermMemories.values())
      .sort((a, b) => b.importance - a.importance);
    
    for (const memory of sortedMemories) {
      content += `### ${memory.id}\n`;
      content += `Tags: ${memory.tags.join(', ')}\n`;
      content += `Importance: ${memory.importance}\n`;
      content += `Access Count: ${memory.accessCount}\n`;
      content += `Last Accessed: ${memory.lastAccessed.toISOString()}\n\n`;
      content += `${memory.content}\n\n`;
    }
    
    return content;
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

  async searchDiary(query: string, limit: number = 10): Promise<DiaryEntry[]> {
    const queryLower = query.toLowerCase();
    const results: Array<{ entry: DiaryEntry; score: number }> = [];

    for (const entries of this.diaryEntries.values()) {
      for (const entry of entries) {
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

        if (score > 0) {
          results.push({ entry, score });
        }
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit).map(r => r.entry);
  }

  async searchLongTermMemory(query: string, limit: number = 10): Promise<LongTermMemory[]> {
    const queryLower = query.toLowerCase();
    const results: Array<{ memory: LongTermMemory; score: number }> = [];

    for (const memory of this.longTermMemories.values()) {
      let score = 0;
      const contentLower = memory.content.toLowerCase();

      if (contentLower.includes(queryLower)) {
        score += 10;
      }

      const tagMatch = memory.tags.some(tag => 
        tag.toLowerCase().includes(queryLower)
      );
      if (tagMatch) {
        score += 5;
      }

      score += memory.importance * 2;
      score += memory.accessCount;

      if (score > 0) {
        results.push({ memory, score });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit).map(r => r.memory);
  }

  async searchAll(query: string, limit: number = 10): Promise<{
    regular: MemoryEntry[];
    diary: DiaryEntry[];
    longTerm: LongTermMemory[];
  }> {
    const [regular, diary, longTerm] = await Promise.all([
      this.search(query, Math.ceil(limit / 3)),
      this.searchDiary(query, Math.ceil(limit / 3)),
      this.searchLongTermMemory(query, Math.ceil(limit / 3))
    ]);

    return { regular, diary, longTerm };
  }

  async getRecentEntries(limit: number = 10): Promise<MemoryEntry[]> {
    const entries = Array.from(this.memories.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    
    return entries;
  }

  async getRecentDiaryEntries(days: number = 7): Promise<DiaryEntry[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentEntries: DiaryEntry[] = [];
    for (const entries of this.diaryEntries.values()) {
      for (const entry of entries) {
        if (entry.timestamp >= cutoffDate) {
          recentEntries.push(entry);
        }
      }
    }
    
    recentEntries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return recentEntries;
  }

  async deleteEntry(id: string): Promise<boolean> {
    const deleted = this.memories.delete(id);
    
    if (deleted && this.autoSave) {
      await this.saveToDisk();
    }
    
    return deleted;
  }

  async clearOldMemories(days: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    let deletedCount = 0;
    for (const [id, entry] of this.memories.entries()) {
      if (entry.timestamp < cutoffDate) {
        this.memories.delete(id);
        deletedCount++;
      }
    }
    
    if (deletedCount > 0 && this.autoSave) {
      await this.saveToDisk();
    }
    
    Logger.info(`Cleared ${deletedCount} old memories`);
    return deletedCount;
  }

  async compressMemories(): Promise<number> {
    if (this.memories.size <= this.maxMemories) {
      return 0;
    }
    
    const entries = Array.from(this.memories.values())
      .sort((a, b) => {
        const scoreA = a.importance + (a.timestamp.getTime() / 1000000000);
        const scoreB = b.importance + (b.timestamp.getTime() / 1000000000);
        return scoreB - scoreA;
      });
    
    const toDelete = entries.slice(this.maxMemories);
    let deletedCount = 0;
    
    for (const entry of toDelete) {
      this.memories.delete(entry.id);
      deletedCount++;
    }
    
    if (deletedCount > 0 && this.autoSave) {
      await this.saveToDisk();
    }
    
    Logger.info(`Compressed memories, deleted ${deletedCount} entries`);
    return deletedCount;
  }

  private async saveToDisk(): Promise<void> {
    try {
      const data = JSON.stringify(Array.from(this.memories.values()), null, 2);
      await fs.writeFile(this.memoryFilePath, data, 'utf-8');
    } catch (error) {
      Logger.error('Failed to save memories to disk', { error: (error as Error).message });
    }
  }

  private generateId(): string {
    return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getStats(): {
    regularMemories: number;
    diaryEntries: number;
    longTermMemories: number;
  } {
    let diaryCount = 0;
    for (const entries of this.diaryEntries.values()) {
      diaryCount += entries.length;
    }
    
    return {
      regularMemories: this.memories.size,
      diaryEntries: diaryCount,
      longTermMemories: this.longTermMemories.size
    };
  }
}
