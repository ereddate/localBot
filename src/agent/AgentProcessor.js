"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentProcessor = void 0;
const config_1 = require("../config");
const openai_1 = __importDefault(require("openai"));
const Logger_1 = require("../utils/Logger");
const RetryHandler_1 = require("../utils/RetryHandler");
const MultiAIRouter_1 = require("./MultiAIRouter");
const AutomationController_1 = require("../tasks/AutomationController");
class AgentProcessor {
    constructor(skillManager) {
        this.skillManager = skillManager;
        this.conversationHistory = new Map();
        this.router = new MultiAIRouter_1.MultiAIRouter();
        this.openai = this.createClient(this.router.getCurrentProvider());
    }
    async initializeAutomation() {
        if (this.skillManager) {
            this.automationController = new AutomationController_1.AutomationController(this.skillManager);
            await this.automationController.initialize();
            Logger_1.Logger.info('Automation controller initialized');
        }
        else {
            Logger_1.Logger.warn('Cannot initialize automation controller: SkillManager not provided');
        }
    }
    getAutomationController() {
        return this.automationController;
    }
    getRouter() {
        return this.router;
    }
    createClient(provider) {
        switch (provider) {
            case 'aliyun':
                return new openai_1.default({
                    apiKey: config_1.config.aliyunApiKey,
                    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
                });
            case 'openai':
                return new openai_1.default({
                    apiKey: config_1.config.openaiApiKey,
                });
            case 'anthropic':
                return new openai_1.default({
                    apiKey: config_1.config.anthropicApiKey,
                    baseURL: 'https://api.anthropic.com/v1',
                });
            case 'baidu':
                // For Baidu ERNIE Bot, we use a compatible OpenAI-style client
                return new openai_1.default({
                    apiKey: config_1.config.baiduApiKey,
                    baseURL: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat',
                });
            case 'tencent':
                // For Tencent HunYuan, we use a compatible OpenAI-style client
                return new openai_1.default({
                    apiKey: config_1.config.tencentApiKey,
                    baseURL: 'https://hunyuan.cloud.tencent.com/v1',
                });
            case 'zhipu':
                // For Zhipu ChatGLM, we use a compatible OpenAI-style client
                return new openai_1.default({
                    apiKey: config_1.config.zhipuApiKey,
                    baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
                });
            case 'siliconcloud':
                // For SiliconCloud, we use a compatible OpenAI-style client
                return new openai_1.default({
                    apiKey: config_1.config.siliconcloudApiKey,
                    baseURL: 'https://api.siliconflow.cn/v1',
                });
            default:
                return new openai_1.default({
                    apiKey: config_1.config.openaiApiKey,
                });
        }
    }
    getModel(provider) {
        switch (provider) {
            case 'aliyun':
                return config_1.config.aliyunModel;
            case 'openai':
                return 'gpt-4';
            case 'anthropic':
                return 'claude-3-opus-20240229';
            case 'baidu':
                return 'ernie-4.5-8k'; // Using ERNIE Bot 4.5 as default
            case 'tencent':
                return 'hunyuan-pro'; // Using HunYuan Pro as default
            case 'zhipu':
                return 'glm-4'; // Using GLM-4 as default
            case 'siliconcloud':
                return 'Qwen/Qwen2-72B-Instruct'; // Using Qwen2-72B as default
            default:
                return 'gpt-4';
        }
    }
    switchProvider(provider) {
        this.router.setCurrentProvider(provider);
        this.openai = this.createClient(provider);
        Logger_1.Logger.info(`Switched to provider: ${provider}`);
    }
    getBestProviderForTask(taskType, language) {
        return this.router.getBestProviderForTask(taskType, language);
    }
    async process(context) {
        const systemPrompt = this.buildSystemPrompt(context);
        const messages = this.buildMessages(context, systemPrompt);
        const currentProvider = this.router.getCurrentProvider();
        try {
            const completion = await RetryHandler_1.RetryHandler.execute(() => this.openai.chat.completions.create({
                model: this.getModel(currentProvider),
                messages,
                temperature: 0.7,
                max_tokens: 2000,
            }), { maxRetries: 3, initialDelay: 1000 });
            const response = completion.choices[0]?.message?.content || 'No response generated';
            this.router.recordCall(currentProvider, true);
            Logger_1.Logger.info(`Generated response for session ${context.sessionId}`, {
                provider: currentProvider,
                length: response.length,
            });
            await this.checkAndExecuteTools(context, response);
            return response;
        }
        catch (error) {
            this.router.recordCall(currentProvider, false);
            Logger_1.Logger.error('Error processing message', {
                error: error.message,
                sessionId: context.sessionId,
                provider: currentProvider,
            });
            return `I encountered an error: ${error.message}. Please try again.`;
        }
    }
    buildSystemPrompt(context) {
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
    groupToolsByCategory(tools) {
        const grouped = {};
        tools.forEach(tool => {
            const category = tool.category || 'other';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(tool);
        });
        return grouped;
    }
    buildMessages(context, systemPrompt) {
        const messages = [
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
    async checkAndExecuteTools(context, response) {
        const toolMatches = response.matchAll(/TOOL:\s*(\w+)/g);
        const paramsMatches = response.matchAll(/PARAMS:\s*({.*?})/g);
        const toolNames = Array.from(toolMatches).map(m => m[1]);
        const paramsArray = Array.from(paramsMatches).map(m => {
            try {
                return JSON.parse(m[1]);
            }
            catch {
                return {};
            }
        });
        for (let i = 0; i < toolNames.length; i++) {
            const toolName = toolNames[i];
            const params = paramsArray[i] || {};
            const tool = context.availableTools.find(t => t.name === toolName);
            if (tool) {
                Logger_1.Logger.info(`Executing tool: ${toolName}`, { params });
                try {
                    const result = await tool.execute(params);
                    Logger_1.Logger.info(`Tool ${toolName} executed successfully`, {
                        success: result.success,
                        data: result.data
                    });
                }
                catch (error) {
                    Logger_1.Logger.error(`Error executing tool ${toolName}`, {
                        error: error.message
                    });
                }
            }
            else {
                Logger_1.Logger.warn(`Tool ${toolName} not found`);
            }
        }
    }
    clearHistory(sessionId) {
        this.conversationHistory.delete(sessionId);
        Logger_1.Logger.info(`Cleared conversation history for session ${sessionId}`);
    }
}
exports.AgentProcessor = AgentProcessor;
