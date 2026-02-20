# LocalBot 多平台集成指南

本文档介绍如何配置和使用LocalBot的多平台功能，包括Telegram、Discord、Slack和WhatsApp。

## 目录

1. [概述](#概述)
2. [平台配置](#平台配置)
3. [平台适配器](#平台适配器)
4. [会话管理](#会话管理)
5. [使用示例](#使用示例)
6. [故障排除](#故障排除)

---

## 概述

LocalBot支持多个即时通讯平台，允许用户通过不同的渠道与AI助手交互。

### 支持的平台

| 平台 | 状态 | 功能 |
|------|------|------|
| **CLI** | ✅ 完全支持 | 命令行交互 |
| **REST API** | ✅ 完全支持 | HTTP API接口 |
| **MCP协议** | ✅ 完全支持 | Model Context Protocol |
| **Telegram** | ✅ 完全支持 | Telegram Bot |
| **Discord** | ✅ 完全支持 | Discord Bot |
| **Slack** | ✅ 完全支持 | Slack Bot |
| **WhatsApp** | ✅ 完全支持 | WhatsApp Bot |
| **Web** | ✅ 完全支持 | Web界面 |

### 架构

```
┌─────────────────────────────────────────────────────────┐
│                   LocalBot Core                     │
│  ┌───────────────────────────────────────────────┐  │
│  │         Platform Manager                       │  │
│  │  ┌──────────┬──────────┬──────────┐      │  │
│  │  │ Telegram │ Discord  │  Slack   │ ...  │  │
│  │  └──────────┴──────────┴──────────┘      │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │         Session Manager                       │  │
│  │  ┌──────────┬──────────┬──────────┐      │  │
│  │  │ Platform │ Platform │ Platform │ ...  │  │
│  │  │ Sessions │ Sessions │ Sessions │      │  │
│  │  └──────────┴──────────┴──────────┘      │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │         AI Processor                         │  │
│  │  ┌──────────┬──────────┬──────────┐      │  │
│  │  │  OpenAI  │  Ollama  │  Qwen    │ ...  │  │
│  │  └──────────┴──────────┴──────────┘      │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 平台配置

### 环境变量配置

在`.env`文件中配置平台：

```bash
# Telegram Bot
TELEGRAM_ENABLED=true
TELEGRAM_TOKEN=your_telegram_bot_token_here

# Discord Bot
DISCORD_ENABLED=true
DISCORD_TOKEN=your_discord_bot_token_here

# Slack Bot
SLACK_ENABLED=true
SLACK_TOKEN=your_slack_bot_token_here
SLACK_SIGNING_SECRET=your_slack_signing_secret_here

# WhatsApp Bot
WHATSAPP_ENABLED=true
WHATSAPP_SESSION_PATH=./sessions/whatsapp
```

### 获取Bot Token

#### Telegram

1. 在Telegram中找到[@BotFather](https://t.me/BotFather)
2. 发送`/newbot`创建新bot
3. 按照提示设置bot名称和用户名
4. 复制生成的API token

#### Discord

1. 访问[Discord Developer Portal](https://discord.com/developers/applications)
2. 点击"New Application"创建应用
3. 在"Bot"选项卡中创建bot
4. 复制生成的token

#### Slack

1. 访问[Slack API](https://api.slack.com/apps)
2. 点击"Create New App"创建应用
3. 在"OAuth & Permissions"中配置bot权限
4. 复制Bot User OAuth Token和Signing Secret

#### WhatsApp

1. 安装WhatsApp Web.js（会自动处理认证）
2. 首次运行时扫描QR码
3. 会话数据保存在配置的路径中

---

## 平台适配器

### Telegram适配器

```typescript
import { TelegramAdapter } from './platforms';

const telegram = new TelegramAdapter();

// 初始化
await telegram.initialize({
  enabled: true,
  token: 'your_token'
});

// 连接
await telegram.connect();

// 发送消息
await telegram.sendMessage('user_id', 'Hello from LocalBot!');

// 发送文件
await telegram.sendFile('user_id', '/path/to/file.pdf', 'Check this file');
```

### Discord适配器

```typescript
import { DiscordAdapter } from './platforms';

const discord = new DiscordAdapter();

// 初始化
await discord.initialize({
  enabled: true,
  token: 'your_token'
});

// 连接
await discord.connect();

// 发送消息
await discord.sendMessage('user_id', 'Hello from LocalBot!');

// 发送文件
await discord.sendFile('user_id', '/path/to/file.pdf', 'Check this file');
```

### Slack适配器

```typescript
import { SlackAdapter } from './platforms';

const slack = new SlackAdapter();

// 初始化
await slack.initialize({
  enabled: true,
  token: 'your_token',
  signingSecret: 'your_signing_secret'
});

// 连接
await slack.connect();

// 发送消息
await slack.sendMessage('channel_id', 'Hello from LocalBot!');

// 发送文件
await slack.sendFile('channel_id', '/path/to/file.pdf', 'Check this file');
```

### WhatsApp适配器

```typescript
import { WhatsAppAdapter } from './platforms';

const whatsapp = new WhatsAppAdapter();

// 初始化
await whatsapp.initialize({
  enabled: true,
  sessionPath: './sessions/whatsapp'
});

// 连接（首次需要扫描QR码）
await whatsapp.connect();

// 发送消息
await whatsapp.sendMessage('phone_number', 'Hello from LocalBot!');

// 发送文件
await whatsapp.sendFile('phone_number', '/path/to/file.pdf', 'Check this file');
```

---

## 会话管理

### 平台会话

每个平台用户都有独立的会话，会话ID格式为`{platform}-{platformUserId}`。

```typescript
import { SessionManager } from './session';

const sessionManager = new SessionManager();

// 创建或获取平台会话
const session = await sessionManager.getOrCreatePlatformSession(
  'telegram',
  '123456789',
  'user_id'
);

// 更新会话消息
await sessionManager.updateSession(session.sessionId, [
  {
    id: 'msg_1',
    role: 'user',
    content: 'Hello',
    timestamp: new Date()
  }
]);

// 获取平台的所有会话
const telegramSessions = await sessionManager.getPlatformSessions('telegram');

// 删除平台会话
await sessionManager.deletePlatformSession('telegram', '123456789');
```

### 会话数据结构

```typescript
interface SessionData {
  sessionId: string;           // 会话ID
  userId?: string;            // 用户ID
  platform?: PlatformType;    // 平台类型
  platformUserId?: string;     // 平台用户ID
  platformData?: Record<string, unknown>; // 平台特定数据
  messages: Message[];        // 消息历史
  createdAt: Date;           // 创建时间
  lastActivity: Date;        // 最后活动时间
}
```

---

## 使用示例

### 完整的多平台集成示例

```typescript
import { PlatformManager } from './platforms';
import { SessionManager } from './session';
import { AgentProcessor } from './agent';

// 初始化组件
const platformManager = new PlatformManager();
const sessionManager = new SessionManager();
const agentProcessor = new AgentProcessor();

// 配置平台
await platformManager.initialize({
  telegram: {
    enabled: true,
    token: process.env.TELEGRAM_TOKEN
  },
  discord: {
    enabled: true,
    token: process.env.DISCORD_TOKEN
  },
  slack: {
    enabled: true,
    token: process.env.SLACK_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
  },
  whatsapp: {
    enabled: true,
    sessionPath: './sessions/whatsapp'
  }
});

// 连接所有平台
await platformManager.connect();

// 处理平台消息
platformManager.onMessage(async (message) => {
  // 获取或创建会话
  const session = await sessionManager.getOrCreatePlatformSession(
    message.platform,
    message.platformUserId
  );

  // 添加用户消息到会话
  session.messages.push({
    id: message.id,
    role: 'user',
    content: message.content,
    timestamp: message.timestamp
  });

  // 处理AI响应
  const response = await agentProcessor.process({
    sessionId: session.sessionId,
    messages: session.messages,
    userId: session.userId
  });

  // 添加AI响应到会话
  session.messages.push({
    id: `response_${Date.now()}`,
    role: 'assistant',
    content: response.content,
    timestamp: new Date()
  });

  // 更新会话
  await sessionManager.updateSession(session.sessionId, session.messages);

  // 发送响应到平台
  await platformManager.sendMessage(
    message.platform,
    message.platformUserId,
    response.content
  );
});

// 处理错误
platformManager.onError((error, platform) => {
  console.error(`Platform ${platform} error:`, error);
});

// 获取平台状态
const status = platformManager.getPlatformStatus();
console.log('Platform status:', status);
```

### 特定平台的消息处理

```typescript
// Telegram特定处理
platformManager.onMessage(async (message) => {
  if (message.platform === 'telegram') {
    // 处理Telegram特定功能
    const metadata = message.metadata as any;
    console.log('Telegram user:', metadata.username);
  }
  
  // 通用处理...
});

// Discord特定处理
platformManager.onMessage(async (message) => {
  if (message.platform === 'discord') {
    // 处理Discord特定功能
    const metadata = message.metadata as any;
    console.log('Discord user:', metadata.username);
    console.log('Discord guild:', metadata.guildId);
  }
  
  // 通用处理...
});
```

---

## 故障排除

### Telegram常见问题

#### 问题1: Bot无法接收消息

```bash
# 解决方案: 确保Bot已启动并添加到群组
# 1. 在Telegram中找到你的bot
# 2. 点击"Start"按钮
# 3. 将bot添加到群组并授予管理员权限
```

#### 问题2: Token无效

```bash
# 解决方案: 重新生成token
# 1. 访问@BotFather
# 2. 使用/revoke命令
# 3. 重新生成token并更新.env
```

### Discord常见问题

#### 问题1: Bot无法连接

```bash
# 解决方案: 检查Intent配置
# 确保在Discord Developer Portal中启用了以下Intents:
# - Guilds
# - Guild Messages
# - Message Content
# - Direct Messages
```

#### 问题2: 消息发送失败

```bash
# 解决方案: 检查bot权限
# 确保bot在服务器/频道中有发送消息的权限
```

### Slack常见问题

#### 问题1: Webhook验证失败

```bash
# 解决方案: 检查Signing Secret
# 1. 确保Signing Secret正确
# 2. 检查环境变量是否正确设置
# 3. 重启应用
```

#### 问题2: Bot无法响应

```bash
# 解决方案: 检查bot权限
# 确保bot在频道中有以下权限:
# - chat:write
# - files:write
```

### WhatsApp常见问题

#### 问题1: QR码扫描失败

```bash
# 解决方案: 清除会话数据
rm -rf ./sessions/whatsapp
# 重新启动应用并扫描QR码
```

#### 问题2: 会话过期

```bash
# 解决方案: 重新认证
# WhatsApp Web会话有有效期，过期后需要重新扫描QR码
```

---

## 最佳实践

1. **错误处理**

   ```typescript
   platformManager.onError((error, platform) => {
     Logger.error(`Platform ${platform} error`, { error: error.message });
     
     // 根据平台类型采取不同措施
     if (platform === 'whatsapp') {
       // WhatsApp可能需要重新认证
     }
   });
   ```

2. **消息限流**

   ```typescript
   // 避免发送过快导致被封禁
   const rateLimiter = new Map<string, number>();
   
   async function sendMessage(platform, userId, message) {
     const key = `${platform}-${userId}`;
     const lastSent = rateLimiter.get(key) || 0;
     
     if (Date.now() - lastSent < 1000) {
       await new Promise(resolve => setTimeout(resolve, 1000));
     }
     
     await platformManager.sendMessage(platform, userId, message);
     rateLimiter.set(key, Date.now());
   }
   ```

3. **会话清理**

   ```typescript
   // 定期清理过期会话
   setInterval(async () => {
     await sessionManager.cleanupOldSessions(30); // 30天
   }, 24 * 60 * 60 * 1000); // 每天执行
   ```

4. **平台特定优化**

   ```typescript
   // 根据平台特点优化消息格式
   function formatMessage(platform, content) {
     switch (platform) {
       case 'telegram':
         return content.replace(/\*\*(.*?)\*\*/g, '*$1*');
       case 'discord':
         return content.replace(/\*(.*?)\*/g, '**$1**');
       case 'slack':
         return content.replace(/\*(.*?)\*/g, '*$1*');
       default:
         return content;
     }
   }
   ```

---

## 总结

LocalBot的多平台集成提供了灵活的部署选项，支持多种即时通讯平台。通过统一的平台管理器和会话管理器，可以轻松扩展和管理多个平台。

### 关键特性

- ✅ 统一的平台接口
- ✅ 独立的会话管理
- ✅ 平台特定的数据处理
- ✅ 完整的错误处理
- ✅ 灵活的配置选项
- ✅ 易于扩展

### 下一步

- 配置您的第一个平台
- 测试消息发送和接收
- 集成到现有系统
- 扩展自定义平台适配器
