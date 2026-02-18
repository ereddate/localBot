# LocalBot

一款先进的本地AI个人助手，支持多提供商包括国产AI模型，使用TypeScript和Node.js构建。

## 为什么选择LocalBot？

LocalBot作为综合性AI助手平台，具备独特的优势，旨在服务多样化的用户群体：

### 🌐 **普遍适用性**

#### 1. **一般用户的日常需求**
LocalBot 可以帮助一般用户解决多种日常需求：

##### 家庭自动化
- **智能家居控制**: 通过 `IoTDeviceControlTool` 控制智能设备
- **日程管理**: 使用 `CalendarSchedulerTool` 和 `CalendarEventTool` 管理日程
- **健康追踪**: 通过 `HealthTrackerTool` 跟踪家庭成员健康状况
- **财务跟踪**: 使用 `FinanceTrackerTool` 管理个人和家庭财务
- **提醒和待办事项**: 通过 `ReminderTodoTool` 管理任务清单

##### 实用工具
- **天气查询**: 使用 `WeatherTool` 获取天气信息
- **新闻聚合**: 通过 `NewsAggregatorTool` 获取最新资讯
- **翻译服务**: 使用 `TranslationTool` 进行文本翻译
- **计算器**: 通过 `CalculatorTool` 执行数学计算
- **密码生成**: 使用 `PasswordGeneratorTool` 生成安全密码
- **地图定位**: 通过 `MapLocationTool` 和 `AdvancedLocationServiceTool` 获取位置服务

##### 文件和系统操作
- **文件管理**: 读写、列出和删除文件
- **系统监控**: 查看系统信息、进程列表和资源使用情况
- **通知提醒**: 发送通知和安排提醒

#### 2. **开发人员的编程需求**
LocalBot 提供了丰富的工具来协助开发人员：

##### 代码开发工具
- **代码分析**: 使用 `CodeAnalysisTool` 分析代码质量和结构
- **Shell命令**: 通过 `ShellTool` 执行系统命令
- **数据库操作**: 连接和操作数据库（`DatabaseConnectTool`, `DatabaseExecuteTool`等）
- **API操作**: 执行HTTP请求（`ApiGetTool`, `ApiPostTool`, `ApiPutTool`, `ApiDeleteTool`）
- **文件操作**: 读写代码文件和其他开发相关文件

##### 数据处理工具
- **数据格式处理**: CSV和JSON文件读写（`CsvReadTool`, `JsonWriteTool`等）
- **文本处理**: 文本分析、搜索和转换（`TextAnalysisTool`, `TextSearchTool`, `TextTransformTool`）
- **数据验证**: 使用 `ValidationCheckTool` 进行数据验证

##### 系统工具
- **日志管理**: 使用 `LogManagementTool` 管理系统日志
- **配置管理**: 通过 `ConfigManagementTool` 管理配置文件
- **压缩工具**: ZIP/UNZIP操作（`ZipTool`, `UnzipTool`等）
- **安全工具**: 加密解密功能（`EncryptTool`, `DecryptTool`, `HashTool`）

##### AI辅助开发
- **AI模型操作**: 使用 `AiModelTool` 进行AI模型操作
- **嵌入向量**: 通过 `EmbeddingTool` 生成文本嵌入
- **图像生成**: 使用 `ImageGenerationTool` 生成图像

#### 3. **专业领域的特定需求**
LocalBot 在多个专业领域都有针对性的功能：

##### 财务和税务领域
- **财务计算**: 使用 `FinancialCalculatorTool` 和 `AccountingSystemTool`
- **税务规划**: 通过 `TaxCalculationTool`, `TaxSoftwareIntegrationTool`, `IRSEfileSystemTool` 提供企业和个人税务规划
- **支付网关**: 使用 `PaymentGatewayTool` 处理支付事务

##### 人力资源领域
- **HR系统**: 通过 `HrSystemTool` 管理人力资源
- **招聘管理**: 使用 `DocumentManagementTool` 管理招聘文档

##### 销售和营销领域
- **CRM操作**: 使用 `CrmTool` 管理客户关系
- **销售分析**: 通过 `SalesAnalyticsTool` 进行动态分析
- **营销自动化**: 使用 `BusinessIntelligenceTool` 进行商业智能分析

##### 项目管理
- **项目跟踪**: 使用 `ProjectManagementTool` 和 `ProjectManagementToolExtended`
- **时间跟踪**: 通过 `TimeTrackingTool` 和 `TimeTrackingToolExtended` 跟踪项目时间
- **工作流审批**: 使用 `WorkflowApprovalTool` 进行工作流审批

##### 数据科学和分析
- **数据发现**: 使用 `DataDiscoveryTool` 探索数据源
- **数据集成**: 通过 `DataIntegrationTool` 合并多个数据源
- **ETL处理**: 使用 `ETLTool` 进行数据管道处理
- **数据质量**: 通过 `DataQualityTool` 和 `DataCleaningTool` 确保数据质量
- **机器学习**: 使用 `MachineLearningTool` 进行模型训练
- **数据可视化**: 通过 `VisualizationTool` 和 `DashboardTool` 创建数据可视化

##### 法律合规
- **法律研究**: 使用 `LegalResearchTool` 进行法律研究
- **合规数据库**: 通过 `ComplianceDatabaseTool` 查询合规标准
- **合规检查**: 使用 `ComplianceCheckerTool` 进行合规检查

##### 战略规划
- **战略规划**: 使用 `StrategicPlanningTool` 进行战略规划和SWOT分析

## 功能特点

### 🚀 核心能力
- **多AI模型路由**: 支持国内外主流AI模型（OpenAI、百度文心一言、腾讯混元、智谱AI、硅基流动等）
- **国产AI大模型支持**: 完整集成国内主流AI服务商模型
- **业务流程自动化**: 自动分析用户需求并执行相应业务流程
- **本地技能系统**: 丰富的内置工具和技能
- **离线处理能力**: 支持离线环境下的部分功能执行
- **统一API接口**: 标准化的RESTful API端点用于外部集成

有关我们自动化流程和技能的详细信息，请参阅：
- [自动化流程](./docs/AUTOMATION_PROCESSES_CN.md)
- [技能系统](./docs/SKILLS_SYSTEM.md)
- [API文档](./docs/API_DOCUMENTATION_CN.md)
- [API规范](./docs/API_SPECIFICATION.md)
- [自动化能力](./docs/AUTOMATION_CAPABILITIES.md)
- [业务流程](./docs/BUSINESS_PROCESSES.md)
- [架构概览](./docs/ARCHITECTURE_OVERVIEW.md)
- [自定义技能和模型指南](./docs/CUSTOM_SKILLS_AND_MODELS_GUIDE_CN.md)

### 🏢 企业级功能
- **综合自动化**: 包括业务流程、家庭自动化、税务规划、项目管理、CRM、营销和合规自动化

### 🏠 家庭自动化
- **智能家居控制**: 集成各类智能家居设备
- **家庭财务管理**: 个人和家庭财务规划
- **日程管理**: 智能日程安排和提醒
- **生活助手**: 日常生活相关任务自动化

### 🔧 技能系统
- **综合技能集**: 包含80多种工具，涵盖文件操作、系统监控、数据处理、业务工具、AI工具、安全、网络等多个类别

### 🌐 统一API接口
- **标准化响应**: 统一的API响应格式
- **RESTful API**: 标准化的API端点用于外部集成
- **健康检查**: `/health` 端点监控服务状态
- **消息处理**: `/api/v1/message` 处理用户消息
- **会话管理**: `/api/v1/session/*` 管理会话状态
- **请求追踪**: 内置请求ID追踪系统
- **错误处理**: 统一的错误响应格式

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