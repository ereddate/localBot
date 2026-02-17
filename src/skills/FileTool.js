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
exports.FileDeleteTool = exports.FileListTool = exports.FileWriteTool = exports.FileTool = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const Logger_1 = require("../utils/Logger");
const ConsoleLogger_1 = require("../utils/ConsoleLogger");
class FileTool {
    constructor() {
        this.name = 'file_read';
        this.description = 'Read the contents of a file';
        this.category = 'file';
    }
    async execute(params) {
        try {
            ConsoleLogger_1.ConsoleLogger.logSkillCall(this.name, params);
            const filePath = params.filePath;
            if (!filePath) {
                return { success: false, error: 'filePath is required' };
            }
            Logger_1.Logger.info(`Reading file: ${filePath}`);
            const content = await fs.readFile(filePath, 'utf-8');
            ConsoleLogger_1.ConsoleLogger.logSkillSuccess(this.name, { fileSize: content.length });
            return { success: true, data: content };
        }
        catch (error) {
            ConsoleLogger_1.ConsoleLogger.logSkillError(this.name, error.message);
            Logger_1.Logger.error(`Error reading file`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.FileTool = FileTool;
class FileWriteTool {
    constructor() {
        this.name = 'file_write';
        this.description = 'Write content to a file';
        this.category = 'file';
    }
    async execute(params) {
        try {
            const filePath = params.filePath;
            const content = params.content;
            if (!filePath || content === undefined) {
                return { success: false, error: 'filePath and content are required' };
            }
            const dir = path.dirname(filePath);
            await fs.mkdir(dir, { recursive: true });
            Logger_1.Logger.info(`Writing to file: ${filePath}`);
            await fs.writeFile(filePath, content, 'utf-8');
            return { success: true, data: { message: 'File written successfully' } };
        }
        catch (error) {
            Logger_1.Logger.error(`Error writing file`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.FileWriteTool = FileWriteTool;
class FileListTool {
    constructor() {
        this.name = 'file_list';
        this.description = 'List files in a directory';
        this.category = 'file';
    }
    async execute(params) {
        try {
            const dirPath = params.dirPath || '.';
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            const files = entries.map(entry => ({
                name: entry.name,
                isDirectory: entry.isDirectory(),
            }));
            Logger_1.Logger.info(`Listed directory: ${dirPath}`, { count: files.length });
            return { success: true, data: files };
        }
        catch (error) {
            Logger_1.Logger.error(`Error listing directory`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.FileListTool = FileListTool;
class FileDeleteTool {
    constructor() {
        this.name = 'file_delete';
        this.description = 'Delete a file';
        this.category = 'file';
    }
    async execute(params) {
        try {
            const filePath = params.filePath;
            if (!filePath) {
                return { success: false, error: 'filePath is required' };
            }
            Logger_1.Logger.warn(`Deleting file: ${filePath}`);
            await fs.unlink(filePath);
            return { success: true, data: { message: 'File deleted successfully' } };
        }
        catch (error) {
            Logger_1.Logger.error(`Error deleting file`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.FileDeleteTool = FileDeleteTool;
