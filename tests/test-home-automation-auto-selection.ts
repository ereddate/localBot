import { WorkflowEngine } from './src/tasks/WorkflowEngine';
import { SkillManager } from './src/skills/SkillManager';
import { BusinessProcessManager } from './src/business-processes/BusinessProcessManager';

async function testHomeAutomationAutoSelection() {
  console.log('🏠 测试家庭自动化流程自动选择功能...\n');

  // 初始化组件
  const workflowEngine = new WorkflowEngine();
  const skillManager = new SkillManager();
  const businessProcessManager = new BusinessProcessManager(workflowEngine, skillManager);

  // 测试英文需求的自动识别
  const testRequirements = [
    'control smart home devices for evening relaxation',
    'schedule home maintenance tasks',
    'manage family budget and expenses',
    'track family health and fitness goals',
    'plan family vacation and activities'
  ];

  console.log('🧪 测试英文需求自动识别:');
  for (const requirement of testRequirements) {
    console.log(`\n需求: "${requirement}"`);
    try {
      const startTime = Date.now();
      const autoResult = await businessProcessManager.executeBusinessProcessByRequirement(
        requirement,
        {
          processId: `auto-test-${Date.now()}`,
          inputData: {}
        }
      );
      const endTime = Date.now();
      console.log(`✅ 成功识别并执行 - 耗时: ${endTime - startTime}ms`);
    } catch (error) {
      console.log(`⚠️  执行遇到问题: ${error.message}`);
    }
  }

  console.log('\n📋 现在可用的全部业务流程数量:');
  const allProcesses = businessProcessManager.getAllBusinessProcesses();
  const groupedByDomain = allProcesses.reduce((acc, proc) => {
    if (!acc[proc.domain]) acc[proc.domain] = 0;
    acc[proc.domain]++;
    return acc;
  }, {});

  console.log(groupedByDomain);
  console.log(`\n总计: ${allProcesses.length} 个业务流程`);

  console.log('\n🎉 家庭自动化流程自动选择测试完成！');
}

// 运行测试
testHomeAutomationAutoSelection().catch(console.error);