// types/ollama.d.ts
declare module 'ollama' {
  export interface OllamaConfig {
    host?: string;
    timeout?: number;
  }

  export interface GenerateRequest {
    model: string;
    prompt: string;
    system?: string;
    template?: string;
    context?: number[];
    stream?: boolean;
    raw?: boolean;
    format?: string;
    keep_alive?: string | number;
    images?: Uint8Array[];
    options?: Partial<GenerationOptions>;
  }

  export interface ChatRequest {
    model: string;
    messages: Message[];
    stream?: boolean;
    format?: string;
    keep_alive?: string | number;
    options?: Partial<GenerationOptions>;
  }

  export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    images?: Uint8Array[];
  }

  export interface GenerationOptions {
    numa: boolean;
    num_ctx: number;
    num_batch: number;
    num_gpu: number;
    main_gpu: number;
    low_vram: boolean;
    f16_kv: boolean;
    logits_all: boolean;
    vocab_only: boolean;
    use_mmap: boolean;
    use_mlock: boolean;
    embedding_only: boolean;
    rope_frequency_base: number;
    rope_frequency_scale: number;
    num_thread: number;
    // Sampling parameters
    temperature: number;
    repeat_last_n: number;
    repeat_penalty: number;
    presence_penalty: number;
    frequency_penalty: number;
    tfs_z: number;
    typical_p: number;
    top_p: number;
    top_k: number;
    min_p: number;
    mirostat: boolean;
    mirostat_tau: number;
    mirostat_eta: number;
    penalize_newline: boolean;
    seed: number;
  }

  export interface GenerateResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    total_duration?: number;
    load_duration?: number;
    sample_count?: number;
    sample_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
  }

  export interface ChatResponse {
    model: string;
    created_at: string;
    message: Message;
    done: boolean;
    total_duration?: number;
    load_duration?: number;
    sample_count?: number;
    sample_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
  }

  export interface ListResponse {
    models: Array<{
      name: string;
      model: string;
      modified_at: string;
      size: number;
      digest: string;
      details: {
        parent_model: string;
        format: string;
        family: string;
        families: string[];
        parameter_size: string;
        quantization_level: string;
      };
    }>;
  }

  export class Ollama {
    constructor(config?: OllamaConfig);
    generate(request: GenerateRequest): Promise<GenerateResponse>;
    chat(request: ChatRequest): Promise<ChatResponse>;
    list(): Promise<ListResponse>;
    pull(model: string): Promise<any>;
    push(model: string): Promise<any>;
    delete(model: string): Promise<any>;
    copy(source: string, dest: string): Promise<any>;
    show(model: string): Promise<any>;
  }

  // Export the Ollama class as the default export
  const ollama: typeof Ollama;
  export default ollama;
}