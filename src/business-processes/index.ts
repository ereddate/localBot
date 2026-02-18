/**
 * Business Process Models Index
 * Export all business process models and managers
 */

// Sales Process Model
export { 
  customerDevelopmentProcess, 
  opportunityManagementProcess, 
  salesPerformanceAnalysisProcess,
  SalesProcessData 
} from './SalesProcessModel';

// Finance Process Model
export {
  budgetManagementProcess,
  expenseReimbursementProcess,
  financialReportingProcess,
  taxProcessingProcess,
  FinanceProcessData
} from './FinanceProcessModel';



// Operations Process Model
export {
  supplyChainManagementProcess,
  productionPlanningProcess,
  qualityManagementProcess,
  inventoryControlProcess,
  OperationsProcessData
} from './OperationsProcessModel';

// Human Resources Process Model
export {
  recruitmentProcess,
  onboardingProcess,
  performanceEvaluationProcess,
  trainingDevelopmentProcess,
  HRProcessData
} from './HRProcessModel';

// Home Automation Process Model
export {
  smartHomeControlProcess,
  homeMaintenanceProcess,
  homeFinanceProcess,
  healthFitnessProcess,
  homeActivityProcess,
  HomeAutomationData
} from './HomeAutomationModel';

// Tax Planning Process Model
export {
  corporateTaxPlanningProcess,
  individualTaxPlanningProcess,
  automatedTaxFilingProcess,
  taxComplianceMonitoringProcess,
  TaxPlanningData
} from './TaxPlanningModel';

// Project Management Process Model
export {
  projectInitiationProcess,
  projectPlanningProcess,
  projectExecutionMonitoringProcess,
  projectClosureProcess,
  ProjectManagementData
} from './ProjectManagementModel';

// CRM Process Model
export {
  customerAcquisitionProcess,
  customerRelationshipManagementProcess,
  customerSatisfactionImprovementProcess,
  customerLoyaltyManagementProcess,
  CRMData
} from './CRMModel';

// Marketing Process Model
export {
  marketResearchProcess,
  marketingCampaignProcess,
  brandManagementProcess,
  marketingAnalyticsProcess,
  MarketingData
} from './MarketingModel';

// Legal Compliance Process Model
export {
  regulatoryMonitoringProcess,
  complianceAssessmentProcess,
  complianceRiskManagementProcess,
  complianceReportingGovernanceProcess,
  LegalComplianceData
} from './LegalComplianceModel';

// Data Analytics Report Process Model
export {
  dataCollectionIntegrationProcess,
  dataAnalysisMiningProcess,
  dataVisualizationDashboardProcess,
  reportGenerationDistributionProcess,
  DataAnalyticsReportData
} from './DataAnalyticsReportModel';

// Personal Assistant Process Model
export {
  personalAssistantProcess,
  healthWellnessProcess,
  learningEducationProcess,
  personalFinanceProcess,
  informationManagementProcess,
  PersonalAssistantData
} from './PersonalAssistantModel';

// Business Process Manager
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
  PersonalAssistantProcessType,
  BusinessProcessExecutionOptions
} from './BusinessProcessManager';

// Type Definitions
export type {
  WorkflowDefinition
} from '../tasks/WorkflowEngine';