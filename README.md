# LocalBot

An advanced local AI personal assistant with multi-provider support including Chinese domestic models, built with TypeScript and Node.js.

## Why Choose LocalBot?

LocalBot stands out as a comprehensive AI assistant platform with unique advantages, designed to serve diverse user groups:

### 🌐 **Universal Applicability**

#### 1. **General Users' Daily Needs**
LocalBot helps general users solve various daily needs:

##### Home Automation
- **Smart Home Control**: Control smart devices through `IoTDeviceControlTool`
- **Schedule Management**: Manage schedules using `CalendarSchedulerTool` and `CalendarEventTool`
- **Health Tracking**: Track family members' health status through `HealthTrackerTool`
- **Financial Tracking**: Manage personal and family finances using `FinanceTrackerTool`
- **Reminders and To-Dos**: Manage task lists through `ReminderTodoTool`

##### Utility Tools
- **Weather Query**: Get weather information using `WeatherTool`
- **News Aggregation**: Get latest updates through `NewsAggregatorTool`
- **Translation Service**: Perform text translation using `TranslationTool`
- **Calculator**: Perform mathematical calculations through `CalculatorTool`
- **Password Generation**: Generate secure passwords using `PasswordGeneratorTool`
- **Map Location**: Get location services through `MapLocationTool` and `AdvancedLocationServiceTool`

##### File and System Operations
- **File Management**: Read, write, list, and delete files
- **System Monitoring**: View system information, process list, and resource usage
- **Notification Reminders**: Send notifications and schedule reminders

#### 2. **Developer Programming Needs**
LocalBot provides rich tools to assist developers:

##### Code Development Tools
- **Code Analysis**: Analyze code quality and structure using `CodeAnalysisTool`
- **Shell Commands**: Execute system commands through `ShellTool`
- **Database Operations**: Connect and operate databases (`DatabaseConnectTool`, `DatabaseExecuteTool`, etc.)
- **API Operations**: Execute HTTP requests (`ApiGetTool`, `ApiPostTool`, `ApiPutTool`, `ApiDeleteTool`)
- **File Operations**: Read and write code files and other development-related files

##### Data Processing Tools
- **Data Format Handling**: CSV and JSON file reading/writing (`CsvReadTool`, `JsonWriteTool`, etc.)
- **Text Processing**: Text analysis, search, and transformation (`TextAnalysisTool`, `TextSearchTool`, `TextTransformTool`)
- **Data Validation**: Perform data validation using `ValidationCheckTool`

##### System Tools
- **Log Management**: Manage system logs using `LogManagementTool`
- **Configuration Management**: Manage configuration files through `ConfigManagementTool`
- **Compression Tools**: ZIP/UNZIP operations (`ZipTool`, `UnzipTool`, etc.)
- **Security Tools**: Encryption and decryption functions (`EncryptTool`, `DecryptTool`, `HashTool`)

##### AI-Assisted Development
- **AI Model Operations**: Perform AI model operations using `AiModelTool`
- **Embedding Vectors**: Generate text embeddings through `EmbeddingTool`
- **Image Generation**: Generate images using `ImageGenerationTool`

#### 3. **Professional Domain-Specific Needs**
LocalBot has targeted functions in multiple professional domains:

##### Finance and Tax Domain
- **Financial Calculation**: Use `FinancialCalculatorTool` and `AccountingSystemTool`
- **Tax Planning**: Provide corporate and personal tax planning through `TaxCalculationTool`, `TaxSoftwareIntegrationTool`, `IRSEfileSystemTool`
- **Payment Gateway**: Handle payment transactions using `PaymentGatewayTool`

##### Human Resources Domain
- **HR System**: Manage human resources through `HrSystemTool`
- **Recruitment Management**: Manage recruitment documents using `DocumentManagementTool`

##### Sales and Marketing Domain
- **CRM Operations**: Manage customer relationships using `CrmTool`
- **Sales Analysis**: Perform dynamic analysis through `SalesAnalyticsTool`
- **Marketing Automation**: Perform business intelligence analysis using `BusinessIntelligenceTool`

##### Project Management
- **Project Tracking**: Use `ProjectManagementTool` and `ProjectManagementToolExtended`
- **Time Tracking**: Track project time through `TimeTrackingTool` and `TimeTrackingToolExtended`
- **Workflow Approval**: Perform workflow approval using `WorkflowApprovalTool`

##### Data Science and Analysis
- **Data Discovery**: Explore data sources using `DataDiscoveryTool`
- **Data Integration**: Merge multiple data sources through `DataIntegrationTool`
- **ETL Processing**: Perform data pipeline processing using `ETLTool`
- **Data Quality**: Ensure data quality through `DataQualityTool` and `DataCleaningTool`
- **Machine Learning**: Perform model training using `MachineLearningTool`
- **Data Visualization**: Create data visualizations through `VisualizationTool` and `DashboardTool`

##### Legal Compliance
- **Legal Research**: Perform legal research using `LegalResearchTool`
- **Compliance Database**: Query compliance standards through `ComplianceDatabaseTool`
- **Compliance Checks**: Perform compliance checks using `ComplianceCheckerTool`

##### Strategic Planning
- **Strategic Planning**: Perform strategic planning and SWOT analysis using `StrategicPlanningTool`

## Features

- Local-first architecture with data privacy
- Memory system with daily and long-term storage
- Extensible tool and skill system
- File system operations (read, write, list, delete)
- Shell command execution
- CLI interface for interaction
- **Multi-LLM support**: OpenAI GPT, Aliyun 通义千问, Anthropic Claude, Baidu 文心一言, Tencent 混元, Zhipu 智谱AI, SiliconCloud
- **Intelligent AI Routing**: Automatic selection of optimal AI provider based on task requirements and language
- **Comprehensive Automation**: Business processes, home automation, tax planning, project management, CRM, marketing, and compliance automation
- **Unified API Interface**: Standardized RESTful API endpoints for external integrations

For detailed information about our automation processes and skills, see:
- [Automation Processes](./docs/AUTOMATION_PROCESSES.md)
- [Skills System](./docs/SKILLS_SYSTEM.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [API Specification](./docs/API_SPECIFICATION.md)
- [Automation Capabilities](./docs/AUTOMATION_CAPABILITIES.md)
- [Business Processes](./docs/BUSINESS_PROCESSES.md)
- [Architecture Overview](./docs/ARCHITECTURE_OVERVIEW.md)
- [Custom Skills and Models Guide](./docs/CUSTOM_SKILLS_AND_MODELS_GUIDE.md)

## Technology Stack

- **TypeScript** - Main development language
- **Node.js** - Runtime environment (v20+)
- **OpenAI SDK** - LLM integration (supports multiple providers)
- **Express.js** - Web framework for API endpoints
- **pnpm** - Package manager (recommended)

## Supported LLM Providers

| Provider | Models |
|----------|--------|
| **OpenAI** | GPT-4, GPT-3.5-turbo |
| **Aliyun (通义千问)** | qwen-plus, qwen-turbo, qwen-max |
| **Anthropic** | Claude-3-opus, Claude-3-sonnet |
| **Baidu (文心一言)** | ERNIE-Bot series |
| **Tencent (混元)** | HunYuan series |
| **Zhipu (智谱AI)** | ChatGLM series |
| **SiliconCloud** | Various open-source models including Qwen |

## Architecture Overview

The system includes multiple components for comprehensive automation:

- **AgentProcessor**: Main AI request processing component
- **MultiAIRouter**: Intelligent routing system for optimal AI provider selection
- **SkillManager**: Centralized management of all available tools and skills
- **BusinessProcessManager**: Orchestration of complex business processes
- **WorkflowEngine**: Execution engine for multi-step automation workflows
- **TaskScheduler**: Scheduling and execution of time-based tasks

For detailed architecture information, see [Architecture Overview](./docs/ARCHITECTURE_OVERVIEW.md).
- Interest Calculations: Simple and compound interest
- Future Value Calculations

### CRM and ERP Tools
- Customer Relationship Management: Create/update customers, record interactions, opportunity management
- Enterprise Resource Planning: Inventory management, order management, supplier management, financial management, human resources management

### Business Intelligence and Analytics
- Business report generation
- Data analysis and insights
- Dashboard creation
- Sales forecasting

### Inventory and Sales Management
- Inventory tracking and management
- Sales data analysis and reporting
- Trend identification and performance prediction

### Project and Time Management
- Project tracking and management
- Task assignment and progress tracking
- Employee time tracking
- Productivity analysis

### Compliance Tools
- Compliance checking
- Risk assessment
- Regulatory monitoring

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd localAgentNew
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and configure your LLM provider:

### Using OpenAI
```
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Using Aliyun 通义千问
```
LLM_PROVIDER=aliyun
ALIYUN_API_KEY=sk-your-aliyun-api-key-here
ALIYUN_MODEL=qwen-plus
```

### Using Anthropic Claude
```
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-your-anthropic-api-key-here
```

**获取 API Key:**
- OpenAI: https://platform.openai.com/api-keys
- Aliyun: https://dashscope.console.aliyun.com/apiKey
- Anthropic: https://console.anthropic.com/

## Usage

### Development Mode

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Start

```bash
npm start
```

## CLI Commands

Once the assistant is running, you can use these commands:

- `help` - Show available commands
- `tools` - List available tools
- `skills` - List available skills
- `exit` - Exit the assistant

## Available Tools

| Category | Tool | Description |
|----------|------|-------------|
| **File System** | `file_read` | Read the contents of a file |
| | `file_write` | Write content to a file |
| | `file_list` | List files in a directory |
| | `file_delete` | Delete a file |
| **Shell** | `shell_execute` | Execute a shell command |
| **Memory** | `memory_add` | Add an entry to memory |
| | `memory_search` | Search memory entries |
| **Database** | `database_connect` | Connect to database |
| | `database_query` | Query database |
| | `database_execute` | Execute database commands |
| | `database_insert` | Insert data into database |
| | `database_update` | Update data in database |
| | `database_delete` | Delete data from database |
| **Business** | `crm_operations` | Customer relationship management |
| | `erp_operations` | Enterprise resource planning |
| | `financial_calculator` | Financial calculations |
| | `inventory_management` | Inventory tracking and management |
| | `sales_analytics` | Sales data analysis and reporting |
| | `compliance_checker` | Compliance checking and risk assessment |
| | `project_management` | Project tracking and management |
| | `time_tracking` | Employee time tracking |
| | `business_intelligence` | Business intelligence and analytics |
| **API & Data Processing** | `api_get/post/put/delete` | REST API operations |
| | `csv_read/write` | CSV file processing |
| | `json_read/write` | JSON file processing |
| **Notifications & Scheduling** | `send_notification` | Send notifications |
| | `schedule_task` | Schedule tasks |
| | `cancel_task` | Cancel scheduled tasks |
| **System Monitoring** | `system_info` | System information |
| | `process_list` | Running processes |
| | `resource_monitor` | Resource usage monitoring |
| **Security** | `encrypt_data` | Data encryption |
| | `hash_data` | Data hashing |
| **Text & Data Processing** | `text_analysis` | Text analysis |
| | `math_calculations` | Mathematical calculations |
| | `unit_conversion` | Unit conversions |
| **AI & ML Tools** | `ai_model_tool` | AI model operations |
| | `image_generation` | Generate images from text |
| | `embedding_tool` | Text embedding operations |
| **Image Processing** | `image_resize` | Resize images |
| | `image_format_converter` | Convert image formats |
| | `image_metadata` | Extract image metadata |
| **PDF Tools** | `pdf_reader` | Read PDF documents |
| | `pdf_writer` | Write PDF documents |
| | `pdf_merge` | Merge PDF files |
| **Logging & Configuration** | `log_management` | Manage log files |
| | `config_management` | Configuration management |
| **Communication & Code** | `email_operations` | Email operations |
| | `code_analysis` | Code analysis tools |
| **Compression** | `compress_files` | Compress files |
| | `decompress_files` | Decompress files |
| | `zip/unzip` | ZIP archive operations |
| **Networking** | `network_operations` | Network operations |
| | `dns_lookup` | DNS lookup |
| | `whois_lookup` | WHOIS lookup |
| **Date & Time** | `datetime_operations` | Date and time operations |
| | `timezone_converter` | Timezone conversion |
| | `calendar_operations` | Calendar operations |
| **Conversations** | `conversation_history` | Manage conversation history |
| | `context_management` | Context management |
| | `summarize_conversation` | Summarize conversations |
| **Utilities** | `workflow_approval` | Workflow approval operations |
| | `document_generator` | Document generation |
| | `validation_check` | Validation and compliance checking |
| | `notification_send` | Send notifications |
| | `document_generation` | Advanced document generation |
| | `hr_system` | Human resources system operations |
| | `analytics_engine` | Analytics and strategy generation |
| | `report_generator` | Report generation |
| **Financial & Business** | `spreadsheet_operations` | Spreadsheet operations |
| | `accounting_system` | Accounting system operations |
| | `payment_gateway` | Payment processing |
| | `tax_calculator` | Tax calculations |
| | `inventory_management_extended` | Extended inventory management |
| **Project & Operations** | `time_tracking_extended` | Extended time tracking |
| | `project_management_extended` | Extended project management |
| | `quality_management` | Quality management |
| | `workflow_system` | Workflow system operations |
| **Home Automation** | `iot_device_control` | IoT device control |
| | `maintenance_scheduler` | Maintenance scheduling |
| | `finance_tracker` | Personal finance tracking |
| | `health_tracker` | Health tracking |
| | `calendar_scheduler` | Calendar scheduling |
| **Chinese AI Tools** | `chinese_ai_local` | Local Chinese AI models |
| **General Utilities** | `weather_tool` | Weather information |
| | `news_aggregator` | News aggregation |
| | `translation_tool` | Text translation |
| | `calculator_tool` | Advanced calculator |
| | `password_generator` | Password generation |
| | `map_location` | Map and location services |
| | `calendar_event` | Calendar event management |
| | `reminder_todo` | Reminders and to-do lists |
| | `image_processing` | Image processing operations |
| | `audio_processing` | Audio processing operations |
| **Tax Tools** | `tax_calculation` | Tax calculation and planning |
| | `tax_software_integration` | Tax software integration |
| | `irs_efile_system` | IRS electronic filing system |

## Business Process Models

The system includes comprehensive business process models across seven domains:

### Sales Processes
- **Lead Generation Process**: End-to-end process from prospect to customer
- **Opportunity Management Process**: Managing sales opportunities from creation to closure
- **Sales Performance Analysis Process**: Regular analysis of sales team and individual performance

### Finance Processes  
- **Budget Management Process**: Complete budgeting workflow from planning to monitoring
- **Expense Reimbursement Process**: Complete employee expense reimbursement workflow
- **Financial Reporting Process**: Regular financial report generation and distribution
- **Tax Processing Process**: Corporate tax filing and payment workflow

### Operations Processes
- **Supply Chain Management Process**: Complete supply chain workflow from vendor to delivery
- **Production Planning Process**: From demand forecasting to production execution
- **Quality Management Process**: Complete quality control workflow
- **Inventory Control Process**: Complete inventory monitoring and replenishment workflow

### Human Resources Processes
- **Recruitment Management Process**: Complete hiring workflow from job requisition to candidate onboarding
- **Employee Onboarding Process**: New employee onboarding workflow
- **Performance Evaluation Process**: Employee performance evaluation workflow
- **Training & Development Process**: Employee training needs identification to effectiveness evaluation

### Home Automation Processes
- **Smart Home Control Process**: Automated control of home devices including lighting, temperature, and security
- **Home Maintenance Process**: Scheduled maintenance tasks for home systems and appliances
- **Home Finance Process**: Personal and family financial management including budgeting and savings
- **Health & Fitness Process**: Family health monitoring, fitness goals, and nutrition planning
- **Home Activity Process**: Family event planning, vacation scheduling, and activity coordination

### Tax Planning Processes
- **Corporate Tax Planning Process**: Comprehensive corporate tax planning and optimization recommendations
- **Individual Tax Planning Process**: Personal tax planning and optimization strategies
- **Automated Tax Filing Process**: Complete automated tax filing and payment workflow
- **Tax Compliance Monitoring Process**: Continuous monitoring of tax compliance status and alerts

### Additional Business Processes
- **Supply Chain Management Process**: Complete supply chain workflow from vendor to delivery
- **Production Planning Process**: From demand forecasting to production execution
- **Quality Management Process**: Complete quality control workflow
- **Inventory Control Process**: Complete inventory monitoring and replenishment workflow

## Architecture

```
localAgentNew/
├── src/
│   ├── agent/              # AI agent core logic
│   ├── business-processes/ # Business process models and manager
│   ├── gateway/            # Session management gateway
│   ├── interface/          # CLI interface
│   ├── memory/             # Memory system
│   ├── session/            # Session management
│   ├── skills/             # Tools and skills
│   ├── tasks/              # Task scheduler and workflow engine
│   └── utils/              # Utility functions
├── memory/                 # Memory storage (created on first run)
├── sessions/               # Session data storage
└── reports/                # Generated reports (created on first run)
```

## Memory System

The assistant has a two-tier memory system:

1. **Daily Memory** - Stored in `memory/YYYY-MM-DD.md` files
2. **Long-term Memory** - Stored in `memory/MEMORY.md` for important entries

## Project Structure

```
localAgentNew/
├── src/
│   ├── agent/           # Agent processing logic
│   ├── gateway/         # Gateway for session management
│   ├── interface/       # CLI interface
│   ├── memory/          # Memory system
│   └── skills/          # Tools and skills
├── memory/              # Memory storage (created on first run)
├── dist/                # Compiled JavaScript
└── package.json
```

## Security Considerations

This assistant has access to:
- File system read/write
- Shell command execution

Use with caution and only in trusted environments.

## License

ISC
