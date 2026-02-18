# LocalBot 自定义技能和自动化模型开发指南

## 概述

LocalBot 提供了一个灵活的系统，允许开发者创建自定义技能和自动化模型。本指南将详细介绍如何创建和集成新的功能模块。

## 自定义技能开发

### 1. 技能系统架构

LocalBot 的技能系统由以下组件构成：

- **Tool**: 单个功能单元，执行具体操作
- **Skill**: 一组相关工具的集合，提供特定功能领域的能力
- **SkillManager**: 统一管理所有技能和工具的注册与执行

### 2. 创建自定义工具

要创建一个新的工具，需要实现 `Tool` 接口：

```typescript
import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

export class CustomTool implements Tool {
  name = 'custom_tool_name';  // 工具名称（唯一标识）
  description = '工具描述';    // 工具功能描述
  category = 'utility';       // 工具分类

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      // 实现工具的具体功能
      const result = await this.performAction(params);
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      Logger.error('Custom tool error', { error: (error as Error).message });
      return { 
        success: false, 
        error: `Tool execution failed: ${(error as Error).message}` 
      };
    }
  }

  private async performAction(params: Record<string, unknown>) {
    // 实现具体的业务逻辑
    // 根据传入的参数执行相应的操作
  }
}
```

### 3. 工具命名约定

- 使用小写字母和下划线分隔单词
- 工具名应清晰反映其功能
- 避免与其他工具名称冲突

### 4. 注册新工具

要将新工具集成到系统中，需要在 `SkillManager.ts` 中：

1. 导入新工具类
2. 创建工具实例
3. 注册工具到工具映射中
4. 创建技能定义并注册

```typescript
// 在 SkillManager.ts 中添加
import { CustomTool } from './CustomTool';

// 在 registerDefaultSkills 方法中添加
const customTool = new CustomTool();
this.registerTool(customTool);

// 注册技能
const customSkill = {
  name: 'custom-tools',
  description: '自定义工具集合',
  tools: [customTool],
  enabled: true,
  permissions: [],
};
this.registerSkill(customSkill);
```

## 自定义自动化模型开发

### 1. 自动化模型架构

自动化模型基于工作流引擎，包含以下组件：

- **WorkflowDefinition**: 定义整个工作流的结构
- **WorkflowStep**: 工作流中的单个步骤
- **BusinessProcessManager**: 管理和执行各种业务流程

### 2. 创建自定义业务流程

```typescript
import { WorkflowDefinition } from '../tasks/WorkflowEngine';

export const customBusinessProcess: WorkflowDefinition = {
  id: 'custom-business-process',
  name: '自定义业务流程',
  description: '描述此业务流程的目的和功能',
  steps: [
    {
      id: 'step-1',
      tool: 'tool_name',  // 要使用的工具名称
      params: {
        // 传递给工具的参数
        param1: 'value1',
        param2: '{{previous_step.result_field}}'  // 使用模板语法引用前一步的结果
      },
      description: '第一步描述',
      dependsOn: []  // 依赖的前置步骤
    },
    {
      id: 'step-2',
      tool: 'another_tool_name',
      params: {
        // 参数配置
      },
      description: '第二步描述',
      dependsOn: ['step-1']  // 依赖第一步的结果
    }
  ]
};
```

### 3. 工作流步骤配置

每个工作流步骤包含以下属性：

- **id**: 步骤的唯一标识符
- **tool**: 要执行的工具名称
- **params**: 传递给工具的参数对象
- **description**: 步骤功能描述
- **dependsOn**: 依赖的前置步骤ID数组

### 4. 参数模板语法

工作流支持参数模板，可以在后续步骤中引用前面步骤的结果：

```typescript
{
  id: 'second-step',
  tool: 'data_processor',
  params: {
    inputData: '{{first-step.result.output}}'  // 引用第一步的输出
  },
  dependsOn: ['first-step']
}
```

## 示例：创建一个简单的计算器技能

### 1. 创建计算器工具

```typescript
import { Tool, ToolResult } from '../types';

export class CalculatorTool implements Tool {
  name = 'calculator';
  description = '执行数学计算';
  category = 'utility';

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const expression = params.expression as string;
      
      if (!expression) {
        return { success: false, error: 'Expression is required' };
      }

      // 使用安全的方式计算表达式（在生产环境中应使用更安全的计算方法）
      const result = this.safeEval(expression);
      
      return {
        success: true,
        data: {
          expression,
          result
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: `Calculation failed: ${(error as Error).message}` 
      };
    }
  }

  private safeEval(expr: string): number {
    // 实现安全的表达式计算
    // 注意：在生产环境中应使用专门的安全计算库
    expr = expr.replace(/[^-()\d/*+.]/g, '');
    return eval(expr); // 仅为示例，生产环境需使用安全方法
  }
}
```

### 2. 创建相关的业务流程

```typescript
import { WorkflowDefinition } from '../tasks/WorkflowEngine';

export const financialCalculationProcess: WorkflowDefinition = {
  id: 'financial-calculation-process',
  name: '财务计算流程',
  description: '执行复杂的财务计算任务',
  steps: [
    {
      id: 'calculate-loan-payment',
      tool: 'calculator',
      params: {
        expression: '100000 * (0.05/12) / (1 - (1 + 0.05/12)^-360)'
      },
      description: '计算贷款月还款额'
    },
    {
      id: 'calculate-total-interest',
      tool: 'calculator',
      params: {
        expression: '{{calculate-loan-payment.result.result}} * 360 - 100000'
      },
      description: '计算总利息',
      dependsOn: ['calculate-loan-payment']
    }
  ]
};
```

## 集成到系统中

### 1. 注册新技能

在 `SkillManager.ts` 中添加新工具和技能：

```typescript
import { CalculatorTool } from './CalculatorTool';

// 在 registerDefaultSkills 方法中添加
const calculatorTool = new CalculatorTool();
this.registerTool(calculatorTool);

const calculatorSkill = {
  name: 'calculator-tools',
  description: '数学计算和表达式评估工具',
  tools: [calculatorTool],
  enabled: true,
  permissions: [],
};
this.registerSkill(calculatorSkill);
```

### 2. 注册新业务流程

在 `BusinessProcessManager.ts` 中添加新流程：

```typescript
import { financialCalculationProcess } from './FinancialCalculationModel';

// 在初始化方法中添加
this.processes.set('financial-calculation', financialCalculationProcess);
```

## 最佳实践

### 1. 工具开发最佳实践

- **错误处理**: 始终包含适当的错误处理和日志记录
- **参数验证**: 验证输入参数的有效性
- **安全性**: 对用户输入进行适当的清理和验证
- **性能**: 考虑异步操作和长时间运行任务的处理

### 2. 业务流程最佳实践

- **步骤解耦**: 保持步骤之间的独立性
- **错误恢复**: 设计错误处理和恢复机制
- **状态管理**: 适当管理流程执行状态
- **依赖管理**: 明确定义步骤间的依赖关系

### 3. 测试

- 为每个工具编写单元测试
- 为业务流程编写集成测试
- 测试错误情况和边界条件

## 调试和测试

### 1. 测试工具

```typescript
// 创建测试脚本
import { CalculatorTool } from './CalculatorTool';

async function testCalculator() {
  const tool = new CalculatorTool();
  const result = await tool.execute({ expression: '2 + 3 * 4' });
  console.log('Calculator result:', result);
}

testCalculator();
```

### 2. 测试业务流程

使用工作流引擎来测试业务流程：

```typescript
import { WorkflowEngine } from '../WorkflowEngine';

const engine = new WorkflowEngine();
const result = await engine.execute(financialCalculationProcess);
console.log('Process result:', result);
```

通过遵循这些指南，您可以成功创建和集成自定义技能和自动化模型到 LocalBot 系统中，扩展其功能并满足特定的业务需求。