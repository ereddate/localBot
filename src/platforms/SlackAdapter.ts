import { App, Message } from '@slack/bolt';
import { BasePlatformAdapter } from './BasePlatformAdapter';
import { PlatformConfig, PlatformMessage } from './PlatformAdapter';
import { PlatformType } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs';

export class SlackAdapter extends BasePlatformAdapter {
  private app?: App;

  constructor() {
    super('slack', 'Slack', {
      enabled: false,
      token: '',
      signingSecret: '',
    });
  }

  async connect(): Promise<void> {
    if (!this.config.token || !this.config.signingSecret) {
      throw new Error('Slack token and signing secret are required');
    }

    try {
      this.app = new App({
        token: this.config.token as string,
        signingSecret: this.config.signingSecret as string,
      });

      this.app.message(async ({ message, say, client }) => {
        if (message.subtype || message.bot_id) return;

        const platformMessage: PlatformMessage = {
          id: message.ts,
          platform: this.platform,
          platformUserId: message.user,
          content: message.text || '',
          timestamp: new Date(parseFloat(message.ts) * 1000),
          metadata: {
            channel: message.channel,
            team: message.team,
            username: message.username,
          },
        };

        this.handleMessage(platformMessage);
      });

      await this.app.start();
      this.connected = true;
      Logger.info('Slack bot connected');
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.app) {
      await this.app.stop();
      this.connected = false;
      Logger.info('Slack bot disconnected');
    }
  }

  async sendMessage(platformUserId: string, message: string, options?: Record<string, unknown>): Promise<void> {
    this.ensureConnected();
    if (!this.app) return;

    try {
      const result = await this.app.client.chat.postMessage({
        channel: platformUserId,
        text: message,
        ...options,
      });

      Logger.debug('Slack message sent', { platformUserId, messageLength: message.length });
    } catch (error) {
      this.handleError(error as Error);
      throw error;
    }
  }

  async sendFile(platformUserId: string, filePath: string, caption?: string): Promise<void> {
    this.ensureConnected();
    if (!this.app) return;

    try {
      await this.app.client.files.uploadV2({
        channels: platformUserId,
        file: fs.createReadStream(filePath),
        initial_comment: caption,
      });

      Logger.debug('Slack file sent', { platformUserId, filePath });
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
