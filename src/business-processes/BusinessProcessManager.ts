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
import { 
  smartHomeControlProcess,
  homeMaintenanceProcess,
  homeFinanceProcess,
  healthFitnessProcess,
  homeActivityProcess
} from './HomeAutomationModel';
import {
  corporateTaxPlanningProcess,
  individualTaxPlanningProcess,
  automatedTaxFilingProcess,
  taxComplianceMonitoringProcess
} from './TaxPlanningModel';
import {
  projectInitiationProcess,
  projectPlanningProcess,
  projectExecutionMonitoringProcess,
  projectClosureProcess
} from './ProjectManagementModel';
import {
  customerAcquisitionProcess,
  customerRelationshipManagementProcess,
  customerSatisfactionImprovementProcess,
  customerLoyaltyManagementProcess
} from './CRMModel';
import {
  marketResearchProcess,
  marketingCampaignProcess,
  brandManagementProcess,
  marketingAnalyticsProcess
} from './MarketingModel';
import {
  regulatoryMonitoringProcess,
  complianceAssessmentProcess,
  complianceRiskManagementProcess,
  complianceReportingGovernanceProcess
} from './LegalComplianceModel';
import {
  dataCollectionIntegrationProcess,
  dataAnalysisMiningProcess,
  dataVisualizationDashboardProcess,
  reportGenerationDistributionProcess
} from './DataAnalyticsReportModel';
import {
  personalAssistantProcess,
  healthWellnessProcess,
  learningEducationProcess,
  personalFinanceProcess,
  informationManagementProcess
} from './PersonalAssistantModel';
import { Logger } from '../utils/Logger';
import { ApiResponseFactory } from '../api/ApiResponse';

export enum BusinessDomain {
  SALES = 'sales',
  FINANCE = 'finance',
  OPERATIONS = 'operations',
  HR = 'human_resources',
  HOME_AUTOMATION = 'home_automation',
  TAX_PLANNING = 'tax_planning',
  PROJECT_MANAGEMENT = 'project_management',
  CRM = 'customer_relationship_management',
  MARKETING = 'marketing',
  LEGAL_COMPLIANCE = 'legal_compliance',
  DATA_ANALYTICS = 'data_analytics',
  PERSONAL_ASSISTANT = 'personal_assistant'
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

export enum HomeAutomationProcessType {
  SMART_HOME_CONTROL = 'smart-home-control-process',
  HOME_MAINTENANCE = 'home-maintenance-process',
  HOME_FINANCE = 'home-finance-process',
  HEALTH_FITNESS = 'health-fitness-process',
  HOME_ACTIVITY = 'home-activity-process'
}

export enum TaxPlanningProcessType {
  CORPORATE_TAX_PLANNING = 'corporate-tax-planning-process',
  INDIVIDUAL_TAX_PLANNING = 'individual-tax-planning-process',
  AUTOMATED_TAX_FILING = 'automated-tax-filing-process',
  TAX_COMPLIANCE_MONITORING = 'tax-compliance-monitoring-process'
}

export enum ProjectManagementProcessType {
  PROJECT_INITIATION = 'project-initiation-process',
  PROJECT_PLANNING = 'project-planning-process',
  PROJECT_EXECUTION_MONITORING = 'project-execution-monitoring-process',
  PROJECT_CLOSURE = 'project-closure-process'
}

export enum CRMProcessType {
  CUSTOMER_ACQUISITION = 'customer-acquisition-process',
  CUSTOMER_RELATIONSHIP_MANAGEMENT = 'customer-relationship-management-process',
  CUSTOMER_SATISFACTION_IMPROVEMENT = 'customer-satisfaction-improvement-process',
  CUSTOMER_LOYALTY_MANAGEMENT = 'customer-loyalty-management-process'
}

export enum MarketingProcessType {
  MARKET_RESEARCH = 'market-research-process',
  MARKETING_CAMPAIGN = 'marketing-campaign-process',
  BRAND_MANAGEMENT = 'brand-management-process',
  MARKETING_ANALYTICS = 'marketing-analytics-process'
}

export enum LegalComplianceProcessType {
  REGULATORY_MONITORING = 'regulatory-monitoring-process',
  COMPLIANCE_ASSESSMENT = 'compliance-assessment-process',
  COMPLIANCE_RISK_MANAGEMENT = 'compliance-risk-management-process',
  COMPLIANCE_REPORTING_GOVERNANCE = 'compliance-reporting-governance-process'
}

export enum DataAnalyticsProcessType {
  DATA_COLLECTION_INTEGRATION = 'data-collection-integration-process',
  DATA_ANALYSIS_MINING = 'data-analysis-mining-process',
  DATA_VISUALIZATION_DASHBOARD = 'data-visualization-dashboard-process',
  REPORT_GENERATION_DISTRIBUTION = 'report-generation-distribution-process'
}

export enum PersonalAssistantProcessType {
  PERSONAL_ASSISTANT = 'personal-assistant-process',
  HEALTH_WELLNESS = 'health-wellness-process',
  LEARNING_EDUCATION = 'learning-education-process',
  PERSONAL_FINANCE = 'personal-finance-process',
  INFORMATION_MANAGEMENT = 'information-management-process'
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
      case BusinessDomain.HOME_AUTOMATION:
        return [
          smartHomeControlProcess,
          homeMaintenanceProcess,
          homeFinanceProcess,
          healthFitnessProcess,
          homeActivityProcess
        ];
      case BusinessDomain.TAX_PLANNING:
        return [
          corporateTaxPlanningProcess,
          individualTaxPlanningProcess,
          automatedTaxFilingProcess,
          taxComplianceMonitoringProcess
        ];
      case BusinessDomain.PROJECT_MANAGEMENT:
        return [
          projectInitiationProcess,
          projectPlanningProcess,
          projectExecutionMonitoringProcess,
          projectClosureProcess
        ];
      case BusinessDomain.CRM:
        return [
          customerAcquisitionProcess,
          customerRelationshipManagementProcess,
          customerSatisfactionImprovementProcess,
          customerLoyaltyManagementProcess
        ];
      case BusinessDomain.MARKETING:
        return [
          marketResearchProcess,
          marketingCampaignProcess,
          brandManagementProcess,
          marketingAnalyticsProcess
        ];
      case BusinessDomain.LEGAL_COMPLIANCE:
        return [
          regulatoryMonitoringProcess,
          complianceAssessmentProcess,
          complianceRiskManagementProcess,
          complianceReportingGovernanceProcess
        ];
      case BusinessDomain.DATA_ANALYTICS:
        return [
          dataCollectionIntegrationProcess,
          dataAnalysisMiningProcess,
          dataVisualizationDashboardProcess,
          reportGenerationDistributionProcess
        ];
      case BusinessDomain.PERSONAL_ASSISTANT:
        return [
          personalAssistantProcess,
          healthWellnessProcess,
          learningEducationProcess,
          personalFinanceProcess,
          informationManagementProcess
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
      console.log(`🔄 开始执行销售流程: ${processType}`);
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
        console.log(`🔧 注册工具: ${tool.name} (${tool.category})`);
      });
      
      console.log(`🚀 启动工作流执行: ${processDefinition.name}`);
      const result = await this.workflowEngine.execute(processDefinition, options.inputData || {}, allTools);
      console.log(`✅ 销售流程完成: ${processType}`);
      
      return result;
    } catch (error) {
      console.log(`💥 销售流程执行失败: ${processType}`, { error: (error as Error).message });
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
   * 执行家庭自动化流程
   */
  public async executeHomeAutomationProcess(
    processType: HomeAutomationProcessType,
    options: BusinessProcessExecutionOptions
  ): Promise<any> {
    try {
      Logger.info(`Executing home automation process: ${processType}`, { processId: options.processId });
      
      let processDefinition;
      switch (processType) {
        case HomeAutomationProcessType.SMART_HOME_CONTROL:
          processDefinition = smartHomeControlProcess;
          break;
        case HomeAutomationProcessType.HOME_MAINTENANCE:
          processDefinition = homeMaintenanceProcess;
          break;
        case HomeAutomationProcessType.HOME_FINANCE:
          processDefinition = homeFinanceProcess;
          break;
        case HomeAutomationProcessType.HEALTH_FITNESS:
          processDefinition = healthFitnessProcess;
          break;
        case HomeAutomationProcessType.HOME_ACTIVITY:
          processDefinition = homeActivityProcess;
          break;
        default:
          throw new Error(`Unknown home automation process type: ${processType}`);
      }

      // Get all available tools from skill manager
      const allTools = new Map<string, any>();
      this.skillManager.getAllTools().forEach(tool => {
        allTools.set(tool.name, tool);
      });
      
      return await this.workflowEngine.execute(processDefinition, options.inputData || {}, allTools);
    } catch (error) {
      Logger.error(`Error executing home automation process ${processType}`, { error: (error as Error).message, processId: options.processId });
      throw error;
    }
  }

  /**
   * Execute tax planning business process
   */
  public async executeTaxPlanningProcess(
    processType: TaxPlanningProcessType,
    options: BusinessProcessExecutionOptions
  ): Promise<any> {
    try {
      Logger.info(`Executing tax planning process: ${processType}`, { processId: options.processId });
      
      let processDefinition;
      switch (processType) {
        case TaxPlanningProcessType.CORPORATE_TAX_PLANNING:
          processDefinition = corporateTaxPlanningProcess;
          break;
        case TaxPlanningProcessType.INDIVIDUAL_TAX_PLANNING:
          processDefinition = individualTaxPlanningProcess;
          break;
        case TaxPlanningProcessType.AUTOMATED_TAX_FILING:
          processDefinition = automatedTaxFilingProcess;
          break;
        case TaxPlanningProcessType.TAX_COMPLIANCE_MONITORING:
          processDefinition = taxComplianceMonitoringProcess;
          break;
        default:
          throw new Error(`Unknown tax planning process type: ${processType}`);
      }

      // Get all available tools from skill manager
      const allTools = new Map<string, any>();
      this.skillManager.getAllTools().forEach(tool => {
        allTools.set(tool.name, tool);
      });
      
      return await this.workflowEngine.execute(processDefinition, options.inputData || {}, allTools);
    } catch (error) {
      Logger.error(`Error executing tax planning process ${processType}`, { error: (error as Error).message, processId: options.processId });
      throw error;
    }
  }

  /**
   * Execute project management business process
   */
  public async executeProjectManagementProcess(
    processType: ProjectManagementProcessType,
    options: BusinessProcessExecutionOptions
  ): Promise<any> {
    try {
      Logger.info(`Executing project management process: ${processType}`, { processId: options.processId });
      
      let processDefinition;
      switch (processType) {
        case ProjectManagementProcessType.PROJECT_INITIATION:
          processDefinition = projectInitiationProcess;
          break;
        case ProjectManagementProcessType.PROJECT_PLANNING:
          processDefinition = projectPlanningProcess;
          break;
        case ProjectManagementProcessType.PROJECT_EXECUTION_MONITORING:
          processDefinition = projectExecutionMonitoringProcess;
          break;
        case ProjectManagementProcessType.PROJECT_CLOSURE:
          processDefinition = projectClosureProcess;
          break;
        default:
          throw new Error(`Unknown project management process type: ${processType}`);
      }

      // Get all available tools from skill manager
      const allTools = new Map<string, any>();
      this.skillManager.getAllTools().forEach(tool => {
        allTools.set(tool.name, tool);
      });
      
      return await this.workflowEngine.execute(processDefinition, options.inputData || {}, allTools);
    } catch (error) {
      Logger.error(`Error executing project management process ${processType}`, { error: (error as Error).message, processId: options.processId });
      throw error;
    }
  }

  /**
   * Execute CRM business process
   */
  public async executeCRMProcess(
    processType: CRMProcessType,
    options: BusinessProcessExecutionOptions
  ): Promise<any> {
    try {
      Logger.info(`Executing CRM process: ${processType}`, { processId: options.processId });
      
      let processDefinition;
      switch (processType) {
        case CRMProcessType.CUSTOMER_ACQUISITION:
          processDefinition = customerAcquisitionProcess;
          break;
        case CRMProcessType.CUSTOMER_RELATIONSHIP_MANAGEMENT:
          processDefinition = customerRelationshipManagementProcess;
          break;
        case CRMProcessType.CUSTOMER_SATISFACTION_IMPROVEMENT:
          processDefinition = customerSatisfactionImprovementProcess;
          break;
        case CRMProcessType.CUSTOMER_LOYALTY_MANAGEMENT:
          processDefinition = customerLoyaltyManagementProcess;
          break;
        default:
          throw new Error(`Unknown CRM process type: ${processType}`);
      }

      // Get all available tools from skill manager
      const allTools = new Map<string, any>();
      this.skillManager.getAllTools().forEach(tool => {
        allTools.set(tool.name, tool);
      });
      
      return await this.workflowEngine.execute(processDefinition, options.inputData || {}, allTools);
    } catch (error) {
      Logger.error(`Error executing CRM process ${processType}`, { error: (error as Error).message, processId: options.processId });
      throw error;
    }
  }

  /**
   * Execute marketing business process
   */
  public async executeMarketingProcess(
    processType: MarketingProcessType,
    options: BusinessProcessExecutionOptions
  ): Promise<any> {
    try {
      Logger.info(`Executing marketing process: ${processType}`, { processId: options.processId });
      
      let processDefinition;
      switch (processType) {
        case MarketingProcessType.MARKET_RESEARCH:
          processDefinition = marketResearchProcess;
          break;
        case MarketingProcessType.MARKETING_CAMPAIGN:
          processDefinition = marketingCampaignProcess;
          break;
        case MarketingProcessType.BRAND_MANAGEMENT:
          processDefinition = brandManagementProcess;
          break;
        case MarketingProcessType.MARKETING_ANALYTICS:
          processDefinition = marketingAnalyticsProcess;
          break;
        default:
          throw new Error(`Unknown marketing process type: ${processType}`);
      }

      // Get all available tools from skill manager
      const allTools = new Map<string, any>();
      this.skillManager.getAllTools().forEach(tool => {
        allTools.set(tool.name, tool);
      });
      
      return await this.workflowEngine.execute(processDefinition, options.inputData || {}, allTools);
    } catch (error) {
      Logger.error(`Error executing marketing process ${processType}`, { error: (error as Error).message, processId: options.processId });
      throw error;
    }
  }

  /**
   * Execute legal compliance business process
   */
  public async executeLegalComplianceProcess(
    processType: LegalComplianceProcessType,
    options: BusinessProcessExecutionOptions
  ): Promise<any> {
    try {
      Logger.info(`Executing legal compliance process: ${processType}`, { processId: options.processId });
      
      let processDefinition;
      switch (processType) {
        case LegalComplianceProcessType.REGULATORY_MONITORING:
          processDefinition = regulatoryMonitoringProcess;
          break;
        case LegalComplianceProcessType.COMPLIANCE_ASSESSMENT:
          processDefinition = complianceAssessmentProcess;
          break;
        case LegalComplianceProcessType.COMPLIANCE_RISK_MANAGEMENT:
          processDefinition = complianceRiskManagementProcess;
          break;
        case LegalComplianceProcessType.COMPLIANCE_REPORTING_GOVERNANCE:
          processDefinition = complianceReportingGovernanceProcess;
          break;
        default:
          throw new Error(`Unknown legal compliance process type: ${processType}`);
      }

      // Get all available tools from skill manager
      const allTools = new Map<string, any>();
      this.skillManager.getAllTools().forEach(tool => {
        allTools.set(tool.name, tool);
      });
      
      return await this.workflowEngine.execute(processDefinition, options.inputData || {}, allTools);
    } catch (error) {
      Logger.error(`Error executing legal compliance process ${processType}`, { error: (error as Error).message, processId: options.processId });
      throw error;
    }
  }

  /**
   * Execute data analytics business process
   */
  public async executeDataAnalyticsProcess(
    processType: DataAnalyticsProcessType,
    options: BusinessProcessExecutionOptions
  ): Promise<any> {
    try {
      Logger.info(`Executing data analytics process: ${processType}`, { processId: options.processId });
      
      let processDefinition;
      switch (processType) {
        case DataAnalyticsProcessType.DATA_COLLECTION_INTEGRATION:
          processDefinition = dataCollectionIntegrationProcess;
          break;
        case DataAnalyticsProcessType.DATA_ANALYSIS_MINING:
          processDefinition = dataAnalysisMiningProcess;
          break;
        case DataAnalyticsProcessType.DATA_VISUALIZATION_DASHBOARD:
          processDefinition = dataVisualizationDashboardProcess;
          break;
        case DataAnalyticsProcessType.REPORT_GENERATION_DISTRIBUTION:
          processDefinition = reportGenerationDistributionProcess;
          break;
        default:
          throw new Error(`Unknown data analytics process type: ${processType}`);
      }

      // Get all available tools from skill manager
      const allTools = new Map<string, any>();
      this.skillManager.getAllTools().forEach(tool => {
        allTools.set(tool.name, tool);
      });
      
      return await this.workflowEngine.execute(processDefinition, options.inputData || {}, allTools);
    } catch (error) {
      Logger.error(`Error executing data analytics process ${processType}`, { error: (error as Error).message, processId: options.processId });
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
    console.log(`🤖 分析业务需求: "${requirement}"`);
    Logger.info('Analyzing business requirement', { requirement });
    
    // 简单的关键词匹配来确定业务领域和流程类型
    const requirementLower = requirement.toLowerCase();
    
    // 销售相关
    if (requirementLower.includes('sale') || requirementLower.includes('customer') || 
        requirementLower.includes('lead') || requirementLower.includes('opportunity')) {
      console.log(`📊 匹配到销售相关需求，执行销售流程`);
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
    // 家庭自动化相关
    else if (requirementLower.includes('smart') || requirementLower.includes('home') || 
             requirementLower.includes('iot') || requirementLower.includes('automat') || 
             requirementLower.includes('device') || requirementLower.includes('schedule') ||
             requirementLower.includes('maintenance') || requirementLower.includes('finance') ||
             requirementLower.includes('health') || requirementLower.includes('fitness') ||
             requirementLower.includes('family') || requirementLower.includes('vacation')) {
      if (requirementLower.includes('smart') || requirementLower.includes('iot') || 
          requirementLower.includes('device') || requirementLower.includes('light') ||
          requirementLower.includes('temperature') || requirementLower.includes('thermostat')) {
        return await this.executeHomeAutomationProcess(HomeAutomationProcessType.SMART_HOME_CONTROL, options);
      } else if (requirementLower.includes('mainten') || requirementLower.includes('repair') ||
                 requirementLower.includes('check') || requirementLower.includes('service')) {
        return await this.executeHomeAutomationProcess(HomeAutomationProcessType.HOME_MAINTENANCE, options);
      } else if (requirementLower.includes('finance') || requirementLower.includes('budget') ||
                 requirementLower.includes('expense') || requirementLower.includes('payment') ||
                 requirementLower.includes('savings') || requirementLower.includes('money')) {
        return await this.executeHomeAutomationProcess(HomeAutomationProcessType.HOME_FINANCE, options);
      } else if (requirementLower.includes('health') || requirementLower.includes('fitness') ||
                 requirementLower.includes('exercise') || requirementLower.includes('meal') ||
                 requirementLower.includes('nutrition') || requirementLower.includes('doctor')) {
        return await this.executeHomeAutomationProcess(HomeAutomationProcessType.HEALTH_FITNESS, options);
      } else if (requirementLower.includes('event') || requirementLower.includes('vacation') ||
                 requirementLower.includes('schedule') || requirementLower.includes('calendar') ||
                 requirementLower.includes('activity') || requirementLower.includes('planning')) {
        return await this.executeHomeAutomationProcess(HomeAutomationProcessType.HOME_ACTIVITY, options);
      } else {
        // 默认使用智能家居控制流程
        return await this.executeHomeAutomationProcess(HomeAutomationProcessType.SMART_HOME_CONTROL, options);
      }
    }
    // 项目管理相关
    else if (requirementLower.includes('project') || requirementLower.includes('manage') || 
             requirementLower.includes('schedule') || requirementLower.includes('timeline') || 
             requirementLower.includes('milestone') || requirementLower.includes('gantt') ||
             requirementLower.includes('wbs') || requirementLower.includes('resource') ||
             requirementLower.includes('budget') || requirementLower.includes('scope')) {
      if (requirementLower.includes('initiat') || requirementLower.includes('charter')) {
        return await this.executeProjectManagementProcess(ProjectManagementProcessType.PROJECT_INITIATION, options);
      } else if (requirementLower.includes('plan') || requirementLower.includes('schedule') || requirementLower.includes('budget')) {
        return await this.executeProjectManagementProcess(ProjectManagementProcessType.PROJECT_PLANNING, options);
      } else if (requirementLower.includes('execut') || requirementLower.includes('monitor') || requirementLower.includes('track')) {
        return await this.executeProjectManagementProcess(ProjectManagementProcessType.PROJECT_EXECUTION_MONITORING, options);
      } else if (requirementLower.includes('close') || requirementLower.includes('closure') || requirementLower.includes('wrap')) {
        return await this.executeProjectManagementProcess(ProjectManagementProcessType.PROJECT_CLOSURE, options);
      } else {
        // 默认使用项目规划流程
        return await this.executeProjectManagementProcess(ProjectManagementProcessType.PROJECT_PLANNING, options);
      }
    }
    // CRM相关
    else if (requirementLower.includes('customer') || requirementLower.includes('client') || 
             requirementLower.includes('lead') || requirementLower.includes('prospect') || 
             requirementLower.includes('relationship') || requirementLower.includes('satisfact') ||
             requirementLower.includes('loyalty') || requirementLower.includes('retent') ||
             requirementLower.includes('feedback') || requirementLower.includes('support')) {
      if (requirementLower.includes('acquisit') || requirementLower.includes('prospect') || requirementLower.includes('lead_gen')) {
        return await this.executeCRMProcess(CRMProcessType.CUSTOMER_ACQUISITION, options);
      } else if (requirementLower.includes('relationship') || requirementLower.includes('maintain') || requirementLower.includes('communicat')) {
        return await this.executeCRMProcess(CRMProcessType.CUSTOMER_RELATIONSHIP_MANAGEMENT, options);
      } else if (requirementLower.includes('satisfact') || requirementLower.includes('feedback') || requirementLower.includes('improv')) {
        return await this.executeCRMProcess(CRMProcessType.CUSTOMER_SATISFACTION_IMPROVEMENT, options);
      } else if (requirementLower.includes('loyalty') || requirementLower.includes('retent') || requirementLower.includes('advocacy')) {
        return await this.executeCRMProcess(CRMProcessType.CUSTOMER_LOYALTY_MANAGEMENT, options);
      } else {
        // 默认使用客户关系管理流程
        return await this.executeCRMProcess(CRMProcessType.CUSTOMER_RELATIONSHIP_MANAGEMENT, options);
      }
    }
    // 市场营销相关
    else if (requirementLower.includes('market') || requirementLower.includes('research') || 
             requirementLower.includes('campaign') || requirementLower.includes('brand') || 
             requirementLower.includes('advertis') || requirementLower.includes('promotion') ||
             requirementLower.includes('audience') || requirementLower.includes('content') ||
             requirementLower.includes('social') || requirementLower.includes('seo') ||
             requirementLower.includes('marketing')) {
      if (requirementLower.includes('research') || requirementLower.includes('study') || requirementLower.includes('analyze')) {
        return await this.executeMarketingProcess(MarketingProcessType.MARKET_RESEARCH, options);
      } else if (requirementLower.includes('campaign') || requirementLower.includes('advertis') || requirementLower.includes('promo')) {
        return await this.executeMarketingProcess(MarketingProcessType.MARKETING_CAMPAIGN, options);
      } else if (requirementLower.includes('brand') || requirementLower.includes('identity') || requirementLower.includes('reputat')) {
        return await this.executeMarketingProcess(MarketingProcessType.BRAND_MANAGEMENT, options);
      } else if (requirementLower.includes('analytic') || requirementLower.includes('metric') || requirementLower.includes('roi')) {
        return await this.executeMarketingProcess(MarketingProcessType.MARKETING_ANALYTICS, options);
      } else {
        // 默认使用营销活动流程
        return await this.executeMarketingProcess(MarketingProcessType.MARKETING_CAMPAIGN, options);
      }
    }
    // 法律合规相关
    else if (requirementLower.includes('compliance') || requirementLower.includes('legal') || 
             requirementLower.includes('regulatory') || requirementLower.includes('risk') || 
             requirementLower.includes('audit') || requirementLower.includes('governance') ||
             requirementLower.includes('policy') || requirementLower.includes('procedure') ||
             requirementLower.includes('control') || requirementLower.includes('regulat')) {
      if (requirementLower.includes('monitor') || requirementLower.includes('track') || requirementLower.includes('update')) {
        return await this.executeLegalComplianceProcess(LegalComplianceProcessType.REGULATORY_MONITORING, options);
      } else if (requirementLower.includes('audit') || requirementLower.includes('assess') || requirementLower.includes('gap')) {
        return await this.executeLegalComplianceProcess(LegalComplianceProcessType.COMPLIANCE_ASSESSMENT, options);
      } else if (requirementLower.includes('risk') || requirementLower.includes('threat') || requirementLower.includes('mitigat')) {
        return await this.executeLegalComplianceProcess(LegalComplianceProcessType.COMPLIANCE_RISK_MANAGEMENT, options);
      } else if (requirementLower.includes('report') || requirementLower.includes('governance') || requirementLower.includes('dashboard')) {
        return await this.executeLegalComplianceProcess(LegalComplianceProcessType.COMPLIANCE_REPORTING_GOVERNANCE, options);
      } else {
        // 默认使用合规评估流程
        return await this.executeLegalComplianceProcess(LegalComplianceProcessType.COMPLIANCE_ASSESSMENT, options);
      }
    }
    // 数据分析相关
    else if (requirementLower.includes('data') || requirementLower.includes('analytic') || 
             requirementLower.includes('report') || requirementLower.includes('dashboard') || 
             requirementLower.includes('visualization') || requirementLower.includes('insight') ||
             requirementLower.includes('metrics') || requirementLower.includes('kpi') ||
             requirementLower.includes('business_intelligence') || requirementLower.includes('bi')) {
      if (requirementLower.includes('collect') || requirementLower.includes('integrat') || requirementLower.includes('etl')) {
        return await this.executeDataAnalyticsProcess(DataAnalyticsProcessType.DATA_COLLECTION_INTEGRATION, options);
      } else if (requirementLower.includes('analyz') || requirementLower.includes('model') || requirementLower.includes('predict')) {
        return await this.executeDataAnalyticsProcess(DataAnalyticsProcessType.DATA_ANALYSIS_MINING, options);
      } else if (requirementLower.includes('visualiz') || requirementLower.includes('chart') || requirementLower.includes('dashboard')) {
        return await this.executeDataAnalyticsProcess(DataAnalyticsProcessType.DATA_VISUALIZATION_DASHBOARD, options);
      } else if (requirementLower.includes('report') || requirementLower.includes('distribut') || requirementLower.includes('present')) {
        return await this.executeDataAnalyticsProcess(DataAnalyticsProcessType.REPORT_GENERATION_DISTRIBUTION, options);
      } else {
        // 默认使用数据分析流程
        return await this.executeDataAnalyticsProcess(DataAnalyticsProcessType.DATA_ANALYSIS_MINING, options);
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

    // 添加家庭自动化流程
    [
      { type: HomeAutomationProcessType.SMART_HOME_CONTROL, ...smartHomeControlProcess },
      { type: HomeAutomationProcessType.HOME_MAINTENANCE, ...homeMaintenanceProcess },
      { type: HomeAutomationProcessType.HOME_FINANCE, ...homeFinanceProcess },
      { type: HomeAutomationProcessType.HEALTH_FITNESS, ...healthFitnessProcess },
      { type: HomeAutomationProcessType.HOME_ACTIVITY, ...homeActivityProcess }
    ].forEach(proc => {
      allProcesses.push({
        domain: BusinessDomain.HOME_AUTOMATION,
        type: proc.type,
        name: proc.name,
        description: proc.description
      });
    });

    // 添加税务规划流程
    [
      { type: TaxPlanningProcessType.CORPORATE_TAX_PLANNING, ...corporateTaxPlanningProcess },
      { type: TaxPlanningProcessType.INDIVIDUAL_TAX_PLANNING, ...individualTaxPlanningProcess },
      { type: TaxPlanningProcessType.AUTOMATED_TAX_FILING, ...automatedTaxFilingProcess },
      { type: TaxPlanningProcessType.TAX_COMPLIANCE_MONITORING, ...taxComplianceMonitoringProcess }
    ].forEach(proc => {
      allProcesses.push({
        domain: BusinessDomain.TAX_PLANNING,
        type: proc.type,
        name: proc.name,
        description: proc.description
      });
    });

    // 添加项目管理流程
    [
      { type: ProjectManagementProcessType.PROJECT_INITIATION, ...projectInitiationProcess },
      { type: ProjectManagementProcessType.PROJECT_PLANNING, ...projectPlanningProcess },
      { type: ProjectManagementProcessType.PROJECT_EXECUTION_MONITORING, ...projectExecutionMonitoringProcess },
      { type: ProjectManagementProcessType.PROJECT_CLOSURE, ...projectClosureProcess }
    ].forEach(proc => {
      allProcesses.push({
        domain: BusinessDomain.PROJECT_MANAGEMENT,
        type: proc.type,
        name: proc.name,
        description: proc.description
      });
    });

    // 添加CRM流程
    [
      { type: CRMProcessType.CUSTOMER_ACQUISITION, ...customerAcquisitionProcess },
      { type: CRMProcessType.CUSTOMER_RELATIONSHIP_MANAGEMENT, ...customerRelationshipManagementProcess },
      { type: CRMProcessType.CUSTOMER_SATISFACTION_IMPROVEMENT, ...customerSatisfactionImprovementProcess },
      { type: CRMProcessType.CUSTOMER_LOYALTY_MANAGEMENT, ...customerLoyaltyManagementProcess }
    ].forEach(proc => {
      allProcesses.push({
        domain: BusinessDomain.CRM,
        type: proc.type,
        name: proc.name,
        description: proc.description
      });
    });

    // 添加市场营销流程
    [
      { type: MarketingProcessType.MARKET_RESEARCH, ...marketResearchProcess },
      { type: MarketingProcessType.MARKETING_CAMPAIGN, ...marketingCampaignProcess },
      { type: MarketingProcessType.BRAND_MANAGEMENT, ...brandManagementProcess },
      { type: MarketingProcessType.MARKETING_ANALYTICS, ...marketingAnalyticsProcess }
    ].forEach(proc => {
      allProcesses.push({
        domain: BusinessDomain.MARKETING,
        type: proc.type,
        name: proc.name,
        description: proc.description
      });
    });

    // 添加法律合规流程
    [
      { type: LegalComplianceProcessType.REGULATORY_MONITORING, ...regulatoryMonitoringProcess },
      { type: LegalComplianceProcessType.COMPLIANCE_ASSESSMENT, ...complianceAssessmentProcess },
      { type: LegalComplianceProcessType.COMPLIANCE_RISK_MANAGEMENT, ...complianceRiskManagementProcess },
      { type: LegalComplianceProcessType.COMPLIANCE_REPORTING_GOVERNANCE, ...complianceReportingGovernanceProcess }
    ].forEach(proc => {
      allProcesses.push({
        domain: BusinessDomain.LEGAL_COMPLIANCE,
        type: proc.type,
        name: proc.name,
        description: proc.description
      });
    });

    // 添加数据分析流程
    [
      { type: DataAnalyticsProcessType.DATA_COLLECTION_INTEGRATION, ...dataCollectionIntegrationProcess },
      { type: DataAnalyticsProcessType.DATA_ANALYSIS_MINING, ...dataAnalysisMiningProcess },
      { type: DataAnalyticsProcessType.DATA_VISUALIZATION_DASHBOARD, ...dataVisualizationDashboardProcess },
      { type: DataAnalyticsProcessType.REPORT_GENERATION_DISTRIBUTION, ...reportGenerationDistributionProcess }
    ].forEach(proc => {
      allProcesses.push({
        domain: BusinessDomain.DATA_ANALYTICS,
        type: proc.type,
        name: proc.name,
        description: proc.description
      });
    });

    return allProcesses;
  }

  /**
   * 执行业务流程并返回标准化的API响应
   */
  async executeBusinessProcessWithStandardResponse(
    requirement: string, 
    options: BusinessProcessExecutionOptions, 
    requestId?: string
  ) {
    try {
      console.log(`🤖 分析业务需求 (API): "${requirement}"`);
      Logger.info('Analyzing business requirement via API', { requirement, requestId });
      
      const result = await this.executeBusinessProcessByRequirement(requirement, options);
      
      return ApiResponseFactory.success(
        result, 
        'Business process executed successfully', 
        requestId
      );
    } catch (error: any) {
      console.log(`❌ 业务流程执行失败 (API): ${error.message}`);
      Logger.error('Error executing business process via API', { 
        error: error.message, 
        requirement, 
        requestId 
      });
      
      return ApiResponseFactory.internalError(
        error.message, 
        requestId
      );
    }
  }

  /**
   * 获取所有业务流程并返回标准化的API响应
   */
  getAllBusinessProcessesWithStandardResponse(requestId?: string) {
    try {
      const processes = this.getAllBusinessProcesses();
      
      return ApiResponseFactory.success(
        processes, 
        'Business processes retrieved successfully', 
        requestId
      );
    } catch (error: any) {
      Logger.error('Error getting business processes via API', { 
        error: error.message, 
        requestId 
      });
      
      return ApiResponseFactory.internalError(
        error.message, 
        requestId
      );
    }
  }
}