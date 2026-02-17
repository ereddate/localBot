import { Logger } from '../utils/Logger';
import { Tool } from '../types';

export interface ScheduledTask {
  id: string;
  name: string;
  cronExpression?: string;
  intervalMs?: number;
  execute: () => Promise<void>;
  active: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export class TaskScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private cronJobs: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    Logger.info('Task Scheduler initialized');
  }

  /**
   * Schedule a task to run at specific intervals
   */
  scheduleTask(task: ScheduledTask): void {
    this.tasks.set(task.id, task);
    
    if (task.intervalMs) {
      // Handle interval-based tasks
      const interval = setInterval(async () => {
        if (task.active) {
          try {
            await task.execute();
            task.lastRun = new Date();
            task.nextRun = new Date(Date.now() + task.intervalMs!);
            Logger.info(`Scheduled task executed: ${task.name}`, { taskId: task.id });
          } catch (error) {
            Logger.error(`Error executing scheduled task: ${task.name}`, { 
              taskId: task.id, 
              error: (error as Error).message 
            });
          }
        }
      }, task.intervalMs);

      this.intervals.set(task.id, interval);
    }

    Logger.info(`Task scheduled: ${task.name}`, { 
      taskId: task.id, 
      intervalMs: task.intervalMs 
    });
  }

  /**
   * Cancel a scheduled task
   */
  cancelTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) {
      Logger.warn(`Task not found for cancellation: ${taskId}`);
      return;
    }

    // Clear interval if exists
    const interval = this.intervals.get(taskId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(taskId);
    }

    // Clear cron job if exists
    const cronJob = this.cronJobs.get(taskId);
    if (cronJob) {
      clearInterval(cronJob);
      this.cronJobs.delete(taskId);
    }

    task.active = false;
    Logger.info(`Task cancelled: ${task.name}`, { taskId });
  }

  /**
   * Execute a task immediately
   */
  async executeTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task || !task.active) {
      Logger.warn(`Task not found or inactive: ${taskId}`);
      return false;
    }

    try {
      await task.execute();
      task.lastRun = new Date();
      Logger.info(`Task executed immediately: ${task.name}`, { taskId });
      return true;
    } catch (error) {
      Logger.error(`Error executing task: ${task.name}`, { 
        taskId, 
        error: (error as Error).message 
      });
      return false;
    }
  }

  /**
   * Get all scheduled tasks
   */
  getTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Shutdown the scheduler
   */
  shutdown(): void {
    // Clear all intervals
    for (const [taskId, interval] of this.intervals) {
      clearInterval(interval);
    }
    this.intervals.clear();

    // Clear all cron jobs
    for (const [taskId, cronJob] of this.cronJobs) {
      clearInterval(cronJob);
    }
    this.cronJobs.clear();

    Logger.info('Task Scheduler shut down');
  }
}