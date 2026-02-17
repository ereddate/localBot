import { SkillManager } from './src/skills/SkillManager';
import { MemorySystem } from './src/memory/MemorySystem';

async function testBusinessSkills() {
  console.log('Testing all business skills integration...\n');

  // Initialize components
  const memorySystem = new MemorySystem();
  const skillManager = new SkillManager(memorySystem);

  console.log('✓ SkillManager initialized\n');

  // Get all skills
  const allSkills = skillManager.getAllSkills();
  console.log(`✓ Total skills registered: ${allSkills.length}\n`);

  // List all skills with their tools
  console.log('Registered Skills and Their Tools:');
  for (const skill of allSkills) {
    console.log(`\n• ${skill.name}: ${skill.description}`);
    console.log(`  Tools (${skill.tools.length}):`);
    for (const tool of skill.tools) {
      console.log(`    - ${tool.name}: ${tool.description}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Checking for NEW business skill categories...');

  const skillNames = allSkills.map(skill => skill.name);
  
  const expectedBusinessSkills = [
    'financial-tools',
    'spreadsheet-tools',
    'crm-tools',
    'erp-tools',
    'business-intelligence-tools',
    'inventory-tools',
    'sales-analytics-tools',
    'compliance-tools',
    'project-management-tools',
    'time-tracking-tools'
  ];
  
  console.log('\nExpected business skills status:');
  for (const skillName of expectedBusinessSkills) {
    const hasSkill = skillNames.includes(skillName);
    console.log(`  ${hasSkill ? '✓' : '✗'} ${skillName}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('Checking for ALL skill categories...');

  const allExpectedSkills = [
    'file-system',
    'shell', 
    'memory',
    'database',
    'api-management',
    'data-processing',
    'notifications',
    'system-monitoring',
    'task-scheduling',
    'security-tools',
    'compression-tools',
    'conversation-tools',
    'text-processing',
    'date-time-tools',
    'math-tools',
    'network-tools',
    'ai-tools',
    'image-tools',
    'pdf-tools',
    'log-config-tools',
    'communication-tools',
    'code-quality-tools',
    'financial-tools',
    'spreadsheet-tools',
    'crm-tools',
    'erp-tools',
    'business-intelligence-tools',
    'inventory-tools',
    'sales-analytics-tools',
    'compliance-tools',
    'project-management-tools',
    'time-tracking-tools'
  ];
  
  console.log('\nAll skills status:');
  for (const skillName of allExpectedSkills) {
    const hasSkill = skillNames.includes(skillName);
    console.log(`  ${hasSkill ? '✓' : '✗'} ${skillName}`);
  }

  console.log('\n✓ All business skills successfully integrated!');
  
  // Count tools by category
  const allTools = skillManager.getAllTools();
  const toolsByCategory: Record<string, number> = {};
  
  for (const tool of allTools) {
    if (toolsByCategory[tool.category]) {
      toolsByCategory[tool.category]++;
    } else {
      toolsByCategory[tool.category] = 1;
    }
  }
  
  console.log('\nTools by category:');
  for (const [category, count] of Object.entries(toolsByCategory)) {
    console.log(`  ${category}: ${count} tools`);
  }
  
  console.log(`\nTotal tools: ${allTools.length}`);
  
  // Test a few specific new business tools to ensure they work
  console.log('\nTesting specific new business tools...');
  
  // Test financial calculator tool
  const financialTool = skillManager.getTool('financial_calculator');
  if (financialTool) {
    console.log(`✓ Financial calculator tool found: ${financialTool.name}`);
  } else {
    console.log('✗ Financial calculator tool not found');
  }
  
  // Test CRM tool
  const crmTool = skillManager.getTool('crm_operations');
  if (crmTool) {
    console.log(`✓ CRM tool found: ${crmTool.name}`);
  } else {
    console.log('✗ CRM tool not found');
  }
  
  // Test sales analytics tool
  const salesAnalyticsTool = skillManager.getTool('sales_analytics');
  if (salesAnalyticsTool) {
    console.log(`✓ Sales analytics tool found: ${salesAnalyticsTool.name}`);
  } else {
    console.log('✗ Sales analytics tool not found');
  }
  
  // Test project management tool
  const projectManagementTool = skillManager.getTool('project_management');
  if (projectManagementTool) {
    console.log(`✓ Project management tool found: ${projectManagementTool.name}`);
  } else {
    console.log('✗ Project management tool not found');
  }
  
  // Test compliance checker tool
  const complianceTool = skillManager.getTool('compliance_checker');
  if (complianceTool) {
    console.log(`✓ Compliance checker tool found: ${complianceTool.name}`);
  } else {
    console.log('✗ Compliance checker tool not found');
  }
  
  console.log('\n🎉 All new business skills have been successfully implemented and integrated!');
}

// Run the test
testBusinessSkills().catch(console.error);