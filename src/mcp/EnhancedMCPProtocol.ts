import { Logger } from '../utils/Logger';
import { MCPRequest, MCPResponse, MCPTool, MCPResource, MCPPrompt, MCPToolCallRequest, MCPToolCallResult, MCPErrorCode, MCP_PROTOCOL_VERSION } from './MCPProtocol';

export interface MCPToolCache {
  tool: MCPTool;
  lastAccessed: Date;
  accessCount: number;
  responseTime: number;
  successRate: number;
}

export interface MCPToolCall {
  toolName: string;
  arguments: Record<string, any>;
  timestamp: Date;
  duration: number;
  success: boolean;
  error?: string;
}

export interface MCPToolFilter {
  category?: string;
  namePattern?: string;
  minSuccessRate?: number;
  maxResponseTime?: number;
  enabledOnly?: boolean;
}

export interface MCPToolHint {
  toolName: string;
  hint: string;
  priority: number;
  context?: string;
}

export class EnhancedMCPProtocol {
  private tools: Map<string, MCPTool> = new Map();
  private resources: Map<string, MCPResource> = new Map();
  private prompts: Map<string, MCPPrompt> = new Map();
  private toolCache: Map<string, MCPToolCache> = new Map();
  private callHistory: MCPToolCall[] = [];
  private toolHints: Map<string, MCPToolHint[]> = new Map();
  private maxCacheSize: number = 100;
  private maxHistorySize: number = 1000;
  private cacheEnabled: boolean = true;
  private trackingEnabled: boolean = true;
  private filteringEnabled: boolean = true;

  constructor(options: {
    maxCacheSize?: number;
    maxHistorySize?: number;
    cacheEnabled?: boolean;
    trackingEnabled?: boolean;
    filteringEnabled?: boolean;
  } = {}) {
    this.maxCacheSize = options.maxCacheSize || 100;
    this.maxHistorySize = options.maxHistorySize || 1000;
    this.cacheEnabled = options.cacheEnabled !== false;
    this.trackingEnabled = options.trackingEnabled !== false;
    this.filteringEnabled = options.filteringEnabled !== false;
  }

  registerTool(tool: MCPTool): void {
    this.tools.set(tool.name, tool);
    
    if (this.cacheEnabled) {
      this.toolCache.set(tool.name, {
        tool,
        lastAccessed: new Date(),
        accessCount: 0,
        responseTime: 0,
        successRate: 1.0
      });
    }
    
    Logger.debug('MCP tool registered', { toolName: tool.name });
  }

  unregisterTool(toolName: string): boolean {
    const deleted = this.tools.delete(toolName);
    this.toolCache.delete(toolName);
    this.toolHints.delete(toolName);
    return deleted;
  }

  registerResource(resource: MCPResource): void {
    this.resources.set(resource.uri, resource);
    Logger.debug('MCP resource registered', { uri: resource.uri });
  }

  unregisterResource(uri: string): boolean {
    return this.resources.delete(uri);
  }

  registerPrompt(prompt: MCPPrompt): void {
    this.prompts.set(prompt.name, prompt);
    Logger.debug('MCP prompt registered', { promptName: prompt.name });
  }

  unregisterPrompt(promptName: string): boolean {
    return this.prompts.delete(promptName);
  }

  addToolHint(hint: MCPToolHint): void {
    if (!this.toolHints.has(hint.toolName)) {
      this.toolHints.set(hint.toolName, []);
    }
    this.toolHints.get(hint.toolName)!.push(hint);
    Logger.debug('MCP tool hint added', { toolName: hint.toolName, hint: hint.hint });
  }

  async callTool(request: MCPToolCallRequest): Promise<MCPToolCallResult> {
    const startTime = Date.now();
    const tool = this.tools.get(request.name);
    
    if (!tool) {
      return {
        content: [{
          type: 'text',
          text: `Tool not found: ${request.name}`
        }],
        isError: true
      };
    }

    if (this.filteringEnabled && !this.checkToolFilter(request.name)) {
      return {
        content: [{
          type: 'text',
          text: `Tool is filtered: ${request.name}`
        }],
        isError: true
      };
    }

    if (this.trackingEnabled) {
      this.trackToolCall(request.name, request.arguments, new Date(startTime));
    }

    if (this.cacheEnabled) {
      const cached = this.toolCache.get(request.name);
      if (cached) {
        cached.lastAccessed = new Date();
        cached.accessCount++;
      }
    }

    try {
      const result = await this.executeTool(request.name, request.arguments);
      const duration = Date.now() - startTime;
      
      if (this.trackingEnabled) {
        this.updateToolCallResult(request.name, duration, true);
      }
      
      if (this.cacheEnabled) {
        const cached = this.toolCache.get(request.name);
        if (cached) {
          cached.responseTime = duration;
          this.updateSuccessRate(request.name, true);
        }
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (this.trackingEnabled) {
        this.updateToolCallResult(request.name, duration, false);
      }
      
      if (this.cacheEnabled) {
        this.updateSuccessRate(request.name, false);
      }
      
      Logger.error('MCP tool execution failed', { 
        toolName: request.name, 
        error: (error as Error).message 
      });
      
      return {
        content: [{
          type: 'text',
          text: `Tool execution failed: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }

  private async executeTool(toolName: string, args: Record<string, any>): Promise<MCPToolCallResult> {
    const tool = this.tools.get(toolName);
    
    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    const hints = this.toolHints.get(toolName) || [];
    const bestHint = hints.length > 0 ? hints[0] : null;
    
    if (bestHint) {
      Logger.debug('Using tool hint', { toolName, hint: bestHint.hint });
    }

    return {
      content: [{
        type: 'text',
        text: `Tool ${toolName} executed with arguments: ${JSON.stringify(args)}`
      }]
    };
  }

  private trackToolCall(toolName: string, args: Record<string, any>, startTime: Date): void {
    this.callHistory.push({
      toolName,
      arguments: args,
      timestamp: startTime,
      duration: 0,
      success: false
    });
    
    if (this.callHistory.length > this.maxHistorySize) {
      this.callHistory.shift();
    }
  }

  private updateToolCallResult(toolName: string, duration: number, success: boolean): void {
    const lastCall = this.callHistory.find(call => 
      call.toolName === toolName && call.duration === 0
    );
    
    if (lastCall) {
      lastCall.duration = duration;
      lastCall.success = success;
    }
  }

  private updateSuccessRate(toolName: string, success: boolean): void {
    const cached = this.toolCache.get(toolName);
    if (!cached) return;
    
    const alpha = 0.1;
    cached.successRate = cached.successRate * (1 - alpha) + (success ? 1 : 0) * alpha;
  }

  private checkToolFilter(toolName: string): boolean {
    const tool = this.tools.get(toolName);
    if (!tool) return false;
    
    const cached = this.toolCache.get(toolName);
    if (!cached) return true;
    
    if (cached.successRate < 0.5) {
      Logger.warn(`Tool ${toolName} has low success rate: ${cached.successRate}`);
      return false;
    }
    
    if (cached.responseTime > 10000) {
      Logger.warn(`Tool ${toolName} has high response time: ${cached.responseTime}ms`);
      return false;
    }
    
    return true;
  }

  filterTools(filter: MCPToolFilter): MCPTool[] {
    let tools = Array.from(this.tools.values());
    
    if (filter.category) {
      tools = tools.filter(t => t.name.includes(filter.category!));
    }
    
    if (filter.namePattern) {
      const pattern = new RegExp(filter.namePattern, 'i');
      tools = tools.filter(t => pattern.test(t.name));
    }
    
    if (filter.minSuccessRate && this.cacheEnabled) {
      tools = tools.filter(t => {
        const cached = this.toolCache.get(t.name);
        return cached && cached.successRate >= filter.minSuccessRate!;
      });
    }
    
    if (filter.maxResponseTime && this.cacheEnabled) {
      tools = tools.filter(t => {
        const cached = this.toolCache.get(t.name);
        return cached && cached.responseTime <= filter.maxResponseTime!;
      });
    }
    
    if (filter.enabledOnly) {
      tools = tools.filter(t => {
        const cached = this.toolCache.get(t.name);
        return cached && cached.successRate > 0.5;
      });
    }
    
    return tools;
  }

  getToolHints(toolName: string): MCPToolHint[] {
    return this.toolHints.get(toolName) || [];
  }

  getToolCache(toolName: string): MCPToolCache | undefined {
    return this.toolCache.get(toolName);
  }

  getToolStatistics(toolName: string): {
    accessCount: number;
    averageResponseTime: number;
    successRate: number;
    lastAccessed: Date;
  } | undefined {
    const cached = this.toolCache.get(toolName);
    if (!cached) return undefined;
    
    return {
      accessCount: cached.accessCount,
      averageResponseTime: cached.responseTime,
      successRate: cached.successRate,
      lastAccessed: cached.lastAccessed
    };
  }

  getCallHistory(limit?: number): MCPToolCall[] {
    if (limit) {
      return this.callHistory.slice(-limit);
    }
    return this.callHistory;
  }

  getCallHistoryByTool(toolName: string, limit?: number): MCPToolCall[] {
    const calls = this.callHistory.filter(call => call.toolName === toolName);
    if (limit) {
      return calls.slice(-limit);
    }
    return calls;
  }

  clearCache(): void {
    this.toolCache.clear();
    Logger.info('MCP tool cache cleared');
  }

  clearHistory(): void {
    this.callHistory = [];
    Logger.info('MCP call history cleared');
  }

  optimizeCache(): void {
    if (this.toolCache.size <= this.maxCacheSize) {
      return;
    }
    
    const entries = Array.from(this.toolCache.entries())
      .sort((a, b) => {
        const scoreA = a[1].accessCount * 0.4 + a[1].successRate * 0.6;
        const scoreB = b[1].accessCount * 0.4 + b[1].successRate * 0.6;
        return scoreB - scoreA;
      });
    
    const toDelete = entries.slice(this.maxCacheSize);
    for (const [name] of toDelete) {
      this.toolCache.delete(name);
    }
    
    Logger.info(`MCP cache optimized, removed ${toDelete.length} entries`);
  }

  getStats(): {
    totalTools: number;
    totalResources: number;
    totalPrompts: number;
    cachedTools: number;
    totalCalls: number;
    averageSuccessRate: number;
    averageResponseTime: number;
  } {
    let totalCalls = 0;
    let totalSuccess = 0;
    let totalResponseTime = 0;
    
    for (const call of this.callHistory) {
      totalCalls++;
      if (call.success) {
        totalSuccess++;
      }
      totalResponseTime += call.duration;
    }
    
    const averageSuccessRate = totalCalls > 0 ? totalSuccess / totalCalls : 0;
    const averageResponseTime = totalCalls > 0 ? totalResponseTime / totalCalls : 0;
    
    return {
      totalTools: this.tools.size,
      totalResources: this.resources.size,
      totalPrompts: this.prompts.size,
      cachedTools: this.toolCache.size,
      totalCalls,
      averageSuccessRate,
      averageResponseTime
    };
  }

  createInitializeResponse(serverInfo: { name: string; version: string }): MCPResponse {
    return {
      jsonrpc: '2.0',
      id: 0,
      result: {
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: {
          tools: { listChanged: true },
          resources: { subscribe: true, listChanged: true },
          prompts: { listChanged: true }
        },
        serverInfo
      }
    };
  }

  createListToolsResponse(tools?: MCPTool[]): MCPResponse {
    const toolList = tools || Array.from(this.tools.values());
    
    return {
      jsonrpc: '2.0',
      id: 0,
      result: {
        tools: toolList
      }
    };
  }

  createListResourcesResponse(resources?: MCPResource[]): MCPResponse {
    const resourceList = resources || Array.from(this.resources.values());
    
    return {
      jsonrpc: '2.0',
      id: 0,
      result: {
        resources: resourceList
      }
    };
  }

  createListPromptsResponse(prompts?: MCPPrompt[]): MCPResponse {
    const promptList = prompts || Array.from(this.prompts.values());
    
    return {
      jsonrpc: '2.0',
      id: 0,
      result: {
        prompts: promptList
      }
    };
  }

  createErrorResponse(id: string | number, errorCode: MCPErrorCode, message: string, data?: any): MCPResponse {
    return {
      jsonrpc: '2.0',
      id,
      error: {
        code: errorCode,
        message,
        data
      }
    };
  }
}
