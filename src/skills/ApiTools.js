"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDeleteTool = exports.ApiPutTool = exports.ApiPostTool = exports.ApiGetTool = void 0;
const Logger_1 = require("../utils/Logger");
const axios_1 = __importDefault(require("axios"));
class ApiGetTool {
    constructor() {
        this.name = 'api_get';
        this.description = 'Make a GET request to an API endpoint';
        this.category = 'network';
    }
    async execute(params) {
        try {
            const url = params.url;
            const headers = params.headers || {};
            const queryParams = params.queryParams || {};
            if (!url) {
                return { success: false, error: 'url is required' };
            }
            Logger_1.Logger.info(`Making GET request to: ${url}`, { url, queryParams });
            const response = await axios_1.default.get(url, {
                headers,
                params: queryParams,
                timeout: 10000
            });
            return {
                success: true,
                data: {
                    status: response.status,
                    statusText: response.statusText,
                    data: response.data,
                    headers: response.headers,
                    url: response.config.url,
                    // 符合统一API响应格式的数据
                    apiResponse: {
                        code: response.status,
                        message: response.statusText,
                        data: response.data,
                        timestamp: Date.now()
                    }
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`API GET request failed`, {
                error: error.message,
                url: params.url,
                status: error.response?.status
            });
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'API GET request failed'
            };
        }
    }
}
exports.ApiGetTool = ApiGetTool;
class ApiPostTool {
    constructor() {
        this.name = 'api_post';
        this.description = 'Make a POST request to an API endpoint';
        this.category = 'network';
    }
    async execute(params) {
        try {
            const url = params.url;
            const data = params.data;
            const headers = params.headers || {};
            if (!url) {
                return { success: false, error: 'url is required' };
            }
            if (!data) {
                return { success: false, error: 'data is required' };
            }
            Logger_1.Logger.info(`Making POST request to: ${url}`, { url });
            const response = await axios_1.default.post(url, data, {
                headers,
                timeout: 10000
            });
            return {
                success: true,
                data: {
                    status: response.status,
                    statusText: response.statusText,
                    data: response.data,
                    headers: response.headers,
                    url: response.config.url,
                    // 符合统一API响应格式的数据
                    apiResponse: {
                        code: response.status,
                        message: response.statusText,
                        data: response.data,
                        timestamp: Date.now()
                    }
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`API POST request failed`, {
                error: error.message,
                url: params.url,
                status: error.response?.status
            });
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'API POST request failed'
            };
        }
    }
}
exports.ApiPostTool = ApiPostTool;
class ApiPutTool {
    constructor() {
        this.name = 'api_put';
        this.description = 'Make a PUT request to an API endpoint';
        this.category = 'network';
    }
    async execute(params) {
        try {
            const url = params.url;
            const data = params.data;
            const headers = params.headers || {};
            if (!url) {
                return { success: false, error: 'url is required' };
            }
            if (!data) {
                return { success: false, error: 'data is required' };
            }
            Logger_1.Logger.info(`Making PUT request to: ${url}`, { url });
            const response = await axios_1.default.put(url, data, {
                headers,
                timeout: 10000
            });
            return {
                success: true,
                data: {
                    status: response.status,
                    statusText: response.statusText,
                    data: response.data,
                    headers: response.headers,
                    url: response.config.url,
                    // 符合统一API响应格式的数据
                    apiResponse: {
                        code: response.status,
                        message: response.statusText,
                        data: response.data,
                        timestamp: Date.now()
                    }
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`API PUT request failed`, {
                error: error.message,
                url: params.url,
                status: error.response?.status
            });
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'API PUT request failed'
            };
        }
    }
}
exports.ApiPutTool = ApiPutTool;
class ApiDeleteTool {
    constructor() {
        this.name = 'api_delete';
        this.description = 'Make a DELETE request to an API endpoint';
        this.category = 'network';
    }
    async execute(params) {
        try {
            const url = params.url;
            const headers = params.headers || {};
            if (!url) {
                return { success: false, error: 'url is required' };
            }
            Logger_1.Logger.info(`Making DELETE request to: ${url}`, { url });
            const response = await axios_1.default.delete(url, {
                headers,
                timeout: 10000
            });
            return {
                success: true,
                data: {
                    status: response.status,
                    statusText: response.statusText,
                    data: response.data,
                    headers: response.headers,
                    url: response.config.url,
                    // 符合统一API响应格式的数据
                    apiResponse: {
                        code: response.status,
                        message: response.statusText,
                        data: response.data,
                        timestamp: Date.now()
                    }
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`API DELETE request failed`, {
                error: error.message,
                url: params.url,
                status: error.response?.status
            });
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'API DELETE request failed'
            };
        }
    }
}
exports.ApiDeleteTool = ApiDeleteTool;
