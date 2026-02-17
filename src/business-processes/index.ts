/**
 * 业务流程模型索引
 * 导出所有业务流程模型和管理器
 */

// 销售流程模型
export { 
  customerDevelopmentProcess, 
  opportunityManagementProcess, 
  salesPerformanceAnalysisProcess,
  SalesProcessData 
} from './SalesProcessModel';

// 财务流程模型
export { 
  budgetManagementProcess, 
  expenseReimbursementProcess, 
  financialReportingProcess, 
  taxProcessingProcess,
  FinanceProcessData 
} from './FinanceProcessModel';

// 运营流程模型
export { 
  supplyChainManagementProcess, 
  productionPlanningProcess, 
  qualityManagementProcess, 
  inventoryControlProcess,
  OperationsProcessData 
} from './OperationsProcessModel';

// 人力资源流程模型
export { 
  recruitmentProcess, 
  onboardingProcess, 
  performanceEvaluationProcess, 
  trainingDevelopmentProcess,
  HRProcessData 
} from './HRProcessModel';

// 业务流程管理器
export { 
  BusinessProcessManager, 
  BusinessDomain, 
  SalesProcessType, 
  FinanceProcessType, 
  OperationsProcessType, 
  HRProcessType,
  BusinessProcessExecutionOptions
} from './BusinessProcessManager';

// 类型定义
export type { 
  WorkflowDefinition 
} from '../tasks/WorkflowEngine';