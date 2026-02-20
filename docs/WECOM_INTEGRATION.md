# 企业微信集成文档

## 概述

LocalBot支持企业微信（WeCom）集成，允许用户通过企业微信群机器人与AI助手进行交互。企业微信集成提供了便捷的企业级消息推送和自动化能力。

## 核心特性

### 1. 消息类型支持

| 消息类型 | 说明 | 适用场景 |
|---------|------|----------|
| **text** | 文本消息 | 普通文本通知 |
| **markdown** | Markdown格式消息 | 格式化内容展示 |
| **image** | 图片消息 | 图片分享 |
| **news** | 图文消息 | 新闻、公告推送 |
| **file** | 文件消息 | 文件分享 |

### 2. 群机器人特性

- 支持企业微信群机器人
- Webhook方式推送消息
- 支持@特定成员
- 支持Markdown格式
- 支持图文卡片

### 3. 集成能力

- 与反向控制系统集成
- 与主动服务引擎集成
- 支持自动化工作流
- 支持定时任务推送
- 支持监控告警推送

## 配置

### 环境变量

```bash
# 启用企业微信平台
WECOM_ENABLED=true

# 企业微信Webhook URL
WECOM_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=your_key_here

# 企业微信Secret（可选）
WECOM_SECRET=your_wecom_secret_here
```

### 配置对象

```typescript
interface WeComPlatformConfig {
  enabled: boolean;      // 是否启用
  webhookUrl: string;     // Webhook URL
  secret?: string;        // 密钥（可选）
}
```

## 快速开始

### 1. 创建企业微信群机器人

1. 在企业微信群中，点击群设置
2. 选择"群机器人" → "添加机器人"
3. 设置机器人名称和头像
4. 复制生成的Webhook URL

### 2. 配置LocalBot

在`.env`文件中添加：

```bash
WECOM_ENABLED=true
WECOM_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=your_key_here
```

### 3. 启动LocalBot

```bash
npm run start:server
```

### 4. 测试连接

```typescript
import { WeComAdapter } from './platforms/WeComAdapter';

const adapter = new WeComAdapter();
await adapter.initialize({
  enabled: true,
  webhookUrl: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=your_key'
});

await adapter.connect();
await adapter.sendText('LocalBot 连接成功！');
```

## 使用示例

### 1. 发送文本消息

```typescript
const adapter = new WeComAdapter();
await adapter.initialize(config);
await adapter.connect();

// 发送普通文本
await adapter.sendText('这是一条普通文本消息');

// @特定成员
await adapter.sendText('这是一条@消息', ['user1', 'user2']);

// @所有成员
await adapter.sendText('这是一条@所有人的消息', ['@all']);
```

### 2. 发送Markdown消息

```typescript
const markdownContent = `
# 标题

## 二级标题

- 列表项1
- 列表项2

**加粗文本**
*斜体文本*

[链接](https://example.com)
`;

await adapter.sendMarkdown(markdownContent);
```

### 3. 发送图文消息

```typescript
const articles = [
  {
    title: 'LocalBot新功能发布',
    description: 'LocalBot现在支持企业微信集成！',
    url: 'https://example.com/news',
    picurl: 'https://example.com/image.png'
  },
  {
    title: '使用指南',
    description: '快速上手LocalBot企业微信集成',
    url: 'https://example.com/guide',
    picurl: 'https://example.com/guide.png'
  }
];

await adapter.sendNews(articles);
```

### 4. 与反向控制集成

```typescript
import { ReverseControlEngine } from './engine/ReverseControlEngine';

const reverseControlEngine = new ReverseControlEngine(config, toolManager, sessionManager);

// 监听反向控制事件，通过企业微信通知
reverseControlEngine.on('action-completed', async (action) => {
  const adapter = platformManager.getAdapter('wecom') as WeComAdapter;
  if (adapter) {
    await adapter.sendText(`反向控制动作完成：${action.id}`);
  }
});

reverseControlEngine.on('action-failed', async (action, error) => {
  const adapter = platformManager.getAdapter('wecom') as WeComAdapter;
  if (adapter) {
    await adapter.sendText(`反向控制动作失败：${action.id}\n错误：${error}`);
  }
});

reverseControlEngine.on('approval-required', async (action) => {
  const adapter = platformManager.getAdapter('wecom') as WeComAdapter;
  if (adapter) {
    await adapter.sendMarkdown(`
**需要审批**

动作ID：${action.id}
动作类型：${action.type}
命令：${action.command}

请确认是否执行此动作。
    `);
  }
});
```

### 5. 与主动服务集成

```typescript
import { ProactiveEngine } from './engine/ProactiveEngine';

const proactiveEngine = new ProactiveEngine(config, sessionManager, businessProcessManager);

// 监听主动服务事件，通过企业微信通知
proactiveEngine.on('task-completed', async (task) => {
  const adapter = platformManager.getAdapter('wecom') as WeComAdapter;
  if (adapter) {
    await adapter.sendText(`定时任务完成：${task.name}`);
  }
});

proactiveEngine.on('task-failed', async (task, error) => {
  const adapter = platformManager.getAdapter('wecom') as WeComAdapter;
  if (adapter) {
    await adapter.sendText(`定时任务失败：${task.name}\n错误：${error}`);
  }
});

proactiveEngine.on('monitoring-alert', async (rule) => {
  const adapter = platformManager.getAdapter('wecom') as WeComAdapter;
  if (adapter) {
    await adapter.sendMarkdown(`
**监控告警**

规则名称：${rule.name}
告警次数：${rule.alertCount}
触发时间：${new Date().toLocaleString()}
    `);
  }
});

// 添加定时任务，通过企业微信发送每日报告
const dailyReportTask = {
  id: 'daily_report_wecom',
  name: '每日报告（企业微信）',
  schedule: '0 9 * * *',  // 每天早上9点
  enabled: true,
  action: {
    type: 'message',
    target: 'wecom',
    content: '早安！这是您的每日报告...'
  },
  runCount: 0,
  errorCount: 0
};

proactiveEngine.addCronTask(dailyReportTask);
```

### 6. 监控告警推送

```typescript
// GitHub仓库监控告警
const githubMonitoring = {
  id: 'github_monitor_wecom',
  name: 'GitHub监控（企业微信）',
  type: 'github' as const,
  enabled: true,
  checkInterval: 300000,  // 5分钟
  action: {
    type: 'message',
    target: 'wecom',
    content: '检测到GitHub仓库有新的提交'
  },
  params: {
    owner: 'owner',
    repo: 'repository',
    lastCommitSha: ''
  },
  alertCount: 0
};

proactiveEngine.addMonitoringRule(githubMonitoring);

// 天气预警
const weatherMonitoring = {
  id: 'weather_monitor_wecom',
  name: '天气预警（企业微信）',
  type: 'weather' as const,
  enabled: true,
  checkInterval: 3600000,  // 1小时
  action: {
    type: 'message',
    target: 'wecom',
    content: '天气预警：检测到降雨'
  },
  params: {
    city: 'Beijing',
    condition: 'rain'
  },
  alertCount: 0
};

proactiveEngine.addMonitoringRule(weatherMonitoring);
```

### 7. 工作流通知

```typescript
// 监听工作流事件
businessProcessManager.on('workflow-completed', async (workflow) => {
  const adapter = platformManager.getAdapter('wecom') as WeComAdapter;
  if (adapter) {
    await adapter.sendMarkdown(`
**工作流完成**

工作流ID：${workflow.id}
工作流名称：${workflow.name}
完成时间：${new Date().toLocaleString()}
    `);
  }
});

businessProcessManager.on('workflow-failed', async (workflow, error) => {
  const adapter = platformManager.getAdapter('wecom') as WeComAdapter;
  if (adapter) {
    await adapter.sendMarkdown(`
**工作流失败**

工作流ID：${workflow.id}
工作流名称：${workflow.name}
失败时间：${new Date().toLocaleString()}
错误：${error}
    `);
  }
});
```

## 高级用法

### 1. 消息模板

```typescript
const messageTemplates = {
  dailyReport: (date: string, tasks: number) => `
**每日报告**

日期：${date}
完成任务数：${tasks}
状态：正常
  `,
  
  alert: (type: string, message: string) => `
**${type}告警**

${message}
时间：${new Date().toLocaleString()}
  `,
  
  taskComplete: (taskId: string, result: string) => `
**任务完成**

任务ID：${taskId}
结果：${result}
  `
};

// 使用模板
await adapter.sendMarkdown(messageTemplates.dailyReport(
  new Date().toLocaleDateString(),
  10
));
```

### 2. 消息队列

```typescript
class MessageQueue {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;

  async enqueue(messageFn: () => Promise<void>) {
    this.queue.push(messageFn);
    if (!this.processing) {
      this.process();
    }
  }

  private async process() {
    this.processing = true;
    while (this.queue.length > 0) {
      const messageFn = this.queue.shift();
      if (messageFn) {
        try {
          await messageFn();
        } catch (error) {
          console.error('Message send failed:', error);
        }
      }
    }
    this.processing = false;
  }
}

const messageQueue = new MessageQueue();

// 批量发送消息
for (let i = 0; i < 10; i++) {
  messageQueue.enqueue(() => adapter.sendText(`消息 ${i + 1}`));
}
```

### 3. 消息重试

```typescript
async function sendWithRetry(
  adapter: WeComAdapter,
  content: string,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await adapter.sendText(content);
      return;
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

await sendWithRetry(adapter, '重要消息');
```

### 4. 消息限流

```typescript
class RateLimiter {
  private lastSendTime = 0;
  private minInterval = 1000;  // 最小间隔1秒

  async send(adapter: WeComAdapter, content: string) {
    const now = Date.now();
    const elapsed = now - this.lastSendTime;
    
    if (elapsed < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - elapsed)
      );
    }
    
    await adapter.sendText(content);
    this.lastSendTime = Date.now();
  }
}

const rateLimiter = new RateLimiter();

// 批量发送，自动限流
for (let i = 0; i < 10; i++) {
  await rateLimiter.send(adapter, `消息 ${i + 1}`);
}
```

## 最佳实践

### 1. 消息格式

- 使用Markdown格式化重要信息
- 合理使用@功能提醒相关人员
- 避免发送过长的消息
- 使用图文消息展示复杂信息

### 2. 消息频率

- 避免频繁发送消息
- 合并相似的消息
- 使用消息队列和限流
- 设置合理的发送间隔

### 3. 错误处理

- 实现消息重试机制
- 记录发送失败的日志
- 设置告警通知
- 定期检查连接状态

### 4. 安全性

- 保护Webhook URL
- 使用Secret验证请求
- 限制消息发送频率
- 监控异常发送行为

## 故障排除

### 问题1: 消息发送失败

**原因**: Webhook URL错误或网络问题

**解决方案**:
```typescript
// 验证Webhook URL
const webhookUrl = process.env.WECOM_WEBHOOK_URL;
console.log('Webhook URL:', webhookUrl);

// 测试连接
try {
  await adapter.sendText('测试消息');
  console.log('Connection successful');
} catch (error) {
  console.error('Connection failed:', error);
}
```

### 问题2: 消息格式错误

**原因**: Markdown格式不正确

**解决方案**:
```typescript
// 验证Markdown格式
const markdown = `
# 标题
- 列表项
[链接](url)
`;

try {
  await adapter.sendMarkdown(markdown);
} catch (error) {
  console.error('Markdown error:', error);
  // 检查Markdown格式
}
```

### 问题3: @功能不工作

**原因**: 成员ID不正确

**解决方案**:
```typescript
// 获取正确的成员ID
// 在企业微信管理后台查看成员ID
const memberIds = ['user1', 'user2'];

await adapter.sendText('@消息', memberIds);
```

### 问题4: 频率限制

**原因**: 发送消息过于频繁

**解决方案**:
```typescript
// 实现限流
const rateLimiter = new RateLimiter();

await rateLimiter.send(adapter, '消息1');
await rateLimiter.send(adapter, '消息2');
```

## 总结

企业微信集成使LocalBot能够无缝融入企业工作环境，提供便捷的消息推送和自动化能力。

### 关键要点

- ✅ 支持多种消息类型（文本、Markdown、图片、图文、文件）
- ✅ 与反向控制系统集成
- ✅ 与主动服务引擎集成
- ✅ 支持监控告警推送
- ✅ 支持工作流通知
- ✅ 完善的错误处理和重试机制

### 相关文档

- [反向控制系统](REVERSE_CONTROL.md)
- [主动服务引擎](PROACTIVE_ENGINE.md)
- [多平台集成](MULTI_PLATFORM_GUIDE.md)
