import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export class LogManagementTool implements Tool {
  name = 'log_management';
  description = 'Manage and analyze log files (read, filter, search)';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const operation = params.operation as string;
      const logPath = params.logPath as string;
      const filterPattern = params.filterPattern as string;
      const maxLines = params.maxLines as number || 100;

      if (!operation) {
        return { success: false, error: 'operation is required (read, search, analyze)' };
      }

      if (!logPath) {
        return { success: false, error: 'logPath is required' };
      }

      switch (operation.toLowerCase()) {
        case 'read':
          return await this.readLog(logPath, maxLines);
        case 'search':
          if (!filterPattern) {
            return { success: false, error: 'filterPattern is required for search operation' };
          }
          return await this.searchLog(logPath, filterPattern);
        case 'analyze':
          return await this.analyzeLog(logPath);
        default:
          return { success: false, error: 'Invalid operation. Use: read, search, or analyze' };
      }
    } catch (error) {
      Logger.error(`Log management operation failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }

  private async readLog(logPath: string, maxLines: number): Promise<ToolResult> {
    try {
      await fs.access(logPath);
      
      // Read the last N lines of the log file
      const content = await fs.readFile(logPath, 'utf-8');
      const lines = content.split('\n');
      const lastLines = lines.slice(-maxLines);
      
      return {
        success: true,
        data: {
          logPath,
          linesRead: lastLines.length,
          content: lastLines.join('\n'),
          totalLines: lines.length,
          message: `Last ${lastLines.length} lines read from log file`
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async searchLog(logPath: string, pattern: string): Promise<ToolResult> {
    try {
      await fs.access(logPath);
      
      const content = await fs.readFile(logPath, 'utf-8');
      const lines = content.split('\n');
      const matchedLines = lines.filter(line => line.toLowerCase().includes(pattern.toLowerCase()));
      
      return {
        success: true,
        data: {
          logPath,
          pattern,
          matchesCount: matchedLines.length,
          matches: matchedLines.slice(0, 50), // Limit to first 50 matches
          message: `${matchedLines.length} lines matched the pattern '${pattern}'`
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async analyzeLog(logPath: string): Promise<ToolResult> {
    try {
      await fs.access(logPath);
      
      const content = await fs.readFile(logPath, 'utf-8');
      const lines = content.split('\n');
      
      // Basic log analysis
      const stats: Record<string, number> = {
        totalLines: lines.length,
        errorLines: 0,
        warnLines: 0,
        infoLines: 0,
        debugLines: 0
      };
      
      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('error')) stats.errorLines++;
        if (lowerLine.includes('warn')) stats.warnLines++;
        if (lowerLine.includes('info')) stats.infoLines++;
        if (lowerLine.includes('debug')) stats.debugLines++;
      }
      
      return {
        success: true,
        data: {
          logPath,
          stats,
          message: 'Log analysis completed'
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}

export class ConfigManagementTool implements Tool {
  name = 'config_management';
  description = 'Manage configuration files (read, write, update)';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const operation = params.operation as string;
      const configPath = params.configPath as string;
      const key = params.key as string;
      const value = params.value;

      if (!operation) {
        return { success: false, error: 'operation is required (read, write, update, get)' };
      }

      if (!configPath) {
        return { success: false, error: 'configPath is required' };
      }

      switch (operation.toLowerCase()) {
        case 'read':
          return await this.readConfig(configPath);
        case 'write':
          return await this.writeConfig(configPath, params.configData);
        case 'get':
          if (!key) {
            return { success: false, error: 'key is required for get operation' };
          }
          return await this.getConfigValue(configPath, key);
        case 'set':
          if (!key) {
            return { success: false, error: 'key is required for set operation' };
          }
          return await this.setConfigValue(configPath, key, value);
        default:
          return { success: false, error: 'Invalid operation. Use: read, write, get, or set' };
      }
    } catch (error) {
      Logger.error(`Config management operation failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }

  private async readConfig(configPath: string): Promise<ToolResult> {
    try {
      await fs.access(configPath);
      
      const content = await fs.readFile(configPath, 'utf-8');
      let config: any = {};
      
      // Try to parse as JSON first, then as plain text
      try {
        config = JSON.parse(content);
      } catch {
        // If not JSON, try to parse as key=value pairs
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.includes('=')) {
            const [k, v] = line.split('=', 2);
            config[k.trim()] = v.trim();
          }
        }
      }
      
      return {
        success: true,
        data: {
          configPath,
          config,
          format: 'json',
          message: 'Configuration file read successfully'
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async writeConfig(configPath: string, configData: any): Promise<ToolResult> {
    try {
      const dir = path.dirname(configPath);
      await fs.mkdir(dir, { recursive: true });
      
      const content = JSON.stringify(configData, null, 2);
      await fs.writeFile(configPath, content);
      
      return {
        success: true,
        data: {
          configPath,
          message: 'Configuration file written successfully'
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async getConfigValue(configPath: string, key: string): Promise<ToolResult> {
    try {
      const readResult = await this.readConfig(configPath);
      if (!readResult.success) {
        return readResult;
      }
      
      const config = (readResult as any).data.config;
      const value = this.getNestedValue(config, key);
      
      return {
        success: true,
        data: {
          configPath,
          key,
          value,
          message: `Configuration value retrieved for key: ${key}`
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async setConfigValue(configPath: string, key: string, value: any): Promise<ToolResult> {
    try {
      const readResult = await this.readConfig(configPath);
      let config = {};
      
      if (readResult.success) {
        config = (readResult as any).data.config;
      }
      
      this.setNestedValue(config, key, value);
      const writeResult = await this.writeConfig(configPath, config);
      
      return writeResult;
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private getNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current && typeof current === 'object') {
        current = current[key];
      } else {
        return undefined;
      }
    }
    
    return current;
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
  }
}