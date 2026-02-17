import { RetryConfig } from '../types';
import { Logger } from './Logger';

export class RetryHandler {
  private static defaultConfig: RetryConfig = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  };

  static async execute<T>(
    fn: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const finalConfig = { ...this.defaultConfig, ...config };
    let lastError: Error | undefined;
    let delay = finalConfig.initialDelay;

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          Logger.info(`Retry attempt ${attempt}/${finalConfig.maxRetries} after ${delay}ms`);
          await this.sleep(delay);
          delay = Math.min(delay * finalConfig.backoffMultiplier, finalConfig.maxDelay);
        }

        return await fn();
      } catch (error) {
        lastError = error as Error;
        Logger.warn(`Attempt ${attempt + 1} failed: ${lastError.message}`);

        if (attempt === finalConfig.maxRetries) {
          throw lastError;
        }
      }
    }

    throw lastError || new Error('Retry failed');
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async executeWithFallback<T>(
    primaryFn: () => Promise<T>,
    fallbackFn: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    try {
      return await this.execute(primaryFn, config);
    } catch (error) {
      Logger.warn('Primary function failed, trying fallback');
      return await fallbackFn();
    }
  }
}
