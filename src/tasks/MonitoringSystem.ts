import * as fs from 'fs/promises';
import * as chokidar from 'chokidar';
import { Logger } from '../utils/Logger';
import { Tool } from '../types';

export interface MonitorRule {
  id: string;
  name: string;
  type: 'filesystem' | 'process' | 'network' | 'custom';
  condition: (data: any) => boolean;
  action: (data: any) => Promise<void>;
  active: boolean;
  description: string;
}

export interface FileMonitorConfig {
  path: string;
  events: ('add' | 'change' | 'unlink')[];
  recursive?: boolean;
}

export class MonitoringSystem {
  private rules: Map<string, MonitorRule> = new Map();
  private watchers: Map<string, chokidar.FSWatcher> = new Map();
  private activeMonitors: Set<string> = new Set();
  private eventQueue: Array<{ ruleId: string; eventData: any; timestamp: Date }> = [];

  constructor() {
    Logger.info('Monitoring System initialized');
  }

  /**
   * Add a monitoring rule
   */
  addRule(rule: MonitorRule): void {
    this.rules.set(rule.id, rule);
    Logger.info(`Monitor rule added: ${rule.name}`, { ruleId: rule.id });
  }

  /**
   * Remove a monitoring rule
   */
  removeRule(ruleId: string): void {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      Logger.warn(`Monitor rule not found: ${ruleId}`);
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
    Logger.info(`Monitor rule removed: ${rule.name}`, { ruleId });
  }

  /**
   * Activate a monitoring rule
   */
  async activateRule(ruleId: string): Promise<boolean> {
    const rule = this.rules.get(ruleId);
    if (!rule || !rule.active) {
      Logger.warn(`Cannot activate inactive rule: ${ruleId}`);
      return false;
    }

    try {
      if (rule.type === 'filesystem') {
        // Setup file system watcher
        await this.setupFileSystemWatcher(ruleId);
      }

      this.activeMonitors.add(ruleId);
      Logger.info(`Monitor rule activated: ${ruleId}`);
      return true;
    } catch (error) {
      Logger.error(`Error activating monitor rule: ${ruleId}`, { 
        error: (error as Error).message 
      });
      return false;
    }
  }

  /**
   * Deactivate a monitoring rule
   */
  deactivateRule(ruleId: string): boolean {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      Logger.warn(`Monitor rule not found: ${ruleId}`);
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
    Logger.info(`Monitor rule deactivated: ${ruleId}`);
    return true;
  }

  /**
   * Setup file system watcher for a rule
   */
  private async setupFileSystemWatcher(ruleId: string): Promise<void> {
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
    Logger.info(`File system watcher set up for rule: ${ruleId}`);
  }

  /**
   * Handle file system event
   */
  private async handleFileSystemEvent(ruleId: string, eventData: any): Promise<void> {
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
    } catch (error) {
      Logger.error(`Error handling file system event for rule: ${ruleId}`, { 
        error: (error as Error).message 
      });
    }
  }

  /**
   * Process the event queue
   */
  private async processEventQueue(): Promise<void> {
    // Process events in the queue
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (!event) continue;

      const rule = this.rules.get(event.ruleId);
      if (!rule) continue;

      try {
        await rule.action(event.eventData);
        Logger.info(`Monitor rule action executed: ${rule.name}`, { 
          ruleId: event.ruleId,
          eventType: event.eventData.type
        });
      } catch (error) {
        Logger.error(`Error executing monitor rule action: ${rule.name}`, { 
          ruleId: event.ruleId,
          error: (error as Error).message 
        });
      }
    }
  }

  /**
   * Trigger a custom event manually
   */
  async triggerEvent(ruleId: string, eventData: any): Promise<boolean> {
    const rule = this.rules.get(ruleId);
    if (!rule || !this.activeMonitors.has(ruleId)) {
      Logger.warn(`Cannot trigger event for inactive rule: ${ruleId}`);
      return false;
    }

    try {
      if (rule.condition(eventData)) {
        await rule.action(eventData);
        Logger.info(`Custom event triggered for rule: ${ruleId}`, { eventData });
        return true;
      } else {
        Logger.debug(`Event condition not met for rule: ${ruleId}`);
        return false;
      }
    } catch (error) {
      Logger.error(`Error triggering event for rule: ${ruleId}`, { 
        error: (error as Error).message 
      });
      return false;
    }
  }

  /**
   * Get all monitoring rules
   */
  getRules(): MonitorRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get active monitoring rules
   */
  getActiveRules(): MonitorRule[] {
    return Array.from(this.activeMonitors)
      .map(id => this.rules.get(id))
      .filter(Boolean) as MonitorRule[];
  }

  /**
   * Shutdown the monitoring system
   */
  async shutdown(): Promise<void> {
    // Close all file system watchers
    for (const [ruleId, watcher] of this.watchers) {
      await watcher.close();
    }
    this.watchers.clear();

    this.activeMonitors.clear();
    Logger.info('Monitoring System shut down');
  }
}