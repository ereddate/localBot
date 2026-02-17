import { SkillManager } from './src/skills/SkillManager';
import { ValidationCheckTool } from './src/skills/UtilityTools';
import { AnalyticsEngineTool } from './src/skills/AnalyticsTools';
import { DocumentGenerationTool } from './src/skills/UtilityTools';
import { BusinessProcessManager, TaxPlanningProcessType } from './src/business-processes/BusinessProcessManager';
import { WorkflowEngine } from './src/tasks/WorkflowEngine';

async function testNewSkills() {
  console.log('🧪 开始测试新添加的技能...\n');

  const skillManager = new SkillManager();
  // 初始化额外的技能
  skillManager.initializeAdditionalSkills();
  const workflowEngine = new WorkflowEngine(skillManager);
  const businessProcessManager = new BusinessProcessManager(workflowEngine, skillManager);

  // 测试验证检查工具
  console.log('🔍 测试验证检查工具 (validation_check):');
  const validationTool = new ValidationCheckTool();
  const validationResult = await validationTool.execute({
    operation: 'identify_deductions',
    businessType: 's_corp',
    currentDeductions: [5000, 3000],
    potentialDeductions: ['section_179_depreciation', 'r_and_d_credit']
  });
  console.log(JSON.stringify(validationResult, null, 2));
  console.log('');

  // 测试分析引擎工具
  console.log('📊 测试分析引擎工具 (analytics_engine):');
  const analyticsTool = new AnalyticsEngineTool();
  const analyticsResult = await analyticsTool.execute({
    operation: 'generate_strategy',
    currentLiability: 25000,
    potentialSavings: 8000,
    recommendationTypes: ['entity_structure_optimization', 'timing_deductions']
  });
  console.log(JSON.stringify(analyticsResult, null, 2));
  console.log('');

  // 测试文档生成工具
  console.log('📄 测试文档生成工具 (document_generation):');
  const docTool = new DocumentGenerationTool();
  const docResult = await docTool.execute({
    operation: 'generate_strategy_implementation_plan',
    strategyDetails: {
      primaryGoals: ['降低税务负债', '确保合规性'],
      recommendedActions: ['收入递延', '支出加速'],
      expectedSavings: '$12,000 annually'
    },
    timeline: [
      { milestone: 'Initial Assessment', date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), status: 'planned' },
      { milestone: 'Strategy Implementation', date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), status: 'planned' }
    ],
    stakeholders: ['Business Owner', 'Accountant']
  });
  console.log(JSON.stringify(docResult, null, 2));
  console.log('');

  // 检查新技能是否已注册
  console.log('📋 检查新技能是否已注册:');
  const newSkills = [
    'validation-check-tools',
    'analytics-engine-tools', 
    'document-generation-tools'
  ];
  
  for (const skillName of newSkills) {
    const skill = skillManager['skills'].get(skillName);
    console.log(`${skill ? '✅' : '❌'} ${skillName}: ${skill ? '已注册' : '未注册'}`);
  }
  
  console.log('\n🎉 新技能测试完成！');
  console.log('\n🔧 新增技能将解决之前税务规划流程中的错误:');
  console.log('- validation_check: 处理扣除机会识别和合规检查步骤');
  console.log('- analytics_engine: 处理税务策略推荐和退休规划策略步骤');
  console.log('- document_generation: 处理实施计划制定和实施时间表步骤');
}

// 运行测试
testNewSkills().catch(console.error);