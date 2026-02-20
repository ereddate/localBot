# LocalBot Web端开发指南

本文档介绍如何开发和部署LocalBot的Web端界面。

## 目录

1. [概述](#概述)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [快速开始](#快速开始)
5. [核心功能](#核心功能)
6. [API集成](#api集成)
7. [WebSocket集成](#websocket集成)
8. [部署](#部署)
9. [性能优化](#性能优化)

---

## 概述

LocalBot Web端是一个现代化的Web应用，提供用户友好的界面来与AI助手交互。

### 主要特性

- 🎨 现代化UI设计
- 💬 实时消息交互
- 📱 响应式设计
- 🌙 深色模式支持
- 🌍 多语言支持
- 🔐 用户认证
- 📊 会话历史管理
- 🎯 技能可视化

---

## 技术栈

### 前端框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 18.x | UI框架 |
| **TypeScript** | 5.x | 类型安全 |
| **Vite** | 5.x | 构建工具 |
| **Tailwind CSS** | 3.x | 样式框架 |
| **React Router** | 6.x | 路由管理 |
| **Zustand** | 4.x | 状态管理 |

### 后端集成

| 技术 | 版本 | 用途 |
|------|------|------|
| **LocalBot API** | v1 | RESTful API |
| **WebSocket** | - | 实时通信 |
| **HTTP Client** | Axios | API请求 |

---

## 项目结构

```
web/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── ChatContainer.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── Settings/
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── LanguageSelect.tsx
│   │   │   └── ModelConfig.tsx
│   │   └── Common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Modal.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Chat.tsx
│   │   ├── Settings.tsx
│   │   └── History.tsx
│   ├── store/
│   │   ├── useStore.ts
│   │   ├── chatStore.ts
│   │   └── settingsStore.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── websocket.ts
│   │   └── auth.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── chat.ts
│   │   └── settings.ts
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useChat.ts
│   │   ├── useWebSocket.ts
│   │   └── useAuth.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 快速开始

### 1. 创建项目

```bash
npm create vite@latest localbot-web -- --template react-ts
cd localbot-web
```

### 2. 安装依赖

```bash
npm install react-router-dom zustand axios
npm install -D tailwindcss postcss autoprefixer
npm install lucide-react
```

### 3. 配置Tailwind CSS

```bash
npx tailwindcss init -p
```

在`tailwind.config.js`中：

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

在`src/index.css`中：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. 创建主应用

在`src/App.tsx`中：

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { Settings } from './pages/Settings';
import { History } from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:sessionId?" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### 5. 运行开发服务器

```bash
npm run dev
```

---

## 核心功能

### 1. 聊天界面

```typescript
// src/pages/Chat.tsx
import { useState, useEffect, useRef } from 'react';
import { useChat } from '../hooks/useChat';
import { MessageList } from '../components/Chat/MessageList';
import { MessageInput } from '../components/Chat/MessageInput';
import { TypingIndicator } from '../components/Chat/TypingIndicator';

export function Chat() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const {
    messages,
    sendMessage,
    isLoading,
    error
  } = useChat(sessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} />
        {isLoading && <TypingIndicator />}
        {error && (
          <div className="text-red-500 p-4">
            {error.message}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
}
```

### 2. 消息列表

```typescript
// src/components/Chat/MessageList.tsx
import { Message } from '../../types/chat';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4 p-4">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            <span className="text-xs opacity-70 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 3. 消息输入

```typescript
// src/components/Chat/MessageInput.tsx
import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (content.trim()) {
      onSend(content);
      setContent('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-4 bg-white">
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          className="flex-1 border rounded-lg p-3 resize-none"
          rows={1}
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !content.trim()}
          className="bg-blue-500 text-white rounded-lg px-4 hover:bg-blue-600 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
```

---

## API集成

### 1. API服务

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  code: number;
  message: string;
  data: {
    content: string;
    sessionId: string;
  };
  timestamp: number;
  requestId: string;
}

export async function sendMessage(
  sessionId: string,
  content: string
): Promise<ChatResponse> {
  const response = await api.post('/message', {
    sessionId,
    content,
  });
  return response.data;
}

export async function getSession(sessionId: string) {
  const response = await api.get(`/session/${sessionId}`);
  return response.data;
}

export async function getSessions() {
  const response = await api.get('/sessions');
  return response.data;
}

export async function deleteSession(sessionId: string) {
  const response = await api.delete(`/session/${sessionId}`);
  return response.data;
}
```

### 2. Chat Hook

```typescript
// src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { sendMessage, getSession } from '../services/api';
import { Message } from '../types/chat';

export function useChat(sessionId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      const response = await getSession(sessionId);
      setMessages(response.data.messages || []);
    } catch (err) {
      setError(err as Error);
    }
  }, [sessionId]);

  const handleSendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendMessage(sessionId || 'default', content);
      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: response.data.content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  return {
    messages,
    sendMessage: handleSendMessage,
    isLoading,
    error,
    loadSession,
  };
}
```

---

## WebSocket集成

### 1. WebSocket服务

```typescript
// src/services/websocket.ts
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(url: string) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.reconnect();
    };
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        this.connect(this.ws!.url);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private handleMessage(message: any) {
    // 处理接收到的消息
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService();
```

### 2. WebSocket Hook

```typescript
// src/hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import { wsService } from '../services/websocket';

export function useWebSocket(url: string, onMessage: (message: any) => void) {
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    wsService.connect(url);

    const handleMessage = (message: any) => {
      onMessageRef.current(message);
    };

    wsService.on('message', handleMessage);

    return () => {
      wsService.disconnect();
    };
  }, [url]);
}
```

---

## 部署

### 1. 构建生产版本

```bash
npm run build
```

### 2. 部署到Vercel

```bash
npm install -g vercel
vercel
```

### 3. 部署到Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### 4. 部署到Docker

创建`Dockerfile`：

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

构建和运行：

```bash
docker build -t localbot-web .
docker run -p 80:80 localbot-web
```

---

## 性能优化

### 1. 代码分割

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';

const Chat = lazy(() => import('./pages/Chat'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/chat/:sessionId?" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### 2. 虚拟滚动

```typescript
// 对于大量消息使用虚拟滚动
import { FixedSizeList as List } from 'react-window';

export function MessageList({ messages }: MessageListProps) {
  return (
    <List
      height={600}
      itemCount={messages.length}
      itemSize={100}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <Message message={messages[index]} />
        </div>
      )}
    </List>
  );
}
```

### 3. 缓存策略

```typescript
// 使用React Query进行数据缓存
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useChat(sessionId: string) {
  return useQuery({
    queryKey: ['chat', sessionId],
    queryFn: () => getSession(sessionId),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, content }) => sendMessage(sessionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat'] });
    },
  });
}
```

---

## 总结

LocalBot Web端提供了完整的Web界面，支持实时消息交互、会话管理和多语言等功能。

### 主要特性

- ✅ 现代化UI设计
- ✅ 实时消息交互
- ✅ 响应式设计
- ✅ 深色模式支持
- ✅ 多语言支持
- ✅ 用户认证
- ✅ 会话历史管理
- ✅ 技能可视化

### 技术栈

- React 18.x + TypeScript
- Vite构建工具
- Tailwind CSS样式
- Zustand状态管理
- WebSocket实时通信

### 部署选项

- Vercel（推荐）
- Netlify
- Docker
- 自建服务器
