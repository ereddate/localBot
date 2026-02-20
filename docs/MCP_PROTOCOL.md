# MCP协议支持

LocalBot完全支持Model Context Protocol (MCP)，可以作为MCP服务器与支持MCP的客户端（如Claude Desktop、Cursor、Copilot等）无缝集成。

## 什么是MCP？

MCP（Model Context Protocol）是Anthropic提出的开放标准协议，用于规范LLM与各种数据源和工具的交互方式。它提供了一个统一的接口，让AI应用能够轻松连接到任意MCP服务器。

### MCP的优势

- **标准化接口**: 统一的协议，无需为每个工具编写适配器
- **模块化设计**: 每个MCP服务器专注于特定功能
- **安全性**: 服务器之间相互隔离，无法窥探其他服务器的数据
- **可扩展性**: 易于添加新的功能和工具
- **跨平台兼容**: 支持多种AI应用和开发环境

## 安装和配置

### 1. 构建项目

首先确保项目已构建：

```bash
npm run build
```

### 2. 配置Claude Desktop

在Claude Desktop的配置文件中添加LocalBot作为MCP服务器：

**Windows配置文件位置**：
```
%APPDATA%\Claude\claude_desktop_config.json
```

**macOS/Linux配置文件位置**：
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**配置内容**：

```json
{
  "mcpServers": {
    "localbot": {
      "command": "node",
      "args": ["E:\\work\\202601211205\\local-bot\\dist\\index.js"],
      "env": {
        "RUN_MODE": "mcp"
      }
    }
  }
}
```

**注意**：
- 将 `E:\\work\\202601211205\\local-bot\\dist\\index.js` 替换为您的实际路径
- Windows路径使用双反斜杠 `\\`
- macOS/Linux路径使用正斜杠 `/`

### 3. 配置环境变量

创建或编辑 `.env` 文件，配置您的LLM提供商：

```env
LLM_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL_NAME=llama3.2
```

或使用其他提供商：

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. 重启Claude Desktop

配置完成后，重启Claude Desktop以加载新的MCP服务器。

## MCP功能

### 工具调用（Tools）

LocalBot将所有内置工具通过MCP协议暴露，包括：

#### 文件系统工具
- `file_read` - 读取文件内容
- `file_write` - 写入内容到文件
- `file_list` - 列出目录中的文件
- `file_delete` - 删除文件
- `file_copy` - 复制文件
- `file_move` - 移动/重命名文件
- `file_stat` - 获取文件统计信息

#### Shell和系统工具
- `shell_execute` - 执行Shell命令
- `process_list` - 列出运行中的进程
- `system_info` - 获取系统信息
- `environment_variable` - 获取/设置环境变量
- `environment_list` - 列出所有环境变量
- `directory_change` - 更改当前目录
- `directory_get_current` - 获取当前目录
- `process_kill` - 终止进程

#### API和网络工具
- `http_get` - HTTP GET请求
- `http_post` - HTTP POST请求
- `http_put` - HTTP PUT请求
- `http_delete` - HTTP DELETE请求
- `http_patch` - HTTP PATCH请求
- `web_fetch` - 获取网页内容
- `json_parse` - 解析JSON字符串
- `json_stringify` - 将对象转换为JSON字符串

#### 数据处理工具
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

#### 实用工具
- `encrypt` - 加密数据
- `decrypt` - 解密数据
- `hash` - 生成哈希值
- `compress` - 压缩数据
- `decompress` - 解压数据
- `base64_encode` - Base64编码
- `base64_decode` - Base64解码
- `uuid_generate` - 生成UUID
- `random_string` - 生成随机字符串

#### 插件工具
- `self_programming` - 动态生成、编译和加载新工具或插件

### 资源访问（Resources）

LocalBot提供以下资源：

- `memory://recent` - 最近的记忆条目
- `skills://list` - 可用技能列表
- `tools://list` - 可用工具列表

### 提示模板（Prompts）

LocalBot提供预定义的提示模板：

- `analyze_code` - 分析代码并提供建议
- `generate_documentation` - 为代码生成文档
- `debug_issue` - 调试代码问题

## 使用示例

### 在Claude Desktop中使用

1. **文件操作**：
```
请读取当前目录下的package.json文件
```

Claude会自动调用 `file_read` 工具。

2. **执行命令**：
```
列出当前运行的所有进程
```

Claude会自动调用 `process_list` 工具。

3. **数据处理**：
```
读取data.csv文件并计算平均值
```

Claude会自动调用 `csv_read` 和 `mean_value` 工具。

4. **代码分析**：
```
使用analyze_code提示模板分析这段代码
```

Claude会使用预定义的提示模板。

## 直接运行MCP服务器

您也可以直接运行MCP服务器进行测试：

```bash
npm run start:mcp
```

或使用开发模式：

```bash
npm run dev:mcp
```

服务器将等待来自MCP客户端的JSON-RPC请求。

## MCP协议实现

LocalBot实现了以下MCP协议方法：

### 初始化
- `initialize` - 初始化MCP服务器
- `initialized` - 确认初始化完成

### 工具
- `tools/list` - 列出所有可用工具
- `tools/call` - 调用指定工具

### 资源
- `resources/list` - 列出所有可用资源
- `resources/read` - 读取指定资源

### 提示
- `prompts/list` - 列出所有可用提示
- `prompts/get` - 获取指定提示

### 通知
- `notifications/initialized` - 通知服务器已初始化

## 故障排除

### Claude Desktop无法连接

1. **检查路径**：
   - 确保 `dist/index.js` 路径正确
   - Windows路径使用双反斜杠 `\\`

2. **检查环境变量**：
   - 确保 `.env` 文件存在
   - 验证LLM提供商配置正确

3. **检查构建**：
   - 确保已运行 `npm run build`
   - 验证 `dist` 目录存在

4. **查看日志**：
   - 检查Claude Desktop日志
   - 查看 `logs/` 目录下的LocalBot日志

### 工具调用失败

1. **检查权限**：
   - 确保有文件系统访问权限
   - 确保有执行Shell命令的权限

2. **检查参数**：
   - 确保工具参数格式正确
   - 查看工具的输入schema

3. **查看错误消息**：
   - MCP响应包含详细的错误信息
   - 检查 `logs/` 目录下的日志

## 高级配置

### 自定义端口

虽然MCP使用stdio传输，但您可以通过环境变量配置其他选项：

```env
LOG_LEVEL=debug
MEMORY_DIR=./custom_memory
SKILLS_DIR=./custom_skills
```

### 多个MCP服务器

您可以为不同的用途配置多个LocalBot实例：

```json
{
  "mcpServers": {
    "localbot-dev": {
      "command": "node",
      "args": ["E:\\work\\localbot-dev\\dist\\index.js"],
      "env": {
        "RUN_MODE": "mcp",
        "LLM_PROVIDER": "ollama"
      }
    },
    "localbot-prod": {
      "command": "node",
      "args": ["E:\\work\\localbot-prod\\dist\\index.js"],
      "env": {
        "RUN_MODE": "mcp",
        "LLM_PROVIDER": "openai"
      }
    }
  }
}
```

## 性能优化

### 缓存

LocalBot自动缓存工具列表和资源，减少重复查询。

### 并发处理

MCP服务器支持并发处理多个请求。

### 日志级别

在生产环境中，将日志级别设置为 `warn` 或 `error`：

```env
LOG_LEVEL=warn
```

## 安全性

### 权限控制

LocalBot的MCP服务器继承系统的权限控制：
- 文件操作受文件系统权限限制
- Shell命令受用户权限限制
- 网络请求受网络配置限制

### 数据隔离

MCP协议确保：
- 服务器之间相互隔离
- 无法窥探其他服务器的数据
- 完整的对话历史保留在客户端

## 支持

如需帮助，请查看：
- [MCP官方文档](https://modelcontextprotocol.io)
- [Claude Desktop文档](https://claude.ai/download)
- [LocalBot GitHub Issues](https://github.com/ereddate/localBot/issues)

## 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。
