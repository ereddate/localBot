"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiMiddleware = void 0;
/**
 * API中间件 - 处理统一的请求和响应格式
 */
const express_1 = __importDefault(require("express"));
const ApiResponse_1 = require("./ApiResponse");
const Logger_1 = require("../utils/Logger");
class ApiMiddleware {
    /**
     * 生成请求ID
     */
    static generateRequestId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * 请求ID中间件
     */
    static requestId(req, res, next) {
        req.requestId = ApiMiddleware.generateRequestId();
        res.setHeader('X-Request-ID', req.requestId);
        next();
    }
    /**
     * CORS中间件
     */
    static cors(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Request-ID');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        }
        else {
            next();
        }
    }
    /**
     * 日志中间件
     */
    static logger(req, res, next) {
        const startTime = Date.now();
        Logger_1.Logger.info('API Request', {
            requestId: req.requestId,
            method: req.method,
            url: req.url,
            ip: req.ip || '',
            userAgent: req.get('User-Agent') || ''
        });
        res.on('finish', () => {
            const duration = Date.now() - startTime;
            Logger_1.Logger.info('API Response', {
                requestId: req.requestId,
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                duration: `${duration}ms`
            });
        });
        next();
    }
    /**
     * 错误处理中间件
     */
    static errorHandler(err, req, res, next) {
        Logger_1.Logger.error('API Error', {
            requestId: req.requestId,
            error: err.message,
            stack: err.stack
        });
        const errorResponse = ApiResponse_1.ApiResponseFactory.internalError(err.message, req.requestId);
        res.status(errorResponse.code).json(errorResponse);
    }
    /**
     * 创建Express应用并设置中间件
     */
    static createApp() {
        const app = (0, express_1.default)();
        // JSON解析中间件
        app.use(express_1.default.json({ limit: '10mb' }));
        app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        // 应用自定义中间件
        app.use(ApiMiddleware.requestId);
        app.use(ApiMiddleware.cors);
        app.use(ApiMiddleware.logger);
        app.use(ApiMiddleware.errorHandler);
        return app;
    }
}
exports.ApiMiddleware = ApiMiddleware;
