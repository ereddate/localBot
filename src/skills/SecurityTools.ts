import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import * as crypto from 'crypto';

export class EncryptTool implements Tool {
  name = 'encrypt_data';
  description = 'Encrypt data using AES-256 encryption';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const data = params.data as string;
      const password = params.password as string;

      if (!data) {
        return { success: false, error: 'data is required' };
      }

      if (!password) {
        return { success: false, error: 'password is required' };
      }

      // Create a hash of the password to use as the key
      const key = crypto.scryptSync(password, 'salt', 32);
      const iv = crypto.randomBytes(16);
      
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Combine IV and encrypted data
      const result = iv.toString('hex') + ':' + encrypted;

      return {
        success: true,
        data: {
          encryptedData: result,
          algorithm: 'AES-256-CBC',
          message: 'Data encrypted successfully'
        }
      };
    } catch (error) {
      Logger.error(`Encryption failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class DecryptTool implements Tool {
  name = 'decrypt_data';
  description = 'Decrypt data using AES-256 decryption';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const encryptedData = params.encryptedData as string;
      const password = params.password as string;

      if (!encryptedData) {
        return { success: false, error: 'encryptedData is required' };
      }

      if (!password) {
        return { success: false, error: 'password is required' };
      }

      // Split IV and encrypted data
      const parts = encryptedData.split(':');
      if (parts.length !== 2) {
        return { success: false, error: 'Invalid encrypted data format' };
      }

      const ivHex = parts[0];
      const encryptedHex = parts[1];

      const iv = Buffer.from(ivHex, 'hex');
      const key = crypto.scryptSync(password, 'salt', 32);

      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return {
        success: true,
        data: {
          decryptedData: decrypted,
          algorithm: 'AES-256-CBC',
          message: 'Data decrypted successfully'
        }
      };
    } catch (error) {
      Logger.error(`Decryption failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class HashTool implements Tool {
  name = 'hash_data';
  description = 'Generate hash of data using SHA-256';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const data = params.data as string;
      const algorithm = (params.algorithm as string) || 'sha256';

      if (!data) {
        return { success: false, error: 'data is required' };
      }

      const hash = crypto.createHash(algorithm);
      hash.update(data);
      const hashedData = hash.digest('hex');

      return {
        success: true,
        data: {
          originalDataLength: data.length,
          hashedData,
          algorithm,
          message: 'Data hashed successfully'
        }
      };
    } catch (error) {
      Logger.error(`Hashing failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}