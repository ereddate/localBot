import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

export class TranslationTool implements Tool {
  name = 'translation';
  description = '文本翻译工具';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const text = params.text as string;
      const sourceLang = params.sourceLang as string || 'auto';
      const targetLang = params.targetLang as string || 'en';

      if (!text) {
        return { success: false, error: 'Text to translate is required' };
      }

      // 简单的模拟翻译 - 在实际应用中这里会调用真实的翻译API
      const mockTranslations: Record<string, string> = {
        'hello': '你好',
        'world': '世界',
        'good morning': '早上好',
        'how are you': '你好吗',
        'thank you': '谢谢',
        'goodbye': '再见',
        'please': '请',
        'sorry': '对不起',
        'yes': '是',
        'no': '否',
        'help': '帮助',
        'home': '家',
        'family': '家庭',
        'work': '工作',
        'time': '时间',
        'money': '金钱',
        'health': '健康',
        'technology': '技术',
        'artificial intelligence': '人工智能',
        'machine learning': '机器学习'
      };

      // 简单的翻译逻辑
      let translatedText = text;
      if (targetLang.toLowerCase() === 'zh' || targetLang.toLowerCase() === 'cn') {
        // 英译中
        Object.entries(mockTranslations).forEach(([english, chinese]) => {
          translatedText = translatedText.replace(new RegExp(english, 'gi'), chinese);
        });
      } else if (targetLang.toLowerCase() === 'en') {
        // 中译英
        Object.entries(mockTranslations).forEach(([english, chinese]) => {
          translatedText = translatedText.replace(new RegExp(chinese, 'g'), english);
        });
      } else {
        // 其他情况返回原文
        translatedText = text;
      }

      return {
        success: true,
        data: {
          originalText: text,
          translatedText,
          sourceLang,
          targetLang
        }
      };
    } catch (error) {
      Logger.error('Translation tool error', { error: (error as Error).message });
      return { success: false, error: `Failed to translate: ${(error as Error).message}` };
    }
  }
}