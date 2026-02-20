import * as dotenv from 'dotenv';

dotenv.config();

export type LLMProvider = 'openai' | 'aliyun' | 'anthropic' | 'baidu' | 'tencent' | 'zhipu' | 'siliconcloud' | 'ollama';
export type PlatformType = 'cli' | 'api' | 'mcp' | 'telegram' | 'discord' | 'slack' | 'whatsapp' | 'web' | 'wecom';

export interface PlatformConfig {
  enabled: boolean;
  token?: string;
  signingSecret?: string;
  webhookUrl?: string;
  sessionPath?: string;
  [key: string]: unknown;
}

export interface Config {
  llmProvider: LLMProvider;
  openaiApiKey: string;
  aliyunApiKey: string;
  aliyunModel: string;
  anthropicApiKey: string;
  baiduApiKey: string;
  baiduSecretKey: string;
  tencentApiKey: string;
  zhipuApiKey: string;
  siliconcloudApiKey: string;
  ollamaApiUrl: string;
  ollamaModelName: string;
  useGpu: boolean;
  gpuDevice: string;
  gpuMemoryFraction: number;
  port: number;
  logLevel: string;
  memoryDir: string;
  skillsDir: string;
  enablePersistence: boolean;
  persistenceDir: string;
  platforms: Record<PlatformType, PlatformConfig>;
  reverseControl: {
    enabled: boolean;
    requireApproval: boolean;
    allowedActions: string[];
    maxConcurrentActions: number;
    timeout: number;
    logActions: boolean;
  };
  proactiveEngine: {
    enabled: boolean;
    maxConcurrentTasks: number;
    taskTimeout: number;
    webhookPort: number;
    logTasks: boolean;
  };
  weatherApiKey: string;
  deepThinking: {
    enabled: boolean;
    maxRounds: number;
    roleCount: number;
    minDepthProgression: number;
    enableSelfNegation: boolean;
    enableConflictGeneration: boolean;
    maxThinkingTime: number;
  };
}

export const config: Config = {
  llmProvider: (process.env.LLM_PROVIDER as LLMProvider) || 'openai',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  aliyunApiKey: process.env.ALIYUN_API_KEY || '',
  aliyunModel: process.env.ALIYUN_MODEL || 'qwen-plus',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  baiduApiKey: process.env.BAIDU_API_KEY || '',
  baiduSecretKey: process.env.BAIDU_SECRET_KEY || '',
  tencentApiKey: process.env.TENCENT_API_KEY || '',
  zhipuApiKey: process.env.ZHIPU_API_KEY || '',
  siliconcloudApiKey: process.env.SILICONCLOUD_API_KEY || '',
  ollamaApiUrl: process.env.OLLAMA_API_URL || 'http://localhost:11434',
  ollamaModelName: process.env.OLLAMA_MODEL_NAME || 'llama3.2',
  useGpu: process.env.USE_GPU === 'true',
  gpuDevice: process.env.GPU_DEVICE || 'cpu',
  gpuMemoryFraction: parseFloat(process.env.GPU_MEMORY_FRACTION || '0.8'),
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  memoryDir: process.env.MEMORY_DIR || './memory',
  skillsDir: process.env.SKILLS_DIR || './skills',
  enablePersistence: process.env.ENABLE_PERSISTENCE !== 'false',
  persistenceDir: process.env.PERSISTENCE_DIR || './sessions',
  platforms: {
    cli: { enabled: true },
    api: { enabled: true },
    mcp: { enabled: true },
    telegram: {
      enabled: process.env.TELEGRAM_ENABLED === 'true',
      token: process.env.TELEGRAM_TOKEN || '',
    },
    discord: {
      enabled: process.env.DISCORD_ENABLED === 'true',
      token: process.env.DISCORD_TOKEN || '',
    },
    slack: {
      enabled: process.env.SLACK_ENABLED === 'true',
      token: process.env.SLACK_TOKEN || '',
      signingSecret: process.env.SLACK_SIGNING_SECRET || '',
    },
    whatsapp: {
      enabled: process.env.WHATSAPP_ENABLED === 'true',
      sessionPath: process.env.WHATSAPP_SESSION_PATH || './sessions/whatsapp',
    },
    web: {
      enabled: process.env.WEB_ENABLED === 'true',
      apiUrl: process.env.WEB_API_URL || '',
      apiKey: process.env.WEB_API_KEY || '',
      corsOrigins: process.env.WEB_CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    },
    wecom: {
      enabled: process.env.WECOM_ENABLED === 'true',
      webhookUrl: process.env.WECOM_WEBHOOK_URL || '',
      secret: process.env.WECOM_SECRET || '',
    },
  },
  reverseControl: {
    enabled: process.env.REVERSE_CONTROL_ENABLED === 'true',
    requireApproval: process.env.REVERSE_CONTROL_REQUIRE_APPROVAL !== 'false',
    allowedActions: ['system', 'browser', 'file', 'network', 'custom'],
    maxConcurrentActions: parseInt(process.env.REVERSE_CONTROL_MAX_CONCURRENT || '5', 10),
    timeout: parseInt(process.env.REVERSE_CONTROL_TIMEOUT || '30000', 10),
    logActions: true,
  },
  proactiveEngine: {
    enabled: process.env.PROACTIVE_ENGINE_ENABLED === 'true',
    maxConcurrentTasks: parseInt(process.env.PROACTIVE_ENGINE_MAX_CONCURRENT || '3', 10),
    taskTimeout: parseInt(process.env.PROACTIVE_ENGINE_TASK_TIMEOUT || '60000', 10),
    webhookPort: parseInt(process.env.PROACTIVE_ENGINE_WEBHOOK_PORT || '3001', 10),
    logTasks: true,
  },
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  deepThinking: {
    enabled: process.env.DEEP_THINKING_ENABLED === 'true',
    maxRounds: parseInt(process.env.DEEP_THINKING_MAX_ROUNDS || '3', 10),
    roleCount: parseInt(process.env.DEEP_THINKING_ROLE_COUNT || '5', 10),
    minDepthProgression: parseFloat(process.env.DEEP_THINKING_MIN_DEPTH_PROGRESSION || '5.0'),
    enableSelfNegation: process.env.DEEP_THINKING_SELF_NEGATION !== 'false',
    enableConflictGeneration: process.env.DEEP_THINKING_CONFLICT_GENERATION !== 'false',
    maxThinkingTime: parseInt(process.env.DEEP_THINKING_MAX_TIME || '60000', 10),
  },
};
