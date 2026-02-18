import { AgentContext, Message, Tool } from '../types';
import { config, LLMProvider } from '../config';
import OpenAI from 'openai';
import { Logger } from '../utils/Logger';
import { RetryHandler } from '../utils/RetryHandler';
import { MultiAIRouter } from './MultiAIRouter';
import { AutomationController } from '../tasks/AutomationController';
import { SkillManager } from '../skills/SkillManager';
import { OllamaService } from '../services/OllamaService';
import { SessionManager } from '../session/SessionManager';
import { MemorySystem } from '../memory/MemorySystem';

export class AgentProcessor {
  private openai: OpenAI;
  private ollamaService: OllamaService;
  private router: MultiAIRouter;
  private sessionManager: SessionManager;
  private automationController?: AutomationController;

  constructor(private skillManager?: SkillManager, private memorySystem?: MemorySystem) {
    this.router = new MultiAIRouter();
    this.sessionManager = new SessionManager(); // Use default directory from config
    this.openai = this.createClient(this.router.getCurrentProvider());
    this.ollamaService = new OllamaService();
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
      case 'baidu':
        // For Baidu ERNIE Bot, we use a compatible OpenAI-style client
        return new OpenAI({
          apiKey: config.baiduApiKey,
          baseURL: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat',
        });
      case 'tencent':
        // For Tencent HunYuan, we use a compatible OpenAI-style client
        return new OpenAI({
          apiKey: config.tencentApiKey,
          baseURL: 'https://hunyuan.cloud.tencent.com/v1',
        });
      case 'zhipu':
        // For Zhipu ChatGLM, we use a compatible OpenAI-style client
        return new OpenAI({
          apiKey: config.zhipuApiKey,
          baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
        });
      case 'siliconcloud':
        // For SiliconCloud, we use a compatible OpenAI-style client
        return new OpenAI({
          apiKey: config.siliconcloudApiKey,
          baseURL: 'https://api.siliconflow.cn/v1',
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
      case 'baidu':
        return 'ernie-4.5-8k';  // Using ERNIE Bot 4.5 as default
      case 'tencent':
        return 'hunyuan-pro';   // Using HunYuan Pro as default
      case 'zhipu':
        return 'glm-4';         // Using GLM-4 as default
      case 'siliconcloud':
        return 'Qwen/Qwen2-72B-Instruct';  // Using Qwen2-72B as default
      default:
        return 'gpt-4';
    }
  }

  switchProvider(provider: LLMProvider): void {
    this.router.setCurrentProvider(provider);
    if (provider !== 'ollama') {
      this.openai = this.createClient(provider);
    }
    Logger.info(`Switched to provider: ${provider}`);
  }

  getBestProviderForTask(taskType: string, language: string): LLMProvider {
    return this.router.getBestProviderForTask(taskType, language);
  }

  async process(context: AgentContext): Promise<string> {
    // Enhance context with memory search if memory system is available
    if (this.memorySystem) {
      try {
        // Search for memories related to the current conversation
        const query = context.messages.length > 0 
          ? context.messages[context.messages.length - 1]?.content || '' 
          : 'general';
        const relevantMemories = await this.memorySystem.search(query, 5);
        
        // Update context with relevant memories
        context.memory = relevantMemories;
      } catch (error) {
        Logger.warn('Could not enhance context with memory', { error: (error as Error).message });
      }
    }
    
    const systemPrompt = this.buildSystemPrompt(context);
    const currentProvider = this.router.getCurrentProvider();

    try {
      let response: string;
      
      if (currentProvider === 'ollama') {
        // Use Ollama service for local inference
        const messages = await this.buildMessagesForOllama(context, systemPrompt);
        
        const ollamaResponse = await RetryHandler.execute(
          () => this.ollamaService.chat(messages, config.ollamaModelName),
          { maxRetries: 3, initialDelay: 1000 }
        );
        
        response = ollamaResponse.response;
      } else {
        // Use OpenAI-compatible providers
        const messages = await this.buildMessages(context, systemPrompt);
        
        const completion = await RetryHandler.execute(
          () => this.openai.chat.completions.create({
            model: this.getModel(currentProvider),
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          }),
          { maxRetries: 3, initialDelay: 1000 }
        );

        response = completion.choices[0]?.message?.content || 'No response generated';
      }
      
      this.router.recordCall(currentProvider, true);
      
      Logger.info(`Generated response for session ${context.sessionId}`, {
        provider: currentProvider,
        length: response.length,
      });

      // Update session with the new interaction
      const userMessage: Message = { 
        id: `msg_${Date.now()}_user`, 
        role: 'user', 
        content: context.messages[context.messages.length - 1]?.content || '', 
        timestamp: new Date() 
      };
      const assistantMessage: Message = { 
        id: `msg_${Date.now()}_assistant`, 
        role: 'assistant', 
        content: response, 
        timestamp: new Date() 
      };
      
      // Get existing session or create new one
      let session = await this.sessionManager.getSession(context.sessionId);
      if (!session) {
        session = await this.sessionManager.createSession(context.sessionId, context.userId);
      }
      
      // Add messages to session
      session.messages.push(userMessage, assistantMessage);
      await this.sessionManager.updateSession(context.sessionId, session.messages);

      // Check for and execute tools
      await this.checkAndExecuteTools(context, response);

      // Store important conversation elements in memory
      if (this.memorySystem) {
        try {
          // Store the conversation if it contains important information
          const conversationSummary = `${userMessage.content} -> ${response}`;
          if (conversationSummary.length > 50) { // Only store meaningful conversations
            await this.memorySystem.addEntry(
              conversationSummary,
              ['conversation', 'session', context.sessionId.substring(0, 8)],
              2 // Medium importance
            );
          }
        } catch (error) {
          Logger.warn('Could not save conversation to memory', { error: (error as Error).message });
        }
      }

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
2. PROACTIVELY use tools to help the user without waiting for explicit requests
3. After using a tool, analyze the result and provide a clear summary
4. If a tool fails, explain the error and suggest alternatives
5. Be cautious with destructive operations (file deletion, shell commands)

## Personal Assistant Role

You are a personal assistant whose primary role is to help the user by using available tools automatically when appropriate. Don't ask users to use tools themselves - instead, use them on the user's behalf to solve their problems directly.

When a user asks a question that can be answered with a tool, use the tool automatically rather than suggesting the user use it.

## Memory System

You have access to a memory system where you can:
- Store important information for future reference
- Search past memories to provide context-aware responses
- Remember user preferences and patterns

## Communication Style

- Be concise but thorough
- Use clear, professional language
- Act proactively to solve user problems using tools
- Anticipate user needs and offer help
- Learn from user interactions

## Safety Guidelines

- Use tools responsibly to help the user achieve their goals
- Warn before performing potentially risky operations
- Respect user privacy and data security
- When in doubt, err on the side of helping the user
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

  private async buildMessages(context: AgentContext, systemPrompt: string): Promise<OpenAI.Chat.ChatCompletionMessageParam[]> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Load recent messages from session manager
    const session = await this.sessionManager.getSession(context.sessionId);
    const recentMessages = session?.messages?.slice(-10) || context.messages.slice(-10);
    
    recentMessages.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    return messages;
  }

  private async buildMessagesForOllama(context: AgentContext, systemPrompt: string): Promise<Array<{ role: string; content: string }>> {
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    // Load recent messages from session manager
    const session = await this.sessionManager.getSession(context.sessionId);
    const recentMessages = session?.messages?.slice(-10) || context.messages.slice(-10);
    
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

  async clearHistory(sessionId: string): Promise<void> {
    await this.sessionManager.deleteSession(sessionId);
    Logger.info(`Cleared conversation history for session ${sessionId}`);
  }
}