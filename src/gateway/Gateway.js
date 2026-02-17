"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gateway = void 0;
const SessionManager_1 = require("../session/SessionManager");
const Logger_1 = require("../utils/Logger");
const ApiResponse_1 = require("../api/ApiResponse");
class Gateway {
    constructor() {
        this.contexts = new Map();
        this.sessionManager = new SessionManager_1.SessionManager();
    }
    async createContext(sessionId, userId) {
        const sessionData = await this.sessionManager.getSession(sessionId);
        if (sessionData) {
            const context = {
                sessionId,
                userId,
                messages: sessionData.messages,
                memory: [],
                availableTools: [],
                createdAt: sessionData.createdAt,
                lastActivity: sessionData.lastActivity,
            };
            this.contexts.set(sessionId, context);
            Logger_1.Logger.info('Session loaded', { sessionId });
            return context;
        }
        const newSession = await this.sessionManager.createSession(sessionId, userId);
        const context = {
            sessionId,
            userId,
            messages: newSession.messages,
            memory: [],
            availableTools: [],
            createdAt: newSession.createdAt,
            lastActivity: newSession.lastActivity,
        };
        this.contexts.set(sessionId, context);
        Logger_1.Logger.info('Session created', { sessionId, userId });
        return context;
    }
    getContext(sessionId) {
        return this.contexts.get(sessionId);
    }
    async addMessage(sessionId, message) {
        const context = this.contexts.get(sessionId);
        if (context) {
            context.messages.push(message);
            context.lastActivity = new Date();
            await this.sessionManager.updateSession(sessionId, context.messages);
        }
    }
    async processMessage(sessionId, content) {
        const context = this.getContext(sessionId);
        if (!context) {
            throw new Error('Session not found');
        }
        const userMessage = {
            id: this.generateId(),
            role: 'user',
            content,
            timestamp: new Date(),
        };
        await this.addMessage(sessionId, userMessage);
        const response = await this.generateResponse(context);
        const assistantMessage = {
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
    async processMessageWithStandardResponse(sessionId, content, requestId) {
        try {
            const response = await this.processMessage(sessionId, content);
            return ApiResponse_1.ApiResponseFactory.success(response, 'Message processed successfully', requestId);
        }
        catch (error) {
            Logger_1.Logger.error('Error processing message', {
                error: error.message,
                sessionId,
                requestId
            });
            return ApiResponse_1.ApiResponseFactory.internalError(error.message, requestId);
        }
    }
    /**
     * 获取会话信息并返回标准化的API响应
     */
    getSessionWithStandardResponse(sessionId, requestId) {
        try {
            const context = this.getContext(sessionId);
            if (!context) {
                return ApiResponse_1.ApiResponseFactory.notFound('Session not found', requestId);
            }
            return ApiResponse_1.ApiResponseFactory.success(context, 'Session retrieved successfully', requestId);
        }
        catch (error) {
            Logger_1.Logger.error('Error getting session', {
                error: error.message,
                sessionId,
                requestId
            });
            return ApiResponse_1.ApiResponseFactory.internalError(error.message, requestId);
        }
    }
    /**
     * 关闭会话并返回标准化的API响应
     */
    async closeSessionWithStandardResponse(sessionId, requestId) {
        try {
            await this.closeSession(sessionId);
            return ApiResponse_1.ApiResponseFactory.success(null, 'Session closed successfully', requestId);
        }
        catch (error) {
            Logger_1.Logger.error('Error closing session', {
                error: error.message,
                sessionId,
                requestId
            });
            return ApiResponse_1.ApiResponseFactory.internalError(error.message, requestId);
        }
    }
    /**
     * 获取所有会话并返回标准化的API响应
     */
    async getAllSessionsWithStandardResponse(requestId) {
        try {
            const sessions = await this.getAllSessions();
            return ApiResponse_1.ApiResponseFactory.success(sessions, 'Sessions retrieved successfully', requestId);
        }
        catch (error) {
            Logger_1.Logger.error('Error getting all sessions', {
                error: error.message,
                requestId
            });
            return ApiResponse_1.ApiResponseFactory.internalError(error.message, requestId);
        }
    }
    async generateResponse(context) {
        const { AgentProcessor } = await Promise.resolve().then(() => __importStar(require('../agent/AgentProcessor')));
        const processor = new AgentProcessor();
        return processor.process(context);
    }
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    async closeSession(sessionId) {
        this.contexts.delete(sessionId);
        Logger_1.Logger.info('Session closed', { sessionId });
    }
    async getAllSessions() {
        return this.sessionManager.getAllSessions();
    }
    async cleanupOldSessions(days = 30) {
        await this.sessionManager.cleanupOldSessions(days);
    }
}
exports.Gateway = Gateway;
