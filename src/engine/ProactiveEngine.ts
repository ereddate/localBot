import { EventEmitter } from 'events';
import cron from 'node-cron';
import { Logger } from '../utils/Logger';
import { SessionManager } from '../session/SessionManager';
import { BusinessProcessManager } from '../business-processes/BusinessProcessManager';

export interface CronTask {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  action: ProactiveAction;
  lastRun?: Date;
  nextRun?: Date;
  runCount: number;
  errorCount: number;
}

export interface WebhookTrigger {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST';
  enabled: boolean;
  action: ProactiveAction;
  lastTriggered?: Date;
  triggerCount: number;
  errorCount: number;
}

export interface ProactiveAction {
  type: 'message' | 'workflow' | 'notification' | 'custom';
  target: string;
  content: string;
  workflowId?: string;
  params?: Record<string, unknown>;
}

export interface MonitoringRule {
  id: string;
  name: string;
  type: 'github' | 'weather' | 'price' | 'custom';
  enabled: boolean;
  checkInterval: number;
  action: ProactiveAction;
  params?: Record<string, unknown>;
  lastCheck?: Date;
  alertCount: number;
}

export interface ProactiveEngineConfig {
  enabled: boolean;
  maxConcurrentTasks: number;
  taskTimeout: number;
  webhookPort: number;
  logTasks: boolean;
}

export class ProactiveEngine extends EventEmitter {
  private config: ProactiveEngineConfig;
  private sessionManager: SessionManager;
  private businessProcessManager: BusinessProcessManager;
  private cronTasks: Map<string, CronTask>;
  private webhookTriggers: Map<string, WebhookTrigger>;
  private monitoringRules: Map<string, MonitoringRule>;
  private cronJobs: Map<string, cron.ScheduledTask>;

  constructor(
    config: ProactiveEngineConfig,
    sessionManager: SessionManager,
    businessProcessManager: BusinessProcessManager
  ) {
    super();
    this.config = config;
    this.sessionManager = sessionManager;
    this.businessProcessManager = businessProcessManager;
    this.cronTasks = new Map();
    this.webhookTriggers = new Map();
    this.monitoringRules = new Map();
    this.cronJobs = new Map();
  }

  async initialize(): Promise<void> {
    Logger.info('Initializing Proactive Engine', {
      enabled: this.config.enabled,
      maxConcurrentTasks: this.config.maxConcurrentTasks,
    });

    if (!this.config.enabled) {
      Logger.warn('Proactive Engine is disabled');
      return;
    }

    await this.startCronTasks();
    await this.startWebhookServer();
    await this.startMonitoring();

    this.emit('initialized');
  }

  async startCronTasks(): Promise<void> {
    Logger.info('Starting cron tasks');

    for (const task of this.cronTasks.values()) {
      if (task.enabled) {
        this.scheduleCronTask(task);
      }
    }
  }

  addCronTask(task: CronTask): void {
    this.cronTasks.set(task.id, task);

    if (task.enabled) {
      this.scheduleCronTask(task);
    }

    Logger.info('Cron task scheduled', { taskId: task.id, schedule: task.schedule });
  }

  private scheduleCronTask(task: CronTask): void {
    const job = cron.schedule(task.schedule, async () => {
      await this.executeCronTask(task);
    }, {
      scheduled: true,
      timezone: 'Asia/Shanghai'
    });

    this.cronJobs.set(task.id, job);
  }

  private async executeCronTask(task: CronTask): Promise<void> {
    Logger.info('Executing cron task', {
      taskId: task.id,
      name: task.name,
    });

    try {
      await this.executeAction(task.action);
      task.lastRun = new Date();
      task.runCount++;
      this.emit('task-completed', task);
    } catch (error) {
      task.errorCount++;
      Logger.error('Cron task failed', {
        taskId: task.id,
        error: (error as Error).message,
      });
      this.emit('task-failed', task, error);
    }
  }

  async startWebhookServer(): Promise<void> {
    Logger.info('Starting webhook server', { port: this.config.webhookPort });

    const express = require('express');
    const app = express();

    app.use(express.json());

    for (const trigger of this.webhookTriggers.values()) {
      if (trigger.enabled) {
        app[trigger.method.toLowerCase()](trigger.endpoint, async (req: any, res: any) => {
          try {
            await this.executeAction(trigger.action);
            trigger.lastTriggered = new Date();
            trigger.triggerCount++;
            this.emit('webhook-triggered', trigger);
            res.status(200).json({ success: true });
          } catch (error) {
            trigger.errorCount++;
            Logger.error('Webhook trigger failed', {
              triggerId: trigger.id,
              error: (error as Error).message,
            });
            this.emit('webhook-failed', trigger, error);
            res.status(500).json({ success: false, error: (error as Error).message });
          }
        });
      }
    }

    app.listen(this.config.webhookPort, () => {
      Logger.info('Webhook server started', { port: this.config.webhookPort });
    });
  }

  addWebhookTrigger(trigger: WebhookTrigger): void {
    this.webhookTriggers.set(trigger.id, trigger);
    Logger.info('Webhook trigger added', { triggerId: trigger.id, endpoint: trigger.endpoint });
  }

  async startMonitoring(): Promise<void> {
    Logger.info('Starting monitoring rules');

    for (const rule of this.monitoringRules.values()) {
      if (rule.enabled) {
        this.startMonitoringRule(rule);
      }
    }
  }

  addMonitoringRule(rule: MonitoringRule): void {
    this.monitoringRules.set(rule.id, rule);

    if (rule.enabled) {
      this.startMonitoringRule(rule);
    }

    Logger.info('Monitoring rule added', { ruleId: rule.id, type: rule.type });
  }

  private startMonitoringRule(rule: MonitoringRule): void {
    setInterval(async () => {
      await this.checkMonitoringRule(rule);
    }, rule.checkInterval);
  }

  private async checkMonitoringRule(rule: MonitoringRule): Promise<void> {
    try {
      const shouldAlert = await this.evaluateMonitoringRule(rule);

      if (shouldAlert) {
        await this.executeAction(rule.action);
        rule.lastCheck = new Date();
        rule.alertCount++;
        this.emit('monitoring-alert', rule);
      }
    } catch (error) {
      Logger.error('Monitoring rule check failed', {
        ruleId: rule.id,
        error: (error as Error).message,
      });
    }
  }

  private async evaluateMonitoringRule(rule: MonitoringRule): Promise<boolean> {
    switch (rule.type) {
      case 'github':
        return this.checkGitHub(rule);
      case 'weather':
        return this.checkWeather(rule);
      case 'price':
        return this.checkPrice(rule);
      case 'custom':
        return this.checkCustom(rule);
      default:
        return false;
    }
  }

  private async checkGitHub(rule: MonitoringRule): Promise<boolean> {
    const axios = require('axios');
    const params = rule.params as { owner: string; repo: string; lastCommitSha: string };

    try {
      const response = await axios.get(`https://api.github.com/repos/${params.owner}/${params.repo}/commits`, {
        headers: {
          'User-Agent': 'LocalBot',
        },
      });

      const latestCommit = response.data[0];
      const currentSha = latestCommit.sha;

      if (currentSha !== params.lastCommitSha) {
        params.lastCommitSha = currentSha;
        return true;
      }

      return false;
    } catch (error) {
      Logger.error('GitHub check failed', { error: (error as Error).message });
      return false;
    }
  }

  private async checkWeather(rule: MonitoringRule): Promise<boolean> {
    const axios = require('axios');
    const params = rule.params as { city: string; condition: string };

    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: params.city,
          appid: process.env.WEATHER_API_KEY,
          units: 'metric',
        },
      });

      const weather = response.data.weather[0].main.toLowerCase();

      if (weather.includes(params.condition.toLowerCase())) {
        return true;
      }

      return false;
    } catch (error) {
      Logger.error('Weather check failed', { error: (error as Error).message });
      return false;
    }
  }

  private async checkPrice(rule: MonitoringRule): Promise<boolean> {
    const axios = require('axios');
    const cheerio = require('cheerio');
    const params = rule.params as { url: string; priceSelector: string; threshold: number; lastPrice: number };

    try {
      const response = await axios.get(params.url);
      const $ = cheerio.load(response.data);
      const priceText = $(params.priceSelector).text().replace(/[^0-9.]/g, '');
      const currentPrice = parseFloat(priceText);

      if (currentPrice <= params.threshold && currentPrice !== params.lastPrice) {
        params.lastPrice = currentPrice;
        return true;
      }

      return false;
    } catch (error) {
      Logger.error('Price check failed', { error: (error as Error).message });
      return false;
    }
  }

  private async checkCustom(rule: MonitoringRule): Promise<boolean> {
    const params = rule.params as { checkFunction: string };

    try {
      const result = eval(params.checkFunction);
      return Boolean(result);
    } catch (error) {
      Logger.error('Custom check failed', { error: (error as Error).message });
      return false;
    }
  }

  private async executeAction(action: ProactiveAction): Promise<void> {
    switch (action.type) {
      case 'message':
        await this.sendMessage(action);
        break;
      case 'workflow':
        await this.executeWorkflow(action);
        break;
      case 'notification':
        await this.sendNotification(action);
        break;
      case 'custom':
        await this.executeCustom(action);
        break;
    }
  }

  private async sendMessage(action: ProactiveAction): Promise<void> {
    const session = await this.sessionManager.getSession(action.target);

    if (session) {
      session.messages.push({
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: action.content,
        timestamp: new Date(),
      });

      await this.sessionManager.saveSession(action.target);
    }
  }

  private async executeWorkflow(action: ProactiveAction): Promise<void> {
    if (action.workflowId) {
      const options = {
        processId: action.workflowId,
        inputData: action.params || {}
      };
      await this.businessProcessManager.executeBusinessProcessByRequirement(action.workflowId, options);
    }
  }

  private async sendNotification(action: ProactiveAction): Promise<void> {
    Logger.info('Sending notification', {
      target: action.target,
      content: action.content,
    });
  }

  private async executeCustom(action: ProactiveAction): Promise<void> {
    if (action.params) {
      const customFunction = action.params.customFunction as string;
      eval(customFunction);
    }
  }

  getCronTasks(): CronTask[] {
    return Array.from(this.cronTasks.values());
  }

  getWebhookTriggers(): WebhookTrigger[] {
    return Array.from(this.webhookTriggers.values());
  }

  getMonitoringRules(): MonitoringRule[] {
    return Array.from(this.monitoringRules.values());
  }

  removeCronTask(taskId: string): void {
    const job = this.cronJobs.get(taskId);
    if (job) {
      job.stop();
      this.cronJobs.delete(taskId);
    }
    this.cronTasks.delete(taskId);
  }

  removeWebhookTrigger(triggerId: string): void {
    this.webhookTriggers.delete(triggerId);
  }

  removeMonitoringRule(ruleId: string): void {
    this.monitoringRules.delete(ruleId);
  }

  async shutdown(): Promise<void> {
    Logger.info('Shutting down Proactive Engine');

    for (const job of this.cronJobs.values()) {
      job.stop();
    }

    this.cronJobs.clear();
    this.cronTasks.clear();
    this.webhookTriggers.clear();
    this.monitoringRules.clear();

    this.emit('shutdown');
  }

  updateConfig(config: Partial<ProactiveEngineConfig>): void {
    this.config = { ...this.config, ...config };
    Logger.info('Proactive Engine config updated', this.config as unknown as Record<string, unknown>);
  }
}
