import { AgentContext, Message, SessionData } from '../types';
import { SessionManager } from '../session/SessionManager';
import { Logger } from '../utils/Logger';

export class Gateway {
  private contexts: Map<string, AgentContext> = new Map();
  private sessionManager: SessionManager;

  constructor() {
    this.sessionManager = new SessionManager();
  }

  async createContext(sessionId: string, userId?: string): Promise<AgentContext> {
    const sessionData = await this.sessionManager.getSession(sessionId);
    
    if (sessionData) {
      const context: AgentContext = {
        sessionId,
        userId,
        messages: sessionData.messages,
        memory: [],
        availableTools: [],
        createdAt: sessionData.createdAt,
        lastActivity: sessionData.lastActivity,
      };
      this.contexts.set(sessionId, context);
      Logger.info('Session loaded', { sessionId });
      return context;
    }

    const newSession = await this.sessionManager.createSession(sessionId, userId);
    const context: AgentContext = {
      sessionId,
      userId,
      messages: newSession.messages,
      memory: [],
      availableTools: [],
      createdAt: newSession.createdAt,
      lastActivity: newSession.lastActivity,
    };
    this.contexts.set(sessionId, context);
    Logger.info('Session created', { sessionId, userId });
    return context;
  }

  getContext(sessionId: string): AgentContext | undefined {
    return this.contexts.get(sessionId);
  }

  async addMessage(sessionId: string, message: Message): Promise<void> {
    const context = this.contexts.get(sessionId);
    if (context) {
      context.messages.push(message);
      context.lastActivity = new Date();
      await this.sessionManager.updateSession(sessionId, context.messages);
    }
  }

  async processMessage(sessionId: string, content: string): Promise<string> {
    const context = this.getContext(sessionId);
    if (!context) {
      throw new Error('Session not found');
    }

    const userMessage: Message = {
      id: this.generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    await this.addMessage(sessionId, userMessage);

    const response = await this.generateResponse(context);

    const assistantMessage: Message = {
      id: this.generateId(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    await this.addMessage(sessionId, assistantMessage);

    return response;
  }

  private async generateResponse(context: AgentContext): Promise<string> {
    const { AgentProcessor } = await import('../agent/AgentProcessor');
    const processor = new AgentProcessor();
    return processor.process(context);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async closeSession(sessionId: string): Promise<void> {
    this.contexts.delete(sessionId);
    Logger.info('Session closed', { sessionId });
  }

  async getAllSessions(): Promise<SessionData[]> {
    return this.sessionManager.getAllSessions();
  }

  async cleanupOldSessions(days: number = 30): Promise<void> {
    await this.sessionManager.cleanupOldSessions(days);
  }
}
