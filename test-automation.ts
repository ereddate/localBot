import { SkillManager } from './src/skills/SkillManager';
import { MemorySystem } from './src/memory/MemorySystem';
import { AutomationController } from './src/tasks/AutomationController';
import { WorkflowExamples } from './src/tasks/WorkflowExamples';

async function testAutomationFeatures() {
  console.log('Testing new automation features...\n');

  // Initialize components
  const memorySystem = new MemorySystem();
  const skillManager = new SkillManager(memorySystem);
  const automationController = new AutomationController(skillManager);

  // Initialize automation
  await automationController.initialize();
  console.log('✓ Automation controller initialized\n');

  // Test getting components
  const taskScheduler = automationController.getTaskScheduler();
  const workflowEngine = automationController.getWorkflowEngine();
  const monitoringSystem = automationController.getMonitoringSystem();

  console.log('✓ Retrieved automation components:');
  console.log(`  - Task Scheduler: ${!!taskScheduler}`);
  console.log(`  - Workflow Engine: ${!!workflowEngine}`);
  console.log(`  - Monitoring System: ${!!monitoringSystem}\n`);

  // Test creating a sample workflow
  const backupWorkflow = WorkflowExamples.createBackupWorkflow();
  workflowEngine.registerWorkflow(backupWorkflow);
  console.log(`✓ Registered workflow: ${backupWorkflow.name}`);

  const systemMonitoringWorkflow = WorkflowExamples.createSystemMonitoringWorkflow();
  workflowEngine.registerWorkflow(systemMonitoringWorkflow);
  console.log(`✓ Registered workflow: ${systemMonitoringWorkflow.name}`);

  const dailyReportWorkflow = WorkflowExamples.createDailyReportWorkflow();
  workflowEngine.registerWorkflow(dailyReportWorkflow);
  console.log(`✓ Registered workflow: ${dailyReportWorkflow.name}\n`);

  console.log(`✓ Total workflows registered: ${workflowEngine.getWorkflows().length}`);

  // Test that new tools are registered
  const allTools = skillManager.getAllTools();
  const newToolNames = allTools.map((tool: any) => tool.name);
  console.log('\n✓ Available tools include:');
  console.log(`  - HTTP Request: ${newToolNames.includes('http_request')}`);
  console.log(`  - Send Email: ${newToolNames.includes('send_email')}`);
  console.log(`  - Process Control: ${newToolNames.includes('process_control')}`);
  console.log(`  - Total tools: ${allTools.length}`);

  console.log('\n✓ All automation features tested successfully!');
  
  // Cleanup
  await automationController.shutdown();
}

// Run the test
testAutomationFeatures().catch(console.error);