import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

export class ImageProcessingTool implements Tool {
  name = 'image_processing';
  description = '图像处理工具，支持基本的图像操作和处理功能';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const operation = params.operation as string;
      const imageUrl = params.imageUrl as string;
      const width = params.width ? parseInt(params.width as string) : undefined;
      const height = params.height ? parseInt(params.height as string) : undefined;
      const format = params.format as string;
      const quality = params.quality ? parseInt(params.quality as string) : 80;

      if (!operation) {
        return { success: false, error: 'Operation is required. Available operations: resize, convert_format, compress, get_info, crop, rotate' };
      }

      switch (operation.toLowerCase()) {
        case 'resize':
          if (!imageUrl) {
            return { success: false, error: 'Image URL is required for resizing' };
          }
          if (!width && !height) {
            return { success: false, error: 'Either width or height is required for resizing' };
          }
          return this.resizeImage(imageUrl, width, height);

        case 'convert_format':
          if (!imageUrl || !format) {
            return { success: false, error: 'Image URL and target format are required for format conversion' };
          }
          return this.convertFormat(imageUrl, format);

        case 'compress':
          if (!imageUrl) {
            return { success: false, error: 'Image URL is required for compression' };
          }
          return this.compressImage(imageUrl, quality);

        case 'get_info':
          if (!imageUrl) {
            return { success: false, error: 'Image URL is required for getting image information' };
          }
          return this.getImageInfo(imageUrl);

        case 'crop':
          if (!imageUrl) {
            return { success: false, error: 'Image URL is required for cropping' };
          }
          return this.cropImage(
            imageUrl,
            params.x ? parseInt(params.x as string) : 0,
            params.y ? parseInt(params.y as string) : 0,
            width,
            height
          );

        case 'rotate':
          if (!imageUrl) {
            return { success: false, error: 'Image URL is required for rotation' };
          }
          const angle = params.angle ? parseInt(params.angle as string) : 90;
          return this.rotateImage(imageUrl, angle);

        default:
          return { success: false, error: `Unsupported operation: ${operation}. Available operations: resize, convert_format, compress, get_info, crop, rotate` };
      }
    } catch (error) {
      Logger.error('Image processing tool error', { error: (error as Error).message });
      return { success: false, error: `Failed to execute image processing operation: ${(error as Error).message}` };
    }
  }

  private async resizeImage(imageUrl: string, width?: number, height?: number): Promise<ToolResult> {
    // 在实际应用中，这里会执行真实的图像缩放操作
    // 为了演示目的，我们返回模拟结果
    
    // 如果只提供宽度或高度，则按比例计算另一个维度
    let calculatedWidth = width;
    let calculatedHeight = height;
    
    if (width && !height) {
      // 假设原图比例为 4:3，根据宽度计算高度
      calculatedHeight = Math.round(width * 0.75);
    } else if (!width && height) {
      // 假设原图比例为 4:3，根据高度计算宽度
      calculatedWidth = Math.round(height * 1.33);
    } else if (!width && !height) {
      // 不应该发生，但为了安全起见
      return { success: false, error: 'Either width or height must be provided' };
    }

    const resizedImage = {
      originalUrl: imageUrl,
      operation: 'resize',
      dimensions: {
        original: { width: 1920, height: 1080 },
        new: { width: calculatedWidth, height: calculatedHeight }
      },
      format: 'jpg',
      size: this.calculateNewSize(1024 * 1024, calculatedWidth!, calculatedHeight!), // 假设原图1MB
      processedUrl: `resized_${calculatedWidth}x${calculatedHeight}_${imageUrl.split('/').pop()}`
    };

    return {
      success: true,
      data: {
        message: `Image resized to ${calculatedWidth}x${calculatedHeight}`,
        image: resizedImage
      }
    };
  }

  private async convertFormat(imageUrl: string, format: string): Promise<ToolResult> {
    const validFormats = ['jpg', 'png', 'gif', 'webp', 'bmp', 'tiff'];
    
    if (!validFormats.includes(format.toLowerCase())) {
      return { success: false, error: `Invalid format: ${format}. Valid formats: ${validFormats.join(', ')}` };
    }

    const convertedImage = {
      originalUrl: imageUrl,
      operation: 'format_conversion',
      originalFormat: 'jpg', // 假设原图为JPG
      newFormat: format.toLowerCase(),
      convertedUrl: imageUrl.replace(/\.(jpg|jpeg|png|gif|webp|bmp|tiff)$/i, `.${format.toLowerCase()}`)
    };

    return {
      success: true,
      data: {
        message: `Image converted to ${format.toUpperCase()} format`,
        image: convertedImage
      }
    };
  }

  private async compressImage(imageUrl: string, quality: number): Promise<ToolResult> {
    // 验证质量参数
    if (quality < 1 || quality > 100) {
      return { success: false, error: 'Quality must be between 1 and 100' };
    }

    // 计算压缩后的大小（假设原始大小为1MB）
    const originalSize = 1024 * 1024; // 1MB
    const compressedSize = Math.max(10 * 1024, originalSize * (quality / 100)); // 最小10KB

    const compressedImage = {
      originalUrl: imageUrl,
      operation: 'compression',
      originalSize: originalSize,
      compressedSize: compressedSize,
      quality: quality,
      compressionRatio: `${Math.round((compressedSize / originalSize) * 100)}%`,
      compressedUrl: `compressed_quality${quality}_${imageUrl.split('/').pop()}`
    };

    return {
      success: true,
      data: {
        message: `Image compressed with quality ${quality}%`,
        image: compressedImage
      }
    };
  }

  private async getImageInfo(imageUrl: string): Promise<ToolResult> {
    // 模拟获取图像信息
    const imageInfo = {
      url: imageUrl,
      format: imageUrl.split('.').pop()?.toLowerCase() || 'jpg',
      dimensions: {
        width: 1920,
        height: 1080
      },
      size: 1024 * 1024, // 1MB
      colorSpace: 'RGB',
      bitDepth: 8,
      dpi: 72,
      channels: 3,
      mimeType: 'image/jpeg',
      estimatedFileSize: '1.0 MB',
      aspectRatio: '16:9',
      isAnimated: false,
      hasTransparency: false,
      cameraInfo: {
        make: 'Simulated Camera',
        model: 'Digital SLR',
        exposureTime: '1/125',
        aperture: 'f/4.0',
        iso: 400,
        focalLength: '50mm'
      }
    };

    return {
      success: true,
      data: {
        message: 'Image information retrieved',
        image: imageInfo
      }
    };
  }

  private async cropImage(imageUrl: string, x: number, y: number, width?: number, height?: number): Promise<ToolResult> {
    // 设置默认裁剪尺寸
    const cropWidth = width || 500;
    const cropHeight = height || 500;

    // 验证坐标和尺寸
    if (x < 0 || y < 0 || cropWidth <= 0 || cropHeight <= 0) {
      return { success: false, error: 'Invalid crop parameters. X, Y must be non-negative, width and height must be positive.' };
    }

    const croppedImage = {
      originalUrl: imageUrl,
      operation: 'crop',
      cropArea: {
        x: x,
        y: y,
        width: cropWidth,
        height: cropHeight
      },
      originalDimensions: { width: 1920, height: 1080 },
      croppedDimensions: { width: cropWidth, height: cropHeight },
      croppedUrl: `cropped_${cropWidth}x${cropHeight}_at_${x}_${y}_${imageUrl.split('/').pop()}`
    };

    return {
      success: true,
      data: {
        message: `Image cropped to ${cropWidth}x${cropHeight} at position (${x}, ${y})`,
        image: croppedImage
      }
    };
  }

  private async rotateImage(imageUrl: string, angle: number): Promise<ToolResult> {
    // 验证旋转角度
    if (![90, 180, 270, -90].includes(angle)) {
      return { success: false, error: 'Angle must be 90, 180, 270, or -90 degrees' };
    }

    const rotatedImage = {
      originalUrl: imageUrl,
      operation: 'rotation',
      originalAngle: 0,
      newAngle: angle,
      rotatedUrl: `rotated_${angle}deg_${imageUrl.split('/').pop()}`
    };

    return {
      success: true,
      data: {
        message: `Image rotated by ${angle} degrees`,
        image: rotatedImage
      }
    };
  }

  private calculateNewSize(originalSize: number, newWidth: number, newHeight: number): number {
    // 简单的尺寸估算，基于像素数的比例
    const originalPixels = 1920 * 1080; // 假设原始分辨率为1920x1080
    const newPixels = newWidth * newHeight;
    return Math.max(10 * 1024, originalSize * (newPixels / originalPixels)); // 最小10KB
  }
}