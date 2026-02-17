import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import { config } from '../config';

export class ChineseAILocalTool implements Tool {
  name = 'chinese_ai_local';
  description = '使用本地部署的AI模型进行推理';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const model = params.model as string;
      const prompt = params.prompt as string;
      const provider = params.provider as string;

      // 如果指定了提供商，则返回该提供商的信息
      if (provider) {
        const providerInfo = this.getProviderInfo(provider);
        if (!providerInfo) {
          return { success: false, error: `Unsupported provider: ${provider}. Supported providers: baidu, tencent, zhipu, siliconcloud, aliyun` };
        }
        
        return {
          success: true,
          data: {
            provider: providerInfo.name,
            model: model || providerInfo.defaultModel,
            capabilities: providerInfo.capabilities,
            supported: providerInfo.supported,
            endpoint: providerInfo.endpoint,
            message: `${providerInfo.name} is ready for use`
          }
        };
      }

      // 如果提供了prompt参数且没有指定provider，才要求prompt
      if (Object.keys(params).length > 0 && !provider && !model && prompt === undefined) {
        return { success: false, error: 'prompt is required when not querying provider info' };
      }

      // 返回所有可用的国产AI提供商信息
      const chineseProviders = [
        this.getProviderInfo('baidu'),
        this.getProviderInfo('tencent'),
        this.getProviderInfo('zhipu'),
        this.getProviderInfo('siliconcloud'),
        this.getProviderInfo('aliyun')
      ].filter(Boolean) as Array<Record<string, any>>;

      return {
        success: true,
        data: {
          chineseProviders,
          message: 'Available Chinese AI providers for local deployment'
        }
      };
    } catch (error) {
      Logger.error('Chinese AI local tool error', { error: (error as Error).message });
      return { success: false, error: `Failed to execute Chinese AI local tool: ${(error as Error).message}` };
    }
  }

  private getProviderInfo(provider: string) {
    switch (provider) {
      case 'baidu':
        return {
          name: 'Baidu ERNIE Bot (文心一言)',
          defaultModel: 'ernie-4.5-8k',
          capabilities: ['chinese', 'reasoning', 'search', 'writing'],
          supported: !!config.baiduApiKey,
          endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat'
        };
      case 'tencent':
        return {
          name: 'Tencent HunYuan (混元)',
          defaultModel: 'hunyuan-pro',
          capabilities: ['chinese', 'reasoning', 'multimodal', 'coding'],
          supported: !!config.tencentApiKey,
          endpoint: 'https://hunyuan.cloud.tencent.com/v1'
        };
      case 'zhipu':
        return {
          name: 'Zhipu ChatGLM (智谱AI)',
          defaultModel: 'glm-4',
          capabilities: ['chinese', 'reasoning', 'coding', 'long-context'],
          supported: !!config.zhipuApiKey,
          endpoint: 'https://open.bigmodel.cn/api/paas/v4/'
        };
      case 'siliconcloud':
        return {
          name: 'SiliconCloud (硅基流动)',
          defaultModel: 'Qwen/Qwen2-72B-Instruct',
          capabilities: ['chinese', 'reasoning', 'cost-effective', 'open-source'],
          supported: !!config.siliconcloudApiKey,
          endpoint: 'https://api.siliconflow.cn/v1'
        };
      case 'aliyun':
        return {
          name: 'Aliyun Tongyi Qianwen (阿里云通义千问)',
          defaultModel: config.aliyunModel || 'qwen-plus',
          capabilities: ['chinese', 'reasoning', 'coding', 'multimodal'],
          supported: !!config.aliyunApiKey,
          endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
        };
      default:
        return null;
    }
  }
}