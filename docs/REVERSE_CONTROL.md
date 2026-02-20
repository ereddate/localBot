# 反向控制系统文档

## 概述

反向控制系统（Reverse Control Engine）是LocalBot的核心功能之一，允许AI助手主动控制系统资源，执行各种任务，而不仅仅是被动响应用户请求。

## 核心特性

### 1. 动作类型

反向控制系统支持多种动作类型：

| 动作类型 | 说明 | 示例 |
|---------|------|------|
| **system** | 系统命令执行 | 运行shell命令、脚本 |
| **browser** | 浏览器自动化 | 网页操作、数据抓取 |
| **file** | 文件系统操作 | 读写文件、目录管理 |
| **network** | 网络请求 | HTTP请求、API调用 |
| **custom** | 自定义工具调用 | 使用自定义技能工具 |

### 2. 权限控制

系统提供细粒度的权限控制：

- **启用/禁用**: 全局开关控制反向控制功能
- **审批机制**: 可选的用户审批流程
- **动作白名单**: 限制允许执行的动作类型
- **并发限制**: 控制同时执行的动作数量
- **超时保护**: 防止长时间运行的任务

### 3. 安全机制

- **动作审计**: 记录所有执行的动作
- **错误处理**: 完善的错误捕获和报告
- **资源限制**: 防止资源耗尽
- **权限验证**: 确保只有授权的动作可以执行

## 配置

### 环境变量

```bash
# 启用反向控制
REVERSE_CONTROL_ENABLED=true

# 是否需要用户审批
REVERSE_CONTROL_REQUIRE_APPROVAL=true

# 最大并发动作数
REVERSE_CONTROL_MAX_CONCURRENT=5

# 动作超时时间（毫秒）
REVERSE_CONTROL_TIMEOUT=30000
```

### 配置对象

```typescript
interface ReverseControlConfig {
  enabled: boolean;           // 是否启用
  requireApproval: boolean;    // 是否需要审批
  allowedActions: string[];     // 允许的动作类型
  maxConcurrentActions: number; // 最大并发数
  timeout: number;             // 超时时间
  logActions: boolean;         // 是否记录日志
}
```

## 使用示例

### 1. 执行系统命令

```typescript
import { ReverseControlEngine } from './engine/ReverseControlEngine';

const engine = new ReverseControlEngine(config, toolManager, sessionManager);

const action = {
  id: 'action_001',
  type: 'system',
  command: 'ls -la',
  params: {},
  permissions: ['system'],
  userId: 'user123',
  sessionId: 'session456',
  timestamp: new Date(),
  status: 'pending'
};

await engine.executeAction(action);
```

### 2. 浏览器自动化

```typescript
const action = {
  id: 'action_002',
  type: 'browser',
  command: 'navigate',
  params: {
    url: 'https://example.com',
    action: 'screenshot'
  },
  permissions: ['browser'],
  userId: 'user123',
  sessionId: 'session456',
  timestamp: new Date(),
  status: 'pending'
};

await engine.executeAction(action);
```

### 3. 文件操作

```typescript
const action = {
  id: 'action_003',
  type: 'file',
  command: 'write',
  params: {
    path: '/tmp/output.txt',
    content: 'Hello, World!'
  },
  permissions: ['file'],
  userId: 'user123',
  sessionId: 'session456',
  timestamp: new Date(),
  status: 'pending'
};

await engine.executeAction(action);
```

### 4. 网络请求

```typescript
const action = {
  id: 'action_004',
  type: 'network',
  command: 'get',
  params: {
    url: 'https://api.example.com/data',
    headers: {
      'Authorization': 'Bearer token123'
    }
  },
  permissions: ['network'],
  userId: 'user123',
  sessionId: 'session456',
  timestamp: new Date(),
  status: 'pending'
};

await engine.executeAction(action);
```

### 5. 自定义工具调用

```typescript
const action = {
  id: 'action_005',
  type: 'custom',
  command: 'my_custom_tool',
  params: {
    param1: 'value1',
    param2: 'value2'
  },
  permissions: ['custom'],
  userId: 'user123',
  sessionId: 'session456',
  timestamp: new Date(),
  status: 'pending'
};

await engine.executeAction(action);
```

## 事件监听

### 动作生命周期事件

```typescript
// 动作开始
engine.on('action-started', (action) => {
  console.log('Action started:', action.id);
});

// 动作完成
engine.on('action-completed', (action) => {
  console.log('Action completed:', action.id, action.result);
});

// 动作失败
engine.on('action-failed', (action) => {
  console.error('Action failed:', action.id, action.error);
});

// 需要审批
engine.on('approval-required', (action) => {
  console.log('Action requires approval:', action.id);
  // 显示审批UI或发送通知
});
```

### 审批流程

```typescript
// 用户批准动作
engine.approveAction('action_001');

// 用户拒绝动作
engine.rejectAction('action_001');
```

## 状态查询

### 获取动作状态

```typescript
const action = engine.getActionStatus('action_001');
console.log(action.status); // 'pending' | 'executing' | 'completed' | 'failed'
```

### 获取所有动作

```typescript
const allActions = engine.getAllActions();
console.log('Total actions:', allActions.length);
```

### 获取正在执行的动作

```typescript
const executingActions = engine.getExecutingActions();
console.log('Executing:', executingActions.length);
```

## 最佳实践

### 1. 安全性

- 始终启用审批机制，特别是对于危险操作
- 限制允许的动作类型
- 设置合理的超时时间
- 定期审查动作日志

### 2. 性能

- 根据系统资源调整最大并发数
- 避免长时间运行的任务
- 使用适当的超时设置

### 3. 监控

- 监听所有事件以跟踪动作状态
- 记录失败的动作以便调试
- 设置告警机制

### 4. 错误处理

```typescript
try {
  await engine.executeAction(action);
} catch (error) {
  console.error('Action execution failed:', error);
  // 处理错误，重试或通知用户
}
```

## 故障排除

### 问题1: 动作被拒绝

**原因**: 动作类型不在允许列表中

**解决方案**:
```typescript
engine.updateConfig({
  allowedActions: ['system', 'browser', 'file', 'network', 'custom']
});
```

### 问题2: 动作超时

**原因**: 动作执行时间超过配置的超时时间

**解决方案**:
```typescript
engine.updateConfig({
  timeout: 60000 // 增加到60秒
});
```

### 问题3: 并发限制

**原因**: 同时执行的动作数量超过最大并发数

**解决方案**:
```typescript
engine.updateConfig({
  maxConcurrentActions: 10 // 增加并发数
});
```

### 问题4: 审批超时

**原因**: 动作需要审批但用户未响应

**解决方案**: 实现自动审批或提醒机制
```typescript
engine.on('approval-required', (action) => {
  // 发送通知给用户
  sendNotification(`Action ${action.id} requires approval`);
});
```

## 高级用法

### 1. 批量执行动作

```typescript
const actions = [
  { id: 'action_001', type: 'system', command: 'echo "Task 1"' },
  { id: 'action_002', type: 'system', command: 'echo "Task 2"' },
  { id: 'action_003', type: 'system', command: 'echo "Task 3"' }
];

const results = await Promise.all(
  actions.map(action => engine.executeAction(action))
);
```

### 2. 条件执行

```typescript
const action = {
  id: 'action_001',
  type: 'system',
  command: 'if [ -f "/tmp/file.txt" ]; then cat /tmp/file.txt; fi',
  params: {},
  permissions: ['system']
};

await engine.executeAction(action);
```

### 3. 链式执行

```typescript
async function executeChain(actions) {
  for (const action of actions) {
    const result = await engine.executeAction(action);
    if (action.status === 'failed') {
      throw new Error(`Action ${action.id} failed`);
    }
  }
}

await executeChain([
  { id: 'action_001', type: 'system', command: 'mkdir -p /tmp/dir' },
  { id: 'action_002', type: 'file', command: 'write', params: { path: '/tmp/dir/file.txt', content: 'Hello' } },
  { id: 'action_003', type: 'system', command: 'cat /tmp/dir/file.txt' }
]);
```

## 总结

反向控制系统为LocalBot提供了强大的自动化能力，使AI助手能够主动执行任务，而不仅仅是被动响应。通过合理的配置和使用，可以构建出真正智能的自动化系统。

### 关键要点

- ✅ 支持多种动作类型（系统、浏览器、文件、网络、自定义）
- ✅ 完善的权限控制和审批机制
- ✅ 实时事件监听和状态查询
- ✅ 安全性和性能优化
- ✅ 灵活的配置选项

### 相关文档

- [主动服务引擎](PROACTIVE_ENGINE.md)
- [企业微信集成](WECOM_INTEGRATION.md)
- [技能系统](SKILLS_SYSTEM.md)
