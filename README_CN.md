# LocalBot

一个受Clawdbot启发的本地AI个人助手，使用TypeScript和Node.js构建。

## 功能特点

- 本地优先架构，保护数据隐私
- 记忆系统（日常和长期存储）
- 工具和技能系统，支持扩展
- 文件系统操作（读取、写入、列出、删除）
- Shell命令执行
- 命令行界面交互
- **多LLM支持**: OpenAI GPT、阿里云通义千问、Anthropic Claude
- **自动化系统**: 任务调度、工作流引擎、监控系统
- **商业工具套件**: 财务计算、CRM、ERP、商业智能、库存管理、销售分析、项目管理、合规性检查等

## 技术栈

- **TypeScript** - 主要开发语言
- **Node.js** - 运行时环境 (v20+)
- **OpenAI SDK** - LLM集成（支持多个提供商）
- **pnpm** - 包管理器（推荐）

## 支持的LLM提供商

| 提供商 | 模型 |
|--------|------|
| **OpenAI** | GPT-4, GPT-3.5-turbo |
| **阿里云 (通义千问)** | qwen-plus, qwen-turbo, qwen-max |
| **Anthropic** | Claude-3-opus, Claude-3-sonnet |

## 新增商业功能

### 财务工具
- 财务计算器：NPV、ROI、现金流等计算
- 利息计算：简单利息、复利计算
- 未来价值计算

### CRM和ERP工具
- 客户关系管理：创建/更新客户、记录互动、商机管理
- 企业资源规划：库存管理、订单管理、供应商管理、财务管理、人力资源管理

### 商业智能和分析
- 业务报表生成
- 数据分析和洞察
- 仪表板创建
- 销售预测

### 库存和销售管理
- 库存跟踪和管理
- 销售数据分析和报告
- 趋势识别和性能预测

### 项目和时间管理
- 项目跟踪和管理
- 任务分配和进度跟踪
- 员工时间追踪
- 生产力分析

### 合规性工具
- 合规性检查
- 风险评估
- 法规监控

## 安装

1. 克隆仓库：
```bash
git clone <repository-url>
cd localAgentNew
```

2. 安装依赖：
```bash
npm install
```

3. 复制环境变量：
```bash
cp .env.example .env
```

4. 编辑 `.env` 并配置您的LLM提供商：

### 使用OpenAI
```env
OPENAI_API_KEY=your_openai_api_key_here
DEFAULT_LLM_PROVIDER=openai
DEFAULT_OPENAI_MODEL=gpt-4o
```

### 使用阿里云通义千问
```env
ALIYUN_API_KEY=your_aliyun_api_key_here
DEFAULT_LLM_PROVIDER=aliyun
DEFAULT_ALIYUN_MODEL=qwen-plus
```

### 使用Anthropic Claude
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DEFAULT_LLM_PROVIDER=anthropic
DEFAULT_ANTHROPIC_MODEL=claude-3-sonnet
```

## 使用

### 启动助手
```bash
npm start
```

### 开发模式
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

## 架构

- `src/agent/` - AI代理核心逻辑
- `src/memory/` - 记忆系统实现
- `src/skills/` - 工具和技能系统
- `src/tasks/` - 任务调度和工作流
- `src/utils/` - 通用工具函数
- `sessions/` - 会话数据存储
- `memory/` - 记忆数据存储

## 扩展性

系统设计为高度可扩展，您可以轻松添加新的工具和技能：

1. 创建新的工具类实现`Tool`接口
2. 在`SkillManager`中注册新工具
3. 创建相应的技能定义
4. 工具将自动可用

## 贡献

欢迎贡献！请随时提交拉取请求。

## 许可证

MIT