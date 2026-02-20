# LocalBot Architecture Overview

## System Components

### Core Components
- **AgentProcessor**: Main AI request processing component that handles user queries and routes them to appropriate AI providers
- **MultiAIRouter**: Intelligent routing system that selects optimal AI provider based on task requirements and language
- **SkillManager**: Centralized management of all available tools and skills
- **BusinessProcessManager**: Orchestration of complex business processes across multiple domains
- **WorkflowEngine**: Execution engine for multi-step automation workflows
- **TaskScheduler**: Scheduling and execution of time-based tasks
- **PlatformManager**: Unified platform adapter manager supporting 8 communication platforms (CLI, API, MCP, Telegram, Discord, Slack, WhatsApp, Web)

### Supporting Components
- **Logger**: Comprehensive logging system for debugging and monitoring
- **RetryHandler**: Robust retry mechanism for API calls
- **SessionManager**: Session management for ongoing conversations with multi-platform support
- **Platform Adapters**: Individual adapters for each communication platform (Telegram, Discord, Slack, WhatsApp)

## Technical Architecture

### Multi-AI Support
The system supports multiple AI providers with automatic selection based on:
- Task type (coding, reasoning, analysis)
- Language requirements (with special emphasis on Chinese support)
- Cost efficiency
- Historical performance

Supported providers include:
- International: OpenAI, Anthropic
- Domestic Chinese: Alibaba Tongyi, Baidu ERNIE Bot, Tencent HunYuan, Zhipu ChatGLM, SiliconCloud

### Tool System Architecture
The skill system is organized into multiple categories:
- Core System Tools (file operations, shell commands, memory management)
- Data Processing Tools (CSV/JSON, text analysis, math operations)
- Business Tools (CRM, ERP, financial calculations)
- Utility Tools (scheduling, security, notifications)
- Specialized Tools (AI operations, home automation, tax processing)

### Automation Framework
- Business Process Models for specific domains (Sales, Finance, HR, Operations)
- Home Automation Models for smart home control
- Tax Planning Models for corporate and individual tax automation
- Project Management Models for task coordination
- Customer Relationship Management Processes
- Marketing Automation Workflows
- Legal Compliance Automation
- Data Analytics and Reporting Systems