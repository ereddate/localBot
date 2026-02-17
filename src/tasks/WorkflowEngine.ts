import { Logger } from '../utils/Logger';
import { Tool } from '../types';

export interface WorkflowStep {
  id: string;
  name: string;
  tool: Tool;
  params: Record<string, unknown>;
  dependsOn?: string[]; // IDs of steps this step depends on
  onSuccess?: string[]; // IDs of steps to run on success
  onError?: string[]; // IDs of steps to run on error
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  steps: Array<{
    id: string;
    tool: string; // Tool name as string since we resolve it during execution
    params: Record<string, unknown>;
    description?: string;
    dependsOn?: string[];
  }>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  active: boolean;
}

export interface WorkflowExecution {
  workflowId: string;
  executionId: string;
  startTime: Date;
  endTime?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  stepResults: Map<string, { success: boolean; result?: unknown; error?: string }>;
  context: Record<string, unknown>; // Shared context between steps
}

export class WorkflowEngine {
  private workflows: Map<string, Workflow> = new Map();
  private executions: Map<string, WorkflowExecution> = new Map();
  private activeExecutions: Set<string> = new Set();

  constructor() {
    Logger.info('Workflow Engine initialized');
  }

  /**
   * Register a new workflow
   */
  registerWorkflow(workflow: Workflow): void {
    this.workflows.set(workflow.id, workflow);
    Logger.info(`Workflow registered: ${workflow.name}`, { workflowId: workflow.id });
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, initialContext: Record<string, unknown> = {}): Promise<WorkflowExecution> {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    if (!workflow.active) {
      throw new Error(`Workflow is not active: ${workflowId}`);
    }

    const executionId = this.generateExecutionId();
    const execution: WorkflowExecution = {
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
      Logger.info(`Workflow completed: ${workflow.name}`, { executionId });
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      Logger.error(`Workflow failed: ${workflow.name}`, { 
        executionId, 
        error: (error as Error).message 
      });
    } finally {
      this.activeExecutions.delete(executionId);
    }

    return execution;
  }

  /**
   * Execute steps in dependency order
   */
  private async executeSteps(workflow: Workflow, execution: WorkflowExecution): Promise<void> {
    const completedSteps = new Set<string>();
    const totalSteps = workflow.steps.length;

    while (completedSteps.size < totalSteps) {
      // Find steps ready to execute (dependencies satisfied and not yet completed)
      const readySteps = workflow.steps.filter(step => {
        // Skip if already completed
        if (completedSteps.has(step.id)) return false;

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
        } else {
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
  private async executeStep(step: WorkflowStep, execution: WorkflowExecution): Promise<{ success: boolean; result?: unknown; error?: string }> {
    try {
      Logger.info(`Executing workflow step: ${step.name}`, { 
        stepId: step.id, 
        workflowId: execution.workflowId 
      });

      // Prepare parameters, potentially using values from context
      const preparedParams = this.prepareParameters(step.params, execution.context);
      
      const result = await step.tool.execute(preparedParams);
      
      if (result.success) {
        // Update context with result if needed
        this.updateContextWithResult(step.id, result.data, execution);
        
        Logger.info(`Workflow step completed: ${step.name}`, { 
          stepId: step.id, 
          workflowId: execution.workflowId 
        });
        
        return { success: true, result: result.data };
      } else {
        Logger.error(`Workflow step failed: ${step.name}`, { 
          stepId: step.id, 
          workflowId: execution.workflowId,
          error: result.error 
        });
        
        return { success: false, error: result.error };
      }
    } catch (error) {
      Logger.error(`Error executing workflow step: ${step.name}`, { 
        stepId: step.id, 
        workflowId: execution.workflowId,
        error: (error as Error).message 
      });
      
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Prepare parameters by substituting context values
   */
  private prepareParameters(params: Record<string, unknown>, context: Record<string, unknown>): Record<string, unknown> {
    const prepared: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
        // This is a context variable reference like {{variableName}}
        const contextKey = value.substring(2, value.length - 2); // Remove {{ and }}
        prepared[key] = context[contextKey] ?? value; // Use context value or fallback to original
      } else {
        prepared[key] = value;
      }
    }
    
    return prepared;
  }

  /**
   * Update execution context with step result
   */
  private updateContextWithResult(stepId: string, result: unknown, execution: WorkflowExecution): void {
    if (result && typeof result === 'object') {
      // Add result to context under stepId key
      execution.context[stepId] = result;
      
      // Also add any properties directly if result is an object
      if (typeof result === 'object') {
        for (const [key, value] of Object.entries(result)) {
          execution.context[`${stepId}_${key}`] = value;
        }
      }
    } else {
      execution.context[stepId] = result;
    }
  }

  /**
   * Get workflow by ID
   */
  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get execution by ID
   */
  getExecution(executionId: string): WorkflowExecution | undefined {
    return this.executions.get(executionId);
  }

  /**
   * Cancel an active workflow execution
   */
  cancelExecution(executionId: string): boolean {
    if (!this.activeExecutions.has(executionId)) {
      return false;
    }

    const execution = this.executions.get(executionId);
    if (execution) {
      execution.status = 'cancelled';
      execution.endTime = new Date();
      this.activeExecutions.delete(executionId);
      Logger.info('Workflow execution cancelled', { executionId });
    }

    return true;
  }

  /**
   * Generate a unique execution ID
   */
  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all executions for a workflow
   */
  getExecutionsForWorkflow(workflowId: string): WorkflowExecution[] {
    return Array.from(this.executions.values())
      .filter(exec => exec.workflowId === workflowId);
  }

  /**
   * Get all registered workflows
   */
  getWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Execute a workflow definition directly
   */
  async execute(definition: WorkflowDefinition, initialContext: Record<string, unknown> = {}, availableTools: Map<string, any> = new Map()): Promise<unknown> {
    // Register the workflow temporarily
    const tempWorkflowId = `temp_${definition.id}_${Date.now()}`;
    
    // Convert definition to workflow format
    const workflow: Workflow = {
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
    } finally {
      // Clean up the temporary workflow
      this.workflows.delete(tempWorkflowId);
    }
  }
}