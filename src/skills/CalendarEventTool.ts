import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

export class CalendarEventTool implements Tool {
  name = 'calendar_event_manager';
  description = '日历和事件管理工具，用于创建、查询和管理日程事件';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const operation = params.operation as string;
      const eventTitle = params.eventTitle as string;
      const startTime = params.startTime as string;
      const endTime = params.endTime as string;
      const date = params.date as string;
      const eventId = params.eventId as string;

      if (!operation) {
        return { success: false, error: 'Operation is required. Available operations: create, get, update, delete, list_today, list_week' };
      }

      switch (operation.toLowerCase()) {
        case 'create':
          if (!eventTitle || !startTime) {
            return { success: false, error: 'Event title and start time are required for creating an event' };
          }
          return this.createEvent(eventTitle, startTime, endTime, params.description as string);

        case 'get':
          if (!eventId) {
            return { success: false, error: 'Event ID is required for getting an event' };
          }
          return this.getEvent(eventId);

        case 'update':
          if (!eventId) {
            return { success: false, error: 'Event ID is required for updating an event' };
          }
          return this.updateEvent(eventId, eventTitle, startTime, endTime, params.description as string);

        case 'delete':
          if (!eventId) {
            return { success: false, error: 'Event ID is required for deleting an event' };
          }
          return this.deleteEvent(eventId);

        case 'list_today':
          return this.listEventsForDay(date || new Date().toISOString().split('T')[0]);

        case 'list_week':
          return this.listEventsForWeek(date || new Date().toISOString().split('T')[0]);

        default:
          return { success: false, error: `Unsupported operation: ${operation}. Available operations: create, get, update, delete, list_today, list_week` };
      }
    } catch (error) {
      Logger.error('Calendar event tool error', { error: (error as Error).message });
      return { success: false, error: `Failed to execute calendar event operation: ${(error as Error).message}` };
    }
  }

  private async createEvent(title: string, startTime: string, endTime?: string, description?: string): Promise<ToolResult> {
    // 生成唯一的事件ID
    const eventId = `event_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    // 解析时间
    let startDateTime: Date;
    try {
      startDateTime = new Date(startTime);
      if (isNaN(startDateTime.getTime())) {
        return { success: false, error: 'Invalid start time format. Use ISO format (YYYY-MM-DDTHH:mm:ss) or readable format' };
      }
    } catch (e) {
      return { success: false, error: 'Invalid start time format' };
    }

    let endDateTime: Date;
    if (endTime) {
      try {
        endDateTime = new Date(endTime);
        if (isNaN(endDateTime.getTime())) {
          return { success: false, error: 'Invalid end time format. Use ISO format (YYYY-MM-DDTHH:mm:ss) or readable format' };
        }
      } catch (e) {
        return { success: false, error: 'Invalid end time format' };
      }
    } else {
      // 如果没有提供结束时间，默认为开始时间后1小时
      endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    }

    // 创建事件对象
    const event = {
      id: eventId,
      title,
      description: description || '',
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 在实际应用中，这里会将事件保存到数据库或文件中
    // 为了演示目的，我们只是返回创建的事件
    
    return {
      success: true,
      data: {
        message: 'Event created successfully',
        event
      }
    };
  }

  private async getEvent(eventId: string): Promise<ToolResult> {
    // 在实际应用中，这里会从数据库或文件中检索事件
    // 为了演示目的，我们生成一个模拟事件
    
    // 模拟查找事件的过程
    const events = [
      {
        id: 'event_12345_67890',
        title: '团队会议',
        description: '每周团队同步会议',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24小时后
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 25小时后
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 一周前
        updatedAt: new Date().toISOString()
      },
      {
        id: 'event_98765_43210',
        title: '项目截止日期',
        description: '提交季度报告',
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天后
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 3天后30分钟
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
        updatedAt: new Date().toISOString()
      }
    ];

    const event = events.find(e => e.id === eventId) || {
      id: eventId,
      title: `事件 ${eventId}`,
      description: '这是一个示例事件',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: {
        event
      }
    };
  }

  private async updateEvent(
    eventId: string, 
    title?: string, 
    startTime?: string, 
    endTime?: string, 
    description?: string
  ): Promise<ToolResult> {
    // 获取当前事件
    const currentEventResult = await this.getEvent(eventId);
    if (!currentEventResult.success) {
      return currentEventResult;
    }

    const currentEvent = (currentEventResult as any).data.event;

    // 更新事件属性
    const updatedEvent = {
      ...currentEvent,
      title: title || currentEvent.title,
      description: description || currentEvent.description,
      startTime: startTime ? new Date(startTime).toISOString() : currentEvent.startTime,
      endTime: endTime ? new Date(endTime).toISOString() : currentEvent.endTime,
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: {
        message: 'Event updated successfully',
        event: updatedEvent
      }
    };
  }

  private async deleteEvent(eventId: string): Promise<ToolResult> {
    // 在实际应用中，这里会从数据库或文件中删除事件
    // 为了演示目的，我们只是返回成功消息
    
    return {
      success: true,
      data: {
        message: `Event ${eventId} deleted successfully`
      }
    };
  }

  private async listEventsForDay(date: string): Promise<ToolResult> {
    // 解析日期
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return { success: false, error: 'Invalid date format' };
    }

    // 生成当天的模拟事件
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 生成一些模拟事件
    const events = [];
    for (let i = 0; i < Math.floor(Math.random() * 4); i++) {
      const hourOffset = 8 + i * 2; // 从早上8点开始，每2小时一个事件
      const eventStart = new Date(startOfDay);
      eventStart.setHours(hourOffset, 0, 0, 0);
      
      const eventEnd = new Date(startOfDay);
      eventEnd.setHours(hourOffset + 1, 0, 0, 0); // 每个事件持续1小时
      
      events.push({
        id: `event_${Date.now()}_${i}`,
        title: `每日事件 ${i+1}`,
        description: `这是${targetDate.toDateString()}的日程安排`,
        startTime: eventStart.toISOString(),
        endTime: eventEnd.toISOString(),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // 添加一个今天的时间作为参考
    const today = new Date();
    
    return {
      success: true,
      data: {
        date: targetDate.toISOString().split('T')[0],
        events,
        totalEvents: events.length,
        dayOfWeek: targetDate.toLocaleDateString('zh-CN', { weekday: 'long' })
      }
    };
  }

  private async listEventsForWeek(date: string): Promise<ToolResult> {
    // 解析日期
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return { success: false, error: 'Invalid date format' };
    }

    // 计算本周的开始日期（周一）
    const dayOfWeek = targetDate.getDay();
    const diffToMonday = targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // 调整周日为-6天
    const startDate = new Date(targetDate.setDate(diffToMonday));
    startDate.setHours(0, 0, 0, 0);

    // 生成本周的模拟事件
    const weeklyEvents = [];
    
    for (let i = 0; i < 7; i++) { // 7天
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // 每天生成0-3个随机事件
      const dailyEventsCount = Math.floor(Math.random() * 4);
      for (let j = 0; j < dailyEventsCount; j++) {
        const hourOffset = 9 + j * 3; // 从上午9点开始
        const eventStart = new Date(currentDate);
        eventStart.setHours(hourOffset, 0, 0, 0);
        
        const eventEnd = new Date(currentDate);
        eventEnd.setHours(hourOffset + 1, 30, 0, 0); // 每个事件持续1.5小时
        
        weeklyEvents.push({
          id: `event_${Date.now()}_${i}_${j}`,
          title: `周${['一','二','三','四','五','六','日'][i]}事件 ${j+1}`,
          description: `这是${currentDate.toDateString()}的第${j+1}个事件`,
          date: currentDate.toISOString().split('T')[0],
          startTime: eventStart.toISOString(),
          endTime: eventEnd.toISOString(),
          dayOfWeek: currentDate.toLocaleDateString('zh-CN', { weekday: 'long' }),
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    return {
      success: true,
      data: {
        weekOf: startDate.toISOString().split('T')[0],
        events: weeklyEvents,
        totalEvents: weeklyEvents.length,
        summary: {
          monday: weeklyEvents.filter(e => new Date(e.date).getDay() === 1).length,
          tuesday: weeklyEvents.filter(e => new Date(e.date).getDay() === 2).length,
          wednesday: weeklyEvents.filter(e => new Date(e.date).getDay() === 3).length,
          thursday: weeklyEvents.filter(e => new Date(e.date).getDay() === 4).length,
          friday: weeklyEvents.filter(e => new Date(e.date).getDay() === 5).length,
          saturday: weeklyEvents.filter(e => new Date(e.date).getDay() === 6).length,
          sunday: weeklyEvents.filter(e => new Date(e.date).getDay() === 0).length
        }
      }
    };
  }
}