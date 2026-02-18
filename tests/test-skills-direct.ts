import { SkillManager } from '../src/skills/SkillManager';
import { MemorySystem } from '../src/memory/MemorySystem';

async function testSkillManager() {
  console.log('🧪 Testing SkillManager directly...\n');

  // Create skill manager
  const memorySystem = new MemorySystem();
  const skillManager = new SkillManager(memorySystem);
  
  console.log('Available tools in SkillManager:');
  const allTools = skillManager.getAllTools();
  console.log(`Total tools: ${allTools.length}`);
  
  // Show first few tools as samples
  for (let i = 0; i < Math.min(5, allTools.length); i++) {
    console.log(`  - ${allTools[i].name}: ${allTools[i].description}`);
  }
  
  console.log('\nSample of getEnabledTools:');
  const enabledTools = skillManager.getEnabledTools();
  console.log(`Enabled tools: ${enabledTools.length}`);
  
  console.log('\nDone.');
}

testSkillManager().catch(console.error);