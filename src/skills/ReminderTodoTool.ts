import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

export class ReminderTodoTool implements Tool {
  name = 'reminder_todo_manager';
  description = '提醒和待办事项管理工具，用于创建、查询和管理提醒及待办事项';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const operation = params.operation as string;
      const taskId = params.taskId as string;
      const reminderId = params.reminderId as string;
      const title = params.title as string;
      const description = params.description as string;
      const dueDate = params.dueDate as string;
      const priority = params.priority as string;
      const category = params.category as string;
      const completed = params.completed !== undefined ? Boolean(params.completed) : undefined;

      if (!operation) {
        return { success: false, error: 'Operation is required. Available operations: create_task, create_reminder, get_task, get_reminder, update_task, update_reminder, delete_task, delete_reminder, list_tasks, list_reminders, complete_task, complete_reminder' };
      }

      switch (operation.toLowerCase()) {
        case 'create_task':
          if (!title) {
            return { success: false, error: 'Task title is required for creating a task' };
          }
          return this.createTask(title, description, dueDate, priority, category);

        case 'create_reminder':
          if (!title) {
            return { success: false, error: 'Reminder title is required for creating a reminder' };
          }
          return this.createReminder(title, description, dueDate, priority, category);

        case 'get_task':
          if (!taskId) {
            return { success: false, error: 'Task ID is required for getting a task' };
          }
          return this.getTask(taskId);

        case 'get_reminder':
          if (!reminderId) {
            return { success: false, error: 'Reminder ID is required for getting a reminder' };
          }
          return this.getReminder(reminderId);

        case 'update_task':
          if (!taskId) {
            return { success: false, error: 'Task ID is required for updating a task' };
          }
          return this.updateTask(taskId, title, description, dueDate, priority, category, completed);

        case 'update_reminder':
          if (!reminderId) {
            return { success: false, error: 'Reminder ID is required for updating a reminder' };
          }
          return this.updateReminder(reminderId, title, description, dueDate, priority, category);

        case 'delete_task':
          if (!taskId) {
            return { success: false, error: 'Task ID is required for deleting a task' };
          }
          return this.deleteTask(taskId);

        case 'delete_reminder':
          if (!reminderId) {
            return { success: false, error: 'Reminder ID is required for deleting a reminder' };
          }
          return this.deleteReminder(reminderId);

        case 'list_tasks':
          return this.listTasks(category, priority, completed);

        case 'list_reminders':
          return this.listReminders(category, priority);

        case 'complete_task':
          if (!taskId) {
            return { success: false, error: 'Task ID is required for completing a task' };
          }
          return this.completeTask(taskId);

        case 'complete_reminder':
          if (!reminderId) {
            return { success: false, error: 'Reminder ID is required for completing a reminder' };
          }
          return this.completeReminder(reminderId);

        default:
          return { success: false, error: `Unsupported operation: ${operation}. Available operations: create_task, create_reminder, get_task, get_reminder, update_task, update_reminder, delete_task, delete_reminder, list_tasks, list_reminders, complete_task, complete_reminder` };
      }
    } catch (error) {
      Logger.error('Reminder and todo tool error', { error: (error as Error).message });
      return { success: false, error: `Failed to execute reminder/todo operation: ${(error as Error).message}` };
    }
  }

  private async createTask(title: string, description?: string, dueDate?: string, priority?: string, category?: string): Promise<ToolResult> {
    const taskId = `task_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    // 验证优先级
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    const taskPriority = priority && validPriorities.includes(priority.toLowerCase()) ? priority.toLowerCase() : 'medium';
    
    // 验证分类
    const validCategories = ['work', 'personal', 'shopping', 'health', 'finance', 'education', 'home'];
    const taskCategory = category && validCategories.includes(category.toLowerCase()) ? category.toLowerCase() : 'personal';

    // 解析截止日期
    let parsedDueDate: Date | null = null;
    if (dueDate) {
      parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return { success: false, error: 'Invalid due date format' };
      }
    } else {
      // 如果没有提供截止日期，默认为明天
      parsedDueDate = new Date();
      parsedDueDate.setDate(parsedDueDate.getDate() + 1);
    }

    const task = {
      id: taskId,
      title,
      description: description || '',
      dueDate: parsedDueDate.toISOString(),
      priority: taskPriority,
      category: taskCategory,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: {
        message: 'Task created successfully',
        task
      }
    };
  }

  private async createReminder(title: string, description?: string, triggerDate?: string, priority?: string, category?: string): Promise<ToolResult> {
    const reminderId = `reminder_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    // 验证优先级
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    const reminderPriority = priority && validPriorities.includes(priority.toLowerCase()) ? priority.toLowerCase() : 'medium';
    
    // 验证分类
    const validCategories = ['meeting', 'appointment', 'birthday', 'deadline', 'payment', 'health', 'event'];
    const reminderCategory = category && validCategories.includes(category.toLowerCase()) ? category.toLowerCase() : 'event';

    // 解析触发日期
    let parsedTriggerDate: Date | null = null;
    if (triggerDate) {
      parsedTriggerDate = new Date(triggerDate);
      if (isNaN(parsedTriggerDate.getTime())) {
        return { success: false, error: 'Invalid trigger date format' };
      }
    } else {
      // 如果没有提供触发日期，默认为1小时后
      parsedTriggerDate = new Date();
      parsedTriggerDate.setHours(parsedTriggerDate.getHours() + 1);
    }

    const reminder = {
      id: reminderId,
      title,
      description: description || '',
      triggerDate: parsedTriggerDate.toISOString(),
      priority: reminderPriority,
      category: reminderCategory,
      triggered: false,
      snoozed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: {
        message: 'Reminder created successfully',
        reminder
      }
    };
  }

  private async getTask(taskId: string): Promise<ToolResult> {
    // 在实际应用中，这里会从数据库或文件中检索任务
    // 为了演示目的，我们生成一个模拟任务
    
    const task = {
      id: taskId,
      title: `任务 ${taskId}`,
      description: '这是一个示例任务',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24小时后
      priority: 'medium',
      category: 'personal',
      completed: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: { task }
    };
  }

  private async getReminder(reminderId: string): Promise<ToolResult> {
    // 在实际应用中，这里会从数据库或文件中检索提醒
    // 为了演示目的，我们生成一个模拟提醒
    
    const reminder = {
      id: reminderId,
      title: `提醒 ${reminderId}`,
      description: '这是一个示例提醒',
      triggerDate: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分钟后
      priority: 'medium',
      category: 'event',
      triggered: false,
      snoozed: false,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1小时前
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: { reminder }
    };
  }

  private async updateTask(
    taskId: string,
    title?: string,
    description?: string,
    dueDate?: string,
    priority?: string,
    category?: string,
    completed?: boolean
  ): Promise<ToolResult> {
    const currentTaskResult = await this.getTask(taskId);
    if (!currentTaskResult.success) {
      return currentTaskResult;
    }

    const currentTask = (currentTaskResult as any).data.task;

    // 验证优先级
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    const taskPriority = priority && validPriorities.includes(priority.toLowerCase()) ? priority.toLowerCase() : currentTask.priority;
    
    // 验证分类
    const validCategories = ['work', 'personal', 'shopping', 'health', 'finance', 'education', 'home'];
    const taskCategory = category && validCategories.includes(category.toLowerCase()) ? category.toLowerCase() : currentTask.category;

    const updatedTask = {
      ...currentTask,
      title: title || currentTask.title,
      description: description !== undefined ? description : currentTask.description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : currentTask.dueDate,
      priority: taskPriority,
      category: taskCategory,
      completed: completed !== undefined ? completed : currentTask.completed,
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: {
        message: 'Task updated successfully',
        task: updatedTask
      }
    };
  }

  private async updateReminder(
    reminderId: string,
    title?: string,
    description?: string,
    triggerDate?: string,
    priority?: string,
    category?: string
  ): Promise<ToolResult> {
    const currentReminderResult = await this.getReminder(reminderId);
    if (!currentReminderResult.success) {
      return currentReminderResult;
    }

    const currentReminder = (currentReminderResult as any).data.reminder;

    // 验证优先级
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    const reminderPriority = priority && validPriorities.includes(priority.toLowerCase()) ? priority.toLowerCase() : currentReminder.priority;
    
    // 验证分类
    const validCategories = ['meeting', 'appointment', 'birthday', 'deadline', 'payment', 'health', 'event'];
    const reminderCategory = category && validCategories.includes(category.toLowerCase()) ? category.toLowerCase() : currentReminder.category;

    const updatedReminder = {
      ...currentReminder,
      title: title || currentReminder.title,
      description: description !== undefined ? description : currentReminder.description,
      triggerDate: triggerDate ? new Date(triggerDate).toISOString() : currentReminder.triggerDate,
      priority: reminderPriority,
      category: reminderCategory,
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: {
        message: 'Reminder updated successfully',
        reminder: updatedReminder
      }
    };
  }

  private async deleteTask(taskId: string): Promise<ToolResult> {
    return {
      success: true,
      data: {
        message: `Task ${taskId} deleted successfully`
      }
    };
  }

  private async deleteReminder(reminderId: string): Promise<ToolResult> {
    return {
      success: true,
      data: {
        message: `Reminder ${reminderId} deleted successfully`
      }
    };
  }

  private async listTasks(category?: string, priority?: string, completed?: boolean): Promise<ToolResult> {
    // 生成模拟任务列表
    const tasks = [];
    
    // 创建一些示例任务
    for (let i = 0; i < 5; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + i); // 每天一个任务
      
      const sampleTasks = [
        '准备季度报告', '购买生活用品', '安排医生预约', '整理办公桌', '学习新技术'
      ];
      
      tasks.push({
        id: `task_${Date.now()}_${i}`,
        title: sampleTasks[i % sampleTasks.length],
        description: `这是${sampleTasks[i % sampleTasks.length]}的详细说明`,
        dueDate: dueDate.toISOString(),
        priority: ['low', 'medium', 'high', 'medium', 'low'][i % 4],
        category: ['work', 'personal', 'health', 'home', 'education'][i % 5],
        completed: i % 3 === 0, // 每第三个任务标记为已完成
        createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // 根据参数过滤任务
    let filteredTasks = tasks;
    
    if (category) {
      filteredTasks = filteredTasks.filter(task => task.category === category.toLowerCase());
    }
    
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority.toLowerCase());
    }
    
    if (completed !== undefined) {
      filteredTasks = filteredTasks.filter(task => task.completed === completed);
    }

    return {
      success: true,
      data: {
        tasks: filteredTasks,
        totalTasks: filteredTasks.length,
        filtersApplied: {
          category,
          priority,
          completed
        }
      }
    };
  }

  private async listReminders(category?: string, priority?: string): Promise<ToolResult> {
    // 生成模拟提醒列表
    const reminders = [];
    
    // 创建一些示例提醒
    for (let i = 0; i < 4; i++) {
      const triggerDate = new Date();
      triggerDate.setMinutes(triggerDate.getMinutes() + (i + 1) * 15); // 每15分钟一个提醒
      
      const sampleReminders = [
        '会议开始', '服药时间', '生日提醒', '缴费截止'
      ];
      
      reminders.push({
        id: `reminder_${Date.now()}_${i}`,
        title: sampleReminders[i % sampleReminders.length],
        description: `记得${sampleReminders[i % sampleReminders.length]}`,
        triggerDate: triggerDate.toISOString(),
        priority: ['low', 'medium', 'high', 'urgent'][i % 4],
        category: ['meeting', 'health', 'birthday', 'payment'][i % 4],
        triggered: false,
        snoozed: false,
        createdAt: new Date(Date.now() - (i * 60 * 60 * 1000)).toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // 根据参数过滤提醒
    let filteredReminders = reminders;
    
    if (category) {
      filteredReminders = filteredReminders.filter(reminder => reminder.category === category.toLowerCase());
    }
    
    if (priority) {
      filteredReminders = filteredReminders.filter(reminder => reminder.priority === priority.toLowerCase());
    }

    return {
      success: true,
      data: {
        reminders: filteredReminders,
        totalReminders: filteredReminders.length,
        filtersApplied: {
          category,
          priority
        }
      }
    };
  }

  private async completeTask(taskId: string): Promise<ToolResult> {
    const currentTaskResult = await this.getTask(taskId);
    if (!currentTaskResult.success) {
      return currentTaskResult;
    }

    const currentTask = (currentTaskResult as any).data.task;

    const completedTask = {
      ...currentTask,
      completed: true,
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: {
        message: `Task ${taskId} marked as completed`,
        task: completedTask
      }
    };
  }

  private async completeReminder(reminderId: string): Promise<ToolResult> {
    const currentReminderResult = await this.getReminder(reminderId);
    if (!currentReminderResult.success) {
      return currentReminderResult;
    }

    const currentReminder = (currentReminderResult as any).data.reminder;

    const completedReminder = {
      ...currentReminder,
      triggered: true,
      snoozed: false,
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: {
        message: `Reminder ${reminderId} marked as completed`,
        reminder: completedReminder
      }
    };
  }
}