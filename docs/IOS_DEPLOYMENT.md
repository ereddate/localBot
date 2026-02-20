# LocalBot iOS平台部署指南

本文档介绍如何将LocalBot部署到iOS平台。

## 目录

1. [概述](#概述)
2. [部署方案](#部署方案)
3. [方案1: React Native](#方案1-react-native)
4. [方案2: Ionic](#方案2-ionic)
5. [方案3: Capacitor](#方案3-capacitor)
6. [方案4: PWA](#方案4-pwa)
7. [性能优化](#性能优化)
8. [故障排除](#故障排除)

---

## 概述

iOS是Apple公司的移动操作系统，LocalBot可以通过多种方式部署到iOS设备上。

### 支持的iOS版本

- iOS 14.0及以上
- iPhone 6s及以上
- iPad Air 2及以上
- iPad mini 4及以上

---

## 部署方案

| 方案 | 难度 | 推荐度 | 说明 |
|------|------|--------|------|
| **React Native** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 原生性能，跨平台 |
| **Ionic** | ⭐⭐⭐ | ⭐⭐⭐⭐ | Web技术，快速开发 |
| **Capacitor** | ⭐⭐⭐ | ⭐⭐⭐⭐ | 现有Web应用打包 |
| **PWA** | ⭐⭐ | ⭐⭐⭐ | 无需App Store |

---

## 方案1: React Native

### 前置要求

- macOS 12.0及以上
- Xcode 14.0及以上
- Node.js 18.x
- CocoaPods
- iOS设备或模拟器

### 安装步骤

1. **安装React Native CLI**

   ```bash
   npm install -g react-native-cli
   ```

2. **创建React Native项目**

   ```bash
   npx react-native@latest init LocalBot
   cd LocalBot
   ```

3. **安装依赖**

   ```bash
   npm install @react-navigation/native @react-navigation/stack
   npm install react-native-safe-area-context react-native-screens
   npm install axios react-native-webview
   ```

4. **配置iOS项目**

   ```bash
   cd ios
   pod install
   cd ..
   ```

5. **创建主界面**

   在`App.tsx`中：

   ```typescript
   import React from 'react';
   import { NavigationContainer } from '@react-navigation/native';
   import { createStackNavigator } from '@react-navigation/stack';
   import { WebView } from 'react-native-webview';
   import { SafeAreaView, StyleSheet, View } from 'react-native';

   const Stack = createStackNavigator();

   function HomeScreen({ navigation }) {
     return (
       <SafeAreaView style={styles.container}>
         <WebView
           source={{ uri: 'http://localhost:3000' }}
           style={styles.webview}
           javaScriptEnabled={true}
           domStorageEnabled={true}
           startInLoadingState={true}
           scalesPageToFit={true}
         />
       </SafeAreaView>
     );
   }

   function App() {
     return (
       <NavigationContainer>
         <Stack.Navigator>
           <Stack.Screen
             name="Home"
             component={HomeScreen}
             options={{ title: 'LocalBot' }}
           />
         </Stack.Navigator>
       </NavigationContainer>
     );
   }

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: '#fff',
     },
     webview: {
       flex: 1,
     },
   });

   export default App;
   ```

6. **运行iOS应用**

   ```bash
   # 使用模拟器
   npx react-native run-ios

   # 使用真机
   npx react-native run-ios --device
   ```

7. **配置Info.plist**

   在`ios/LocalBot/Info.plist`中添加：

   ```xml
   <key>NSAppTransportSecurity</key>
   <dict>
     <key>NSAllowsArbitraryLoads</key>
     <true/>
     <key>NSAllowsLocalNetworking</key>
     <true/>
   </dict>
   ```

### iOS特性

| 功能 | 支持情况 | 说明 |
|------|----------|------|
| **WebView** | ✅ 完全支持 | 通过react-native-webview |
| **推送通知** | ✅ 支持 | 通过react-native-push-notification |
| **后台运行** | ✅ 支持 | 需要配置Background Modes |
| **文件访问** | ✅ 支持 | 需要权限配置 |
| **相机/相册** | ✅ 支持 | 需要权限配置 |

---

## 方案2: Ionic

### 前置要求

- Node.js 18.x
- Ionic CLI
- Cordova
- iOS设备或模拟器

### 安装步骤

1. **安装Ionic CLI**

   ```bash
   npm install -g @ionic/cli
   ```

2. **创建Ionic项目**

   ```bash
   ionic start localbot-ios tabs --type=react
   cd localbot-ios
   ```

3. **添加iOS平台**

   ```bash
   ionic capacitor add ios
   ```

4. **创建主界面**

   在`src/pages/Home.tsx`中：

   ```typescript
   import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
   import { IonReactRouter } from '@ionic/react-router';
   import { Route, Redirect } from 'react-router-dom';

   const Home: React.FC = () => {
     return (
       <IonPage>
         <IonHeader>
           <IonToolbar>
             <IonTitle>LocalBot</IonTitle>
           </IonToolbar>
         </IonHeader>
         <IonContent>
           <iframe
             src="http://localhost:3000"
             style={{ width: '100%', height: '100%', border: 'none' }}
           />
         </IonContent>
       </IonPage>
     );
   };

   export default Home;
   ```

5. **运行iOS应用**

   ```bash
   # 使用模拟器
   ionic capacitor run ios

   # 使用真机
   ionic capacitor run ios --external
   ```

6. **构建生产版本**

   ```bash
   ionic capacitor build ios
   ```

### Ionic特性

| 功能 | 支持情况 | 说明 |
|------|----------|------|
| **WebView** | ✅ 完全支持 | 通过iframe |
| **推送通知** | ✅ 支持 | 通过@capacitor/push-notifications |
| **后台运行** | ✅ 支持 | 需要配置Background Modes |
| **文件访问** | ✅ 支持 | 通过@capacitor/filesystem |
| **相机/相册** | ✅ 支持 | 通过@capacitor/camera |

---

## 方案3: Capacitor

### 前置要求

- 现有的Web应用
- Node.js 18.x
- Capacitor CLI
- Xcode 14.0及以上

### 安装步骤

1. **安装Capacitor**

   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/ios
   npx cap init
   ```

2. **配置Capacitor**

   在`capacitor.config.json`中：

   ```json
   {
     "appId": "com.localbot.app",
     "appName": "LocalBot",
     "webDir": "dist",
     "bundledWebRuntime": false,
     "server": {
       "url": "http://localhost:3000",
       "cleartext": true
     }
   }
   ```

3. **添加iOS平台**

   ```bash
   npx cap add ios
   ```

4. **同步资源**

   ```bash
   npx cap sync ios
   ```

5. **运行iOS应用**

   ```bash
   # 使用模拟器
   npx cap open ios

   # 或直接运行
   npx cap run ios
   ```

6. **配置权限**

   在`ios/App/App/Info.plist`中添加：

   ```xml
   <key>NSCameraUsageDescription</key>
   <string>需要相机权限</string>
   <key>NSPhotoLibraryUsageDescription</key>
   <string>需要相册权限</string>
   <key>NSMicrophoneUsageDescription</key>
   <string>需要麦克风权限</string>
   ```

### Capacitor特性

| 功能 | 支持情况 | 说明 |
|------|----------|------|
| **WebView** | ✅ 完全支持 | 原生WebView |
| **推送通知** | ✅ 支持 | 通过@capacitor/push-notifications |
| **后台运行** | ✅ 支持 | 需要配置Background Modes |
| **文件访问** | ✅ 支持 | 通过@capacitor/filesystem |
| **相机/相册** | ✅ 支持 | 通过@capacitor/camera |

---

## 方案4: PWA

### 前置要求

- iOS 11.3及以上
- HTTPS服务器

### 安装步骤

1. **创建PWA清单**

   创建`public/manifest.json`：

   ```json
   {
     "name": "LocalBot",
     "short_name": "LocalBot",
     "description": "Local AI Assistant",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#000000",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

2. **创建Service Worker**

   创建`public/sw.js`：

   ```javascript
   const CACHE_NAME = 'localbot-v1';
   const urlsToCache = ['/', '/manifest.json'];

   self.addEventListener('install', (event) => {
     event.waitUntil(
       caches.open(CACHE_NAME).then((cache) => {
         return cache.addAll(urlsToCache);
       })
     );
   });

   self.addEventListener('fetch', (event) => {
     event.respondWith(
       caches.match(event.request).then((response) => {
         return response || fetch(event.request);
       })
     );
   });
   ```

3. **注册Service Worker**

   在HTML中：

   ```html
   <script>
     if ('serviceWorker' in navigator) {
       navigator.serviceWorker.register('/sw.js');
     }
   </script>
   ```

4. **添加到主屏幕**

   在iOS Safari中：
   - 访问LocalBot网站
   - 点击分享按钮
   - 选择"添加到主屏幕"

### PWA特性

| 功能 | 支持情况 | 说明 |
|------|----------|------|
| **离线支持** | ✅ 支持 | 通过Service Worker |
| **推送通知** | ⚠️ 部分支持 | iOS限制较多 |
| **后台运行** | ❌ 不支持 | iOS限制 |
| **文件访问** | ✅ 支持 | 通过File API |
| **相机/相册** | ✅ 支持 | 通过MediaDevices API |

---

## 性能优化

### 1. WebView优化

```typescript
// React Native
<WebView
  source={{ uri: 'http://localhost:3000' }}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  startInLoadingState={true}
  scalesPageToFit={true}
  cacheEnabled={true}
  mixedContentMode="compatibility"
/>
```

### 2. 内存管理

```typescript
// 清理WebView内存
useEffect(() => {
  return () => {
    // 组件卸载时清理
  };
}, []);
```

### 3. 网络优化

```typescript
// 使用缓存
const cache = new Map();

async function fetchData(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, data);
  return data;
}
```

---

## 故障排除

### 问题1: WebView无法加载

```bash
# 解决方案: 配置App Transport Security
# 在Info.plist中添加NSAppTransportSecurity配置
```

### 问题2: 推送通知不工作

```bash
# 解决方案: 检查推送证书
# 确保APNs证书正确配置
# 检查设备Token是否有效
```

### 问题3: 后台运行被终止

```bash
# 解决方案: 配置Background Modes
# 在Info.plist中添加UIBackgroundModes
# 使用Background Fetch或Background Processing
```

### 问题4: PWA无法安装

```bash
# 解决方案: 检查HTTPS配置
# 确保使用HTTPS
# 检查manifest.json格式
# 验证Service Worker注册
```

---

## 总结

| 方案 | 推荐度 | 优势 | 劣势 |
|------|--------|------|------|
| **React Native** | ⭐⭐⭐⭐ | 原生性能、跨平台 | 开发复杂度高 |
| **Ionic** | ⭐⭐⭐⭐ | 快速开发、Web技术 | 性能略低于原生 |
| **Capacitor** | ⭐⭐⭐⭐ | 现有Web应用打包 | 需要Web应用基础 |
| **PWA** | ⭐⭐⭐ | 无需App Store、快速部署 | 功能受限、iOS限制多 |

**推荐方案**：
- **新项目**: Ionic（快速开发）
- **现有Web应用**: Capacitor（最小改动）
- **追求性能**: React Native（原生体验）
- **快速部署**: PWA（无需审核）
