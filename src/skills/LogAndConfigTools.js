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
exports.ConfigManagementTool = exports.LogManagementTool = void 0;
const Logger_1 = require("../utils/Logger");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const util_1 = require("util");
const child_process_1 = require("child_process");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class LogManagementTool {
    constructor() {
        this.name = 'log_management';
        this.description = 'Manage and analyze log files (read, filter, search)';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const logPath = params.logPath;
            const filterPattern = params.filterPattern;
            const maxLines = params.maxLines || 100;
            if (!operation) {
                return { success: false, error: 'operation is required (read, search, analyze)' };
            }
            if (!logPath) {
                return { success: false, error: 'logPath is required' };
            }
            switch (operation.toLowerCase()) {
                case 'read':
                    return await this.readLog(logPath, maxLines);
                case 'search':
                    if (!filterPattern) {
                        return { success: false, error: 'filterPattern is required for search operation' };
                    }
                    return await this.searchLog(logPath, filterPattern);
                case 'analyze':
                    return await this.analyzeLog(logPath);
                default:
                    return { success: false, error: 'Invalid operation. Use: read, search, or analyze' };
            }
        }
        catch (error) {
            Logger_1.Logger.error(`Log management operation failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
    async readLog(logPath, maxLines) {
        try {
            await fs.access(logPath);
            // Read the last N lines of the log file
            const content = await fs.readFile(logPath, 'utf-8');
            const lines = content.split('\n');
            const lastLines = lines.slice(-maxLines);
            return {
                success: true,
                data: {
                    logPath,
                    linesRead: lastLines.length,
                    content: lastLines.join('\n'),
                    totalLines: lines.length,
                    message: `Last ${lastLines.length} lines read from log file`
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async searchLog(logPath, pattern) {
        try {
            await fs.access(logPath);
            const content = await fs.readFile(logPath, 'utf-8');
            const lines = content.split('\n');
            const matchedLines = lines.filter(line => line.toLowerCase().includes(pattern.toLowerCase()));
            return {
                success: true,
                data: {
                    logPath,
                    pattern,
                    matchesCount: matchedLines.length,
                    matches: matchedLines.slice(0, 50), // Limit to first 50 matches
                    message: `${matchedLines.length} lines matched the pattern '${pattern}'`
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async analyzeLog(logPath) {
        try {
            await fs.access(logPath);
            const content = await fs.readFile(logPath, 'utf-8');
            const lines = content.split('\n');
            // Basic log analysis
            const stats = {
                totalLines: lines.length,
                errorLines: 0,
                warnLines: 0,
                infoLines: 0,
                debugLines: 0
            };
            for (const line of lines) {
                const lowerLine = line.toLowerCase();
                if (lowerLine.includes('error'))
                    stats.errorLines++;
                if (lowerLine.includes('warn'))
                    stats.warnLines++;
                if (lowerLine.includes('info'))
                    stats.infoLines++;
                if (lowerLine.includes('debug'))
                    stats.debugLines++;
            }
            return {
                success: true,
                data: {
                    logPath,
                    stats,
                    message: 'Log analysis completed'
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
}
exports.LogManagementTool = LogManagementTool;
class ConfigManagementTool {
    constructor() {
        this.name = 'config_management';
        this.description = 'Manage configuration files (read, write, update)';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const configPath = params.configPath;
            const key = params.key;
            const value = params.value;
            if (!operation) {
                return { success: false, error: 'operation is required (read, write, update, get)' };
            }
            if (!configPath) {
                return { success: false, error: 'configPath is required' };
            }
            switch (operation.toLowerCase()) {
                case 'read':
                    return await this.readConfig(configPath);
                case 'write':
                    return await this.writeConfig(configPath, params.configData);
                case 'get':
                    if (!key) {
                        return { success: false, error: 'key is required for get operation' };
                    }
                    return await this.getConfigValue(configPath, key);
                case 'set':
                    if (!key) {
                        return { success: false, error: 'key is required for set operation' };
                    }
                    return await this.setConfigValue(configPath, key, value);
                default:
                    return { success: false, error: 'Invalid operation. Use: read, write, get, or set' };
            }
        }
        catch (error) {
            Logger_1.Logger.error(`Config management operation failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
    async readConfig(configPath) {
        try {
            await fs.access(configPath);
            const content = await fs.readFile(configPath, 'utf-8');
            let config = {};
            // Try to parse as JSON first, then as plain text
            try {
                config = JSON.parse(content);
            }
            catch {
                // If not JSON, try to parse as key=value pairs
                const lines = content.split('\n');
                for (const line of lines) {
                    if (line.includes('=')) {
                        const [k, v] = line.split('=', 2);
                        config[k.trim()] = v.trim();
                    }
                }
            }
            return {
                success: true,
                data: {
                    configPath,
                    config,
                    format: 'json',
                    message: 'Configuration file read successfully'
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async writeConfig(configPath, configData) {
        try {
            const dir = path.dirname(configPath);
            await fs.mkdir(dir, { recursive: true });
            const content = JSON.stringify(configData, null, 2);
            await fs.writeFile(configPath, content);
            return {
                success: true,
                data: {
                    configPath,
                    message: 'Configuration file written successfully'
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async getConfigValue(configPath, key) {
        try {
            const readResult = await this.readConfig(configPath);
            if (!readResult.success) {
                return readResult;
            }
            const config = readResult.data.config;
            const value = this.getNestedValue(config, key);
            return {
                success: true,
                data: {
                    configPath,
                    key,
                    value,
                    message: `Configuration value retrieved for key: ${key}`
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async setConfigValue(configPath, key, value) {
        try {
            const readResult = await this.readConfig(configPath);
            let config = {};
            if (readResult.success) {
                config = readResult.data.config;
            }
            this.setNestedValue(config, key, value);
            const writeResult = await this.writeConfig(configPath, config);
            return writeResult;
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    getNestedValue(obj, path) {
        const keys = path.split('.');
        let current = obj;
        for (const key of keys) {
            if (current && typeof current === 'object') {
                current = current[key];
            }
            else {
                return undefined;
            }
        }
        return current;
    }
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
    }
}
exports.ConfigManagementTool = ConfigManagementTool;
