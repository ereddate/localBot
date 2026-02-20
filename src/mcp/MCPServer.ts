import { EventEmitter } from 'events';
import { 
  MCPRequest, 
  MCPResponse, 
  MCPTool, 
  MCPToolCallRequest, 
  MCPToolCallResult,
  MCPResource,
  MCPResourceContent,
  MCPListResourcesResult,
  MCPReadResourceResult,
  MCPPrompt,
  MCPListPromptsResult,
  MCPGetPromptResult,
  MCPInitializeParams,
  MCPInitializeResult,
  MCPCapabilities,
  MCP_PROTOCOL_VERSION
} from './MCPProtocol';
import { SkillManager } from '../skills/SkillManager';
import { Tool } from '../types';
import { Logger } from '../utils/Logger';

export class MCPServer extends EventEmitter {
  private skillManager: SkillManager;
  private initialized: boolean = false;
  private serverInfo: { name: string; version: string };
  private capabilities: MCPCapabilities;

  constructor(skillManager: SkillManager, serverInfo: { name: string; version: string }) {
    super();
    this.skillManager = skillManager;
    this.serverInfo = serverInfo;
    this.capabilities = {
      tools: {
        listChanged: true,
      },
      resources: {
        subscribe: false,
        listChanged: true,
      },
      prompts: {
        listChanged: true,
      },
    };
  }

  async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      Logger.debug('MCP Request received', { method: request.method, id: request.id });

      switch (request.method) {
        case 'initialize':
          return await this.handleInitialize(request);
        
        case 'initialized':
          return this.createResponse(request.id, { status: 'initialized' });
        
        case 'tools/list':
          return await this.handleToolsList(request);
        
        case 'tools/call':
          return await this.handleToolsCall(request);
        
        case 'resources/list':
          return await this.handleResourcesList(request);
        
        case 'resources/read':
          return await this.handleResourcesRead(request);
        
        case 'prompts/list':
          return await this.handlePromptsList(request);
        
        case 'prompts/get':
          return await this.handlePromptsGet(request);
        
        case 'notifications/initialized':
          return this.createResponse(request.id, { status: 'ok' });
        
        default:
          return this.createErrorResponse(request.id, -32601, 'Method not found');
      }
    } catch (error) {
      Logger.error('MCP Request error', { 
        error: (error as Error).message,
        method: request.method 
      });
      return this.createErrorResponse(request.id, -32603, 'Internal error', (error as Error).message);
    }
  }

  private async handleInitialize(request: MCPRequest): Promise<MCPResponse> {
    const params = request.params as MCPInitializeParams;
    
    Logger.info('MCP Server initializing', {
      client: params.clientInfo,
      protocolVersion: params.protocolVersion
    });

    this.initialized = true;

    const result: MCPInitializeResult = {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: this.capabilities,
      serverInfo: this.serverInfo,
    };

    return this.createResponse(request.id, result);
  }

  private async handleToolsList(request: MCPRequest): Promise<MCPResponse> {
    if (!this.initialized) {
      return this.createErrorResponse(request.id, -32000, 'Server not initialized');
    }

    const tools = this.skillManager.getAllTools();
    const mcpTools: MCPTool[] = tools.map(tool => this.convertToolToMCP(tool));

    return this.createResponse(request.id, { tools: mcpTools });
  }

  private async handleToolsCall(request: MCPRequest): Promise<MCPResponse> {
    if (!this.initialized) {
      return this.createErrorResponse(request.id, -32000, 'Server not initialized');
    }

    const params = request.params as MCPToolCallRequest;
    const tool = this.skillManager.getTool(params.name);

    if (!tool) {
      return this.createErrorResponse(request.id, -32602, `Tool not found: ${params.name}`);
    }

    try {
      const result = await this.skillManager.executeTool(params.name, params.arguments);
      
      const mcpResult: MCPToolCallResult = {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
        isError: false,
      };

      return this.createResponse(request.id, mcpResult);
    } catch (error) {
      Logger.error('Tool execution error', { 
        tool: params.name,
        error: (error as Error).message 
      });

      const mcpResult: MCPToolCallResult = {
        content: [
          {
            type: 'text',
            text: `Error: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };

      return this.createResponse(request.id, mcpResult);
    }
  }

  private async handleResourcesList(request: MCPRequest): Promise<MCPResponse> {
    if (!this.initialized) {
      return this.createErrorResponse(request.id, -32000, 'Server not initialized');
    }

    const resources: MCPResource[] = [
      {
        uri: 'memory://recent',
        name: 'Recent Memory',
        description: 'Recent memory entries from the memory system',
        mimeType: 'application/json',
      },
      {
        uri: 'skills://list',
        name: 'Skills List',
        description: 'List of available skills',
        mimeType: 'application/json',
      },
      {
        uri: 'tools://list',
        name: 'Tools List',
        description: 'List of available tools',
        mimeType: 'application/json',
      },
    ];

    const result: MCPListResourcesResult = { resources };
    return this.createResponse(request.id, result);
  }

  private async handleResourcesRead(request: MCPRequest): Promise<MCPResponse> {
    if (!this.initialized) {
      return this.createErrorResponse(request.id, -32000, 'Server not initialized');
    }

    const uri = request.params?.uri as string;
    
    if (!uri) {
      return this.createErrorResponse(request.id, -32602, 'Missing required parameter: uri');
    }

    try {
      let content: MCPResourceContent;

      if (uri === 'memory://recent') {
        const { MemorySystem } = await import('../memory/MemorySystem');
        const memorySystem = new MemorySystem();
        const entries = await memorySystem.getRecentEntries(7);
        
        content = {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(entries, null, 2),
        };
      } else if (uri === 'skills://list') {
        const skills = this.skillManager.getAllSkills();
        
        content = {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(skills, null, 2),
        };
      } else if (uri === 'tools://list') {
        const tools = this.skillManager.getAllTools();
        
        content = {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(tools, null, 2),
        };
      } else {
        return this.createErrorResponse(request.id, -32602, `Resource not found: ${uri}`);
      }

      const result: MCPReadResourceResult = { contents: [content] };
      return this.createResponse(request.id, result);
    } catch (error) {
      Logger.error('Resource read error', { 
        uri,
        error: (error as Error).message 
      });
      return this.createErrorResponse(request.id, -32603, 'Error reading resource', (error as Error).message);
    }
  }

  private async handlePromptsList(request: MCPRequest): Promise<MCPResponse> {
    if (!this.initialized) {
      return this.createErrorResponse(request.id, -32000, 'Server not initialized');
    }

    const prompts: MCPPrompt[] = [
      {
        name: 'analyze_code',
        description: 'Analyze code and provide suggestions',
        arguments: [
          {
            name: 'code',
            description: 'The code to analyze',
            required: true,
          },
          {
            name: 'language',
            description: 'Programming language',
            required: false,
          },
        ],
      },
      {
        name: 'generate_documentation',
        description: 'Generate documentation for code',
        arguments: [
          {
            name: 'code',
            description: 'The code to document',
            required: true,
          },
        ],
      },
      {
        name: 'debug_issue',
        description: 'Debug a code issue',
        arguments: [
          {
            name: 'code',
            description: 'The code with the issue',
            required: true,
          },
          {
            name: 'error',
            description: 'The error message',
            required: true,
          },
        ],
      },
    ];

    const result: MCPListPromptsResult = { prompts };
    return this.createResponse(request.id, result);
  }

  private async handlePromptsGet(request: MCPRequest): Promise<MCPResponse> {
    if (!this.initialized) {
      return this.createErrorResponse(request.id, -32000, 'Server not initialized');
    }

    const name = request.params?.name as string;
    const args = request.params?.arguments as Record<string, any> || {};

    if (!name) {
      return this.createErrorResponse(request.id, -32602, 'Missing required parameter: name');
    }

    try {
      let messages: any[] = [];

      switch (name) {
        case 'analyze_code':
          messages = [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Please analyze the following ${args.language || 'code'}:\n\n\`\`\`\n${args.code}\n\`\`\`\n\nProvide suggestions for improvement.`,
              },
            },
          ];
          break;
        
        case 'generate_documentation':
          messages = [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Generate documentation for the following code:\n\n\`\`\`\n${args.code}\n\`\`\``,
              },
            },
          ];
          break;
        
        case 'debug_issue':
          messages = [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Help debug this issue:\n\nCode:\n\`\`\`\n${args.code}\n\`\`\`\n\nError: ${args.error}`,
              },
            },
          ];
          break;
        
        default:
          return this.createErrorResponse(request.id, -32602, `Prompt not found: ${name}`);
      }

      const result: MCPGetPromptResult = { messages };
      return this.createResponse(request.id, result);
    } catch (error) {
      Logger.error('Prompt get error', { 
        name,
        error: (error as Error).message 
      });
      return this.createErrorResponse(request.id, -32603, 'Error getting prompt', (error as Error).message);
    }
  }

  private convertToolToMCP(tool: Tool): MCPTool {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    if (tool.parameters) {
      for (const [key, param] of Object.entries(tool.parameters)) {
        const typedParam = param as { type?: string; description?: string; enum?: string[]; required?: boolean };
        properties[key] = {
          type: typedParam.type || 'string',
          description: typedParam.description || '',
        };

        if (typedParam.enum) {
          properties[key].enum = typedParam.enum;
        }

        if (typedParam.required) {
          required.push(key);
        }
      }
    }

    return {
      name: tool.name,
      description: tool.description,
      inputSchema: {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined,
      },
    };
  }

  private createResponse(id: string | number, result: any): MCPResponse {
    return {
      jsonrpc: '2.0',
      id,
      result,
    };
  }

  private createErrorResponse(id: string | number, code: number, message: string, data?: any): MCPResponse {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code,
        message,
        data,
      },
    };
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
