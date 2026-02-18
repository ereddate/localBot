# GPU 加速使用指南

## 本地运行 LocalBot 的 GPU 加速配置

您已经完成了 LocalBot 的 GPU 加速功能配置，当前的设置如下：

```
# GPU配置
USE_GPU=true
GPU_DEVICE=cuda  # 或 "cuda:0" 指定特定GPU
GPU_MEMORY_FRACTION=0.8  # GPU内存使用比例
```

## 安装 Ollama 并启用 GPU 支持

1. **下载并安装 Ollama**：
   - 访问 [ollama.ai](https://ollama.ai) 下载安装程序
   - 安装完成后，Ollama 会在后台运行

2. **验证 GPU 支持**：
   ```bash
   # 检查 Ollama 是否检测到您的 GPU
   ollama show gpu
   ```

3. **拉取 AI 模型**：
   ```bash
   # 拉取推荐的模型
   ollama pull llama3.2
   # 或者其他支持的模型
   ollama pull mistral
   ```

4. **启动 Ollama 服务**：
   ```bash
   # 在一个终端窗口中启动 Ollama
   ollama serve
   ```

## 启动启用 GPU 加速的 LocalBot

在另一个终端窗口中，设置环境变量并启动 LocalBot：

```bash
# Windows PowerShell
$env:OLLAMA_NUM_GPU="-1"  # 使用所有可用的 GPU 内存
npm run dev
```

或者在启动前设置环境变量：

```bash
# Windows CMD
set OLLAMA_NUM_GPU=-1
npm run dev
```

## 验证 GPU 加速是否正常工作

1. **监控 GPU 使用情况**：
   - 对于 NVIDIA GPU，使用 `nvidia-smi` 命令查看 GPU 使用率
   - 当 LocalBot 处理请求时，您应该能看到 GPU 使用率上升

2. **检查应用日志**：
   - 应用启动时会显示 Ollama 服务初始化信息
   - 包含 GPU 相关配置的详细信息

## 疑难解答

如果遇到问题，请检查：

1. **GPU 驱动程序**：
   - 确保您的 GPU 驱动程序是最新的
   - 对于 NVIDIA GPU，确保安装了 CUDA 兼容的驱动程序

2. **Ollama 版本**：
   - 确保您安装的是支持 GPU 加速的 Ollama 版本

3. **模型兼容性**：
   - 某些模型对 GPU 优化更好，如 llama3、mistral 等

## 性能优化提示

1. **调整内存使用**：
   - 如果您的 GPU 内存有限，可以降低 `GPU_MEMORY_FRACTION` 值
   - 例如：`GPU_MEMORY_FRACTION=0.6`

2. **选择合适的模型**：
   - 较小的模型（如 llama3.2:3b）对 GPU 要求较低
   - 较大的模型（如 llama3:7b）提供更多功能但需要更多资源

3. **批处理大小**：
   - 适当调整批处理大小可以获得更好的性能

## 完整的 .env 示例

```env
# LLM Provider: openai, aliyun, or anthropic
LLM_PROVIDER=ollama

# ollama Configuration
DEFAULT_LLM_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL_NAME=llama3.2

# Configuration
PORT=3000
LOG_LEVEL=info
MEMORY_DIR=./memory
SKILLS_DIR=./skills

# GPU配置
USE_GPU=true
GPU_DEVICE=cuda  # 或 "cuda:0" 指定特定GPU
GPU_MEMORY_FRACTION=0.8  # GPU内存使用比例
```

现在您已经具备了使用 LocalBot GPU 加速的所有配置！只需安装 Ollama 并按照上述步骤操作，就可以享受 GPU 加速带来的快速 AI 推理体验。