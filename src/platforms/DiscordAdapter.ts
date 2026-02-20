import { Client, GatewayIntentBits, Message } from 'discord.js';
import { BasePlatformAdapter } from './BasePlatformAdapter';
import { PlatformConfig, PlatformMessage } from './PlatformAdapter';
import { PlatformType } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs';

export class DiscordAdapter extends BasePlatformAdapter {
  private client?: Client;

  constructor() {
    super('discord', 'Discord', {
      enabled: false,
      token: '',
    });
  }

  async connect(): Promise<void> {
    if (!this.config.token) {
      throw new Error('Discord token is required');
    }

    try {
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.DirectMessages,
        ],
      });

      this.client.on('ready', () => {
        Logger.info('Discord bot connected', { username: this.client?.user?.tag });
      });

      this.client.on('messageCreate', async (message: Message) => {
        if (message.author.bot) return;

        const platformMessage: PlatformMessage = {
          id: message.id,
          platform: this.platform,
          platformUserId: message.author.id,
          content: message.content,
          timestamp: message.createdAt,
          metadata: {
            guildId: message.guildId,
            channelId: message.channelId,
            username: message.author.username,
            discriminator: message.author.discriminator,
          },
        };

        this.handleMessage(platformMessage);
      });

      this.client.on('error', (error) => {
        this.handleError(new Error(`Discord error: ${error.message}`));
      });

      await this.client.login(this.config.token as string);
      this.connected = true;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      this.client.destroy();
      this.connected = false;
      Logger.info('Discord bot disconnected');
    }
  }

  async sendMessage(platformUserId: string, message: string, options?: Record<string, unknown>): Promise<void> {
    this.ensureConnected();
    if (!this.client) return;

    try {
      const user = await this.client.users.fetch(platformUserId);
      await user.send(message);

      Logger.debug('Discord message sent', { platformUserId, messageLength: message.length });
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  async sendFile(platformUserId: string, filePath: string, caption?: string): Promise<void> {
    this.ensureConnected();
    if (!this.client) return;

    try {
      const user = await this.client.users.fetch(platformUserId);
      await user.send({
        files: [{ attachment: filePath, name: filePath.split('/').pop() }],
        content: caption,
      });

      Logger.debug('Discord file sent', { platformUserId, filePath });
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  getPlatformUserId(userId: string): string {
    return userId;
  }

  getUserId(platformUserId: string): string {
    return platformUserId;
  }
}
