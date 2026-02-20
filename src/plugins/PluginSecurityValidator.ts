import { PluginMetadata } from './PluginTypes';

export interface SecurityValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class PluginSecurityValidator {
  private static DANGEROUS_PATTERNS = [
    /eval\s*\(/gi,
    /exec\s*\(/gi,
    /spawn\s*\(/gi,
    /child_process\./gi,
    /require\s*\(['"`]\.\.\/\.\.['"`]\)/gi,
    /__dirname/gi,
    /__filename/gi,
    /process\.env/gi,
    /fs\./gi,
    /fs\.unlinkSync/gi,
    /fs\.rmdirSync/gi,
    /\.exec/gi,
    /\.spawn/gi
  ];

  private static RESTRICTED_PERMISSIONS = [
    'system:root',
    'network:any',
    'file:any',
    'process:kill'
  ];

  private static MAX_FILE_SIZE = 1024 * 1024; // 1MB

  static async validatePluginCode(
    code: string, 
    metadata: PluginMetadata
  ): Promise<SecurityValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (code.length > this.MAX_FILE_SIZE) {
      errors.push(`Plugin code size (${code.length} bytes) exceeds maximum allowed size (${this.MAX_FILE_SIZE} bytes)`);
    }

    for (const pattern of this.DANGEROUS_PATTERNS) {
      const matches = code.match(pattern);
      if (matches && matches.length > 0) {
        errors.push(`Potentially dangerous code pattern detected: ${pattern.source} (${matches.length} occurrences)`);
      }
    }

    if (metadata.permissions) {
      for (const permission of metadata.permissions) {
        if (this.RESTRICTED_PERMISSIONS.includes(permission)) {
          errors.push(`Restricted permission requested: ${permission}`);
        }
      }
    }

    if (!metadata.name || metadata.name.trim().length === 0) {
      errors.push('Plugin name is required');
    }

    if (!metadata.version) {
      errors.push('Plugin version is required');
    }

    if (!metadata.description || metadata.description.trim().length === 0) {
      errors.push('Plugin description is required');
    }

    if (metadata.dependencies) {
      for (const dep of metadata.dependencies) {
        if (dep.startsWith('file:')) {
          warnings.push(`Plugin requests local file dependency: ${dep}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  static async validatePluginManifest(
    metadata: PluginMetadata
  ): Promise<SecurityValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!metadata.name || metadata.name.trim().length === 0) {
      errors.push('Plugin name is required');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(metadata.name)) {
      errors.push('Plugin name must contain only alphanumeric characters, hyphens, and underscores');
    }

    if (!metadata.version) {
      errors.push('Plugin version is required');
    }

    if (!/^\d+\.\d+\.\d+$/.test(metadata.version)) {
      warnings.push('Plugin version should follow semantic versioning (e.g., 1.0.0)');
    }

    if (!metadata.description || metadata.description.trim().length === 0) {
      errors.push('Plugin description is required');
    }

    if (metadata.description && metadata.description.length > 500) {
      warnings.push('Plugin description is too long (should be under 500 characters)');
    }

    if (metadata.permissions && metadata.permissions.length > 10) {
      warnings.push('Plugin requests too many permissions (should be under 10)');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  static sanitizePluginName(name: string): string {
    return name.replace(/[^a-zA-Z0-9_-]/g, '');
  }

  static getRequiredPermissions(metadata: PluginMetadata): string[] {
    return metadata.permissions || [];
  }
}
