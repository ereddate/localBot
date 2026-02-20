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
import { SkillsHub } from '../skills/SkillsHub';
import { PluginManager } from '../plugins/PluginManager';
import { SelfProgrammingTool } from '../plugins/SelfProgrammingTool';
import { DeepThinkingEngine, ThinkingProcess } from '../engine/DeepThinkingEngine';

export class AgentProcessor {
  private openai: OpenAI;
  private ollamaService: OllamaService;
  private router: MultiAIRouter;
  private sessionManager: SessionManager;
  private automationController?: AutomationController;
  private skillsHub?: SkillsHub;
  private pluginManager?: PluginManager;
  private deepThinkingEngine?: DeepThinkingEngine;

  constructor(private skillManager?: SkillManager, private memorySystem?: MemorySystem, skillsHub?: SkillsHub) {
    this.router = new MultiAIRouter();
    this.sessionManager = new SessionManager();
    this.openai = this.createClient(this.router.getCurrentProvider());
    this.ollamaService = new OllamaService();
    this.skillsHub = skillsHub;
    this.deepThinkingEngine = new DeepThinkingEngine(config.deepThinking, memorySystem);
  }

  async initializeAutomation(): Promise<void> {
    if (this.skillManager) {
      this.automationController = new AutomationController(this.skillManager);
      await this.automationController.initialize();
      Logger.info('Automation controller initialized');
    } else {
      Logger.warn('Cannot initialize automation controller: SkillManager not provided');
    }

    await this.initializePlugins();
  }

  private async initializePlugins(): Promise<void> {
    try {
      this.pluginManager = new PluginManager('./plugins');
      await this.pluginManager.initialize();
      Logger.info('Plugin manager initialized');

      if (this.skillManager) {
        const selfProgrammingTool = new SelfProgrammingTool(this.pluginManager);
        this.skillManager.registerTool(selfProgrammingTool);
        Logger.info('Self-programming tool registered');
      }
    } catch (error) {
      Logger.warn('Failed to initialize plugin manager', { error: (error as Error).message });
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
    // Check if deep thinking is required
    let deepThinkingResult: ThinkingProcess | undefined;
    if (this.deepThinkingEngine && context.messages.length > 0) {
      const userQuery = context.messages[context.messages.length - 1]?.content || '';
      if (this.deepThinkingEngine.isDeepThinkingRequired(userQuery)) {
        try {
          Logger.info('Deep thinking triggered for query', { query: userQuery.substring(0, 100) });
          deepThinkingResult = await this.deepThinkingEngine.thinkDeeply(context, userQuery);
          
          // Add deep thinking result to context
          context.memory = context.memory || [];
          context.memory.push({
            id: `thinking_${deepThinkingResult.id}`,
            content: this.formatThinkingProcess(deepThinkingResult),
            timestamp: deepThinkingResult.startTime,
            tags: ['deep-thinking', 'analysis'],
            importance: 3,
          });
          
          Logger.info('Deep thinking completed', {
            processId: deepThinkingResult.id,
            confidence: deepThinkingResult.confidence,
            iterations: deepThinkingResult.iterations,
          });
        } catch (error) {
          Logger.warn('Deep thinking failed, falling back to normal processing', {
            error: (error as Error).message,
          });
        }
      }
    }

    // Enhance context with memory search if memory system is available
    if (this.memorySystem) {
      try {
        // Search for memories related to current conversation
        const query = context.messages.length > 0 
          ? context.messages[context.messages.length - 1]?.content || '' 
          : 'general';
        const relevantMemories = await this.memorySystem.search(query, 5);
        
        // Update context with relevant memories
        context.memory = [...(context.memory || []), ...relevantMemories];
      } catch (error) {
        Logger.warn('Could not enhance context with memory', { error: (error as Error).message });
      }
    }

    // Match skills against user's latest message
    let skillMatchInfo = '';
    if (this.skillsHub && context.messages.length > 0) {
      const userQuery = context.messages[context.messages.length - 1]?.content || '';
      const matches = this.skillsHub.matchSkills(userQuery);
      
      if (matches.length > 0) {
        const bestMatch = matches[0];
        if (bestMatch.confidence > 0.3) {
          skillMatchInfo = `\n\n## Skill Match Found\n\nBased on your query, I found a relevant skill:\n\n`;
          skillMatchInfo += `- **Skill**: ${bestMatch.skill.metadata.name}\n`;
          skillMatchInfo += `- **Confidence**: ${(bestMatch.confidence * 100).toFixed(1)}%\n`;
          skillMatchInfo += `- **Reason**: ${bestMatch.reason}\n`;
          skillMatchInfo += `- **Description**: ${bestMatch.skill.metadata.description}\n\n`;
          skillMatchInfo += `Please load this skill using: \`LOAD_SKILL: ${bestMatch.skill.metadata.name}\`\n`;
          
          Logger.info(`Skill matched for query: ${userQuery}`, {
            skill: bestMatch.skill.metadata.name,
            confidence: bestMatch.confidence,
          });
        }
      }
    }
    
    const systemPrompt = this.buildSystemPrompt(context) + skillMatchInfo;
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
        
        response = ollamaResponse.response || '';
        
        // Validate response and provide fallback if empty
        if (!response || response.trim() === '') {
          Logger.warn('Empty response received from Ollama', {
            model: config.ollamaModelName,
            responseLength: ollamaResponse.response?.length || 0,
            responseContent: ollamaResponse.response || 'null'
          });
          
          // Try to provide a more helpful fallback
          if (context.messages.length > 0) {
            const lastUserMessage = context.messages[context.messages.length - 1]?.content || '';
            Logger.warn('Last user message that caused empty response', { 
              message: lastUserMessage.substring(0, 100) 
            });
          }
          
          response = '抱歉，我暂时无法生成响应。这可能是因为：\n1. 模型正在处理复杂请求\n2. 上下文信息过长\n3. 网络或服务问题\n\n建议：\n- 简化您的问题\n- 稍后重试\n- 或者尝试重新表述您的问题';
        }
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

        response = completion.choices[0]?.message?.content || '';
        
        // Validate response and provide fallback if empty
        if (!response || response.trim() === '') {
          Logger.warn('Empty response received from API', {
            provider: currentProvider,
            model: this.getModel(currentProvider),
            responseLength: completion.choices[0]?.message?.content?.length || 0,
            choicesCount: completion.choices.length
          });
          
          // Try to provide a more helpful fallback
          if (context.messages.length > 0) {
            const lastUserMessage = context.messages[context.messages.length - 1]?.content || '';
            Logger.warn('Last user message that caused empty response', { 
              message: lastUserMessage.substring(0, 100) 
            });
          }
          
          response = '抱歉，我暂时无法生成响应。这可能是因为：\n1. 模型正在处理复杂请求\n2. 上下文信息过长\n3. 网络或服务问题\n\n建议：\n- 简化您的问题\n- 稍后重试\n- 或者尝试重新表述您的问题';
        }
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
      
      // Log original response for debugging (use info level to ensure visibility)
      Logger.info('Original response before cleaning', {
        length: response.length,
        preview: response.substring(0, 300)
      });
      
      // Clean up tool execution commands from response
      const cleanedResponse = this.cleanToolCommands(response);
      
      // Log cleaned response for debugging (use info level to ensure visibility)
      Logger.info('Cleaned response', {
        originalLength: response.length,
        cleanedLength: cleanedResponse.length,
        preview: cleanedResponse.substring(0, 300)
      });
      
      // If cleaned response is empty or only contains tool commands, provide a fallback
      if (!cleanedResponse || cleanedResponse.trim() === '') {
        Logger.warn('Response is empty after cleaning tool commands', {
          originalResponse: response.substring(0, 500)
        });
        
        // Check if tools were executed successfully
        const toolExecutionCount = response.match(/TOOL:/g)?.length || 0;
        if (toolExecutionCount > 0) {
          return `我已经执行了 ${toolExecutionCount} 个工具来处理您的请求。工具执行成功，但AI模型没有生成具体的响应内容。\n\n这可能是因为：\n1. 模型专注于工具执行\n2. 响应被误清理\n\n您可以：\n- 重新表述您的问题\n- 询问具体的分析结果\n- 或者查看工具执行日志`;
        }
        
        return '抱歉，我无法生成有效的响应。请稍后重试或重新表述您的问题。';
      }
      
      // Store important conversation elements in memory
      if (this.memorySystem) {
        try {
          // Store conversation if it contains important information
          const conversationSummary = `${userMessage.content} -> ${cleanedResponse}`;
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

      return cleanedResponse;
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

    // Build skills information from SkillsHub
    let skillsInfo = '';
    if (this.skillsHub) {
      const skillsList = this.skillsHub.buildSkillsListPrompt({ format: 'list', maxSkills: 20 });
      const usageInstructions = this.skillsHub.buildSkillUsageInstructions();
      skillsInfo = `\n${skillsList}\n\n${usageInstructions}\n`;
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

    const systemPrompt = `你是一个智能AI助手，拥有本地工具、记忆系统和技能。${automationInfo}

## 你的能力

${toolsInfo || '没有可用工具'}
${skillsInfo}

## 关键：技能匹配协议

**在使用任何工具之前，你必须：**

1. **首先分析用户的请求**
2. **将请求与可用技能进行匹配**
3. **如果技能匹配用户的意图，先加载该技能**
4. **只有在加载相关技能后，才使用相应的工具**

**技能加载格式：**
\`\`\`
LOAD_SKILL: skill_name
\`\`\`

**示例：**
用户: "查询北京天气"
你的回答: "我来帮你查询天气。正在加载daily-life-assistant技能..."
然后: LOAD_SKILL: daily-life-assistant

**重要：**
- 技能优先于直接使用工具
- 在使用工具之前，始终检查是否有技能匹配用户的意图
- 技能为特定任务提供专业知识和工作流程
- 如果没有匹配的技能，则继续正常的工具使用

## 工具使用协议

当你需要使用工具（在加载相关技能后），请按以下格式回复：

\`\`\`
TOOL: tool_name
PARAMS: {"key": "value"}
\`\`\`

**重要规则：**
1. 在使用工具之前，始终解释你要做什么
2. 主动使用工具来帮助用户，无需等待明确请求
3. **使用工具后，必须分析结果并提供清晰的总结和解释**
4. **不要只输出工具调用指令，必须生成实际的响应内容**
5. 如果工具失败，解释错误并建议替代方案
6. 对破坏性操作（文件删除、shell命令）要谨慎

**关键要求：**
- 工具调用只是手段，不是目的
- 你的最终输出必须是对用户问题的直接回答
- 工具执行结果应该被整合到你的回答中
- 不要让用户自己去解读工具输出

## 个人助手角色

你是一个个人助手，主要角色是通过使用可用的技能和工具在适当的时候自动帮助用户。不要要求用户自己使用工具或技能 - 相反，代表他们使用这些工具和技能来直接解决他们的问题。

当用户问一个可以用技能或工具回答的问题时，自动使用它们，而不是建议用户使用它们。

## 记忆系统

你可以访问记忆系统，在那里你可以：
- 存储重要信息以供将来参考
- 搜索过去的记忆以提供上下文感知的响应
- 记住用户偏好和模式

**重要**：当用户询问以前的对话或记忆时，检查上下文中存储的记忆。如果上下文中存在相关记忆，请使用它们提供信息丰富的响应。如果用户问"我们之前谈过什么？"或类似的问题，你应该引用上下文中的记忆，而不是声称这是第一次见到他们。

## 沟通风格

- 简洁但全面
- 使用清晰、专业的语言
- 使用技能和工具主动解决用户问题
- 预测用户需求并提供帮助
- 从用户互动中学习

## 安全指南

- 负责任地使用技能和工具来帮助用户实现他们的目标
- 在执行潜在风险操作之前发出警告
- 尊重用户隐私和数据安全
- 当有疑问时，优先帮助用户
- 对影响系统操作的自动化工具要格外小心`;

    return systemPrompt;
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
  
  private buildMemoryContext(memories: any[]): string {
    if (!memories || memories.length === 0) {
      return '';
    }
    
    const memoryText = memories.map((mem, index) => {
      const timestamp = mem.timestamp ? new Date(mem.timestamp).toLocaleDateString('zh-CN') : '未知日期';
      const tags = mem.tags && mem.tags.length > 0 ? `[${mem.tags.join(', ')}]` : '';
      return `${index + 1}. ${timestamp} ${tags}\n   ${mem.content}`;
    }).join('\n\n');
    
    return `## Relevant Memories from Previous Conversations\n\n${memoryText}`;
  }

  private async buildMessages(context: AgentContext, systemPrompt: string): Promise<OpenAI.Chat.ChatCompletionMessageParam[]> {
    // Get current date and time for a separate system message
    const now = new Date();
    const currentDateTime = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Shanghai'
    });
    const currentDate = now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      timeZone: 'Asia/Shanghai'
    });

    const timeMessage = `## CRITICAL: Current Date and Time

**YOU MUST KNOW**: The current date and time is:
- **Date**: ${currentDate}
- **Full DateTime**: ${currentDateTime}

**IMPORTANT INSTRUCTIONS**:
1. ALWAYS use this current date and time when responding to ANY time-related questions
2. NEVER say "I don't know the current time" or "I don't have access to real-time information"
3. When users ask about time, date, or anything temporal, ALWAYS reference the time provided above
4. Do NOT use system date/time from your training data - use ONLY the time provided here`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: timeMessage },
    ];

    // Add memory context if available
    if (context.memory && context.memory.length > 0) {
      const memoryContext = this.buildMemoryContext(context.memory);
      messages.push({
        role: 'system',
        content: memoryContext
      });
    }

    // Load recent messages from session manager
    const session = await this.sessionManager.getSession(context.sessionId);
    const recentMessages = session?.messages?.slice(-10) || context.messages.slice(-10);
    
    Logger.debug('Building messages for Ollama', {
      sessionMessagesCount: session?.messages?.length || 0,
      recentMessagesCount: recentMessages.length,
      contextMessagesCount: context.messages.length
    });
    
    recentMessages.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    Logger.debug('Final messages array for Ollama', {
      messageCount: messages.length,
      totalLength: messages.reduce((sum, m) => sum + (m.content?.length || 0), 0)
    });

    return messages;
  }

  private async buildMessagesForOllama(context: AgentContext, systemPrompt: string): Promise<Array<{ role: string; content: string }>> {
    // Get current date and time for a separate system message
    const now = new Date();
    const currentDateTime = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Shanghai'
    });
    const currentDate = now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      timeZone: 'Asia/Shanghai'
    });

    const timeMessage = `## CRITICAL: Current Date and Time

**YOU MUST KNOW**: The current date and time is:
- **Date**: ${currentDate}
- **Full DateTime**: ${currentDateTime}

**IMPORTANT INSTRUCTIONS**:
1. ALWAYS use this current date and time when responding to ANY time-related questions
2. NEVER say "I don't know the current time" or "I don't have access to real-time information"
3. When users ask about time, date, or anything temporal, ALWAYS reference the time provided above
4. Do NOT use system date/time from your training data - use ONLY the time provided here`;

    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: timeMessage },
    ];

    // Add memory context if available
    if (context.memory && context.memory.length > 0) {
      const memoryContext = this.buildMemoryContext(context.memory);
      messages.push({
        role: 'system',
        content: memoryContext
      });
    }

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

  private cleanToolCommands(response: string): string {
    let cleaned = response;
    
    // Remove LOAD_SKILL commands (more precise pattern)
    cleaned = cleaned.replace(/^LOAD_SKILL:\s*\w+\s*$/gm, '');
    
    // Remove TOOL commands (more precise pattern)
    cleaned = cleaned.replace(/^TOOL:\s*\w+\s*$/gm, '');
    
    // Remove PARAMS commands (more precise pattern)
    cleaned = cleaned.replace(/^PARAMS:\s*\{.*?\}\s*$/gm, '');
    
    // Clean up multiple consecutive empty lines
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Trim leading/trailing whitespace
    cleaned = cleaned.trim();
    
    return cleaned;
  }

  async clearHistory(sessionId: string): Promise<void> {
    await this.sessionManager.deleteSession(sessionId);
    Logger.info(`Cleared conversation history for session ${sessionId}`);
  }

  private formatThinkingProcess(process: ThinkingProcess): string {
    let formatted = `# 深度思考过程\n\n`;
    formatted += `**问题**: ${process.query}\n\n`;
    formatted += `**置信度**: ${(process.confidence * 100).toFixed(1)}%\n`;
    formatted += `**迭代次数**: ${process.iterations}\n\n`;
    
    formatted += `## 思考步骤\n\n`;
    process.steps.forEach((step, index) => {
      const stepTypeMap: Record<string, string> = {
        analysis: '分析',
        hypothesis: '假设',
        verification: '验证',
        reflection: '反思',
        synthesis: '综合',
        critique: '批判',
      };
      
      formatted += `### 步骤 ${index + 1}: ${stepTypeMap[step.type] || step.type}\n`;
      formatted += `**置信度**: ${(step.confidence * 100).toFixed(1)}%\n\n`;
      formatted += `${step.content}\n\n`;
    });
    
    formatted += `## 最终结论\n\n${process.finalConclusion}\n`;
    
    return formatted;
  }
}