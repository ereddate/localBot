import { AgentContext, Message, MemoryEntry, SessionData, Tool } from '../types';
import { SessionManager } from '../session/SessionManager';
import { Logger } from '../utils/Logger';
import { ApiResponseFactory } from '../api/ApiResponse';
import { SkillManager } from '../skills/SkillManager';
import { MemorySystem } from '../memory/MemorySystem';
import { AgentProcessor } from '../agent/AgentProcessor';

export class Gateway {
  private contexts: Map<string, AgentContext> = new Map();
  private sessionManager: SessionManager;
  private skillManager?: SkillManager;
  private memorySystem?: MemorySystem;
  private agentProcessor?: AgentProcessor;

  constructor(skillManager?: SkillManager, memorySystem?: MemorySystem, agentProcessor?: AgentProcessor) {
    this.sessionManager = new SessionManager();
    this.skillManager = skillManager;
    this.memorySystem = memorySystem;
    this.agentProcessor = agentProcessor;
  }

  async createContext(sessionId: string, userId?: string): Promise<AgentContext> {
    const sessionData = await this.sessionManager.getSession(sessionId);
    
    // Determine available tools based on skill manager
    const availableTools = this.skillManager ? this.skillManager.getAllTools() : [];
    
    // Load memory from memory system if available
    let memory: MemoryEntry[] = [];
    
    if (this.memorySystem) {
      // Search for memories related to this session/user
      try {
        // First, try to get recent entries for general context
        const recentMemories = await this.memorySystem.getRecentEntries(7);
        
        // Also search for memories related to this specific session
        const sessionMemories = await this.memorySystem.search(sessionId.substring(0, 10));
        
        // Combine both sets of memories, avoiding duplicates
        const allMemoriesMap = new Map();
        [...recentMemories, ...sessionMemories].forEach(entry => {
          allMemoriesMap.set(entry.id, entry);
        });
        
        memory = Array.from(allMemoriesMap.values());
      } catch (error) {
        Logger.warn('Could not load memory for session', { error: (error as Error).message });
      }
    }
    
    if (sessionData) {
      const context: AgentContext = {
        sessionId,
        userId,
        messages: sessionData.messages,
        memory,
        availableTools,
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
      memory,
      availableTools,
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

  /**
   * 处理消息并返回标准化的API响应
   */
  async processMessageWithStandardResponse(sessionId: string, content: string, requestId?: string) {
    try {
      const response = await this.processMessage(sessionId, content);
      return ApiResponseFactory.success(response, 'Message processed successfully', requestId);
    } catch (error: any) {
      Logger.error('Error processing message', { 
        error: error.message, 
        sessionId, 
        requestId 
      });
      return ApiResponseFactory.internalError(error.message, requestId);
    }
  }

  /**
   * 获取会话信息并返回标准化的API响应
   */
  getSessionWithStandardResponse(sessionId: string, requestId?: string) {
    try {
      const context = this.getContext(sessionId);
      if (!context) {
        return ApiResponseFactory.notFound('Session not found', requestId);
      }
      return ApiResponseFactory.success(context, 'Session retrieved successfully', requestId);
    } catch (error: any) {
      Logger.error('Error getting session', { 
        error: error.message, 
        sessionId, 
        requestId 
      });
      return ApiResponseFactory.internalError(error.message, requestId);
    }
  }

  /**
   * 关闭会话并返回标准化的API响应
   */
  async closeSessionWithStandardResponse(sessionId: string, requestId?: string) {
    try {
      await this.closeSession(sessionId);
      return ApiResponseFactory.success(null, 'Session closed successfully', requestId);
    } catch (error: any) {
      Logger.error('Error closing session', { 
        error: error.message, 
        sessionId, 
        requestId 
      });
      return ApiResponseFactory.internalError(error.message, requestId);
    }
  }

  /**
   * 获取所有会话并返回标准化的API响应
   */
  async getAllSessionsWithStandardResponse(requestId?: string) {
    try {
      const sessions = await this.getAllSessions();
      return ApiResponseFactory.success(sessions, 'Sessions retrieved successfully', requestId);
    } catch (error: any) {
      Logger.error('Error getting all sessions', { 
        error: error.message, 
        requestId 
      });
      return ApiResponseFactory.internalError(error.message, requestId);
    }
  }

  private async generateResponse(context: AgentContext): Promise<string> {
    if (this.agentProcessor) {
      return this.agentProcessor.process(context);
    }
    
    const processor = new AgentProcessor(this.skillManager, this.memorySystem);
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
