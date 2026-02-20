import { Tool, ToolResult } from '../../types';
import { Logger } from '../../utils/Logger';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as path from 'path';

const execAsync = promisify(exec);

export class ShellExecuteTool implements Tool {
  name = 'shell_execute';
  description = 'Execute a shell command with security measures';
  category = 'shell' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const command = params.command as string;
      const timeout = params.timeout as number || 30000;
      
      if (!command) {
        return { success: false, error: 'command is required' };
      }

      if (!this.isCommandSafe(command)) {
        return { 
          success: false, 
          error: 'Command contains potentially dangerous operations' 
        };
      }

      Logger.info('Executing shell command', { command });
      
      const { stdout, stderr } = await execAsync(command, {
        timeout,
        maxBuffer: 10 * 1024 * 1024
      });

      return {
        success: true,
        data: {
          command,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: 0
        }
      };
    } catch (error: any) {
      Logger.error('Shell command failed', { 
        error: error.message,
        command: params.command 
      });
      
      return {
        success: false,
        error: error.message,
        data: {
          command: params.command,
          stdout: error.stdout || '',
          stderr: error.stderr || '',
          exitCode: error.code || -1
        }
      };
    }
  }

  private isCommandSafe(command: string): boolean {
    const dangerousPatterns = [
      /rm\s+-rf\s+\//,
      /del\s+\/[sS]/,
      /format\s+[cC]:/,
      /mkfs/,
      /dd\s+if=.*of=/,
      />\s*\/dev\/(sd[a-z]|hd[a-z])/,
      /chmod\s+777\s+\//,
      /chown\s+-R\s+root/,
      /wget.*\|\s*sh/,
      /curl.*\|\s*bash/,
      /eval\s*\(/,
      />\s*\/dev\/null.*&&\s*rm/
    ];

    return !dangerousPatterns.some(pattern => pattern.test(command));
  }
}

export class ProcessListTool implements Tool {
  name = 'process_list';
  description = 'List running processes on the system';
  category = 'shell' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const platform = os.platform();
      let command: string;
      
      if (platform === 'win32') {
        command = 'tasklist /fo csv';
      } else {
        command = 'ps aux';
      }

      const { stdout } = await execAsync(command);
      
      return {
        success: true,
        data: {
          platform,
          processes: stdout.trim()
        }
      };
    } catch (error) {
      Logger.error('Process list failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to list processes: ${(error as Error).message}`
      };
    }
  }
}

export class SystemInfoTool implements Tool {
  name = 'system_info';
  description = 'Get system information and specifications';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const info = {
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        release: os.release(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        cpus: os.cpus(),
        networkInterfaces: os.networkInterfaces(),
        uptime: os.uptime(),
        homedir: os.homedir(),
        tmpdir: os.tmpdir()
      };

      return {
        success: true,
        data: info
      };
    } catch (error) {
      Logger.error('System info failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to get system info: ${(error as Error).message}`
      };
    }
  }
}

export class EnvironmentVariableTool implements Tool {
  name = 'env_get';
  description = 'Get environment variable value';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const varName = params.varName as string;
      
      if (!varName) {
        return { success: false, error: 'varName is required' };
      }

      const value = process.env[varName];
      
      return {
        success: true,
        data: {
          varName,
          value: value || null
        }
      };
    } catch (error) {
      Logger.error('Get environment variable failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to get environment variable: ${(error as Error).message}`
      };
    }
  }
}

export class EnvironmentListTool implements Tool {
  name = 'env_list';
  description = 'List all environment variables';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const envVars: Record<string, string> = {};
      
      for (const [key, value] of Object.entries(process.env)) {
        if (value !== undefined) {
          envVars[key] = value;
        }
      }

      return {
        success: true,
        data: {
          count: Object.keys(envVars).length,
          variables: envVars
        }
      };
    } catch (error) {
      Logger.error('List environment variables failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to list environment variables: ${(error as Error).message}`
      };
    }
  }
}

export class DirectoryChangeTool implements Tool {
  name = 'directory_change';
  description = 'Change current working directory';
  category = 'shell' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const dirPath = params.dirPath as string;
      
      if (!dirPath) {
        return { success: false, error: 'dirPath is required' };
      }

      const resolvedPath = path.resolve(dirPath);
      
      try {
        await execAsync(`cd "${resolvedPath}"`);
      } catch {
      }

      return {
        success: true,
        data: {
          oldPath: process.cwd(),
          newPath: resolvedPath
        }
      };
    } catch (error) {
      Logger.error('Directory change failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to change directory: ${(error as Error).message}`
      };
    }
  }
}

export class DirectoryGetCurrentTool implements Tool {
  name = 'directory_get_current';
  description = 'Get current working directory';
  category = 'shell' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const cwd = process.cwd();
      
      return {
        success: true,
        data: {
          currentDirectory: cwd
        }
      };
    } catch (error) {
      Logger.error('Get current directory failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to get current directory: ${(error as Error).message}`
      };
    }
  }
}

export class ProcessKillTool implements Tool {
  name = 'process_kill';
  description = 'Kill a process by PID';
  category = 'shell' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const pid = params.pid as number;
      
      if (!pid) {
        return { success: false, error: 'pid is required' };
      }

      const platform = os.platform();
      let command: string;
      
      if (platform === 'win32') {
        command = `taskkill /F /PID ${pid}`;
      } else {
        command = `kill ${pid}`;
      }

      await execAsync(command);
      
      return {
        success: true,
        data: {
          pid,
          killed: true
        }
      };
    } catch (error) {
      Logger.error('Process kill failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to kill process: ${(error as Error).message}`
      };
    }
  }
}
