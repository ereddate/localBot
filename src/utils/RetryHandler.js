"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryHandler = void 0;
const Logger_1 = require("./Logger");
class RetryHandler {
    static async execute(fn, config = {}) {
        const finalConfig = { ...this.defaultConfig, ...config };
        let lastError;
        let delay = finalConfig.initialDelay;
        for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
            try {
                if (attempt > 0) {
                    Logger_1.Logger.info(`Retry attempt ${attempt}/${finalConfig.maxRetries} after ${delay}ms`);
                    await this.sleep(delay);
                    delay = Math.min(delay * finalConfig.backoffMultiplier, finalConfig.maxDelay);
                }
                return await fn();
            }
            catch (error) {
                lastError = error;
                Logger_1.Logger.warn(`Attempt ${attempt + 1} failed: ${lastError.message}`);
                if (attempt === finalConfig.maxRetries) {
                    throw lastError;
                }
            }
        }
        throw lastError || new Error('Retry failed');
    }
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static async executeWithFallback(primaryFn, fallbackFn, config = {}) {
        try {
            return await this.execute(primaryFn, config);
        }
        catch (error) {
            Logger_1.Logger.warn('Primary function failed, trying fallback');
            return await fallbackFn();
        }
    }
}
exports.RetryHandler = RetryHandler;
RetryHandler.defaultConfig = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
};
