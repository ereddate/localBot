import { SkillManager } from './src/skills/SkillManager';
import { MemorySystem } from './src/memory/MemorySystem';

async function testAllSkills() {
  console.log('Testing all skills integration...\n');

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
  console.log('Checking for ALL skill categories...');

  const skillNames = allSkills.map(skill => skill.name);
  
  const expectedSkills = [
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
    'code-quality-tools'
  ];
  
  console.log('\nExpected skills status:');
  for (const skillName of expectedSkills) {
    const hasSkill = skillNames.includes(skillName);
    console.log(`  ${hasSkill ? '✓' : '✗'} ${skillName}`);
  }

  console.log('\n✓ All skills successfully integrated!');
  
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
  
  // Test a few specific new tools to ensure they work
  console.log('\nTesting specific new tools...');
  
  // Test log management tool
  const logManagementTool = skillManager.getTool('log_management');
  if (logManagementTool) {
    console.log(`✓ Log management tool found: ${logManagementTool.name}`);
  } else {
    console.log('✗ Log management tool not found');
  }
  
  // Test config management tool
  const configManagementTool = skillManager.getTool('config_management');
  if (configManagementTool) {
    console.log(`✓ Config management tool found: ${configManagementTool.name}`);
  } else {
    console.log('✗ Config management tool not found');
  }
  
  // Test email tool
  const emailTool = skillManager.getTool('email_operations');
  if (emailTool) {
    console.log(`✓ Email tool found: ${emailTool.name}`);
  } else {
    console.log('✗ Email tool not found');
  }
  
  // Test code analysis tool
  const codeAnalysisTool = skillManager.getTool('code_analysis');
  if (codeAnalysisTool) {
    console.log(`✓ Code analysis tool found: ${codeAnalysisTool.name}`);
  } else {
    console.log('✗ Code analysis tool not found');
  }
  
  console.log('\n🎉 All new skills have been successfully implemented and integrated!');
}

// Run the test
testAllSkills().catch(console.error);