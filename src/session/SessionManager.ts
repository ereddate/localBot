import * as fs from 'fs/promises';
import * as path from 'path';
import { SessionData, PlatformType } from '../types';
import { Logger } from '../utils/Logger';
import { config } from '../config';

export class SessionManager {
  private sessionsDir: string;
  private sessions: Map<string, SessionData> = new Map();
  private platformSessions: Map<PlatformType, Map<string, SessionData>> = new Map();

  constructor(sessionsDir?: string) {
    this.sessionsDir = sessionsDir || config.persistenceDir;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.sessionsDir, { recursive: true });
      await this.loadSessions();
      Logger.info('Session manager initialized', { sessionsDir: this.sessionsDir });
    } catch (error) {
      Logger.error('Error initializing session manager', { error: (error as Error).message });
    }
  }

  private async loadSessions(): Promise<void> {
    try {
      const files = await fs.readdir(this.sessionsDir);
      const sessionFiles = files.filter(f => f.endsWith('.json'));

      for (const file of sessionFiles) {
        const filePath = path.join(this.sessionsDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const session = JSON.parse(content) as SessionData;
        session.createdAt = new Date(session.createdAt);
        session.lastActivity = new Date(session.lastActivity);
        this.sessions.set(session.sessionId, session);
      }

      Logger.info(`Loaded ${sessionFiles.length} sessions`);
    } catch (error) {
      Logger.warn('Error loading sessions', { error: (error as Error).message });
    }
  }

  async createSession(sessionId: string, userId?: string): Promise<SessionData> {
    const session: SessionData = {
      sessionId,
      userId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.sessions.set(sessionId, session);
    await this.saveSession(sessionId);

    Logger.info('Session created', { sessionId, userId });
    return session;
  }

  async getSession(sessionId: string): Promise<SessionData | undefined> {
    return this.sessions.get(sessionId);
  }

  async updateSession(sessionId: string, messages: SessionData['messages']): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      Logger.warn('Session not found for update', { sessionId });
      return;
    }

    session.messages = messages;
    session.lastActivity = new Date();
    await this.saveSession(sessionId);

    Logger.debug('Session updated', { sessionId, messageCount: messages.length });
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);

    const filePath = path.join(this.sessionsDir, `${sessionId}.json`);
    try {
      await fs.unlink(filePath);
      Logger.info('Session deleted', { sessionId });
    } catch (error) {
      Logger.warn('Error deleting session file', { error: (error as Error).message });
    }
  }

  async saveSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const filePath = path.join(this.sessionsDir, `${sessionId}.json`);
    const content = JSON.stringify(session, null, 2);

    try {
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      Logger.error('Error saving session', { 
        sessionId, 
        error: (error as Error).message 
      });
    }
  }

  async getAllSessions(): Promise<SessionData[]> {
    return Array.from(this.sessions.values()).sort(
      (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
    );
  }

  async cleanupOldSessions(days: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const toDelete: string[] = [];
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.lastActivity < cutoffDate) {
        toDelete.push(sessionId);
      }
    }

    for (const sessionId of toDelete) {
      await this.deleteSession(sessionId);
    }

    if (toDelete.length > 0) {
      Logger.info('Cleaned up old sessions', { count: toDelete.length });
    }
  }

  async createPlatformSession(
    platform: PlatformType,
    platformUserId: string,
    userId?: string
  ): Promise<SessionData> {
    const sessionId = `${platform}-${platformUserId}`;
    const session: SessionData = {
      sessionId,
      userId,
      platform,
      platformUserId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.sessions.set(sessionId, session);

    if (!this.platformSessions.has(platform)) {
      this.platformSessions.set(platform, new Map());
    }
    this.platformSessions.get(platform)!.set(platformUserId, session);

    await this.saveSession(sessionId);

    Logger.info('Platform session created', { platform, platformUserId, sessionId });
    return session;
  }

  async getPlatformSession(
    platform: PlatformType,
    platformUserId: string
  ): Promise<SessionData | undefined> {
    const platformMap = this.platformSessions.get(platform);
    if (!platformMap) return undefined;

    return platformMap.get(platformUserId);
  }

  async getOrCreatePlatformSession(
    platform: PlatformType,
    platformUserId: string,
    userId?: string
  ): Promise<SessionData> {
    let session = await this.getPlatformSession(platform, platformUserId);
    if (!session) {
      session = await this.createPlatformSession(platform, platformUserId, userId);
    }
    return session;
  }

  async getPlatformSessions(platform: PlatformType): Promise<SessionData[]> {
    const platformMap = this.platformSessions.get(platform);
    if (!platformMap) return [];

    return Array.from(platformMap.values()).sort(
      (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
    );
  }

  async deletePlatformSession(platform: PlatformType, platformUserId: string): Promise<void> {
    const platformMap = this.platformSessions.get(platform);
    if (!platformMap) return;

    const session = platformMap.get(platformUserId);
    if (session) {
      await this.deleteSession(session.sessionId);
      platformMap.delete(platformUserId);
      Logger.info('Platform session deleted', { platform, platformUserId });
    }
  }

  getPlatformSessionCount(platform: PlatformType): number {
    const platformMap = this.platformSessions.get(platform);
    return platformMap ? platformMap.size : 0;
  }

  getAllPlatformSessions(): Map<PlatformType, SessionData[]> {
    const result = new Map<PlatformType, SessionData[]>();
    for (const [platform, platformMap] of this.platformSessions.entries()) {
      result.set(
        platform,
        Array.from(platformMap.values()).sort(
          (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
        )
      );
    }
    return result;
  }
}
