import axios from 'axios';
import { BasePlatformAdapter } from './BasePlatformAdapter';
import { PlatformAdapter, PlatformConfig, PlatformMessage } from './PlatformAdapter';
import { PlatformType } from '../types';
import { Logger } from '../utils/Logger';

export interface WeComPlatformConfig extends PlatformConfig {
  webhookUrl: string;
  secret?: string;
}

export interface WeComMessage {
  msgtype: 'text' | 'markdown' | 'image' | 'news' | 'file';
  text?: {
    content: string;
    mentioned_list?: string[];
    mentioned_mobile_list?: string[];
  };
  markdown?: {
    content: string;
  };
  image?: {
    media_id: string;
  };
  news?: {
    articles: Array<{
      title: string;
      description: string;
      url: string;
      picurl?: string;
    }>;
  };
  file?: {
    media_id: string;
  };
}

export class WeComAdapter extends BasePlatformAdapter implements PlatformAdapter {
  readonly platform: PlatformType = 'wecom';
  readonly name: string = 'WeCom Platform';

  private wecomConfig: WeComPlatformConfig | null = null;
  private messageCallbacks: Array<(message: PlatformMessage) => void> = [];
  private errorCallbacks: Array<(error: Error) => void> = [];

  constructor() {
    super('wecom', 'WeCom Platform', {
      enabled: false,
      webhookUrl: '',
    });
  }

  async initialize(config: WeComPlatformConfig): Promise<void> {
    await super.initialize(config);
    this.wecomConfig = config;
    Logger.info('WeCom platform initialized', {
      enabled: config.enabled,
      webhookUrl: config.webhookUrl ? '***' : 'not set',
    });
  }

  async connect(): Promise<void> {
    if (!this.config.enabled) {
      Logger.warn('WeCom platform is disabled');
      return;
    }

    if (!this.wecomConfig?.webhookUrl) {
      throw new Error('WeCom webhook URL is required');
    }

    try {
      await this.testConnection();
      this.connected = true;
      Logger.info('WeCom platform connected');
    } catch (error) {
      Logger.error('Failed to connect to WeCom', { error });
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    Logger.info('WeCom platform disconnected');
  }

  async sendMessage(platformUserId: string, message: string, options?: Record<string, unknown>): Promise<void> {
    if (!this.connected || !this.wecomConfig) {
      throw new Error('WeCom platform is not connected');
    }

    try {
      const wecomMessage = this.convertToWeComMessage(platformUserId, message, options);
      await this.sendToWebhook(wecomMessage);
      Logger.debug('Message sent to WeCom', { platformUserId });
    } catch (error) {
      Logger.error('Failed to send message to WeCom', {
        platformUserId,
        error,
      });
      throw error;
    }
  }

  private async sendToWebhook(message: WeComMessage): Promise<void> {
    if (!this.wecomConfig?.webhookUrl) {
      throw new Error('WeCom webhook URL is not configured');
    }

    const response = await axios.post(this.wecomConfig.webhookUrl, message, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    if (response.data.errcode !== 0) {
      throw new Error(`WeCom API error: ${response.data.errmsg}`);
    }
  }

  private convertToWeComMessage(platformUserId: string, message: string, options?: Record<string, unknown>): WeComMessage {
    const content = message;

    if (content.startsWith('```markdown')) {
      return {
        msgtype: 'markdown',
        markdown: {
          content: content.replace(/```markdown\n?/g, ''),
        },
      };
    }

    if (content.startsWith('```')) {
      return {
        msgtype: 'text',
        text: {
          content: content,
        },
      };
    }

    if (content.includes('![') && content.includes('](')) {
      return {
        msgtype: 'text',
        text: {
          content: content,
        },
      };
    }

    return {
      msgtype: 'text',
      text: {
        content: content,
      },
    };
  }

  async sendText(content: string, mentionedList?: string[]): Promise<void> {
    if (!this.connected || !this.wecomConfig) {
      throw new Error('WeCom platform is not connected');
    }

    const message: WeComMessage = {
      msgtype: 'text',
      text: {
        content,
        mentioned_list: mentionedList,
      },
    };

    await this.sendToWebhook(message);
  }

  async sendMarkdown(content: string): Promise<void> {
    if (!this.connected || !this.wecomConfig) {
      throw new Error('WeCom platform is not connected');
    }

    const message: WeComMessage = {
      msgtype: 'markdown',
      markdown: {
        content,
      },
    };

    await this.sendToWebhook(message);
  }

  async sendNews(articles: Array<{
    title: string;
    description: string;
    url: string;
    picurl?: string;
  }>): Promise<void> {
    if (!this.connected || !this.wecomConfig) {
      throw new Error('WeCom platform is not connected');
    }

    const message: WeComMessage = {
      msgtype: 'news',
      news: {
        articles,
      },
    };

    await this.sendToWebhook(message);
  }

  onMessage(callback: (message: PlatformMessage) => void): void {
    this.messageCallbacks.push(callback);
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallbacks.push(callback);
  }

  private notifyMessage(message: PlatformMessage): void {
    for (const callback of this.messageCallbacks) {
      try {
        callback(message);
      } catch (error) {
        Logger.error('Error in message callback', { error });
      }
    }
  }

  private notifyError(error: Error): void {
    for (const callback of this.errorCallbacks) {
      try {
        callback(error);
      } catch (err) {
        Logger.error('Error in error callback', { error: err });
      }
    }
  }

  private async testConnection(): Promise<void> {
    const testMessage: WeComMessage = {
      msgtype: 'text',
      text: {
        content: 'LocalBot 连接测试成功！',
      },
    };

    await this.sendToWebhook(testMessage);
  }

  getPlatformUserId(userId: string): string {
    return `wecom_${userId}`;
  }

  async getPlatformInfo(): Promise<Record<string, unknown>> {
    return {
      platform: this.platform,
      name: this.name,
      connected: this.connected,
      webhookUrl: this.config?.webhookUrl ? '***' : 'not set',
    };
  }

  async handleIncomingMessage(userId: string, content: string, metadata?: Record<string, unknown>): Promise<void> {
    const message: PlatformMessage = {
      id: `wecom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      platform: this.platform,
      platformUserId: this.getPlatformUserId(userId),
      content,
      timestamp: new Date(),
      metadata: metadata || {},
    };

    this.notifyMessage(message);
  }

  async sendFile(mediaId: string): Promise<void> {
    if (!this.connected || !this.config) {
      throw new Error('WeCom platform is not connected');
    }

    const message: WeComMessage = {
      msgtype: 'file',
      file: {
        media_id: mediaId,
      },
    };

    await this.sendToWebhook(message);
  }

  async sendImage(mediaId: string): Promise<void> {
    if (!this.connected || !this.config) {
      throw new Error('WeCom platform is not connected');
    }

    const message: WeComMessage = {
      msgtype: 'image',
      image: {
        media_id: mediaId,
      },
    };

    await this.sendToWebhook(message);
  }
}
