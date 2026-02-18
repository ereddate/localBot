import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';

export class ImageViewerTool implements Tool {
  name = 'image_viewer';
  description = 'View and display image files with detailed information';
  category = 'system' as const;

  parameters = [
    {
      name: 'imagePath',
      type: 'string',
      required: true,
      description: 'Path to the image file to view'
    },
    {
      name: 'format',
      type: 'string',
      required: false,
      description: 'Output format (text, json, or detailed)',
      enum: ['text', 'json', 'detailed']
    }
  ];

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const imagePath = params.imagePath as string;
      const format = params.format as string || 'text';

      if (!imagePath) {
        return { success: false, error: 'imagePath is required' };
      }

      // Check if file exists
      try {
        await fs.access(imagePath);
      } catch {
        return { success: false, error: `Image file not found: ${imagePath}` };
      }

      // Get file stats
      const stats = await fs.stat(imagePath);
      const fileSize = stats.size;
      const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

      // Get file extension
      const ext = path.extname(imagePath).toLowerCase();
      const supportedFormats = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'];
      
      if (!supportedFormats.includes(ext)) {
        return { success: false, error: `Unsupported image format: ${ext}. Supported formats: ${supportedFormats.join(', ')}` };
      }

      // Read file as base64 for display
      const imageBuffer = await fs.readFile(imagePath);
      const base64Data = imageBuffer.toString('base64');
      const dataUrl = `data:image/${ext.substring(1)};base64,${base64Data}`;

      const result: any = {
        imagePath,
        fileName: path.basename(imagePath),
        fileSize: `${fileSizeMB} MB`,
        fileSizeBytes: fileSize,
        format: ext.substring(1),
        dimensions: this.estimateDimensions(imagePath, ext),
        lastModified: stats.mtime,
        dataUrl: dataUrl
      };

      if (format === 'json') {
        return { success: true, data: result };
      } else if (format === 'detailed') {
        return { 
          success: true, 
          data: {
            ...result,
            description: `Image viewer loaded: ${path.basename(imagePath)}`,
            displayInstructions: [
              '1. Image has been loaded and converted to base64 format',
              '2. You can view this image in a browser or image viewer',
              '3. The data URL can be used in HTML <img> tags',
              `4. File size: ${fileSizeMB} MB`
            ]
          }
        };
      } else {
        return {
          success: true,
          data: `
## Image Viewer

**File**: ${path.basename(imagePath)}
**Path**: ${imagePath}
**Format**: ${ext.substring(1)}
**Size**: ${fileSizeMB} MB (${fileSize.toLocaleString()} bytes)
**Last Modified**: ${stats.mtime.toLocaleString('zh-CN')}

### Image Information
- Dimensions: ${result.dimensions.width}x${result.dimensions.height} (estimated)
- Type: ${this.getImageType(ext)}
- File Size: ${fileSizeMB} MB

### How to View
1. The image has been loaded and converted to base64 format
2. You can copy the data URL below and use it in an HTML <img> tag
3. Or use an external image viewer to open the file directly

### Data URL
${dataUrl.substring(0, 100)}... (truncated, use json format for full data URL)

Use format='json' to get the complete base64 data URL.
`
        };
      }
    } catch (error) {
      Logger.error('Image viewer failed', { error: (error as Error).message, params });
      return { 
        success: false, 
        error: `Image viewer failed: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  private estimateDimensions(imagePath: string, ext: string): { width: number; height: number } {
    // This is a simplified estimation - in a real implementation,
    // you would use a library like 'sharp' or 'jimp' to get actual dimensions
    const filename = path.basename(imagePath);
    
    // Return estimated dimensions based on filename patterns
    if (filename.includes('1920x1080')) {
      return { width: 1920, height: 1080 };
    } else if (filename.includes('1280x720')) {
      return { width: 1280, height: 720 };
    } else if (filename.includes('800x600')) {
      return { width: 800, height: 600 };
    } else {
      // Default estimation for common image sizes
      return { width: 1920, height: 1080 };
    }
  }

  private getImageType(ext: string): string {
    const types: Record<string, string> = {
      '.png': 'PNG (Portable Network Graphics)',
      '.jpg': 'JPEG (Joint Photographic Experts Group)',
      '.jpeg': 'JPEG (Joint Photographic Experts Group)',
      '.gif': 'GIF (Graphics Interchange Format)',
      '.bmp': 'BMP (Bitmap Image)',
      '.webp': 'WebP (Web Picture Format)',
      '.svg': 'SVG (Scalable Vector Graphics)'
    };
    return types[ext] || 'Unknown';
  }
}
