# 插件开发指南

## 概述

LocalBot 支持动态插件系统，允许开发者创建自定义工具和功能，并在运行时动态加载和卸载插件。

## 插件结构

每个插件必须包含以下文件：

```
my-plugin/
├── plugin.json          # 插件元数据
├── index.js             # 插件主代码
└── README.md            # 插件文档（可选）
```

## plugin.json 格式

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My custom plugin for LocalBot",
  "author": "Your Name",
  "category": "custom",
  "dependencies": [],
  "permissions": []
}
```

### 字段说明

- `name`: 插件名称（必需，只能包含字母、数字、连字符和下划线）
- `version`: 版本号（必需，建议使用语义化版本）
- `description`: 插件描述（必需，最多 500 字符）
- `author`: 作者名称（可选）
- `category`: 插件分类（可选）
- `dependencies`: 依赖列表（可选）
- `permissions`: 权限列表（可选）

## 创建插件

### 基础插件示例

```javascript
import { Plugin, PluginMetadata } from '../plugins/PluginTypes';
import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

const metadata = {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'My custom plugin',
  author: 'Your Name',
  category: 'custom'
};

export class MyPlugin implements Plugin {
  metadata = metadata;

  async initialize() {
    Logger.info('MyPlugin initialized');
  }

  getTools() {
    return [
      {
        name: 'my_tool',
        description: 'My custom tool',
        category: 'custom' as const,
        async execute(params) {
          try {
            const message = params.message as string;
            Logger.info('MyTool executed', { message });
            
            return {
              success: true,
              data: {
                message: `Hello, ${message}!`,
                timestamp: new Date().toISOString()
              }
            };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : String(error)
            };
          }
        }
      }
    ];
  }

  async destroy() {
    Logger.info('MyPlugin destroyed');
  }
}

export default MyPlugin;
```

### 高级插件示例

```javascript
import { Plugin } from '../plugins/PluginTypes';
import { Tool } from '../types';
import axios from 'axios';

export class WeatherPlugin implements Plugin {
  metadata = {
    name: 'weather-plugin',
    version: '1.0.0',
    description: 'Weather information plugin',
    author: 'Weather Team',
    category: 'external',
    permissions: ['network:read']
  };

  private apiKey: string;

  async initialize() {
    this.apiKey = process.env.WEATHER_API_KEY || '';
    console.log('WeatherPlugin initialized');
  }

  getTools() {
    return [
      {
        name: 'get_weather',
        description: 'Get weather information for a city',
        category: 'external' as const,
        async execute(params) {
          try {
            const city = params.city as string;
            
            const response = await axios.get(
              `https://api.weather.com/v1/current?city=${city}&apiKey=${this.apiKey}`
            );

            return {
              success: true,
              data: response.data
            };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : String(error)
            };
          }
        }
      },
      {
        name: 'get_forecast',
        description: 'Get weather forecast for a city',
        category: 'external' as const,
        async execute(params) {
          try {
            const city = params.city as string;
            const days = params.days as number || 3;
            
            const response = await axios.get(
              `https://api.weather.com/v1/forecast?city=${city}&days=${days}&apiKey=${this.apiKey}`
            );

            return {
              success: true,
              data: response.data
            };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : String(error)
            };
          }
        }
      }
    ];
  }

  async destroy() {
    console.log('WeatherPlugin destroyed');
  }
}

export default WeatherPlugin;
```

## 插件生命周期

### 1. 初始化

当插件被加载时，会调用 `initialize()` 方法：

```javascript
async initialize() {
  // 执行初始化逻辑
  // 例如：建立数据库连接、加载配置等
}
```

### 2. 获取工具

系统会调用 `getTools()` 方法获取插件提供的所有工具：

```javascript
getTools() {
  return [
    // 返回工具数组
  ];
}
```

### 3. 执行工具

当用户调用工具时，会执行工具的 `execute()` 方法：

```javascript
async execute(params: Record<string, unknown>): Promise<ToolResult> {
  // 执行工具逻辑
  return {
    success: true,
    data: { /* 返回数据 */ }
  };
}
```

### 4. 销毁

当插件被卸载时，会调用 `destroy()` 方法：

```javascript
async destroy() {
  // 执行清理逻辑
  // 例如：关闭连接、释放资源等
}
```

## 工具开发

### 工具接口

```typescript
interface Tool {
  name: string;
  description: string;
  category: string;
  execute: (params: Record<string, unknown>) => Promise<ToolResult>;
}
```

### 工具结果

```typescript
interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}
```

### 工具分类

- `file`: 文件操作
- `shell`: Shell 命令
- `memory`: 记忆操作
- `network`: 网络操作
- `system`: 系统操作
- `frontend`: 前端工具
- `dynamic`: 动态工具
- `generated`: 生成的工具
- `custom`: 自定义工具

## 安全验证

插件系统会自动验证插件代码和元数据：

### 元数据验证

- 插件名称必须符合命名规范
- 版本号必须符合语义化版本
- 描述不能为空
- 权限不能包含受限权限

### 代码验证

- 检测危险代码模式（如 `eval`、`exec` 等）
- 限制文件大小（最大 1MB）
- 检测受限权限请求

### 受限权限

以下权限被限制使用：

- `system:root`
- `network:any`
- `file:any`
- `process:kill`

## 插件热加载

插件系统支持热加载，当插件文件发生变化时，会自动重新加载插件：

```javascript
// 自动监听插件目录
// 当文件变化时自动重新加载
```

## 插件管理

### 加载插件

```javascript
const result = await skillManager.loadPlugin('./plugins/my-plugin');
```

### 卸载插件

```javascript
const result = await skillManager.unloadPlugin('my-plugin');
```

### 重新加载插件

```javascript
const result = await skillManager.reloadPlugin('my-plugin');
```

### 获取所有插件

```javascript
const plugins = skillManager.getAllPlugins();
```

## 调试

### 日志

使用 Logger 记录日志：

```javascript
import { Logger } from '../utils/Logger';

Logger.info('Plugin initialized');
Logger.error('Error occurred', { error: errorMessage });
Logger.warn('Warning message');
```

### 错误处理

```javascript
try {
  // 执行操作
} catch (error) {
  return {
    success: false,
    error: error instanceof Error ? error.message : String(error)
  };
}
```

## 最佳实践

1. **命名规范**
   - 插件名称使用小写字母、连字符和下划线
   - 工具名称使用下划线分隔单词
   - 类名使用 PascalCase

2. **错误处理**
   - 始终捕获和处理错误
   - 返回有意义的错误消息
   - 使用 Logger 记录错误

3. **资源管理**
   - 在 `destroy()` 中释放所有资源
   - 关闭所有连接和文件句柄
   - 清理定时器和事件监听器

4. **性能优化**
   - 避免阻塞操作
   - 使用异步操作
   - 缓存频繁访问的数据

5. **文档**
   - 为每个工具提供清晰的描述
   - 编写 README 文档
   - 提供使用示例

## 示例插件

查看 `plugins/examples/` 目录中的示例插件：

- `hello-world-plugin`: 基础插件示例
- `weather-plugin`: 外部 API 集成示例
- `database-plugin`: 数据库操作示例
- `scheduler-plugin`: 任务调度示例

## 常见问题

### Q: 插件无法加载？

A: 检查以下几点：
- `plugin.json` 文件是否存在
- `index.js` 文件是否存在
- 元数据是否符合规范
- 代码是否有语法错误

### Q: 插件热加载不工作？

A: 确保：
- 插件目录正确
- 文件权限正确
- 没有其他进程占用文件

### Q: 如何调试插件？

A: 使用 Logger 记录日志，查看控制台输出。

## 支持

如有问题，请提交 Issue 或联系开发团队。
