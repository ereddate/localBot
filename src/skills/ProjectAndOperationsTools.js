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
exports.WorkflowSystemTool = exports.QualityManagementTool = exports.ProjectManagementToolExtended = exports.TimeTrackingToolExtended = void 0;
const Logger_1 = require("../utils/Logger");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class TimeTrackingToolExtended {
    constructor() {
        this.name = 'time_tracking';
        this.description = 'Extended time tracking operations';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const userId = params.userId;
            const projectId = params.projectId;
            const taskId = params.taskId;
            const hours = params.hours;
            const date = params.date || new Date().toISOString().split('T')[0];
            if (!operation) {
                return { success: false, error: 'Operation is required (log_time, get_time_report, approve_timesheet, update_time_entry)' };
            }
            // Create time tracking directory if it doesn't exist
            const timePath = path.join(__dirname, '../../data/time_tracking');
            try {
                await fs.mkdir(timePath, { recursive: true });
            }
            catch (mkdirErr) {
                Logger_1.Logger.warn(`Could not create time tracking directory: ${mkdirErr.message}`);
            }
            const timeLogFile = path.join(timePath, 'time_log.json');
            let timeLog = [];
            // Load existing time log
            try {
                const fileContent = await fs.readFile(timeLogFile, 'utf8');
                timeLog = JSON.parse(fileContent);
            }
            catch (err) {
                // File doesn't exist, start with empty array
                timeLog = [];
            }
            switch (operation.toLowerCase()) {
                case 'log_time':
                    if (!userId) {
                        return { success: false, error: 'User ID is required' };
                    }
                    if (hours === undefined || hours <= 0) {
                        return { success: false, error: 'Valid hours amount is required' };
                    }
                    const timeEntry = {
                        id: `time_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        userId,
                        projectId: projectId || 'unassigned',
                        taskId: taskId || 'general',
                        hours,
                        date,
                        description: params.description || 'Time logged',
                        status: 'pending', // Initially pending approval
                        loggedAt: new Date().toISOString()
                    };
                    timeLog.push(timeEntry);
                    await fs.writeFile(timeLogFile, JSON.stringify(timeLog, null, 2));
                    Logger_1.Logger.info(`Time logged`, { entryId: timeEntry.id, userId, hours });
                    return {
                        success: true,
                        data: {
                            entryId: timeEntry.id,
                            message: `Logged ${hours} hours for user ${userId}`
                        }
                    };
                case 'get_time_report':
                    // Filter time entries by user, project, or date range
                    let filteredEntries = timeLog;
                    if (userId) {
                        filteredEntries = filteredEntries.filter(entry => entry.userId === userId);
                    }
                    if (projectId) {
                        filteredEntries = filteredEntries.filter(entry => entry.projectId === projectId);
                    }
                    if (params.startDate && params.endDate) {
                        const startDate = new Date(params.startDate);
                        const endDate = new Date(params.endDate);
                        filteredEntries = filteredEntries.filter(entry => {
                            const entryDate = new Date(entry.date);
                            return entryDate >= startDate && entryDate <= endDate;
                        });
                    }
                    const totalTime = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);
                    Logger_1.Logger.info(`Time report generated`, {
                        userId,
                        projectId,
                        entryCount: filteredEntries.length,
                        totalTime
                    });
                    return {
                        success: true,
                        data: {
                            entries: filteredEntries,
                            totalCount: filteredEntries.length,
                            totalTime,
                            period: {
                                startDate: params.startDate || 'N/A',
                                endDate: params.endDate || 'N/A'
                            }
                        }
                    };
                case 'approve_timesheet':
                    if (!params.entryId) {
                        return { success: false, error: 'Entry ID is required' };
                    }
                    const entryIndex = timeLog.findIndex(entry => entry.id === params.entryId);
                    if (entryIndex === -1) {
                        return { success: false, error: `Time entry with ID ${params.entryId} not found` };
                    }
                    timeLog[entryIndex].status = 'approved';
                    timeLog[entryIndex].approvedAt = new Date().toISOString();
                    timeLog[entryIndex].approvedBy = params.approverId || 'system';
                    await fs.writeFile(timeLogFile, JSON.stringify(timeLog, null, 2));
                    Logger_1.Logger.info(`Timesheet approved`, { entryId: params.entryId });
                    return {
                        success: true,
                        data: {
                            entryId: params.entryId,
                            status: 'approved',
                            message: `Time entry ${params.entryId} approved`
                        }
                    };
                case 'update_time_entry':
                    if (!params.entryId) {
                        return { success: false, error: 'Entry ID is required' };
                    }
                    const updateIndex = timeLog.findIndex(entry => entry.id === params.entryId);
                    if (updateIndex === -1) {
                        return { success: false, error: `Time entry with ID ${params.entryId} not found` };
                    }
                    // Update only allowed fields
                    if (hours !== undefined)
                        timeLog[updateIndex].hours = hours;
                    if (taskId)
                        timeLog[updateIndex].taskId = taskId;
                    if (params.description)
                        timeLog[updateIndex].description = params.description;
                    timeLog[updateIndex].updatedAt = new Date().toISOString();
                    await fs.writeFile(timeLogFile, JSON.stringify(timeLog, null, 2));
                    Logger_1.Logger.info(`Time entry updated`, { entryId: params.entryId });
                    return {
                        success: true,
                        data: {
                            entryId: params.entryId,
                            message: `Time entry ${params.entryId} updated`
                        }
                    };
                default:
                    return { success: false, error: `Unsupported operation: ${operation}` };
            }
        }
        catch (error) {
            Logger_1.Logger.error('Time tracking operation error', { error: error.message });
            return { success: false, error: `Time tracking operation failed: ${error.message}` };
        }
    }
}
exports.TimeTrackingToolExtended = TimeTrackingToolExtended;
class ProjectManagementToolExtended {
    constructor() {
        this.name = 'project_management';
        this.description = 'Extended project management operations';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const projectId = params.projectId;
            const taskName = params.taskName;
            if (!operation) {
                return { success: false, error: 'Operation is required (create_project, create_task, update_task, get_project_status)' };
            }
            // Create project management directory if it doesn't exist
            const projPath = path.join(__dirname, '../../data/projects');
            try {
                await fs.mkdir(projPath, { recursive: true });
            }
            catch (mkdirErr) {
                Logger_1.Logger.warn(`Could not create projects directory: ${mkdirErr.message}`);
            }
            const projectsFile = path.join(projPath, 'projects.json');
            let projects = [];
            // Load existing projects
            try {
                const fileContent = await fs.readFile(projectsFile, 'utf8');
                projects = JSON.parse(fileContent);
            }
            catch (err) {
                // File doesn't exist, start with empty array
                projects = [];
            }
            switch (operation.toLowerCase()) {
                case 'create_project':
                    if (!taskName) {
                        return { success: false, error: 'Project name is required' };
                    }
                    const newProject = {
                        id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        name: taskName,
                        description: params.description || '',
                        owner: params.owner || 'system',
                        status: 'planning',
                        createdAt: new Date().toISOString(),
                        tasks: [],
                        startDate: params.startDate || new Date().toISOString(),
                        endDate: params.endDate,
                        budget: params.budget || 0
                    };
                    projects.push(newProject);
                    await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2));
                    Logger_1.Logger.info(`Project created`, { projectId: newProject.id, projectName: newProject.name });
                    return {
                        success: true,
                        data: {
                            projectId: newProject.id,
                            projectName: newProject.name,
                            message: `Project "${taskName}" created successfully`
                        }
                    };
                case 'create_task':
                    if (!projectId) {
                        return { success: false, error: 'Project ID is required' };
                    }
                    if (!taskName) {
                        return { success: false, error: 'Task name is required' };
                    }
                    const projectIndex = projects.findIndex(p => p.id === projectId);
                    if (projectIndex === -1) {
                        return { success: false, error: `Project with ID ${projectId} not found` };
                    }
                    const newTask = {
                        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        name: taskName,
                        description: params.description || '',
                        assignedTo: params.assignedTo || 'unassigned',
                        status: 'not_started',
                        priority: params.priority || 'medium',
                        createdAt: new Date().toISOString(),
                        dueDate: params.dueDate,
                        estimatedHours: params.estimatedHours || 0
                    };
                    projects[projectIndex].tasks.push(newTask);
                    await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2));
                    Logger_1.Logger.info(`Task created`, { taskId: newTask.id, taskName, projectId });
                    return {
                        success: true,
                        data: {
                            taskId: newTask.id,
                            taskName,
                            projectId,
                            message: `Task "${taskName}" created successfully in project ${projectId}`
                        }
                    };
                case 'update_task':
                    if (!params.taskId) {
                        return { success: false, error: 'Task ID is required' };
                    }
                    let found = false;
                    for (let i = 0; i < projects.length; i++) {
                        const taskIndex = projects[i].tasks.findIndex((t) => t.id === params.taskId);
                        if (taskIndex !== -1) {
                            // Update task properties
                            if (params.status)
                                projects[i].tasks[taskIndex].status = params.status;
                            if (params.assignedTo)
                                projects[i].tasks[taskIndex].assignedTo = params.assignedTo;
                            if (params.priority)
                                projects[i].tasks[taskIndex].priority = params.priority;
                            if (params.description)
                                projects[i].tasks[taskIndex].description = params.description;
                            projects[i].tasks[taskIndex].updatedAt = new Date().toISOString();
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        return { success: false, error: `Task with ID ${params.taskId} not found` };
                    }
                    await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2));
                    Logger_1.Logger.info(`Task updated`, { taskId: params.taskId });
                    return {
                        success: true,
                        data: {
                            taskId: params.taskId,
                            message: `Task ${params.taskId} updated successfully`
                        }
                    };
                case 'get_project_status':
                    if (!projectId) {
                        return { success: false, error: 'Project ID is required' };
                    }
                    const project = projects.find(p => p.id === projectId);
                    if (!project) {
                        return { success: false, error: `Project with ID ${projectId} not found` };
                    }
                    // Calculate project status metrics
                    const totalTasks = project.tasks.length;
                    const completedTasks = project.tasks.filter((t) => t.status === 'completed').length;
                    const inProgressTasks = project.tasks.filter((t) => t.status === 'in_progress').length;
                    const notStartedTasks = project.tasks.filter((t) => t.status === 'not_started').length;
                    const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                    Logger_1.Logger.info(`Project status retrieved`, { projectId, completionPercentage });
                    return {
                        success: true,
                        data: {
                            projectId: project.id,
                            projectName: project.name,
                            status: project.status,
                            totalTasks,
                            completedTasks,
                            inProgressTasks,
                            notStartedTasks,
                            completionPercentage: parseFloat(completionPercentage.toFixed(2)),
                            budget: project.budget,
                            tasks: project.tasks
                        }
                    };
                default:
                    return { success: false, error: `Unsupported operation: ${operation}` };
            }
        }
        catch (error) {
            Logger_1.Logger.error('Project management operation error', { error: error.message });
            return { success: false, error: `Project management operation failed: ${error.message}` };
        }
    }
}
exports.ProjectManagementToolExtended = ProjectManagementToolExtended;
class QualityManagementTool {
    constructor() {
        this.name = 'quality_system';
        this.description = 'Quality management system operations';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const recordId = params.recordId;
            const qualityMetric = params.qualityMetric;
            if (!operation) {
                return { success: false, error: 'Operation is required (log_quality_issue, create_quality_report, update_quality_metric, get_compliance_status)' };
            }
            // Create quality management directory if it doesn't exist
            const qualPath = path.join(__dirname, '../../data/quality');
            try {
                await fs.mkdir(qualPath, { recursive: true });
            }
            catch (mkdirErr) {
                Logger_1.Logger.warn(`Could not create quality directory: ${mkdirErr.message}`);
            }
            const qualityFile = path.join(qualPath, 'quality_records.json');
            let qualityRecords = [];
            // Load existing quality records
            try {
                const fileContent = await fs.readFile(qualityFile, 'utf8');
                qualityRecords = JSON.parse(fileContent);
            }
            catch (err) {
                // File doesn't exist, start with empty array
                qualityRecords = [];
            }
            switch (operation.toLowerCase()) {
                case 'log_quality_issue':
                    if (!qualityMetric) {
                        return { success: false, error: 'Quality metric is required' };
                    }
                    const issueRecord = {
                        id: `q_issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        metric: qualityMetric,
                        severity: params.severity || 'medium',
                        description: params.description || 'Quality issue reported',
                        detectedBy: params.detectedBy || 'system',
                        detectedAt: new Date().toISOString(),
                        status: 'open',
                        resolution: null,
                        resolutionDate: null
                    };
                    qualityRecords.push(issueRecord);
                    await fs.writeFile(qualityFile, JSON.stringify(qualityRecords, null, 2));
                    Logger_1.Logger.info(`Quality issue logged`, { issueId: issueRecord.id, metric: qualityMetric });
                    return {
                        success: true,
                        data: {
                            issueId: issueRecord.id,
                            message: `Quality issue for metric "${qualityMetric}" logged`
                        }
                    };
                case 'create_quality_report':
                    // Calculate quality metrics
                    const totalIssues = qualityRecords.length;
                    const openIssues = qualityRecords.filter((r) => r.status === 'open').length;
                    const resolvedIssues = qualityRecords.filter((r) => r.status === 'resolved').length;
                    const criticalIssues = qualityRecords.filter((r) => r.severity === 'critical').length;
                    const highIssues = qualityRecords.filter((r) => r.severity === 'high').length;
                    const qualityScore = totalIssues > 0
                        ? 100 - ((resolvedIssues / totalIssues) * 50) // Simplified quality score calculation
                        : 100;
                    const report = {
                        id: `q_report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        period: params.period || 'current',
                        totalIssues,
                        openIssues,
                        resolvedIssues,
                        criticalIssues,
                        highIssues,
                        qualityScore: parseFloat(qualityScore.toFixed(2)),
                        generatedAt: new Date().toISOString()
                    };
                    Logger_1.Logger.info(`Quality report generated`, { reportId: report.id, qualityScore });
                    return {
                        success: true,
                        data: report
                    };
                case 'update_quality_metric':
                    if (!recordId) {
                        return { success: false, error: 'Record ID is required' };
                    }
                    const recordIndex = qualityRecords.findIndex(r => r.id === recordId);
                    if (recordIndex === -1) {
                        return { success: false, error: `Quality record with ID ${recordId} not found` };
                    }
                    // Update record properties
                    if (params.status)
                        qualityRecords[recordIndex].status = params.status;
                    if (params.resolution)
                        qualityRecords[recordIndex].resolution = params.resolution;
                    if (params.resolvedBy)
                        qualityRecords[recordIndex].resolvedBy = params.resolvedBy;
                    qualityRecords[recordIndex].resolutionDate = new Date().toISOString();
                    await fs.writeFile(qualityFile, JSON.stringify(qualityRecords, null, 2));
                    Logger_1.Logger.info(`Quality record updated`, { recordId });
                    return {
                        success: true,
                        data: {
                            recordId,
                            message: `Quality record ${recordId} updated`
                        }
                    };
                case 'get_compliance_status':
                    // Determine compliance based on quality metrics
                    const allRecords = qualityRecords;
                    const compliantMetrics = new Set(allRecords.map((r) => r.metric));
                    const compliancePercentage = compliantMetrics.size > 0
                        ? (allRecords.filter((r) => r.status === 'resolved').length / allRecords.length) * 100
                        : 100;
                    Logger_1.Logger.info(`Compliance status retrieved`, { compliancePercentage });
                    return {
                        success: true,
                        data: {
                            compliantMetrics: Array.from(compliantMetrics),
                            totalMetrics: compliantMetrics.size,
                            compliancePercentage: parseFloat(compliancePercentage.toFixed(2)),
                            status: compliancePercentage >= 95 ? 'compliant' : 'non-compliant'
                        }
                    };
                default:
                    return { success: false, error: `Unsupported operation: ${operation}` };
            }
        }
        catch (error) {
            Logger_1.Logger.error('Quality management operation error', { error: error.message });
            return { success: false, error: `Quality management operation failed: ${error.message}` };
        }
    }
}
exports.QualityManagementTool = QualityManagementTool;
class WorkflowSystemTool {
    constructor() {
        this.name = 'workflow_system';
        this.description = 'General workflow system operations';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const workflowId = params.workflowId;
            const stepId = params.stepId;
            if (!operation) {
                return { success: false, error: 'Operation is required (start_workflow, complete_step, get_workflow_status, cancel_workflow)' };
            }
            // Create workflow directory if it doesn't exist
            const wfPath = path.join(__dirname, '../../data/workflows');
            try {
                await fs.mkdir(wfPath, { recursive: true });
            }
            catch (mkdirErr) {
                Logger_1.Logger.warn(`Could not create workflows directory: ${mkdirErr.message}`);
            }
            const workflowsFile = path.join(wfPath, 'workflows.json');
            let workflows = [];
            // Load existing workflows
            try {
                const fileContent = await fs.readFile(workflowsFile, 'utf8');
                workflows = JSON.parse(fileContent);
            }
            catch (err) {
                // File doesn't exist, start with empty array
                workflows = [];
            }
            switch (operation.toLowerCase()) {
                case 'start_workflow':
                    if (!params.name) {
                        return { success: false, error: 'Workflow name is required' };
                    }
                    const newWorkflow = {
                        id: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        name: params.name,
                        description: params.description || '',
                        status: 'running',
                        startedAt: new Date().toISOString(),
                        completedSteps: [],
                        totalSteps: params.totalSteps || 1,
                        context: params.context || {},
                        currentStep: 0
                    };
                    workflows.push(newWorkflow);
                    await fs.writeFile(workflowsFile, JSON.stringify(workflows, null, 2));
                    Logger_1.Logger.info(`Workflow started`, { workflowId: newWorkflow.id, workflowName: newWorkflow.name });
                    return {
                        success: true,
                        data: {
                            workflowId: newWorkflow.id,
                            message: `Workflow "${newWorkflow.name}" started successfully`
                        }
                    };
                case 'complete_step':
                    if (!workflowId) {
                        return { success: false, error: 'Workflow ID is required' };
                    }
                    if (!stepId) {
                        return { success: false, error: 'Step ID is required' };
                    }
                    const wfIndex = workflows.findIndex(w => w.id === workflowId);
                    if (wfIndex === -1) {
                        return { success: false, error: `Workflow with ID ${workflowId} not found` };
                    }
                    // Add step to completed steps if not already there
                    if (!workflows[wfIndex].completedSteps.includes(stepId)) {
                        workflows[wfIndex].completedSteps.push(stepId);
                        workflows[wfIndex].currentStep += 1;
                        // Check if workflow is completed
                        if (workflows[wfIndex].completedSteps.length >= workflows[wfIndex].totalSteps) {
                            workflows[wfIndex].status = 'completed';
                            workflows[wfIndex].completedAt = new Date().toISOString();
                        }
                    }
                    await fs.writeFile(workflowsFile, JSON.stringify(workflows, null, 2));
                    Logger_1.Logger.info(`Workflow step completed`, { workflowId, stepId });
                    return {
                        success: true,
                        data: {
                            workflowId,
                            stepId,
                            message: `Step ${stepId} completed in workflow ${workflowId}`
                        }
                    };
                case 'get_workflow_status':
                    if (!workflowId) {
                        return { success: false, error: 'Workflow ID is required' };
                    }
                    const workflow = workflows.find(w => w.id === workflowId);
                    if (!workflow) {
                        return { success: false, error: `Workflow with ID ${workflowId} not found` };
                    }
                    Logger_1.Logger.info(`Workflow status retrieved`, { workflowId, status: workflow.status });
                    return {
                        success: true,
                        data: workflow
                    };
                case 'cancel_workflow':
                    if (!workflowId) {
                        return { success: false, error: 'Workflow ID is required' };
                    }
                    const cancelIndex = workflows.findIndex(w => w.id === workflowId);
                    if (cancelIndex === -1) {
                        return { success: false, error: `Workflow with ID ${workflowId} not found` };
                    }
                    workflows[cancelIndex].status = 'cancelled';
                    workflows[cancelIndex].cancelledAt = new Date().toISOString();
                    await fs.writeFile(workflowsFile, JSON.stringify(workflows, null, 2));
                    Logger_1.Logger.info(`Workflow cancelled`, { workflowId });
                    return {
                        success: true,
                        data: {
                            workflowId,
                            message: `Workflow ${workflowId} cancelled`
                        }
                    };
                default:
                    return { success: false, error: `Unsupported operation: ${operation}` };
            }
        }
        catch (error) {
            Logger_1.Logger.error('Workflow system operation error', { error: error.message });
            return { success: false, error: `Workflow operation failed: ${error.message}` };
        }
    }
}
exports.WorkflowSystemTool = WorkflowSystemTool;
