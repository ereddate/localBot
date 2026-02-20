import TelegramBot from 'node-telegram-bot-api';
import { BasePlatformAdapter } from './BasePlatformAdapter';
import { PlatformConfig, PlatformMessage } from './PlatformAdapter';
import { PlatformType } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs';

export class TelegramAdapter extends BasePlatformAdapter {
  private bot?: TelegramBot;

  constructor() {
    super('telegram', 'Telegram', {
      enabled: false,
      token: '',
    });
  }

  async connect(): Promise<void> {
    if (!this.config.token) {
      throw new Error('Telegram token is required');
    }

    try {
      this.bot = new TelegramBot(this.config.token as string, { polling: true });

      this.bot.on('message', async (msg) => {
        const platformMessage: PlatformMessage = {
          id: msg.message_id.toString(),
          platform: this.platform,
          platformUserId: msg.from?.id.toString() || 'unknown',
          content: msg.text || '',
          timestamp: new Date(msg.date * 1000),
          metadata: {
            chatId: msg.chat.id,
            username: msg.from?.username,
            firstName: msg.from?.first_name,
            lastName: msg.from?.last_name,
          },
        };

        this.handleMessage(platformMessage);
      });

      this.bot.on('polling_error', (error) => {
        this.handleError(new Error(`Telegram polling error: ${error.message}`));
      });

      this.connected = true;
      Logger.info('Telegram bot connected', { botInfo: await this.bot.getMe() });
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.bot) {
      await this.bot.stopPolling();
      this.connected = false;
      Logger.info('Telegram bot disconnected');
    }
  }

  async sendMessage(platformUserId: string, message: string, options?: Record<string, unknown>): Promise<void> {
    this.ensureConnected();
    if (!this.bot) return;

    try {
      const chatId = parseInt(platformUserId);
      await this.bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        ...options,
      });
      Logger.debug('Telegram message sent', { platformUserId, messageLength: message.length });
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  async sendFile(platformUserId: string, filePath: string, caption?: string): Promise<void> {
    this.ensureConnected();
    if (!this.bot) return;

    try {
      const chatId = parseInt(platformUserId);
      const fileStream = fs.createReadStream(filePath);

      await this.bot.sendDocument(chatId, fileStream, {
        caption,
      });

      Logger.debug('Telegram file sent', { platformUserId, filePath });
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
