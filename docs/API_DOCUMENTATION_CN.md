# LocalBot API 文档

## API 规范

### 基础URL
所有API端点都以 `/api/v1/` 为前缀，其中 `v1` 代表当前版本。

### 认证
大多数端点需要使用Bearer令牌进行认证：
```
Authorization: Bearer {token}
```

某些端点如健康检查不需要认证。

### 内容类型
所有请求和响应都使用 `application/json` 格式，字符编码为UTF-8。

## 响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "Success message",
  "data": {},
  "timestamp": 1640995200000,
  "requestId": "unique-request-id"
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "Error message",
  "details": "Detailed error information (optional)",
  "timestamp": 1640995200000,
  "requestId": "unique-request-id"
}
```

## 可用端点

### 健康检查
- **GET** `/health`
- 无需认证
- 返回服务健康状态

### 消息处理
- **POST** `/api/v1/message`
- 无需认证
- 处理用户消息并返回AI响应
- **请求体**:
```json
{
  "sessionId": "string",
  "content": "string"
}
```

### 会话管理
- **GET** `/api/v1/session/{sessionId}`
  - 无需认证
  - 获取特定会话信息

- **GET** `/api/v1/sessions`
  - 无需认证
  - 获取所有会话列表

- **DELETE** `/api/v1/session/{sessionId}`
  - 无需认证
  - 关闭特定会话

## 错误代码

| 代码 | 描述 |
|------|------|
| 200 | 成功 |
| 400 | 错误请求 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源未找到 |
| 422 | 验证失败 |
| 500 | 服务器内部错误 |

## 速率限制
- 默认按IP地址进行速率限制
- 根据部署配置可自定义

## 安全注意事项
- 对所有端点进行输入验证
- 输出清理以防止XSS
- 请求大小限制以防止滥用