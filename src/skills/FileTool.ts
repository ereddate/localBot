import { Tool, ToolResult } from '../types';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from '../utils/Logger';
import { ConsoleLogger } from '../utils/ConsoleLogger';

export class FileTool implements Tool {
  name = 'file_read';
  description = 'Read the contents of a file';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      ConsoleLogger.logSkillCall(this.name, params);
      const filePath = params.filePath as string;
      if (!filePath) {
        return { success: false, error: 'filePath is required' };
      }

      Logger.info(`Reading file: ${filePath}`);
      const content = await fs.readFile(filePath, 'utf-8');
      ConsoleLogger.logSkillSuccess(this.name, { fileSize: content.length });
      return { success: true, data: content };
    } catch (error) {
      ConsoleLogger.logSkillError(this.name, (error as Error).message);
      Logger.error(`Error reading file`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class FileWriteTool implements Tool {
  name = 'file_write';
  description = 'Write content to a file';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;
      const content = params.content as string;
      
      if (!filePath || content === undefined) {
        return { success: false, error: 'filePath and content are required' };
      }

      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      
      Logger.info(`Writing to file: ${filePath}`);
      await fs.writeFile(filePath, content, 'utf-8');
      return { success: true, data: { message: 'File written successfully' } };
    } catch (error) {
      Logger.error(`Error writing file`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class FileListTool implements Tool {
  name = 'file_list';
  description = 'List files in a directory';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const dirPath = params.dirPath as string || '.';
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      const files = entries.map(entry => ({
        name: entry.name,
        isDirectory: entry.isDirectory(),
      }));

      Logger.info(`Listed directory: ${dirPath}`, { count: files.length });
      return { success: true, data: files };
    } catch (error) {
      Logger.error(`Error listing directory`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class FileDeleteTool implements Tool {
  name = 'file_delete';
  description = 'Delete a file';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;
      if (!filePath) {
        return { success: false, error: 'filePath is required' };
      }

      Logger.warn(`Deleting file: ${filePath}`);
      await fs.unlink(filePath);
      return { success: true, data: { message: 'File deleted successfully' } };
    } catch (error) {
      Logger.error(`Error deleting file`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}
