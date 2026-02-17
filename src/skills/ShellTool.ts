import { Tool, ToolResult } from '../types';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Logger } from '../utils/Logger';

const execAsync = promisify(exec);

export class ShellTool implements Tool {
  name = 'shell_execute';
  description = 'Execute a shell command';
  category = 'shell' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const command = params.command as string;
      if (!command) {
        return { success: false, error: 'command is required' };
      }

      Logger.warn(`Executing shell command: ${command}`);
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10,
      });

      Logger.info(`Shell command completed`, { 
        hasOutput: !!stdout,
        hasError: !!stderr 
      });

      return {
        success: true,
        data: {
          stdout,
          stderr,
        },
      };
    } catch (error) {
      Logger.error(`Shell command failed`, { error: (error as Error).message });
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}
