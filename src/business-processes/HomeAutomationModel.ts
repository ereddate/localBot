/**
 * 家庭自动化业务流程模型
 * 包含智能家居控制、家庭维护、家庭财务管理、健康监测等流程
 */

import { WorkflowDefinition } from '../tasks/WorkflowEngine';
import { Tool } from '../types';

export interface HomeAutomationData {
  deviceId: string;
  scheduleTime: string;
  maintenanceTask: string;
  energyConsumption: number;
}

// 智能家居控制流程
export const smartHomeControlProcess: WorkflowDefinition = {
  id: 'smart-home-control-process',
  name: '智能家居控制流程',
  description: '自动化控制家庭设备，包括照明、温度、安防等',
  steps: [
    {
      id: 'environmental-monitoring',
      tool: 'iot_sensor_integration',
      params: {
        operation: 'monitor_environment',
        sensors: ['temperature', 'humidity', 'air_quality', 'light_levels', 'occupancy'],
        frequency: 'continuous',
        thresholdAlerts: true
      },
      description: '环境监测'
    },
    {
      id: 'occupancy-detection',
      tool: 'iot_sensor_integration',
      params: {
        operation: 'detect_occupancy',
        detectionMethods: ['motion_sensors', 'mobile_devices', 'voice_commands'],
        roomWiseTracking: true,
        guestDetection: true
      },
      description: '占用检测',
      dependsOn: ['environmental-monitoring']
    },
    {
      id: 'morning-routine',
      tool: 'iot_device_control',
      params: {
        operation: 'set_scene',
        scene: 'morning',
        devices: {
          lights: { action: 'turn_on', brightness: 80 },
          thermostat: { action: 'adjust_temperature', target: 22 },
          curtains: { action: 'open' },
          coffeeMaker: { action: 'start_brewing' },
          news: { action: 'play', source: 'preferred_news_channel' }
        },
        basedOn: {
          weather: '{{environmental-monitoring.result.weather_data}}',
          occupancy: '{{occupancy-detection.result.current_occupancy}}',
          calendar: '{{calendar_integration.result.morning_schedule}}'
        }
      },
      description: '早晨例行公事',
      dependsOn: ['occupancy-detection']
    },
    {
      id: 'energy-optimization',
      tool: 'analytics_engine',
      params: {
        operation: 'optimize_energy_consumption',
        currentUsage: '{{environmental-monitoring.result.energy_usage}}',
        peakHours: '{{utility_company.result.peak_hours}}',
        renewableEnergy: '{{solar_panels.result.production}}',
        costOptimization: true
      },
      description: '能源优化',
      dependsOn: ['morning-routine']
    },
    {
      id: 'away-mode',
      tool: 'iot_device_control',
      params: {
        operation: 'set_scene',
        scene: 'away',
        devices: {
          lights: { action: 'turn_off' },
          thermostat: { action: 'eco_mode' },
          security: { action: 'activate' },
          powerOutlets: { action: 'power_save_mode' }
        },
        basedOn: {
          duration: '{{calendar_integration.result.absence_duration}}',
          energySavingsTarget: '{{energy-optimization.result.savings_target}}'
        }
      },
      description: '外出模式',
      dependsOn: ['energy-optimization']
    },
    {
      id: 'security-monitoring',
      tool: 'iot_device_control',
      params: {
        operation: 'continuous_security_monitoring',
        devices: ['cameras', 'motion_detectors', 'door_sensors', 'window_sensors'],
        alertRecipients: ['homeowner', 'trusted_contacts'],
        emergencyServices: true
      },
      description: '安全监控',
      dependsOn: ['away-mode']
    },
    {
      id: 'evening-relax',
      tool: 'iot_device_control',
      params: {
        operation: 'set_scene',
        scene: 'evening',
        devices: {
          lights: { action: 'warm_light', brightness: 40 },
          music: { action: 'play', genre: 'relaxing' },
          thermostat: { action: 'adjust_temperature', target: 24 },
          aromatherapy: { action: 'activate', scent: 'lavender' }
        },
        basedOn: {
          familyMood: '{{mood_detection.result.family_wellbeing}}',
          dayStressLevel: '{{calendar_integration.result.daily_activities.stress_level}}'
        }
      },
      description: '晚间放松模式',
      dependsOn: ['security-monitoring']
    },
    {
      id: 'bedtime',
      tool: 'iot_device_control',
      params: {
        operation: 'set_scene',
        scene: 'bedtime',
        devices: {
          lights: { action: 'turn_off' },
          thermostat: { action: 'night_mode', target: 20 },
          security: { action: 'activate_night' },
          airPurifier: { action: 'activate' },
          whiteNoise: { action: 'play', sound: 'rain' }
        },
        basedOn: {
          sleepSchedule: '{{health_monitoring.result.sleep_patterns}}',
          familyMembers: '{{occupancy-detection.result.sleeping_occupants}}'
        }
      },
      description: '就寝模式',
      dependsOn: ['evening-relax']
    },
    {
      id: 'sleep-monitoring',
      tool: 'health_monitoring',
      params: {
        operation: 'monitor_sleep_quality',
        devices: ['sleep_trackers', 'environmental_sensors'],
        metrics: ['sleep_duration', 'sleep_quality', 'room_conditions'],
        alerts: ['sleep_disturbances', 'environmental_issues']
      },
      description: '睡眠监测',
      dependsOn: ['bedtime']
    },
    {
      id: 'weather-adaptive-control',
      tool: 'iot_device_control',
      params: {
        operation: 'adaptive_home_control',
        weatherData: '{{weather_api.result.current_weather}}',
        forecast: '{{weather_api.result.forecast}}',
        actions: {
          beforeStorm: { action: 'secure_windows', irrigation: 'pause' },
          highPollution: { action: 'activate_air_purifiers', ventilation: 'reduce' },
          extremeTemperature: { action: 'optimize_insulation', hvac: 'adjust' }
        }
      },
      description: '天气自适应控制',
      dependsOn: ['sleep-monitoring']
    },
    {
      id: 'maintenance-alerts',
      tool: 'iot_device_control',
      params: {
        operation: 'predictive_maintenance',
        devices: '{{iot_inventory.result.all_connected_devices}}',
        maintenanceSchedule: true,
        failurePrediction: true,
        serviceProviderNotification: true
      },
      description: '维护提醒',
      dependsOn: ['weather-adaptive-control']
    }
  ]
};

// 家庭维护流程
export const homeMaintenanceProcess: WorkflowDefinition = {
  id: 'home-maintenance-process',
  name: '家庭维护流程',
  description: '定期家庭设备维护和保养',
  steps: [
    {
      id: 'heating-check',
      tool: 'maintenance_scheduler',
      params: {
        operation: 'create_ticket',
        equipment: 'heating_system',
        task: 'annual_inspection',
        scheduleDate: '{{next_year}}-10-01',
        assignedTo: 'HVAC_contractor'
      },
      description: '供暖系统年度检查',
      dependsOn: []
    },
    {
      id: 'air-filter-replacement',
      tool: 'maintenance_scheduler',
      params: {
        operation: 'create_ticket',
        equipment: 'air_conditioner',
        task: 'filter_replacement',
        scheduleDate: '{{current_date_plus_months_3}}',
        assignedTo: 'homeowner',
        reminderDays: 7
      },
      description: '更换空调滤芯',
      dependsOn: []
    },
    {
      id: 'garden-maintenance',
      tool: 'maintenance_scheduler',
      params: {
        operation: 'create_ticket',
        equipment: 'garden',
        task: 'seasonal_care',
        scheduleDate: '{{current_season_change}}',
        assignedTo: 'landscaper',
        description: '季节性花园护理'
      },
      description: '花园季节性维护',
      dependsOn: []
    },
    {
      id: 'security-system-check',
      tool: 'maintenance_scheduler',
      params: {
        operation: 'create_ticket',
        equipment: 'security_system',
        task: 'monthly_test',
        scheduleDate: '{{every_month}}',
        assignedTo: 'security_service',
        description: '月度安全系统检测'
      },
      description: '安全系统月度检测',
      dependsOn: []
    }
  ]
};

// 家庭财务管理流程
export const homeFinanceProcess: WorkflowDefinition = {
  id: 'home-finance-process',
  name: '家庭财务管理流程',
  description: '家庭收入支出管理、预算规划、账单支付',
  steps: [
    {
      id: 'income-tracking',
      tool: 'finance_tracker',
      params: {
        operation: 'record_transaction',
        transactionType: 'income',
        category: 'salary',
        amount: '{{monthly_income}}',
        date: '{{month_start}}',
        description: '月薪到账'
      },
      description: '收入跟踪',
      dependsOn: []
    },
    {
      id: 'expense-categorization',
      tool: 'finance_tracker',
      params: {
        operation: 'categorize_expenses',
        categories: ['housing', 'food', 'transportation', 'entertainment', 'utilities'],
        budgetLimits: {
          housing: 0.35,
          food: 0.15,
          transportation: 0.12,
          entertainment: 0.08,
          utilities: 0.08
        }
      },
      description: '支出分类和预算',
      dependsOn: []
    },
    {
      id: 'bill-payment',
      tool: 'finance_tracker',
      params: {
        operation: 'schedule_payment',
        bills: [
          { name: 'mortgage', amount: '{{monthly_mortgage}}', dueDate: '01', autoPay: true },
          { name: 'electricity', amount: '{{monthly_average}}', dueDate: '15', autoPay: true },
          { name: 'internet', amount: '{{monthly_fee}}', dueDate: '05', autoPay: true }
        ]
      },
      description: '账单自动支付',
      dependsOn: []
    },
    {
      id: 'savings-allocation',
      tool: 'finance_tracker',
      params: {
        operation: 'allocate_savings',
        allocation: {
          emergency_fund: 0.2,
          retirement: 0.15,
          vacation: 0.1,
          investments: 0.1
        }
      },
      description: '储蓄分配',
      dependsOn: []
    },
    {
      id: 'financial-report',
      tool: 'finance_tracker',
      params: {
        operation: 'generate_report',
        reportType: 'monthly_summary',
        recipients: ['primary_account_holder'],
        schedule: 'monthly'
      },
      description: '财务月度报告',
      dependsOn: []
    }
  ]
};

// 健康与健身流程
export const healthFitnessProcess: WorkflowDefinition = {
  id: 'health-fitness-process',
  name: '健康与健身流程',
  description: '家庭成员健康监测、锻炼计划、营养管理',
  steps: [
    {
      id: 'fitness-goal-setting',
      tool: 'health_tracker',
      params: {
        operation: 'create_goal',
        goalType: 'fitness',
        target: 'weight_loss',
        value: 5, // kg
        timeframe: '3_months',
        owner: '{{family_member}}'
      },
      description: '设定健身目标',
      dependsOn: []
    },
    {
      id: 'exercise-reminder',
      tool: 'health_tracker',
      params: {
        operation: 'schedule_reminder',
        reminderType: 'exercise',
        frequency: 'daily',
        time: '07:00',
        duration: 30,
        activity: 'cardio'
      },
      description: '运动提醒',
      dependsOn: []
    },
    {
      id: 'meal-planning',
      tool: 'health_tracker',
      params: {
        operation: 'generate_meal_plan',
        dietPreference: 'balanced',
        familySize: '{{household_size}}',
        allergies: '{{family_allergies}}',
        nutritionGoals: {
          calories: '{{per_person_calories}}',
          protein: 0.15,
          carbs: 0.55,
          fats: 0.30
        }
      },
      description: '营养餐计划',
      dependsOn: []
    },
    {
      id: 'health-monitoring',
      tool: 'health_tracker',
      params: {
        operation: 'track_metrics',
        metrics: ['steps', 'sleep_hours', 'heart_rate', 'water_intake'],
        frequency: 'daily',
        recipients: ['family_members']
      },
      description: '健康指标监测',
      dependsOn: []
    },
    {
      id: 'medical-appointment',
      tool: 'health_tracker',
      params: {
        operation: 'schedule_appointment',
        appointmentType: 'annual_checkup',
        participants: ['family_members'],
        scheduleWindow: 'next_3_months',
        reminders: [14, 7, 1] // days before
      },
      description: '医疗预约安排',
      dependsOn: []
    }
  ]
};

// 家庭活动组织流程
export const homeActivityProcess: WorkflowDefinition = {
  id: 'home-activity-process',
  name: '家庭活动组织流程',
  description: '家庭聚会、假期计划、孩子活动安排',
  steps: [
    {
      id: 'event-planning',
      tool: 'calendar_scheduler',
      params: {
        operation: 'create_event',
        eventType: 'family_gathering',
        date: '{{preferred_date}}',
        guests: ['extended_family'],
        activities: ['games', 'dinner', 'movie'],
        shoppingList: ['groceries', 'decorations', 'gifts']
      },
      description: '家庭活动策划',
      dependsOn: []
    },
    {
      id: 'vacation-planning',
      tool: 'calendar_scheduler',
      params: {
        operation: 'plan_trip',
        destination: '{{selected_destination}}',
        dates: ['{{start_date}}', '{{end_date}}'],
        travelers: ['family_members'],
        accommodations: 'hotel_or_rental',
        activities: ['sightseeing', 'outdoor_activities', 'cultural_experiences']
      },
      description: '假期规划',
      dependsOn: []
    },
    {
      id: 'child-schedule',
      tool: 'calendar_scheduler',
      params: {
        operation: 'manage_schedule',
        person: 'children',
        activities: {
          school: 'weekdays_0800_to_1500',
          homework: 'weekdays_1600_to_1800',
          extracurricular: ['sports', 'music', 'art'],
          bedtime: 'weekdays_2100_weekends_2200'
        }
      },
      description: '儿童日程管理',
      dependsOn: []
    },
    {
      id: 'shopping-list',
      tool: 'task_manager',
      params: {
        operation: 'generate_shopping_list',
        categories: ['groceries', 'household_supplies', 'personal_care'],
        frequency: 'weekly',
        dietary_restrictions: ['{{family_dietary_needs}}']
      },
      description: '购物清单生成',
      dependsOn: []
    }
  ]
};

// 导出所有家庭自动化流程
export const HomeAutomationProcesses = {
  smartHomeControlProcess,
  homeMaintenanceProcess,
  homeFinanceProcess,
  healthFitnessProcess,
  homeActivityProcess
};