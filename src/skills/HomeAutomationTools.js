"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarSchedulerTool = exports.HealthTrackerTool = exports.FinanceTrackerTool = exports.MaintenanceSchedulerTool = exports.IoTDeviceControlTool = void 0;
const Logger_1 = require("../utils/Logger");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class IoTDeviceControlTool {
    constructor() {
        this.name = 'iot_device_control';
        this.description = '控制智能家居设备';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const scene = params.scene;
            const devices = params.devices;
            if (!operation) {
                return { success: false, error: 'operation is required (set_scene, turn_on, turn_off, adjust_temperature, etc.)' };
            }
            // 模拟IoT设备控制
            const deviceId = `iot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const timestamp = new Date().toISOString();
            // 存储设备状态变化
            const iotPath = path.join(__dirname, '../../data/iot');
            const filePath = path.join(iotPath, `${deviceId}.json`);
            try {
                await fs.mkdir(iotPath, { recursive: true });
            }
            catch (mkdirErr) {
                Logger_1.Logger.warn(`Could not create IoT directory: ${mkdirErr.message}`);
            }
            const deviceAction = {
                id: deviceId,
                operation,
                scene,
                devices,
                timestamp,
                status: 'executed'
            };
            await fs.writeFile(filePath, JSON.stringify(deviceAction, null, 2));
            Logger_1.Logger.info(`IoT device action executed: ${operation}`, { deviceId });
            return {
                success: true,
                data: {
                    deviceId,
                    operation,
                    message: `IoT device action "${operation}" executed successfully`,
                    affectedDevices: Object.keys(devices || {})
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error('IoT device control error', { error: error.message });
            return { success: false, error: `Failed to control IoT devices: ${error.message}` };
        }
    }
}
exports.IoTDeviceControlTool = IoTDeviceControlTool;
class MaintenanceSchedulerTool {
    constructor() {
        this.name = 'maintenance_scheduler';
        this.description = '家庭维护任务调度';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const equipment = params.equipment;
            const task = params.task;
            const scheduleDate = params.scheduleDate;
            const assignedTo = params.assignedTo;
            if (!operation || !equipment || !task) {
                return { success: false, error: 'operation, equipment, and task are required' };
            }
            // 模拟维护任务创建
            const ticketId = `maint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const timestamp = new Date().toISOString();
            // 存储维护任务
            const maintPath = path.join(__dirname, '../../data/maintenance');
            const filePath = path.join(maintPath, `${ticketId}.json`);
            try {
                await fs.mkdir(maintPath, { recursive: true });
            }
            catch (mkdirErr) {
                Logger_1.Logger.warn(`Could not create maintenance directory: ${mkdirErr.message}`);
            }
            const maintenanceTicket = {
                id: ticketId,
                operation,
                equipment,
                task,
                scheduleDate,
                assignedTo,
                createdDate: timestamp,
                status: 'scheduled',
                reminderDays: params.reminderDays
            };
            await fs.writeFile(filePath, JSON.stringify(maintenanceTicket, null, 2));
            Logger_1.Logger.info(`Maintenance task created: ${task} for ${equipment}`, { ticketId });
            return {
                success: true,
                data: {
                    ticketId,
                    task,
                    equipment,
                    scheduleDate,
                    message: `Maintenance task "${task}" for ${equipment} scheduled successfully`
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error('Maintenance scheduling error', { error: error.message });
            return { success: false, error: `Failed to schedule maintenance: ${error.message}` };
        }
    }
}
exports.MaintenanceSchedulerTool = MaintenanceSchedulerTool;
class FinanceTrackerTool {
    constructor() {
        this.name = 'finance_tracker';
        this.description = '家庭财务管理';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            if (!operation) {
                return { success: false, error: 'operation is required (record_transaction, categorize_expenses, schedule_payment, allocate_savings, generate_report)' };
            }
            // 根据不同操作执行相应功能
            switch (operation) {
                case 'record_transaction':
                    return await this.recordTransaction(params);
                case 'categorize_expenses':
                    return await this.categorizeExpenses(params);
                case 'schedule_payment':
                    return await this.schedulePayment(params);
                case 'allocate_savings':
                    return await this.allocateSavings(params);
                case 'generate_report':
                    return await this.generateReport(params);
                default:
                    return { success: false, error: 'Invalid operation. Use: record_transaction, categorize_expenses, schedule_payment, allocate_savings, generate_report' };
            }
        }
        catch (error) {
            Logger_1.Logger.error('Finance tracking error', { error: error.message });
            return { success: false, error: `Failed to manage finances: ${error.message}` };
        }
    }
    async recordTransaction(params) {
        const transactionId = `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const transaction = {
            id: transactionId,
            transactionType: params.transactionType,
            category: params.category,
            amount: params.amount,
            date: params.date,
            description: params.description,
            timestamp: new Date().toISOString()
        };
        // 存储交易记录
        const financePath = path.join(__dirname, '../../data/finance');
        const filePath = path.join(financePath, `${transactionId}.json`);
        try {
            await fs.mkdir(financePath, { recursive: true });
        }
        catch (mkdirErr) {
            Logger_1.Logger.warn(`Could not create finance directory: ${mkdirErr.message}`);
        }
        await fs.writeFile(filePath, JSON.stringify(transaction, null, 2));
        return {
            success: true,
            data: {
                transactionId,
                message: `Transaction recorded successfully`,
                amount: params.amount
            }
        };
    }
    async categorizeExpenses(params) {
        const categories = params.categories;
        const budgetLimits = params.budgetLimits;
        return {
            success: true,
            data: {
                categories,
                budgetLimits,
                message: `Expenses categorized with budget limits applied`
            }
        };
    }
    async schedulePayment(params) {
        const bills = params.bills;
        const paymentId = `paymt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
            success: true,
            data: {
                paymentId,
                scheduledPayments: bills,
                message: `${bills.length} bills scheduled for automatic payment`
            }
        };
    }
    async allocateSavings(params) {
        const allocation = params.allocation;
        return {
            success: true,
            data: {
                allocation,
                message: `Savings allocated according to specified percentages`
            }
        };
    }
    async generateReport(params) {
        const reportType = params.reportType;
        const reportId = `rpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const mockReport = {
            id: reportId,
            type: reportType,
            period: 'Monthly',
            income: 8500,
            expenses: 6200,
            savings: 1800,
            netFlow: 500,
            categoryBreakdown: {
                housing: 2100,
                food: 850,
                transportation: 650,
                entertainment: 420,
                utilities: 380
            },
            budgetAdherence: 0.94,
            recommendations: [
                'Reduce dining out expenses by 15%',
                'Consider refinancing mortgage to lower rate',
                'Increase emergency fund contribution'
            ]
        };
        return {
            success: true,
            data: {
                reportId,
                report: mockReport,
                message: `Financial report generated`
            }
        };
    }
}
exports.FinanceTrackerTool = FinanceTrackerTool;
class HealthTrackerTool {
    constructor() {
        this.name = 'health_tracker';
        this.description = '健康与健身跟踪';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            if (!operation) {
                return { success: false, error: 'operation is required (create_goal, schedule_reminder, generate_meal_plan, track_metrics, schedule_appointment)' };
            }
            switch (operation) {
                case 'create_goal':
                    return await this.createGoal(params);
                case 'schedule_reminder':
                    return await this.scheduleReminder(params);
                case 'generate_meal_plan':
                    return await this.generateMealPlan(params);
                case 'track_metrics':
                    return await this.trackMetrics(params);
                case 'schedule_appointment':
                    return await this.scheduleAppointment(params);
                default:
                    return { success: false, error: 'Invalid operation. Use: create_goal, schedule_reminder, generate_meal_plan, track_metrics, schedule_appointment' };
            }
        }
        catch (error) {
            Logger_1.Logger.error('Health tracking error', { error: error.message });
            return { success: false, error: `Failed to track health: ${error.message}` };
        }
    }
    async createGoal(params) {
        const goalId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const goal = {
            id: goalId,
            goalType: params.goalType,
            target: params.target,
            timeframe: params.timeframe,
            owner: params.owner,
            status: 'active',
            createdDate: new Date().toISOString()
        };
        return {
            success: true,
            data: {
                goalId,
                goal,
                message: `Health goal created successfully`
            }
        };
    }
    async scheduleReminder(params) {
        const reminderId = `rem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
            success: true,
            data: {
                reminderId,
                reminderType: params.reminderType,
                frequency: params.frequency,
                time: params.time,
                message: `Reminder scheduled: ${params.reminderType}`
            }
        };
    }
    async generateMealPlan(params) {
        const mealPlanId = `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const mockMealPlan = {
            id: mealPlanId,
            weekOf: new Date().toISOString().split('T')[0],
            meals: {
                monday: { breakfast: '燕麦粥配水果', lunch: '鸡胸肉沙拉', dinner: '烤鱼配蔬菜' },
                tuesday: { breakfast: '全麦吐司配鸡蛋', lunch: '三文鱼饭', dinner: '瘦肉炒面' },
                wednesday: { breakfast: '酸奶配坚果', lunch: '豆腐汤配米饭', dinner: '蒸蛋羹配青菜' },
                thursday: { breakfast: '豆浆配包子', lunch: '牛肉面', dinner: '白切鸡配时蔬' },
                friday: { breakfast: '小米粥', lunch: '素食炒饭', dinner: '清蒸鲈鱼' },
                saturday: { breakfast: '煎饼果子', lunch: '火锅', dinner: '烧烤' },
                sunday: { breakfast: '西式早餐', lunch: '自制便当', dinner: '家常小炒' }
            },
            nutritionSummary: params.nutritionGoals,
            substitutions: params.allergies ? ['根据过敏原调整食材'] : []
        };
        return {
            success: true,
            data: {
                mealPlanId,
                mealPlan: mockMealPlan,
                message: `Weekly meal plan generated`
            }
        };
    }
    async trackMetrics(params) {
        const metrics = params.metrics;
        const trackingId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
            success: true,
            data: {
                trackingId,
                metrics,
                message: `Tracking initiated for: ${metrics.join(', ')}`
            }
        };
    }
    async scheduleAppointment(params) {
        const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
            success: true,
            data: {
                appointmentId,
                appointmentType: params.appointmentType,
                participants: params.participants,
                scheduleWindow: params.scheduleWindow,
                reminders: params.reminders,
                message: `Appointment scheduled: ${params.appointmentType}`
            }
        };
    }
}
exports.HealthTrackerTool = HealthTrackerTool;
class CalendarSchedulerTool {
    constructor() {
        this.name = 'calendar_scheduler';
        this.description = '日历和活动调度';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            if (!operation) {
                return { success: false, error: 'operation is required (create_event, plan_trip, manage_schedule, generate_shopping_list)' };
            }
            switch (operation) {
                case 'create_event':
                    return await this.createEvent(params);
                case 'plan_trip':
                    return await this.planTrip(params);
                case 'manage_schedule':
                    return await this.manageSchedule(params);
                case 'generate_shopping_list':
                    return await this.generateShoppingList(params);
                default:
                    return { success: false, error: 'Invalid operation. Use: create_event, plan_trip, manage_schedule, generate_shopping_list' };
            }
        }
        catch (error) {
            Logger_1.Logger.error('Calendar scheduling error', { error: error.message });
            return { success: false, error: `Failed to schedule event: ${error.message}` };
        }
    }
    async createEvent(params) {
        const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const event = {
            id: eventId,
            eventType: params.eventType,
            date: params.date,
            guests: params.guests,
            activities: params.activities,
            shoppingList: params.shoppingList,
            status: 'confirmed',
            createdDate: new Date().toISOString()
        };
        return {
            success: true,
            data: {
                eventId,
                event,
                message: `Event created: ${params.eventType}`
            }
        };
    }
    async planTrip(params) {
        const tripId = `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const mockItinerary = {
            id: tripId,
            destination: params.destination,
            dates: params.dates,
            travelers: params.travelers,
            accommodations: params.accommodations,
            activities: params.activities,
            budgetEstimate: 8500,
            packingList: ['clothing', 'toiletries', 'electronics', 'documents'],
            travelTips: ['book_flights_early', 'check_weather', 'notify_bank']
        };
        return {
            success: true,
            data: {
                tripId,
                itinerary: mockItinerary,
                message: `Vacation planned to ${params.destination}`
            }
        };
    }
    async manageSchedule(params) {
        const scheduleId = `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
            success: true,
            data: {
                scheduleId,
                person: params.person,
                activities: params.activities,
                message: `Schedule managed for: ${params.person}`
            }
        };
    }
    async generateShoppingList(params) {
        const listId = `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const mockShoppingList = {
            id: listId,
            categories: params.categories,
            items: {
                groceries: ['牛奶', '面包', '鸡蛋', '水果', '蔬菜', '肉类'],
                household_supplies: ['洗涤剂', '纸巾', '垃圾袋'],
                personal_care: ['洗发水', '牙膏', '护肤品']
            },
            dietaryNotes: params.dietary_restrictions,
            estimatedCost: 450
        };
        return {
            success: true,
            data: {
                listId,
                shoppingList: mockShoppingList,
                message: `Shopping list generated with ${mockShoppingList.categories.length} categories`
            }
        };
    }
}
exports.CalendarSchedulerTool = CalendarSchedulerTool;
