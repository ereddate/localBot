# Local AI Assistant

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

| Tool | Description |
|------|-------------|
| `file_read` | Read the contents of a file |
| `file_write` | Write content to a file |
| `file_list` | List files in a directory |
| `file_delete` | Delete a file |
| `shell_execute` | Execute a shell command |
| `memory_add` | Add an entry to memory |
| `memory_search` | Search memory entries |

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
