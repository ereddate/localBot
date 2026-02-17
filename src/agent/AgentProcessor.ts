import { AgentContext, Tool } from '../types';
import { config, LLMProvider } from '../config';
import OpenAI from 'openai';
import { Logger } from '../utils/Logger';
import { RetryHandler } from '../utils/RetryHandler';
import { MultiAIRouter } from './MultiAIRouter';
import { AutomationController } from '../tasks/AutomationController';
import { SkillManager } from '../skills/SkillManager';

export class AgentProcessor {
  private openai: OpenAI;
  private router: MultiAIRouter;
  private conversationHistory: Map<string, Array<{ role: string; content: string }>> = new Map();
  private automationController?: AutomationController;

  constructor(private skillManager?: SkillManager) {
    this.router = new MultiAIRouter();
    this.openai = this.createClient(this.router.getCurrentProvider());
  }

  async initializeAutomation(): Promise<void> {
    if (this.skillManager) {
      this.automationController = new AutomationController(this.skillManager);
      await this.automationController.initialize();
      Logger.info('Automation controller initialized');
    } else {
      Logger.warn('Cannot initialize automation controller: SkillManager not provided');
    }
  }

  getAutomationController(): AutomationController | undefined {
    return this.automationController;
  }

  getRouter(): MultiAIRouter {
    return this.router;
  }

  private createClient(provider: LLMProvider): OpenAI {
    switch (provider) {
      case 'aliyun':
        return new OpenAI({
          apiKey: config.aliyunApiKey,
          baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        });
      case 'openai':
        return new OpenAI({
          apiKey: config.openaiApiKey,
        });
      case 'anthropic':
        return new OpenAI({
          apiKey: config.anthropicApiKey,
          baseURL: 'https://api.anthropic.com/v1',
        });
      default:
        return new OpenAI({
          apiKey: config.openaiApiKey,
        });
    }
  }

  private getModel(provider: LLMProvider): string {
    switch (provider) {
      case 'aliyun':
        return config.aliyunModel;
      case 'openai':
        return 'gpt-4';
      case 'anthropic':
        return 'claude-3-opus-20240229';
      default:
        return 'gpt-4';
    }
  }

  switchProvider(provider: LLMProvider): void {
    this.router.setCurrentProvider(provider);
    this.openai = this.createClient(provider);
    Logger.info(`Switched to provider: ${provider}`);
  }

  getBestProviderForTask(taskType: string, language: string): LLMProvider {
    return this.router.getBestProviderForTask(taskType, language);
  }

  async process(context: AgentContext): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);
    const messages = this.buildMessages(context, systemPrompt);
    const currentProvider = this.router.getCurrentProvider();

    try {
      const completion = await RetryHandler.execute(
        () => this.openai.chat.completions.create({
          model: this.getModel(currentProvider),
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
        { maxRetries: 3, initialDelay: 1000 }
      );

      const response = completion.choices[0]?.message?.content || 'No response generated';
      
      this.router.recordCall(currentProvider, true);
      
      Logger.info(`Generated response for session ${context.sessionId}`, {
        provider: currentProvider,
        length: response.length,
      });

      await this.checkAndExecuteTools(context, response);

      return response;
    } catch (error) {
      this.router.recordCall(currentProvider, false);
      Logger.error('Error processing message', { 
        error: (error as Error).message,
        sessionId: context.sessionId,
        provider: currentProvider,
      });
      return `I encountered an error: ${(error as Error).message}. Please try again.`;
    }
  }

  private buildSystemPrompt(context: AgentContext): string {
    const toolsByCategory = this.groupToolsByCategory(context.availableTools);
    
    let toolsInfo = '';
    for (const [category, tools] of Object.entries(toolsByCategory)) {
      toolsInfo += `\n### ${category.toUpperCase()} Tools:\n`;
      tools.forEach(tool => {
        toolsInfo += `- **${tool.name}**: ${tool.description}\n`;
      });
    }

    // Include automation capabilities information
    const hasAutomation = this.automationController !== undefined;
    const automationInfo = hasAutomation 
      ? `
## Advanced Automation Capabilities

You have access to advanced automation features:

- **Task Scheduling**: Schedule tasks to run at specific intervals or times
- **Workflow Execution**: Chain multiple tools together in complex workflows
- **System Monitoring**: Monitor files, processes, and network activity
- **Process Control**: Start, stop, and check system processes
- **Network Operations**: Make HTTP requests and send emails

These features allow you to perform complex automated tasks on the user's system.
`
      : '';

    return `You are an intelligent AI assistant with access to local tools and memory systems.${automationInfo}

## Your Capabilities

${toolsInfo || 'No tools available'}

## Tool Usage Protocol

When you need to use a tool, format your response exactly as:

\`\`\`
TOOL: tool_name
PARAMS: {"key": "value"}
\`\`\`

**Important Rules:**
1. Always explain what you're about to do before using a tool
2. Use tools only when necessary - prefer direct answers when possible
3. After using a tool, analyze the result and provide a clear summary
4. If a tool fails, explain the error and suggest alternatives
5. Be cautious with destructive operations (file deletion, shell commands)

## Memory System

You have access to a memory system where you can:
- Store important information for future reference
- Search past memories to provide context-aware responses
- Remember user preferences and patterns

## Communication Style

- Be concise but thorough
- Use clear, professional language
- Ask clarifying questions when needed
- Proactively suggest relevant actions
- Learn from user interactions

## Safety Guidelines

- Never execute shell commands without clear user intent
- Warn before modifying or deleting files
- Respect user privacy and data security
- If uncertain, ask for confirmation before proceeding
- Exercise extra caution with automation tools that affect system operations`;
  }

  private groupToolsByCategory(tools: Tool[]): Record<string, Tool[]> {
    const grouped: Record<string, Tool[]> = {};
    
    tools.forEach(tool => {
      const category = tool.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(tool);
    });

    return grouped;
  }

  private buildMessages(context: AgentContext, systemPrompt: string): OpenAI.Chat.ChatCompletionMessageParam[] {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    const recentMessages = context.messages.slice(-10);
    recentMessages.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    return messages;
  }

  private async checkAndExecuteTools(context: AgentContext, response: string): Promise<void> {
    const toolMatches = response.matchAll(/TOOL:\s*(\w+)/g);
    const paramsMatches = response.matchAll(/PARAMS:\s*({.*?})/g);

    const toolNames = Array.from(toolMatches).map(m => m[1]);
    const paramsArray = Array.from(paramsMatches).map(m => {
      try {
        return JSON.parse(m[1]);
      } catch {
        return {};
      }
    });

    for (let i = 0; i < toolNames.length; i++) {
      const toolName = toolNames[i];
      const params = paramsArray[i] || {};

      const tool = context.availableTools.find(t => t.name === toolName);
      if (tool) {
        Logger.info(`Executing tool: ${toolName}`, { params });
        try {
          const result = await tool.execute(params);
          Logger.info(`Tool ${toolName} executed successfully`, { 
            success: result.success,
            data: result.data 
          });
        } catch (error) {
          Logger.error(`Error executing tool ${toolName}`, { 
            error: (error as Error).message 
          });
        }
      } else {
        Logger.warn(`Tool ${toolName} not found`);
      }
    }
  }

  clearHistory(sessionId: string): void {
    this.conversationHistory.delete(sessionId);
    Logger.info(`Cleared conversation history for session ${sessionId}`);
  }
}
