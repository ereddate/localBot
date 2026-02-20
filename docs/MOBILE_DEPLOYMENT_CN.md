# LocalBot 移动平台部署指南（中文版）

本文档介绍如何将LocalBot部署到Android和鸿蒙(HarmonyOS)平台。

## 目录

1. [Android平台部署](#android平台部署)
2. [鸿蒙平台部署](#鸿蒙平台部署)
3. [性能优化](#性能优化)
4. [故障排除](#故障排除)

---

## Android平台部署

### 方案1: 使用Termux（推荐）

Termux是一个在Android设备上运行Linux环境的终端模拟器，无需root权限。

#### 安装步骤

1. **安装Termux**

   ```bash
   # 从F-Droid或Google Play Store安装Termux
   # 推荐使用F-Droid版本（更新更及时）
   ```

2. **更新Termux包管理器**

   ```bash
   pkg update && pkg upgrade -y
   ```

3. **安装Node.js**

   ```bash
   pkg install nodejs -y
   ```

4. **验证安装**

   ```bash
   node -v
   npm -v
   ```

5. **安装Git**

   ```bash
   pkg install git -y
   ```

6. **克隆LocalBot仓库**

   ```bash
   git clone https://github.com/ereddate/localBot.git
   cd localBot
   ```

7. **安装依赖**

   ```bash
   npm install
   ```

8. **配置环境变量**

   ```bash
   cp .env.example .env
   # 编辑.env文件配置API密钥
   ```

9. **编译项目**

   ```bash
   npm run build
   ```

10. **启动LocalBot**

    ```bash
    npm start
    ```

### 方案2: 使用proot-distro（完整Linux环境）

对于需要完整Linux环境的场景，可以使用proot-distro。

#### 安装步骤

1. **安装Termux**（同方案1）

2. **安装proot-distro**

   ```bash
   pkg install proot-distro -y
   ```

3. **安装Ubuntu**

   ```bash
   proot-distro install ubuntu
   ```

4. **登录Ubuntu环境**

   ```bash
   proot-distro login ubuntu
   ```

5. **在Ubuntu中安装Node.js**

   ```bash
   apt update && apt upgrade -y
   apt install -y curl
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt install -y nodejs
   ```

6. **后续步骤**（同方案1步骤6-10）

### 方案3: 使用Termux:API（访问Android系统功能）

Termux:API允许Node.js应用访问Android系统功能。

#### 安装步骤

1. **安装Termux:API**

   ```bash
   # 从F-Droid安装Termux:API应用
   # 在Termux中安装termux-api包
   pkg install termux-api -y
   ```

2. **安装Node.js模块**

   ```bash
   npm install termux-api
   ```

3. **使用示例**

   ```javascript
   const termux = require('termux-api');
   
   // 发送通知
   await termux.notification({
     title: 'LocalBot',
     content: 'Bot已启动'
   });
   
   // 获取电池状态
   const battery = await termux.batteryStatus();
   console.log('Battery:', battery);
   
   // 获取GPS位置
   const location = await termux.location();
   console.log('Location:', location);
   ```

### Android平台特性

| 功能 | 支持情况 | 说明 |
|------|----------|------|
| **CLI模式** | ✅ 完全支持 | 通过Termux终端运行 |
| **API服务器** | ✅ 完全支持 | 需要配置端口转发 |
| **MCP协议** | ✅ 完全支持 | 需要客户端支持 |
| **Telegram** | ✅ 完全支持 | 无需额外配置 |
| **Discord** | ✅ 完全支持 | 无需额外配置 |
| **Slack** | ✅ 完全支持 | 无需额外配置 |
| **WhatsApp** | ⚠️ 部分支持 | 需要浏览器支持 |
| **系统通知** | ✅ 支持 | 通过Termux:API |
| **GPS定位** | ✅ 支持 | 通过Termux:API |
| **文件访问** | ✅ 支持 | 需要权限 |

---

## 鸿蒙平台部署

### 方案1: 使用DevEco Studio + WebView

#### 前置要求

- DevEco Studio 2025
- HarmonyOS SDK 5.0
- Node.js 18.x
- 鸿蒙设备或模拟器

#### 安装步骤

1. **创建鸿蒙项目**

   ```bash
   # 在DevEco Studio中创建新项目
   # 选择Empty Ability模板
   # 配置项目名称和包名
   ```

2. **配置WebView**

   在`src/main/ets/pages/Index.ets`中：

   ```typescript
   import web_webview from '@ohos.web.webview';
   
   @Entry
   @Component
   struct Index {
     controller: web_webview.WebviewController = new web_webview.WebviewController();
     
     build() {
       Column() {
         Web({ src: 'http://localhost:3000', controller: this.controller })
           .domStorageAccess(true)
           .javaScriptAccess(true)
           .fileAccess(true)
           .onPageEnd(() => {
             console.info('Page loaded');
           })
       }
       .width('100%')
       .height('100%')
     }
   }
   ```

3. **配置网络权限**

   在`module.json5`中：

   ```json
   {
     "module": {
       "requestPermissions": [
         {
           "name": "ohos.permission.INTERNET"
         }
       ]
     }
   }
   ```

4. **部署LocalBot服务器**

   ```bash
   # 在本地或远程服务器上部署LocalBot
   npm start
   ```

5. **运行鸿蒙应用**

   ```bash
   # 在DevEco Studio中点击运行按钮
   # 或使用命令行
   hvigorw assembleHap
   ```

### 方案2: 使用Node.js模块（实验性）

鸿蒙系统支持通过Node.js模块扩展功能。

#### 安装步骤

1. **创建Node.js模块项目**

   ```bash
   mkdir localbot-harmonyos
   cd localbot-harmonyos
   npm init -y
   ```

2. **安装鸿蒙Node.js SDK**

   ```bash
   npm install @ohos/nodejs
   ```

3. **创建模块入口**

   ```javascript
   // index.js
   const { spawn } = require('child_process');
   
   module.exports = {
     startLocalBot: async (config) => {
       const bot = spawn('node', ['dist/index.js'], {
         env: {
           ...process.env,
           ...config
         }
       });
       
       return new Promise((resolve, reject) => {
         bot.on('error', reject);
         bot.on('exit', (code) => {
           if (code === 0) resolve();
           else reject(new Error(`Bot exited with code ${code}`));
         });
       });
     }
   };
   ```

4. **集成到鸿蒙应用**

   ```typescript
   import localbot from 'localbot-harmonyos';
   
   @Entry
   @Component
   struct Index {
     async startBot() {
       try {
         await localbot.startLocalBot({
           LLM_PROVIDER: 'ollama',
           OLLAMA_API_URL: 'http://localhost:11434'
         });
       } catch (error) {
         console.error('Failed to start bot:', error);
       }
     }
     
     aboutToAppear() {
       this.startBot();
     }
     
     build() {
       // UI组件
     }
   }
   ```

### 方案3: 使用仓颉语言（推荐）

仓颉是华为推出的鸿蒙原生编程语言。

#### 安装步骤

1. **学习仓颉语言**

   ```cangjie
   // main.cj
   package main
   
   import std.io.*
   import std.net.*
   
   main() {
       println("LocalBot for HarmonyOS")
       
       // 创建HTTP服务器
       let server = HttpServer(3000)
       server.start()
       
       // 处理请求
       server.onRequest { request =>
           let response = processRequest(request)
           request.send(response)
       }
   }
   ```

2. **编译和运行**

   ```bash
   cangjie build
   cangjie run
   ```

### 鸿蒙平台特性

| 功能 | 支持情况 | 说明 |
|------|----------|------|
| **WebView模式** | ✅ 完全支持 | 推荐方案 |
| **Node.js模块** | ⚠️ 实验性 | 需要额外配置 |
| **仓颉语言** | ✅ 完全支持 | 原生开发 |
| **ArkTS** | ✅ 完全支持 | 推荐UI框架 |
| **分布式能力** | ✅ 支持 | 鸿蒙特色 |
| **系统通知** | ✅ 支持 | 原生API |
| **文件访问** | ✅ 支持 | 需要权限 |
| **网络请求** | ✅ 支持 | 需要权限 |

---

## 性能优化

### Android优化

1. **启用GPU加速**

   ```bash
   # 在.env中配置
   USE_GPU=true
   GPU_DEVICE=adreno  # 或mali, depending on device
   ```

2. **使用轻量级模型**

   ```bash
   # 使用更小的模型
   OLLAMA_MODEL_NAME=phi3
   # 或
   OLLAMA_MODEL_NAME=llama3.2:1b
   ```

3. **限制并发请求**

   ```bash
   # 在配置中限制并发数
   MAX_CONCURRENT_REQUESTS=2
   ```

4. **使用Termux优化**

   ```bash
   # 启用Termux优化
   pkg install termux-exec
   ```

### 鸿蒙优化

1. **使用鸿蒙原生API**

   ```typescript
   import abilityAccessCtrl from '@ohos.abilityAccessCtrl';
   
   // 使用原生权限管理
   const atManager = abilityAccessCtrl.createAtManager();
   ```

2. **启用分布式能力**

   ```typescript
   import distributedDeviceManager from '@ohos.distributedDeviceManager';
   
   // 使用分布式设备管理
   const dm = distributedDeviceManager.createDistributedDeviceManager();
   ```

3. **优化WebView性能**

   ```typescript
   Web({ src: 'http://localhost:3000', controller: this.controller })
     .cacheMode(CacheMode.Default)
     .mixedMode(MixedMode.All)
     .zoomAccess(false)
   ```

---

## 故障排除

### Android常见问题

#### 问题1: Termux无法安装Node.js

```bash
# 解决方案: 更新Termux
pkg update && pkg upgrade -y
pkg install nodejs -y
```

#### 问题2: 权限被拒绝

```bash
# 解决方案: 授予Termux存储权限
# 设置 > 应用 > Termux > 权限 > 存储
```

#### 问题3: 端口被占用

```bash
# 解决方案: 使用其他端口
# 在.env中修改
PORT=8080
```

### 鸿蒙常见问题

#### 问题1: WebView无法加载

```typescript
// 解决方案: 配置网络安全
// 在module.json5中添加
{
  "module": {
    "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET"
      },
      {
        "name": "ohos.permission.GET_NETWORK_INFO"
      }
    ]
  }
}
```

#### 问题2: Node.js模块无法加载

```bash
# 解决方案: 使用兼容的Node.js版本
node -v  # 确保版本为18.x
```

---

## 总结

| 平台 | 推荐方案 | 难度 | 性能 | 功能完整度 |
|------|----------|------|------|------------|
| **Android** | Termux | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **鸿蒙** | WebView + ArkTS | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**建议**：
- Android用户：使用Termux方案，简单易用
- 鸿蒙用户：使用WebView + ArkTS方案，充分利用鸿蒙特性
- 开发者：考虑使用仓颉语言进行原生开发
