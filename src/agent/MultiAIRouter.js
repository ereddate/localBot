"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiAIRouter = void 0;
const config_1 = require("../config");
const Logger_1 = require("../utils/Logger");
class MultiAIRouter {
    constructor() {
        this.providers = new Map();
        this.usageStats = new Map();
        this.initializeProviders();
        this.currentProvider = config_1.config.llmProvider;
    }
    initializeProviders() {
        this.providers.set('openai', {
            name: 'openai',
            displayName: 'OpenAI GPT-4',
            priority: 1,
            capabilities: ['reasoning', 'coding', 'analysis'],
            costPerToken: 0.00003,
            maxTokens: 8192,
            latency: 2000,
        });
        this.providers.set('aliyun', {
            name: 'aliyun',
            displayName: 'Aliyun 通义千问',
            priority: 2,
            capabilities: ['chinese', 'reasoning', 'coding'],
            costPerToken: 0.00002,
            maxTokens: 8192,
            latency: 1500,
        });
        this.providers.set('anthropic', {
            name: 'anthropic',
            displayName: 'Anthropic Claude',
            priority: 3,
            capabilities: ['reasoning', 'analysis', 'long-context'],
            costPerToken: 0.000015,
            maxTokens: 200000,
            latency: 3000,
        });
        this.providers.set('baidu', {
            name: 'baidu',
            displayName: 'Baidu ERNIE Bot',
            priority: 4,
            capabilities: ['chinese', 'reasoning', 'search'],
            costPerToken: 0.000018,
            maxTokens: 4096,
            latency: 1800,
        });
        this.providers.set('tencent', {
            name: 'tencent',
            displayName: 'Tencent HunYuan',
            priority: 5,
            capabilities: ['chinese', 'reasoning', 'multimodal'],
            costPerToken: 0.00002,
            maxTokens: 32768,
            latency: 2200,
        });
        this.providers.set('zhipu', {
            name: 'zhipu',
            displayName: 'Zhipu ChatGLM',
            priority: 6,
            capabilities: ['chinese', 'reasoning', 'coding'],
            costPerToken: 0.000015,
            maxTokens: 8192,
            latency: 2000,
        });
        this.providers.set('siliconcloud', {
            name: 'siliconcloud',
            displayName: 'SiliconCloud',
            priority: 7,
            capabilities: ['chinese', 'reasoning', 'cost-effective'],
            costPerToken: 0.000012,
            maxTokens: 32768,
            latency: 1600,
        });
        this.providers.forEach((_, provider) => {
            this.usageStats.set(provider, { calls: 0, errors: 0 });
        });
        Logger_1.Logger.info('Multi-AI router initialized', {
            providers: Array.from(this.providers.keys())
        });
    }
    getCurrentProvider() {
        return this.currentProvider;
    }
    setCurrentProvider(provider) {
        if (!this.providers.has(provider)) {
            Logger_1.Logger.warn(`Invalid provider requested: ${provider}`);
            return;
        }
        this.currentProvider = provider;
        Logger_1.Logger.info(`AI provider switched to: ${provider}`);
    }
    getBestProviderForTask(taskType, language = 'en') {
        let bestProvider = this.currentProvider;
        let bestScore = 0;
        console.log(`🔄 选择AI提供商: 任务类型=${taskType}, 语言=${language}`);
        for (const [provider, config] of this.providers.entries()) {
            let score = 0;
            if (language === 'zh' && config.capabilities.includes('chinese')) {
                score += 10;
            }
            if (taskType === 'coding' && config.capabilities.includes('coding')) {
                score += 8;
            }
            if (taskType === 'reasoning' && config.capabilities.includes('reasoning')) {
                score += 6;
            }
            const stats = this.usageStats.get(provider) || { calls: 0, errors: 0 };
            const errorRate = stats.calls > 0 ? stats.errors / stats.calls : 0;
            score -= errorRate * 5;
            score += config.priority;
            if (score > bestScore) {
                bestScore = score;
                bestProvider = provider;
            }
        }
        console.log(`✅ 选择AI提供商: ${bestProvider} (分数: ${bestScore})`);
        return bestProvider;
    }
    getProviderConfig(provider) {
        return this.providers.get(provider);
    }
    getAllProviders() {
        return Array.from(this.providers.values());
    }
    recordCall(provider, success) {
        const stats = this.usageStats.get(provider) || { calls: 0, errors: 0 };
        stats.calls++;
        if (!success) {
            stats.errors++;
        }
        this.usageStats.set(provider, stats);
    }
    getUsageStats() {
        const result = new Map();
        for (const [provider, stats] of this.usageStats.entries()) {
            const errorRate = stats.calls > 0 ? stats.errors / stats.calls : 0;
            result.set(provider, {
                calls: stats.calls,
                errors: stats.errors,
                errorRate: Math.round(errorRate * 100) / 100,
            });
        }
        return result;
    }
    getProviderForCapability(capability) {
        for (const [provider, config] of this.providers.entries()) {
            if (config.capabilities.includes(capability)) {
                return provider;
            }
        }
        return undefined;
    }
    isProviderAvailable(provider) {
        return this.providers.has(provider);
    }
    getRecommendedProvider(language = 'en') {
        if (language === 'zh') {
            return 'aliyun';
        }
        return 'openai';
    }
}
exports.MultiAIRouter = MultiAIRouter;
