import { TaskScheduler } from './TaskScheduler';
import { WorkflowEngine } from './WorkflowEngine';
import { MonitoringSystem } from './MonitoringSystem';
import { NetworkTool, DnsLookupTool, WhoisTool } from '../skills/NetworkTools';
import { SkillManager } from '../skills/SkillManager';
import { Logger } from '../utils/Logger';

export class AutomationController {
  private taskScheduler: TaskScheduler;
  private workflowEngine: WorkflowEngine;
  private monitoringSystem: MonitoringSystem;
  private skillManager: SkillManager;

  constructor(skillManager: SkillManager) {
    this.skillManager = skillManager;
    this.taskScheduler = new TaskScheduler();
    this.workflowEngine = new WorkflowEngine();
    this.monitoringSystem = new MonitoringSystem();
  }

  /**
   * Register new automation tools with the skill manager
   */
  private registerAutomationTools(): void {
    const networkTool = new NetworkTool();
    const dnsLookupTool = new DnsLookupTool();
    const whoisTool = new WhoisTool();

    // Register tools with skill manager
    this.skillManager.registerTool(networkTool);
    this.skillManager.registerTool(dnsLookupTool);
    this.skillManager.registerTool(whoisTool);

    Logger.info('Network automation tools registered');
  }

  /**
   * Get the task scheduler
   */
  getTaskScheduler(): TaskScheduler {
    return this.taskScheduler;
  }

  /**
   * Get the workflow engine
   */
  getWorkflowEngine(): WorkflowEngine {
    return this.workflowEngine;
  }

  /**
   * Get the monitoring system
   */
  getMonitoringSystem(): MonitoringSystem {
    return this.monitoringSystem;
  }

  /**
   * Initialize automation components
   */
  async initialize(): Promise<void> {
    Logger.info('Initializing automation components...');
    
    // Register any additional automation tools
    this.registerAutomationTools();
    
    Logger.info('Automation components initialized');
  }

  /**
   * Shutdown automation components
   */
  async shutdown(): Promise<void> {
    Logger.info('Shutting down automation components...');
    
    await this.monitoringSystem.shutdown();
    this.taskScheduler.shutdown();  // TaskScheduler has a shutdown method
    
    Logger.info('Automation components shut down');
  }
}