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
exports.MonitoringSystem = void 0;
const chokidar = __importStar(require("chokidar"));
const Logger_1 = require("../utils/Logger");
class MonitoringSystem {
    constructor() {
        this.rules = new Map();
        this.watchers = new Map();
        this.activeMonitors = new Set();
        this.eventQueue = [];
        Logger_1.Logger.info('Monitoring System initialized');
    }
    /**
     * Add a monitoring rule
     */
    addRule(rule) {
        this.rules.set(rule.id, rule);
        Logger_1.Logger.info(`Monitor rule added: ${rule.name}`, { ruleId: rule.id });
    }
    /**
     * Remove a monitoring rule
     */
    removeRule(ruleId) {
        const rule = this.rules.get(ruleId);
        if (!rule) {
            Logger_1.Logger.warn(`Monitor rule not found: ${ruleId}`);
            return;
        }
        // Stop any associated watchers
        if (rule.type === 'filesystem') {
            const watcher = this.watchers.get(ruleId);
            if (watcher) {
                watcher.close();
                this.watchers.delete(ruleId);
            }
        }
        this.rules.delete(ruleId);
        this.activeMonitors.delete(ruleId);
        Logger_1.Logger.info(`Monitor rule removed: ${rule.name}`, { ruleId });
    }
    /**
     * Activate a monitoring rule
     */
    async activateRule(ruleId) {
        const rule = this.rules.get(ruleId);
        if (!rule || !rule.active) {
            Logger_1.Logger.warn(`Cannot activate inactive rule: ${ruleId}`);
            return false;
        }
        try {
            if (rule.type === 'filesystem') {
                // Setup file system watcher
                await this.setupFileSystemWatcher(ruleId);
            }
            this.activeMonitors.add(ruleId);
            Logger_1.Logger.info(`Monitor rule activated: ${ruleId}`);
            return true;
        }
        catch (error) {
            Logger_1.Logger.error(`Error activating monitor rule: ${ruleId}`, {
                error: error.message
            });
            return false;
        }
    }
    /**
     * Deactivate a monitoring rule
     */
    deactivateRule(ruleId) {
        const rule = this.rules.get(ruleId);
        if (!rule) {
            Logger_1.Logger.warn(`Monitor rule not found: ${ruleId}`);
            return false;
        }
        // Stop any associated watchers
        if (rule.type === 'filesystem') {
            const watcher = this.watchers.get(ruleId);
            if (watcher) {
                watcher.close();
                this.watchers.delete(ruleId);
            }
        }
        this.activeMonitors.delete(ruleId);
        Logger_1.Logger.info(`Monitor rule deactivated: ${ruleId}`);
        return true;
    }
    /**
     * Setup file system watcher for a rule
     */
    async setupFileSystemWatcher(ruleId) {
        const rule = this.rules.get(ruleId);
        if (!rule || rule.type !== 'filesystem') {
            throw new Error(`Rule ${ruleId} is not a filesystem rule`);
        }
        // Extract path and events from rule condition
        // For filesystem rules, the condition should check file-related data
        // We'll use the rule name as the path to watch for this example
        // In practice, we'd need a more sophisticated configuration
        // For now, let's assume the rule name contains the path to watch
        // A more robust approach would be to store configuration separately
        const watcher = chokidar.watch(rule.name, {
            persistent: true,
            ignoreInitial: true, // Don't fire events for initial scan
        });
        // Handle file system events
        watcher.on('add', (path) => {
            this.handleFileSystemEvent(ruleId, { type: 'add', path });
        });
        watcher.on('change', (path) => {
            this.handleFileSystemEvent(ruleId, { type: 'change', path });
        });
        watcher.on('unlink', (path) => {
            this.handleFileSystemEvent(ruleId, { type: 'unlink', path });
        });
        // Store the watcher reference
        this.watchers.set(ruleId, watcher);
        Logger_1.Logger.info(`File system watcher set up for rule: ${ruleId}`);
    }
    /**
     * Handle file system event
     */
    async handleFileSystemEvent(ruleId, eventData) {
        const rule = this.rules.get(ruleId);
        if (!rule || !this.activeMonitors.has(ruleId)) {
            return; // Rule not active
        }
        try {
            // Check if the condition is met
            if (rule.condition(eventData)) {
                // Add to queue to prevent blocking the file system watcher
                this.eventQueue.push({
                    ruleId,
                    eventData,
                    timestamp: new Date()
                });
                // Process the queue asynchronously
                await this.processEventQueue();
            }
        }
        catch (error) {
            Logger_1.Logger.error(`Error handling file system event for rule: ${ruleId}`, {
                error: error.message
            });
        }
    }
    /**
     * Process the event queue
     */
    async processEventQueue() {
        // Process events in the queue
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            if (!event)
                continue;
            const rule = this.rules.get(event.ruleId);
            if (!rule)
                continue;
            try {
                await rule.action(event.eventData);
                Logger_1.Logger.info(`Monitor rule action executed: ${rule.name}`, {
                    ruleId: event.ruleId,
                    eventType: event.eventData.type
                });
            }
            catch (error) {
                Logger_1.Logger.error(`Error executing monitor rule action: ${rule.name}`, {
                    ruleId: event.ruleId,
                    error: error.message
                });
            }
        }
    }
    /**
     * Trigger a custom event manually
     */
    async triggerEvent(ruleId, eventData) {
        const rule = this.rules.get(ruleId);
        if (!rule || !this.activeMonitors.has(ruleId)) {
            Logger_1.Logger.warn(`Cannot trigger event for inactive rule: ${ruleId}`);
            return false;
        }
        try {
            if (rule.condition(eventData)) {
                await rule.action(eventData);
                Logger_1.Logger.info(`Custom event triggered for rule: ${ruleId}`, { eventData });
                return true;
            }
            else {
                Logger_1.Logger.debug(`Event condition not met for rule: ${ruleId}`);
                return false;
            }
        }
        catch (error) {
            Logger_1.Logger.error(`Error triggering event for rule: ${ruleId}`, {
                error: error.message
            });
            return false;
        }
    }
    /**
     * Get all monitoring rules
     */
    getRules() {
        return Array.from(this.rules.values());
    }
    /**
     * Get active monitoring rules
     */
    getActiveRules() {
        return Array.from(this.activeMonitors)
            .map(id => this.rules.get(id))
            .filter(Boolean);
    }
    /**
     * Shutdown the monitoring system
     */
    async shutdown() {
        // Close all file system watchers
        for (const [ruleId, watcher] of this.watchers) {
            await watcher.close();
        }
        this.watchers.clear();
        this.activeMonitors.clear();
        Logger_1.Logger.info('Monitoring System shut down');
    }
}
exports.MonitoringSystem = MonitoringSystem;
