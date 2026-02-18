import { Ollama } from 'ollama';
import { config } from '../config';
import { Logger } from '../utils/Logger';

export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    num_ctx?: number;
    num_predict?: number;
    top_p?: number;
    top_k?: number;
    repeat_penalty?: number;
  };
}

export interface OllamaResponse {
  response: string;
  model: string;
  created_at: string;
  done: boolean;
}

export class OllamaService {
  private ollama: Ollama;
  private gpuEnabled: boolean;
  private gpuDevice: string;
  private gpuMemoryFraction: number;

  constructor() {
    this.ollama = new Ollama({ host: config.ollamaApiUrl });
    this.gpuEnabled = config.useGpu;
    this.gpuDevice = config.gpuDevice;
    this.gpuMemoryFraction = config.gpuMemoryFraction;

    Logger.info('Ollama service initialized', {
      apiUrl: config.ollamaApiUrl,
      modelName: config.ollamaModelName,
      gpuEnabled: this.gpuEnabled,
      gpuDevice: this.gpuDevice,
      gpuMemoryFraction: this.gpuMemoryFraction
    });
  }

  /**
   * Checks if the Ollama server is available
   */
  async checkConnection(): Promise<boolean> {
    try {
      // Try to ping the server by listing models
      const models = await this.ollama.list();
      Logger.info('Ollama connection successful', { modelCount: models.models.length });
      return true;
    } catch (error) {
      Logger.error('Ollama connection failed', { error: (error as Error).message });
      return false;
    }
  }

  /**
   * Sends a request to the Ollama API
   */
  async generate(request: OllamaRequest): Promise<OllamaResponse> {
    try {
      Logger.debug('Sending request to Ollama', { 
        model: request.model, 
        promptLength: request.prompt.length,
        gpuEnabled: this.gpuEnabled
      });

      // Note: Ollama handles GPU acceleration internally through its native backend
      // The GPU configuration is managed by the Ollama server itself
      const startTime = Date.now();
      const response = await this.ollama.generate({
        model: request.model,
        prompt: request.prompt,
        stream: request.stream || false,
        options: {
          ...request.options,
          // These options may help with GPU utilization
          num_gpu: this.gpuEnabled ? -1 : 0, // Use all GPUs if available and enabled
          ...request.options
        }
      });

      const duration = Date.now() - startTime;
      Logger.debug('Ollama response received', { 
        duration: `${duration}ms`,
        responseLength: response.response.length
      });

      return response as OllamaResponse;
    } catch (error) {
      Logger.error('Ollama request failed', { 
        error: (error as Error).message,
        model: request.model
      });
      throw error;
    }
  }

  /**
   * Performs a chat completion using Ollama
   */
  async chat(messages: Array<{ role: string; content: string }>, model?: string): Promise<OllamaResponse> {
    try {
      Logger.debug('Sending chat request to Ollama', { 
        messageCount: messages.length,
        model: model || config.ollamaModelName
      });

      const startTime = Date.now();
      const response = await this.ollama.chat({
        model: model || config.ollamaModelName,
        messages: messages,
        options: {
          num_gpu: this.gpuEnabled ? -1 : 0, // Use all GPUs if available and enabled
          temperature: 0.7,
          top_p: 0.9,
        }
      });

      const duration = Date.now() - startTime;
      Logger.debug('Ollama chat response received', { 
        duration: `${duration}ms`,
        responseLength: response.message?.content?.length || 0
      });

      // Convert chat response to standard response format
      return {
        response: response.message?.content || '',
        model: response.model,
        created_at: response.created_at,
        done: response.done
      };
    } catch (error) {
      Logger.error('Ollama chat request failed', { 
        error: (error as Error).message,
        model: model || config.ollamaModelName
      });
      throw error;
    }
  }

  /**
   * Gets GPU usage statistics from Ollama
   */
  async getGpuStats(): Promise<any> {
    // Note: Ollama doesn't directly expose GPU stats through the API
    // This is a placeholder for future implementation if Ollama adds this capability
    return {
      gpuEnabled: this.gpuEnabled,
      gpuDevice: this.gpuDevice,
      gpuMemoryFraction: this.gpuMemoryFraction,
      // Additional GPU stats would go here when available
    };
  }

  /**
   * Gets model information
   */
  async getModelInfo(model: string): Promise<any> {
    try {
      const models = await this.ollama.list();
      const modelInfo = models.models.find(m => m.name === model);
      
      if (!modelInfo) {
        throw new Error(`Model ${model} not found in Ollama`);
      }

      return modelInfo;
    } catch (error) {
      Logger.error('Failed to get model info', { error: (error as Error).message });
      throw error;
    }
  }
}