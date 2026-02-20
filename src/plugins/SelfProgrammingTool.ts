import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import { PluginManager } from './PluginManager';
import { PluginMetadata } from './PluginTypes';

export interface CodeGenerationRequest {
  description: string;
  requirements: string[];
  language: string;
  outputType: 'tool' | 'plugin';
}

export interface CodeGenerationResult {
  code: string;
  metadata: PluginMetadata;
  dependencies: string[];
}

export class SelfProgrammingTool implements Tool {
  name = 'self_programming';
  description = 'Self-programming capability: Generate, compile, and load new tools or plugins dynamically';
  category = 'system' as const;

  private pluginManager: PluginManager;

  constructor(pluginManager: PluginManager) {
    this.pluginManager = pluginManager;
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const action = params.action as string || 'generate';
      
      switch (action) {
        case 'generate':
          return await this.generateCode(params);
        case 'compile':
          return await this.compileCode(params);
        case 'load':
          return await this.loadPlugin(params);
        case 'create_tool':
          return await this.createTool(params);
        case 'optimize':
          return await this.optimizeCode(params);
        default:
          return { 
            success: false, 
            error: `Unknown action: ${action}` 
          };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('Self-programming tool error', { error: errorMessage });
      return { 
        success: false, 
        error: `Self-programming failed: ${errorMessage}` 
      };
    }
  }

  private async generateCode(params: Record<string, unknown>): Promise<ToolResult> {
    const description = params.description as string;
    const requirements = params.requirements as string[] || [];
    const language = params.language as string || 'typescript';
    const outputType = params.outputType as string || 'tool';

    if (!description) {
      return { success: false, error: 'Description is required' };
    }

    Logger.info('Generating code...', { description, language, outputType });

    const codeResult: CodeGenerationResult = {
      code: this.generateToolCode(description, requirements, language, outputType),
      metadata: this.generateMetadata(description, outputType),
      dependencies: this.generateDependencies(requirements)
    };

    Logger.info('Code generated successfully', { 
      codeLength: codeResult.code.length 
    });

    return {
      success: true,
      data: {
        code: codeResult.code,
        metadata: codeResult.metadata,
        dependencies: codeResult.dependencies,
        timestamp: new Date().toISOString()
      }
    };
  }

  private async compileCode(params: Record<string, unknown>): Promise<ToolResult> {
    const code = params.code as string;
    const language = params.language as string || 'typescript';

    if (!code) {
      return { success: false, error: 'Code is required' };
    }

    Logger.info('Compiling code...', { language, codeLength: code.length });

    try {
      const compiledCode = this.compileCodeInternal(code, language);
      
      Logger.info('Code compiled successfully');
      
      return {
        success: true,
        data: {
          compiledCode,
          language,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('Code compilation failed', { error: errorMessage });
      return { 
        success: false, 
        error: `Compilation failed: ${errorMessage}` 
      };
    }
  }

  private async loadPlugin(params: Record<string, unknown>): Promise<ToolResult> {
    const pluginName = params.pluginName as string;
    const pluginPath = params.pluginPath as string;

    if (!pluginName) {
      return { success: false, error: 'Plugin name is required' };
    }

    Logger.info('Loading plugin...', { pluginName, pluginPath });

    try {
      const loadResult = await this.pluginManager.loadPlugin(pluginPath);
      
      if (!loadResult.success) {
        return { 
          success: false, 
          error: `Failed to load plugin: ${loadResult.error}` 
        };
      }

      Logger.info('Plugin loaded successfully', { pluginName });

      return {
        success: true,
        data: {
          pluginName,
          loadTime: new Date().toISOString()
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('Plugin load failed', { error: errorMessage });
      return { 
        success: false, 
        error: `Failed to load plugin: ${errorMessage}` 
      };
    }
  }

  private async createTool(params: Record<string, unknown>): Promise<ToolResult> {
    const toolName = params.toolName as string;
    const description = params.description as string;
    const code = params.code as string;

    if (!toolName || !description || !code) {
      return { 
        success: false, 
        error: 'Tool name, description, and code are required' 
      };
    }

    Logger.info('Creating dynamic tool...', { toolName, description });

    try {
      const tool = this.createDynamicTool(toolName, description, code);
      
      Logger.info('Dynamic tool created successfully', { toolName });

      return {
        success: true,
        data: {
          toolName,
          description,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('Dynamic tool creation failed', { error: errorMessage });
      return { 
        success: false, 
        error: `Failed to create tool: ${errorMessage}` 
      };
    }
  }

  private async optimizeCode(params: Record<string, unknown>): Promise<ToolResult> {
    const code = params.code as string;

    if (!code) {
      return { success: false, error: 'Code is required' };
    }

    Logger.info('Optimizing code...', { codeLength: code.length });

    try {
      const optimizedCode = this.optimizeCodeInternal(code);
      
      Logger.info('Code optimized successfully', { 
        originalLength: code.length,
        optimizedLength: optimizedCode.length 
      });

      return {
        success: true,
        data: {
          originalCode: code,
          optimizedCode,
          improvement: ((code.length - optimizedCode.length) / code.length * 100).toFixed(2) + '%',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('Code optimization failed', { error: errorMessage });
      return { 
        success: false, 
        error: `Optimization failed: ${errorMessage}` 
      };
    }
  }

  private generateToolCode(
    description: string, 
    requirements: string[], 
    language: string, 
    outputType: string
  ): string {
    const toolName = this.generateToolName(description);
    const timestamp = new Date().toISOString();

    if (outputType === 'tool') {
      return this.generateToolTemplate(toolName, description, requirements, language, timestamp);
    } else {
      return this.generatePluginTemplate(toolName, description, requirements, language, timestamp);
    }
  }

  private generateToolTemplate(
    name: string,
    description: string,
    requirements: string[],
    language: string,
    timestamp: string
  ): string {
    const imports = requirements.map(req => `// ${req}`).join('\n');
    
    return `import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

${imports}

export class ${this.toPascalCase(name)} implements Tool {
  name = '${name}';
  description = '${description}';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      // Generated at: ${timestamp}
      // TODO: Implement tool logic here
      
      Logger.info('${name} tool executed');
      
      return {
        success: true,
        data: {
          message: 'Tool executed successfully',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('${name} tool error', { error: errorMessage });
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  }
}
`;
  }

  private generatePluginTemplate(
    name: string,
    description: string,
    requirements: string[],
    language: string,
    timestamp: string
  ): string {
    const imports = requirements.map(req => `// ${req}`).join('\n');
    
    return `import { Plugin, PluginMetadata } from './PluginTypes';
import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

${imports}

const metadata: PluginMetadata = {
  name: '${name}',
  version: '1.0.0',
  description: '${description}',
  author: 'Self-Programming System',
  category: 'generated'
};

export class ${this.toPascalCase(name)}Plugin implements Plugin {
  metadata = metadata;

  async initialize(): Promise<void> {
    Logger.info('${name} plugin initialized');
  }

  getTools(): Tool[] {
    return [
      {
        name: '${name}',
        description: '${description}',
        category: 'generated' as const,
        async execute(params: Record<string, unknown>): Promise<ToolResult> {
          // Generated at: ${timestamp}
          // TODO: Implement tool logic here
          
          return {
            success: true,
            data: {
              message: 'Tool executed successfully',
              timestamp: new Date().toISOString()
            }
          };
        }
      }
    ];
  }

  async destroy(): Promise<void> {
    Logger.info('${name} plugin destroyed');
  }
}

export default ${this.toPascalCase(name)}Plugin;
`;
  }

  private generateMetadata(description: string, outputType: string): PluginMetadata {
    const name = this.generateToolName(description);
    
    return {
      name,
      version: '1.0.0',
      description,
      author: 'Self-Programming System',
      category: outputType === 'plugin' ? 'generated' : 'system',
      permissions: []
    };
  }

  private generateDependencies(requirements: string[]): string[] {
    const deps: string[] = [];
    
    if (requirements.some(req => req.includes('file'))) {
      deps.push('fs');
    }
    
    if (requirements.some(req => req.includes('http'))) {
      deps.push('axios');
    }
    
    if (requirements.some(req => req.includes('database'))) {
      deps.push('sqlite3');
    }
    
    return deps;
  }

  private compileCodeInternal(code: string, language: string): string {
    if (language === 'typescript') {
      return this.compileTypeScript(code);
    } else if (language === 'javascript') {
      return this.compileJavaScript(code);
    } else {
      return code;
    }
  }

  private compileTypeScript(code: string): string {
    return code
      .replace(/: any/g, ': unknown')
      .replace(/console\.log/g, 'Logger.info')
      .replace(/\/\/ TODO/g, '// IMPLEMENT');
  }

  private compileJavaScript(code: string): string {
    return code
      .replace(/var /g, 'const ')
      .replace(/function /g, 'const ')
      .replace(/console\.log/g, 'Logger.info');
  }

  private optimizeCodeInternal(code: string): string {
    return code
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/\s+/g, ' ')
      .replace(/\/\/\s*TODO.*$/gm, '')
      .trim();
  }

  private createDynamicTool(name: string, description: string, code: string): Tool {
    return {
      name,
      description,
      category: 'dynamic' as const,
      async execute(params: Record<string, unknown>): Promise<ToolResult> {
        try {
          const func = new Function('params', code);
          const result = await func(params);
          return { success: true, data: result };
        } catch (error) {
          return { 
            success: false, 
            error: error instanceof Error ? error.message : String(error) 
          };
        }
      }
    };
  }

  private generateToolName(description: string): string {
    const words = description.split(' ').slice(0, 3);
    const name = words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}
