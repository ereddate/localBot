---
name: web-development
description: Web开发技能 - 用于创建React/Vue组件、生成前端代码和搭建项目结构
emoji: 🌐
category: development
version: 1.0.0
author: LocalBot Team
requires:
  bins: []
  env: []
---

# Web开发技能 🌐

## 何时使用
- 需要创建React/Vue组件时
- 需要搭建前端项目结构时
- 需要生成HTML/CSS/JavaScript代码时
- 需要创建样式文件时
- 需要编写前端工具函数时

## 何时不使用
- 需要完整的全栈应用开发
- 需要复杂的UI/UX设计
- 需要数据库设计和后端API

## 输出格式
- 组件代码（.tsx, .vue, .jsx等）
- 样式文件（.css, .scss, .less）
- 工具函数和类型定义
- 项目配置文件

## 使用流程
1. 了解需求和技术栈
2. 设计组件结构和接口
3. 编写组件代码
4. 创建样式文件
5. 添加类型定义和工具函数
6. 使用 `file_write` 保存文件

## 示例场景

### 场景1：创建React组件
用户请求："创建一个用户列表组件"
执行步骤：
1. 定义组件接口（Props和State）
2. 编写组件逻辑
3. 添加样式
4. 创建类型定义文件
5. 保存为UserList.tsx

### 场景2：搭建项目结构
用户请求："帮我搭建一个React项目结构"
执行步骤：
1. 创建基础目录结构
2. 生成package.json配置
3. 创建入口文件
4. 设置路由配置
5. 添加基础样式

### 场景3：生成样式文件
用户请求："创建一个响应式导航栏样式"
执行步骤：
1. 设计导航栏布局
2. 编写CSS样式
3. 添加响应式媒体查询
4. 保存为styles.css

## 工具依赖
- `file_read`: 读取现有代码文件
- `file_write`: 写入新代码文件
- `file_list`: 查看项目结构
- `text_analysis`: 分析代码模式
- `json_write`: 生成配置文件

## 注意事项
- 遵循代码规范和最佳实践
- 使用适当的命名约定
- 添加必要的注释
- 考虑组件的可重用性
- 确保代码类型安全

## 最佳实践
- 使用函数式组件和Hooks
- 实现适当的错误处理
- 添加PropTypes或TypeScript类型
- 编写可测试的代码
- 优化性能（避免不必要的重渲染）
- 使用语义化HTML
- 确保可访问性
