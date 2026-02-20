import { Tool, ToolResult } from '../../types';
import { Logger } from '../../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';

export class FileReadTool implements Tool {
  name = 'file_read';
  description = 'Read content from a file';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;
      
      if (!filePath) {
        return { success: false, error: 'filePath is required' };
      }

      const content = await fs.readFile(filePath, 'utf-8');
      
      return {
        success: true,
        data: {
          filePath,
          content,
          size: content.length
        }
      };
    } catch (error) {
      Logger.error('File read failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to read file: ${(error as Error).message}`
      };
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
      
      await fs.writeFile(filePath, content, 'utf-8');
      
      return {
        success: true,
        data: {
          filePath,
          size: content.length
        }
      };
    } catch (error) {
      Logger.error('File write failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to write file: ${(error as Error).message}`
      };
    }
  }
}

export class FileListTool implements Tool {
  name = 'file_list';
  description = 'List files in a directory with optional filtering';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const dirPath = params.dirPath as string || '.';
      const pattern = params.pattern as string || '*';
      const recursive = params.recursive as boolean || false;
      
      const files: string[] = [];
      
      if (recursive) {
        await this.listRecursive(dirPath, pattern, files);
      } else {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          if (this.matchPattern(entry.name, pattern)) {
            files.push(path.join(dirPath, entry.name));
          }
        }
      }
      
      return {
        success: true,
        data: {
          dirPath,
          files,
          count: files.length
        }
      };
    } catch (error) {
      Logger.error('File list failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to list files: ${(error as Error).message}`
      };
    }
  }

  private async listRecursive(dirPath: string, pattern: string, files: string[]): Promise<void> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        await this.listRecursive(fullPath, pattern, files);
      } else if (this.matchPattern(entry.name, pattern)) {
        files.push(fullPath);
      }
    }
  }

  private matchPattern(filename: string, pattern: string): boolean {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    return regex.test(filename);
  }
}

export class FileDeleteTool implements Tool {
  name = 'file_delete';
  description = 'Delete a file or directory';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;
      
      if (!filePath) {
        return { success: false, error: 'filePath is required' };
      }

      const stats = await fs.stat(filePath);
      
      if (stats.isDirectory()) {
        await fs.rm(filePath, { recursive: true, force: true });
      } else {
        await fs.unlink(filePath);
      }
      
      return {
        success: true,
        data: {
          filePath,
          deleted: true
        }
      };
    } catch (error) {
      Logger.error('File delete failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to delete file: ${(error as Error).message}`
      };
    }
  }
}

export class FileCopyTool implements Tool {
  name = 'file_copy';
  description = 'Copy a file or directory';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const sourcePath = params.sourcePath as string;
      const destPath = params.destPath as string;
      
      if (!sourcePath || !destPath) {
        return { success: false, error: 'sourcePath and destPath are required' };
      }

      const stats = await fs.stat(sourcePath);
      
      if (stats.isDirectory()) {
        await this.copyDirectory(sourcePath, destPath);
      } else {
        await fs.copyFile(sourcePath, destPath);
      }
      
      return {
        success: true,
        data: {
          sourcePath,
          destPath,
          copied: true
        }
      };
    } catch (error) {
      Logger.error('File copy failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to copy file: ${(error as Error).message}`
      };
    }
  }

  private async copyDirectory(source: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    
    const entries = await fs.readdir(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
}

export class FileMoveTool implements Tool {
  name = 'file_move';
  description = 'Move or rename a file or directory';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const sourcePath = params.sourcePath as string;
      const destPath = params.destPath as string;
      
      if (!sourcePath || !destPath) {
        return { success: false, error: 'sourcePath and destPath are required' };
      }

      await fs.rename(sourcePath, destPath);
      
      return {
        success: true,
        data: {
          sourcePath,
          destPath,
          moved: true
        }
      };
    } catch (error) {
      Logger.error('File move failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to move file: ${(error as Error).message}`
      };
    }
  }
}

export class FileStatTool implements Tool {
  name = 'file_stat';
  description = 'Get file or directory statistics';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;
      
      if (!filePath) {
        return { success: false, error: 'filePath is required' };
      }

      const stats = await fs.stat(filePath);
      
      return {
        success: true,
        data: {
          filePath,
          size: stats.size,
          isFile: stats.isFile(),
          isDirectory: stats.isDirectory(),
          created: stats.birthtime,
          modified: stats.mtime,
          accessed: stats.atime
        }
      };
    } catch (error) {
      Logger.error('File stat failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to get file stats: ${(error as Error).message}`
      };
    }
  }
}
