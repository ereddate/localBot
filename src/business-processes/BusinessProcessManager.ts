/**
 * 业务流程管理器
 * 统一管理所有业务流程模型，提供执行接口
 */

import { WorkflowEngine, WorkflowDefinition } from '../tasks/WorkflowEngine';
import { SkillManager } from '../skills/SkillManager';
import { MemorySystem } from '../memory/MemorySystem';
import { 
  customerDevelopmentProcess, 
  opportunityManagementProcess, 
  salesPerformanceAnalysisProcess 
} from './SalesProcessModel';
import { 
  budgetManagementProcess, 
  expenseReimbursementProcess, 
  financialReportingProcess, 
  taxProcessingProcess 
} from './FinanceProcessModel';
import { 
  supplyChainManagementProcess, 
  productionPlanningProcess, 
  qualityManagementProcess, 
  inventoryControlProcess 
} from './OperationsProcessModel';
import { 
  recruitmentProcess, 
  onboardingProcess, 
  performanceEvaluationProcess, 
  trainingDevelopmentProcess 
} from './HRProcessModel';
import { Logger } from '../utils/Logger';

export enum BusinessDomain {
  SALES = 'sales',
  FINANCE = 'finance',
  OPERATIONS = 'operations',
  HR = 'human_resources'
}

export enum SalesProcessType {
  CUSTOMER_DEVELOPMENT = 'customer-development-process',
  OPPORTUNITY_MANAGEMENT = 'opportunity-management-process',
  PERFORMANCE_ANALYSIS = 'sales-performance-analysis-process'
}

export enum FinanceProcessType {
  BUDGET_MANAGEMENT = 'budget-management-process',
  EXPENSE_REIMBURSEMENT = 'expense-reimbursement-process',
  FINANCIAL_REPORTING = 'financial-reporting-process',
  TAX_PROCESSING = 'tax-processing-process'
}

export enum OperationsProcessType {
  SUPPLY_CHAIN_MANAGEMENT = 'supply-chain-management-process',
  PRODUCTION_PLANNING = 'production-planning-process',
  QUALITY_MANAGEMENT = 'quality-management-process',
  INVENTORY_CONTROL = 'inventory-control-process'
}

export enum HRProcessType {
  RECRUITMENT = 'recruitment-process',
  ONBOARDING = 'onboarding-process',
  PERFORMANCE_EVALUATION = 'performance-evaluation-process',
  TRAINING_DEVELOPMENT = 'training-development-process'
}

export interface BusinessProcessExecutionOptions {
  processId: string;
  inputData?: Record<string, any>;
  priority?: number;
  callbackUrl?: string;
}

export class BusinessProcessManager {
  private workflowEngine: WorkflowEngine;
  private skillManager: SkillManager;
  
  constructor(workflowEngine: WorkflowEngine, skillManager: SkillManager) {
    this.workflowEngine = workflowEngine;
    this.skillManager = skillManager;
  }

  /**
   * 获取指定业务域的所有可用流程
   */
  public getProcessesByDomain(domain: BusinessDomain): any[] {
    switch (domain) {
      case BusinessDomain.SALES:
        return [
          customerDevelopmentProcess,
          opportunityManagementProcess,
          salesPerformanceAnalysisProcess
        ];
      case BusinessDomain.FINANCE:
        return [
          budgetManagementProcess,
          expenseReimbursementProcess,
          financialReportingProcess,
          taxProcessingProcess
        ];
      case BusinessDomain.OPERATIONS:
        return [
          supplyChainManagementProcess,
          productionPlanningProcess,
          qualityManagementProcess,
          inventoryControlProcess
        ];
      case BusinessDomain.HR:
        return [
          recruitmentProcess,
          onboardingProcess,
          performanceEvaluationProcess,
          trainingDevelopmentProcess
        ];
      default:
        return [];
    }
  }

  /**
   * 执行销售业务流程
   */
  public async executeSalesProcess(
    processType: SalesProcessType,
    options: BusinessProcessExecutionOptions
  ): Promise<any> {
    try {
      Logger.info(`Executing sales process: ${processType}`, { processId: options.processId });
      
      let processDefinition;
      switch (processType) {
        case SalesProcessType.CUSTOMER_DEVELOPMENT:
          processDefinition = customerDevelopmentProcess;
          break;
        case SalesProcessType.OPPORTUNITY_MANAGEMENT:
          processDefinition = opportunityManagementProcess;
          break;
        case SalesProcessType.PERFORMANCE_ANALYSIS:
          processDefinition = salesPerformanceAnalysisProcess;
          break;
        default:
          throw new Error(`Unknown sales process type: ${processType}`);
      }

      // Get all available tools from skill manager
      const allTools = new Map<string, any>();
      this.skillManager.getAllTools().forEach(tool => {
        allTools.set(tool.name, tool);
      });
      
      return await this.workflowEngine.execute(processDefinition, options.inputData || {}, allTools);
    } catch (error) {
      Logger.error(`Error executing sales process ${processType}`, { error: (error as Error).message, processId: options.processId });
      throw error;
    }
  }

  /**
   * 执行财务业务流程
   */
  public async executeFinanceProcess(
    processType: FinanceProcessType,
    options: BusinessProcessExecutionOptions
  ): Promise<any> {
    try {
      Logger.info(`Executing finance process: ${processType}`, { processId: options.processId });
      
      let processDefinition;
      switch (processType) {
        case FinanceProcessType.BUDGET_MANAGEMENT:
          processDefinition = budgetManagementProcess;
          break;
        case FinanceProcessType.EXPENSE_REIMBURSEMENT:
          processDefinition = expenseReimbursementProcess;
          break;
        case FinanceProcessType.FINANCIAL_REPORTING:
          processDefinition = financialReportingProcess;
          break;
        case FinanceProcessType.TAX_PROCESSING:
          processDefinition = taxProcessingProcess;
          break;
        default:
          throw new Error(`Unknown finance process type: ${processType}`);
      }

      // Get all available tools from skill manager
      const allTools = new Map<string, any>();
      this.skillManager.getAllTools().forEach(tool => {
        allTools.set(tool.name, tool);
      });
      
      return await this.workflowEngine.execute(processDefinition, options.inputData || {}, allTools);
    } catch (error) {
      Logger.error(`Error executing finance process ${processType}`, { error: (error as Error).message, processId: options.processId });
      throw error;
    }
  }

  /**
   * 执行运营管理流程
   */
  public async executeOperationsProcess(
    processType: OperationsProcessType,
    options: BusinessProcessExecutionOptions
  ): Promise<any> {
    try {
      Logger.info(`Executing operations process: ${processType}`, { processId: options.processId });
      
      let processDefinition;
      switch (processType) {
        case OperationsProcessType.SUPPLY_CHAIN_MANAGEMENT:
          processDefinition = supplyChainManagementProcess;
          break;
        case OperationsProcessType.PRODUCTION_PLANNING:
          processDefinition = productionPlanningProcess;
          break;
        case OperationsProcessType.QUALITY_MANAGEMENT:
          processDefinition = qualityManagementProcess;
          break;
        case OperationsProcessType.INVENTORY_CONTROL:
          processDefinition = inventoryControlProcess;
          break;
        default:
          throw new Error(`Unknown operations process type: ${processType}`);
      }

      // Get all available tools from skill manager
      const allTools = new Map<string, any>();
      this.skillManager.getAllTools().forEach(tool => {
        allTools.set(tool.name, tool);
      });
      
      return await this.workflowEngine.execute(processDefinition, options.inputData || {}, allTools);
    } catch (error) {
      Logger.error(`Error executing operations process ${processType}`, { error: (error as Error).message, processId: options.processId });
      throw error;
    }
  }

  /**
   * 执行人力资源流程
   */
  public async executeHRProcess(
    processType: HRProcessType,
    options: BusinessProcessExecutionOptions
  ): Promise<any> {
    try {
      Logger.info(`Executing HR process: ${processType}`, { processId: options.processId });
      
      let processDefinition;
      switch (processType) {
        case HRProcessType.RECRUITMENT:
          processDefinition = recruitmentProcess;
          break;
        case HRProcessType.ONBOARDING:
          processDefinition = onboardingProcess;
          break;
        case HRProcessType.PERFORMANCE_EVALUATION:
          processDefinition = performanceEvaluationProcess;
          break;
        case HRProcessType.TRAINING_DEVELOPMENT:
          processDefinition = trainingDevelopmentProcess;
          break;
        default:
          throw new Error(`Unknown HR process type: ${processType}`);
      }

      // Get all available tools from skill manager
      const allTools = new Map<string, any>();
      this.skillManager.getAllTools().forEach(tool => {
        allTools.set(tool.name, tool);
      });
      
      return await this.workflowEngine.execute(processDefinition, options.inputData || {}, allTools);
    } catch (error) {
      Logger.error(`Error executing HR process ${processType}`, { error: (error as Error).message, processId: options.processId });
      throw error;
    }
  }

  /**
   * 根据业务需求自动选择最合适的流程
   */
  public async executeBusinessProcessByRequirement(
    requirement: string,
    options: BusinessProcessExecutionOptions
  ): Promise<any> {
    // 简单的关键词匹配来确定业务领域和流程类型
    const requirementLower = requirement.toLowerCase();
    
    // 销售相关
    if (requirementLower.includes('sale') || requirementLower.includes('customer') || 
        requirementLower.includes('lead') || requirementLower.includes('opportunity')) {
      if (requirementLower.includes('develop') || requirementLower.includes('prospect')) {
        return await this.executeSalesProcess(SalesProcessType.CUSTOMER_DEVELOPMENT, options);
      } else if (requirementLower.includes('manage') || requirementLower.includes('opportunity')) {
        return await this.executeSalesProcess(SalesProcessType.OPPORTUNITY_MANAGEMENT, options);
      } else if (requirementLower.includes('analy') || requirementLower.includes('report') || requirementLower.includes('perform')) {
        return await this.executeSalesProcess(SalesProcessType.PERFORMANCE_ANALYSIS, options);
      } else {
        // 默认使用客户开发流程
        return await this.executeSalesProcess(SalesProcessType.CUSTOMER_DEVELOPMENT, options);
      }
    }
    // 财务相关
    else if (requirementLower.includes('budget') || requirementLower.includes('finance') || 
             requirementLower.includes('expense') || requirementLower.includes('tax') || 
             requirementLower.includes('report')) {
      if (requirementLower.includes('budget')) {
        return await this.executeFinanceProcess(FinanceProcessType.BUDGET_MANAGEMENT, options);
      } else if (requirementLower.includes('expense') || requirementLower.includes('reimburs')) {
        return await this.executeFinanceProcess(FinanceProcessType.EXPENSE_REIMBURSEMENT, options);
      } else if (requirementLower.includes('report') && !requirementLower.includes('tax')) {
        return await this.executeFinanceProcess(FinanceProcessType.FINANCIAL_REPORTING, options);
      } else if (requirementLower.includes('tax')) {
        return await this.executeFinanceProcess(FinanceProcessType.TAX_PROCESSING, options);
      } else {
        // 默认使用预算管理流程
        return await this.executeFinanceProcess(FinanceProcessType.BUDGET_MANAGEMENT, options);
      }
    }
    // 运营相关
    else if (requirementLower.includes('supply') || requirementLower.includes('chain') || 
             requirementLower.includes('produ') || requirementLower.includes('manufactur') || 
             requirementLower.includes('qualit') || requirementLower.includes('inventor')) {
      if (requirementLower.includes('supply') || requirementLower.includes('chain')) {
        return await this.executeOperationsProcess(OperationsProcessType.SUPPLY_CHAIN_MANAGEMENT, options);
      } else if (requirementLower.includes('produ') || requirementLower.includes('manufactur')) {
        return await this.executeOperationsProcess(OperationsProcessType.PRODUCTION_PLANNING, options);
      } else if (requirementLower.includes('qualit')) {
        return await this.executeOperationsProcess(OperationsProcessType.QUALITY_MANAGEMENT, options);
      } else if (requirementLower.includes('inventor')) {
        return await this.executeOperationsProcess(OperationsProcessType.INVENTORY_CONTROL, options);
      } else {
        // 默认使用库存控制流程
        return await this.executeOperationsProcess(OperationsProcessType.INVENTORY_CONTROL, options);
      }
    }
    // 人力资源相关
    else if (requirementLower.includes('hire') || requirementLower.includes('recruit') || 
             requirementLower.includes('employ') || requirementLower.includes('onboard') || 
             requirementLower.includes('perform') || requirementLower.includes('evaluat') ||
             requirementLower.includes('train') || requirementLower.includes('develop')) {
      if (requirementLower.includes('hire') || requirementLower.includes('recruit')) {
        return await this.executeHRProcess(HRProcessType.RECRUITMENT, options);
      } else if (requirementLower.includes('onboard')) {
        return await this.executeHRProcess(HRProcessType.ONBOARDING, options);
      } else if (requirementLower.includes('perform') || requirementLower.includes('evaluat')) {
        return await this.executeHRProcess(HRProcessType.PERFORMANCE_EVALUATION, options);
      } else if (requirementLower.includes('train') || requirementLower.includes('develop')) {
        return await this.executeHRProcess(HRProcessType.TRAINING_DEVELOPMENT, options);
      } else {
        // 默认使用入职流程
        return await this.executeHRProcess(HRProcessType.ONBOARDING, options);
      }
    }
    // 如果无法识别，抛出错误
    else {
      throw new Error(`Unable to identify appropriate business process for requirement: ${requirement}`);
    }
  }

  /**
   * 获取所有可用的业务流程
   */
  public getAllBusinessProcesses(): Array<{domain: BusinessDomain, type: string, name: string, description: string}> {
    const allProcesses: Array<{domain: BusinessDomain, type: string, name: string, description: string}> = [];

    // 添加销售流程
    [
      { type: SalesProcessType.CUSTOMER_DEVELOPMENT, ...customerDevelopmentProcess },
      { type: SalesProcessType.OPPORTUNITY_MANAGEMENT, ...opportunityManagementProcess },
      { type: SalesProcessType.PERFORMANCE_ANALYSIS, ...salesPerformanceAnalysisProcess }
    ].forEach(proc => {
      allProcesses.push({
        domain: BusinessDomain.SALES,
        type: proc.type,
        name: proc.name,
        description: proc.description
      });
    });

    // 添加财务流程
    [
      { type: FinanceProcessType.BUDGET_MANAGEMENT, ...budgetManagementProcess },
      { type: FinanceProcessType.EXPENSE_REIMBURSEMENT, ...expenseReimbursementProcess },
      { type: FinanceProcessType.FINANCIAL_REPORTING, ...financialReportingProcess },
      { type: FinanceProcessType.TAX_PROCESSING, ...taxProcessingProcess }
    ].forEach(proc => {
      allProcesses.push({
        domain: BusinessDomain.FINANCE,
        type: proc.type,
        name: proc.name,
        description: proc.description
      });
    });

    // 添加运营流程
    [
      { type: OperationsProcessType.SUPPLY_CHAIN_MANAGEMENT, ...supplyChainManagementProcess },
      { type: OperationsProcessType.PRODUCTION_PLANNING, ...productionPlanningProcess },
      { type: OperationsProcessType.QUALITY_MANAGEMENT, ...qualityManagementProcess },
      { type: OperationsProcessType.INVENTORY_CONTROL, ...inventoryControlProcess }
    ].forEach(proc => {
      allProcesses.push({
        domain: BusinessDomain.OPERATIONS,
        type: proc.type,
        name: proc.name,
        description: proc.description
      });
    });

    // 添加人力资源流程
    [
      { type: HRProcessType.RECRUITMENT, ...recruitmentProcess },
      { type: HRProcessType.ONBOARDING, ...onboardingProcess },
      { type: HRProcessType.PERFORMANCE_EVALUATION, ...performanceEvaluationProcess },
      { type: HRProcessType.TRAINING_DEVELOPMENT, ...trainingDevelopmentProcess }
    ].forEach(proc => {
      allProcesses.push({
        domain: BusinessDomain.HR,
        type: proc.type,
        name: proc.name,
        description: proc.description
      });
    });

    return allProcesses;
  }
}