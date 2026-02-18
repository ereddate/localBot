# 解决 "model not found" 错误

您遇到的 "model 'llama3.2' not found" 错误是因为 Ollama 中没有安装所需的模型。请按照以下步骤解决问题：

## 快速解决方案

### 1. 检查当前模型
首先，检查您的 .env 文件中配置的模型名称：
```
OLLAMA_MODEL_NAME=llama3.2
```

### 2. 启动 Ollama 服务
打开一个新的终端窗口并运行：
```bash
ollama serve
```

### 3. 安装模型
在另一个终端窗口中安装所需的模型：
```bash
# 安装配置的模型
ollama pull llama3.2

# 或者安装其他模型
ollama pull llama3.1
ollama pull mistral
ollama pull phi3:3b
```

### 4. 验证安装
检查模型是否已正确安装：
```bash
ollama list
```

您应该能看到类似这样的输出：
```
NAME                    SIZE      MODIFIED
llama3.2:latest        4.7 GB    1 hour ago
```

### 5. 重启 LocalBot
安装模型后，重启 LocalBot 应用程序。

## 替代方案

如果您不想安装 llama3.2，可以修改 .env 文件中的模型名称：

```env
OLLAMA_MODEL_NAME=mistral
```

然后安装对应的模型：
```bash
ollama pull mistral
```

## 模型推荐

- **llama3.2** (4.7GB) - 最新的Llama模型，性能良好
- **phi3** (3.8GB) - 微软的小模型，性能不错
- **mistral** (4.1GB) - 开源模型，速度快
- **gemma2** (2.6GB) - Google模型，占用空间较小

安装所需模型后，LocalBot 将能正常使用 Ollama 和 GPU 加速功能。