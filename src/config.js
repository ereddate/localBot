"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.config = {
    llmProvider: process.env.LLM_PROVIDER || 'openai',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    aliyunApiKey: process.env.ALIYUN_API_KEY || '',
    aliyunModel: process.env.ALIYUN_MODEL || 'qwen-plus',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    baiduApiKey: process.env.BAIDU_API_KEY || '',
    baiduSecretKey: process.env.BAIDU_SECRET_KEY || '',
    tencentApiKey: process.env.TENCENT_API_KEY || '',
    zhipuApiKey: process.env.ZHIPU_API_KEY || '',
    siliconcloudApiKey: process.env.SILICONCLOUD_API_KEY || '',
    port: parseInt(process.env.PORT || '3000', 10),
    logLevel: process.env.LOG_LEVEL || 'info',
    memoryDir: process.env.MEMORY_DIR || './memory',
    skillsDir: process.env.SKILLS_DIR || './skills',
};
