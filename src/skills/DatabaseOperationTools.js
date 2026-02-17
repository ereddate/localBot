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
exports.DatabaseDeleteTool = exports.DatabaseUpdateTool = exports.DatabaseQueryTool = exports.DatabaseInsertTool = void 0;
const Logger_1 = require("../utils/Logger");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class DatabaseInsertTool {
    constructor() {
        this.name = 'database_insert';
        this.description = 'Insert data into a database table';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const table = params.table;
            const data = params.data;
            if (!table) {
                return { success: false, error: 'Table name is required' };
            }
            if (!data) {
                return { success: false, error: 'Data object is required' };
            }
            // Simulate database insert by storing data in a JSON file
            const dbPath = path.join(__dirname, '../../data');
            const filePath = path.join(dbPath, `${table}.json`);
            try {
                await fs.mkdir(dbPath, { recursive: true });
            }
            catch (mkdirErr) {
                Logger_1.Logger.warn(`Could not create data directory: ${mkdirErr.message}`);
            }
            let existingData = [];
            try {
                const fileContent = await fs.readFile(filePath, 'utf8');
                existingData = JSON.parse(fileContent);
            }
            catch (err) {
                // File doesn't exist yet, start with empty array
                existingData = [];
            }
            // Add ID and timestamp
            const newData = {
                id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                createdAt: new Date().toISOString(),
                ...data
            };
            existingData.push(newData);
            await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
            Logger_1.Logger.info(`Data inserted into table '${table}'`, { recordId: newData.id });
            return {
                success: true,
                data: { id: newData.id, message: `Successfully inserted data into table '${table}'` }
            };
        }
        catch (error) {
            Logger_1.Logger.error('Database insert error', { error: error.message });
            return { success: false, error: `Failed to insert data: ${error.message}` };
        }
    }
}
exports.DatabaseInsertTool = DatabaseInsertTool;
class DatabaseQueryTool {
    constructor() {
        this.name = 'database_query';
        this.description = 'Query data from a database table';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const table = params.table;
            const query = params.query;
            const filters = params.filters;
            if (!table) {
                return { success: false, error: 'Table name is required' };
            }
            // Simulate database query by reading from a JSON file
            const dbPath = path.join(__dirname, '../../data');
            const filePath = path.join(dbPath, `${table}.json`);
            let data = [];
            try {
                const fileContent = await fs.readFile(filePath, 'utf8');
                data = JSON.parse(fileContent);
            }
            catch (err) {
                // File doesn't exist, return empty array
                data = [];
            }
            // Apply filters if provided
            if (filters && Object.keys(filters).length > 0) {
                data = data.filter(item => {
                    return Object.entries(filters).every(([key, value]) => {
                        return item[key] === value;
                    });
                });
            }
            Logger_1.Logger.info(`Data queried from table '${table}'`, { count: data.length });
            return {
                success: true,
                data: { results: data, count: data.length }
            };
        }
        catch (error) {
            Logger_1.Logger.error('Database query error', { error: error.message });
            return { success: false, error: `Failed to query data: ${error.message}` };
        }
    }
}
exports.DatabaseQueryTool = DatabaseQueryTool;
class DatabaseUpdateTool {
    constructor() {
        this.name = 'database_update';
        this.description = 'Update data in a database table';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const table = params.table;
            const id = params.id;
            const data = params.data;
            if (!table) {
                return { success: false, error: 'Table name is required' };
            }
            if (!id) {
                return { success: false, error: 'ID is required' };
            }
            if (!data) {
                return { success: false, error: 'Data object is required' };
            }
            // Simulate database update by reading from a JSON file
            const dbPath = path.join(__dirname, '../../data');
            const filePath = path.join(dbPath, `${table}.json`);
            let existingData = [];
            try {
                const fileContent = await fs.readFile(filePath, 'utf8');
                existingData = JSON.parse(fileContent);
            }
            catch (err) {
                // File doesn't exist, return error
                return { success: false, error: `Table '${table}' does not exist` };
            }
            // Find and update the record
            const recordIndex = existingData.findIndex(item => item.id === id);
            if (recordIndex === -1) {
                return { success: false, error: `Record with ID '${id}' not found` };
            }
            // Update the record
            existingData[recordIndex] = {
                ...existingData[recordIndex],
                ...data,
                updatedAt: new Date().toISOString()
            };
            await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
            Logger_1.Logger.info(`Data updated in table '${table}'`, { recordId: id });
            return {
                success: true,
                data: { id, message: `Successfully updated data in table '${table}'` }
            };
        }
        catch (error) {
            Logger_1.Logger.error('Database update error', { error: error.message });
            return { success: false, error: `Failed to update data: ${error.message}` };
        }
    }
}
exports.DatabaseUpdateTool = DatabaseUpdateTool;
class DatabaseDeleteTool {
    constructor() {
        this.name = 'database_delete';
        this.description = 'Delete data from a database table';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const table = params.table;
            const id = params.id;
            if (!table) {
                return { success: false, error: 'Table name is required' };
            }
            if (!id) {
                return { success: false, error: 'ID is required' };
            }
            // Simulate database delete by reading from a JSON file
            const dbPath = path.join(__dirname, '../../data');
            const filePath = path.join(dbPath, `${table}.json`);
            let existingData = [];
            try {
                const fileContent = await fs.readFile(filePath, 'utf8');
                existingData = JSON.parse(fileContent);
            }
            catch (err) {
                // File doesn't exist, return error
                return { success: false, error: `Table '${table}' does not exist` };
            }
            // Find and remove the record
            const recordIndex = existingData.findIndex(item => item.id === id);
            if (recordIndex === -1) {
                return { success: false, error: `Record with ID '${id}' not found` };
            }
            const deletedRecord = existingData.splice(recordIndex, 1)[0];
            await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
            Logger_1.Logger.info(`Data deleted from table '${table}'`, { recordId: id });
            return {
                success: true,
                data: { id, message: `Successfully deleted data from table '${table}'` }
            };
        }
        catch (error) {
            Logger_1.Logger.error('Database delete error', { error: error.message });
            return { success: false, error: `Failed to delete data: ${error.message}` };
        }
    }
}
exports.DatabaseDeleteTool = DatabaseDeleteTool;
