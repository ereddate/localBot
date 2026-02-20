import { DeepThinkingEngine, DeepThinkingConfig } from './src/engine/DeepThinkingEngine';
import { Logger } from './src/utils/Logger';
import { AgentContext } from './src/types';

async function testDeepThinking() {
  Logger.info('开始测试深度思考引擎');

  const config: DeepThinkingConfig = {
    enabled: true,
    maxRounds: 3,
    roleCount: 5,
    minDepthProgression: 5.0,
    enableSelfNegation: true,
    enableConflictGeneration: true,
    maxThinkingTime: 60000,
  };

  const engine = new DeepThinkingEngine(config);
  await engine.initialize();

  const testQueries = [
    '为什么人工智能需要深度学习？',
    '如何平衡经济发展和环境保护？',
    '什么是意识？',
  ];

  for (const query of testQueries) {
    Logger.info(`\n========================================`);
    Logger.info(`测试问题: ${query}`);
    Logger.info(`========================================\n`);

    const context: AgentContext = {
      messages: [
        {
          id: `msg_${Date.now()}`,
          role: 'user',
          content: query,
          timestamp: new Date(),
        },
      ],
      sessionId: 'test-session',
      userId: 'test-user',
      memory: [],
      availableTools: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    try {
      const startTime = Date.now();
      const result = await engine.thinkDeeply(context, query);
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      console.log('\n' + '='.repeat(80));
      console.log('深度思考结果');
      console.log('='.repeat(80));
      console.log(`\n问题: ${result.query}`);
      console.log(`思考轮次: ${result.totalRounds}`);
      console.log(`自我否定次数: ${result.selfNegations}`);
      console.log(`最终置信度: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`思考时间: ${duration.toFixed(2)}秒`);

      console.log('\n' + '-'.repeat(80));
      console.log('思考深度递进');
      console.log('-'.repeat(80));
      result.depthProgression.forEach((depth, index) => {
        const progression = index === 0 ? 0 : depth - result.depthProgression[index - 1];
        console.log(`第${index + 1}轮: 深度=${depth.toFixed(1)}, 递进=${progression.toFixed(1)}`);
      });

      console.log('\n' + '-'.repeat(80));
      console.log('角色观点');
      console.log('-'.repeat(80));
      const lastRound = result.rounds[result.rounds.length - 1];
      if (lastRound) {
        lastRound.roles.forEach((role, index) => {
          console.log(`\n${index + 1}. ${role.name}`);
          console.log(`   立场: ${role.stance}`);
          console.log(`   置信度: ${(role.confidence * 100).toFixed(1)}%`);
          console.log(`   核心观点: ${role.arguments[role.arguments.length - 1]?.substring(0, 150) || '...'}...`);
        });
      }

      if (lastRound && lastRound.conflicts.length > 0) {
        console.log('\n' + '-'.repeat(80));
        console.log('角色冲突');
        console.log('-'.repeat(80));
        lastRound.conflicts.forEach((conflict, index) => {
          console.log(`\n冲突${index + 1}: ${conflict.role1} vs ${conflict.role2}`);
          console.log(`   描述: ${conflict.conflict}`);
          if (conflict.resolution) {
            console.log(`   解决: ${conflict.resolution}`);
          }
        });
      }

      console.log('\n' + '-'.repeat(80));
      console.log('最终结论');
      console.log('-'.repeat(80));
      console.log(result.finalConclusion);

      console.log('\n' + '='.repeat(80));
      console.log('验证结果');
      console.log('='.repeat(80));

      const validations = [
        {
          name: '多角色立场分裂',
          passed: lastRound?.roles.length === 5,
          description: '创建了5个不同立场的角色',
        },
        {
          name: '角色冲突',
          passed: (lastRound?.conflicts.length || 0) > 0,
          description: '产生了角色间的冲突',
        },
        {
          name: '逻辑递进',
          passed: result.depthProgression.length >= 2 &&
                  result.depthProgression[result.depthProgression.length - 1] > result.depthProgression[0],
          description: '每轮思考都比前一轮更深入',
        },
        {
          name: '自我否定',
          passed: result.selfNegations > 0,
          description: '进行了自我否定，推翻了不完善的观点',
        },
        {
          name: '深度递进',
          passed: result.depthProgression.every((depth, index) => {
            if (index === 0) return true;
            return (depth - result.depthProgression[index - 1]) >= config.minDepthProgression;
          }),
          description: `每轮深度递进至少${config.minDepthProgression}`,
        },
      ];

      let allPassed = true;
      validations.forEach(v => {
        const status = v.passed ? '✓ 通过' : '✗ 失败';
        console.log(`${status} - ${v.name}: ${v.description}`);
        if (!v.passed) allPassed = false;
      });

      console.log('\n' + (allPassed ? '✓ 所有验证通过！' : '✗ 部分验证失败！'));

    } catch (error) {
      Logger.error('深度思考失败', { error: (error as Error).message });
    }

    console.log('\n\n');
  }

  await engine.shutdown();
  Logger.info('深度思考引擎测试完成');
}

testDeepThinking().catch(error => {
  Logger.error('测试失败', { error: (error as Error).message });
  process.exit(1);
});
