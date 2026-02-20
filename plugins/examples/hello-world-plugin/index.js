import { Plugin } from '../../plugins/PluginTypes';
import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

const metadata = {
  name: 'hello-world-plugin',
  version: '1.0.0',
  description: 'A simple hello world plugin for LocalBot',
  author: 'LocalBot Team',
  category: 'example'
};

export class HelloWorldPlugin implements Plugin {
  metadata = metadata;

  async initialize() {
    Logger.info('HelloWorldPlugin initialized');
  }

  getTools() {
    return [
      {
        name: 'hello_world',
        description: 'Say hello to the world',
        category: 'example' as const,
        async execute(params: Record<string, unknown>): Promise<ToolResult> {
          try {
            const name = params.name as string || 'World';
            
            Logger.info('HelloWorld tool executed', { name });
            
            return {
              success: true,
              data: {
                message: `Hello, ${name}!`,
                timestamp: new Date().toISOString(),
                plugin: 'hello-world-plugin'
              }
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Logger.error('HelloWorld tool error', { error: errorMessage });
            return {
              success: false,
              error: errorMessage
            };
          }
        }
      },
      {
        name: 'hello_world_multiple',
        description: 'Say hello multiple times',
        category: 'example' as const,
        async execute(params: Record<string, unknown>): Promise<ToolResult> {
          try {
            const name = params.name as string || 'World';
            const count = params.count as number || 3;
            
            if (count < 1 || count > 10) {
              return {
                success: false,
                error: 'Count must be between 1 and 10'
              };
            }
            
            const messages = [];
            for (let i = 0; i < count; i++) {
              messages.push(`Hello, ${name}! (${i + 1})`);
            }
            
            Logger.info('HelloWorldMultiple tool executed', { name, count });
            
            return {
              success: true,
              data: {
                messages,
                count,
                timestamp: new Date().toISOString(),
                plugin: 'hello-world-plugin'
              }
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Logger.error('HelloWorldMultiple tool error', { error: errorMessage });
            return {
              success: false,
              error: errorMessage
            };
          }
        }
      }
    ];
  }

  async destroy() {
    Logger.info('HelloWorldPlugin destroyed');
  }
}

export default HelloWorldPlugin;
