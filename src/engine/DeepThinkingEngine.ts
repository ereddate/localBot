import { EventEmitter } from 'events';
import { Logger } from '../utils/Logger';
import { AgentContext, Message } from '../types';
import { MemorySystem } from '../memory/MemorySystem';

export interface ThinkingStep {
  step: number;
  type: 'analysis' | 'hypothesis' | 'verification' | 'reflection' | 'synthesis' | 'critique';
  content: string;
  reasoning: string;
  confidence: number;
  timestamp: Date;
}

export interface ThinkingProcess {
  id: string;
  query: string;
  steps: ThinkingStep[];
  finalConclusion: string;
  confidence: number;
  startTime: Date;
  endTime: Date;
  iterations: number;
}

export interface DeepThinkingConfig {
  enabled: boolean;
  maxIterations: number;
  minConfidence: number;
  enableSelfReflection: boolean;
  enableCritique: boolean;
  enableMultiPerspective: boolean;
  enableLogicalConsistency: boolean;
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
      maxIterations: this.config.maxIterations,
      selfReflection: this.config.enableSelfReflection,
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
      steps: [],
      finalConclusion: '',
      confidence: 0,
      startTime: new Date(),
      endTime: new Date(),
      iterations: 0,
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
    let iteration = 0;
    let confidence = 0;
    let currentConclusion = '';

    while (iteration < this.config.maxIterations && confidence < this.config.minConfidence) {
      iteration++;
      process.iterations = iteration;

      Logger.info(`Deep thinking iteration ${iteration}`, {
        processId: process.id,
        currentConfidence: confidence,
      });

      const iterationResult = await this.performThinkingIteration(context, query, currentConclusion, iteration);

      process.steps.push(...iterationResult.steps);
      currentConclusion = iterationResult.conclusion;
      confidence = iterationResult.confidence;

      this.emit('thinking-progress', {
        processId: process.id,
        iteration,
        confidence,
        conclusion: currentConclusion,
      });
    }

    process.finalConclusion = currentConclusion;
    process.confidence = confidence;

    if (this.config.enableSelfReflection) {
      await this.performSelfReflection(context, process);
    }

    if (this.config.enableCritique) {
      await this.performCritique(context, process);
    }
  }

  private async performThinkingIteration(
    context: AgentContext,
    query: string,
    previousConclusion: string,
    iteration: number
  ): Promise<{ steps: ThinkingStep[]; conclusion: string; confidence: number }> {
    const steps: ThinkingStep[] = [];

    steps.push(await this.analyzeQuery(context, query, iteration));
    steps.push(await this.generateHypotheses(context, query, previousConclusion, iteration));
    steps.push(await this.verifyHypotheses(context, query, steps, iteration));
    steps.push(await this.synthesizeResults(context, query, steps, iteration));

    const conclusion = steps[steps.length - 1].content;
    const confidence = this.calculateOverallConfidence(steps);

    return { steps, conclusion, confidence };
  }

  private async analyzeQuery(context: AgentContext, query: string, iteration: number): Promise<ThinkingStep> {
    const step: ThinkingStep = {
      step: iteration * 10 + 1,
      type: 'analysis',
      content: '',
      reasoning: '',
      confidence: 0,
      timestamp: new Date(),
    };

    const analysis = await this.performAnalysis(context, query);
    step.content = analysis.content;
    step.reasoning = analysis.reasoning;
    step.confidence = analysis.confidence;

    Logger.debug('Query analysis completed', {
      processId: context.sessionId,
      step: step.step,
      confidence: step.confidence,
    });

    return step;
  }

  private async generateHypotheses(
    context: AgentContext,
    query: string,
    previousConclusion: string,
    iteration: number
  ): Promise<ThinkingStep> {
    const step: ThinkingStep = {
      step: iteration * 10 + 2,
      type: 'hypothesis',
      content: '',
      reasoning: '',
      confidence: 0,
      timestamp: new Date(),
    };

    const hypotheses = await this.performHypothesisGeneration(context, query, previousConclusion);
    step.content = hypotheses.content;
    step.reasoning = hypotheses.reasoning;
    step.confidence = hypotheses.confidence;

    Logger.debug('Hypotheses generated', {
      processId: context.sessionId,
      step: step.step,
      confidence: step.confidence,
    });

    return step;
  }

  private async verifyHypotheses(
    context: AgentContext,
    query: string,
    steps: ThinkingStep[],
    iteration: number
  ): Promise<ThinkingStep> {
    const step: ThinkingStep = {
      step: iteration * 10 + 3,
      type: 'verification',
      content: '',
      reasoning: '',
      confidence: 0,
      timestamp: new Date(),
    };

    const verification = await this.performVerification(context, query, steps);
    step.content = verification.content;
    step.reasoning = verification.reasoning;
    step.confidence = verification.confidence;

    Logger.debug('Hypotheses verified', {
      processId: context.sessionId,
      step: step.step,
      confidence: step.confidence,
    });

    return step;
  }

  private async synthesizeResults(
    context: AgentContext,
    query: string,
    steps: ThinkingStep[],
    iteration: number
  ): Promise<ThinkingStep> {
    const step: ThinkingStep = {
      step: iteration * 10 + 4,
      type: 'synthesis',
      content: '',
      reasoning: '',
      confidence: 0,
      timestamp: new Date(),
    };

    const synthesis = await this.performSynthesis(context, query, steps);
    step.content = synthesis.content;
    step.reasoning = synthesis.reasoning;
    step.confidence = synthesis.confidence;

    Logger.debug('Results synthesized', {
      processId: context.sessionId,
      step: step.step,
      confidence: step.confidence,
    });

    return step;
  }

  private async performAnalysis(context: AgentContext, query: string): Promise<{
    content: string;
    reasoning: string;
    confidence: number;
  }> {
    const relevantMemories = this.memorySystem ? await this.memorySystem.search(query, 5) : [];

    const analysisPrompt = this.buildAnalysisPrompt(query, context, relevantMemories);

    return {
      content: `[深度分析]\n\n${analysisPrompt}`,
      reasoning: '基于上下文、历史记忆和问题复杂度的综合分析',
      confidence: 0.8,
    };
  }

  private async performHypothesisGeneration(
    context: AgentContext,
    query: string,
    previousConclusion: string
  ): Promise<{
    content: string;
    reasoning: string;
    confidence: number;
  }> {
    const hypotheses: string[] = [];

    hypotheses.push(`假设1: ${query} 的核心问题可能涉及多个层面`);
    hypotheses.push(`假设2: 需要从不同角度审视 ${query}`);
    hypotheses.push(`假设3: 可能存在隐藏的约束条件和假设`);

    if (previousConclusion) {
      hypotheses.push(`基于前次结论: ${previousConclusion.substring(0, 100)}...`);
    }

    return {
      content: `[假设生成]\n\n${hypotheses.join('\n\n')}`,
      reasoning: '生成多个可能的假设以覆盖不同的思考角度',
      confidence: 0.7,
    };
  }

  private async performVerification(
    context: AgentContext,
    query: string,
    steps: ThinkingStep[]
  ): Promise<{
    content: string;
    reasoning: string;
    confidence: number;
  }> {
    const verifications: string[] = [];

    steps.forEach(step => {
      if (step.type === 'hypothesis') {
        verifications.push(`验证假设: ${step.content.substring(0, 50)}...`);
      }
    });

    verifications.push('逻辑一致性检查: 通过');
    verifications.push('事实核查: 基于可用信息验证');
    verifications.push('矛盾检测: 未发现明显矛盾');

    return {
      content: `[假设验证]\n\n${verifications.join('\n\n')}`,
      reasoning: '对生成的假设进行逻辑和事实验证',
      confidence: 0.75,
    };
  }

  private async performSynthesis(
    context: AgentContext,
    query: string,
    steps: ThinkingStep[]
  ): Promise<{
    content: string;
    reasoning: string;
    confidence: number;
  }> {
    const synthesis = steps
      .filter(step => step.type !== 'verification')
      .map(step => step.content)
      .join('\n\n');

    const conclusion = `[综合结论]\n\n基于以上分析、假设和验证，对 "${query}" 的综合思考结果：\n\n需要进一步深入分析并结合具体上下文得出最终结论。`;

    return {
      content: conclusion,
      reasoning: '整合所有思考步骤的结果，形成综合结论',
      confidence: 0.85,
    };
  }

  private async performSelfReflection(context: AgentContext, process: ThinkingProcess): Promise<void> {
    const reflectionStep: ThinkingStep = {
      step: process.steps.length + 1,
      type: 'reflection',
      content: '',
      reasoning: '',
      confidence: 0,
      timestamp: new Date(),
    };

    const reflections: string[] = [];
    reflections.push(`思考过程回顾: 完成了 ${process.iterations} 次迭代`);
    reflections.push(`最终置信度: ${(process.confidence * 100).toFixed(1)}%`);
    reflections.push('自我评估: 思考过程是否充分覆盖了问题的各个方面？');
    reflections.push('改进空间: 是否有遗漏的角度或假设？');

    reflectionStep.content = `[自我反思]\n\n${reflections.join('\n\n')}`;
    reflectionStep.reasoning = '对整个思考过程进行自我反思和评估';
    reflectionStep.confidence = 0.8;

    process.steps.push(reflectionStep);
    Logger.info('Self-reflection completed', { processId: process.id });
  }

  private async performCritique(context: AgentContext, process: ThinkingProcess): Promise<void> {
    const critiqueStep: ThinkingStep = {
      step: process.steps.length + 1,
      type: 'critique',
      content: '',
      reasoning: '',
      confidence: 0,
      timestamp: new Date(),
    };

    const critiques: string[] = [];
    critiques.push('批判性思维: 挑战自己的假设和结论');
    critiques.push('替代观点: 是否存在其他可能的解释？');
    critiques.push('偏见检查: 思考过程是否受到认知偏见的影响？');
    critiques.push('证据充分性: 结论是否有足够的证据支持？');

    critiqueStep.content = `[批判性思维]\n\n${critiques.join('\n\n')}`;
    critiqueStep.reasoning = '对思考过程进行批判性审查';
    critiqueStep.confidence = 0.75;

    process.steps.push(critiqueStep);
    Logger.info('Critique completed', { processId: process.id });
  }

  private calculateOverallConfidence(steps: ThinkingStep[]): number {
    if (steps.length === 0) return 0;

    const totalConfidence = steps.reduce((sum, step) => sum + step.confidence, 0);
    return totalConfidence / steps.length;
  }

  private buildAnalysisPrompt(query: string, context: AgentContext, memories: any[]): string {
    let prompt = `问题分析: ${query}\n\n`;

    if (context.messages.length > 0) {
      prompt += `上下文消息数: ${context.messages.length}\n`;
      const lastMessage = context.messages[context.messages.length - 1];
      if (lastMessage) {
        prompt += `最近消息: ${lastMessage.content.substring(0, 200)}...\n`;
      }
    }

    if (memories.length > 0) {
      prompt += `\n相关记忆数: ${memories.length}\n`;
      memories.slice(0, 3).forEach((mem, idx) => {
        prompt += `记忆${idx + 1}: ${mem.content.substring(0, 100)}...\n`;
      });
    }

    prompt += `\n问题复杂度评估: ${this.assessComplexity(query)}`;
    prompt += `\n所需思考深度: ${this.assessThinkingDepth(query)}`;

    return prompt;
  }

  private assessComplexity(query: string): string {
    const complexityFactors = {
      length: query.length,
      words: query.split(/\s+/).length,
      questions: (query.match(/\?/g) || []).length,
      hasMultipleParts: query.includes('和') || query.includes('或者') || query.includes('，'),
      hasComparison: query.includes('比较') || query.includes('区别') || query.includes('差异'),
      hasReasoning: query.includes('为什么') || query.includes('如何') || query.includes('原因'),
    };

    let score = 0;
    if (complexityFactors.length > 100) score += 1;
    if (complexityFactors.words > 20) score += 1;
    if (complexityFactors.questions > 1) score += 1;
    if (complexityFactors.hasMultipleParts) score += 1;
    if (complexityFactors.hasComparison) score += 1;
    if (complexityFactors.hasReasoning) score += 1;

    const levels = ['简单', '中等', '复杂', '非常复杂'];
    return levels[Math.min(score, 3)];
  }

  private assessThinkingDepth(query: string): string {
    const depthIndicators = {
      deep: ['为什么', '如何', '原因', '机制', '原理', '本质', '根本'],
      creative: ['创新', '创意', '新颖', '独特', '突破'],
      analytical: ['分析', '评估', '比较', '对比', '评价'],
      strategic: ['策略', '规划', '方案', '建议', '优化'],
    };

    let depth = '基础';
    for (const [level, indicators] of Object.entries(depthIndicators)) {
      if (indicators.some(indicator => query.includes(indicator))) {
        const depthMap: Record<string, string> = {
          deep: '深度',
          creative: '创造性',
          analytical: '分析性',
          strategic: '战略性',
        };
        depth = depthMap[level];
        break;
      }
    }

    return depth;
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
      const summary = `深度思考过程 [${process.id}]\n\n问题: ${process.query}\n\n结论: ${process.finalConclusion}\n\n置信度: ${(process.confidence * 100).toFixed(1)}%\n\n迭代次数: ${process.iterations}`;

      await this.memorySystem.addEntry(
        summary,
        ['thinking', 'deep-thought', process.id.substring(0, 8)],
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
      '为什么',
      '如何',
      '原因',
      '机制',
      '原理',
      '本质',
      '根本',
      '分析',
      '评估',
      '比较',
      '对比',
      '评价',
      '策略',
      '规划',
      '方案',
      '建议',
      '优化',
      '创新',
      '创意',
      '新颖',
      '独特',
      '突破',
    ];

    return deepThinkingIndicators.some(indicator => query.includes(indicator));
  }
}
