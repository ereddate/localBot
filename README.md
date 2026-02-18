# LocalBot

An advanced local AI personal assistant with multi-provider support including Chinese domestic models, built with TypeScript and Node.js.

## Why Choose LocalBot?

LocalBot stands out as a comprehensive AI assistant platform with unique advantages, designed to serve diverse user groups:

### 🌐 **Universal Applicability**

#### 1. **Daily Needs of General Users**
LocalBot can help general users solve various daily needs:

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

#### 2. **Programming Needs for Developers**
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

#### 3. **Domain-Specific Professional Needs**
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

### 🚀 Core Capabilities
- **Multi-AI Model Routing**: Support for mainstream AI models both domestically and internationally (OpenAI, Baidu ERNIE Bot, Tencent HunYuan, Zhipu AI, SiliconCloud, etc.)
- **Chinese Domestic AI Large Model Support**: Complete integration with major domestic AI service providers
- **Business Process Automation**: Automatically analyze user requirements and execute corresponding business processes
- **Local Skills System**: Rich built-in tools and skills
- **Offline Processing Capability**: Support for partial functionality execution in offline environments
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
- [GPU Acceleration Setup](./docs/GPU_SETUP.md)
- [Ollama Configuration & Troubleshooting](./docs/TROUBLESHOOTING_OLLAMA.md)

For deployment configurations, see:
- [Docker Deployment Guide](./DOCKER_DEPLOYMENT.md)
- [Kubernetes Deployment](./k8s-deployment.yaml)

### 🏢 Enterprise-Level Features
- **Comprehensive Automation**: Including business processes, home automation, tax planning, project management, CRM, marketing, and compliance automation

### 🏠 Home Automation
- **Smart Home Control**: Integration with various smart home devices
- **Home Financial Management**: Personal and family financial planning
- **Schedule Management**: Smart scheduling and reminders
- **Life Assistant**: Daily life-related task automation

### 🔧 Skills System
- **Comprehensive Skill Set**: Includes over 80 tools covering file operations, system monitoring, data processing, business tools, AI tools, security, networking, and more categories

### 🌐 Unified API Interface
- **Standardized Response**: Unified API response format
- **RESTful API**: Standardized API endpoints for external integration
- **Health Check**: `/health` endpoint to monitor service status
- **Message Processing**: `/api/v1/message` to handle user messages
- **Session Management**: `/api/v1/session/*` to manage session states
- **Request Tracing**: Built-in request ID tracing system
- **Error Handling**: Unified error response format

## Technology Stack

- **TypeScript** - Main development language
- **Node.js** - Runtime environment (v20+)
- **OpenAI SDK** - LLM integration (supports multiple providers)
- **pnpm** - Package manager (recommended)

## Supported LLM Providers

| Provider | Models |
|----------|--------|
| **OpenAI** | GPT-4, GPT-3.5-turbo |
| **Alibaba Cloud (Qwen)** | qwen-plus, qwen-turbo, qwen-max |
| **Anthropic** | Claude-3-opus, Claude-3-sonnet |
| **Baidu (ERNIE Bot)** | ERNIE-Bot series |
| **Tencent (HunYuan)** | HunYuan series |
| **Zhipu AI (ChatGLM)** | ChatGLM series |
| **SiliconCloud** | Various open-source models including Qwen |

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
```env
OPENAI_API_KEY=your_openai_api_key_here
DEFAULT_LLM_PROVIDER=openai
DEFAULT_OPENAI_MODEL=gpt-4o
```

### Using Alibaba Cloud Qwen
```env
ALIYUN_API_KEY=your_aliyun_api_key_here
DEFAULT_LLM_PROVIDER=aliyun
DEFAULT_ALIYUN_MODEL=qwen-plus
```

### Using Anthropic Claude
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DEFAULT_LLM_PROVIDER=anthropic
DEFAULT_ANTHROPIC_MODEL=claude-3-sonnet
```

## Usage

### Start the Assistant
```bash
npm start
```

### Development Mode
```bash
npm run dev
```

### Build the Project
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
| **Memory System** | `memory_add` | Add an entry to memory |
| | `memory_search` | Search memory entries |
| **Database** | `database_connect` | Connect to database |
| | `database_query` | Query database |
| | `database_execute` | Execute database commands |
| | `database_insert` | Insert data into database |
| | `database_update` | Update data in database |
| | `database_delete` | Delete data from database |
| **Business Tools** | `crm_operations` | Customer relationship management |
| | `erp_operations` | Enterprise resource planning |
| | `financial_calculator` | Financial calculations |
| | `inventory_management` | Inventory tracking and management |
| | `sales_analytics` | Sales data analysis and reporting |
| | `compliance_checker` | Compliance checking and risk assessment |
| | `project_management` | Project tracking and management |
| | `time_tracking` | Employee time tracking |
| | `business_intelligence` | Business intelligence and analytics |
| **API and Data Processing** | `api_get/post/put/delete` | REST API operations |
| | `csv_read/write` | CSV file processing |
| | `json_read/write` | JSON file processing |
| **Notifications and Scheduling** | `send_notification` | Send notifications |
| | `schedule_task` | Schedule tasks |
| | `cancel_task` | Cancel scheduled tasks |
| **System Monitoring** | `system_info` | System information |
| | `process_list` | Running processes |
| | `resource_monitor` | Resource usage monitoring |
| **Security** | `encrypt_data` | Data encryption |
| | `hash_data` | Data hashing |
| **Text and Data Processing** | `text_analysis` | Text analysis |
| | `math_calculations` | Mathematical calculations |
| | `unit_conversion` | Unit conversions |
| **AI and Machine Learning Tools** | `ai_model_tool` | AI model operations |
| | `image_generation` | Generate images from text |
| | `embedding_tool` | Text embedding operations |
| **Image Processing** | `image_resize` | Resize images |
| | `image_format_converter` | Convert image formats |
| | `image_metadata` | Extract image metadata |
| **PDF Tools** | `pdf_reader` | Read PDF documents |
| | `pdf_writer` | Write PDF documents |
| | `pdf_merge` | Merge PDF files |
| **Logs and Configuration** | `log_management` | Manage log files |
| | `config_management` | Configuration management |
| **Communication and Code** | `email_operations` | Email operations |
| | `code_analysis` | Code analysis tools |
| **Compression** | `compress_files` | Compress files |
| | `decompress_files` | Decompress files |
| | `zip/unzip` | ZIP archive operations |
| **Networking** | `network_operations` | Network operations |
| | `dns_lookup` | DNS lookup |
| | `whois_lookup` | WHOIS lookup |
| **Date and Time** | `datetime_operations` | Date and time operations |
| | `timezone_converter` | Timezone conversion |
| | `calendar_operations` | Calendar operations |
| **Conversation** | `conversation_history` | Manage conversation history |
| | `context_management` | Context management |
| | `summarize_conversation` | Summarize conversation |
| **Utility Tools** | `workflow_approval` | Workflow approval operations |
| | `document_generator` | Document generation |
| | `validation_check` | Validation and compliance checking |
| | `notification_send` | Send notifications |
| | `document_generation` | Advanced document generation |
| | `hr_system` | Human resources system operations |
| | `analytics_engine` | Analysis and strategy generation |
| | `report_generator` | Report generation |
| **Finance and Business** | `spreadsheet_operations` | Spreadsheet operations |
| | `accounting_system` | Accounting system operations |
| | `payment_gateway` | Payment processing |
| | `tax_calculator` | Tax calculation |
| | `inventory_management_extended` | Extended inventory management |
| **Project and Operations** | `time_tracking_extended` | Extended time tracking |
| | `project_management_extended` | Extended project management |
| | `quality_management` | Quality management |
| | `workflow_system` | Workflow system operations |
| **Home Automation** | `iot_device_control` | IoT device control |
| | `maintenance_scheduler` | Maintenance scheduling |
| | `finance_tracker` | Personal financial management |
| | `health_tracker` | Health tracking |
| | `calendar_scheduler` | Calendar scheduling |
| **Chinese AI Tools** | `chinese_ai_local` | Local Chinese AI model |
| **General Utility Tools** | `weather_tool` | Weather information |
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

### Sales Process
- **Customer Development Process**: End-to-end process from potential customers to closed customers
- **Opportunity Management Process**: Complete process managing sales opportunities from creation to closure
- **Sales Performance Analysis Process**: Regular analysis of sales team and individual performance

### Finance Process
- **Budget Management Process**: Complete budget workflow from planning to monitoring
- **Expense Reimbursement Process**: Complete workflow for employee expense reimbursement
- **Financial Reporting Process**: Process for generating and publishing regular financial reports
- **Tax Processing Process**: Complete process for corporate tax filing and payment

### Operations Process
- **Supply Chain Management Process**: Complete supply chain workflow from suppliers to delivery
- **Production Planning Process**: Complete process from demand forecasting to production execution
- **Quality Management Process**: Complete quality control workflow
- **Inventory Control Process**: Complete process from inventory monitoring to restocking

### Human Resources Process
- **Recruitment Management Process**: Complete recruitment process from job requirements to candidate onboarding
- **Employee Onboarding Process**: New employee onboarding workflow
- **Performance Evaluation Process**: Employee performance evaluation workflow
- **Training and Development Process**: Complete process from employee training needs identification to effectiveness evaluation

### Home Automation Process
- **Smart Home Control Process**: Automate control of home devices, including lighting, temperature, and security
- **Home Maintenance Process**: Regular maintenance tasks for home systems and appliances
- **Home Financial Management Process**: Personal and family financial management, including budgeting and saving
- **Health and Fitness Process**: Home health monitoring, fitness goals, and nutrition planning
- **Home Activities Process**: Home activity planning, holiday arrangements, and event coordination

### Tax Planning Process
- **Corporate Tax Planning Process**: Comprehensive corporate tax planning and optimization recommendations
- **Personal Tax Planning Process**: Personal tax planning and optimization strategies
- **Automated Tax Filing Process**: Complete automated tax filing and payment workflow
- **Tax Compliance Monitoring Process**: Continuous monitoring and alerts for tax compliance status

### Other Business Processes
- **Supply Chain Management Process**: Complete supply chain workflow from suppliers to delivery
- **Production Planning Process**: Complete process from demand forecasting to production execution
- **Quality Management Process**: Complete quality control workflow
- **Inventory Control Process**: Complete process from inventory monitoring to restocking

## Architecture

```
localAgentNew/
├── src/
│   ├── agent/              # AI agent core logic
│   ├── business-processes/ # Business process models and managers
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

MIT