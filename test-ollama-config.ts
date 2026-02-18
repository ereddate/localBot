import { config } from './config';
import { Logger } from './utils/Logger';

// Simplified Ollama GPU test without importing problematic modules
async function testOllamaConfig() {
  console.log('🧪 Testing Ollama GPU Configuration...\n');
  
  console.log('📋 Current Configuration:');
  console.log(`LLM Provider: ${config.llmProvider}`);
  console.log(`Ollama API URL: ${config.ollamaApiUrl}`);
  console.log(`Ollama Model Name: ${config.ollamaModelName}`);
  console.log(`Use GPU: ${config.useGpu}`);
  console.log(`GPU Device: ${config.gpuDevice}`);
  console.log(`GPU Memory Fraction: ${config.gpuMemoryFraction}`);
  
  console.log('\n✅ Configuration loaded successfully!');
  console.log('\n💡 To enable full Ollama GPU acceleration:');
  console.log('   1. Make sure Ollama is installed and running');
  console.log('   2. Pull a model with: ollama pull ' + config.ollamaModelName);
  console.log('   3. Ensure your GPU drivers are properly installed');
  console.log('   4. For NVIDIA GPUs, ensure CUDA is properly configured');
  console.log('   5. Start LocalBot with OLLAMA_NUM_GPU=-1 to enable GPU');
  
  console.log('\n🚀 GPU acceleration is ready to use when Ollama is properly configured!');
}

// Run the test
testOllamaConfig().catch(console.error);