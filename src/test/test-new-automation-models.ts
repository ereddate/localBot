/**
 * 测试新创建的业务流程模型
 */

import { 
  projectInitiationProcess,
  projectPlanningProcess,
  projectExecutionMonitoringProcess,
  projectClosureProcess
} from '../business-processes/ProjectManagementModel';

import {
  customerAcquisitionProcess,
  customerRelationshipManagementProcess,
  customerSatisfactionImprovementProcess,
  customerLoyaltyManagementProcess
} from '../business-processes/CRMModel';

import {
  marketResearchProcess,
  marketingCampaignProcess,
  brandManagementProcess,
  marketingAnalyticsProcess
} from '../business-processes/MarketingModel';

import {
  regulatoryMonitoringProcess,
  complianceAssessmentProcess,
  complianceRiskManagementProcess,
  complianceReportingGovernanceProcess
} from '../business-processes/LegalComplianceModel';

import {
  dataCollectionIntegrationProcess,
  dataAnalysisMiningProcess,
  dataVisualizationDashboardProcess,
  reportGenerationDistributionProcess
} from '../business-processes/DataAnalyticsReportModel';

import { BusinessProcessManager } from '../business-processes/BusinessProcessManager';
import { WorkflowEngine } from '../tasks/WorkflowEngine';
import { SkillManager } from '../skills/SkillManager';

console.log('🔍 开始测试新创建的业务流程模型...\n');

// 检查项目管理流程模型
console.log('📋 项目管理流程模型:');
console.log(`   - 项目启动流程步骤数: ${projectInitiationProcess.steps.length}`);
console.log(`   - 项目规划流程步骤数: ${projectPlanningProcess.steps.length}`);
console.log(`   - 项目执行监控流程步骤数: ${projectExecutionMonitoringProcess.steps.length}`);
console.log(`   - 项目收尾流程步骤数: ${projectClosureProcess.steps.length}`);

// 检查CRM流程模型
console.log('\n👥 CRM流程模型:');
console.log(`   - 客户获取流程步骤数: ${customerAcquisitionProcess.steps.length}`);
console.log(`   - 客户关系管理流程步骤数: ${customerRelationshipManagementProcess.steps.length}`);
console.log(`   - 客户满意度提升流程步骤数: ${customerSatisfactionImprovementProcess.steps.length}`);
console.log(`   - 客户忠诚度管理流程步骤数: ${customerLoyaltyManagementProcess.steps.length}`);

// 检查市场营销流程模型
console.log('\n📢 市场营销流程模型:');
console.log(`   - 市场研究流程步骤数: ${marketResearchProcess.steps.length}`);
console.log(`   - 营销活动流程步骤数: ${marketingCampaignProcess.steps.length}`);
console.log(`   - 品牌管理流程步骤数: ${brandManagementProcess.steps.length}`);
console.log(`   - 营销分析流程步骤数: ${marketingAnalyticsProcess.steps.length}`);

// 检查法律合规流程模型
console.log('\n⚖️ 法律合规流程模型:');
console.log(`   - 法规监控流程步骤数: ${regulatoryMonitoringProcess.steps.length}`);
console.log(`   - 合规评估流程步骤数: ${complianceAssessmentProcess.steps.length}`);
console.log(`   - 合规风险管理流程步骤数: ${complianceRiskManagementProcess.steps.length}`);
console.log(`   - 合规报告治理流程步骤数: ${complianceReportingGovernanceProcess.steps.length}`);

// 检查数据分析报告流程模型
console.log('\n📊 数据分析报告流程模型:');
console.log(`   - 数据收集整合流程步骤数: ${dataCollectionIntegrationProcess.steps.length}`);
console.log(`   - 数据分析挖掘流程步骤数: ${dataAnalysisMiningProcess.steps.length}`);
console.log(`   - 数据可视化仪表板流程步骤数: ${dataVisualizationDashboardProcess.steps.length}`);
console.log(`   - 报告生成分发流程步骤数: ${reportGenerationDistributionProcess.steps.length}`);

// 验证关键步骤是否正确添加
console.log('\n✅ 验证关键功能:');
const projectInitiationStepIds = projectInitiationProcess.steps.map(step => step.id);
console.log(`   - 项目启动流程包含概念定义步骤: ${projectInitiationStepIds.includes('project-concept-definition') ? '✅' : '❌'}`);
console.log(`   - 项目启动流程包含可行性分析步骤: ${projectInitiationStepIds.includes('feasibility-analysis') ? '✅' : '❌'}`);

const customerAcquisitionStepIds = customerAcquisitionProcess.steps.map(step => step.id);
console.log(`   - 客户获取流程包含线索生成步骤: ${customerAcquisitionStepIds.includes('lead-generation') ? '✅' : '❌'}`);
console.log(`   - 客户获取流程包含转化追踪步骤: ${customerAcquisitionStepIds.includes('conversion-tracking') ? '✅' : '❌'}`);

const marketingCampaignStepIds = marketingCampaignProcess.steps.map(step => step.id);
console.log(`   - 营销活动流程包含目标设定步骤: ${marketingCampaignStepIds.includes('campaign-objectives-setting') ? '✅' : '❌'}`);
console.log(`   - 营销活动流程包含预算分配步骤: ${marketingCampaignStepIds.includes('budget-allocation') ? '✅' : '❌'}`);

const complianceAssessmentStepIds = complianceAssessmentProcess.steps.map(step => step.id);
console.log(`   - 合规评估流程包含框架定义步骤: ${complianceAssessmentStepIds.includes('compliance-framework-definition') ? '✅' : '❌'}`);
console.log(`   - 合规评估流程包含差距分析步骤: ${complianceAssessmentStepIds.includes('gap-analysis') ? '✅' : '❌'}`);

const dataAnalysisStepIds = dataAnalysisMiningProcess.steps.map(step => step.id);
console.log(`   - 数据分析流程包含探索性分析步骤: ${dataAnalysisStepIds.includes('exploratory-data-analysis') ? '✅' : '❌'}`);
console.log(`   - 数据分析流程包含预测建模步骤: ${dataAnalysisStepIds.includes('predictive-modeling') ? '✅' : '❌'}`);

// 测试BusinessProcessManager是否可以访问新模型
console.log('\n🧪 测试BusinessProcessManager集成:');

// 创建必要的实例来测试
const workflowEngine = new WorkflowEngine();
const skillManager = new SkillManager();
const bpm = new BusinessProcessManager(workflowEngine, skillManager);

// 检查是否可以获取新领域的流程
import { BusinessDomain } from '../business-processes/BusinessProcessManager';

const projectManagementProcesses = bpm.getProcessesByDomain(BusinessDomain.PROJECT_MANAGEMENT);
console.log(`   - 可获取项目管理流程数量: ${projectManagementProcesses.length > 0 ? '✅' : '❌'}`);

const crmProcesses = bpm.getProcessesByDomain(BusinessDomain.CRM);
console.log(`   - 可获取CRM流程数量: ${crmProcesses.length > 0 ? '✅' : '❌'}`);

const marketingProcesses = bpm.getProcessesByDomain(BusinessDomain.MARKETING);
console.log(`   - 可获取市场营销流程数量: ${marketingProcesses.length > 0 ? '✅' : '❌'}`);

const complianceProcesses = bpm.getProcessesByDomain(BusinessDomain.LEGAL_COMPLIANCE);
console.log(`   - 可获取合规流程数量: ${complianceProcesses.length > 0 ? '✅' : '❌'}`);

const analyticsProcesses = bpm.getProcessesByDomain(BusinessDomain.DATA_ANALYTICS);
console.log(`   - 可获取数据分析流程数量: ${analyticsProcesses.length > 0 ? '✅' : '❌'}`);

// 检查所有流程总数
const allProcesses = bpm.getAllBusinessProcesses();
console.log(`\n📈 总计可用业务流程数量: ${allProcesses.length}`);

// 检查特定流程是否存在
const hasProjectInitiation = allProcesses.some(p => p.type === 'project-initiation-process');
const hasCustomerAcquisition = allProcesses.some(p => p.type === 'customer-acquisition-process');
const hasMarketResearch = allProcesses.some(p => p.type === 'market-research-process');
const hasRegulatoryMonitoring = allProcesses.some(p => p.type === 'regulatory-monitoring-process');
const hasDataCollectionIntegration = allProcesses.some(p => p.type === 'data-collection-integration-process');

console.log(`   - 存在项目启动流程: ${hasProjectInitiation ? '✅' : '❌'}`);
console.log(`   - 存在客户获取流程: ${hasCustomerAcquisition ? '✅' : '❌'}`);
console.log(`   - 存在市场研究流程: ${hasMarketResearch ? '✅' : '❌'}`);
console.log(`   - 存在法规监控流程: ${hasRegulatoryMonitoring ? '✅' : '❌'}`);
console.log(`   - 存在数据收集整合流程: ${hasDataCollectionIntegration ? '✅' : '❌'}`);

console.log('\n🎉 所有新创建的业务流程模型测试完成!');