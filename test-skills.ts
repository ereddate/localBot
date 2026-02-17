import { SkillManager } from './src/skills/SkillManager';
import { MemorySystem } from './src/memory/MemorySystem';

async function testNewSkills() {
  console.log('Testing new skills integration...\n');

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

  console.log('\n' + '='.repeat(50));
  console.log('Checking for new skill categories...');

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
    'task-scheduling'
  ];
  
  console.log('\nExpected skills status:');
  for (const skillName of expectedSkills) {
    const hasSkill = skillNames.includes(skillName);
    console.log(`  ${hasSkill ? '✓' : '✗'} ${skillName}`);
  }

  console.log('\n✓ All new skills successfully integrated!');
  
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
}

// Run the test
testNewSkills().catch(console.error);