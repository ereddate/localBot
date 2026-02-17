"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
const ApiMiddleware_1 = require("./ApiMiddleware");
const Gateway_1 = require("../gateway/Gateway");
const Logger_1 = require("../utils/Logger");
class ApiService {
    constructor(port = 3000) {
        this.port = port;
        this.app = ApiMiddleware_1.ApiMiddleware.createApp();
        this.gateway = new Gateway_1.Gateway();
        this.setupRoutes();
    }
    setupRoutes() {
        // 健康检查端点
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                requestId: req.headers['x-request-id'] || req.requestId
            });
        });
        // 消息处理端点
        this.app.post('/api/v1/message', async (req, res) => {
            try {
                const { sessionId, content } = req.body;
                if (!sessionId || !content) {
                    return res.status(400).json({
                        code: 400,
                        message: 'sessionId and content are required',
                        timestamp: Date.now(),
                        requestId: req.requestId
                    });
                }
                const result = await this.gateway.processMessageWithStandardResponse(sessionId, content, req.requestId);
                res.status(result.code).json(result);
            }
            catch (error) {
                Logger_1.Logger.error('Error in /api/v1/message endpoint', {
                    error: error.message,
                    requestId: req.requestId
                });
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error',
                    timestamp: Date.now(),
                    requestId: req.requestId
                });
            }
        });
        // 会话管理端点
        this.app.get('/api/v1/session/:sessionId', (req, res) => {
            const { sessionId } = req.params;
            const result = this.gateway.getSessionWithStandardResponse(sessionId, req.requestId);
            res.status(result.code).json(result);
        });
        // 获取所有会话
        this.app.get('/api/v1/sessions', async (req, res) => {
            try {
                const result = await this.gateway.getAllSessionsWithStandardResponse(req.requestId);
                res.status(result.code).json(result);
            }
            catch (error) {
                Logger_1.Logger.error('Error in /api/v1/sessions endpoint', {
                    error: error.message,
                    requestId: req.requestId
                });
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error',
                    timestamp: Date.now(),
                    requestId: req.requestId
                });
            }
        });
        // 关闭会话端点
        this.app.delete('/api/v1/session/:sessionId', async (req, res) => {
            const { sessionId } = req.params;
            try {
                const result = await this.gateway.closeSessionWithStandardResponse(sessionId, req.requestId);
                res.status(result.code).json(result);
            }
            catch (error) {
                Logger_1.Logger.error('Error in /api/v1/session/:sessionId DELETE endpoint', {
                    error: error.message,
                    requestId: req.requestId
                });
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error',
                    timestamp: Date.now(),
                    requestId: req.requestId
                });
            }
        });
        // 工具执行端点
        this.app.post('/api/v1/tool/:toolName', async (req, res) => {
            try {
                const { toolName } = req.params;
                const params = req.body;
                // 注意：这里只是一个框架，实际实现需要访问工具实例
                // 在当前架构中，工具执行通常通过工作流完成
                res.status(405).json({
                    code: 405,
                    message: 'Direct tool execution endpoint not implemented in this version',
                    timestamp: Date.now(),
                    requestId: req.requestId
                });
            }
            catch (error) {
                Logger_1.Logger.error('Error in /api/v1/tool endpoint', {
                    error: error.message,
                    requestId: req.requestId
                });
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error',
                    timestamp: Date.now(),
                    requestId: req.requestId
                });
            }
        });
        // 业务流程执行端点
        this.app.post('/api/v1/process/:processType', async (req, res) => {
            try {
                const { processType } = req.params;
                const inputData = req.body;
                // 注意：这里只是一个框架，实际实现需要接入业务流程管理器
                // 需要根据processType执行相应的业务流程
                res.status(405).json({
                    code: 405,
                    message: 'Process execution endpoint not implemented in this version',
                    timestamp: Date.now(),
                    requestId: req.requestId
                });
            }
            catch (error) {
                Logger_1.Logger.error('Error in /api/v1/process endpoint', {
                    error: error.message,
                    requestId: req.requestId
                });
                res.status(500).json({
                    code: 500,
                    message: 'Internal server error',
                    timestamp: Date.now(),
                    requestId: req.requestId
                });
            }
        });
    }
    start() {
        this.app.listen(this.port, () => {
            Logger_1.Logger.info(`API Service listening on port ${this.port}`);
            console.log(`🚀 API Service running on http://localhost:${this.port}`);
            console.log(`📋 Available endpoints:`);
            console.log(`   GET  /health - Health check`);
            console.log(`   POST /api/v1/message - Process message`);
            console.log(`   GET  /api/v1/session/:sessionId - Get session`);
            console.log(`   GET  /api/v1/sessions - Get all sessions`);
            console.log(`   DELETE /api/v1/session/:sessionId - Close session`);
        });
    }
    getApp() {
        return this.app;
    }
}
exports.ApiService = ApiService;
