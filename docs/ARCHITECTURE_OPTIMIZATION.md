# LocalBot 架构优化指南

本文档详细说明了基于Clawdbot（OpenClaw）架构对LocalBot进行的优化。

## 📋 目录

1. [优化概述](#优化概述)
2. [记忆系统优化](#记忆系统优化)
3. [技能系统优化](#技能系统优化)
4. [MCP协议优化](#mcp协议优化)
5. [待实现功能](#待实现功能)
6. [迁移指南](#迁移指南)

## 优化概述

基于Clawdbot的架构优势，LocalBot进行了以下核心优化：

### ✅ 已完成的优化

1. **分层记忆系统** - 支持日记记忆、长期记忆和向量检索
2. **技能系统增强** - 添加技能加载优先级、热更新和依赖管理
3. **MCP协议增强** - 实现工具缓存、提示、追踪和过滤能力

### 🚧 待实现的优化

1. **可视化界面** - Canvas Host类似的可视化执行流界面
2. **节点执行环境** - 设备端节点执行具体动作

## 记忆系统优化

### 原有实现

LocalBot原有的记忆系统使用单一的JSON文件存储所有记忆，功能较为简单：

```typescript
interface MemoryEntry {
  id: string;
  content: string;
  tags: string[];
  importance: number;
  timestamp: Date;
}
```

### 优化后的实现

参考Clawdbot的分层记忆系统，实现了三层记忆架构：

#### 1. 日记记忆（Diary Memory）

存储格式：`memory/YYYY-MM-DD.md`

```markdown
# Diary - 2026-02-20

## 2026-02-20
Tags: conversation, user

今天用户询问了关于经济问题，我提供了一些建议...
```

**特点**：
- 按日期组织，便于回顾
- 支持标签分类
- 自动持久化到Markdown文件

#### 2. 长期记忆（Long-Term Memory）

存储格式：`memory/MEMORY.md`

```markdown
# Long-Term Memory

### mem_1234567890_abc123
Tags: user-preference, important
Importance: 5
Access Count: 10
Last Accessed: 2026-02-20T15:30:00.000Z

用户偏好使用中文回复...
```

**特点**：
- 重要信息长期保存
- 跟踪访问次数和最后访问时间
- 支持重要性评分

#### 3. 向量检索（Vector Search）

实现了基于关键词的智能检索：

```typescript
async searchAll(query: string, limit: number = 10): Promise<{
  regular: MemoryEntry[];
  diary: DiaryEntry[];
  longTerm: LongTermMemory[];
}>
```

**特点**：
- 同时搜索三层记忆
- 智能评分和排序
- 支持标签匹配

### 使用示例

```typescript
// 初始化增强记忆系统
const memorySystem = new EnhancedMemorySystem(
  './data/memories.json',  // 常规记忆
  './memory',                 // 日记和长期记忆目录
  true,                        // 自动保存
  1000                         // 最大记忆数
);

// 添加日记记忆
await memorySystem.addDiaryEntry(
  '今天用户询问了关于经济问题',
  ['conversation', 'user']
);

// 添加长期记忆
await memorySystem.addLongTermMemory(
  '用户偏好使用中文回复',
  ['user-preference', 'important'],
  5
);

// 搜索所有记忆
const results = await memorySystem.searchAll('经济', 10);
console.log(`找到 ${results.regular.length} 条常规记忆`);
console.log(`找到 ${results.diary.length} 条日记记忆`);
console.log(`找到 ${results.longTerm.length} 条长期记忆`);

// 获取统计信息
const stats = memorySystem.getStats();
console.log(`常规记忆: ${stats.regularMemories}`);
console.log(`日记条目: ${stats.diaryEntries}`);
console.log(`长期记忆: ${stats.longTermMemories}`);
```

## 技能系统优化

### 原有实现

LocalBot原有的技能系统功能较为基础：

```typescript
interface Skill {
  metadata: SkillMetadata;
  content: string;
  path: string;
  enabled: boolean;
}
```

### 优化后的实现

参考Clawdbot的技能系统，实现了以下增强：

#### 1. 技能加载优先级

支持三种技能源，按优先级加载：

```typescript
enum SkillSource {
  workspace = 'workspace',  // 最高优先级 (100)
  managed = 'managed',    // 中等优先级 (50)
  bundled = 'bundled'     // 最低优先级 (0)
}
```

**加载顺序**：
1. Workspace技能（用户自定义）
2. Managed技能（管理的技能）
3. Bundled技能（内置技能）

#### 2. 热更新（Hot Reload）

使用chokidar监听技能文件变化：

```typescript
private async setupHotReload(): Promise<void> {
  this.watcher = chokidar.watch(watchPaths, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true
  });

  this.watcher.on('change', async (filePath) => {
    const skillName = path.basename(path.dirname(filePath));
    await this.reloadSkill(skillName);
  });

  this.watcher.on('add', async (filePath) => {
    // 自动加载新技能
  });

  this.watcher.on('unlink', async (filePath) => {
    // 自动移除删除的技能
  });
}
```

**特点**：
- 自动检测技能文件变化
- 实时重新加载技能
- 支持添加和删除技能

#### 3. 依赖管理

支持技能之间的依赖关系：

```typescript
interface SkillMetadata {
  name: string;
  description: string;
  dependencies?: string[];  // 依赖的其他技能
  priority?: number;          // 技能优先级
}
```

**依赖解析**：
- 自动检测循环依赖
- 按依赖顺序加载技能
- 依赖缺失时给出警告

#### 4. 技能治理（Gating）

支持技能的运行时检查：

```typescript
interface Requires {
  bins?: string[];  // 需要的外部程序
  env?: string[];   // 需要的环境变量
}
```

**检查内容**：
- 外部程序是否可执行
- 环境变量是否已设置
- 依赖技能是否已加载

### 使用示例

```typescript
// 初始化增强技能系统
const skillsHub = new EnhancedSkillsHub({
  skillsPath: './workspace/skills',
  managedSkillsPath: './skills/managed',
  bundledSkillsPath: './skills/bundled',
  autoLoad: true,
  enableDiscovery: false,
  enableHotReload: true,    // 启用热更新
  enableGating: true        // 启用技能治理
});

// 初始化
await skillsHub.initialize();

// 重新加载所有技能
await skillsHub.reloadSkills();

// 重新加载特定技能源
await skillsHub.reloadSkillSource('workspace');

// 获取技能统计
const stats = skillsHub.getStats();
console.log(`总技能数: ${stats.total}`);
console.log(`已启用: ${stats.enabled}`);
console.log(`按来源:`, stats.bySource);
```

## MCP协议优化

### 原有实现

LocalBot原有的MCP协议实现较为基础，仅支持基本的工具注册和调用。

### 优化后的实现

参考Clawdbot的MCP协议，实现了以下增强：

#### 1. 工具缓存（Tool Caching）

```typescript
interface MCPToolCache {
  tool: MCPTool;
  lastAccessed: Date;
  accessCount: number;
  responseTime: number;
  successRate: number;
}
```

**特点**：
- 缓存工具元数据
- 跟踪访问次数
- 记录响应时间
- 计算成功率

#### 2. 工具提示（Tool Hints）

```typescript
interface MCPToolHint {
  toolName: string;
  hint: string;
  priority: number;
  context?: string;
}
```

**特点**：
- 为工具添加使用提示
- 支持优先级排序
- 提供上下文信息

#### 3. 调用追踪（Call Tracking）

```typescript
interface MCPToolCall {
  toolName: string;
  arguments: Record<string, any>;
  timestamp: Date;
  duration: number;
  success: boolean;
  error?: string;
}
```

**特点**：
- 记录每次工具调用
- 跟踪执行时间
- 记录成功/失败状态
- 支持历史查询

#### 4. 工具过滤（Tool Filtering）

```typescript
interface MCPToolFilter {
  category?: string;
  namePattern?: string;
  minSuccessRate?: number;
  maxResponseTime?: number;
  enabledOnly?: boolean;
}
```

**特点**：
- 按类别过滤工具
- 按名称模式过滤
- 按成功率过滤
- 按响应时间过滤
- 只显示已启用的工具

### 使用示例

```typescript
// 初始化增强MCP协议
const mcpProtocol = new EnhancedMCPProtocol({
  maxCacheSize: 100,
  maxHistorySize: 1000,
  cacheEnabled: true,
  trackingEnabled: true,
  filteringEnabled: true
});

// 注册工具
mcpProtocol.registerTool({
  name: 'read_file',
  description: 'Read a file from the file system',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'File path to read'
      }
    },
    required: ['path']
  }
});

// 添加工具提示
mcpProtocol.addToolHint({
  toolName: 'read_file',
  hint: 'Use this tool when user wants to read file contents',
  priority: 10,
  context: 'file-operations'
});

// 调用工具
const result = await mcpProtocol.callTool({
  name: 'read_file',
  arguments: { path: './example.txt' }
});

// 过滤工具
const filteredTools = mcpProtocol.filterTools({
  category: 'file-operations',
  minSuccessRate: 0.8,
  maxResponseTime: 5000
});

// 获取工具统计
const stats = mcpProtocol.getToolStatistics('read_file');
console.log(`访问次数: ${stats.accessCount}`);
console.log(`平均响应时间: ${stats.averageResponseTime}ms`);
console.log(`成功率: ${stats.successRate}`);

// 获取调用历史
const history = mcpProtocol.getCallHistoryByTool('read_file', 10);
console.log(`最近10次调用:`, history);

// 优化缓存
mcpProtocol.optimizeCache();
```

## 待实现功能

### 1. 可视化界面（Canvas Host）

**目标**：创建类似Clawdbot Canvas Host的可视化执行流界面

**功能需求**：
- 可视化设计执行流
- 查看代理状态
- 查看记忆片段
- 拖拽式节点编辑
- 实时执行监控

**技术栈建议**：
- 前端：React + TypeScript
- 流程图：React Flow
- 状态管理：Zustand
- 样式：Tailwind CSS

### 2. 节点执行环境（Nodes）

**目标**：实现设备端节点执行具体动作

**功能需求**：
- system.run：执行系统命令
- camera/screen：访问摄像头和屏幕
- location：获取位置信息
- 文件操作：读写文件
- 网络操作：HTTP请求

**安全考虑**：
- 权限控制
- 沙箱隔离
- 审计日志
- 用户授权

## 迁移指南

### 从原有系统迁移

#### 1. 记忆系统迁移

```typescript
// 原有系统
const oldMemorySystem = new MemorySystem('./data/memories.json');

// 新系统
const newMemorySystem = new EnhancedMemorySystem(
  './data/memories.json',
  './memory',
  true,
  1000
);

// 迁移数据
const oldMemories = await oldMemorySystem.getRecentEntries(1000);
for (const memory of oldMemories) {
  await newMemorySystem.addEntry(
    memory.content,
    memory.tags,
    memory.importance
  );
}
```

#### 2. 技能系统迁移

```typescript
// 原有系统
const oldSkillsHub = new SkillsHub({ skillsPath: './workspace/skills' });

// 新系统
const newSkillsHub = new EnhancedSkillsHub({
  skillsPath: './workspace/skills',
  managedSkillsPath: './skills/managed',
  bundledSkillsPath: './skills/bundled',
  autoLoad: true,
  enableHotReload: true,
  enableGating: true
});

// 技能文件格式兼容，无需迁移
```

#### 3. MCP协议迁移

```typescript
// 原有系统
const oldMCP = new MCPProtocol();

// 新系统
const newMCP = new EnhancedMCPProtocol({
  cacheEnabled: true,
  trackingEnabled: true,
  filteringEnabled: true
});

// 工具注册接口兼容，无需迁移
```

### 配置更新

#### .env文件更新

```env
# 记忆系统配置
MEMORY_DIR=./memory
MEMORY_AUTO_SAVE=true
MEMORY_MAX_ENTRIES=1000

# 技能系统配置
SKILLS_PATH=./workspace/skills
SKILLS_MANAGED_PATH=./skills/managed
SKILLS_BUNDLED_PATH=./skills/bundled
SKILLS_HOT_RELOAD=true
SKILLS_GATING=true

# MCP协议配置
MCP_CACHE_ENABLED=true
MCP_TRACKING_ENABLED=true
MCP_FILTERING_ENABLED=true
MCP_MAX_CACHE_SIZE=100
MCP_MAX_HISTORY_SIZE=1000
```

## 性能优化

### 记忆系统

- **压缩策略**：自动清理旧记忆，保持性能
- **索引优化**：使用Map数据结构，O(1)查找
- **批量操作**：支持批量添加和查询

### 技能系统

- **懒加载**：按需加载技能，减少启动时间
- **缓存机制**：缓存技能元数据，减少文件读取
- **依赖优化**：智能依赖解析，避免循环依赖

### MCP协议

- **缓存策略**：LRU缓存，自动淘汰不常用工具
- **连接池**：复用连接，减少开销
- **异步处理**：非阻塞调用，提高并发性能

## 总结

通过参考Clawdbot的架构优势，LocalBot实现了以下核心改进：

1. ✅ **分层记忆系统** - 更好的记忆组织和检索
2. ✅ **技能系统增强** - 优先级加载、热更新、依赖管理
3. ✅ **MCP协议增强** - 缓存、追踪、过滤能力

这些优化使LocalBot更加：
- **可扩展**：支持更多技能和工具
- **可维护**：清晰的架构和文档
- **可审计**：完整的调用历史和统计
- **可优化**：智能缓存和过滤机制

## 参考资料

- [Clawdbot技术分析报告](http://m.toutiao.com/group/7599905688239768104/)
- [OpenClaw AI框架](http://m.toutiao.com/group/7608752662405775918/)
- [MCP协议规范](https://modelcontextprotocol.io/)
