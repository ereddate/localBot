import { EventEmitter } from 'events';
import { Logger } from '../utils/Logger';
import { AgentContext, Message } from '../types';
import { MemorySystem } from '../memory/MemorySystem';

export interface ThinkingRole {
  id: string;
  name: string;
  stance: string;
  perspective: string;
  personality: string;
  arguments: string[];
  confidence: number;
}

export interface ThinkingRound {
  round: number;
  roles: ThinkingRole[];
  conflicts: Array<{
    role1: string;
    role2: string;
    conflict: string;
    resolution?: string;
  }>;
  synthesis: string;
  depth: number;
  timestamp: Date;
}

export interface ThinkingProcess {
  id: string;
  query: string;
  rounds: ThinkingRound[];
  finalConclusion: string;
  confidence: number;
  startTime: Date;
  endTime: Date;
  totalRounds: number;
  selfNegations: number;
  depthProgression: number[];
}

export interface DeepThinkingConfig {
  enabled: boolean;
  maxRounds: number;
  roleCount: number;
  minDepthProgression: number;
  enableSelfNegation: boolean;
  enableConflictGeneration: boolean;
  maxThinkingTime: number;
}

export class DeepThinkingEngine extends EventEmitter {
  private config: DeepThinkingConfig;
  private memorySystem?: MemorySystem;
  private activeProcesses: Map<string, ThinkingProcess> = new Map();

  constructor(config: DeepThinkingConfig, memorySystem?: MemorySystem) {
    super();
    this.config = config;
    this.memorySystem = memorySystem;
  }

  async initialize(): Promise<void> {
    Logger.info('Initializing Deep Thinking Engine', {
      enabled: this.config.enabled,
      maxRounds: this.config.maxRounds,
      roleCount: this.config.roleCount,
      selfNegation: this.config.enableSelfNegation,
    });

    if (!this.config.enabled) {
      Logger.warn('Deep Thinking Engine is disabled');
      return;
    }

    this.emit('initialized');
  }

  async thinkDeeply(context: AgentContext, query: string): Promise<ThinkingProcess> {
    if (!this.config.enabled) {
      throw new Error('Deep Thinking Engine is disabled');
    }

    const processId = `thinking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const process: ThinkingProcess = {
      id: processId,
      query,
      rounds: [],
      finalConclusion: '',
      confidence: 0,
      startTime: new Date(),
      endTime: new Date(),
      totalRounds: 0,
      selfNegations: 0,
      depthProgression: [],
    };

    this.activeProcesses.set(processId, process);
    this.emit('thinking-started', { processId, query });

    try {
      await this.timeoutGuard(processId, this.config.maxThinkingTime, async () => {
        await this.performDeepThinking(context, query, process);
      });

      process.endTime = new Date();
      this.emit('thinking-completed', process);

      await this.storeThinkingProcess(process);
      return process;
    } catch (error) {
      process.endTime = new Date();
      this.emit('thinking-failed', { processId, error });
      throw error;
    } finally {
      this.activeProcesses.delete(processId);
    }
  }

  private async performDeepThinking(context: AgentContext, query: string, process: ThinkingProcess): Promise<void> {
    let previousDepth = 0;
    let previousConclusion = '';
    let previousRoles: ThinkingRole[] = [];

    for (let round = 1; round <= this.config.maxRounds; round++) {
      Logger.info(`Deep thinking round ${round}`, {
        processId: process.id,
        previousDepth,
      });

      const roundResult = await this.performThinkingRound(
        context,
        query,
        round,
        previousDepth,
        previousConclusion,
        previousRoles,
        process
      );

      process.rounds.push(roundResult);
      process.depthProgression.push(roundResult.depth);

      previousDepth = roundResult.depth;
      previousConclusion = roundResult.synthesis;
      previousRoles = roundResult.roles;

      this.emit('thinking-progress', {
        processId: process.id,
        round,
        depth: roundResult.depth,
        synthesis: roundResult.synthesis,
      });

      if (this.shouldStopThinking(process, roundResult)) {
        Logger.info('Stopping thinking early', {
          processId: process.id,
          reason: 'convergence reached',
        });
        break;
      }
    }

    process.finalConclusion = this.generateFinalConclusion(process);
    process.confidence = this.calculateOverallConfidence(process);
    process.totalRounds = process.rounds.length;
  }

  private async performThinkingRound(
    context: AgentContext,
    query: string,
    round: number,
    previousDepth: number,
    previousConclusion: string,
    previousRoles: ThinkingRole[],
    process: ThinkingProcess
  ): Promise<ThinkingRound> {
    const roles = await this.generateRoles(context, query, round, previousRoles);
    const conflicts = this.config.enableConflictGeneration 
      ? await this.generateConflicts(roles, query, round)
      : [];
    const synthesis = await this.synthesizeRoles(roles, conflicts, query, round, previousConclusion);
    const depth = this.calculateDepth(synthesis, previousDepth);

    const roundResult: ThinkingRound = {
      round,
      roles,
      conflicts,
      synthesis,
      depth,
      timestamp: new Date(),
    };

    if (this.config.enableSelfNegation) {
      await this.performSelfNegation(process, roundResult, previousConclusion);
    }

    return roundResult;
  }

  private async generateRoles(
    context: AgentContext,
    query: string,
    round: number,
    previousRoles: ThinkingRole[]
  ): Promise<ThinkingRole[]> {
    const roles: ThinkingRole[] = [];

    const roleDefinitions = this.getRoleDefinitions(query, round);

    for (let i = 0; i < this.config.roleCount; i++) {
      const def = roleDefinitions[i % roleDefinitions.length];
      const role: ThinkingRole = {
        id: `role_${round}_${i}`,
        name: def.name,
        stance: def.stance,
        perspective: def.perspective,
        personality: def.personality,
        arguments: [],
        confidence: 0.7 + Math.random() * 0.2,
      };

      const argument = await this.generateRoleArgument(context, query, role, previousRoles);
      role.arguments.push(argument);

      roles.push(role);
    }

    return roles;
  }

  private getRoleDefinitions(query: string, round: number): Array<{
    name: string;
    stance: string;
    perspective: string;
    personality: string;
  }> {
    const baseDefinitions = [
      {
        name: '理性分析者',
        stance: '客观中立',
        perspective: '从逻辑和证据出发',
        personality: '冷静、严谨、注重事实',
      },
      {
        name: '批判质疑者',
        stance: '怀疑批判',
        perspective: '挑战假设和结论',
        personality: '犀利、质疑、寻找漏洞',
      },
      {
        name: '创新探索者',
        stance: '开放探索',
        perspective: '寻找新可能性和突破',
        personality: '创造性、想象力丰富、不拘一格',
      },
      {
        name: '实用主义者',
        stance: '务实应用',
        perspective: '关注实际可行性和价值',
        personality: '现实、结果导向、注重效率',
      },
      {
        name: '人文关怀者',
        stance: '以人为本',
        perspective: '考虑社会影响和伦理',
        personality: '同理心强、关注福祉、重视道德',
      },
    ];

    if (round > 1) {
      return baseDefinitions.map(def => ({
        ...def,
        stance: `${def.stance}（基于第${round - 1}轮的修正）`,
      }));
    }

    return baseDefinitions;
  }

  private async generateRoleArgument(
    context: AgentContext,
    query: string,
    role: ThinkingRole,
    previousRoles: ThinkingRole[]
  ): Promise<string> {
    const relevantMemories = this.memorySystem ? await this.memorySystem.search(query, 3) : [];

    const previousArguments = previousRoles
      .map(r => r.arguments.join(' '))
      .join('\n\n');

    const argument = `**${role.name}** (${role.stance})\n\n` +
      `**视角**: ${role.perspective}\n\n` +
      `**性格**: ${role.personality}\n\n` +
      `**观点**:\n\n` +
      `基于"${query}"这个问题，从${role.perspective}的角度来看，` +
      `我认为需要考虑以下几个方面：\n\n` +
      `1. ${this.generateArgumentPoint(query, role, 1)}\n` +
      `2. ${this.generateArgumentPoint(query, role, 2)}\n` +
      `3. ${this.generateArgumentPoint(query, role, 3)}\n\n` +
      (previousArguments ? `**对前几轮观点的回应**:\n\n${this.generateResponseToPrevious(previousArguments, role)}\n\n` : '') +
      (relevantMemories.length > 0 ? `**相关记忆**:\n\n${relevantMemories[0].content.substring(0, 200)}...\n\n` : '') +
      `**结论**: ${this.generateRoleConclusion(query, role)}`;

    return argument;
  }

  private generateArgumentPoint(query: string, role: ThinkingRole, pointIndex: number): string {
    const points = {
      '理性分析者': [
        '问题的本质和核心要素是什么？',
        '有哪些可验证的事实和数据？',
        '逻辑链条是否完整和一致？',
      ],
      '批判质疑者': [
        '这个假设有什么潜在漏洞？',
        '是否存在未被考虑的反例？',
        '结论是否过于绝对化？',
      ],
      '创新探索者': [
        '有哪些未被探索的可能性？',
        '能否从不同领域获得启发？',
        '如何突破常规思维模式？',
      ],
      '实用主义者': [
        '这个观点在实际中如何应用？',
        '成本效益比如何？',
        '实施难度和风险是什么？',
      ],
      '人文关怀者': [
        '这对不同人群有什么影响？',
        '是否符合伦理和道德标准？',
        '如何最大化社会福祉？',
      ],
    };

    const rolePoints = points[role.name as keyof typeof points] || points['理性分析者'];
    return rolePoints[pointIndex - 1] || '需要进一步分析';
  }

  private generateResponseToPrevious(previousArguments: string, role: ThinkingRole): string {
    if (role.name === '批判质疑者') {
      return `前几轮的观点存在以下问题：\n` +
        `1. 部分假设缺乏充分证据支持\n` +
        `2. 逻辑链条存在跳跃\n` +
        `3. 结论过于绝对，忽略了复杂性\n\n` +
        `我建议需要更谨慎地评估这些观点。`;
    } else if (role.name === '创新探索者') {
      return `前几轮的观点虽然有一定道理，但可能过于保守：\n` +
        `1. 没有充分考虑新兴的可能性\n` +
        `2. 思维模式可能受到传统框架限制\n` +
        `3. 缺乏突破性的创新思考\n\n` +
        `我建议从更开放的角度重新审视问题。`;
    } else if (role.name === '实用主义者') {
      return `前几轮的理论讨论很好，但缺乏实际考量：\n` +
        `1. 没有充分讨论实施可行性\n` +
        `2. 成本和资源需求不明确\n` +
        `3. 实际效果和风险评估不足\n\n` +
        `我建议更多关注实际应用层面。`;
    } else if (role.name === '人文关怀者') {
      return `前几轮的讨论过于技术化，忽视了人的因素：\n` +
        `1. 没有充分考虑对不同群体的影响\n` +
        `2. 伦理和社会责任讨论不足\n` +
        `3. 缺乏对人文价值的关注\n\n` +
        `我建议更多考虑人文和社会层面。`;
    } else {
      return `前几轮的观点提供了有价值的视角，但需要进一步整合：\n` +
        `1. 各个观点之间的一致性需要加强\n` +
        `2. 需要找到共同点和差异点\n` +
        `3. 综合结论需要更明确的逻辑支撑\n\n` +
        `我建议在保持理性的同时，整合其他角色的有价值观点。`;
    }
  }

  private generateRoleConclusion(query: string, role: ThinkingRole): string {
    const conclusions = {
      '理性分析者': `基于以上分析，我认为需要更多实证研究和逻辑验证才能得出确定结论。`,
      '批判质疑者': `当前的观点和假设都存在不同程度的缺陷，需要更严格的论证和证据支持。`,
      '创新探索者': `传统思维模式可能限制了我们的视野，需要大胆探索新的可能性。`,
      '实用主义者': `理论讨论需要转化为实际行动，关注可行性和效果。`,
      '人文关怀者': `任何解决方案都必须以人为本，充分考虑社会影响和伦理责任。`,
    };

    return conclusions[role.name as keyof typeof conclusions] || '需要进一步深入思考。';
  }

  private async generateConflicts(
    roles: ThinkingRole[],
    query: string,
    round: number
  ): Promise<Array<{
    role1: string;
    role2: string;
    conflict: string;
    resolution?: string;
  }>> {
    const conflicts: Array<{
      role1: string;
      role2: string;
      conflict: string;
      resolution?: string;
    }> = [];

    for (let i = 0; i < roles.length; i++) {
      for (let j = i + 1; j < roles.length; j++) {
        const conflict = await this.detectConflict(roles[i], roles[j], query);
        if (conflict) {
          conflicts.push({
            role1: roles[i].name,
            role2: roles[j].name,
            conflict: conflict.description,
            resolution: conflict.resolution,
          });
        }
      }
    }

    return conflicts;
  }

  private async detectConflict(
    role1: ThinkingRole,
    role2: ThinkingRole,
    query: string
  ): Promise<{ description: string; resolution?: string } | null> {
    const conflictPairs = [
      {
        pair: ['理性分析者', '创新探索者'],
        conflict: '理性分析者强调证据和逻辑，而创新探索者倾向于突破常规，两者在方法论上存在根本分歧。',
        resolution: '需要在创新的同时保持严谨的论证，在理性框架内寻求突破。',
      },
      {
        pair: ['批判质疑者', '实用主义者'],
        conflict: '批判质疑者倾向于发现问题，而实用主义者关注解决方案，两者在侧重点上存在张力。',
        resolution: '批判应该服务于改进，质疑的最终目的是为了找到更好的实践方案。',
      },
      {
        pair: ['人文关怀者', '理性分析者'],
        conflict: '人文关怀者强调价值和伦理，而理性分析者注重事实和逻辑，两者在优先级上存在冲突。',
        resolution: '理性分析应该服务于人文价值，技术决策必须考虑社会影响。',
      },
      {
        pair: ['创新探索者', '实用主义者'],
        conflict: '创新探索者追求新可能性，而实用主义者关注可行性和成本，两者在风险态度上存在分歧。',
        resolution: '创新需要平衡理想与现实，在可控风险内寻求突破。',
      },
    ];

    const conflictPair = conflictPairs.find(cp =>
      cp.pair.includes(role1.name) && cp.pair.includes(role2.name)
    );

    if (!conflictPair) {
      return null;
    }

    return {
      description: conflictPair.conflict,
      resolution: conflictPair.resolution,
    };
  }

  private async synthesizeRoles(
    roles: ThinkingRole[],
    conflicts: Array<{
      role1: string;
      role2: string;
      conflict: string;
      resolution?: string;
    }>,
    query: string,
    round: number,
    previousConclusion: string
  ): Promise<string> {
    let synthesis = `## 第${round}轮思考综合\n\n`;

    synthesis += `### 角色观点汇总\n\n`;
    roles.forEach((role, index) => {
      synthesis += `#### ${index + 1}. ${role.name}\n\n`;
      synthesis += role.arguments.join('\n\n');
      synthesis += `\n**置信度**: ${(role.confidence * 100).toFixed(1)}%\n\n`;
    });

    if (conflicts.length > 0) {
      synthesis += `### 角色冲突\n\n`;
      conflicts.forEach((conflict, index) => {
        synthesis += `#### 冲突${index + 1}: ${conflict.role1} vs ${conflict.role2}\n\n`;
        synthesis += `**冲突描述**: ${conflict.conflict}\n\n`;
        if (conflict.resolution) {
          synthesis += `**可能解决**: ${conflict.resolution}\n\n`;
        }
      });
    }

    synthesis += `### 综合结论\n\n`;

    if (round === 1) {
      synthesis += `这是第一轮思考，各个角色从不同角度对"${query}"进行了分析。` +
        `虽然观点存在差异，但每个角色都提供了有价值的视角。` +
        `下一轮需要进一步深化讨论，并尝试解决角色间的冲突。`;
    } else {
      synthesis += `基于前几轮的讨论，这一轮的思考更加深入。` +
        `各个角色不仅表达了自己的观点，还回应了前几轮的论点。` +
        `虽然冲突仍然存在，但我们在寻找共同点和综合方案方面取得了进展。` +
        (previousConclusion ? `\n\n**对前一轮的修正**:\n\n${this.generateSelfNegation(previousConclusion)}\n\n` : '') +
        `这一轮的思考深度明显高于前一轮，我们正在向问题的本质逼近。`;
    }

    return synthesis;
  }

  private generateSelfNegation(previousConclusion: string): string {
    const negations = [
      `前一轮的结论"${previousConclusion.substring(0, 50)}..."存在以下问题：\n` +
      `1. 过于简化了问题的复杂性\n` +
      `2. 某些关键因素未被充分考虑\n` +
      `3. 结论的普适性未经验证\n\n` +
      `因此，我推翻前一轮的部分结论，重新构建更全面的框架。`,

      `回顾前一轮的思考，我发现了以下局限性：\n` +
      `1. 逻辑链条存在跳跃\n` +
      `2. 某些假设缺乏充分支撑\n` +
      `3. 忽视了重要的反例\n\n` +
      `这些局限性导致前一轮的结论不够可靠，需要在本轮中进行根本性修正。`,

      `前一轮的讨论虽然有一定价值，但我现在意识到：\n` +
      `1. 当时的思考框架过于狭隘\n` +
      `2. 没有充分考虑跨领域的视角\n` +
      `3. 对某些关键概念的理解存在偏差\n\n` +
      `基于这些认识，我必须否定前一轮的部分观点，建立更准确的理解。`,
    ];

    return negations[Math.floor(Math.random() * negations.length)];
  }

  private async performSelfNegation(
    process: ThinkingProcess,
    roundResult: ThinkingRound,
    previousConclusion: string
  ): Promise<void> {
    if (!previousConclusion || roundResult.round === 1) {
      return;
    }

    const negation = this.generateSelfNegation(previousConclusion);
    process.selfNegations++;

    Logger.info('Self-negation performed', {
      processId: process.id,
      round: roundResult.round,
      negationPreview: negation.substring(0, 100),
    });
  }

  private calculateDepth(synthesis: string, previousDepth: number): number {
    const depthIndicators = [
      '本质', '根本', '核心', '机制', '原理',
      '综合', '整合', '系统', '框架',
      '批判', '质疑', '验证', '反思',
      '修正', '推翻', '否定', '重新',
    ];

    let depthScore = 0;
    depthIndicators.forEach(indicator => {
      const matches = (synthesis.match(new RegExp(indicator, 'g')) || []).length;
      depthScore += matches * 2;
    });

    const lengthScore = Math.min(synthesis.length / 500, 5);
    const structureScore = synthesis.includes('###') ? 3 : 1;

    const newDepth = previousDepth + depthScore + lengthScore + structureScore;
    return Math.max(newDepth, previousDepth + this.config.minDepthProgression);
  }

  private shouldStopThinking(process: ThinkingProcess, roundResult: ThinkingRound): boolean {
    if (process.rounds.length < 2) {
      return false;
    }

    const lastTwoDepths = process.depthProgression.slice(-2);
    const depthIncrease = lastTwoDepths[1] - lastTwoDepths[0];

    if (depthIncrease < this.config.minDepthProgression) {
      Logger.info('Depth progression too small, stopping', {
        processId: process.id,
        depthIncrease,
        minProgression: this.config.minDepthProgression,
      });
      return true;
    }

    const avgConfidence = roundResult.roles.reduce((sum, r) => sum + r.confidence, 0) / roundResult.roles.length;
    if (avgConfidence > 0.95) {
      Logger.info('High confidence reached, stopping', {
        processId: process.id,
        avgConfidence,
      });
      return true;
    }

    return false;
  }

  private generateFinalConclusion(process: ThinkingProcess): string {
    let conclusion = `# 深度思考最终结论\n\n`;
    conclusion += `**问题**: ${process.query}\n\n`;
    conclusion += `**思考轮次**: ${process.totalRounds}\n`;
    conclusion += `**自我否定次数**: ${process.selfNegations}\n`;
    conclusion += `**最终置信度**: ${(process.confidence * 100).toFixed(1)}%\n\n`;

    conclusion += `## 思考深度递进\n\n`;
    process.depthProgression.forEach((depth, index) => {
      const progression = index === 0 ? 0 : depth - process.depthProgression[index - 1];
      conclusion += `第${index + 1}轮: 深度=${depth.toFixed(1)}, 递进=${progression.toFixed(1)}\n`;
    });

    conclusion += `\n## 关键角色观点\n\n`;
    const lastRound = process.rounds[process.rounds.length - 1];
    if (lastRound) {
      lastRound.roles.forEach(role => {
        conclusion += `### ${role.name}\n`;
        conclusion += `- 立场: ${role.stance}\n`;
        conclusion += `- 置信度: ${(role.confidence * 100).toFixed(1)}%\n`;
        conclusion += `- 核心观点: ${role.arguments[role.arguments.length - 1]?.substring(0, 100) || '...'}\n\n`;
      });
    }

    conclusion += `\n## 主要冲突和解决\n\n`;
    if (lastRound && lastRound.conflicts.length > 0) {
      lastRound.conflicts.forEach((conflict, index) => {
        conclusion += `${index + 1}. ${conflict.role1} vs ${conflict.role2}\n`;
        conclusion += `   - 冲突: ${conflict.conflict}\n`;
        if (conflict.resolution) {
          conclusion += `   - 解决: ${conflict.resolution}\n`;
        }
      });
    } else {
      conclusion += `经过多轮讨论，各角色观点趋于一致，主要冲突已得到解决。\n`;
    }

    conclusion += `\n## 最终答案\n\n`;
    conclusion += `基于${process.totalRounds}轮深度思考，${process.selfNegations}次自我否定，` +
      `以及多个角色的立场冲突和辩证讨论，我对"${process.query}"的最终结论是：\n\n`;

    conclusion += this.generateComprehensiveAnswer(process);

    return conclusion;
  }

  private generateComprehensiveAnswer(process: ThinkingProcess): string {
    const lastRound = process.rounds[process.rounds.length - 1];
    if (!lastRound) {
      return '需要更多思考才能得出结论。';
    }

    const highConfidenceRoles = lastRound.roles.filter(r => r.confidence > 0.8);
    const commonThemes = this.extractCommonThemes(lastRound.roles);

    let answer = '';

    if (highConfidenceRoles.length >= 3) {
      answer += `多个高置信度角色（${highConfidenceRoles.map(r => r.name).join('、')}）` +
        `在以下方面达成了共识：\n\n`;
      commonThemes.forEach(theme => {
        answer += `- ${theme}\n`;
      });
    } else if (highConfidenceRoles.length >= 2) {
      answer += `部分角色（${highConfidenceRoles.map(r => r.name).join('、')}）` +
        `提供了较为一致的观点：\n\n`;
      commonThemes.forEach(theme => {
        answer += `- ${theme}\n`;
      });
    } else {
      answer += `各角色观点存在较大分歧，但通过多轮讨论和自我否定，` +
        `我们识别出了以下关键洞察：\n\n`;
      commonThemes.forEach(theme => {
        answer += `- ${theme}\n`;
      });
    }

    answer += `\n这种深度思考方式确保了：\n`;
    answer += `1. **多视角覆盖**：从${this.config.roleCount}个不同角色立场出发\n`;
    answer += `2. **立场冲突**：通过角色间的对立和辩论，暴露问题复杂性\n`;
    answer += `3. **逻辑递进**：每轮思考都比前一轮更深入，深度递进${process.depthProgression[process.depthProgression.length - 1]?.toFixed(1) || '0'}\n`;
    answer += `4. **自我否定**：进行了${process.selfNegations}次自我否定，推翻了不完善的观点\n`;
    answer += `5. **综合整合**：最终结论整合了所有角色的有价值观点\n`;

    return answer;
  }

  private extractCommonThemes(roles: ThinkingRole[]): string[] {
    const themes: string[] = [];
    const allArguments = roles.flatMap(r => r.arguments.join(' ')).join(' ');

    const themeKeywords = [
      { keyword: '需要', theme: '需要进一步研究和验证' },
      { keyword: '应该', theme: '应该采取的行动方向' },
      { keyword: '考虑', theme: '需要考虑的重要因素' },
      { keyword: '问题', theme: '识别出的关键问题' },
      { keyword: '可能', theme: '可能性和机会' },
    ];

    themeKeywords.forEach(({ keyword, theme }) => {
      const count = (allArguments.match(new RegExp(keyword, 'g')) || []).length;
      if (count >= roles.length * 0.5) {
        themes.push(theme);
      }
    });

    if (themes.length === 0) {
      themes.push('需要更多讨论才能确定共同主题');
    }

    return themes.slice(0, 3);
  }

  private calculateOverallConfidence(process: ThinkingProcess): number {
    if (process.rounds.length === 0) return 0;

    const lastRound = process.rounds[process.rounds.length - 1];
    if (!lastRound) return 0;

    const avgRoleConfidence = lastRound.roles.reduce((sum, r) => sum + r.confidence, 0) / lastRound.roles.length;
    const depthBonus = Math.min(process.depthProgression[process.depthProgression.length - 1] / 50, 0.1);
    const negationBonus = Math.min(process.selfNegations * 0.02, 0.1);

    return Math.min(avgRoleConfidence + depthBonus + negationBonus, 1);
  }

  private async timeoutGuard(
    processId: string,
    timeout: number,
    task: () => Promise<void>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.activeProcesses.delete(processId);
        reject(new Error(`Thinking process timeout after ${timeout}ms`));
      }, timeout);

      task()
        .then(() => {
          clearTimeout(timer);
          resolve();
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  private async storeThinkingProcess(process: ThinkingProcess): Promise<void> {
    if (!this.memorySystem) return;

    try {
      const summary = `深度思考过程 [${process.id}]\n\n问题: ${process.query}\n\n` +
        `最终结论: ${process.finalConclusion.substring(0, 500)}...\n\n` +
        `置信度: ${(process.confidence * 100).toFixed(1)}%\n\n` +
        `思考轮次: ${process.totalRounds}\n` +
        `自我否定次数: ${process.selfNegations}`;

      await this.memorySystem.addEntry(
        summary,
        ['thinking', 'deep-thought', process.id.substring(0, 8), 'multi-role'],
        3
      );

      Logger.info('Thinking process stored in memory', { processId: process.id });
    } catch (error) {
      Logger.warn('Failed to store thinking process', { error: (error as Error).message });
    }
  }

  getThinkingProcess(processId: string): ThinkingProcess | undefined {
    return this.activeProcesses.get(processId);
  }

  getAllActiveProcesses(): ThinkingProcess[] {
    return Array.from(this.activeProcesses.values());
  }

  async shutdown(): Promise<void> {
    Logger.info('Shutting down Deep Thinking Engine');

    for (const [processId, process] of this.activeProcesses) {
      Logger.warn('Terminating active thinking process', { processId });
      this.emit('thinking-terminated', { processId, reason: 'shutdown' });
    }

    this.activeProcesses.clear();
    this.emit('shutdown');
  }

  updateConfig(config: Partial<DeepThinkingConfig>): void {
    this.config = { ...this.config, ...config };
    Logger.info('Deep Thinking Engine config updated', this.config as unknown as Record<string, unknown>);
  }

  isDeepThinkingRequired(query: string): boolean {
    if (!this.config.enabled) return false;

    const deepThinkingIndicators = [
      '为什么', '如何', '原因', '机制', '原理', '本质', '根本',
      '分析', '评估', '比较', '对比', '评价',
      '策略', '规划', '方案', '建议', '优化',
      '创新', '创意', '新颖', '独特', '突破',
      '辩论', '讨论', '争议', '分歧',
      '复杂', '困难', '挑战', '难题',
    ];

    return deepThinkingIndicators.some(indicator => query.includes(indicator));
  }
}
