"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationController = void 0;
const TaskScheduler_1 = require("./TaskScheduler");
const WorkflowEngine_1 = require("./WorkflowEngine");
const MonitoringSystem_1 = require("./MonitoringSystem");
const NetworkTools_1 = require("../skills/NetworkTools");
const Logger_1 = require("../utils/Logger");
class AutomationController {
    constructor(skillManager) {
        this.skillManager = skillManager;
        this.taskScheduler = new TaskScheduler_1.TaskScheduler();
        this.workflowEngine = new WorkflowEngine_1.WorkflowEngine();
        this.monitoringSystem = new MonitoringSystem_1.MonitoringSystem();
    }
    /**
     * Register new automation tools with the skill manager
     */
    registerAutomationTools() {
        const networkTool = new NetworkTools_1.NetworkTool();
        const dnsLookupTool = new NetworkTools_1.DnsLookupTool();
        const whoisTool = new NetworkTools_1.WhoisTool();
        // Register tools with skill manager
        this.skillManager.registerTool(networkTool);
        this.skillManager.registerTool(dnsLookupTool);
        this.skillManager.registerTool(whoisTool);
        Logger_1.Logger.info('Network automation tools registered');
    }
    /**
     * Get the task scheduler
     */
    getTaskScheduler() {
        return this.taskScheduler;
    }
    /**
     * Get the workflow engine
     */
    getWorkflowEngine() {
        return this.workflowEngine;
    }
    /**
     * Get the monitoring system
     */
    getMonitoringSystem() {
        return this.monitoringSystem;
    }
    /**
     * Initialize automation components
     */
    async initialize() {
        Logger_1.Logger.info('Initializing automation components...');
        // Register any additional automation tools
        this.registerAutomationTools();
        Logger_1.Logger.info('Automation components initialized');
    }
    /**
     * Shutdown automation components
     */
    async shutdown() {
        Logger_1.Logger.info('Shutting down automation components...');
        await this.monitoringSystem.shutdown();
        this.taskScheduler.shutdown(); // TaskScheduler has a shutdown method
        Logger_1.Logger.info('Automation components shut down');
    }
}
exports.AutomationController = AutomationController;
