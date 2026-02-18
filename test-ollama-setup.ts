import { OllamaService } from './src/services/OllamaService';
import { config } from './src/config';
import { Logger } from './src/utils/Logger';

async function testOllamaSetup() {
  console.log('🧪 Testing Ollama Setup...\n');
  
  try {
    const ollamaService = new OllamaService();
    
    // Test connection
    console.log('🔌 Testing connection to Ollama...');
    const isConnected = await ollamaService.checkConnection();
    console.log(isConnected ? '✅ Connection successful' : '❌ Connection failed');
    
    if (!isConnected) {
      console.log('Please make sure Ollama is running at:', config.ollamaApiUrl);
      console.log('Start Ollama with: ollama serve');
      return;
    }
    
    // List available models
    console.log('\n📚 Listing available models...');
    try {
      const modelsResponse = await ollamaService['ollama'].list();
      if (modelsResponse.models && modelsResponse.models.length > 0) {
        console.log('✅ Available models:');
        modelsResponse.models.forEach(model => {
          const marker = model.name === config.ollamaModelName ? ' ← using this' : '';
          console.log(`  - ${model.name}${marker}`);
        });
        
        const modelExists = modelsResponse.models.some(m => 
          m.name === config.ollamaModelName || 
          m.name.startsWith(config.ollamaModelName)
        );
        
        if (!modelExists) {
          console.log(`\n⚠️  Warning: Configured model '${config.ollamaModelName}' not found!`);
          console.log(`💡 Please install it with: ollama pull ${config.ollamaModelName}`);
          console.log('⚡️  Alternatively, change OLLAMA_MODEL_NAME in your .env file');
        }
      } else {
        console.log('📭 No models found. Please install at least one model.');
        console.log('Popular models: ollama pull llama3.2, ollama pull mistral, ollama pull phi3');
      }
    } catch (error) {
      console.error('❌ Failed to list models:', error);
    }
    
    // Test with a fallback model if needed
    console.log('\n🔍 Testing with configured model...');
    try {
      const modelsResponse = await ollamaService['ollama'].list();
      let testModel = config.ollamaModelName;
      let modelExists = false;
      
      if (modelsResponse.models) {
        modelExists = modelsResponse.models.some(m => 
          m.name === testModel || m.name.startsWith(testModel)
        );
        
        // Find an alternative if the configured model doesn't exist
        if (!modelExists) {
          const availableModels = modelsResponse.models;
          if (availableModels.length > 0) {
            testModel = availableModels[0].name;
            console.log(`🔄 Using available model: ${testModel}`);
          }
        }
      }
      
      if (modelExists || modelsResponse.models.length > 0) {
        console.log(`📝 Testing basic chat with model: ${testModel}...`);
        const chatResponse = await ollamaService.chat([
          { role: 'system', content: 'You are a helpful assistant that responds very briefly.' },
          { role: 'user', content: 'Hello, are you working?' }
        ], testModel);
        
        console.log('✅ Test successful!');
        console.log('Response preview:', chatResponse.response.substring(0, 100) + '...');
      } else {
        console.log('❌ Cannot test: no models available');
        console.log(`💡 Install a model with: ollama pull llama3.2`);
      }
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
    
    console.log('\n⚙️  Current Configuration:');
    console.log(`   Provider: ${config.llmProvider}`);
    console.log(`   API URL: ${config.ollamaApiUrl}`);
    console.log(`   Model: ${config.ollamaModelName}`);
    console.log(`   GPU Enabled: ${config.useGpu ? 'Yes' : 'No'}`);
    if (config.useGpu) {
      console.log(`   GPU Device: ${config.gpuDevice}`);
      console.log(`   GPU Memory Fraction: ${config.gpuMemoryFraction}`);
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

// Run the test
testOllamaSetup().catch(console.error);