import dotenv from 'dotenv';

dotenv.config();

export type LLMProvider = 'openai' | 'aliyun' | 'anthropic';

export interface Config {
  llmProvider: LLMProvider;
  openaiApiKey: string;
  aliyunApiKey: string;
  aliyunModel: string;
  anthropicApiKey: string;
  port: number;
  logLevel: string;
  memoryDir: string;
  skillsDir: string;
}

export const config: Config = {
  llmProvider: (process.env.LLM_PROVIDER as LLMProvider) || 'openai',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  aliyunApiKey: process.env.ALIYUN_API_KEY || '',
  aliyunModel: process.env.ALIYUN_MODEL || 'qwen-plus',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  memoryDir: process.env.MEMORY_DIR || './memory',
  skillsDir: process.env.SKILLS_DIR || './skills',
};
