import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as chokidar from 'chokidar';

export interface SkillMetadata {
  name: string;
  description: string;
  emoji?: string;
  category?: string;
  version?: string;
  author?: string;
  priority?: number;
  requires?: {
    bins?: string[];
    env?: string[];
  };
  dependencies?: string[];
}

export interface Skill {
  metadata: SkillMetadata;
  content: string;
  path: string;
  enabled: boolean;
  source: 'workspace' | 'managed' | 'bundled';
  loadTime: Date;
}

export interface SkillMatch {
  skill: Skill;
  confidence: number;
  reason: string;
}

export interface SkillsHubConfig {
  skillsPath?: string;
  managedSkillsPath?: string;
  bundledSkillsPath?: string;
  autoLoad?: boolean;
  enableDiscovery?: boolean;
  enableHotReload?: boolean;
  enableGating?: boolean;
}

export class EnhancedSkillsHub {
  private skills: Map<string, Skill> = new Map();
  private skillsPath: string;
  private managedSkillsPath: string;
  private bundledSkillsPath: string;
  private autoLoad: boolean;
  private enableDiscovery: boolean;
  private enableHotReload: boolean;
  private enableGating: boolean;
  private initialized: boolean = false;
  private watcher?: chokidar.FSWatcher;
  private skillDependencies: Map<string, string[]> = new Map();

  constructor(config: SkillsHubConfig = {}) {
    this.skillsPath = config.skillsPath || './workspace/skills';
    this.managedSkillsPath = config.managedSkillsPath || './skills/managed';
    this.bundledSkillsPath = config.bundledSkillsPath || './skills/bundled';
    this.autoLoad = config.autoLoad ?? true;
    this.enableDiscovery = config.enableDiscovery ?? false;
    this.enableHotReload = config.enableHotReload ?? true;
    this.enableGating = config.enableGating ?? true;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      Logger.warn('EnhancedSkillsHub already initialized');
      return;
    }

    try {
      await Promise.all([
        fs.mkdir(this.skillsPath, { recursive: true }),
        fs.mkdir(this.managedSkillsPath, { recursive: true }),
        fs.mkdir(this.bundledSkillsPath, { recursive: true })
      ]);
      
      if (this.autoLoad) {
        await this.loadSkillsWithPriority();
      }
      
      if (this.enableHotReload) {
        await this.setupHotReload();
      }
      
      this.initialized = true;
      Logger.info('EnhancedSkillsHub initialized', { 
        skillsCount: this.skills.size,
        hotReloadEnabled: this.enableHotReload,
        gatingEnabled: this.enableGating
      });
    } catch (error) {
      Logger.error('Failed to initialize EnhancedSkillsHub', { 
        error: (error as Error).message 
      });
      throw error;
    }
  }

  private async loadSkillsWithPriority(): Promise<void> {
    this.skills.clear();
    this.skillDependencies.clear();

    const loadOrder: Array<{ path: string; source: Skill['source']; priority: number }> = [];

    try {
      const workspaceEntries = await fs.readdir(this.skillsPath, { withFileTypes: true });
      for (const entry of workspaceEntries) {
        if (entry.isDirectory()) {
          loadOrder.push({
            path: path.join(this.skillsPath, entry.name),
            source: 'workspace',
            priority: 100
          });
        }
      }
    } catch (error) {
      Logger.warn('Could not load workspace skills', { error: (error as Error).message });
    }

    try {
      const managedEntries = await fs.readdir(this.managedSkillsPath, { withFileTypes: true });
      for (const entry of managedEntries) {
        if (entry.isDirectory()) {
          loadOrder.push({
            path: path.join(this.managedSkillsPath, entry.name),
            source: 'managed',
            priority: 50
          });
        }
      }
    } catch (error) {
      Logger.warn('Could not load managed skills', { error: (error as Error).message });
    }

    try {
      const bundledEntries = await fs.readdir(this.bundledSkillsPath, { withFileTypes: true });
      for (const entry of bundledEntries) {
        if (entry.isDirectory()) {
          loadOrder.push({
            path: path.join(this.bundledSkillsPath, entry.name),
            source: 'bundled',
            priority: 0
          });
        }
      }
    } catch (error) {
      Logger.warn('Could not load bundled skills', { error: (error as Error).message });
    }

    loadOrder.sort((a, b) => b.priority - a.priority);

    for (const { path: skillPath, source } of loadOrder) {
      await this.loadSkill(skillPath, source);
    }
    
    await this.resolveDependencies();
    
    Logger.info(`Loaded ${this.skills.size} skills with priority order`);
  }

  private async resolveDependencies(): Promise<void> {
    const resolved = new Set<string>();
    const unresolved = new Set<string>();

    for (const skillName of this.skills.keys()) {
      if (!resolved.has(skillName)) {
        await this.resolveSkillDependencies(skillName, resolved, unresolved);
      }
    }

    if (unresolved.size > 0) {
      Logger.warn('Could not resolve skill dependencies', { 
        unresolved: Array.from(unresolved) 
      });
    }
  }

  private async resolveSkillDependencies(
    skillName: string,
    resolved: Set<string>,
    unresolved: Set<string>
  ): Promise<void> {
    if (resolved.has(skillName) || unresolved.has(skillName)) {
      return;
    }

    const skill = this.skills.get(skillName);
    if (!skill || !skill.metadata.dependencies) {
      resolved.add(skillName);
      return;
    }

    for (const dep of skill.metadata.dependencies) {
      if (!this.skills.has(dep)) {
        unresolved.add(skillName);
        Logger.warn(`Skill ${skillName} depends on missing skill ${dep}`);
        return;
      }

      await this.resolveSkillDependencies(dep, resolved, unresolved);
    }

    resolved.add(skillName);
  }

  private async setupHotReload(): Promise<void> {
    try {
      const watchPaths = [this.skillsPath, this.managedSkillsPath, this.bundledSkillsPath];
      
      this.watcher = chokidar.watch(watchPaths, {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        ignoreInitial: true
      });

      this.watcher.on('change', async (filePath) => {
        const skillName = path.basename(path.dirname(filePath));
        Logger.info(`Skill file changed: ${skillName}`);
        
        if (this.enableGating && !await this.checkSkillGating(skillName)) {
          Logger.warn(`Skill ${skillName} is gated, skipping reload`);
          return;
        }
        
        await this.reloadSkill(skillName);
      });

      this.watcher.on('add', async (filePath) => {
        const skillDir = path.dirname(filePath);
        const skillName = path.basename(skillDir);
        const skillPath = path.join(skillDir, 'SKILL.md');
        
        if (path.basename(filePath) === 'SKILL.md') {
          Logger.info(`New skill detected: ${skillName}`);
          
          const source = this.determineSkillSource(skillDir);
          await this.loadSkill(skillPath, source);
        }
      });

      this.watcher.on('unlink', async (filePath) => {
        const skillName = path.basename(path.dirname(filePath));
        Logger.info(`Skill removed: ${skillName}`);
        this.skills.delete(skillName);
      });

      Logger.info('Hot reload watcher started');
    } catch (error) {
      Logger.error('Failed to setup hot reload', { error: (error as Error).message });
    }
  }

  private determineSkillSource(skillPath: string): Skill['source'] {
    if (skillPath.startsWith(this.skillsPath)) {
      return 'workspace';
    } else if (skillPath.startsWith(this.managedSkillsPath)) {
      return 'managed';
    } else {
      return 'bundled';
    }
  }

  private async checkSkillGating(skillName: string): Promise<boolean> {
    if (!this.enableGating) {
      return true;
    }

    const skill = this.skills.get(skillName);
    if (!skill) {
      return true;
    }

    if (skill.metadata.requires?.bins) {
      for (const bin of skill.metadata.requires.bins) {
        try {
          await fs.access(bin, fs.constants.X_OK);
        } catch {
          Logger.warn(`Skill ${skillName} requires binary ${bin} which is not available`);
          return false;
        }
      }
    }

    if (skill.metadata.requires?.env) {
      for (const envVar of skill.metadata.requires.env) {
        if (!process.env[envVar]) {
          Logger.warn(`Skill ${skillName} requires environment variable ${envVar}`);
          return false;
        }
      }
    }

    return true;
  }

  async loadSkill(skillPath: string, source: Skill['source'] = 'workspace'): Promise<void> {
    try {
      const skillFilePath = path.join(skillPath, 'SKILL.md');
      
      const content = await fs.readFile(skillFilePath, 'utf-8');
      const metadata = this.parseMetadata(content);
      
      const skill: Skill = {
        metadata,
        content,
        path: skillPath,
        enabled: true,
        source,
        loadTime: new Date()
      };
      
      this.skills.set(metadata.name, skill);
      
      if (metadata.dependencies) {
        this.skillDependencies.set(metadata.name, metadata.dependencies);
      }
      
      Logger.info(`Skill loaded: ${metadata.name}`, { 
        category: metadata.category,
        emoji: metadata.emoji,
        source,
        priority: metadata.priority || 0
      });
    } catch (error) {
      Logger.warn(`Failed to load skill from ${skillPath}`, { 
        error: (error as Error).message 
      });
    }
  }

  async reloadSkills(): Promise<void> {
    Logger.info('Reloading all skills...');
    await this.loadSkillsWithPriority();
  }

  async reloadSkill(skillName: string): Promise<boolean> {
    const skill = this.skills.get(skillName);
    if (!skill) {
      return false;
    }
    
    if (this.enableGating && !await this.checkSkillGating(skillName)) {
      Logger.warn(`Skill ${skillName} is gated, skipping reload`);
      return false;
    }
    
    this.skills.delete(skillName);
    await this.loadSkill(skill.path, skill.source);
    
    Logger.info(`Skill reloaded: ${skillName}`);
    return this.skills.has(skillName);
  }

  async reloadSkillSource(source: Skill['source']): Promise<number> {
    let reloadedCount = 0;
    
    for (const [name, skill] of this.skills.entries()) {
      if (skill.source === source) {
        if (await this.reloadSkill(name)) {
          reloadedCount++;
        }
      }
    }
    
    Logger.info(`Reloaded ${reloadedCount} skills from ${source}`);
    return reloadedCount;
  }

  parseMetadata(content: string): SkillMetadata {
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontMatterMatch) {
      throw new Error('Invalid SKILL.md format: missing front matter');
    }
    
    try {
      const metadata = this.parseYAML(frontMatterMatch[1]);
      
      if (!metadata.name || !metadata.description) {
        throw new Error('Skill metadata must include name and description');
      }
      
      return metadata;
    } catch (error) {
      throw new Error(`Failed to parse skill metadata: ${(error as Error).message}`);
    }
  }

  private parseYAML(yaml: string): SkillMetadata {
    const metadata: any = {};
    const lines = yaml.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        const [, key, value] = match;
        
        if (key === 'requires') {
          metadata[key] = this.parseRequires(value);
        } else if (key === 'dependencies') {
          const depsMatch = value.match(/\[(.*?)\]/);
          if (depsMatch) {
            metadata[key] = depsMatch[1].split(',').map(s => s.trim());
          }
        } else if (key === 'priority') {
          metadata[key] = parseInt(value, 10);
        } else if (value === 'true' || value === 'false') {
          metadata[key] = value === 'true';
        } else if (!isNaN(Number(value))) {
          metadata[key] = Number(value);
        } else {
          metadata[key] = value;
        }
      }
    }
    
    return metadata as SkillMetadata;
  }

  private parseRequires(value: string): { bins?: string[]; env?: string[] } {
    const result: { bins?: string[]; env?: string[] } = {};
    
    if (value.includes('bins:')) {
      const binsMatch = value.match(/bins:\s*\[(.*?)\]/);
      if (binsMatch) {
        result.bins = binsMatch[1].split(',').map(s => s.trim());
      }
    }
    
    if (value.includes('env:')) {
      const envMatch = value.match(/env:\s*\[(.*?)\]/);
      if (envMatch) {
        result.env = envMatch[1].split(',').map(s => s.trim());
      }
    }
    
    return result;
  }

  matchSkills(query: string, context?: Record<string, unknown>): SkillMatch[] {
    const queryLower = query.toLowerCase();
    const matches: Array<{ skill: Skill; confidence: number; reason: string }> = [];
    
    for (const skill of this.skills.values()) {
      if (!skill.enabled) {
        continue;
      }
      
      if (this.enableGating && !this.checkSkillGating(skill.metadata.name)) {
        continue;
      }
      
      let confidence = 0;
      const reasons: string[] = [];
      
      const descLower = skill.metadata.description.toLowerCase();
      const contentLower = skill.content.toLowerCase();
      
      if (descLower.includes(queryLower) || contentLower.includes(queryLower)) {
        confidence += 30;
        reasons.push('Direct match in description or content');
      }
      
      const words = queryLower.split(/\s+/);
      let wordMatches = 0;
      for (const word of words) {
        if (descLower.includes(word) || contentLower.includes(word)) {
          wordMatches++;
        }
      }
      
      if (wordMatches > 0) {
        const wordScore = (wordMatches / words.length) * 20;
        confidence += wordScore;
        reasons.push(`Matched ${wordMatches}/${words.length} keywords`);
      }
      
      if (skill.metadata.category) {
        const categoryLower = skill.metadata.category.toLowerCase();
        if (categoryLower.includes(queryLower) || queryLower.includes(categoryLower)) {
          confidence += 15;
          reasons.push('Category match');
        }
      }
      
      if (skill.metadata.name.toLowerCase().includes(queryLower)) {
        confidence += 25;
        reasons.push('Name match');
      }
      
      if (skill.metadata.priority) {
        confidence += skill.metadata.priority * 0.1;
        reasons.push(`Priority bonus: ${skill.metadata.priority}`);
      }
      
      if (confidence > 0) {
        matches.push({
          skill,
          confidence: Math.min(confidence, 100),
          reason: reasons.join(', ')
        });
      }
    }
    
    matches.sort((a, b) => b.confidence - a.confidence);
    
    return matches;
  }

  getBestMatch(query: string, context?: Record<string, unknown>): SkillMatch | null {
    const matches = this.matchSkills(query, context);
    return matches.length > 0 ? matches[0] : null;
  }

  getSkill(name: string): Skill | undefined {
    return this.skills.get(name);
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  getSkillsBySource(source: Skill['source']): Skill[] {
    return Array.from(this.skills.values()).filter(s => s.source === source);
  }

  getEnabledSkills(): Skill[] {
    return Array.from(this.skills.values()).filter(s => s.enabled);
  }

  getSkillContent(name: string): string | undefined {
    const skill = this.skills.get(name);
    return skill?.content;
  }

  activateSkill(name: string): boolean {
    const skill = this.skills.get(name);
    if (skill) {
      skill.enabled = true;
      Logger.info(`Skill activated: ${name}`);
      return true;
    }
    return false;
  }

  deactivateSkill(name: string): boolean {
    const skill = this.skills.get(name);
    if (skill) {
      skill.enabled = false;
      Logger.info(`Skill deactivated: ${name}`);
      return true;
    }
    return false;
  }

  buildSkillsListPrompt(options: { 
    format?: 'list' | 'detailed' | 'compact';
    maxSkills?: number;
    category?: string;
    source?: Skill['source'];
  } = {}): string {
    const { format = 'list', maxSkills = 20, category, source } = options;
    
    let skills = this.getEnabledSkills();
    
    if (category) {
      skills = skills.filter(s => s.metadata.category === category);
    }
    
    if (source) {
      skills = skills.filter(s => s.source === source);
    }
    
    skills = skills.slice(0, maxSkills);
    
    if (skills.length === 0) {
      return 'No skills available.';
    }
    
    if (format === 'compact') {
      return skills.map(s => 
        `${s.metadata.emoji || '📦'} ${s.metadata.name}`
      ).join(', ');
    }
    
    let output = '## Available Skills\n\n';
    
    for (const skill of skills) {
      if (format === 'list') {
        const sourceLabel = skill.source === 'workspace' ? '🏠' : 
                           skill.source === 'managed' ? '📦' : '🔧';
        output += `- **${skill.metadata.emoji || '📦'} ${skill.metadata.name}** ${sourceLabel}: ${skill.metadata.description}\n`;
      } else {
        output += `### ${skill.metadata.emoji || '📦'} ${skill.metadata.name}\n`;
        output += `${skill.metadata.description}\n\n`;
        if (skill.metadata.category) {
          output += `**Category**: ${skill.metadata.category}\n`;
        }
        if (skill.metadata.version) {
          output += `**Version**: ${skill.metadata.version}\n`;
        }
        if (skill.metadata.author) {
          output += `**Author**: ${skill.metadata.author}\n`;
        }
        if (skill.metadata.priority) {
          output += `**Priority**: ${skill.metadata.priority}\n`;
        }
        output += `**Source**: ${skill.source}\n`;
        output += '\n';
      }
    }
    
    return output;
  }

  buildSkillUsageInstructions(): string {
    return `## Enhanced Skill Usage Instructions

When you need to use a skill, follow these steps:

1. **Identify relevant skill** based on user's request
2. **Check skill priority** - workspace skills have highest priority
3. **Load skill** using the format: \`LOAD_SKILL: skill_name\`
4. **Follow skill's instructions** as defined in the SKILL.md file
5. **Execute the required tools** to complete the task

**Example**:
User: "Help me analyze some CSV data"
Assistant: "I'll help you analyze the CSV data. Let me load the data-analysis skill."
Then: \`LOAD_SKILL: data-analysis\`

**Important**:
- Always load the highest priority skill that matches the request
- Skills provide specialized knowledge and workflows for specific tasks
- Workspace skills override managed and bundled skills
- If no skill matches the request, proceed with normal tool usage
- Skills are automatically reloaded when files change (hot reload enabled)`;
  }

  getStats(): { 
    total: number; 
    enabled: number; 
    disabled: number; 
    byCategory: Record<string, number>;
    bySource: Record<Skill['source'], number>;
  } {
    const skills = Array.from(this.skills.values());
    const byCategory: Record<string, number> = {};
    const bySource: Record<Skill['source'], number> = {
      workspace: 0,
      managed: 0,
      bundled: 0
    };
    let enabled = 0;
    
    for (const skill of skills) {
      if (skill.enabled) {
        enabled++;
      }
      
      if (skill.metadata.category) {
        byCategory[skill.metadata.category] = (byCategory[skill.metadata.category] || 0) + 1;
      }
      
      bySource[skill.source]++;
    }
    
    return {
      total: skills.length,
      enabled,
      disabled: skills.length - enabled,
      byCategory,
      bySource
    };
  }

  async cleanup(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      Logger.info('Hot reload watcher stopped');
    }
  }
}
