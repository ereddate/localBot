"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemorySearchTool = exports.MemoryTool = void 0;
const MemorySystem_1 = require("../memory/MemorySystem");
const Logger_1 = require("../utils/Logger");
const ConsoleLogger_1 = require("../utils/ConsoleLogger");
class MemoryTool {
    constructor(memorySystem) {
        this.name = 'memory_add';
        this.description = 'Add an entry to memory';
        this.category = 'memory';
        this.memorySystem = memorySystem || new MemorySystem_1.MemorySystem();
    }
    async execute(params) {
        try {
            ConsoleLogger_1.ConsoleLogger.logSkillCall(this.name, params);
            const content = params.content;
            const tags = params.tags || [];
            const importance = params.importance || 1;
            if (!content) {
                return { success: false, error: 'content is required' };
            }
            const entry = await this.memorySystem.addEntry(content, tags, importance);
            Logger_1.Logger.info(`Memory entry added`, { id: entry.id, tags });
            ConsoleLogger_1.ConsoleLogger.logSkillSuccess(this.name, { id: entry.id, tags });
            return { success: true, data: entry };
        }
        catch (error) {
            ConsoleLogger_1.ConsoleLogger.logSkillError(this.name, error.message);
            Logger_1.Logger.error(`Error adding memory`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.MemoryTool = MemoryTool;
class MemorySearchTool {
    constructor(memorySystem) {
        this.name = 'memory_search';
        this.description = 'Search memory entries';
        this.category = 'memory';
        this.memorySystem = memorySystem || new MemorySystem_1.MemorySystem();
    }
    async execute(params) {
        try {
            const query = params.query;
            const limit = params.limit || 10;
            if (!query) {
                return { success: false, error: 'query is required' };
            }
            const entries = await this.memorySystem.search(query, limit);
            Logger_1.Logger.info(`Memory search completed`, { query, results: entries.length });
            return { success: true, data: entries };
        }
        catch (error) {
            Logger_1.Logger.error(`Error searching memory`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.MemorySearchTool = MemorySearchTool;
