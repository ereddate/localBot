import { Client as WhatsAppClient, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import { BasePlatformAdapter } from './BasePlatformAdapter';
import { PlatformConfig, PlatformMessage } from './PlatformAdapter';
import { PlatformType } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs';

export class WhatsAppAdapter extends BasePlatformAdapter {
  private client?: WhatsAppClient;

  constructor() {
    super('whatsapp', 'WhatsApp', {
      enabled: false,
      sessionPath: './sessions/whatsapp',
    });
  }

  async connect(): Promise<void> {
    try {
      this.client = new WhatsAppClient({
        authStrategy: new LocalAuth({
          dataPath: this.config.sessionPath as string,
        }),
        puppeteer: {
          headless: true,
        },
      });

      this.client.on('qr', (qr) => {
        Logger.info('WhatsApp QR code generated', { qr });
      });

      this.client.on('ready', () => {
        Logger.info('WhatsApp client ready', { user: this.client?.info.pushname });
      });

      this.client.on('message', async (message) => {
        if (message.fromMe) return;

        const contact = await message.getContact();

        const platformMessage: PlatformMessage = {
          id: message.id.id,
          platform: this.platform,
          platformUserId: message.from,
          content: message.body,
          timestamp: new Date(message.timestamp * 1000),
          metadata: {
            chatId: message.from,
            contactName: contact.pushname,
            contactNumber: contact.number,
          },
        };

        this.handleMessage(platformMessage);
      });

      this.client.on('error', (error) => {
        this.handleError(new Error(`WhatsApp error: ${error.message}`));
      });

      await this.client.initialize();
      this.connected = true;
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.destroy();
      this.connected = false;
      Logger.info('WhatsApp client disconnected');
    }
  }

  async sendMessage(platformUserId: string, message: string, options?: Record<string, unknown>): Promise<void> {
    this.ensureConnected();
    if (!this.client) return;

    try {
      const chatId = platformUserId.includes('@c.us') ? platformUserId : `${platformUserId}@c.us`;
      await this.client.sendMessage(chatId, message);

      Logger.debug('WhatsApp message sent', { platformUserId, messageLength: message.length });
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  async sendFile(platformUserId: string, filePath: string, caption?: string): Promise<void> {
    this.ensureConnected();
    if (!this.client) return;

    try {
      const chatId = platformUserId.includes('@c.us') ? platformUserId : `${platformUserId}@c.us`;
      const media = MessageMedia.fromFilePath(filePath);

      await this.client.sendMessage(chatId, media, { caption });

      Logger.debug('WhatsApp file sent', { platformUserId, filePath });
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  getPlatformUserId(userId: string): string {
    return userId.includes('@c.us') ? userId : `${userId}@c.us`;
  }

  getUserId(platformUserId: string): string {
    return platformUserId.replace('@c.us', '');
  }
}
