import { SkillManager } from '../src/skills/SkillManager';
import { MemorySystem } from '../src/memory/MemorySystem';
import { DebugGateway } from './DebugGateway';

async function testWithDebug() {
  console.log('🔍 Testing with debug Gateway...\n');

  // Create SkillManager
  const memorySystem = new MemorySystem();
  const skillManager = new SkillManager(memorySystem);
  console.log(`SkillManager created with ${skillManager.getAllTools().length} tools\n`);

  // Create Gateway with debug
  const gateway = new DebugGateway(skillManager);
  console.log('');

  // Create context
  console.log('Creating context...\n');
  const context = await gateway.createContext('debug-test-' + Date.now());
  console.log(`\nContext created with ${context.availableTools.length} tools`);
}

testWithDebug().catch(console.error);