import * as fs from 'fs/promises';
import * as path from 'path';
import { config } from '../config';
import { MemoryEntry } from '../types';
import { Logger } from '../utils/Logger';

export class MemorySystem {
  private memoryDir: string;
  private longTermMemoryFile: string;
  private cache: Map<string, MemoryEntry[]> = new Map();
  private embeddingsCache: Map<string, number[]> = new Map();

  constructor() {
    this.memoryDir = config.memoryDir;
    this.longTermMemoryFile = path.join(this.memoryDir, 'MEMORY.md');
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.memoryDir, { recursive: true });
      
      try {
        await fs.access(this.longTermMemoryFile);
      } catch {
        await fs.writeFile(this.longTermMemoryFile, '# Long-term Memory\n\n', 'utf-8');
      }

      await this.loadRecentMemories();
      Logger.info('Memory system initialized', { memoryDir: this.memoryDir });
    } catch (error) {
      Logger.error('Error initializing memory system', { error: (error as Error).message });
    }
  }

  private async loadRecentMemories(): Promise<void> {
    try {
      const files = await fs.readdir(this.memoryDir);
      const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'MEMORY.md');
      
      for (const file of mdFiles.slice(-7)) {
        const filePath = path.join(this.memoryDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const entries = this.parseMemoryFile(content);
        const dateKey = file.replace('.md', '');
        this.cache.set(dateKey, entries);
      }
      
      Logger.info(`Loaded ${mdFiles.length} memory files`);
    } catch (error) {
      Logger.warn('Error loading recent memories', { error: (error as Error).message });
    }
  }

  private parseMemoryFile(content: string): MemoryEntry[] {
    const entries: MemoryEntry[] = [];
    const sections = content.split(/---\n/);
    
    for (const section of sections) {
      const timestampMatch = section.match(/## (\d{4}-\d{2}-\d{2}T[\d:.-]+Z)/);
      const tagsMatch = section.match(/Tags: (.*)/);
      const contentMatch = section.match(/\n\n(.+)/s);

      if (timestampMatch && contentMatch) {
        entries.push({
          id: this.generateId(),
          content: contentMatch[1].trim(),
          timestamp: new Date(timestampMatch[1]),
          tags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [],
          importance: 1,
        });
      }
    }

    return entries;
  }

  async addEntry(content: string, tags: string[] = [], importance: number = 1): Promise<MemoryEntry> {
    const entry: MemoryEntry = {
      id: this.generateId(),
      content,
      timestamp: new Date(),
      tags,
      importance,
    };

    const dateKey = this.getDateKey(entry.timestamp);
    if (!this.cache.has(dateKey)) {
      this.cache.set(dateKey, []);
    }
    this.cache.get(dateKey)!.push(entry);

    await this.saveDailyMemory(dateKey);

    if (importance >= 3) {
      await this.addToLongTermMemory(entry);
    }

    Logger.info('Memory entry added', { 
      id: entry.id, 
      tags, 
      importance 
    });

    return entry;
  }

  async search(query: string, limit: number = 10): Promise<MemoryEntry[]> {
    const allEntries: MemoryEntry[] = [];

    for (const entries of this.cache.values()) {
      allEntries.push(...entries);
    }

    const queryLower = query.toLowerCase();
    const scored = allEntries.map(entry => ({
      entry,
      score: this.calculateRelevance(entry, queryLower),
    }));

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.entry);
  }

  async semanticSearch(query: string, limit: number = 10): Promise<MemoryEntry[]> {
    const queryEmbedding = await this.getEmbedding(query);
    const allEntries: MemoryEntry[] = [];

    for (const entries of this.cache.values()) {
      allEntries.push(...entries);
    }

    const scored: Array<{ entry: MemoryEntry; similarity: number }> = [];

    for (const entry of allEntries) {
      const embedding = entry.embedding || await this.getEmbedding(entry.content);
      scored.push({
        entry,
        similarity: this.cosineSimilarity(queryEmbedding, embedding),
      });
    }

    return scored
      .filter(s => s.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(s => s.entry);
  }

  private calculateRelevance(entry: MemoryEntry, query: string): number {
    let score = 0;
    const contentLower = entry.content.toLowerCase();

    if (contentLower.includes(query)) {
      score += 10;
    }

    entry.tags.forEach(tag => {
      if (tag.toLowerCase().includes(query) || query.includes(tag.toLowerCase())) {
        score += 5;
      }
    });

    score += entry.importance;

    const daysSinceCreation = (Date.now() - entry.timestamp.getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 5 - daysSinceCreation / 7);

    return score;
  }

  private async getEmbedding(text: string): Promise<number[]> {
    const cacheKey = text.substring(0, 100);
    
    if (this.embeddingsCache.has(cacheKey)) {
      return this.embeddingsCache.get(cacheKey)!;
    }

    const embedding = this.simpleEmbedding(text);
    this.embeddingsCache.set(cacheKey, embedding);
    return embedding;
  }

  private simpleEmbedding(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/);
    const vector = new Array(128).fill(0);
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const hash = this.hashWord(word);
      const index = Math.abs(hash) % 128;
      vector[index] += 1 / (i + 1);
    }

    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
  }

  private hashWord(word: string): number {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash) + word.charCodeAt(i);
      hash = hash & hash;
    }
    return hash;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator > 0 ? dotProduct / denominator : 0;
  }

  async getRecentEntries(days: number = 7): Promise<MemoryEntry[]> {
    const entries: MemoryEntry[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = this.getDateKey(date);

      const dayEntries = this.cache.get(dateKey);
      if (dayEntries) {
        entries.push(...dayEntries);
      }
    }

    return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getLongTermMemory(): Promise<string> {
    try {
      return await fs.readFile(this.longTermMemoryFile, 'utf-8');
    } catch (error) {
      Logger.error('Error reading long-term memory', { error: (error as Error).message });
      return '';
    }
  }

  private async addToLongTermMemory(entry: MemoryEntry): Promise<void> {
    const timestamp = entry.timestamp.toISOString();
    const tagsStr = entry.tags.length > 0 ? `Tags: ${entry.tags.join(', ')}` : '';
    const content = `\n## ${timestamp}\n${tagsStr}\n\n${entry.content}\n`;

    try {
      await fs.appendFile(this.longTermMemoryFile, content, 'utf-8');
      Logger.info('Added to long-term memory', { id: entry.id });
    } catch (error) {
      Logger.error('Error adding to long-term memory', { error: (error as Error).message });
    }
  }

  private async saveDailyMemory(dateKey: string): Promise<void> {
    const entries = this.cache.get(dateKey);
    if (!entries || entries.length === 0) return;

    const filePath = path.join(this.memoryDir, `${dateKey}.md`);
    const content = entries.map(entry => {
      const timestamp = entry.timestamp.toISOString();
      const tagsStr = entry.tags.length > 0 ? `Tags: ${entry.tags.join(', ')}` : '';
      return `## ${timestamp}\n${tagsStr}\n\n${entry.content}\n`;
    }).join('\n---\n\n');

    try {
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      Logger.error('Error saving daily memory', { 
        dateKey, 
        error: (error as Error).message 
      });
    }
  }

  private getDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
