import { OllamaService } from './src/services/OllamaService';
import { config } from './src/config';
import { Logger } from './src/utils/Logger';

async function testOllamaGPU() {
  console.log('🧪 Testing Ollama GPU Acceleration...\n');
  
  try {
    const ollamaService = new OllamaService();
    
    // Test connection
    console.log('🔌 Testing connection to Ollama...');
    const isConnected = await ollamaService.checkConnection();
    console.log(isConnected ? '✅ Connection successful' : '❌ Connection failed');
    
    if (!isConnected) {
      console.log('Please make sure Ollama is running at:', config.ollamaApiUrl);
      return;
    }
    
    // Test basic generation
    console.log('\n📝 Testing basic text generation...');
    const response = await ollamaService.generate({
      model: config.ollamaModelName,
      prompt: 'What are the benefits of using local AI models?',
      options: {
        temperature: 0.7,
        num_predict: 100
      }
    });
    
    console.log('✅ Generated response:');
    console.log(response.response.substring(0, 200) + '...');
    
    // Test chat functionality
    console.log('\n💬 Testing chat functionality...');
    const chatResponse = await ollamaService.chat([
      { role: 'system', content: 'You are a helpful assistant that explains technical concepts concisely.' },
      { role: 'user', content: 'Explain GPU acceleration for AI models in 2 sentences.' }
    ]);
    
    console.log('✅ Chat response:');
    console.log(chatResponse.response.substring(0, 200) + '...');
    
    // Get GPU stats
    console.log('\n📊 Getting GPU statistics...');
    const gpuStats = await ollamaService.getGpuStats();
    console.log('✅ GPU Stats:', JSON.stringify(gpuStats, null, 2));
    
    // Get model info
    console.log('\n🔍 Getting model information...');
    const modelInfo = await ollamaService.getModelInfo(config.ollamaModelName);
    console.log('✅ Model Info:', JSON.stringify(modelInfo, null, 2));
    
    console.log('\n🎉 Ollama GPU acceleration test completed successfully!');
    console.log(`🔧 Using model: ${config.ollamaModelName}`);
    console.log(`🎮 GPU Enabled: ${config.useGpu ? 'Yes' : 'No'}`);
    if (config.useGpu) {
      console.log(`🖥️  GPU Device: ${config.gpuDevice}`);
      console.log(`💾 GPU Memory Fraction: ${config.gpuMemoryFraction}`);
    }
  } catch (error) {
    console.error('❌ Error during Ollama GPU test:', error);
  }
}

// Run the test
testOllamaGPU().catch(console.error);