"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskScheduler = void 0;
const Logger_1 = require("../utils/Logger");
class TaskScheduler {
    constructor() {
        this.tasks = new Map();
        this.intervals = new Map();
        this.cronJobs = new Map();
        Logger_1.Logger.info('Task Scheduler initialized');
    }
    /**
     * Schedule a task to run at specific intervals
     */
    scheduleTask(task) {
        this.tasks.set(task.id, task);
        if (task.intervalMs) {
            // Handle interval-based tasks
            const interval = setInterval(async () => {
                if (task.active) {
                    try {
                        await task.execute();
                        task.lastRun = new Date();
                        task.nextRun = new Date(Date.now() + task.intervalMs);
                        Logger_1.Logger.info(`Scheduled task executed: ${task.name}`, { taskId: task.id });
                    }
                    catch (error) {
                        Logger_1.Logger.error(`Error executing scheduled task: ${task.name}`, {
                            taskId: task.id,
                            error: error.message
                        });
                    }
                }
            }, task.intervalMs);
            this.intervals.set(task.id, interval);
        }
        Logger_1.Logger.info(`Task scheduled: ${task.name}`, {
            taskId: task.id,
            intervalMs: task.intervalMs
        });
    }
    /**
     * Cancel a scheduled task
     */
    cancelTask(taskId) {
        const task = this.tasks.get(taskId);
        if (!task) {
            Logger_1.Logger.warn(`Task not found for cancellation: ${taskId}`);
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
        Logger_1.Logger.info(`Task cancelled: ${task.name}`, { taskId });
    }
    /**
     * Execute a task immediately
     */
    async executeTask(taskId) {
        const task = this.tasks.get(taskId);
        if (!task || !task.active) {
            Logger_1.Logger.warn(`Task not found or inactive: ${taskId}`);
            return false;
        }
        try {
            await task.execute();
            task.lastRun = new Date();
            Logger_1.Logger.info(`Task executed immediately: ${task.name}`, { taskId });
            return true;
        }
        catch (error) {
            Logger_1.Logger.error(`Error executing task: ${task.name}`, {
                taskId,
                error: error.message
            });
            return false;
        }
    }
    /**
     * Get all scheduled tasks
     */
    getTasks() {
        return Array.from(this.tasks.values());
    }
    /**
     * Shutdown the scheduler
     */
    shutdown() {
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
        Logger_1.Logger.info('Task Scheduler shut down');
    }
}
exports.TaskScheduler = TaskScheduler;
