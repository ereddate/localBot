import * as readline from 'readline';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import { Gateway } from '../gateway/Gateway';
import { MemorySystem } from '../memory/MemorySystem';
import { SkillManager } from '../skills/SkillManager';
import { Logger } from '../utils/Logger';
import { AgentProcessor } from '../agent/AgentProcessor';
import { LLMProvider } from '../config';

export class CLIInterface {
  private gateway: Gateway;
  private memorySystem: MemorySystem;
  private skillManager: SkillManager;
  private agentProcessor: AgentProcessor;
  private rl: readline.Interface;
  private sessionId: string;

  constructor() {
    this.memorySystem = new MemorySystem();
    this.skillManager = new SkillManager(this.memorySystem);
    this.gateway = new Gateway(this.skillManager);
    this.agentProcessor = new AgentProcessor(this.skillManager);
    this.sessionId = `cli-${uuidv4()}`; // Generate unique session ID
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start(): Promise<void> {
    this.printHeader();

    const context = await this.gateway.createContext(this.sessionId);
    context.availableTools = this.skillManager.getEnabledTools();

    // Initialize automation features
    await this.agentProcessor.initializeAutomation();

    while (true) {
      const input = await this.prompt(chalk.cyan('You: '));

      if (input.toLowerCase() === 'exit') {
        await this.handleExit();
        break;
      }

      if (input.toLowerCase() === 'help') {
        this.showHelp();
        continue;
      }

      if (input.toLowerCase() === 'tools') {
        this.showTools();
        continue;
      }

      if (input.toLowerCase() === 'skills') {
        this.showSkills();
        continue;
      }

      if (input.toLowerCase() === 'memory') {
        await this.showMemory();
        continue;
      }

      if (input.toLowerCase() === 'clear') {
        await this.clearSession();
        continue;
      }

      if (input.toLowerCase().startsWith('ai ')) {
        await this.handleAICommand(input.substring(3));
        continue;
      }

      if (input.toLowerCase() === 'stats') {
        await this.showAIStats();
        continue;
      }

      if (input.trim() === '') {
        continue;
      }

      await this.processMessage(input);
    }
  }

  private printHeader(): void {
    console.log();
    console.log(chalk.bold.blue('╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.blue('║') + chalk.bold.green('  🤖 Local AI Assistant') + ' '.repeat(43) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('║') + ' ' + chalk.gray('Powered by TypeScript + Node.js') + ' '.repeat(35) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('╚════════════════════════════════════════════════════════════╝'));
    console.log(chalk.gray('Type "help" for available commands\n'));
  }

  private async processMessage(input: string): Promise<void> {
    process.stdout.write(chalk.yellow('Assistant: '));
    
    try {
      const response = await this.gateway.processMessage(this.sessionId, input);
      console.log(chalk.white(response));
    } catch (error) {
      console.log(chalk.red(`Error: ${(error as Error).message}`));
    }
    
    console.log();
  }

  private async handleExit(): Promise<void> {
    await this.gateway.closeSession(this.sessionId);
    console.log();
    console.log(chalk.green('✓') + ' Session saved. Goodbye! ' + chalk.yellow('👋'));
    console.log();
    this.rl.close();
  }

  private async clearSession(): Promise<void> {
    await this.agentProcessor.clearHistory(this.sessionId);
    console.log(chalk.green('✓') + ' Session history cleared');
    console.log();
  }

  private async showMemory(): Promise<void> {
    const entries = await this.memorySystem.getRecentEntries(7);
    
    console.log();
    console.log(chalk.bold.blue('┌─────────────────────────────────────────────────────────────┐'));
    console.log(chalk.bold.blue('│') + chalk.bold.yellow(' Recent Memory (Last 7 Days)') + ' '.repeat(19) + chalk.bold.blue('│'));
    console.log(chalk.bold.blue('├─────────────────────────────────────────────────────────────┤'));
    
    if (entries.length === 0) {
      console.log(chalk.bold.blue('│') + ' ' + chalk.gray('No memories found') + ' '.repeat(38) + chalk.bold.blue('│'));
    } else {
      entries.slice(0, 5).forEach((entry, index) => {
        const date = entry.timestamp.toLocaleDateString();
        const content = entry.content.substring(0, 50) + (entry.content.length > 50 ? '...' : '');
        console.log(chalk.bold.blue('│') + ` ${chalk.cyan(`${index + 1}.`)} ${chalk.gray(date)} - ${chalk.white(content)}`);
      });
      
      if (entries.length > 5) {
        console.log(chalk.bold.blue('│') + ` ${chalk.gray(`... and ${entries.length - 5} more entries`)}`);
      }
    }
    
    console.log(chalk.bold.blue('└─────────────────────────────────────────────────────────────┘'));
    console.log();
  }

  private showHelp(): void {
    console.log();
    console.log(chalk.bold.blue('╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.blue('║') + chalk.bold.yellow(' Available Commands') + ' '.repeat(43) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('╠════════════════════════════════════════════════════════════╣'));
    console.log(chalk.bold.blue('║') + ' ' + chalk.green('help') + '    - Show this help message' + ' '.repeat(33) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('║') + ' ' + chalk.green('tools') + '   - List available tools' + ' '.repeat(36) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('║') + ' ' + chalk.green('skills') + '  - List available skills' + ' '.repeat(36) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('║') + ' ' + chalk.green('memory') + '  - Show recent memory' + ' '.repeat(36) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('║') + ' ' + chalk.green('clear') + '   - Clear session history' + ' '.repeat(35) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('║') + ' ' + chalk.green('ai') + '      - AI provider commands' + ' '.repeat(34) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('║') + ' ' + chalk.green('stats') + '   - Show AI usage statistics' + ' '.repeat(31) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('║') + ' ' + chalk.red('exit') + '    - Exit the assistant' + ' '.repeat(37) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('╚════════════════════════════════════════════════════════════╝'));
    console.log();
  }

  private showTools(): void {
    const tools = this.skillManager.getAllTools();
    
    console.log();
    console.log(chalk.bold.blue('╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.blue('║') + chalk.bold.yellow(' Available Tools') + ' '.repeat(46) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('╠════════════════════════════════════════════════════════════╣'));
    
    const categories = this.groupToolsByCategory(tools);
    for (const [category, categoryTools] of Object.entries(categories)) {
      console.log(chalk.bold.blue('║') + ' ' + chalk.cyan(`[${category.toUpperCase()}]`));
      categoryTools.forEach(tool => {
        console.log(chalk.bold.blue('║') + '   ' + chalk.green(`• ${tool.name}`) + chalk.gray(` - ${tool.description}`));
      });
    }
    
    console.log(chalk.bold.blue('╚════════════════════════════════════════════════════════════╝'));
    console.log();
  }

  private showSkills(): void {
    const skills = this.skillManager.getAllSkills();
    
    console.log();
    console.log(chalk.bold.blue('╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.blue('║') + chalk.bold.yellow(' Available Skills') + ' '.repeat(46) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('╠════════════════════════════════════════════════════════════╣'));
    
    skills.forEach(skill => {
      const status = skill.enabled 
        ? chalk.green('✓ ENABLED') 
        : chalk.red('✗ DISABLED');
      console.log(chalk.bold.blue('║') + ' ' + chalk.cyan(`[${skill.name}]`) + ' '.repeat(20 - skill.name.length) + status);
      console.log(chalk.bold.blue('║') + '   ' + chalk.gray(skill.description));
      console.log(chalk.bold.blue('║'));
    });
    
    console.log(chalk.bold.blue('╚════════════════════════════════════════════════════════════╝'));
    console.log();
  }

  private async handleAICommand(command: string): Promise<void> {
    const parts = command.trim().split(' ');
    const action = parts[0].toLowerCase();

    switch (action) {
      case 'list':
        this.showAIProviders();
        break;
      case 'switch':
        if (parts.length < 2) {
          console.log(chalk.red('Usage: ai switch <provider>'));
          console.log(chalk.gray('Available providers: openai, aliyun, anthropic'));
        } else {
          await this.switchAIProvider(parts[1]);
        }
        break;
      case 'current':
        this.showCurrentAI();
        break;
      default:
        console.log(chalk.red('Unknown AI command. Available: list, switch, current'));
    }
    console.log();
  }

  private showAIProviders(): void {
    const providers = this.agentProcessor.getRouter().getAllProviders();
    
    console.log();
    console.log(chalk.bold.blue('╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.blue('║') + chalk.bold.yellow(' Available AI Providers') + ' '.repeat(40) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('╠════════════════════════════════════════════════════════════╣'));
    
    providers.forEach(provider => {
      const isCurrent = provider.name === this.agentProcessor.getRouter().getCurrentProvider();
      const indicator = isCurrent ? chalk.green('✓') : ' ';
      const capabilities = provider.capabilities.join(', ');
      
      console.log(chalk.bold.blue('║') + ` ${indicator} ${chalk.cyan(provider.displayName)}`);
      console.log(chalk.bold.blue('║') + `   ${chalk.gray('Capabilities:')} ${chalk.white(capabilities)}`);
      console.log(chalk.bold.blue('║') + `   ${chalk.gray('Max Tokens:')} ${chalk.white(provider.maxTokens.toString())}`);
      console.log(chalk.bold.blue('║') + `   ${chalk.gray('Latency:')} ${chalk.white(provider.latency + 'ms')}`);
      console.log(chalk.bold.blue('║'));
    });
    
    console.log(chalk.bold.blue('╚════════════════════════════════════════════════════════════╝'));
    console.log(chalk.gray('Use "ai switch <provider>" to change provider'));
    console.log();
  }

  private async switchAIProvider(providerName: string): Promise<void> {
    const provider = providerName as LLMProvider;
    
    if (!this.agentProcessor.getRouter().isProviderAvailable(provider)) {
      console.log(chalk.red(`Provider "${providerName}" is not available.`));
      console.log(chalk.gray('Available providers: openai, aliyun, anthropic'));
      return;
    }

    this.agentProcessor.switchProvider(provider);
    console.log(chalk.green(`✓`) + ` Switched to ${chalk.cyan(providerName)}`);
  }

  private showCurrentAI(): void {
    const currentProvider = this.agentProcessor.getRouter().getCurrentProvider();
    const providerConfig = this.agentProcessor.getRouter().getProviderConfig(currentProvider);
    
    console.log();
    console.log(chalk.bold.blue('╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.blue('║') + chalk.bold.yellow(' Current AI Provider') + ' '.repeat(41) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('╠════════════════════════════════════════════════════════════╣'));
    console.log(chalk.bold.blue('║') + ' ' + chalk.cyan(providerConfig?.displayName || 'Unknown'));
    console.log(chalk.bold.blue('║') + ' ' + chalk.gray(`Provider: ${currentProvider}`));
    console.log(chalk.bold.blue('╚════════════════════════════════════════════════════════════╝'));
    console.log();
  }

  private async showAIStats(): Promise<void> {
    const stats = this.agentProcessor.getRouter().getUsageStats();
    
    console.log();
    console.log(chalk.bold.blue('╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.blue('║') + chalk.bold.yellow(' AI Usage Statistics') + ' '.repeat(42) + chalk.bold.blue('║'));
    console.log(chalk.bold.blue('╠════════════════════════════════════════════════════════════╣'));
    
    for (const [provider, stat] of stats.entries()) {
      const providerConfig = this.agentProcessor.getRouter().getProviderConfig(provider);
      const displayName = providerConfig?.displayName || provider;
      const isCurrent = provider === this.agentProcessor.getRouter().getCurrentProvider();
      const indicator = isCurrent ? chalk.green('✓') : ' ';
      
      console.log(chalk.bold.blue('║') + ` ${indicator} ${chalk.cyan(displayName)}`);
      console.log(chalk.bold.blue('║') + `   ${chalk.gray('Total Calls:')} ${chalk.white(stat.calls.toString())}`);
      console.log(chalk.bold.blue('║') + `   ${chalk.gray('Errors:')} ${chalk.red(stat.errors.toString())}`);
      console.log(chalk.bold.blue('║') + `   ${chalk.gray('Error Rate:')} ${stat.errorRate > 0 ? chalk.red((stat.errorRate * 100).toFixed(2) + '%') : chalk.green('0%')}`);
      console.log(chalk.bold.blue('║'));
    }
    
    console.log(chalk.bold.blue('╚════════════════════════════════════════════════════════════╝'));
    console.log();
  }

  private groupToolsByCategory(tools: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {};
    tools.forEach(tool => {
      const category = tool.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(tool);
    });
    return grouped;
  }

  private prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }
}
