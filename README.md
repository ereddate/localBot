# LocalBot

A local AI personal assistant inspired by Clawdbot, built with TypeScript and Node.js.

## Features

- Local-first architecture with data privacy
- Memory system with daily and long-term storage
- Tool and skill system for extensibility
- File system operations (read, write, list, delete)
- Shell command execution
- CLI interface for interaction
- **Multi-LLM support**: OpenAI GPT, Aliyun 通义千问, Anthropic Claude
- **Automation System**: Task scheduling, workflow engine, monitoring system
- **Business Tool Suite**: Financial calculators, CRM, ERP, Business Intelligence, Inventory Management, Sales Analytics, Project Management, Compliance Checking, etc.

## Technology Stack

- **TypeScript** - Main development language
- **Node.js** - Runtime environment (v20+)
- **OpenAI SDK** - LLM integration (supports multiple providers)
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

## New Business Capabilities

### Financial Tools
- Financial Calculator: NPV, ROI, cash flow calculations
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

## Business Process Models

The system includes comprehensive business process models across five domains:

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
