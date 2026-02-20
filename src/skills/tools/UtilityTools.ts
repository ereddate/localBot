import { Tool, ToolResult } from '../../types';
import { Logger } from '../../utils/Logger';
import * as crypto from 'crypto';
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
const deflate = promisify(zlib.deflate);
const inflate = promisify(zlib.inflate);

export class EncryptTool implements Tool {
  name = 'encrypt';
  description = 'Encrypt data using AES-256-CBC';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const data = params.data as string;
      const password = params.password as string;
      const algorithm = params.algorithm as string || 'aes-256-cbc';
      
      if (!data || !password) {
        return { success: false, error: 'data and password are required' };
      }

      const salt = crypto.randomBytes(16);
      const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
      const iv = crypto.randomBytes(16);
      
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const result = {
        salt: salt.toString('hex'),
        iv: iv.toString('hex'),
        encrypted,
        algorithm
      };

      return {
        success: true,
        data: result
      };
    } catch (error) {
      Logger.error('Encryption failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to encrypt: ${(error as Error).message}`
      };
    }
  }
}

export class DecryptTool implements Tool {
  name = 'decrypt';
  description = 'Decrypt AES-256-CBC encrypted data';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const encrypted = params.encrypted as string;
      const password = params.password as string;
      const salt = params.salt as string;
      const iv = params.iv as string;
      const algorithm = params.algorithm as string || 'aes-256-cbc';
      
      if (!encrypted || !password || !salt || !iv) {
        return { success: false, error: 'encrypted, password, salt, and iv are required' };
      }

      const saltBuffer = Buffer.from(salt, 'hex');
      const ivBuffer = Buffer.from(iv, 'hex');
      const key = crypto.pbkdf2Sync(password, saltBuffer, 100000, 32, 'sha256');
      
      const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return {
        success: true,
        data: {
          decrypted,
          algorithm
        }
      };
    } catch (error) {
      Logger.error('Decryption failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to decrypt: ${(error as Error).message}`
      };
    }
  }
}

export class HashTool implements Tool {
  name = 'hash';
  description = 'Create hash of data using various algorithms';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const data = params.data as string;
      const algorithm = params.algorithm as string || 'sha256';
      
      if (!data) {
        return { success: false, error: 'data is required' };
      }

      const validAlgorithms = ['md5', 'sha1', 'sha256', 'sha512', 'sha384'];
      if (!validAlgorithms.includes(algorithm)) {
        return { 
          success: false, 
          error: `Invalid algorithm. Valid options: ${validAlgorithms.join(', ')}` 
        };
      }

      const hash = crypto.createHash(algorithm).update(data).digest('hex');

      return {
        success: true,
        data: {
          algorithm,
          hash,
          inputLength: data.length
        }
      };
    } catch (error) {
      Logger.error('Hash creation failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to create hash: ${(error as Error).message}`
      };
    }
  }
}

export class CompressTool implements Tool {
  name = 'compress';
  description = 'Compress data using gzip or deflate';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const data = params.data as string;
      const algorithm = params.algorithm as 'gzip' | 'deflate' || 'gzip';
      
      if (!data) {
        return { success: false, error: 'data is required' };
      }

      let compressed: Buffer;
      if (algorithm === 'gzip') {
        compressed = await gzip(data);
      } else {
        compressed = await deflate(data);
      }

      return {
        success: true,
        data: {
          algorithm,
          originalSize: data.length,
          compressedSize: compressed.length,
          compressionRatio: ((1 - compressed.length / data.length) * 100).toFixed(2) + '%',
          compressed: compressed.toString('base64')
        }
      };
    } catch (error) {
      Logger.error('Compression failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to compress: ${(error as Error).message}`
      };
    }
  }
}

export class DecompressTool implements Tool {
  name = 'decompress';
  description = 'Decompress gzip or deflate compressed data';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const compressed = params.compressed as string;
      const algorithm = params.algorithm as 'gzip' | 'deflate' || 'gzip';
      
      if (!compressed) {
        return { success: false, error: 'compressed data is required' };
      }

      const compressedBuffer = Buffer.from(compressed, 'base64');
      let decompressed: Buffer;
      
      if (algorithm === 'gzip') {
        decompressed = await gunzip(compressedBuffer);
      } else {
        decompressed = await inflate(compressedBuffer);
      }

      return {
        success: true,
        data: {
          algorithm,
          compressedSize: compressedBuffer.length,
          decompressedSize: decompressed.length,
          decompressed: decompressed.toString('utf-8')
        }
      };
    } catch (error) {
      Logger.error('Decompression failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to decompress: ${(error as Error).message}`
      };
    }
  }
}

export class Base64EncodeTool implements Tool {
  name = 'base64_encode';
  description = 'Encode data to Base64';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const data = params.data as string;
      
      if (!data) {
        return { success: false, error: 'data is required' };
      }

      const encoded = Buffer.from(data, 'utf-8').toString('base64');

      return {
        success: true,
        data: {
          encoded,
          originalLength: data.length,
          encodedLength: encoded.length
        }
      };
    } catch (error) {
      Logger.error('Base64 encoding failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to encode: ${(error as Error).message}`
      };
    }
  }
}

export class Base64DecodeTool implements Tool {
  name = 'base64_decode';
  description = 'Decode Base64 data';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const encoded = params.encoded as string;
      
      if (!encoded) {
        return { success: false, error: 'encoded data is required' };
      }

      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');

      return {
        success: true,
        data: {
          decoded,
          encodedLength: encoded.length,
          decodedLength: decoded.length
        }
      };
    } catch (error) {
      Logger.error('Base64 decoding failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to decode: ${(error as Error).message}`
      };
    }
  }
}

export class UuidGenerateTool implements Tool {
  name = 'uuid_generate';
  description = 'Generate UUID (Universally Unique Identifier)';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const count = params.count as number || 1;
      
      if (count < 1 || count > 1000) {
        return { success: false, error: 'count must be between 1 and 1000' };
      }

      const uuids: string[] = [];
      for (let i = 0; i < count; i++) {
        uuids.push(crypto.randomUUID());
      }

      return {
        success: true,
        data: {
          count,
          uuids
        }
      };
    } catch (error) {
      Logger.error('UUID generation failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to generate UUID: ${(error as Error).message}`
      };
    }
  }
}

export class RandomStringTool implements Tool {
  name = 'random_string';
  description = 'Generate random string';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const length = params.length as number || 16;
      const includeNumbers = params.includeNumbers as boolean ?? true;
      const includeUppercase = params.includeUppercase as boolean ?? true;
      const includeLowercase = params.includeLowercase as boolean ?? true;
      const includeSpecial = params.includeSpecial as boolean ?? false;
      
      if (length < 1 || length > 1000) {
        return { success: false, error: 'length must be between 1 and 1000' };
      }

      let charset = '';
      if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeNumbers) charset += '0123456789';
      if (includeSpecial) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (charset.length === 0) {
        return { success: false, error: 'At least one character type must be included' };
      }

      let result = '';
      for (let i = 0; i < length; i++) {
        result += charset.charAt(Math.floor(Math.random() * charset.length));
      }

      return {
        success: true,
        data: {
          string: result,
          length,
          charset: {
            lowercase: includeLowercase,
            uppercase: includeUppercase,
            numbers: includeNumbers,
            special: includeSpecial
          }
        }
      };
    } catch (error) {
      Logger.error('Random string generation failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to generate random string: ${(error as Error).message}`
      };
    }
  }
}
