import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface SkillMetadata {
  name: string;
  description: string;
  emoji?: string;
  category?: string;
  version?: string;
  author?: string;
  requires?: {
    bins?: string[];
    env?: string[];
  };
}

export interface Skill {
  metadata: SkillMetadata;
  content: string;
  path: string;
  enabled: boolean;
}

export interface SkillMatch {
  skill: Skill;
  confidence: number;
  reason: string;
}

export interface SkillsHubConfig {
  skillsPath?: string;
  autoLoad?: boolean;
  enableDiscovery?: boolean;
}

export class SkillsHub {
  private skills: Map<string, Skill> = new Map();
  private skillsPath: string;
  private autoLoad: boolean;
  private enableDiscovery: boolean;
  private initialized: boolean = false;

  constructor(config: SkillsHubConfig = {}) {
    this.skillsPath = config.skillsPath || './workspace/skills';
    this.autoLoad = config.autoLoad ?? true;
    this.enableDiscovery = config.enableDiscovery ?? false;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      Logger.warn('SkillsHub already initialized');
      return;
    }

    try {
      await fs.mkdir(this.skillsPath, { recursive: true });
      
      if (this.autoLoad) {
        await this.loadSkills();
      }
      
      this.initialized = true;
      Logger.info('SkillsHub initialized', { 
        skillsCount: this.skills.size,
        skillsPath: this.skillsPath 
      });
    } catch (error) {
      Logger.error('Failed to initialize SkillsHub', { 
        error: (error as Error).message 
      });
      throw error;
    }
  }

  async loadSkills(): Promise<void> {
    try {
      const entries = await fs.readdir(this.skillsPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const skillPath = path.join(this.skillsPath, entry.name);
          await this.loadSkill(skillPath);
        }
      }
      
      Logger.info(`Loaded ${this.skills.size} skills from ${this.skillsPath}`);
    } catch (error) {
      Logger.error('Failed to load skills', { 
        error: (error as Error).message 
      });
    }
  }

  async loadSkill(skillPath: string): Promise<void> {
    try {
      const skillFilePath = path.join(skillPath, 'SKILL.md');
      
      const content = await fs.readFile(skillFilePath, 'utf-8');
      const metadata = this.parseMetadata(content);
      
      const skill: Skill = {
        metadata,
        content,
        path: skillPath,
        enabled: true
      };
      
      this.skills.set(metadata.name, skill);
      Logger.info(`Skill loaded: ${metadata.name}`, { 
        category: metadata.category,
        emoji: metadata.emoji 
      });
    } catch (error) {
      Logger.warn(`Failed to load skill from ${skillPath}`, { 
        error: (error as Error).message 
      });
    }
  }

  async reloadSkills(): Promise<void> {
    this.skills.clear();
    await this.loadSkills();
    Logger.info('Skills reloaded');
  }

  async reloadSkill(skillName: string): Promise<boolean> {
    const skill = this.skills.get(skillName);
    if (!skill) {
      return false;
    }
    
    this.skills.delete(skillName);
    await this.loadSkill(skill.path);
    
    return this.skills.has(skillName);
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
  } = {}): string {
    const { format = 'list', maxSkills = 20, category } = options;
    
    let skills = this.getEnabledSkills();
    
    if (category) {
      skills = skills.filter(s => s.metadata.category === category);
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
        output += `- **${skill.metadata.emoji || '📦'} ${skill.metadata.name}**: ${skill.metadata.description}\n`;
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
        output += '\n';
      }
    }
    
    return output;
  }

  buildSkillUsageInstructions(): string {
    return `## Skill Usage Instructions

When you need to use a skill, follow these steps:

1. **Identify the relevant skill** based on the user's request
2. **Load the skill** using the format: \`LOAD_SKILL: skill_name\`
3. **Follow the skill's instructions** as defined in the SKILL.md file
4. **Execute the required tools** to complete the task

**Example**:
User: "Help me analyze some CSV data"
Assistant: "I'll help you analyze the CSV data. Let me load the data-analysis skill."
Then: \`LOAD_SKILL: data-analysis\`

**Important**:
- Always load the relevant skill before using its associated tools
- Skills provide specialized knowledge and workflows for specific tasks
- If no skill matches the request, proceed with normal tool usage`;
  }

  getStats(): { 
    total: number; 
    enabled: number; 
    disabled: number; 
    byCategory: Record<string, number> 
  } {
    const skills = Array.from(this.skills.values());
    const byCategory: Record<string, number> = {};
    let enabled = 0;
    
    for (const skill of skills) {
      if (skill.enabled) {
        enabled++;
      }
      
      if (skill.metadata.category) {
        byCategory[skill.metadata.category] = (byCategory[skill.metadata.category] || 0) + 1;
      }
    }
    
    return {
      total: skills.length,
      enabled,
      disabled: skills.length - enabled,
      byCategory
    };
  }

  async discoverSkills(): Promise<void> {
    if (!this.enableDiscovery) {
      Logger.warn('Skill discovery is disabled');
      return;
    }
    
    try {
      const entries = await fs.readdir(this.skillsPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && !this.skills.has(entry.name)) {
          const skillPath = path.join(this.skillsPath, entry.name);
          await this.loadSkill(skillPath);
        }
      }
      
      Logger.info(`Discovered ${this.skills.size} skills`);
    } catch (error) {
      Logger.error('Failed to discover skills', { 
        error: (error as Error).message 
      });
    }
  }

  async createSkill(name: string, metadata: SkillMetadata, content: string): Promise<void> {
    const skillPath = path.join(this.skillsPath, name);
    await fs.mkdir(skillPath, { recursive: true });
    
    const skillFilePath = path.join(skillPath, 'SKILL.md');
    const yaml = this.metadataToYAML(metadata);
    const fullContent = `---\n${yaml}---\n\n${content}`;
    
    await fs.writeFile(skillFilePath, fullContent, 'utf-8');
    
    await this.loadSkill(skillPath);
    Logger.info(`Skill created: ${name}`);
  }

  private metadataToYAML(metadata: SkillMetadata): string {
    let yaml = '';
    
    for (const [key, value] of Object.entries(metadata)) {
      if (key === 'requires' && value) {
        yaml += `requires:\n`;
        if (value.bins && value.bins.length > 0) {
          yaml += `  bins: [${value.bins.join(', ')}]\n`;
        }
        if (value.env && value.env.length > 0) {
          yaml += `  env: [${value.env.join(', ')}]\n`;
        }
      } else if (value !== undefined && value !== null) {
        yaml += `${key}: ${value}\n`;
      }
    }
    
    return yaml;
  }
}
