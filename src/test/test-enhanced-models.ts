/**
 * 测试增强的业务流程模型
 */

import { 
  customerDevelopmentProcess,
  opportunityManagementProcess,
  salesPerformanceAnalysisProcess
} from '../business-processes/SalesProcessModel';

import {
  budgetManagementProcess,
  expenseReimbursementProcess,
  financialReportingProcess,
  taxProcessingProcess
} from '../business-processes/FinanceProcessModel';

import {
  recruitmentProcess,
  onboardingProcess,
  performanceEvaluationProcess,
  trainingDevelopmentProcess
} from '../business-processes/HRProcessModel';

import {
  supplyChainManagementProcess,
  productionPlanningProcess,
  qualityManagementProcess,
  inventoryControlProcess
} from '../business-processes/OperationsProcessModel';

import {
  smartHomeControlProcess,
  homeMaintenanceProcess,
  homeFinanceProcess,
  healthFitnessProcess,
  homeActivityProcess
} from '../business-processes/HomeAutomationModel';

import {
  corporateTaxPlanningProcess,
  individualTaxPlanningProcess,
  automatedTaxFilingProcess,
  taxComplianceMonitoringProcess
} from '../business-processes/TaxPlanningModel';

console.log('🔍 开始测试增强的业务流程模型...\n');

// 检查销售流程模型
console.log('📊 销售流程模型:');
console.log(`   - 客户开发流程步骤数: ${customerDevelopmentProcess.steps.length} (原为8，现应为11)`);
console.log(`   - 机会管理流程步骤数: ${opportunityManagementProcess.steps.length}`);
console.log(`   - 销售业绩分析流程步骤数: ${salesPerformanceAnalysisProcess.steps.length}`);

// 检查财务流程模型
console.log('\n💰 财务流程模型:');
console.log(`   - 预算管理流程步骤数: ${budgetManagementProcess.steps.length}`);
console.log(`   - 费用报销流程步骤数: ${expenseReimbursementProcess.steps.length} (原为7，现应为13)`);
console.log(`   - 财务报告流程步骤数: ${financialReportingProcess.steps.length}`);
console.log(`   - 税务处理流程步骤数: ${taxProcessingProcess.steps.length}`);

// 检查人力资源流程模型
console.log('\n👥 人力资源流程模型:');
console.log(`   - 招聘流程步骤数: ${recruitmentProcess.steps.length} (原为7，现应为15)`);
console.log(`   - 入职流程步骤数: ${onboardingProcess.steps.length}`);
console.log(`   - 绩效评估流程步骤数: ${performanceEvaluationProcess.steps.length}`);
console.log(`   - 培训发展流程步骤数: ${trainingDevelopmentProcess.steps.length}`);

// 检查运营流程模型
console.log('\n🏭 运营流程模型:');
console.log(`   - 供应链管理流程步骤数: ${supplyChainManagementProcess.steps.length} (原为7，现应为15)`);
console.log(`   - 生产计划流程步骤数: ${productionPlanningProcess.steps.length}`);
console.log(`   - 质量管理流程步骤数: ${qualityManagementProcess.steps.length}`);
console.log(`   - 库存控制流程步骤数: ${inventoryControlProcess.steps.length}`);

// 检查家庭自动化模型
console.log('\n🏠 家庭自动化模型:');
console.log(`   - 智能家居控制流程步骤数: ${smartHomeControlProcess.steps.length} (原为4，现应为12)`);
console.log(`   - 家庭维护流程步骤数: ${homeMaintenanceProcess.steps.length}`);
console.log(`   - 家庭财务流程步骤数: ${homeFinanceProcess.steps.length}`);
console.log(`   - 健康健身流程步骤数: ${healthFitnessProcess.steps.length}`);
console.log(`   - 家庭活动流程步骤数: ${homeActivityProcess.steps.length}`);

// 检查税务规划模型
console.log('\n taxp️ 税务规划模型:');
console.log(`   - 企业税务规划流程步骤数: ${corporateTaxPlanningProcess.steps.length} (原为6，现应为12)`);
console.log(`   - 个人税务规划流程步骤数: ${individualTaxPlanningProcess.steps.length}`);
console.log(`   - 自动化税务申报流程步骤数: ${automatedTaxFilingProcess.steps.length}`);
console.log(`   - 税务合规监控流程步骤数: ${taxComplianceMonitoringProcess.steps.length}`);

// 验证增强的步骤是否正确添加
console.log('\n✅ 验证增强功能:');
const customerDevStepIds = customerDevelopmentProcess.steps.map(step => step.id);
console.log(`   - 客户开发流程包含竞争分析步骤: ${customerDevStepIds.includes('competitor-analysis') ? '✅' : '❌'}`);
console.log(`   - 客户开发流程包含风险评估步骤: ${customerDevStepIds.includes('risk-assessment') ? '✅' : '❌'}`);
console.log(`   - 客户开发流程包含售后交接步骤: ${customerDevStepIds.includes('post-sale-handoff') ? '✅' : '❌'}`);

const expenseReimbursementStepIds = expenseReimbursementProcess.steps.map(step => step.id);
console.log(`   - 费用报销流程包含政策合规检查步骤: ${expenseReimbursementStepIds.includes('policy-compliance-check') ? '✅' : '❌'}`);
console.log(`   - 费用报销流程包含欺诈检测步骤: ${expenseReimbursementStepIds.includes('fraud-detection') ? '✅' : '❌'}`);
console.log(`   - 费用报销流程包含预算可用性检查步骤: ${expenseReimbursementStepIds.includes('budget-availability-check') ? '✅' : '❌'}`);

const recruitmentStepIds = recruitmentProcess.steps.map(step => step.id);
console.log(`   - 招聘流程包含市场分析步骤: ${recruitmentStepIds.includes('market-analysis') ? '✅' : '❌'}`);
console.log(`   - 招聘流程包含文化契合度评估步骤: ${recruitmentStepIds.includes('culture-fit-assessment') ? '✅' : '❌'}`);
console.log(`   - 招聘流程包含最终背景调查步骤: ${recruitmentStepIds.includes('final-background-check') ? '✅' : '❌'}`);

const supplyChainStepIds = supplyChainManagementProcess.steps.map(step => step.id);
console.log(`   - 供应链流程包含需求预测步骤: ${supplyChainStepIds.includes('demand-forecasting') ? '✅' : '❌'}`);
console.log(`   - 供应链流程包含风险评估步骤: ${supplyChainStepIds.includes('risk-assessment') ? '✅' : '❌'}`);
console.log(`   - 供应链流程包含自动化质检步骤: ${supplyChainStepIds.includes('automated-quality-inspection') ? '✅' : '❌'}`);

const smartHomeStepIds = smartHomeControlProcess.steps.map(step => step.id);
console.log(`   - 智能家居流程包含环境监测步骤: ${smartHomeStepIds.includes('environmental-monitoring') ? '✅' : '❌'}`);
console.log(`   - 智能家居流程包含能源优化步骤: ${smartHomeStepIds.includes('energy-optimization') ? '✅' : '❌'}`);
console.log(`   - 智能家居流程包含睡眠监测步骤: ${smartHomeStepIds.includes('sleep-monitoring') ? '✅' : '❌'}`);

const corporateTaxStepIds = corporateTaxPlanningProcess.steps.map(step => step.id);
console.log(`   - 企业税务流程包含管辖区分析步骤: ${corporateTaxStepIds.includes('tax-jurisdiction-analysis') ? '✅' : '❌'}`);
console.log(`   - 企业税务流程包含合规审计步骤: ${corporateTaxStepIds.includes('tax-compliance-audit') ? '✅' : '❌'}`);
console.log(`   - 企业税务流程包含国际税务优化步骤: ${corporateTaxStepIds.includes('international-tax-optimization') ? '✅' : '❌'}`);

console.log('\n🎉 所有增强的业务流程模型测试完成!');