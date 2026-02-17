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
exports.SessionManager = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const Logger_1 = require("../utils/Logger");
class SessionManager {
    constructor() {
        this.sessions = new Map();
        this.sessionsDir = path.join(process.cwd(), 'sessions');
        this.initialize();
    }
    async initialize() {
        try {
            await fs.mkdir(this.sessionsDir, { recursive: true });
            await this.loadSessions();
            Logger_1.Logger.info('Session manager initialized', { sessionsDir: this.sessionsDir });
        }
        catch (error) {
            Logger_1.Logger.error('Error initializing session manager', { error: error.message });
        }
    }
    async loadSessions() {
        try {
            const files = await fs.readdir(this.sessionsDir);
            const sessionFiles = files.filter(f => f.endsWith('.json'));
            for (const file of sessionFiles) {
                const filePath = path.join(this.sessionsDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
                const session = JSON.parse(content);
                session.createdAt = new Date(session.createdAt);
                session.lastActivity = new Date(session.lastActivity);
                this.sessions.set(session.sessionId, session);
            }
            Logger_1.Logger.info(`Loaded ${sessionFiles.length} sessions`);
        }
        catch (error) {
            Logger_1.Logger.warn('Error loading sessions', { error: error.message });
        }
    }
    async createSession(sessionId, userId) {
        const session = {
            sessionId,
            userId,
            messages: [],
            createdAt: new Date(),
            lastActivity: new Date(),
        };
        this.sessions.set(sessionId, session);
        await this.saveSession(sessionId);
        Logger_1.Logger.info('Session created', { sessionId, userId });
        return session;
    }
    async getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    async updateSession(sessionId, messages) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            Logger_1.Logger.warn('Session not found for update', { sessionId });
            return;
        }
        session.messages = messages;
        session.lastActivity = new Date();
        await this.saveSession(sessionId);
        Logger_1.Logger.debug('Session updated', { sessionId, messageCount: messages.length });
    }
    async deleteSession(sessionId) {
        this.sessions.delete(sessionId);
        const filePath = path.join(this.sessionsDir, `${sessionId}.json`);
        try {
            await fs.unlink(filePath);
            Logger_1.Logger.info('Session deleted', { sessionId });
        }
        catch (error) {
            Logger_1.Logger.warn('Error deleting session file', { error: error.message });
        }
    }
    async saveSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session)
            return;
        const filePath = path.join(this.sessionsDir, `${sessionId}.json`);
        const content = JSON.stringify(session, null, 2);
        try {
            await fs.writeFile(filePath, content, 'utf-8');
        }
        catch (error) {
            Logger_1.Logger.error('Error saving session', {
                sessionId,
                error: error.message
            });
        }
    }
    async getAllSessions() {
        return Array.from(this.sessions.values()).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
    }
    async cleanupOldSessions(days = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const toDelete = [];
        for (const [sessionId, session] of this.sessions.entries()) {
            if (session.lastActivity < cutoffDate) {
                toDelete.push(sessionId);
            }
        }
        for (const sessionId of toDelete) {
            await this.deleteSession(sessionId);
        }
        if (toDelete.length > 0) {
            Logger_1.Logger.info('Cleaned up old sessions', { count: toDelete.length });
        }
    }
}
exports.SessionManager = SessionManager;
