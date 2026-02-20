import { EventEmitter } from 'events';
import { MCPServer } from './MCPServer';
import { MCPRequest, MCPResponse } from './MCPProtocol';
import { Logger } from '../utils/Logger';

export class MCPStdioTransport extends EventEmitter {
  private mcpServer: MCPServer;
  private initialized: boolean = false;

  constructor(mcpServer: MCPServer) {
    super();
    this.mcpServer = mcpServer;
  }

  async start(): Promise<void> {
    process.stdin.setEncoding('utf-8');

    process.stdin.on('data', async (data: string) => {
      try {
        const requests = this.parseRequests(data);
        
        for (const request of requests) {
          const response = await this.mcpServer.handleRequest(request);
          this.sendResponse(response);
        }
      } catch (error) {
        Logger.error('Error processing MCP request', { 
          error: (error as Error).message 
        });
      }
    });

    process.stdin.on('error', (error) => {
      Logger.error('Stdin error', { error: error.message });
    });

    process.stdout.on('error', (error) => {
      Logger.error('Stdout error', { error: error.message });
    });

    Logger.info('MCP Stdio transport started');
  }

  private parseRequests(data: string): MCPRequest[] {
    const requests: MCPRequest[] = [];
    const lines = data.trim().split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const request = JSON.parse(line) as MCPRequest;
        requests.push(request);
      } catch (error) {
        Logger.error('Failed to parse MCP request', { 
          line: line.substring(0, 100),
          error: (error as Error).message 
        });
      }
    }

    return requests;
  }

  private sendResponse(response: MCPResponse): void {
    try {
      const responseLine = JSON.stringify(response) + '\n';
      process.stdout.write(responseLine);
    } catch (error) {
      Logger.error('Failed to send MCP response', { 
        error: (error as Error).message 
      });
    }
  }

  stop(): void {
    Logger.info('MCP Stdio transport stopped');
  }
}
