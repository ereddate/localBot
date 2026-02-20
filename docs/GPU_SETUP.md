# LocalBot - GPU Acceleration Setup Guide

## Prerequisites

To use GPU acceleration with LocalBot, you need to have the following prerequisites installed:

### For NVIDIA GPUs
1. Install the latest NVIDIA drivers for your GPU
2. Install CUDA Toolkit (version 11.8 or later recommended)
3. Install cuDNN library

### For AMD GPUs
1. Install the latest AMD GPU drivers
2. Install ROCm (Radeon Open Compute) platform

### For Intel GPUs
1. Install Intel Arc GPU drivers
2. Install Intel oneAPI toolkit

## Installing Ollama with GPU Support

1. Download and install Ollama from [ollama.ai](https://ollama.ai)
2. Verify GPU support is detected:

```bash
# Check if Ollama detects your GPU
ollama show gpu
```

## Configuring LocalBot for GPU Acceleration

Update your `.env` file with the following settings:

```env
# Set the provider to ollama
LLM_PROVIDER=ollama
DEFAULT_LLM_PROVIDER=ollama

# Ollama configuration
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL_NAME=llama3.2

# GPU configuration
USE_GPU=true
GPU_DEVICE=cuda
GPU_MEMORY_FRACTION=0.8
```

## Environment Variables for GPU Optimization

Before running LocalBot, set these environment variables for optimal GPU usage:

### For NVIDIA GPUs:
```bash
# Enable GPU usage for Ollama
export OLLAMA_NUM_GPU=-1  # Use all available GPU memory
# Or specify a specific amount (e.g., 4GB)
export OLLAMA_NUM_GPU=4

# Additional CUDA optimizations
export CUDA_VISIBLE_DEVICES=0  # Specify GPU device
export PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:128
```

### For AMD GPUs:
```bash
export OLLAMA_NUM_GPU=-1
export HIP_VISIBLE_DEVICES=0
```

### For Intel GPUs:
```bash
export OLLAMA_NUM_GPU=-1
export IGC_EnableAssertToMessageBox=0
```

## Running LocalBot with GPU Acceleration

1. Ensure Ollama is running:
```bash
ollama serve
```

2. In a new terminal, set GPU environment variables and run LocalBot:
```bash
# For NVIDIA
export OLLAMA_NUM_GPU=-1
npm run dev
```

## Testing GPU Acceleration

After running LocalBot, you can verify GPU usage:

1. Monitor GPU usage with nvidia-smi (for NVIDIA):
```bash
watch -n 1 nvidia-smi
```

2. Check LocalBot logs for GPU-related messages:
```
Ollama service initialized {
  apiUrl: 'http://localhost:11434',
  modelName: 'llama3.2',
  gpuEnabled: true,
  gpuDevice: 'cuda',
  gpuMemoryFraction: 0.8
}
```

## Troubleshooting

### Common Issues:

1. **"GPU not detected" error**:
   - Ensure GPU drivers are properly installed
   - Restart Ollama service after driver installation
   - Check that CUDA/ROCm is properly installed

2. **Poor performance**:
   - Verify GPU compute capability is supported
   - Try different models (some are better optimized)
   - Adjust GPU memory fraction in .env file

3. **Out of memory errors**:
   - Reduce GPU memory fraction in .env file
   - Use smaller models
   - Close other GPU-intensive applications

### Verification Steps:
1. Check if Ollama recognizes your GPU: `ollama show gpu`
2. Verify model is running on GPU: `ollama run <model-name>`
3. Monitor GPU usage during inference

## Supported Models for GPU Acceleration

Most models downloaded via Ollama will automatically use GPU acceleration when available. Popular models include:
- llama3.2, llama3.1, llama2
- mistral, mixtral
- phi3, gemma, qwen

## Performance Tips

1. Use quantized models for better performance on consumer hardware
2. Adjust GPU memory fraction based on your VRAM capacity
3. Consider using smaller context sizes for real-time applications
4. Monitor thermal performance during extended usage

With these configurations, LocalBot will leverage your GPU for faster inference with local models through Ollama.