/**
 * 业务流程模型使用示例
 * 演示如何使用不同业务类型的流程模型
 */

import { WorkflowEngine } from './src/tasks/WorkflowEngine';
import { SkillManager } from './src/skills/SkillManager';
import { MemorySystem } from './src/memory/MemorySystem';
import { 
  BusinessProcessManager, 
  BusinessDomain, 
  SalesProcessType, 
  FinanceProcessType, 
  OperationsProcessType, 
  HRProcessType 
} from './src/business-processes';

async function demonstrateBusinessProcesses() {
  console.log('🤖 LocalBot - Business Process Models Demo\n');

  // 初始化工作流引擎和业务流程管理器
  const memorySystem = new MemorySystem();
  const skillManager = new SkillManager(memorySystem);
  const workflowEngine = new WorkflowEngine();
  const businessProcessManager = new BusinessProcessManager(workflowEngine, skillManager);

  console.log('✅ Business Process Manager initialized\n');

  // 1. 销售业务流程演示
  console.log('📊 SALES BUSINESS PROCESSES');
  console.log('=' .repeat(40));

  // 获取所有销售流程
  const salesProcesses = businessProcessManager.getProcessesByDomain(BusinessDomain.SALES);
  console.log(`• Available sales processes: ${salesProcesses.length}`);
  salesProcesses.forEach((process, index) => {
    console.log(`  ${index + 1}. ${process.name}`);
    console.log(`     Description: ${process.description}`);
    console.log(`     Steps: ${process.steps.length}`);
  });
  console.log('');

  // 2. 财务业务流程演示
  console.log('💰 FINANCE BUSINESS PROCESSES');
  console.log('=' .repeat(40));

  const financeProcesses = businessProcessManager.getProcessesByDomain(BusinessDomain.FINANCE);
  console.log(`• Available finance processes: ${financeProcesses.length}`);
  financeProcesses.forEach((process, index) => {
    console.log(`  ${index + 1}. ${process.name}`);
    console.log(`     Description: ${process.description}`);
    console.log(`     Steps: ${process.steps.length}`);
  });
  console.log('');

  // 3. 运营业务流程演示
  console.log('🏭 OPERATIONS BUSINESS PROCESSES');
  console.log('=' .repeat(40));

  const operationsProcesses = businessProcessManager.getProcessesByDomain(BusinessDomain.OPERATIONS);
  console.log(`• Available operations processes: ${operationsProcesses.length}`);
  operationsProcesses.forEach((process, index) => {
    console.log(`  ${index + 1}. ${process.name}`);
    console.log(`     Description: ${process.description}`);
    console.log(`     Steps: ${process.steps.length}`);
  });
  console.log('');

  // 4. 人力资源业务流程演示
  console.log('👥 HR BUSINESS PROCESSES');
  console.log('=' .repeat(40));

  const hrProcesses = businessProcessManager.getProcessesByDomain(BusinessDomain.HR);
  console.log(`• Available HR processes: ${hrProcesses.length}`);
  hrProcesses.forEach((process, index) => {
    console.log(`  ${index + 1}. ${process.name}`);
    console.log(`     Description: ${process.description}`);
    console.log(`     Steps: ${process.steps.length}`);
  });
  console.log('');

  // 5. 演示执行特定业务流程
  console.log('⚙️ EXECUTING SPECIFIC BUSINESS PROCESSES');
  console.log('=' .repeat(40));

  // 演示执行销售业绩分析流程
  console.log('• Executing Sales Performance Analysis Process...');
  try {
    const salesAnalysisResult = await businessProcessManager.executeSalesProcess(
      SalesProcessType.PERFORMANCE_ANALYSIS,
      {
        processId: 'SALES-ANALYSIS-001',
        inputData: {
          period: 'Q4-2023',
          teamId: 'sales-team-1'
        }
      }
    );
    console.log('  ✅ Sales Performance Analysis completed');
  } catch (error) {
    console.log(`  ❌ Sales Performance Analysis failed: ${(error as Error).message}`);
  }

  // 演示执行预算管理流程
  console.log('• Executing Budget Management Process...');
  try {
    const budgetResult = await businessProcessManager.executeFinanceProcess(
      FinanceProcessType.BUDGET_MANAGEMENT,
      {
        processId: 'BUDGET-MGT-001',
        inputData: {
          fiscalYear: '2024',
          department: 'engineering'
        }
      }
    );
    console.log('  ✅ Budget Management completed');
  } catch (error) {
    console.log(`  ❌ Budget Management failed: ${(error as Error).message}`);
  }

  // 演示执行库存控制流程
  console.log('• Executing Inventory Control Process...');
  try {
    const inventoryResult = await businessProcessManager.executeOperationsProcess(
      OperationsProcessType.INVENTORY_CONTROL,
      {
        processId: 'INVENTORY-CTRL-001',
        inputData: {
          warehouseId: 'WH-MAIN',
          threshold: 10
        }
      }
    );
    console.log('  ✅ Inventory Control completed');
  } catch (error) {
    console.log(`  ❌ Inventory Control failed: ${(error as Error).message}`);
  }

  // 演示执行员工入职流程
  console.log('• Executing Onboarding Process...');
  try {
    const onboardingResult = await businessProcessManager.executeHRProcess(
      HRProcessType.ONBOARDING,
      {
        processId: 'ONBOARDING-001',
        inputData: {
          employeeId: 'EMP-001',
          position: 'Software Engineer',
          startDate: '2024-01-15'
        }
      }
    );
    console.log('  ✅ Onboarding completed');
  } catch (error) {
    console.log(`  ❌ Onboarding failed: ${(error as Error).message}`);
  }

  console.log('');

  // 6. 演示基于需求自动选择流程
  console.log('🧠 AUTO-SELECTING BUSINESS PROCESSES BY REQUIREMENT');
  console.log('=' .repeat(50));

  const requirements = [
    "Analyze quarterly sales performance for the east region",
    "Process employee expense reimbursement for travel",
    "Manage inventory levels for our top products",
    "Onboard a new software engineer to the team"
  ];

  for (const req of requirements) {
    console.log(`• Requirement: "${req}"`);
    try {
      const autoResult = await businessProcessManager.executeBusinessProcessByRequirement(
        req,
        { processId: `AUTO-${Date.now()}` }
      );
      console.log('  ✅ Auto-selected process executed');
    } catch (error) {
      console.log(`  ❌ Auto-selection failed: ${(error as Error).message}`);
    }
    console.log('');
  }

  // 7. 显示所有可用的业务流程
  console.log('📋 ALL AVAILABLE BUSINESS PROCESSES');
  console.log('=' .repeat(40));

  const allProcesses = businessProcessManager.getAllBusinessProcesses();
  const domains = [...new Set(allProcesses.map(p => p.domain))];
  
  for (const domain of domains) {
    const domainProcesses = allProcesses.filter(p => p.domain === domain);
    console.log(`${domain.toUpperCase()} (${domainProcesses.length} processes):`);
    
    for (const proc of domainProcesses) {
      console.log(`  • ${proc.name}`);
      console.log(`    - ${proc.description}`);
    }
    console.log('');
  }

  console.log('🎯 Business Process Models demonstration completed!');
  console.log('');
  console.log('💡 Key Features Demonstrated:');
  console.log('   • Domain-specific process categorization');
  console.log('   • Standardized process execution interface');
  console.log('   • Automatic process selection by requirement');
  console.log('   • Comprehensive process metadata');
  console.log('   • Error handling and logging');
  console.log('   • Workflow engine integration');
}

// 运行演示
demonstrateBusinessProcesses().catch(console.error);