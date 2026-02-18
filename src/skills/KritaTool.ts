import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class KritaTool implements Tool {
  name = 'krita_tool';
  description = 'Launch Krita graphics editor for drawing and image editing';
  category = 'system' as const;

  parameters = [
    {
      name: 'action',
      type: 'string',
      required: true,
      description: 'Action to perform (launch, open, create, close)',
      enum: ['launch', 'open', 'create', 'close']
    },
    {
      name: 'filePath',
      type: 'string',
      required: false,
      description: 'Path to image file to open (for open action)'
    },
    {
      name: 'width',
      type: 'number',
      required: false,
      description: 'Canvas width in pixels (for create action)'
    },
    {
      name: 'height',
      type: 'number',
      required: false,
      description: 'Canvas height in pixels (for create action)'
    },
    {
      name: 'dpi',
      type: 'number',
      required: false,
      description: 'DPI resolution (default: 300)'
    }
  ];

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const action = params.action as string;
      const filePath = params.filePath as string;
      const width = params.width as number;
      const height = params.height as number;
      const dpi = params.dpi as number || 300;

      if (!action) {
        return { success: false, error: 'action is required' };
      }

      switch (action) {
        case 'launch':
          return await this.launchKrita();
        case 'open':
          return await this.openFile(filePath);
        case 'create':
          return await this.createNewCanvas(width, height, dpi);
        case 'close':
          return await this.closeKrita();
        default:
          return { success: false, error: `Unknown action: ${action}` };
      }
    } catch (error) {
      Logger.error('Krita tool failed', { error: (error as Error).message, params });
      return { 
        success: false, 
        error: `Krita tool failed: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  private async launchKrita(): Promise<ToolResult> {
    try {
      // Try to launch Krita
      const command = process.platform === 'win32' ? 'start krita' : 'krita &';
      
      await execAsync(command);
      
      Logger.info('Krita launched successfully');
      
      return {
        success: true,
        data: {
          message: 'Krita graphics editor has been launched successfully',
          action: 'launch',
          instructions: [
            'Krita is now running',
            'You can start drawing or editing images',
            'Use the tools menu to access various drawing features',
            'Save your work using File > Save or Ctrl+S'
          ]
        }
      };
    } catch (error) {
      // If Krita is not installed, provide helpful information
      return {
        success: false,
        error: 'Krita is not installed or not found in PATH',
        data: {
          message: 'Krita installation required',
          instructions: [
            'Krita is a free and open-source graphics editor',
            'Download from: https://krita.org/en/download/',
            'Install Krita and add it to your system PATH',
            'After installation, try launching again'
          ]
        }
      };
    }
  }

  private async openFile(filePath: string): Promise<ToolResult> {
    if (!filePath) {
      return { success: false, error: 'filePath is required for open action' };
    }

    try {
      // Check if file exists
      await fs.access(filePath);
      
      const command = process.platform === 'win32' 
        ? `start krita "${filePath}"` 
        : `krita "${filePath}" &`;
      
      await execAsync(command);
      
      Logger.info(`Krita opened file: ${filePath}`);
      
      return {
        success: true,
        data: {
          message: `Krita has opened the file: ${filePath}`,
          action: 'open',
          filePath,
          fileName: path.basename(filePath),
          instructions: [
            'The file has been opened in Krita',
            'You can now edit the image',
            'Use the drawing tools to modify the image',
            'Save your changes using File > Save or Ctrl+S'
          ]
        }
      };
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return { success: false, error: `File not found: ${filePath}` };
      }
      throw error;
    }
  }

  private async createNewCanvas(width: number, height: number, dpi: number): Promise<ToolResult> {
    if (!width || !height) {
      return { success: false, error: 'width and height are required for create action' };
    }

    try {
      // Create a temporary file with specified dimensions
      const tempDir = process.env.TEMP || process.env.TMP || '/tmp';
      const tempFile = path.join(tempDir, `krita_canvas_${Date.now()}.kra`);
      
      // For now, we'll just launch Krita and let the user create a new document
      // In a more advanced implementation, we could create a .kra file with specified dimensions
      
      const command = process.platform === 'win32' ? 'start krita' : 'krita &';
      await execAsync(command);
      
      Logger.info(`Krita launched for new canvas: ${width}x${height} @ ${dpi} DPI`);
      
      return {
        success: true,
        data: {
          message: `Krita has been launched. Create a new canvas with dimensions: ${width}x${height} @ ${dpi} DPI`,
          action: 'create',
          canvas: {
            width,
            height,
            dpi
          },
          instructions: [
            'Krita is now running',
            'Go to File > New to create a new document',
            `Set dimensions to: ${width}x${height}`,
            `Set DPI to: ${dpi}`,
            'Click Create to start drawing'
          ]
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to create new canvas: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  private async closeKrita(): Promise<ToolResult> {
    try {
      // Try to close Krita process
      const command = process.platform === 'win32' 
        ? 'taskkill /F /IM krita.exe' 
        : 'pkill -f krita';
      
      await execAsync(command);
      
      Logger.info('Krita closed successfully');
      
      return {
        success: true,
        data: {
          message: 'Krita has been closed',
          action: 'close',
          instructions: [
            'Krita process has been terminated',
            'Any unsaved work may be lost',
            'Make sure to save your work before closing'
          ]
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: `Failed to close Krita: ${error instanceof Error ? error.message : String(error)}`,
        data: {
          message: 'Krita may not be running',
          instructions: [
            'Krita process not found',
            'It may have already been closed',
            'Or it may not be installed'
          ]
        }
      };
    }
  }
}
