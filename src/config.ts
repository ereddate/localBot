import * as dotenv from 'dotenv';

dotenv.config();

export type LLMProvider = 'openai' | 'aliyun' | 'anthropic' | 'baidu' | 'tencent' | 'zhipu' | 'siliconcloud' | 'ollama';
export type PlatformType = 'cli' | 'api' | 'mcp' | 'telegram' | 'discord' | 'slack' | 'whatsapp' | 'web';

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
  },
};
