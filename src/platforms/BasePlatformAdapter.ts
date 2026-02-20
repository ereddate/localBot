import { PlatformAdapter, PlatformConfig, PlatformMessage } from './PlatformAdapter';
import { PlatformType } from '../types';
import { Logger } from '../utils/Logger';

export abstract class BasePlatformAdapter implements PlatformAdapter {
  protected config: PlatformConfig;
  protected messageCallback?: (message: PlatformMessage) => void;
  protected errorCallback?: (error: Error) => void;
  protected connected: boolean = false;

  constructor(
    public readonly platform: PlatformType,
    public readonly name: string,
    defaultConfig: PlatformConfig
  ) {
    this.config = { ...defaultConfig };
  }

  async initialize(config: PlatformConfig): Promise<void> {
    this.config = { ...this.config, ...config };
    Logger.info(`${this.name} platform initialized`, { enabled: this.config.enabled });
  }

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;

  isConnected(): boolean {
    return this.connected;
  }

  abstract sendMessage(platformUserId: string, message: string, options?: Record<string, unknown>): Promise<void>;
  abstract sendFile(platformUserId: string, filePath: string, caption?: string): Promise<void>;

  onMessage(callback: (message: PlatformMessage) => void): void {
    this.messageCallback = callback;
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallback = callback;
  }

  protected handleMessage(message: PlatformMessage): void {
    if (this.messageCallback) {
      this.messageCallback(message);
    }
  }

  protected handleError(error: Error): void {
    Logger.error(`${this.name} platform error`, { error: error.message });
    if (this.errorCallback) {
      this.errorCallback(error);
    }
  }

  getPlatformUserId(userId: string): string {
    return userId;
  }

  getUserId(platformUserId: string): string {
    return platformUserId;
  }

  getConfig(): PlatformConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<PlatformConfig>): void {
    this.config = { ...this.config, ...config };
    Logger.info(`${this.name} config updated`, { enabled: this.config.enabled });
  }

  protected ensureConnected(): void {
    if (!this.connected) {
      throw new Error(`${this.name} is not connected`);
    }
  }
}
