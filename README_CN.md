# LocalBot

一款先进的本地AI个人助手，支持多提供商包括国产AI模型，使用TypeScript和Node.js构建。

## 为什么选择LocalBot？

LocalBot是一个强大、模块化的AI助手平台，专为需要本地AI能力和广泛工具集成的开发者和高级用户设计。

### 🎯 目标用户

#### 1. **开发者**
LocalBot为软件开发提供强大的工具：
- **文件操作**: 以编程方式读取、写入、复制、移动和管理文件
- **Shell命令**: 执行系统命令、管理进程和控制系统
- **API操作**: 发起HTTP请求（GET、POST、PUT、DELETE、PATCH）和获取网页内容
- **数据处理**: 解析和处理CSV/JSON文件，执行文本分析和转换
- **代码生成**: 生成代码片段和协助开发任务

#### 2. **数据分析师**
用于数据分析和可视化的综合工具：
- **CSV/JSON处理**: 读取、写入和操作结构化数据文件
- **文本分析**: 分析文本内容、搜索和替换模式
- **数学计算**: 执行复杂的数学运算
- **数据可视化**: 从数据创建图表和可视化

#### 3. **系统管理员**
强大的系统管理能力：
- **系统信息**: 获取详细的系统信息和资源使用情况
- **进程管理**: 列出、监控和终止进程
- **环境变量**: 读取和修改环境变量
- **目录操作**: 导航和管理目录

#### 4. **高级用户**
用于日常任务的高级实用工具：
- **安全工具**: 加密/解密数据、生成哈希
- **压缩**: 压缩和解压文件
- **编码**: Base64编码/解码操作
- **随机生成**: 生成UUID和随机字符串

## 功能特性

### 🚀 核心能力
- **多AI模型路由**: 支持主流AI模型（OpenAI、阿里云通义千问、Anthropic Claude、百度文心一言、腾讯混元、智谱AI、硅基流动、Ollama）
- **本地技能系统**: 基于OpenClaw风格的Markdown技能定义，支持动态加载
- **记忆系统**: 持久化记忆存储和检索，支持上下文感知对话
- **会话管理**: 多会话支持，带对话历史
- **RESTful API**: 标准化API端点，用于外部集成
- **业务流程自动化**: 自动化工作流执行，带任务调度
- **工具执行**: 44+内置工具，涵盖5个类别
- **插件系统**: 可扩展架构，支持添加自定义工具和技能

### 🔧 技能系统

LocalBot拥有强大的OpenClaw风格技能系统：

- **基于Markdown**: 技能通过SKILL.md文件定义，包含元数据
- **动态加载**: 从workspace/skills目录自动加载技能
- **智能匹配**: 基于用户意图自动匹配技能
- **13个内置技能**: 预配置的常用技能
- **可扩展**: 易于添加自定义技能

可用技能：
1. **business-automation** - 业务流程自动化
2. **code-generation** - 代码生成和协助
3. **code-review** - 代码审查和分析
4. **daily-life-assistant** - 日常生活任务和协助
5. **data-analysis** - 数据分析和处理
6. **data-visualization** - 数据可视化和图表
7. **debugging** - 调试和故障排除
8. **file-operations** - 文件系统操作
9. **shell-commands** - Shell命令执行
10. **system-management** - 系统管理和监控
11. **testing** - 测试和质量保证
12. **text-processing** - 文本处理和操作
13. **web-development** - Web开发协助

### 🌐 多平台支持

LocalBot支持多个通讯平台，实现无缝集成：

- **CLI**: 命令行界面，用于本地交互
- **REST API**: 标准化HTTP API，用于外部集成
- **MCP协议**: Model Context Protocol，用于AI助手集成
- **Telegram**: Telegram机器人，用于即时通讯
- **Discord**: Discord机器人，用于社区互动
- **Slack**: Slack机器人，用于团队协作
- **WhatsApp**: WhatsApp机器人，用于个人消息
- **WeCom**: 企业微信机器人，用于企业消息
- **Web**: Web界面，用于浏览器交互
- **移动端**: Android、鸿蒙和iOS系统部署支持

平台特性：
- **统一接口**: 所有平台使用一致的API
- **独立会话**: 每个平台有独立的对话历史
- **平台特定数据**: 保留元数据和上下文
- **简单配置**: 通过环境变量轻松设置
- **可扩展**: 易于添加新平台

详细平台配置请参考[多平台集成指南](docs/MULTI_PLATFORM_GUIDE_CN.md)、[移动端部署指南](docs/MOBILE_DEPLOYMENT_CN.md)、[iOS部署指南](docs/IOS_DEPLOYMENT.md)、[Web端开发指南](docs/WEB_DEVELOPMENT.md)和[企业微信集成指南](docs/WECOM_INTEGRATION.md)。

### 🚀 高级特性

#### 反向控制系统
- **系统控制**: 执行系统命令和脚本
- **浏览器自动化**: 自动化网页浏览和数据提取
- **文件操作**: 读取、写入和管理文件
- **网络请求**: 发起HTTP请求和API调用
- **自定义工具**: 执行自定义技能和工具
- **权限系统**: 细粒度的访问控制
- **审批流程**: 可选的用户审批机制
- **动作日志**: 完整的审计追踪

详细信息请参考[反向控制系统指南](docs/REVERSE_CONTROL.md)。

#### 主动服务引擎
- **定时任务**: 使用cron表达式调度任务
- **Webhook触发器**: 通过HTTP Webhook触发任务
- **监控规则**: 监控GitHub、天气、价格和自定义条件
- **7×24服务**: 全天候监控和告警
- **动作类型**: 消息、工作流、通知和自定义动作
- **事件系统**: 实时事件通知
- **任务管理**: 添加、删除和查询任务

详细信息请参考[主动服务引擎指南](docs/PROACTIVE_ENGINE.md)。

#### 深度思考引擎
- **多角色立场分裂**：创建多个不同立场的角色，产生观点冲突和辩论
- **逻辑递进**：每轮思考都比前一轮更深入，不是简单重复
- **自我否定**：后面的自己推翻前面的自己，实现真正的自我修正
- **5个思考角色**：理性分析者、批判质疑者、创新探索者、实用主义者、人文关怀者
- **角色冲突系统**：自动检测和记录角色间的冲突
- **深度递进**：确保每轮都有最小深度递进
- **智能触发**：自动检测需要深度思考的问题
- **记忆存储**：自动存储思考过程供未来参考

详细信息请参考[深度思考引擎指南](docs/DEEP_THINKING.md)。

### 🛠️ 可用工具

#### 文件系统工具（7个）
- `file_read` - 读取文件内容
- `file_write` - 写入内容到文件
- `file_list` - 列出目录中的文件
- `file_delete` - 删除文件
- `file_copy` - 复制文件
- `file_move` - 移动/重命名文件
- `file_stat` - 获取文件统计信息

#### Shell和系统工具（8个）
- `shell_execute` - 执行Shell命令
- `process_list` - 列出运行中的进程
- `system_info` - 获取系统信息
- `environment_variable` - 获取/设置环境变量
- `environment_list` - 列出所有环境变量
- `directory_change` - 更改当前目录
- `directory_get_current` - 获取当前目录
- `process_kill` - 终止进程

#### API和网络工具（8个）
- `http_get` - HTTP GET请求
- `http_post` - HTTP POST请求
- `http_put` - HTTP PUT请求
- `http_delete` - HTTP DELETE请求
- `http_patch` - HTTP PATCH请求
- `web_fetch` - 获取网页内容
- `json_parse` - 解析JSON字符串
- `json_stringify` - 将对象转换为JSON字符串

#### 数据处理工具（12个）
- `csv_read` - 读取CSV文件
- `csv_write` - 写入CSV文件
- `json_read` - 读取JSON文件
- `json_write` - 写入JSON文件
- `text_analysis` - 分析文本内容
- `text_search` - 搜索文本模式
- `text_replace` - 替换文本模式
- `math_calculate` - 数学计算
- `json_list` - 列出JSON数组元素
- `mean_value` - 计算数值的平均值
- `bar_chart` - 创建柱状图

#### 实用工具（9个）
- `encrypt` - 加密数据
- `decrypt` - 解密数据
- `hash` - 生成哈希值
- `compress` - 压缩数据
- `decompress` - 解压数据
- `base64_encode` - Base64编码
- `base64_decode` - Base64解码
- `uuid_generate` - 生成UUID
- `random_string` - 生成随机字符串

#### 插件工具（1个）
- `self_programming` - 动态生成、编译和加载新工具或插件

### 🧠 记忆系统

- **持久化存储**: 存储重要信息以供将来参考
- **语义搜索**: 通过内容和标签搜索记忆
- **标签系统**: 使用标签组织记忆以便检索
- **重要性级别**: 按重要性优先级排序记忆
- **自动清理**: 自动记忆管理和清理

### 📊 会话管理

- **多会话支持**: 管理多个对话会话
- **对话历史**: 跟踪会话内的对话历史
- **会话持久化**: 保存和恢复会话
- **上下文管理**: 在对话之间维护上下文

### 🔄 业务流程自动化

- **任务调度**: 为特定时间或间隔调度任务
- **工作流引擎**: 执行多步骤的复杂工作流
- **监控系统**: 监控系统资源和活动
- **自动化控制器**: 控制和管理自动化流程

### 🧩 插件系统

- **动态插件加载**: 从 `./plugins` 目录加载插件
- **自编程工具**: AI可以动态生成、编译和加载新工具
- **安全验证**: 内置插件安全验证器，确保插件安全执行
- **可扩展架构**: 易于添加自定义插件和工具

### 🌐 RESTful API

- **消息处理**: `/api/v1/message` - 处理用户消息
- **会话管理**: `/api/v1/session/*` - 管理会话
- **健康检查**: `/health` - 服务健康状态
- **标准化响应**: 一致的API响应格式
- **请求追踪**: 内置请求ID追踪

## 技术栈

- **TypeScript** - 主要开发语言
- **Node.js** - 运行时环境（v20+）
- **OpenAI SDK** - LLM集成（支持多个提供商）
- **Express** - RESTful API服务器
- **Winston** - 日志框架
- **Ollama** - 本地LLM支持
- **Playwright** - 浏览器自动化
- **npm** - 包管理器

## 支持的LLM提供商

| 提供商 | 模型 |
|--------|------|
| **OpenAI** | GPT-4, GPT-3.5-turbo |
| **阿里云（通义千问）** | qwen-plus, qwen-turbo, qwen-max |
| **Anthropic** | Claude-3-opus, Claude-3-sonnet |
| **百度（文心一言）** | ERNIE-Bot系列 |
| **腾讯（混元）** | HunYuan系列 |
| **智谱AI（ChatGLM）** | ChatGLM系列 |
| **硅基流动** | 各种开源模型包括Qwen |
| **Ollama** | 本地模型（llama3.2等） |

## 架构

```
local-bot/
├── src/
│   ├── agent/              # AI代理核心逻辑
│   │   ├── AgentProcessor.ts    # 主AI处理器
│   │   └── MultiAIRouter.ts     # 多AI路由
│   ├── skills/             # 技能和工具系统
│   │   ├── SkillManager.ts      # 工具和技能管理
│   │   ├── SkillsHub.ts         # OpenClaw风格技能
│   │   ├── tools/               # 工具实现
│   │   │   ├── FileTools.ts
│   │   │   ├── ShellTools.ts
│   │   │   ├── ApiTools.ts
│   │   │   ├── DataTools.ts
│   │   │   └── UtilityTools.ts
│   │   └── registerTools.ts     # 工具注册
│   ├── memory/             # 记忆系统
│   │   └── MemorySystem.ts     # 持久化记忆存储
│   ├── session/            # 会话管理
│   │   └── SessionManager.ts    # 会话处理
│   ├── tasks/              # 任务调度和自动化
│   │   ├── AutomationController.ts
│   │   ├── TaskScheduler.ts
│   │   ├── WorkflowEngine.ts
│   │   └── MonitoringSystem.ts
│   ├── business-processes/ # 业务流程模型
│   │   ├── BusinessProcessManager.ts
│   │   ├── SalesProcessModel.ts
│   │   ├── FinanceProcessModel.ts
│   │   ├── HRProcessModel.ts
│   │   ├── OperationsProcessModel.ts
│   │   ├── HomeAutomationModel.ts
│   │   ├── TaxPlanningModel.ts
│   │   ├── ProjectManagementModel.ts
│   │   ├── CRMModel.ts
│   │   ├── MarketingModel.ts
│   │   ├── LegalComplianceModel.ts
│   │   ├── DataAnalyticsReportModel.ts
│   │   └── PersonalAssistantModel.ts
│   ├── api/               # API层
│   │   ├── ApiService.ts
│   │   └── ApiResponse.ts
│   ├── plugins/           # 插件系统
│   │   ├── PluginManager.ts
│   │   ├── PluginSecurityValidator.ts
│   │   ├── PluginTypes.ts
│   │   └── SelfProgrammingTool.ts
│   ├── services/          # 外部服务
│   │   └── OllamaService.ts
│   ├── utils/             # 实用工具函数
│   │   ├── Logger.ts
│   │   └── RetryHandler.ts
│   ├── gateway/           # API网关
│   │   └── Gateway.ts
│   ├── interface/          # CLI接口
│   │   └── CLIInterface.ts
│   └── index.ts           # 入口点
├── workspace/
│   └── skills/            # 技能定义（Markdown）
│       ├── business-automation/
│       ├── code-generation/
│       ├── data-analysis/
│       ├── data-visualization/
│       └── ...
├── plugins/              # 插件目录
│   ├── examples/
│   │   ├── hello-world-plugin/
│   │   └── weather-plugin/
│   └── ...
├── memory/                # 记忆存储（自动创建）
├── sessions/              # 会话数据（自动创建）
└── logs/                  # 日志文件（自动创建）
```

## 安装

### 全局安装（CLI）

您可以将LocalBot全局安装为CLI工具：

```bash
npm install -g .
```

安装后，您可以在任何地方使用 `localbot` 命令：

```bash
localbot
```

### 本地安装

1. 克隆仓库：
```bash
git clone <repository-url>
cd local-bot
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
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
```

### 使用阿里云通义千问
```env
LLM_PROVIDER=aliyun
ALIYUN_API_KEY=your_aliyun_api_key_here
ALIYUN_MODEL=qwen-plus
```

### 使用Ollama（本地）
```env
LLM_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL_NAME=llama3.2
```

## 使用

### 启动助手

#### CLI模式
```bash
npm start
```

在CLI模式下，您可以使用以下命令：

- `help` - 显示帮助信息
- `tools` - 列出所有可用工具
- `skills` - 列出所有可用技能
- `memory` - 显示最近的记忆
- `clear` - 清除会话历史
- `ai <provider>` - 切换AI提供商
- `stats` - 显示AI使用统计
- `process` - 列出所有可用的业务流程
- `run <process-name>` - 执行指定的业务流程
- `exit` - 退出助手

#### 服务器模式
```bash
npm run start:server
```

#### MCP模式（Model Context Protocol）

LocalBot支持MCP协议，可以作为MCP服务器与支持MCP的客户端（如Claude Desktop、Cursor等）集成：

```bash
npm run start:mcp
```

或者直接使用CLI：

```bash
localbot --mcp
```

**MCP配置示例**：

在Claude Desktop的配置文件中添加：

```json
{
  "mcpServers": {
    "localbot": {
      "command": "node",
      "args": ["<path-to-localbot>\\dist\\index.js"],
      "env": {
        "RUN_MODE": "mcp"
      }
    }
  }
}
```

**注意**：
- 将 `<path-to-localbot>` 替换为您的LocalBot项目实际路径
- Windows路径使用双反斜杠 `\\`
- macOS/Linux路径使用正斜杠 `/`

例如：
- Windows: `E:\\work\\202601211205\\local-bot\\dist\\index.js`
- macOS/Linux: `/Users/username/local-bot/dist/index.js`
- **提示模板**: 预定义的提示模板用于常见任务

### 开发模式
```bash
npm run dev
```

### 构建项目
```bash
npm run build
```

## API使用

### 发送消息
```bash
curl -X POST http://localhost:3000/api/v1/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "你好，你能帮我做什么？",
    "sessionId": "session-123"
  }'
```

### 健康检查
```bash
curl http://localhost:3000/health
```

### 列出会话
```bash
curl http://localhost:3000/api/v1/sessions
```

## 配置

### 环境变量

| 变量 | 描述 | 默认值 |
|------|------|--------|
| `LLM_PROVIDER` | LLM提供商（openai, aliyun, anthropic, baidu, tencent, zhipu, siliconcloud, ollama） | openai |
| `OPENAI_API_KEY` | OpenAI API密钥 | - |
| `ALIYUN_API_KEY` | 阿里云API密钥 | - |
| `ALIYUN_MODEL` | 阿里云模型 | qwen-plus |
| `OLLAMA_API_URL` | Ollama API URL | http://localhost:11434 |
| `OLLAMA_MODEL_NAME` | Ollama模型名称 | llama3.2 |
| `PORT` | 服务器端口 | 3000 |
| `LOG_LEVEL` | 日志级别（error, warn, info, debug） | info |
| `MEMORY_DIR` | 记忆存储目录 | ./memory |
| `SKILLS_DIR` | 技能目录 | ./workspace/skills |
| `ENABLE_PERSISTENCE` | 启用会话持久化 | true |
| `PERSISTENCE_DIR` | 持久化目录 | ./sessions |

## 技能系统

### 创建自定义技能

1. 在 `workspace/skills/` 中创建新目录：
```bash
mkdir workspace/skills/my-skill
```

2. 创建 `SKILL.md` 文件：
```markdown
---
name: my-skill
description: 我的自定义技能
emoji: 🎯
category: custom
version: 1.0.0
---

# 我的自定义技能

## 何时使用
- 描述何时使用此技能

## 如何使用
1. 步骤1
2. 步骤2
3. 步骤3

## 示例
用户请求："示例请求"
你的响应："示例响应"
```

3. 重启助手以加载新技能

### 技能元数据

- `name`: 唯一技能标识符
- `description`: 技能描述
- `emoji`: 技能表情符号（可选）
- `category`: 技能类别（可选）
- `version`: 技能版本（可选）
- `author`: 技能作者（可选）
- `requires`: 需要的二进制文件和环境变量（可选）

## 工具开发

### 创建自定义工具

1. 实现 `Tool` 接口：
```typescript
import { Tool, ToolResult } from '../types';

export class MyTool implements Tool {
  name = 'my_tool';
  description = '我的工具描述';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      // 工具逻辑
      return {
        success: true,
        data: { result: 'success' }
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}
```

2. 在 `registerTools.ts` 中注册工具：
```typescript
import { MyTool } from './tools/MyTools';

export function registerDefaultTools(skillManager: SkillManager): void {
  const myTools = [new MyTool()];
  myTools.forEach(tool => skillManager.registerTool(tool));

  const mySkill: Skill = {
    name: 'my-skill',
    description: '我的自定义技能',
    tools: myTools,
    enabled: true,
    permissions: myTools.map(tool => ({
      toolName: tool.name,
      allowed: true,
      requireConfirmation: false
    }))
  };

  skillManager.registerSkill(mySkill);
}
```

## 插件开发

### 创建自定义插件

插件系统允许您扩展LocalBot的功能，添加自定义工具和功能。

#### 1. 创建插件目录

在 `plugins/` 目录中创建您的插件：
```bash
mkdir plugins/my-plugin
cd plugins/my-plugin
```

#### 2. 创建插件配置文件

创建 `plugin.json`：
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "我的自定义插件",
  "author": "Your Name",
  "main": "index.ts",
  "permissions": ["file_read", "file_write"],
  "dependencies": []
}
```

#### 3. 实现插件

创建 `index.ts`：
```typescript
import { Plugin, Tool } from '../../src/plugins/PluginTypes';

export class MyTool implements Tool {
  name = 'my_custom_tool';
  description = '我的自定义工具';
  category = 'custom' as const;

  async execute(params: Record<string, unknown>): Promise<any> {
    try {
      // 工具逻辑
      return {
        success: true,
        data: { result: '执行成功' }
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
}

export const plugin: Plugin = {
  name: 'my-plugin',
  version: '1.0.0',
  description: '我的自定义插件',
  author: 'Your Name',
  tools: [new MyTool()],
  onLoad: async () => {
    console.log('插件加载成功');
  },
  onUnload: async () => {
    console.log('插件卸载');
  }
};
```

#### 4. 使用自编程工具

AI可以使用 `self_programming` 工具动态生成新工具：

```
用户：帮我创建一个计算斐波那契数列的工具

AI将使用self_programming工具：
1. 生成工具代码
2. 编译代码
3. 加载新工具到系统
4. 返回工具使用说明
```

### 插件安全

插件系统包含安全验证机制：
- 代码沙箱执行
- 权限检查
- API调用限制
- 资源使用监控

## 业务流程系统

### 可用业务域

LocalBot提供11个业务域，包含44个预定义业务流程：

#### 1. 💰 销售（Sales）
- 客户开发流程
- 机会管理流程
- 销售绩效分析流程

#### 2. 💳 财务（Finance）
- 预算管理流程
- 费用报销流程
- 财务报告流程
- 税务处理流程

#### 3. ⚙️ 运营（Operations）
- 库存管理流程
- 供应链优化流程
- 质量控制流程

#### 4. 👥 人力资源（HR）
- 招聘流程
- 员工入职流程
- 绩效评估流程
- 培训管理流程

#### 5. 🏠 家庭自动化（Home Automation）
- 智能照明控制
- 温度调节流程
- 安全监控流程

#### 6. 📊 税务规划（Tax Planning）
- 税务筹划流程
- 扣除优化流程
- 合规检查流程

#### 7. 📋 项目管理（Project Management）
- 项目规划流程
- 任务分配流程
- 进度跟踪流程

#### 8. 🤝 CRM（客户关系管理）
- 客户获取流程
- 客户保留流程
- 客户支持流程

#### 9. 📢 营销（Marketing）
- 活动策划流程
- 内容营销流程
- 社交媒体管理流程

#### 10. ⚖️ 法律合规（Legal Compliance）
- 合规检查流程
- 文档管理流程
- 审计准备流程

#### 11. 📈 数据分析（Data Analytics）
- 数据收集流程
- 分析报告流程
- 可视化展示流程

#### 12. 🤖 个人助手（Personal Assistant）
- 日程管理流程
- 任务提醒流程
- 信息汇总流程

### 使用业务流程

#### 列出所有可用流程
```
process
```

#### 执行特定流程
```
run <process-name>
```

例如：
```
run budget-management-process
run recruitment-process
run project-planning-process
```

### 创建自定义业务流程

您可以在 `src/business-processes/` 目录中创建自定义业务流程模型：

```typescript
import { WorkflowDefinition, BusinessDomain } from './BusinessProcessManager';

export const myCustomProcess: WorkflowDefinition = {
  name: 'my-custom-process',
  description: '我的自定义业务流程',
  domain: BusinessDomain.OPERATIONS,
  steps: [
    {
      id: 'step1',
      name: '第一步',
      description: '执行第一步',
      tool: 'tool_name',
      parameters: { /* 参数 */ }
    },
    {
      id: 'step2',
      name: '第二步',
      description: '执行第二步',
      tool: 'tool_name',
      parameters: { /* 参数 */ }
    }
  ]
};
```

## 部署

### Docker

使用Docker构建和运行：
```bash
docker build -t localbot .
docker run -p 3000:3000 localbot
```

### Docker Compose

```bash
docker-compose up -d
```

### Kubernetes

```bash
kubectl apply -f k8s-deployment.yaml
```

## 文档

详细文档请参阅：
- [API文档](./docs/API_DOCUMENTATION_CN.md)
- [API规范](./docs/API_SPECIFICATION.md)
- [架构概览](./docs/ARCHITECTURE_OVERVIEW.md)
- [技能系统](./docs/SKILLS_SYSTEM.md)
- [自动化能力](./docs/AUTOMATION_CAPABILITIES.md)
- [业务流程](./docs/BUSINESS_PROCESSES.md)
- [自定义技能和模型指南](./docs/CUSTOM_SKILLS_AND_MODELS_GUIDE_CN.md)
- [GPU设置](./docs/GPU_SETUP.md)
- [Ollama配置与故障排除](./docs/TROUBLESHOOTING_OLLAMA.md)
- [插件开发指南](./docs/PLUGIN_DEVELOPMENT.md)

## 故障排除

### 常见问题

1. **AI返回空响应**
   - 检查LLM提供商配置
   - 验证API密钥是否有效
   - 检查网络连接
   - 查看 `logs/combined.log` 中的日志

2. **工具未执行**
   - 验证工具已在 `registerTools.ts` 中注册
   - 检查工具权限
   - 查看错误日志

3. **技能未加载**
   - 确保SKILL.md文件格式正确
   - 检查技能目录路径
   - 验证元数据是否正确

## 贡献

欢迎贡献！请随时提交拉取请求。

## 许可证

MIT
