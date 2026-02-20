import { PlatformAdapter, PlatformConfig, PlatformMessage } from './PlatformAdapter';
import { PlatformType } from '../types';
import { Logger } from '../utils/Logger';

export interface WebPlatformConfig extends PlatformConfig {
  enabled: boolean;
  apiUrl?: string;
  apiKey?: string;
  corsOrigins?: string[];
}

export class WebAdapter implements PlatformAdapter {
  readonly platform: PlatformType = 'web';
  readonly name: string = 'Web Platform';

  private config: WebPlatformConfig | null = null;
  private connected: boolean = false;
  private messageCallbacks: Array<(message: PlatformMessage) => void> = [];
  private errorCallbacks: Array<(error: Error) => void> = [];

  async initialize(config: WebPlatformConfig): Promise<void> {
    this.config = config;
    Logger.info('Web platform initialized', { enabled: config.enabled });
  }

  async connect(): Promise<void> {
    if (!this.config?.enabled) {
      Logger.warn('Web platform is disabled');
      return;
    }

    this.connected = true;
    Logger.info('Web platform connected');
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    Logger.info('Web platform disconnected');
  }

  isConnected(): boolean {
    return this.connected;
  }

  async sendMessage(platformUserId: string, message: string, options?: Record<string, unknown>): Promise<void> {
    if (!this.connected) {
      throw new Error('Web platform is not connected');
    }

    Logger.info('Sending message to web user', { platformUserId, messageLength: message.length });

    // Web platform uses WebSocket or HTTP polling to deliver messages
    // The actual implementation would depend on the web client setup
    // This is a placeholder for the message delivery mechanism
  }

  async sendFile(platformUserId: string, filePath: string, caption?: string): Promise<void> {
    if (!this.connected) {
      throw new Error('Web platform is not connected');
    }

    Logger.info('Sending file to web user', { platformUserId, filePath, caption });

    // Web platform file delivery implementation
    // Would typically use HTTP upload or WebSocket binary transfer
  }

  onMessage(callback: (message: PlatformMessage) => void): void {
    this.messageCallbacks.push(callback);
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallbacks.push(callback);
  }

  getPlatformUserId(userId: string): string {
    return `web_${userId}`;
  }

  getUserId(platformUserId: string): string {
    return platformUserId.replace('web_', '');
  }

  getConfig(): PlatformConfig {
    return this.config ? { ...this.config } : { enabled: false };
  }

  updateConfig(config: Partial<WebPlatformConfig>): void {
    if (this.config) {
      this.config = { ...this.config, ...config };
      Logger.info('Web platform config updated', { config: this.config });
    }
  }

  private notifyMessage(message: PlatformMessage): void {
    this.messageCallbacks.forEach(callback => {
      try {
        callback(message);
      } catch (error) {
        Logger.error('Error in message callback', { error });
      }
    });
  }

  private notifyError(error: Error): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (err) {
        Logger.error('Error in error callback', { error: err });
      }
    });
  }

  handleIncomingMessage(userId: string, content: string, metadata?: Record<string, unknown>): void {
    const message: PlatformMessage = {
      id: `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      platform: this.platform,
      platformUserId: this.getPlatformUserId(userId),
      content,
      timestamp: new Date(),
      metadata: metadata || {},
    };

    this.notifyMessage(message);
  }
}
