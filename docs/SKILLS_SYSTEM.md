# OpenClaw-style Skills System

## 概述

LocalBot现在支持OpenClaw风格的Skills系统,允许通过Markdown文件(SKILL.md)定义AI技能,实现动态加载和按需使用。

## 核心特性

### 1. 基于Markdown的技能定义
- 每个技能是一个SKILL.md文件
- 包含YAML元数据和Markdown操作指南
- 易于编写和维护

### 2. 动态加载
- 技能按需加载,不占用上下文
- 支持热重载
- 自动发现workspace/skills目录下的技能

### 3. 智能匹配
- 基于用户查询自动匹配相关技能
- 考虑技能描述、使用场景等因素
- 提供匹配度评分

### 4. 灵活管理
- 启用/禁用技能
- 技能分类管理
- 统计信息查看

## 目录结构

```
workspace/
└── skills/
    ├── data-analysis/
    │   └── SKILL.md
    ├── web-development/
    │   └── SKILL.md
    ├── business-automation/
    │   └── SKILL.md
    └── daily-life-assistant/
        └── SKILL.md
```

## SKILL.md格式

### 基本结构

```markdown
---
name: skill-name
description: 技能描述
emoji: 🎯
category: category-name
version: 1.0.0
author: Author Name
requires:
  bins: []
  env: []
---

# 技能名称

## 何时使用
- 使用场景1
- 使用场景2

## 何时不使用
- 不使用场景1
- 不使用场景2

## 输出格式
- 输出格式说明

## 使用流程
1. 步骤1
2. 步骤2

## 示例场景
### 场景1
描述和执行步骤

## 工具依赖
- tool1: 工具说明
- tool2: 工具说明

## 注意事项
- 注意事项1
- 注意事项2
```

### 元数据字段

| 字段 | 必需 | 说明 |
|------|------|------|
| name | ✓ | 技能名称(唯一标识) |
| description | ✓ | 技能描述(用于匹配) |
| emoji | ✗ | 技能图标 |
| category | ✗ | 技能分类 |
| version | ✗ | 版本号 |
| author | ✗ | 作者 |
| requires.bins | ✗ | 依赖的可执行文件 |
| requires.env | ✗ | 依赖的环境变量 |

## 使用方法

### 1. 创建技能

在`workspace/skills`目录下创建新文件夹和SKILL.md文件:

```bash
mkdir -p workspace/skills/my-skill
cat > workspace/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: 我的自定义技能
category: custom
---

# 我的技能

## 何时使用
- 需要执行特定任务时

## 使用流程
1. 步骤1
2. 步骤2
EOF
```

### 2. 初始化SkillsHub

```typescript
import { SkillsHub } from './skills/SkillsHub';

const skillsHub = new SkillsHub({
  skillsPath: './workspace/skills',
  autoLoad: true,
  enableDiscovery: false,
});

await skillsHub.initialize();
```

### 3. 匹配技能

```typescript
const matches = skillsHub.matchSkills('帮我分析数据');
matches.forEach(match => {
  console.log(`${match.skill.metadata.name}: ${match.confidence}`);
});
```

### 4. 获取技能内容

```typescript
const skillContent = skillsHub.getSkillContent('data-analysis');
console.log(skillContent);
```

### 5. 构建技能列表提示

```typescript
const skillsList = skillsHub.buildSkillsListPrompt({
  format: 'list',
  maxSkills: 20,
});
```

## 集成到AgentProcessor

SkillsHub可以集成到现有的AgentProcessor中:

```typescript
import { SkillsHub } from './skills/SkillsHub';
import { AgentProcessor } from './agent/AgentProcessor';

const skillsHub = new SkillsHub({
  skillsPath: './workspace/skills',
  autoLoad: true,
});

const agentProcessor = new AgentProcessor(
  skillManager,
  memorySystem,
  skillsHub
);
```

## 内置技能

### 1. data-analysis 📊
数据分析技能 - 用于读取、分析和可视化CSV/JSON数据文件

**使用场景:**
- 分析销售数据
- 生成统计报告
- 数据可视化

### 2. web-development 🌐
Web开发技能 - 用于创建React/Vue组件、生成前端代码

**使用场景:**
- 创建React组件
- 搭建项目结构
- 生成样式文件

### 3. business-automation ⚙️
业务自动化技能 - 用于自动化业务流程、工作流编排

**使用场景:**
- 定时任务调度
- 工作流编排
- 系统监控

### 4. daily-life-assistant 🏠
生活助手技能 - 用于叫车、外卖、订票、天气查询

**使用场景:**
- 叫网约车
- 订外卖
- 查天气
- 管理日程

## 测试

运行测试:

```bash
npx ts-node tests/test-skills-system.ts
```

## API参考

### SkillsHub

#### 构造函数
```typescript
new SkillsHub(config?: SkillsHubConfig)
```

#### 主要方法
- `initialize()`: 初始化并加载所有技能
- `reloadSkills()`: 重新加载所有技能
- `matchSkills(query, context?)`: 匹配技能
- `getBestMatch(query, context?)`: 获取最佳匹配
- `getSkill(name)`: 获取指定技能
- `getSkillContent(name)`: 获取技能内容
- `buildSkillsListPrompt(options?)`: 构建技能列表提示
- `activateSkill(name)`: 启用技能
- `deactivateSkill(name)`: 禁用技能
- `getStats()`: 获取统计信息

## 最佳实践

### 1. 编写清晰的描述
技能描述是匹配的关键,应该:
- 明确说明技能用途
- 包含关键词
- 避免模糊表述

### 2. 定义明确的使用场景
"何时使用"和"何时不使用"部分应该:
- 列出具体场景
- 提供判断标准
- 避免重叠

### 3. 提供详细的执行步骤
使用流程应该:
- 步骤清晰
- 逻辑连贯
- 考虑边界情况

### 4. 包含示例场景
示例场景应该:
- 覆盖主要用例
- 展示完整流程
- 提供实际价值

## 与传统工具系统的区别

| 特性 | 传统工具系统 | Skills系统 |
|------|------------|-----------|
| 定义方式 | TypeScript类 | Markdown文件 |
| 加载方式 | 启动时全部加载 | 按需动态加载 |
| 扩展性 | 需要修改代码 | 添加文件即可 |
| 上下文占用 | 始终占用 | 仅使用时占用 |
| 维护难度 | 较高 | 较低 |
| 学习曲线 | 需要编程 | 只需写Markdown |

## 未来计划

- [ ] 技能市场(ClawHub)集成
- [ ] 技能版本管理
- [ ] 技能依赖管理
- [ ] 技能测试框架
- [ ] 技能性能监控
- [ ] 技能分享和社区

## 贡献

欢迎贡献新的技能!请遵循以下步骤:

1. 在`workspace/skills`下创建新技能目录
2. 编写SKILL.md文件
3. 添加测试用例
4. 提交Pull Request

## 许可证

ISC