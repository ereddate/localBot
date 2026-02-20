# LocalBot

An advanced local AI personal assistant with multi-provider support including Chinese domestic models, built with TypeScript and Node.js.

## Why Choose LocalBot?

LocalBot is a powerful, modular AI assistant platform designed for developers and power users who need local AI capabilities with extensive tool integration.

### 🎯 Target Users

#### 1. **Developers**
LocalBot provides powerful tools for software development:
- **File Operations**: Read, write, copy, move, and manage files programmatically
- **Shell Commands**: Execute system commands, manage processes, and control the system
- **API Operations**: Make HTTP requests (GET, POST, PUT, DELETE, PATCH) and fetch web content
- **Data Processing**: Parse and process CSV/JSON files, perform text analysis and transformations
- **Code Generation**: Generate code snippets and assist with development tasks

#### 2. **Data Analysts**
Comprehensive tools for data analysis and visualization:
- **CSV/JSON Processing**: Read, write, and manipulate structured data files
- **Text Analysis**: Analyze text content, search, and replace patterns
- **Mathematical Calculations**: Perform complex mathematical operations
- **Data Visualization**: Create charts and visualizations from data

#### 3. **System Administrators**
Powerful system management capabilities:
- **System Information**: Get detailed system information and resource usage
- **Process Management**: List, monitor, and kill processes
- **Environment Variables**: Read and modify environment variables
- **Directory Operations**: Navigate and manage directories

#### 4. **Power Users**
Advanced utilities for everyday tasks:
- **Security Tools**: Encrypt/decrypt data, generate hashes
- **Compression**: Compress and decompress files
- **Encoding**: Base64 encode/decode operations
- **Random Generation**: Generate UUIDs and random strings

## Features

### 🚀 Core Capabilities
- **Multi-AI Model Routing**: Support for mainstream AI models (OpenAI, Alibaba Cloud Qwen, Anthropic Claude, Baidu ERNIE Bot, Tencent HunYuan, Zhipu AI, SiliconCloud, Ollama)
- **Local Skills System**: OpenClaw-style Markdown-based skill definitions with dynamic loading
- **Memory System**: Persistent memory storage and retrieval for context-aware conversations
- **Session Management**: Multi-session support with conversation history
- **RESTful API**: Standardized API endpoints for external integrations
- **Business Process Automation**: Automated workflow execution with task scheduling
- **Tool Execution**: 44+ built-in tools across 5 categories
- **Plugin System**: Extensible architecture for adding custom tools and skills

### 🔧 Skills System

LocalBot features a powerful OpenClaw-style skills system:

- **Markdown-Based**: Skills defined in SKILL.md files with metadata
- **Dynamic Loading**: Skills loaded automatically from workspace/skills directory
- **Smart Matching**: Automatic skill matching based on user intent
- **13 Built-in Skills**: Pre-configured skills for common use cases
- **Extensible**: Easy to add custom skills

Available Skills:
1. **business-automation** - Business process automation
2. **code-generation** - Code generation and assistance
3. **code-review** - Code review and analysis
4. **daily-life-assistant** - Daily life tasks and assistance
5. **data-analysis** - Data analysis and processing
6. **data-visualization** - Data visualization and charting
7. **debugging** - Debugging and troubleshooting
8. **file-operations** - File system operations
9. **shell-commands** - Shell command execution
10. **system-management** - System management and monitoring
11. **testing** - Testing and quality assurance
12. **text-processing** - Text processing and manipulation
13. **web-development** - Web development assistance

### 🌐 Multi-Platform Support

LocalBot supports multiple communication platforms for seamless integration:

- **CLI**: Command-line interface for local interactions
- **REST API**: Standardized HTTP API for external integrations
- **MCP Protocol**: Model Context Protocol for AI assistant integration
- **Telegram**: Telegram bot for instant messaging
- **Discord**: Discord bot for community interactions
- **Slack**: Slack bot for team collaboration
- **WhatsApp**: WhatsApp bot for personal messaging
- **WeCom**: Enterprise WeChat (企业微信) bot for enterprise messaging
- **Web**: Web interface for browser-based interactions
- **Mobile**: Android, HarmonyOS, and iOS deployment support

Platform Features:
- **Unified Interface**: Consistent API across all platforms
- **Independent Sessions**: Separate conversation history per platform
- **Platform-Specific Data**: Metadata and context preservation
- **Easy Configuration**: Simple environment variable setup
- **Extensible**: Easy to add new platforms

For detailed platform configuration, see [Multi-Platform Guide](docs/MULTI_PLATFORM_GUIDE.md), [Mobile Deployment Guide](docs/MOBILE_DEPLOYMENT.md), [iOS Deployment Guide](docs/IOS_DEPLOYMENT.md), [Web Development Guide](docs/WEB_DEVELOPMENT.md), and [WeCom Integration Guide](docs/WECOM_INTEGRATION.md).

### 🚀 Advanced Features

#### Reverse Control Engine
- **System Control**: Execute system commands and scripts
- **Browser Automation**: Automate web browsing and data extraction
- **File Operations**: Read, write, and manage files
- **Network Requests**: Make HTTP requests and API calls
- **Custom Tools**: Execute custom skills and tools
- **Permission System**: Fine-grained access control
- **Approval Workflow**: Optional user approval for actions
- **Action Logging**: Complete audit trail

For details, see [Reverse Control Engine Guide](docs/REVERSE_CONTROL.md).

#### Proactive Engine
- **Cron Tasks**: Schedule tasks with cron expressions
- **Webhook Triggers**: Trigger tasks via HTTP webhooks
- **Monitoring Rules**: Monitor GitHub, weather, prices, and custom conditions
- **7×24 Service**: Always-on monitoring and alerting
- **Action Types**: Messages, workflows, notifications, and custom actions
- **Event System**: Real-time event notifications
- **Task Management**: Add, remove, and query tasks

For details, see [Proactive Engine Guide](docs/PROACTIVE_ENGINE.md).

#### Deep Thinking Engine
- **Multi-Role Stance Splitting**: Creates multiple characters with different stances to generate conflicts and debates
- **Logical Progression**: Each round of thinking is deeper than the previous, not simple repetition
- **Self-Negation**: Later iterations推翻 earlier conclusions, achieving true self-correction
- **5 Thinking Roles**: Rational Analyst, Critical Questioner, Innovative Explorer, Pragmatist, Humanist
- **Role Conflict System**: Automatically detects and records conflicts between roles
- **Depth Progression**: Ensures each round has minimum depth progression
- **Smart Triggering**: Automatically detects questions requiring deep thinking
- **Memory Storage**: Automatically stores thinking processes for future reference

For details, see [Deep Thinking Engine Guide](docs/DEEP_THINKING.md).

### 🛠️ Available Tools

#### File System Tools (7 tools)
- `file_read` - Read file contents
- `file_write` - Write content to files
- `file_list` - List files in directories
- `file_delete` - Delete files
- `file_copy` - Copy files
- `file_move` - Move/rename files
- `file_stat` - Get file statistics

#### Shell & System Tools (8 tools)
- `shell_execute` - Execute shell commands
- `process_list` - List running processes
- `system_info` - Get system information
- `environment_variable` - Get/set environment variables
- `environment_list` - List all environment variables
- `directory_change` - Change current directory
- `directory_get_current` - Get current directory
- `process_kill` - Kill processes

#### API & Network Tools (8 tools)
- `http_get` - HTTP GET requests
- `http_post` - HTTP POST requests
- `http_put` - HTTP PUT requests
- `http_delete` - HTTP DELETE requests
- `http_patch` - HTTP PATCH requests
- `web_fetch` - Fetch web content
- `json_parse` - Parse JSON strings
- `json_stringify` - Stringify objects to JSON

#### Data Processing Tools (12 tools)
- `csv_read` - Read CSV files
- `csv_write` - Write CSV files
- `json_read` - Read JSON files
- `json_write` - Write JSON files
- `text_analysis` - Analyze text content
- `text_search` - Search text patterns
- `text_replace` - Replace text patterns
- `math_calculate` - Mathematical calculations
- `json_list` - List JSON array elements
- `mean_value` - Calculate mean value from numbers
- `bar_chart` - Create bar charts

#### Utility Tools (9 tools)
- `encrypt` - Encrypt data
- `decrypt` - Decrypt data
- `hash` - Generate hash values
- `compress` - Compress data
- `decompress` - Decompress data
- `base64_encode` - Base64 encode
- `base64_decode` - Base64 decode
- `uuid_generate` - Generate UUIDs
- `random_string` - Generate random strings

#### Plugin Tools (1 tool)
- `self_programming` - Generate, compile, and load new tools or plugins dynamically

### 🧠 Memory System

- **Persistent Storage**: Store important information for future reference
- **Semantic Search**: Search memories by content and tags
- **Tagging**: Organize memories with tags for easy retrieval
- **Importance Levels**: Prioritize memories by importance
- **Automatic Cleanup**: Automatic memory management and cleanup

### 📊 Session Management

- **Multi-Session Support**: Manage multiple conversation sessions
- **Conversation History**: Track conversation history within sessions
- **Session Persistence**: Save and restore sessions
- **Context Management**: Maintain context across conversations

### 🔄 Business Process Automation

- **Task Scheduling**: Schedule tasks for specific times or intervals
- **Workflow Engine**: Execute complex workflows with multiple steps
- **Monitoring System**: Monitor system resources and activities
- **Automation Controller**: Control and manage automated processes

### 🧩 Plugin System

- **Dynamic Plugin Loading**: Load plugins from `./plugins` directory
- **Self-Programming Tool**: AI can generate, compile, and load new tools dynamically
- **Security Validation**: Built-in plugin security validator for safe plugin execution
- **Extensible Architecture**: Easy to add custom plugins and tools

### 🌐 RESTful API

- **Message Processing**: `/api/v1/message` - Process user messages
- **Session Management**: `/api/v1/session/*` - Manage sessions
- **Health Check**: `/health` - Service health status
- **Standardized Responses**: Consistent API response format
- **Request Tracing**: Built-in request ID tracking

## Technology Stack

- **TypeScript** - Main development language
- **Node.js** - Runtime environment (v20+)
- **OpenAI SDK** - LLM integration (supports multiple providers)
- **Express** - RESTful API server
- **Winston** - Logging framework
- **Ollama** - Local LLM support
- **Playwright** - Browser automation
- **npm** - Package manager

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
| **Ollama** | Local models (llama3.2, etc.) |

## Architecture

```
local-bot/
├── src/
│   ├── agent/              # AI agent core logic
│   │   ├── AgentProcessor.ts    # Main AI processor
│   │   └── MultiAIRouter.ts     # Multi-AI routing
│   ├── skills/             # Skills and tools system
│   │   ├── SkillManager.ts      # Tool and skill management
│   │   ├── SkillsHub.ts         # OpenClaw-style skills
│   │   ├── tools/               # Tool implementations
│   │   │   ├── FileTools.ts
│   │   │   ├── ShellTools.ts
│   │   │   ├── ApiTools.ts
│   │   │   ├── DataTools.ts
│   │   │   └── UtilityTools.ts
│   │   └── registerTools.ts     # Tool registration
│   ├── memory/             # Memory system
│   │   └── MemorySystem.ts     # Persistent memory storage
│   ├── session/            # Session management
│   │   └── SessionManager.ts    # Session handling
│   ├── tasks/              # Task scheduling and automation
│   │   ├── AutomationController.ts
│   │   ├── TaskScheduler.ts
│   │   ├── WorkflowEngine.ts
│   │   └── MonitoringSystem.ts
│   ├── business-processes/ # Business process models
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
│   ├── api/               # API layer
│   │   ├── ApiService.ts
│   │   └── ApiResponse.ts
│   ├── plugins/           # Plugin system
│   │   ├── PluginManager.ts
│   │   ├── PluginSecurityValidator.ts
│   │   ├── PluginTypes.ts
│   │   └── SelfProgrammingTool.ts
│   ├── services/          # External services
│   │   └── OllamaService.ts
│   ├── utils/             # Utility functions
│   │   ├── Logger.ts
│   │   └── RetryHandler.ts
│   ├── gateway/           # API gateway
│   │   └── Gateway.ts
│   ├── interface/          # CLI interface
│   │   └── CLIInterface.ts
│   └── index.ts           # Entry point
├── workspace/
│   └── skills/            # Skill definitions (Markdown)
│       ├── business-automation/
│       ├── code-generation/
│       ├── data-analysis/
│       ├── data-visualization/
│       └── ...
├── plugins/              # Plugin directory
│   ├── examples/
│   │   ├── hello-world-plugin/
│   │   └── weather-plugin/
│   └── ...
├── memory/                # Memory storage (auto-created)
├── sessions/              # Session data (auto-created)
└── logs/                  # Log files (auto-created)
```

## Installation

### Global Installation (CLI)

You can install LocalBot globally as a CLI tool:

```bash
npm install -g .
```

After installation, you can use the `localbot` command from anywhere:

```bash
localbot
```

### Local Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd local-bot
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
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
```

### Using Alibaba Cloud Qwen
```env
LLM_PROVIDER=aliyun
ALIYUN_API_KEY=your_aliyun_api_key_here
ALIYUN_MODEL=qwen-plus
```

### Using Ollama (Local)
```env
LLM_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL_NAME=llama3.2
```

## Usage

### Start the Assistant

#### CLI Mode
```bash
npm start
```

In CLI mode, you can use the following commands:

- `help` - Show help information
- `tools` - List all available tools
- `skills` - List all available skills
- `memory` - Show recent memory
- `clear` - Clear session history
- `ai <provider>` - Switch AI provider
- `stats` - Show AI usage statistics
- `process` - List all available business processes
- `run <process-name>` - Execute a specific business process
- `exit` - Exit the assistant

#### Server Mode
```bash
npm run start:server
```

#### MCP Mode (Model Context Protocol)

LocalBot supports MCP protocol and can integrate with MCP-compatible clients (like Claude Desktop, Cursor, etc.):

```bash
npm run start:mcp
```

Or use CLI directly:

```bash
localbot --mcp
```

**MCP Configuration Example**:

Add to Claude Desktop configuration file:

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

**Note**:
- Replace `<path-to-localbot>` with your actual LocalBot project path
- Windows paths use double backslashes `\\`
- macOS/Linux paths use forward slashes `/`

Examples:
- Windows: `E:\\work\\202601211205\\local-bot\\dist\\index.js`
- macOS/Linux: `/Users/username/local-bot/dist/index.js`
- **Prompt Templates**: Pre-defined prompt templates for common tasks

For detailed MCP documentation, see [docs/MCP_PROTOCOL.md](docs/MCP_PROTOCOL.md).

### Development Mode
```bash
npm run dev
```

### Build Project
```bash
npm run build
```

## API Usage

### Send a Message
```bash
curl -X POST http://localhost:3000/api/v1/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how can you help me?",
    "sessionId": "session-123"
  }'
```

### Health Check
```bash
curl http://localhost:3000/health
```

### List Sessions
```bash
curl http://localhost:3000/api/v1/sessions
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `LLM_PROVIDER` | LLM provider (openai, aliyun, anthropic, baidu, tencent, zhipu, siliconcloud, ollama) | openai |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `ALIYUN_API_KEY` | Alibaba Cloud API key | - |
| `ALIYUN_MODEL` | Alibaba Cloud model | qwen-plus |
| `OLLAMA_API_URL` | Ollama API URL | http://localhost:11434 |
| `OLLAMA_MODEL_NAME` | Ollama model name | llama3.2 |
| `PORT` | Server port | 3000 |
| `LOG_LEVEL` | Log level (error, warn, info, debug) | info |
| `MEMORY_DIR` | Memory storage directory | ./memory |
| `SKILLS_DIR` | Skills directory | ./workspace/skills |
| `ENABLE_PERSISTENCE` | Enable session persistence | true |
| `PERSISTENCE_DIR` | Persistence directory | ./sessions |

## Skills System

### Creating Custom Skills

1. Create a new directory in `workspace/skills/`:
```bash
mkdir workspace/skills/my-skill
```

2. Create a `SKILL.md` file:
```markdown
---
name: my-skill
description: My custom skill
emoji: 🎯
category: custom
version: 1.0.0
---

# My Custom Skill

## When to Use
- Describe when to use this skill

## How to Use
1. Step 1
2. Step 2
3. Step 3

## Example
User request: "Example request"
Your response: "Example response"
```

3. Restart the assistant to load the new skill

### Skill Metadata

- `name`: Unique skill identifier
- `description`: Skill description
- `emoji`: Skill emoji (optional)
- `category`: Skill category (optional)
- `version`: Skill version (optional)
- `author`: Skill author (optional)
- `requires`: Required binaries and environment variables (optional)

## Tool Development

### Creating Custom Tools

1. Implement the `Tool` interface:
```typescript
import { Tool, ToolResult } from '../types';

export class MyTool implements Tool {
  name = 'my_tool';
  description = 'Description of my tool';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      // Tool logic here
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

2. Register the tool in `registerTools.ts`:
```typescript
import { MyTool } from './tools/MyTools';

export function registerDefaultTools(skillManager: SkillManager): void {
  const myTools = [new MyTool()];
  myTools.forEach(tool => skillManager.registerTool(tool));

  const mySkill: Skill = {
    name: 'my-skill',
    description: 'My custom skill',
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

## Plugin Development

### Creating Custom Plugins

The plugin system allows you to extend LocalBot's functionality with custom tools and features.

#### 1. Create Plugin Directory

Create your plugin in the `plugins/` directory:
```bash
mkdir plugins/my-plugin
cd plugins/my-plugin
```

#### 2. Create Plugin Configuration File

Create `plugin.json`:
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My custom plugin",
  "author": "Your Name",
  "main": "index.ts",
  "permissions": ["file_read", "file_write"],
  "dependencies": []
}
```

#### 3. Implement Plugin

Create `index.ts`:
```typescript
import { Plugin, Tool } from '../../src/plugins/PluginTypes';

export class MyTool implements Tool {
  name = 'my_custom_tool';
  description = 'My custom tool';
  category = 'custom' as const;

  async execute(params: Record<string, unknown>): Promise<any> {
    try {
      // Tool logic
      return {
        success: true,
        data: { result: 'Success' }
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
  description: 'My custom plugin',
  author: 'Your Name',
  tools: [new MyTool()],
  onLoad: async () => {
    console.log('Plugin loaded successfully');
  },
  onUnload: async () => {
    console.log('Plugin unloaded');
  }
};
```

#### 4. Using Self-Programming Tool

AI can use the `self_programming` tool to dynamically generate new tools:

```
User: Help me create a tool to calculate Fibonacci numbers

AI will use the self_programming tool:
1. Generate tool code
2. Compile the code
3. Load the new tool into the system
4. Return tool usage instructions
```

### Plugin Security

The plugin system includes security validation mechanisms:
- Code sandbox execution
- Permission checks
- API call limits
- Resource usage monitoring

## Business Process System

### Available Business Domains

LocalBot provides 11 business domains with 44 predefined business processes:

#### 1. 💰 Sales
- Customer development process
- Opportunity management process
- Sales performance analysis process

#### 2. 💳 Finance
- Budget management process
- Expense reimbursement process
- Financial reporting process
- Tax processing process

#### 3. ⚙️ Operations
- Inventory management process
- Supply chain optimization process
- Quality control process

#### 4. 👥 Human Resources (HR)
- Recruitment process
- Employee onboarding process
- Performance evaluation process
- Training management process

#### 5. 🏠 Home Automation
- Smart lighting control
- Temperature adjustment process
- Security monitoring process

#### 6. 📊 Tax Planning
- Tax planning process
- Deduction optimization process
- Compliance check process

#### 7. 📋 Project Management
- Project planning process
- Task assignment process
- Progress tracking process

#### 8. 🤝 CRM (Customer Relationship Management)
- Customer acquisition process
- Customer retention process
- Customer support process

#### 9. 📢 Marketing
- Campaign planning process
- Content marketing process
- Social media management process

#### 10. ⚖️ Legal Compliance
- Compliance check process
- Document management process
- Audit preparation process

#### 11. 📈 Data Analytics
- Data collection process
- Analysis reporting process
- Visualization presentation process

#### 12. 🤖 Personal Assistant
- Schedule management process
- Task reminder process
- Information summary process

### Using Business Processes

#### List All Available Processes
```
process
```

#### Execute a Specific Process
```
run <process-name>
```

For example:
```
run budget-management-process
run recruitment-process
run project-planning-process
```

### Creating Custom Business Processes

You can create custom business process models in the `src/business-processes/` directory:

```typescript
import { WorkflowDefinition, BusinessDomain } from './BusinessProcessManager';

export const myCustomProcess: WorkflowDefinition = {
  name: 'my-custom-process',
  description: 'My custom business process',
  domain: BusinessDomain.OPERATIONS,
  steps: [
    {
      id: 'step1',
      name: 'Step 1',
      description: 'Execute step 1',
      tool: 'tool_name',
      parameters: { /* parameters */ }
    },
    {
      id: 'step2',
      name: 'Step 2',
      description: 'Execute step 2',
      tool: 'tool_name',
      parameters: { /* parameters */ }
    }
  ]
};
```

## Deployment

### Docker

Build and run with Docker:
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

## Documentation

For detailed documentation, see:
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [API Specification](./docs/API_SPECIFICATION.md)
- [Architecture Overview](./docs/ARCHITECTURE_OVERVIEW.md)
- [Skills System](./docs/SKILLS_SYSTEM.md)
- [Automation Capabilities](./docs/AUTOMATION_CAPABILITIES.md)
- [Business Processes](./docs/BUSINESS_PROCESSES.md)
- [Custom Skills and Models Guide](./docs/CUSTOM_SKILLS_AND_MODELS_GUIDE.md)
- [GPU Setup](./docs/GPU_SETUP.md)
- [Ollama Configuration & Troubleshooting](./docs/TROUBLESHOOTING_OLLAMA.md)
- [Plugin Development Guide](./docs/PLUGIN_DEVELOPMENT.md)

## Troubleshooting

### Common Issues

1. **Empty responses from AI**
   - Check LLM provider configuration
   - Verify API keys are valid
   - Check network connectivity
   - Review logs in `logs/combined.log`

2. **Tools not executing**
   - Verify tools are registered in `registerTools.ts`
   - Check tool permissions
   - Review error logs

3. **Skills not loading**
   - Ensure SKILL.md files are properly formatted
   - Check skills directory path
   - Verify metadata is correct

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

MIT
