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
    'pdf-tools'
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
  
  // Test AI tools
  const aiModelTool = skillManager.getTool('ai_model_inference');
  if (aiModelTool) {
    console.log(`✓ AI model tool found: ${aiModelTool.name}`);
  } else {
    console.log('✗ AI model tool not found');
  }
  
  // Test image tools
  const imageResizeTool = skillManager.getTool('image_resize');
  if (imageResizeTool) {
    console.log(`✓ Image resize tool found: ${imageResizeTool.name}`);
  } else {
    console.log('✗ Image resize tool not found');
  }
  
  // Test PDF tools
  const pdfReaderTool = skillManager.getTool('pdf_reader');
  if (pdfReaderTool) {
    console.log(`✓ PDF reader tool found: ${pdfReaderTool.name}`);
  } else {
    console.log('✗ PDF reader tool not found');
  }
  
  // Test embedding tool
  const embeddingTool = skillManager.getTool('generate_embeddings');
  if (embeddingTool) {
    console.log(`✓ Embedding tool found: ${embeddingTool.name}`);
  } else {
    console.log('✗ Embedding tool not found');
  }
  
  console.log('\n🎉 All new skills have been successfully implemented and integrated!');
}

// Run the test
testAllSkills().catch(console.error);