"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseFactory = void 0;
/**
 * API响应工厂类
 */
class ApiResponseFactory {
    /**
     * 成功响应
     */
    static success(data, message = 'Success', requestId) {
        return {
            code: 200,
            message,
            data,
            timestamp: Date.now(),
            requestId
        };
    }
    /**
     * 错误响应
     */
    static error(message, code = 400, details, requestId) {
        return {
            code,
            message,
            details,
            timestamp: Date.now(),
            requestId
        };
    }
    /**
     * 404响应
     */
    static notFound(message = 'Resource not found', requestId) {
        return {
            code: 404,
            message,
            timestamp: Date.now(),
            requestId
        };
    }
    /**
     * 500响应
     */
    static internalError(message = 'Internal server error', requestId) {
        return {
            code: 500,
            message,
            timestamp: Date.now(),
            requestId
        };
    }
    /**
     * 401响应
     */
    static unauthorized(message = 'Unauthorized', requestId) {
        return {
            code: 401,
            message,
            timestamp: Date.now(),
            requestId
        };
    }
    /**
     * 403响应
     */
    static forbidden(message = 'Forbidden', requestId) {
        return {
            code: 403,
            message,
            timestamp: Date.now(),
            requestId
        };
    }
}
exports.ApiResponseFactory = ApiResponseFactory;
