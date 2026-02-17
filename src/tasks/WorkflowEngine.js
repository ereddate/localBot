"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowEngine = void 0;
const Logger_1 = require("../utils/Logger");
class WorkflowEngine {
    constructor() {
        this.workflows = new Map();
        this.executions = new Map();
        this.activeExecutions = new Set();
        Logger_1.Logger.info('Workflow Engine initialized');
    }
    /**
     * Register a new workflow
     */
    registerWorkflow(workflow) {
        this.workflows.set(workflow.id, workflow);
        Logger_1.Logger.info(`Workflow registered: ${workflow.name}`, { workflowId: workflow.id });
    }
    /**
     * Execute a workflow
     */
    async executeWorkflow(workflowId, initialContext = {}) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) {
            throw new Error(`Workflow not found: ${workflowId}`);
        }
        if (!workflow.active) {
            throw new Error(`Workflow is not active: ${workflowId}`);
        }
        const executionId = this.generateExecutionId();
        const execution = {
            workflowId,
            executionId,
            startTime: new Date(),
            status: 'running',
            stepResults: new Map(),
            context: { ...initialContext },
        };
        this.executions.set(executionId, execution);
        this.activeExecutions.add(executionId);
        try {
            await this.executeSteps(workflow, execution);
            execution.status = 'completed';
            execution.endTime = new Date();
            Logger_1.Logger.info(`Workflow completed: ${workflow.name}`, { executionId });
        }
        catch (error) {
            execution.status = 'failed';
            execution.endTime = new Date();
            Logger_1.Logger.error(`Workflow failed: ${workflow.name}`, {
                executionId,
                error: error.message
            });
        }
        finally {
            this.activeExecutions.delete(executionId);
        }
        return execution;
    }
    /**
     * Execute steps in dependency order
     */
    async executeSteps(workflow, execution) {
        const completedSteps = new Set();
        const totalSteps = workflow.steps.length;
        while (completedSteps.size < totalSteps) {
            // Find steps ready to execute (dependencies satisfied and not yet completed)
            const readySteps = workflow.steps.filter(step => {
                // Skip if already completed
                if (completedSteps.has(step.id))
                    return false;
                // Check if all dependencies are completed
                if (step.dependsOn) {
                    for (const depId of step.dependsOn) {
                        if (!completedSteps.has(depId)) {
                            return false; // Dependency not met
                        }
                    }
                }
                return true; // Ready to execute
            });
            if (readySteps.length === 0) {
                // No progress possible - circular dependency or missing dependency
                const remainingSteps = workflow.steps
                    .filter(step => !completedSteps.has(step.id))
                    .map(step => step.id);
                throw new Error(`Unable to execute workflow: Remaining steps have unsatisfied dependencies: ${remainingSteps.join(', ')}`);
            }
            // Execute ready steps in parallel
            const promises = readySteps.map(step => this.executeStep(step, execution));
            const results = await Promise.all(promises);
            // Update completed steps
            for (let idx = 0; idx < results.length; idx++) {
                const result = results[idx];
                const step = readySteps[idx];
                const stepId = step.id;
                execution.stepResults.set(stepId, result);
                if (result.success) {
                    completedSteps.add(stepId);
                }
                else {
                    // Step failed, handle error flow
                    completedSteps.add(stepId);
                    // Execute error handlers if defined
                    if (step.onError) {
                        // Add error handler steps to the workflow dynamically
                        for (const errorStepId of step.onError) {
                            const errorStep = workflow.steps.find(s => s.id === errorStepId);
                            if (errorStep) {
                                // Re-evaluate dependencies for error steps
                                const errorReady = !errorStep.dependsOn ||
                                    errorStep.dependsOn.every(depId => completedSteps.has(depId));
                                if (errorReady) {
                                    // Execute error handler step
                                    const errorResult = await this.executeStep(errorStep, execution);
                                    execution.stepResults.set(errorStepId, errorResult);
                                    completedSteps.add(errorStepId);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    /**
     * Execute a single workflow step
     */
    async executeStep(step, execution) {
        try {
            console.log(`🔄 执行工作流步骤: ${step.name} (${step.id}) [工作流: ${execution.workflowId}]`);
            Logger_1.Logger.info(`Executing workflow step: ${step.name}`, {
                stepId: step.id,
                workflowId: execution.workflowId
            });
            // Prepare parameters, potentially using values from context
            const preparedParams = this.prepareParameters(step.params, execution.context);
            console.log(`🔧 调用工具: ${step.tool.name}`, { params: preparedParams });
            const result = await step.tool.execute(preparedParams);
            console.log(`✅ 工具执行完成: ${step.tool.name}`, { success: result.success });
            if (result.success) {
                // Update context with result if needed
                this.updateContextWithResult(step.id, result.data, execution);
                console.log(`✅ 工作流步骤完成: ${step.name} (${step.id})`);
                Logger_1.Logger.info(`Workflow step completed: ${step.name}`, {
                    stepId: step.id,
                    workflowId: execution.workflowId
                });
                return { success: true, result: result.data };
            }
            else {
                console.log(`❌ 工作流步骤失败: ${step.name} (${step.id})`, { error: result.error });
                Logger_1.Logger.error(`Workflow step failed: ${step.name}`, {
                    stepId: step.id,
                    workflowId: execution.workflowId,
                    error: result.error
                });
                return { success: false, error: result.error };
            }
        }
        catch (error) {
            console.log(`💥 执行工作流步骤时发生错误: ${step.name} (${step.id})`, { error: error.message });
            Logger_1.Logger.error(`Error executing workflow step: ${step.name}`, {
                stepId: step.id,
                workflowId: execution.workflowId,
                error: error.message
            });
            return { success: false, error: error.message };
        }
    }
    /**
     * Prepare parameters by substituting context values
     */
    prepareParameters(params, context) {
        const prepared = {};
        for (const [key, value] of Object.entries(params)) {
            if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
                // This is a context variable reference like {{variableName}}
                const contextKey = value.substring(2, value.length - 2); // Remove {{ and }}
                prepared[key] = context[contextKey] ?? value; // Use context value or fallback to original
            }
            else {
                prepared[key] = value;
            }
        }
        return prepared;
    }
    /**
     * Update execution context with step result
     */
    updateContextWithResult(stepId, result, execution) {
        if (result && typeof result === 'object') {
            // Add result to context under stepId key
            execution.context[stepId] = result;
            // Also add any properties directly if result is an object
            if (typeof result === 'object') {
                for (const [key, value] of Object.entries(result)) {
                    execution.context[`${stepId}_${key}`] = value;
                }
            }
        }
        else {
            execution.context[stepId] = result;
        }
    }
    /**
     * Get workflow by ID
     */
    getWorkflow(workflowId) {
        return this.workflows.get(workflowId);
    }
    /**
     * Get execution by ID
     */
    getExecution(executionId) {
        return this.executions.get(executionId);
    }
    /**
     * Cancel an active workflow execution
     */
    cancelExecution(executionId) {
        if (!this.activeExecutions.has(executionId)) {
            return false;
        }
        const execution = this.executions.get(executionId);
        if (execution) {
            execution.status = 'cancelled';
            execution.endTime = new Date();
            this.activeExecutions.delete(executionId);
            Logger_1.Logger.info('Workflow execution cancelled', { executionId });
        }
        return true;
    }
    /**
     * Generate a unique execution ID
     */
    generateExecutionId() {
        return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Get all executions for a workflow
     */
    getExecutionsForWorkflow(workflowId) {
        return Array.from(this.executions.values())
            .filter(exec => exec.workflowId === workflowId);
    }
    /**
     * Get all registered workflows
     */
    getWorkflows() {
        return Array.from(this.workflows.values());
    }
    /**
     * Execute a workflow definition directly
     */
    async execute(definition, initialContext = {}, availableTools = new Map()) {
        // Register the workflow temporarily
        const tempWorkflowId = `temp_${definition.id}_${Date.now()}`;
        // Convert definition to workflow format
        const workflow = {
            id: tempWorkflowId,
            name: definition.name,
            description: definition.description,
            steps: definition.steps.map(step => ({
                id: step.id,
                name: step.description || step.id,
                tool: availableTools.get(step.tool) || {
                    name: step.tool,
                    description: '',
                    category: 'system',
                    execute: async () => ({ success: true, data: null }) // Placeholder - will be replaced
                },
                params: step.params,
                dependsOn: step.dependsOn
            })),
            active: true
        };
        // Register the temporary workflow
        this.workflows.set(tempWorkflowId, workflow);
        try {
            // Execute the workflow
            const execution = await this.executeWorkflow(tempWorkflowId, initialContext);
            return execution;
        }
        finally {
            // Clean up the temporary workflow
            this.workflows.delete(tempWorkflowId);
        }
    }
}
exports.WorkflowEngine = WorkflowEngine;
