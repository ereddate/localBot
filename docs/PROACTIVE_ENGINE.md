# 主动服务引擎文档

## 概述

主动服务引擎（Proactive Engine）是LocalBot的核心功能之一，允许AI助手主动执行任务，而无需用户主动触发。基于定时任务和Webhook触发器，实现7×24小时的自动化服务。

## 核心特性

### 1. 定时任务（Cron）

基于cron表达式的定时任务调度：

- 支持标准的cron表达式
- 自动计算下次执行时间
- 任务执行历史记录
- 错误处理和重试机制

### 2. Webhook触发器

通过HTTP Webhook触发任务：

- RESTful API接口
- 支持GET和POST请求
- 触发历史记录
- 错误处理和重试

### 3. 监控规则

实时监控外部变化并触发告警：

- GitHub仓库更新监控
- 天气预警监控
- 价格变动监控
- 自定义监控规则

### 4. 动作类型

支持多种主动动作：

| 动作类型 | 说明 | 示例 |
|---------|------|------|
| **message** | 发送消息 | 主动向用户发送通知 |
| **workflow** | 执行工作流 | 运行预定义的业务流程 |
| **notification** | 发送通知 | 系统级通知 |
| **custom** | 自定义动作 | 执行自定义逻辑 |

## 配置

### 环境变量

```bash
# 启用主动服务引擎
PROACTIVE_ENGINE_ENABLED=true

# 最大并发任务数
PROACTIVE_ENGINE_MAX_CONCURRENT=3

# 任务超时时间（毫秒）
PROACTIVE_ENGINE_TASK_TIMEOUT=60000

# Webhook服务端口
PROACTIVE_ENGINE_WEBHOOK_PORT=3001
```

### 配置对象

```typescript
interface ProactiveEngineConfig {
  enabled: boolean;              // 是否启用
  maxConcurrentTasks: number;    // 最大并发任务数
  taskTimeout: number;           // 任务超时时间
  webhookPort: number;           // Webhook服务端口
  logTasks: boolean;             // 是否记录任务日志
}
```

## 使用示例

### 1. 定时任务

#### 每日报告

```typescript
import { ProactiveEngine } from './engine/ProactiveEngine';

const engine = new ProactiveEngine(config, sessionManager, businessProcessManager);

// 每天早上9点发送日报
const dailyReportTask = {
  id: 'daily_report',
  name: '每日报告',
  schedule: '0 9 * * *',  // cron表达式
  enabled: true,
  action: {
    type: 'message',
    target: 'user123',
    content: '早安！这是您的每日报告...'
  },
  runCount: 0,
  errorCount: 0
};

engine.addCronTask(dailyReportTask);
```

#### 每周备份

```typescript
// 每周日凌晨2点执行备份
const weeklyBackupTask = {
  id: 'weekly_backup',
  name: '每周备份',
  schedule: '0 2 * * 0',  // 每周日凌晨2点
  enabled: true,
  action: {
    type: 'workflow',
    target: 'system',
    workflowId: 'backup_workflow',
    params: {
      type: 'full',
      destination: '/backup'
    }
  },
  runCount: 0,
  errorCount: 0
};

engine.addCronTask(weeklyBackupTask);
```

#### 每月清理

```typescript
// 每月1号凌晨3点清理临时文件
const monthlyCleanupTask = {
  id: 'monthly_cleanup',
  name: '每月清理',
  schedule: '0 3 1 * *',  // 每月1号凌晨3点
  enabled: true,
  action: {
    type: 'system',
    target: 'system',
    command: 'rm -rf /tmp/*'
  },
  runCount: 0,
  errorCount: 0
};

engine.addCronTask(monthlyCleanupTask);
```

### 2. Webhook触发器

#### GitHub Webhook

```typescript
const githubWebhook = {
  id: 'github_trigger',
  name: 'GitHub触发器',
  endpoint: '/webhook/github',
  method: 'POST' as const,
  enabled: true,
  action: {
    type: 'notification',
    target: 'devops',
    content: 'GitHub仓库有新的提交'
  },
  triggerCount: 0,
  errorCount: 0
};

engine.addWebhookTrigger(githubWebhook);
```

#### CI/CD Webhook

```typescript
const cicdWebhook = {
  id: 'cicd_trigger',
  name: 'CI/CD触发器',
  endpoint: '/webhook/cicd',
  method: 'POST' as const,
  enabled: true,
  action: {
    type: 'workflow',
    target: 'devops',
    workflowId: 'deployment_workflow',
    params: {
      environment: 'production'
    }
  },
  triggerCount: 0,
  errorCount: 0
};

engine.addWebhookTrigger(cicdWebhook);
```

### 3. 监控规则

#### GitHub仓库监控

```typescript
const githubMonitoring = {
  id: 'github_monitor',
  name: 'GitHub仓库监控',
  type: 'github' as const,
  enabled: true,
  checkInterval: 300000,  // 5分钟检查一次
  action: {
    type: 'message',
    target: 'user123',
    content: '检测到新的提交'
  },
  params: {
    owner: 'owner',
    repo: 'repository',
    lastCommitSha: ''
  },
  alertCount: 0
};

engine.addMonitoringRule(githubMonitoring);
```

#### 天气预警监控

```typescript
const weatherMonitoring = {
  id: 'weather_monitor',
  name: '天气预警',
  type: 'weather' as const,
  enabled: true,
  checkInterval: 3600000,  // 1小时检查一次
  action: {
    type: 'message',
    target: 'user123',
    content: '天气预警：检测到降雨'
  },
  params: {
    city: 'Beijing',
    condition: 'rain'
  },
  alertCount: 0
};

engine.addMonitoringRule(weatherMonitoring);
```

#### 价格变动监控

```typescript
const priceMonitoring = {
  id: 'price_monitor',
  name: '价格监控',
  type: 'price' as const,
  enabled: true,
  checkInterval: 600000,  // 10分钟检查一次
  action: {
    type: 'message',
    target: 'user123',
    content: '价格变动：检测到价格下降'
  },
  params: {
    url: 'https://example.com/product',
    priceSelector: '.price',
    threshold: 100,
    lastPrice: 0
  },
  alertCount: 0
};

engine.addMonitoringRule(priceMonitoring);
```

#### 自定义监控规则

```typescript
const customMonitoring = {
  id: 'custom_monitor',
  name: '自定义监控',
  type: 'custom' as const,
  enabled: true,
  checkInterval: 60000,  // 1分钟检查一次
  action: {
    type: 'notification',
    target: 'system',
    content: '自定义条件触发'
  },
  params: {
    checkFunction: `
      // 自定义检查逻辑
      const value = params.value;
      return value > params.threshold;
    `,
    value: 100,
    threshold: 50
  },
  alertCount: 0
};

engine.addMonitoringRule(customMonitoring);
```

## 事件监听

### 任务生命周期事件

```typescript
// 任务完成
engine.on('task-completed', (task) => {
  console.log('Task completed:', task.id, task.runCount);
});

// 任务失败
engine.on('task-failed', (task, error) => {
  console.error('Task failed:', task.id, error);
});

// Webhook触发
engine.on('webhook-triggered', (trigger) => {
  console.log('Webhook triggered:', trigger.id, trigger.triggerCount);
});

// 监控告警
engine.on('monitoring-alert', (rule) => {
  console.log('Monitoring alert:', rule.id, rule.alertCount);
});
```

## 管理操作

### 查询任务

```typescript
// 获取所有定时任务
const cronTasks = engine.getCronTasks();
console.log('Cron tasks:', cronTasks.length);

// 获取所有Webhook触发器
const webhookTriggers = engine.getWebhookTriggers();
console.log('Webhook triggers:', webhookTriggers.length);

// 获取所有监控规则
const monitoringRules = engine.getMonitoringRules();
console.log('Monitoring rules:', monitoringRules.length);
```

### 删除任务

```typescript
// 删除定时任务
engine.removeCronTask('daily_report');

// 删除Webhook触发器
engine.removeWebhookTrigger('github_trigger');

// 删除监控规则
engine.removeMonitoringRule('github_monitor');
```

### 更新配置

```typescript
engine.updateConfig({
  maxConcurrentTasks: 5,
  taskTimeout: 120000,
  logTasks: true
});
```

## Cron表达式参考

| 表达式 | 说明 | 示例 |
|---------|------|------|
| `* * * * *` | 每分钟执行 | 每分钟 |
| `0 * * * *` | 每小时执行 | 每小时的第0分钟 |
| `0 0 * * *` | 每天执行 | 每天0点0分 |
| `0 0 * * 0` | 每周执行 | 每周日0点0分 |
| `0 0 1 * *` | 每月执行 | 每月1号0点0分 |
| `0 9 * * 1-5` | 工作日执行 | 周一到周五早上9点 |
| `0 9,18 * * *` | 每天两次 | 每天9点和18点 |
| `*/30 * * * *` | 每30分钟 | 每30分钟 |

## 最佳实践

### 1. 任务设计

- 保持任务简单和专注
- 避免长时间运行的任务
- 实现适当的错误处理
- 记录任务执行日志

### 2. 性能优化

- 合理设置并发任务数
- 使用适当的检查间隔
- 避免频繁的监控检查
- 优化任务执行逻辑

### 3. 监控和告警

- 监听所有任务事件
- 设置失败告警
- 记录任务执行历史
- 定期审查任务性能

### 4. 安全性

- 限制Webhook访问权限
- 验证Webhook请求来源
- 使用HTTPS保护Webhook端点
- 实施速率限制

## 故障排除

### 问题1: 定时任务不执行

**原因**: Cron表达式错误或时区问题

**解决方案**:
```typescript
// 验证cron表达式
const task = {
  id: 'test_task',
  name: '测试任务',
  schedule: '0 * * * *',  // 每小时执行
  enabled: true,
  action: { type: 'message', target: 'user', content: 'Test' },
  runCount: 0,
  errorCount: 0
};

engine.addCronTask(task);

// 检查任务状态
const tasks = engine.getCronTasks();
console.log('Next run:', tasks[0].nextRun);
```

### 问题2: Webhook未触发

**原因**: Webhook URL错误或端口未开放

**解决方案**:
```typescript
// 检查Webhook配置
const triggers = engine.getWebhookTriggers();
console.log('Webhook port:', config.proactiveEngine.webhookPort);

// 测试Webhook端点
curl -X POST http://localhost:3001/webhook/test_trigger \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### 问题3: 监控规则不工作

**原因**: 检查间隔太长或条件不正确

**解决方案**:
```typescript
// 调整检查间隔
const rule = {
  id: 'test_monitor',
  name: '测试监控',
  type: 'custom' as const,
  enabled: true,
  checkInterval: 60000,  // 1分钟
  action: { type: 'notification', target: 'system', content: 'Alert' },
  params: {
    checkFunction: 'return true;',  // 总是触发
    value: 100,
    threshold: 50
  },
  alertCount: 0
};

engine.addMonitoringRule(rule);
```

### 问题4: 任务超时

**原因**: 任务执行时间超过配置的超时时间

**解决方案**:
```typescript
engine.updateConfig({
  taskTimeout: 120000  // 增加到2分钟
});
```

## 高级用法

### 1. 动态任务管理

```typescript
// 根据条件动态添加任务
function addDynamicTask(condition: boolean) {
  if (condition) {
    const task = {
      id: 'dynamic_task',
      name: '动态任务',
      schedule: '0 * * * *',
      enabled: true,
      action: { type: 'message', target: 'user', content: 'Dynamic' },
      runCount: 0,
      errorCount: 0
    };
    engine.addCronTask(task);
  }
}

addDynamicTask(true);
```

### 2. 任务依赖

```typescript
// 实现任务依赖
async function executeWithDependency(tasks) {
  for (const task of tasks) {
    await new Promise((resolve) => {
      const handler = () => {
        engine.off('task-completed', handler);
        resolve();
      };
      engine.on('task-completed', handler);
      engine.addCronTask(task);
    });
  }
}

await executeWithDependency([
  { id: 'task1', name: '任务1', schedule: '0 * * * *', enabled: true, action: { type: 'message', target: 'user', content: 'Task 1' }, runCount: 0, errorCount: 0 },
  { id: 'task2', name: '任务2', schedule: '0 * * * *', enabled: true, action: { type: 'message', target: 'user', content: 'Task 2' }, runCount: 0, errorCount: 0 }
]);
```

### 3. 条件任务

```typescript
// 根据条件执行任务
const conditionalTask = {
  id: 'conditional_task',
  name: '条件任务',
  schedule: '0 * * * *',
  enabled: true,
  action: {
    type: 'custom',
    target: 'system',
    customFunction: `
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 9 && hour <= 18) {
        // 工作时间执行
        return 'execute';
      } else {
        // 非工作时间跳过
        return 'skip';
      }
    `
  },
  runCount: 0,
  errorCount: 0
};

engine.addCronTask(conditionalTask);
```

## 总结

主动服务引擎为LocalBot提供了强大的自动化能力，使AI助手能够主动执行任务，提供7×24小时的服务。

### 关键要点

- ✅ 基于cron的定时任务调度
- ✅ Webhook触发器支持
- ✅ 多种监控规则（GitHub、天气、价格、自定义）
- ✅ 多种动作类型（消息、工作流、通知、自定义）
- ✅ 完善的事件监听和管理接口
- ✅ 灵活的配置选项

### 相关文档

- [反向控制系统](REVERSE_CONTROL.md)
- [企业微信集成](WECOM_INTEGRATION.md)
- [工作流引擎](WORKFLOW_ENGINE.md)
