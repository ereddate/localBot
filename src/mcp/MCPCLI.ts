import { MCPServer } from './MCPServer';
import { MCPStdioTransport } from './MCPStdioTransport';
import { SkillManager } from '../skills/SkillManager';
import { Logger } from '../utils/Logger';

export class MCPCLI {
  private mcpServer: MCPServer;
  private transport: MCPStdioTransport;

  constructor(skillManager: SkillManager) {
    this.mcpServer = new MCPServer(skillManager, {
      name: 'localbot',
      version: '1.0.0',
    });

    this.transport = new MCPStdioTransport(this.mcpServer);
  }

  async start(): Promise<void> {
    try {
      Logger.info('Starting LocalBot MCP Server...');

      await this.transport.start();

      Logger.info('LocalBot MCP Server is ready');
      Logger.info('Waiting for MCP client connections...');
    } catch (error) {
      Logger.error('Failed to start MCP server', { 
        error: (error as Error).message 
      });
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    try {
      this.transport.stop();
      Logger.info('LocalBot MCP Server stopped');
    } catch (error) {
      Logger.error('Error stopping MCP server', { 
        error: (error as Error).message 
      });
    }
  }
}

export async function runMCPMode(): Promise<void> {
  try {
    const skillManager = new SkillManager();
    const mcpCLI = new MCPCLI(skillManager);
    
    await mcpCLI.start();

    process.on('SIGINT', async () => {
      Logger.info('Received SIGINT, shutting down...');
      await mcpCLI.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      Logger.info('Received SIGTERM, shutting down...');
      await mcpCLI.stop();
      process.exit(0);
    });
  } catch (error) {
    Logger.error('Error running MCP mode', { 
      error: (error as Error).message 
    });
    process.exit(1);
  }
}
