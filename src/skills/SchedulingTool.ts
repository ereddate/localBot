import { Tool, ToolCategory, ToolType } from './SkillManager';

export class SchedulingTool implements Tool {
  name = 'scheduling_tool';
  type: ToolType = 'function';
  category: ToolCategory = 'productivity';
  description = 'Manages schedules, appointments, meetings, and calendar events.';
  parameters = {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: [
          'create_event', 'update_event', 'delete_event', 'get_event', 
          'find_available_slots', 'schedule_meeting', 'get_schedule', 
          'check_availability', 'reschedule', 'cancel'
        ],
        description: 'Operation to perform on the schedule'
      },
      eventData: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique identifier for the event' },
          title: { type: 'string', description: 'Title of the event' },
          description: { type: 'string', description: 'Description of the event' },
          startDate: { type: 'string', format: 'date-time', description: 'Start date and time of the event' },
          endDate: { type: 'string', format: 'date-time', description: 'End date and time of the event' },
          attendees: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of attendee email addresses'
          },
          location: { type: 'string', description: 'Location of the event' },
          timezone: { type: 'string', description: 'Timezone for the event' },
          recurrence: { type: 'string', description: 'Recurrence pattern (e.g., daily, weekly)' },
          reminders: {
            type: 'array',
            items: { type: 'number' },
            description: 'Reminder times in minutes before the event'
          }
        },
        description: 'Event information for scheduling operations'
      },
      searchParams: {
        type: 'object',
        properties: {
          startDate: { type: 'string', format: 'date-time', description: 'Start date for search range' },
          endDate: { type: 'string', format: 'date-time', description: 'End date for search range' },
          attendee: { type: 'string', description: 'Attendee email to check availability' }
        },
        description: 'Parameters for searching or checking availability'
      },
      eventId: {
        type: 'string',
        description: 'ID of the event for specific operations'
      }
    },
    required: ['operation']
  };

  async execute(params: any): Promise<any> {
    try {
      const { operation, eventData, searchParams, eventId } = params;
      
      switch(operation) {
        case 'create_event':
          return this.createEvent(eventData);
        case 'update_event':
          return this.updateEvent(eventId, eventData);
        case 'delete_event':
          return this.deleteEvent(eventId);
        case 'get_event':
          return this.getEvent(eventId);
        case 'find_available_slots':
          return this.findAvailableSlots(searchParams);
        case 'schedule_meeting':
          return this.scheduleMeeting(eventData);
        case 'get_schedule':
          return this.getSchedule(searchParams);
        case 'check_availability':
          return this.checkAvailability(searchParams);
        case 'reschedule':
          return this.reschedule(eventId, eventData);
        case 'cancel':
          return this.cancelEvent(eventId);
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (error) {
      return { error: `Failed to execute scheduling operation: ${error.message}` };
    }
  }

  private async createEvent(eventData: any): Promise<any> {
    if (!eventData.title || !eventData.startDate) {
      throw new Error('Event must have at least a title and start date');
    }
    
    // Validate dates
    if (new Date(eventData.startDate) > new Date(eventData.endDate)) {
      throw new Error('Start date must be before end date');
    }
    
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: eventData.title,
      description: eventData.description || '',
      startDate: new Date(eventData.startDate).toISOString(),
      endDate: eventData.endDate ? new Date(eventData.endDate).toISOString() : 
               new Date(new Date(eventData.startDate).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour default
      attendees: eventData.attendees || [],
      location: eventData.location || 'Virtual Meeting',
      timezone: eventData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      recurrence: eventData.recurrence || null,
      reminders: eventData.reminders || [15], // Default 15-minute reminder
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'confirmed'
    };
    
    return {
      success: true,
      event: event,
      message: 'Event created successfully'
    };
  }

  private async updateEvent(eventId: string, eventData: any): Promise<any> {
    if (!eventId) {
      throw new Error('Event ID is required for update operation');
    }
    
    // Simulate retrieving existing event
    const existingEvent = {
      id: eventId,
      title: 'Existing Event',
      description: 'This is an existing event',
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
      attendees: ['user@example.com'],
      location: 'Conference Room A',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      recurrence: null,
      reminders: [15],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'confirmed'
    };
    
    // Merge updated data with existing event
    const updatedEvent = {
      ...existingEvent,
      ...eventData,
      updatedAt: new Date().toISOString()
    };
    
    // Validate dates if they were updated
    if (updatedEvent.startDate && updatedEvent.endDate) {
      if (new Date(updatedEvent.startDate) > new Date(updatedEvent.endDate)) {
        throw new Error('Start date must be before end date');
      }
    }
    
    return {
      success: true,
      event: updatedEvent,
      message: 'Event updated successfully'
    };
  }

  private async deleteEvent(eventId: string): Promise<any> {
    if (!eventId) {
      throw new Error('Event ID is required for delete operation');
    }
    
    return {
      success: true,
      deletedEventId: eventId,
      message: 'Event deleted successfully'
    };
  }

  private async getEvent(eventId: string): Promise<any> {
    if (!eventId) {
      throw new Error('Event ID is required to get event details');
    }
    
    // Simulate retrieving event details
    const event = {
      id: eventId,
      title: 'Project Review Meeting',
      description: 'Weekly project status review with team',
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
      attendees: ['manager@company.com', 'team@company.com'],
      location: 'Conference Room B',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      recurrence: 'weekly',
      reminders: [30, 15],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'confirmed',
      meetingLink: 'https://meet.company.com/event/' + eventId
    };
    
    return {
      success: true,
      event: event,
      message: 'Event details retrieved successfully'
    };
  }

  private async findAvailableSlots(searchParams: any): Promise<any> {
    const { startDate, endDate, attendee } = searchParams || {};
    
    // Default to next week if no dates provided
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week ahead
    
    // Generate available slots (30-minute intervals)
    const availableSlots = [];
    let current = new Date(start);
    
    // Skip to 9 AM if current time is earlier in the day
    if (current.getHours() < 9) {
      current.setHours(9, 0, 0, 0);
    }
    
    while (current < end) {
      // Skip weekends
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        // Skip outside business hours (9 AM to 5 PM)
        if (current.getHours() >= 9 && current.getHours() < 17) {
          // Add slot if it's not overlapping with existing events (simulated)
          if (Math.random() > 0.3) { // 70% chance of being available
            availableSlots.push({
              start: current.toISOString(),
              end: new Date(current.getTime() + 30 * 60 * 1000).toISOString(), // 30-minute slot
              duration: 30
            });
          }
        }
      }
      
      // Move to next 30-minute slot
      current = new Date(current.getTime() + 30 * 60 * 1000);
    }
    
    // Return only the first 10 slots
    const slots = availableSlots.slice(0, 10);
    
    return {
      success: true,
      slots: slots,
      attendee: attendee || 'current_user',
      searchPeriod: { start: start.toISOString(), end: end.toISOString() },
      message: `Found ${slots.length} available time slots`
    };
  }

  private async scheduleMeeting(eventData: any): Promise<any> {
    // Check availability of all attendees before scheduling
    if (eventData.attendees && eventData.startDate && eventData.endDate) {
      // Simulate checking availability
      const unavailableAttendees = [];
      
      for (const attendee of eventData.attendees) {
        // Simulate 20% chance of being unavailable
        if (Math.random() < 0.2) {
          unavailableAttendees.push(attendee);
        }
      }
      
      if (unavailableAttendees.length > 0) {
        return {
          success: false,
          message: `The following attendees are unavailable: ${unavailableAttendees.join(', ')}. Consider alternative times.`,
          suggestions: await this.findAvailableSlots({
            startDate: eventData.startDate,
            endDate: new Date(new Date(eventData.startDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ahead
          })
        };
      }
    }
    
    // Create the meeting event
    const meeting = await this.createEvent({
      ...eventData,
      title: eventData.title || 'Meeting',
      location: eventData.location || 'Virtual Meeting Room'
    });
    
    return {
      ...meeting,
      message: unavailableAttendees.length === 0 ? 
        'Meeting scheduled successfully' : 
        `Meeting scheduled but with availability concerns: ${meeting.message}`
    };
  }

  private async getSchedule(searchParams: any): Promise<any> {
    const { startDate, endDate } = searchParams || {};
    
    // Default to next 7 days if no dates provided
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Generate mock schedule
    const events = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      // Add 1-3 events per day randomly
      const dailyEventsCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < dailyEventsCount; i++) {
        const hour = 9 + Math.floor(Math.random() * 8); // Between 9 AM and 5 PM
        const minute = Math.floor(Math.random() * 2) * 30; // Either 0 or 30 minutes
        
        const eventStart = new Date(currentDate);
        eventStart.setHours(hour, minute, 0, 0);
        
        const eventEnd = new Date(eventStart);
        eventEnd.setHours(eventEnd.getHours() + 1); // 1-hour events
        
        events.push({
          id: `event_${Date.now()}_${i}`,
          title: `Daily Event ${i+1}`,
          startDate: eventStart.toISOString(),
          endDate: eventEnd.toISOString(),
          location: ['Office', 'Virtual', 'Conference Room'][Math.floor(Math.random() * 3)],
          type: ['meeting', 'appointment', 'review'][Math.floor(Math.random() * 3)]
        });
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      success: true,
      schedule: {
        events: events,
        period: { start: start.toISOString(), end: end.toISOString() },
        totalEvents: events.length
      },
      message: `Retrieved schedule for ${events.length} events`
    };
  }

  private async checkAvailability(searchParams: any): Promise<any> {
    const { attendee, startDate, endDate } = searchParams || {};
    
    if (!attendee) {
      throw new Error('Attendee is required to check availability');
    }
    
    const start = new Date(startDate || new Date());
    const end = new Date(endDate || new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000));
    
    // Simulate checking the attendee's calendar
    const busySlots = [];
    let current = new Date(start);
    
    // Skip to 9 AM if current time is earlier in the day
    if (current.getHours() < 9) {
      current.setHours(9, 0, 0, 0);
    }
    
    while (current < end) {
      // Skip weekends
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        // Skip outside business hours (9 AM to 5 PM)
        if (current.getHours() >= 9 && current.getHours() < 17) {
          // Add busy slot if the attendee has a conflict (simulated)
          if (Math.random() < 0.4) { // 40% chance of being busy
            busySlots.push({
              start: current.toISOString(),
              end: new Date(current.getTime() + 60 * 60 * 1000).toISOString(), // 1-hour slot
              title: 'Busy Slot'
            });
          }
        }
      }
      
      // Move to next hour
      current = new Date(current.getTime() + 60 * 60 * 1000);
    }
    
    // Calculate free time
    const totalHours = (end.getTime() - start.getTime()) / (60 * 60 * 1000);
    const busyHours = busySlots.length;
    const availableHours = totalHours - busyHours;
    
    return {
      success: true,
      attendee: attendee,
      availability: {
        period: { start: start.toISOString(), end: end.toISOString() },
        totalHours: Math.round(totalHours),
        busyHours: busyHours,
        availableHours: Math.round(availableHours),
        busySlots: busySlots,
        availabilityPercentage: Math.round((availableHours / totalHours) * 100)
      },
      message: `${attendee} is available for ${Math.round(availableHours)} hours out of ${Math.round(totalHours)} total hours`
    };
  }

  private async reschedule(eventId: string, newTiming: any): Promise<any> {
    if (!eventId) {
      throw new Error('Event ID is required for rescheduling');
    }
    
    if (!newTiming.startDate) {
      throw new Error('New start date is required for rescheduling');
    }
    
    // First check if the new timing works for all attendees
    const eventDetails = await this.getEvent(eventId);
    const attendees = eventDetails.event?.attendees || [];
    
    if (attendees.length > 0) {
      // Check availability for all attendees at new time
      for (const attendee of attendees) {
        const availability = await this.checkAvailability({
          attendee,
          startDate: newTiming.startDate,
          endDate: newTiming.endDate || new Date(new Date(newTiming.startDate).getTime() + 60 * 60 * 1000).toISOString()
        });
        
        // If attendee is busy during the proposed time, suggest alternatives
        if (availability.availability.busySlots.length > 0) {
          return {
            success: false,
            message: `Attendee ${attendee} is not available at the proposed time.`,
            suggestions: await this.findAvailableSlots({
              startDate: newTiming.startDate,
              endDate: new Date(new Date(newTiming.startDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
            })
          };
        }
      }
    }
    
    // Update the event with new timing
    const updatedEvent = await this.updateEvent(eventId, {
      startDate: newTiming.startDate,
      endDate: newTiming.endDate,
      updatedAt: new Date().toISOString()
    });
    
    return {
      ...updatedEvent,
      message: 'Event rescheduled successfully'
    };
  }

  private async cancelEvent(eventId: string): Promise<any> {
    if (!eventId) {
      throw new Error('Event ID is required for cancellation');
    }
    
    // In a real implementation, this would send cancellation notices to attendees
    return {
      success: true,
      cancelledEventId: eventId,
      message: 'Event cancelled successfully, notifications sent to attendees'
    };
  }
}