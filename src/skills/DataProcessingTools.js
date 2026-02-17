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
exports.JsonWriteTool = exports.JsonReadTool = exports.CsvWriteTool = exports.CsvReadTool = void 0;
const fs = __importStar(require("fs/promises"));
const Logger_1 = require("../utils/Logger");
const sync_1 = require("csv-parse/sync");
const sync_2 = require("csv-stringify/sync");
class CsvReadTool {
    constructor() {
        this.name = 'csv_read';
        this.description = 'Read and parse a CSV file';
        this.category = 'file';
    }
    async execute(params) {
        try {
            const filePath = params.filePath;
            if (!filePath) {
                return { success: false, error: 'filePath is required' };
            }
            Logger_1.Logger.info(`Reading CSV file: ${filePath}`);
            const content = await fs.readFile(filePath, 'utf-8');
            const records = (0, sync_1.parse)(content, { columns: true, skip_empty_lines: true });
            return {
                success: true,
                data: {
                    records,
                    count: records.length,
                    filePath
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`CSV read failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.CsvReadTool = CsvReadTool;
class CsvWriteTool {
    constructor() {
        this.name = 'csv_write';
        this.description = 'Write data to a CSV file';
        this.category = 'file';
    }
    async execute(params) {
        try {
            const filePath = params.filePath;
            const data = params.data;
            if (!filePath) {
                return { success: false, error: 'filePath is required' };
            }
            if (!data) {
                return { success: false, error: 'data is required' };
            }
            Logger_1.Logger.info(`Writing CSV file: ${filePath}`);
            // Convert data to CSV string
            const csvString = (0, sync_2.stringify)(data, { header: true });
            await fs.writeFile(filePath, csvString, 'utf-8');
            return {
                success: true,
                data: {
                    message: 'CSV file written successfully',
                    filePath,
                    rows: data.length
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`CSV write failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.CsvWriteTool = CsvWriteTool;
class JsonReadTool {
    constructor() {
        this.name = 'json_read';
        this.description = 'Read and parse a JSON file';
        this.category = 'file';
    }
    async execute(params) {
        try {
            const filePath = params.filePath;
            if (!filePath) {
                return { success: false, error: 'filePath is required' };
            }
            Logger_1.Logger.info(`Reading JSON file: ${filePath}`);
            const content = await fs.readFile(filePath, 'utf-8');
            const jsonData = JSON.parse(content);
            return {
                success: true,
                data: {
                    data: jsonData,
                    filePath
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`JSON read failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.JsonReadTool = JsonReadTool;
class JsonWriteTool {
    constructor() {
        this.name = 'json_write';
        this.description = 'Write data to a JSON file';
        this.category = 'file';
    }
    async execute(params) {
        try {
            const filePath = params.filePath;
            const data = params.data;
            const pretty = params.pretty || false;
            if (!filePath) {
                return { success: false, error: 'filePath is required' };
            }
            if (data === undefined) {
                return { success: false, error: 'data is required' };
            }
            Logger_1.Logger.info(`Writing JSON file: ${filePath}`);
            const jsonString = pretty
                ? JSON.stringify(data, null, 2)
                : JSON.stringify(data);
            await fs.writeFile(filePath, jsonString, 'utf-8');
            return {
                success: true,
                data: {
                    message: 'JSON file written successfully',
                    filePath
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`JSON write failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.JsonWriteTool = JsonWriteTool;
