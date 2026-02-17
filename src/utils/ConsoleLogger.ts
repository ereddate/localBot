/**
 * Console Logger utility for tracking skill and automation model calls
 */
export class ConsoleLogger {
  static logSkillCall(toolName: string, params?: Record<string, unknown>): void {
    console.log(`🛠️  调用工具: ${toolName}`, params ? { params } : '');
  }

  static logSkillSuccess(toolName: string, result?: any): void {
    console.log(`✅ 工具成功: ${toolName}`, result ? { result: typeof result === 'object' ? Object.keys(result) : result } : '');
  }

  static logSkillError(toolName: string, error: string): void {
    console.log(`❌ 工具失败: ${toolName}`, { error });
  }

  static logWorkflowStart(workflowName: string, workflowId: string): void {
    console.log(`🔄 开始执行工作流: ${workflowName} (ID: ${workflowId})`);
  }

  static logWorkflowComplete(workflowName: string, workflowId: string): void {
    console.log(`✅ 工作流完成: ${workflowName} (ID: ${workflowId})`);
  }

  static logWorkflowError(workflowName: string, workflowId: string, error: string): void {
    console.log(`❌ 工作流失败: ${workflowName} (ID: ${workflowId})`, { error });
  }

  static logAutomationStart(automationName: string): void {
    console.log(`🤖 开始执行自动化: ${automationName}`);
  }

  static logAutomationComplete(automationName: string): void {
    console.log(`✅ 自动化完成: ${automationName}`);
  }
}