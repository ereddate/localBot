import { PlatformType } from '../types';

export interface PlatformMessage {
  id: string;
  platform: PlatformType;
  platformUserId: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface PlatformConfig {
  enabled: boolean;
  token?: string;
  webhookUrl?: string;
  [key: string]: unknown;
}

export interface PlatformAdapter {
  readonly platform: PlatformType;
  readonly name: string;

  initialize(config: PlatformConfig): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  sendMessage(platformUserId: string, message: string, options?: Record<string, unknown>): Promise<void>;
  sendFile(platformUserId: string, filePath: string, caption?: string): Promise<void>;

  onMessage(callback: (message: PlatformMessage) => void): void;
  onError(callback: (error: Error) => void): void;

  getPlatformUserId(userId: string): string;
  getUserId(platformUserId: string): string;

  getConfig(): PlatformConfig;
  updateConfig(config: Partial<PlatformConfig>): void;
}
