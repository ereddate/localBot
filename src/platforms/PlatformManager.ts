import { PlatformAdapter, PlatformMessage, PlatformConfig } from './PlatformAdapter';
import { PlatformType } from '../types';
import { TelegramAdapter } from './TelegramAdapter';
import { DiscordAdapter } from './DiscordAdapter';
import { SlackAdapter } from './SlackAdapter';
import { WhatsAppAdapter } from './WhatsAppAdapter';
import { WebAdapter } from './WebAdapter';
import { Logger } from '../utils/Logger';

export class PlatformManager {
  private adapters: Map<PlatformType, PlatformAdapter> = new Map();
  private messageHandlers: Array<(message: PlatformMessage) => void> = [];
  private errorHandlers: Array<(error: Error, platform: PlatformType) => void> = [];

  constructor() {
    this.registerAdapters();
  }

  private registerAdapters(): void {
    this.adapters.set('telegram', new TelegramAdapter());
    this.adapters.set('discord', new DiscordAdapter());
    this.adapters.set('slack', new SlackAdapter());
    this.adapters.set('whatsapp', new WhatsAppAdapter());
    this.adapters.set('web', new WebAdapter());

    Logger.info('Platform adapters registered', {
      platforms: Array.from(this.adapters.keys()),
    });
  }

  async initialize(configs: Record<PlatformType, PlatformConfig>): Promise<void> {
    for (const [platform, config] of Object.entries(configs)) {
      const adapter = this.adapters.get(platform as PlatformType);
      if (adapter && config.enabled) {
        try {
          await adapter.initialize(config);
          Logger.info(`Platform ${platform} initialized`, { enabled: config.enabled });
        } catch (error) {
          Logger.error(`Failed to initialize platform ${platform}`, {
            error: (error as Error).message,
          });
        }
      }
    }
  }

  async connect(platform?: PlatformType): Promise<void> {
    if (platform) {
      const adapter = this.adapters.get(platform);
      if (adapter) {
        await adapter.connect();
        adapter.onMessage(this.handleMessage.bind(this));
        adapter.onError((error) => this.handleError(error, platform));
        Logger.info(`Platform ${platform} connected`);
      }
    } else {
      for (const [platformType, adapter] of this.adapters.entries()) {
        if (adapter.getConfig().enabled) {
          try {
            await adapter.connect();
            adapter.onMessage(this.handleMessage.bind(this));
            adapter.onError((error) => this.handleError(error, platformType));
            Logger.info(`Platform ${platformType} connected`);
          } catch (error) {
            Logger.error(`Failed to connect platform ${platformType}`, {
              error: (error as Error).message,
            });
          }
        }
      }
    }
  }

  async disconnect(platform?: PlatformType): Promise<void> {
    if (platform) {
      const adapter = this.adapters.get(platform);
      if (adapter) {
        await adapter.disconnect();
        Logger.info(`Platform ${platform} disconnected`);
      }
    } else {
      for (const [platformType, adapter] of this.adapters.entries()) {
        if (adapter.isConnected()) {
          await adapter.disconnect();
          Logger.info(`Platform ${platformType} disconnected`);
        }
      }
    }
  }

  async sendMessage(
    platform: PlatformType,
    platformUserId: string,
    message: string,
    options?: Record<string, unknown>
  ): Promise<void> {
    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new Error(`Platform ${platform} not found`);
    }

    if (!adapter.isConnected()) {
      throw new Error(`Platform ${platform} is not connected`);
    }

    await adapter.sendMessage(platformUserId, message, options);
  }

  async sendFile(
    platform: PlatformType,
    platformUserId: string,
    filePath: string,
    caption?: string
  ): Promise<void> {
    const adapter = this.adapters.get(platform);
    if (!adapter) {
      throw new Error(`Platform ${platform} not found`);
    }

    if (!adapter.isConnected()) {
      throw new Error(`Platform ${platform} is not connected`);
    }

    await adapter.sendFile(platformUserId, filePath, caption);
  }

  onMessage(handler: (message: PlatformMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  onError(handler: (error: Error, platform: PlatformType) => void): void {
    this.errorHandlers.push(handler);
  }

  private handleMessage(message: PlatformMessage): void {
    for (const handler of this.messageHandlers) {
      try {
        handler(message);
      } catch (error) {
        Logger.error('Error in message handler', {
          error: (error as Error).message,
          platform: message.platform,
        });
      }
    }
  }

  private handleError(error: Error, platform: PlatformType): void {
    for (const handler of this.errorHandlers) {
      try {
        handler(error, platform);
      } catch (handlerError) {
        Logger.error('Error in error handler', {
          error: (handlerError as Error).message,
        });
      }
    }
  }

  getAdapter(platform: PlatformType): PlatformAdapter | undefined {
    return this.adapters.get(platform);
  }

  getConnectedPlatforms(): PlatformType[] {
    return Array.from(this.adapters.entries())
      .filter(([_, adapter]) => adapter.isConnected())
      .map(([platform, _]) => platform);
  }

  getPlatformStatus(): Record<PlatformType, { connected: boolean; name: string }> {
    const status: Record<string, { connected: boolean; name: string }> = {};
    for (const [platform, adapter] of this.adapters.entries()) {
      status[platform] = {
        connected: adapter.isConnected(),
        name: adapter.name,
      };
    }
    return status as Record<PlatformType, { connected: boolean; name: string }>;
  }

  updatePlatformConfig(platform: PlatformType, config: Partial<PlatformConfig>): void {
    const adapter = this.adapters.get(platform);
    if (adapter) {
      adapter.updateConfig(config);
      Logger.info(`Platform ${platform} config updated`, { config });
    }
  }
}
