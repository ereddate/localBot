"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeTrackingTool = exports.ProjectManagementTool = void 0;
const Logger_1 = require("../utils/Logger");
class ProjectManagementTool {
    constructor() {
        this.name = 'project_management';
        this.description = 'Project tracking and management operations';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const projectId = params.projectId;
            const projectName = params.projectName;
            const taskData = params.taskData;
            const teamMember = params.teamMember;
            if (!operation) {
                return { success: false, error: 'operation is required (create_project, update_project, assign_task, track_progress, generate_report)' };
            }
            switch (operation.toLowerCase()) {
                case 'create_project':
                    if (!projectName) {
                        return { success: false, error: 'projectName is required for create_project operation' };
                    }
                    return await this.createProject(projectName, taskData);
                case 'update_project':
                    if (!projectId) {
                        return { success: false, error: 'projectId is required for update_project operation' };
                    }
                    return await this.updateProject(projectId, taskData);
                case 'assign_task':
                    if (!projectId || !taskData) {
                        return { success: false, error: 'projectId and taskData are required for assign_task operation' };
                    }
                    return await this.assignTask(projectId, taskData);
                case 'track_progress':
                    if (!projectId) {
                        return { success: false, error: 'projectId is required for track_progress operation' };
                    }
                    return await this.trackProgress(projectId);
                case 'generate_report':
                    if (!projectId) {
                        return { success: false, error: 'projectId is required for generate_report operation' };
                    }
                    return await this.generateProjectReport(projectId);
                default:
                    return { success: false, error: 'Invalid operation. Use: create_project, update_project, assign_task, track_progress, generate_report' };
            }
        }
        catch (error) {
            Logger_1.Logger.error(`Project management operation failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
    async createProject(projectName, projectDetails) {
        const projectId = `proj_${Date.now()}`;
        const mockProject = {
            id: projectId,
            name: projectName,
            status: 'Planning',
            startDate: new Date().toISOString(),
            owner: 'Project Manager',
            team: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
            budget: projectDetails?.budget || 50000,
            timeline: projectDetails?.timeline || '3 months',
            milestones: [
                { id: 'm1', name: 'Project Kickoff', dueDate: '2023-08-01', completed: true },
                { id: 'm2', name: 'Requirements Gathering', dueDate: '2023-08-15', completed: false },
                { id: 'm3', name: 'Design Phase', dueDate: '2023-09-01', completed: false },
                { id: 'm4', name: 'Development', dueDate: '2023-10-15', completed: false },
                { id: 'm5', name: 'Testing', dueDate: '2023-11-01', completed: false },
                { id: 'm6', name: 'Deployment', dueDate: '2023-11-15', completed: false }
            ],
            tasks: [],
            progress: 5 // percentage
        };
        return {
            success: true,
            data: {
                project: mockProject,
                message: 'Project created successfully'
            }
        };
    }
    async updateProject(projectId, updates) {
        return {
            success: true,
            data: {
                projectId,
                updates,
                timestamp: new Date().toISOString(),
                message: 'Project updated successfully'
            }
        };
    }
    async assignTask(projectId, taskData) {
        const taskId = `task_${Date.now()}`;
        const mockTask = {
            id: taskId,
            projectId,
            title: taskData.title || 'New Task',
            description: taskData.description || 'Task description',
            assignedTo: taskData.assignedTo || 'Unassigned',
            status: 'Not Started',
            priority: taskData.priority || 'Medium',
            estimatedHours: taskData.estimatedHours || 8,
            dueDate: taskData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            createdAt: new Date().toISOString()
        };
        return {
            success: true,
            data: {
                task: mockTask,
                message: 'Task assigned successfully'
            }
        };
    }
    async trackProgress(projectId) {
        const mockProgress = {
            projectId,
            overallProgress: 25, // percentage
            milestoneProgress: {
                'Project Kickoff': 100,
                'Requirements Gathering': 60,
                'Design Phase': 0,
                'Development': 0,
                'Testing': 0,
                'Deployment': 0
            },
            teamVelocity: 8.5, // story points per day
            burndownChart: [
                { day: 1, remaining: 100 },
                { day: 5, remaining: 85 },
                { day: 10, remaining: 70 },
                { day: 15, remaining: 55 },
                { day: 20, remaining: 40 }
            ],
            risks: [
                { id: 'r1', description: 'Potential delay in design phase', impact: 'Medium', probability: 0.3 },
                { id: 'r2', description: 'Resource constraint in testing', impact: 'High', probability: 0.2 }
            ],
            nextMilestones: [
                { name: 'Requirements Gathering', dueDate: '2023-08-15', progress: 60 },
                { name: 'Design Phase', dueDate: '2023-09-01', progress: 0 }
            ]
        };
        return {
            success: true,
            data: {
                progress: mockProgress,
                message: 'Progress tracked successfully'
            }
        };
    }
    async generateProjectReport(projectId) {
        const mockReport = {
            projectId,
            reportType: 'Weekly Status Report',
            reportDate: new Date().toISOString(),
            executiveSummary: 'Project is progressing according to plan with minor delays in requirements gathering. Team is working to mitigate risks.',
            keyMetrics: {
                overallCompletion: 25,
                budgetUtilization: 22,
                timelineAdherence: 95,
                teamProductivity: 8.5
            },
            accomplishments: [
                'Project kickoff completed successfully',
                'Initial stakeholder interviews conducted',
                'Technical requirements documented'
            ],
            upcomingPriorities: [
                'Complete requirements sign-off',
                'Begin design phase',
                'Mitigate identified risks'
            ],
            risksAndIssues: [
                'Requirements gathering slightly behind schedule',
                'Dependency on external vendor for technical specifications'
            ],
            resourceAllocation: {
                teamMembers: 3,
                allocatedHours: 120,
                utilizationRate: 0.78
            },
            recommendations: [
                'Increase focus on requirements gathering to get back on track',
                'Schedule additional stakeholder meetings to expedite sign-offs'
            ]
        };
        return {
            success: true,
            data: {
                report: mockReport,
                message: 'Project report generated successfully'
            }
        };
    }
}
exports.ProjectManagementTool = ProjectManagementTool;
class TimeTrackingTool {
    constructor() {
        this.name = 'time_tracking';
        this.description = 'Employee time tracking and management';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const employeeId = params.employeeId;
            const projectId = params.projectId;
            const startTime = params.startTime;
            const endTime = params.endTime;
            const activityDescription = params.activityDescription;
            if (!operation) {
                return { success: false, error: 'operation is required (start_timer, stop_timer, log_time, generate_timesheet, analyze_productivity)' };
            }
            switch (operation.toLowerCase()) {
                case 'start_timer':
                    if (!employeeId || !activityDescription) {
                        return { success: false, error: 'employeeId and activityDescription are required for start_timer operation' };
                    }
                    return await this.startTimer(employeeId, activityDescription, projectId);
                case 'stop_timer':
                    if (!employeeId) {
                        return { success: false, error: 'employeeId is required for stop_timer operation' };
                    }
                    return await this.stopTimer(employeeId);
                case 'log_time':
                    if (!employeeId || !startTime || !endTime || !activityDescription) {
                        return { success: false, error: 'employeeId, startTime, endTime, and activityDescription are required for log_time operation' };
                    }
                    return await this.logTime(employeeId, startTime, endTime, activityDescription, projectId);
                case 'generate_timesheet':
                    if (!employeeId) {
                        return { success: false, error: 'employeeId is required for generate_timesheet operation' };
                    }
                    return await this.generateTimesheet(employeeId, params.period);
                case 'analyze_productivity':
                    if (!employeeId) {
                        return { success: false, error: 'employeeId is required for analyze_productivity operation' };
                    }
                    return await this.analyzeProductivity(employeeId, params.period);
                default:
                    return { success: false, error: 'Invalid operation. Use: start_timer, stop_timer, log_time, generate_timesheet, analyze_productivity' };
            }
        }
        catch (error) {
            Logger_1.Logger.error(`Time tracking operation failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
    async startTimer(employeeId, activity, projectId) {
        const timerId = `timer_${Date.now()}`;
        return {
            success: true,
            data: {
                timerId,
                employeeId,
                activity,
                projectId,
                startTime: new Date().toISOString(),
                message: 'Timer started successfully'
            }
        };
    }
    async stopTimer(employeeId) {
        return {
            success: true,
            data: {
                employeeId,
                stopTime: new Date().toISOString(),
                message: 'Timer stopped successfully'
            }
        };
    }
    async logTime(employeeId, startTime, endTime, activity, projectId) {
        // Calculate duration in hours
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const durationMs = end - start;
        const durationHours = durationMs / (1000 * 60 * 60);
        const logId = `log_${Date.now()}`;
        return {
            success: true,
            data: {
                logId,
                employeeId,
                activity,
                projectId,
                startTime,
                endTime,
                durationHours: parseFloat(durationHours.toFixed(2)),
                message: 'Time logged successfully'
            }
        };
    }
    async generateTimesheet(employeeId, period) {
        const mockTimesheet = {
            employeeId,
            period: period || 'Week of 2023-07-10 to 2023-07-16',
            totalHours: 42.5,
            billableHours: 38.0,
            nonBillableHours: 4.5,
            dailyBreakdown: [
                { day: 'Monday', date: '2023-07-10', hours: 8.5, activities: ['Project Alpha', 'Team Meeting'] },
                { day: 'Tuesday', date: '2023-07-11', hours: 8.0, activities: ['Project Alpha', 'Client Call'] },
                { day: 'Wednesday', date: '2023-07-12', hours: 9.0, activities: ['Project Alpha', 'Research'] },
                { day: 'Thursday', date: '2023-07-13', hours: 8.5, activities: ['Project Alpha', 'Documentation'] },
                { day: 'Friday', date: '2023-07-14', hours: 8.5, activities: ['Project Alpha', 'Review'] }
            ],
            projects: [
                { id: 'proj_alpha', name: 'Project Alpha', hours: 38.0, percentage: 89.4 },
                { id: 'admin', name: 'Administrative', hours: 4.5, percentage: 10.6 }
            ],
            approved: false,
            submittedDate: '2023-07-16T10:30:00Z'
        };
        return {
            success: true,
            data: {
                timesheet: mockTimesheet,
                message: 'Timesheet generated successfully'
            }
        };
    }
    async analyzeProductivity(employeeId, period) {
        const mockAnalysis = {
            employeeId,
            period: period || 'Last 30 Days',
            productivityScore: 8.2, // Scale 1-10
            metrics: {
                totalHoursLogged: 165,
                billableHours: 148,
                utilizationRate: 89.7,
                focusedWork: 72.3, // Percentage of time on primary tasks
                collaborationTime: 27.7 // Percentage of time on collaborative tasks
            },
            efficiencyRatings: {
                morning: 8.5,
                afternoon: 7.8,
                weekDayAvg: 8.2,
                monthlyTrend: 'Increasing'
            },
            topActivities: [
                { activity: 'Project Development', hours: 95.5, percentage: 57.9 },
                { activity: 'Meetings', hours: 32.0, percentage: 19.4 },
                { activity: 'Documentation', hours: 20.5, percentage: 12.4 },
                { activity: 'Learning', hours: 17.0, percentage: 10.3 }
            ],
            recommendations: [
                'Schedule deep work during peak productivity hours (morning)',
                'Reduce meeting frequency to improve focused work time',
                'Consider redistributing workload to maintain consistent productivity'
            ],
            comparisons: {
                vsTeamAvg: 1.2, // 1.2 points above team average
                vsPreviousPeriod: 0.3 // Improvement from last period
            }
        };
        return {
            success: true,
            data: {
                analysis: mockAnalysis,
                message: 'Productivity analysis completed successfully'
            }
        };
    }
}
exports.TimeTrackingTool = TimeTrackingTool;
