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

// IT流程模型
export { 
  incidentManagementProcess, 
  changeManagementProcess, 
  problemManagementProcess, 
  serviceRequestProcess,
  ITProcessData 
} from './ITProcessModel';

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

// 家庭自动化流程模型
export { 
  smartHomeControlProcess,
  homeMaintenanceProcess,
  homeFinanceProcess,
  healthFitnessProcess,
  homeActivityProcess,
  HomeAutomationData 
} from './HomeAutomationModel';

// 税务规划流程模型
export { 
  corporateTaxPlanningProcess,
  individualTaxPlanningProcess,
  automatedTaxFilingProcess,
  taxComplianceMonitoringProcess,
  TaxPlanningData 
} from './TaxPlanningModel';

// 项目管理流程模型
export { 
  projectInitiationProcess,
  projectPlanningProcess,
  projectExecutionMonitoringProcess,
  projectClosureProcess,
  ProjectManagementData 
} from './ProjectManagementModel';

// CRM流程模型
export { 
  customerAcquisitionProcess,
  customerRelationshipManagementProcess,
  customerSatisfactionImprovementProcess,
  customerLoyaltyManagementProcess,
  CRMData 
} from './CRMModel';

// 市场营销流程模型
export { 
  marketResearchProcess,
  marketingCampaignProcess,
  brandManagementProcess,
  marketingAnalyticsProcess,
  MarketingData 
} from './MarketingModel';

// 法律合规流程模型
export { 
  regulatoryMonitoringProcess,
  complianceAssessmentProcess,
  complianceRiskManagementProcess,
  complianceReportingGovernanceProcess,
  LegalComplianceData 
} from './LegalComplianceModel';

// 数据分析报告流程模型
export { 
  dataCollectionIntegrationProcess,
  dataAnalysisMiningProcess,
  dataVisualizationDashboardProcess,
  reportGenerationDistributionProcess,
  DataAnalyticsReportData 
} from './DataAnalyticsReportModel';

// 业务流程管理器
export { 
  BusinessProcessManager, 
  BusinessDomain, 
  SalesProcessType, 
  FinanceProcessType, 
  OperationsProcessType, 
  HRProcessType,
  HomeAutomationProcessType,
  TaxPlanningProcessType,
  ProjectManagementProcessType,
  CRMProcessType,
  MarketingProcessType,
  LegalComplianceProcessType,
  DataAnalyticsProcessType,
  BusinessProcessExecutionOptions
} from './BusinessProcessManager';

// 类型定义
export type { 
  WorkflowDefinition 
} from '../tasks/WorkflowEngine';