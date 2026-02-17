# LocalBot

一款先进的本地AI个人助手，支持多提供商包括国产AI模型，使用TypeScript和Node.js构建。

## 功能特点

- 本地优先架构，保护数据隐私
- 记忆系统（日常和长期存储）
- 工具和技能系统，支持扩展
- 文件系统操作（读取、写入、列出、删除）
- Shell命令执行
- 命令行界面交互
- **多LLM支持**: OpenAI GPT、阿里云通义千问、Anthropic Claude、百度文心一言、腾讯混元、智谱AI、硅基流动
- **智能AI路由**: 根据任务需求和语言自动选择最优AI提供商
- **自动化系统**: 任务调度、工作流引擎、监控系统
- **商业工具套件**: 财务计算、CRM、ERP、商业智能、库存管理、销售分析、项目管理、合规性检查等
- **家庭自动化模型**: 智能家居控制、维护调度、财务管理、健康追踪和活动规划
- **税务规划自动化**: 企业和个人税务规划、优化和自动申报流程
- **综合技能系统**: 超过80+种工具涵盖文件操作、系统监控、数据处理、商业工具、AI工具、安全、网络等多个类别

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
| **百度 (文心一言)** | ERNIE-Bot系列 |
| **腾讯 (混元)** | HunYuan系列 |
| **智谱AI (ChatGLM)** | ChatGLM系列 |
| **硅基流动 (SiliconCloud)** | 各种开源模型包括Qwen |

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

## 可用工具

| 类别 | 工具 | 描述 |
|------|------|------|
| **文件系统** | `file_read` | 读取文件内容 |
| | `file_write` | 写入内容到文件 |
| | `file_list` | 列出目录中的文件 |
| | `file_delete` | 删除文件 |
| **Shell** | `shell_execute` | 执行Shell命令 |
| **记忆系统** | `memory_add` | 添加条目到记忆 |
| | `memory_search` | 搜索记忆条目 |
| **数据库** | `database_connect` | 连接数据库 |
| | `database_query` | 查询数据库 |
| | `database_execute` | 执行数据库命令 |
| | `database_insert` | 向数据库插入数据 |
| | `database_update` | 更新数据库中的数据 |
| | `database_delete` | 从数据库删除数据 |
| **业务工具** | `crm_operations` | 客户关系管理 |
| | `erp_operations` | 企业资源规划 |
| | `financial_calculator` | 财务计算 |
| | `inventory_management` | 库存跟踪和管理 |
| | `sales_analytics` | 销售数据分析和报告 |
| | `compliance_checker` | 合规性检查和风险评估 |
| | `project_management` | 项目跟踪和管理 |
| | `time_tracking` | 员工时间跟踪 |
| | `business_intelligence` | 商业智能和分析 |
| **API和数据处理** | `api_get/post/put/delete` | REST API操作 |
| | `csv_read/write` | CSV文件处理 |
| | `json_read/write` | JSON文件处理 |
| **通知和调度** | `send_notification` | 发送通知 |
| | `schedule_task` | 调度任务 |
| | `cancel_task` | 取消已调度的任务 |
| **系统监控** | `system_info` | 系统信息 |
| | `process_list` | 运行进程 |
| | `resource_monitor` | 资源使用情况监控 |
| **安全** | `encrypt_data` | 数据加密 |
| | `hash_data` | 数据哈希 |
| **文本和数据处理** | `text_analysis` | 文本分析 |
| | `math_calculations` | 数学计算 |
| | `unit_conversion` | 单位转换 |
| **AI和机器学习工具** | `ai_model_tool` | AI模型操作 |
| | `image_generation` | 从文本生成图像 |
| | `embedding_tool` | 文本嵌入操作 |
| **图像处理** | `image_resize` | 调整图像大小 |
| | `image_format_converter` | 图像格式转换 |
| | `image_metadata` | 提取图像元数据 |
| **PDF工具** | `pdf_reader` | 读取PDF文档 |
| | `pdf_writer` | 写入PDF文档 |
| | `pdf_merge` | 合并PDF文件 |
| **日志和配置** | `log_management` | 管理日志文件 |
| | `config_management` | 配置管理 |
| **通信和代码** | `email_operations` | 邮件操作 |
| | `code_analysis` | 代码分析工具 |
| **压缩** | `compress_files` | 压缩文件 |
| | `decompress_files` | 解压文件 |
| | `zip/unzip` | ZIP归档操作 |
| **网络** | `network_operations` | 网络操作 |
| | `dns_lookup` | DNS查询 |
| | `whois_lookup` | WHOIS查询 |
| **日期和时间** | `datetime_operations` | 日期和时间操作 |
| | `timezone_converter` | 时区转换 |
| | `calendar_operations` | 日历操作 |
| **对话** | `conversation_history` | 管理对话历史 |
| | `context_management` | 上下文管理 |
| | `summarize_conversation` | 总结对话 |
| **实用工具** | `workflow_approval` | 工作流审批操作 |
| | `document_generator` | 文档生成 |
| | `validation_check` | 验证和合规性检查 |
| | `notification_send` | 发送通知 |
| | `document_generation` | 高级文档生成 |
| | `hr_system` | 人力资源系统操作 |
| | `analytics_engine` | 分析和策略生成 |
| | `report_generator` | 报告生成 |
| **财务和商业** | `spreadsheet_operations` | 电子表格操作 |
| | `accounting_system` | 会计系统操作 |
| | `payment_gateway` | 支付处理 |
| | `tax_calculator` | 税务计算 |
| | `inventory_management_extended` | 扩展库存管理 |
| **项目和运营** | `time_tracking_extended` | 扩展时间跟踪 |
| | `project_management_extended` | 扩展项目管理 |
| | `quality_management` | 质量管理 |
| | `workflow_system` | 工作流系统操作 |
| **家庭自动化** | `iot_device_control` | 物联网设备控制 |
| | `maintenance_scheduler` | 维护调度 |
| | `finance_tracker` | 个人财务管理 |
| | `health_tracker` | 健康跟踪 |
| | `calendar_scheduler` | 日历调度 |
| **中文AI工具** | `chinese_ai_local` | 本地中文AI模型 |
| **通用实用工具** | `weather_tool` | 天气信息 |
| | `news_aggregator` | 新闻聚合 |
| | `translation_tool` | 文本翻译 |
| | `calculator_tool` | 高级计算器 |
| | `password_generator` | 密码生成 |
| | `map_location` | 地图和位置服务 |
| | `calendar_event` | 日历事件管理 |
| | `reminder_todo` | 提醒和待办事项 |
| | `image_processing` | 图像处理操作 |
| | `audio_processing` | 音频处理操作 |
| **税务工具** | `tax_calculation` | 税务计算和规划 |
| | `tax_software_integration` | 税务软件集成 |
| | `irs_efile_system` | IRS电子申报系统 |

## 业务流程模型

系统包含跨七个领域的综合业务流程模型：

### 销售流程
- **客户开发流程**：从潜在客户到成交客户的端到端流程
- **商机管理流程**：管理销售机会从创建到关闭的全过程
- **销售业绩分析流程**：定期分析销售团队和个人的业绩表现

### 财务流程
- **预算管理流程**：从规划到监控的完整预算工作流程
- **费用报销流程**：员工费用报销的完整工作流程
- **财务报告流程**：定期财务报告的生成和发布流程
- **税务处理流程**：企业税务申报和缴纳的完整流程

### 运营流程
- **供应链管理流程**：从供应商到交付的完整供应链工作流程
- **生产计划流程**：从需求预测到生产执行的完整流程
- **质量管理流程**：完整的质量控制工作流程
- **库存控制流程**：从库存监控到补货的完整流程

### 人力资源流程
- **招聘管理流程**：从职位需求到候选人入职的完整招聘流程
- **员工入职流程**：新员工入职工作流程
- **绩效评估流程**：员工绩效评估工作流程
- **培训发展流程**：员工培训需求识别到效果评估的完整流程

### 家庭自动化流程
- **智能家居控制流程**：自动化控制家庭设备，包括照明、温度和安全
- **家庭维护流程**：家庭系统和电器的定期维护任务
- **家庭财务管理流程**：个人和家庭财务管理，包括预算和储蓄
- **健康与健身流程**：家庭健康监测、健身目标和营养计划
- **家庭活动流程**：家庭活动策划、假期安排和活动协调

### 税务规划流程
- **企业税务规划流程**：全面的企业税务规划和优化建议
- **个人税务规划流程**：个人税务规划和优化策略
- **自动化税务申报流程**：完整的自动化税务申报和缴款工作流程
- **税务合规监控流程**：税务合规状态的持续监控和警报

### 其他业务流程
- **供应链管理流程**：从供应商到交付的完整供应链工作流程
- **生产计划流程**：从需求预测到生产执行的完整流程
- **质量管理流程**：完整的质量控制工作流程
- **库存控制流程**：从库存监控到补货的完整流程

## 架构

```
localAgentNew/
├── src/
│   ├── agent/              # AI代理核心逻辑
│   ├── business-processes/ # 业务流程模型和管理器
│   ├── gateway/            # 会话管理网关
│   ├── interface/          # CLI界面
│   ├── memory/             # 记忆系统
│   ├── session/            # 会话管理
│   ├── skills/             # 工具和技能
│   ├── tasks/              # 任务调度器和工作流引擎
│   └── utils/              # 工具函数
├── memory/                 # 记忆存储（首次运行时创建）
├── sessions/               # 会话数据存储
└── reports/                # 生成的报告（首次运行时创建）
```

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