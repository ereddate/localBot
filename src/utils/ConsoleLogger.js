"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
/**
 * Console Logger utility for tracking skill and automation model calls
 */
class ConsoleLogger {
    static logSkillCall(toolName, params) {
        console.log(`🛠️  调用工具: ${toolName}`, params ? { params } : '');
    }
    static logSkillSuccess(toolName, result) {
        console.log(`✅ 工具成功: ${toolName}`, result ? { result: typeof result === 'object' ? Object.keys(result) : result } : '');
    }
    static logSkillError(toolName, error) {
        console.log(`❌ 工具失败: ${toolName}`, { error });
    }
    static logWorkflowStart(workflowName, workflowId) {
        console.log(`🔄 开始执行工作流: ${workflowName} (ID: ${workflowId})`);
    }
    static logWorkflowComplete(workflowName, workflowId) {
        console.log(`✅ 工作流完成: ${workflowName} (ID: ${workflowId})`);
    }
    static logWorkflowError(workflowName, workflowId, error) {
        console.log(`❌ 工作流失败: ${workflowName} (ID: ${workflowId})`, { error });
    }
    static logAutomationStart(automationName) {
        console.log(`🤖 开始执行自动化: ${automationName}`);
    }
    static logAutomationComplete(automationName) {
        console.log(`✅ 自动化完成: ${automationName}`);
    }
}
exports.ConsoleLogger = ConsoleLogger;
