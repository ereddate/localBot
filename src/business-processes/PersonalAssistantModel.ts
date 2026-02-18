import { WorkflowDefinition } from '../tasks/WorkflowEngine';

// Personal Assistant Process - Handles daily personal tasks and scheduling
export const personalAssistantProcess: WorkflowDefinition = {
  id: 'personal-assistant-process',
  name: 'Personal Assistant Process',
  description: 'Manages daily personal tasks, scheduling, reminders, and personal organization',
  steps: [
    {
      id: 'analyze-request',
      tool: 'text_analysis_tool',
      params: { 
        user_request: '{{user_request}}' 
      },
      description: 'Analyze user request to determine intent'
    },
    {
      id: 'schedule-task',
      tool: 'calendar_scheduler_tool',
      params: { 
        task_details: '{{task_details}}',
        intent: '{{intent}}'
      },
      description: 'Schedule task based on user intent',
      dependsOn: ['analyze-request']
    },
    {
      id: 'set-reminder',
      tool: 'reminder_todo_tool',
      params: { 
        task_details: '{{task_details}}' 
      },
      description: 'Set reminder for user',
      dependsOn: ['analyze-request']
    },
    {
      id: 'send-notification',
      tool: 'notification_tool',
      params: { 
        event_details: '{{event_details}}' 
      },
      description: 'Send notification to user',
      dependsOn: ['schedule-task', 'set-reminder']
    }
  ]
};

// Health and Wellness Process - Manages health tracking and wellness activities
export const healthWellnessProcess: WorkflowDefinition = {
  id: 'health-wellness-process',
  name: 'Health and Wellness Process',
  description: 'Tracks health metrics, suggests wellness activities, and monitors fitness goals',
  steps: [
    {
      id: 'track-health-data',
      tool: 'health_tracker_tool',
      params: { 
        health_metrics: '{{health_metrics}}' 
      },
      description: 'Track user health metrics'
    },
    {
      id: 'analyze-health-patterns',
      tool: 'data_analysis_tool',
      params: { 
        tracked_data: '{{tracked_data}}' 
      },
      description: 'Analyze health data patterns',
      dependsOn: ['track-health-data']
    },
    {
      id: 'suggest-wellness-activities',
      tool: 'recommendation_tool',
      params: { 
        health_insights: '{{health_insights}}' 
      },
      description: 'Suggest wellness activities based on analysis',
      dependsOn: ['analyze-health-patterns']
    },
    {
      id: 'monitor-goals',
      tool: 'goal_tracking_tool',
      params: { 
        wellness_activities: '{{wellness_activities}}' 
      },
      description: 'Monitor wellness goals',
      dependsOn: ['suggest-wellness-activities']
    }
  ]
};

// Learning and Education Process - Facilitates learning and education activities
export const learningEducationProcess: WorkflowDefinition = {
  id: 'learning-education-process',
  name: 'Learning and Education Process',
  description: 'Manages learning goals, educational resources, and progress tracking',
  steps: [
    {
      id: 'identify-learning-goal',
      tool: 'text_analysis_tool',
      params: { 
        user_input: '{{user_input}}' 
      },
      description: 'Identify user learning goal'
    },
    {
      id: 'find-resources',
      tool: 'search_tool',
      params: { 
        learning_goal: '{{learning_goal}}' 
      },
      description: 'Find educational resources',
      dependsOn: ['identify-learning-goal']
    },
    {
      id: 'create-study-plan',
      tool: 'planning_tool',
      params: { 
        resources: '{{resources}}' 
      },
      description: 'Create study plan',
      dependsOn: ['find-resources']
    },
    {
      id: 'track-progress',
      tool: 'analytics_engine_tool',
      params: { 
        study_plan: '{{study_plan}}' 
      },
      description: 'Track learning progress',
      dependsOn: ['create-study-plan']
    }
  ]
};

// Personal Finance Process - Manages personal finance and budgeting
export const personalFinanceProcess: WorkflowDefinition = {
  id: 'personal-finance-process',
  name: 'Personal Finance Process',
  description: 'Manages personal budgeting, expense tracking, and financial planning',
  steps: [
    {
      id: 'track-expenses',
      tool: 'finance_tracker_tool',
      params: { 
        expense_data: '{{expense_data}}' 
      },
      description: 'Track user expenses'
    },
    {
      id: 'analyze-spending',
      tool: 'data_analysis_tool',
      params: { 
        expense_summary: '{{expense_summary}}' 
      },
      description: 'Analyze spending patterns',
      dependsOn: ['track-expenses']
    },
    {
      id: 'generate-budget',
      tool: 'financial_calculator_tool',
      params: { 
        spending_patterns: '{{spending_patterns}}',
        income: '{{income}}'
      },
      description: 'Generate budget recommendations',
      dependsOn: ['analyze-spending']
    },
    {
      id: 'monitor-finances',
      tool: 'report_generator_tool',
      params: { 
        budget_recommendations: '{{budget_recommendations}}' 
      },
      description: 'Monitor finances and generate reports',
      dependsOn: ['generate-budget']
    }
  ]
};

// Information Management Process - Organizes and manages information
export const informationManagementProcess: WorkflowDefinition = {
  id: 'information-management-process',
  name: 'Information Management Process',
  description: 'Organizes, categorizes, and retrieves information based on user needs',
  steps: [
    {
      id: 'collect-information',
      tool: 'web_scraping_tool',
      params: { 
        search_query: '{{search_query}}' 
      },
      description: 'Collect information from web sources'
    },
    {
      id: 'organize-information',
      tool: 'data_organization_tool',
      params: { 
        raw_information: '{{raw_information}}' 
      },
      description: 'Organize collected information',
      dependsOn: ['collect-information']
    },
    {
      id: 'store-information',
      tool: 'memory_tool',
      params: { 
        organized_data: '{{organized_data}}' 
      },
      description: 'Store organized information',
      dependsOn: ['organize-information']
    },
    {
      id: 'retrieve-information',
      tool: 'memory_search_tool',
      params: { 
        query: '{{query}}' 
      },
      description: 'Retrieve stored information',
      dependsOn: ['store-information']
    }
  ]
};

// Define the data type for personal assistant processes
export interface PersonalAssistantData {
  userId: string;
  processType: 'personal-assistant' | 'health-wellness' | 'learning-education' | 'personal-finance' | 'information-management';
  inputData: Record<string, any>;
  timestamp: Date;
}