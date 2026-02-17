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
exports.HashTool = exports.DecryptTool = exports.EncryptTool = void 0;
const Logger_1 = require("../utils/Logger");
const crypto = __importStar(require("crypto"));
class EncryptTool {
    constructor() {
        this.name = 'encrypt_data';
        this.description = 'Encrypt data using AES-256 encryption';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const data = params.data;
            const password = params.password;
            if (!data) {
                return { success: false, error: 'data is required' };
            }
            if (!password) {
                return { success: false, error: 'password is required' };
            }
            // Create a hash of the password to use as the key
            const key = crypto.scryptSync(password, 'salt', 32);
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            // Combine IV and encrypted data
            const result = iv.toString('hex') + ':' + encrypted;
            return {
                success: true,
                data: {
                    encryptedData: result,
                    algorithm: 'AES-256-CBC',
                    message: 'Data encrypted successfully'
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`Encryption failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.EncryptTool = EncryptTool;
class DecryptTool {
    constructor() {
        this.name = 'decrypt_data';
        this.description = 'Decrypt data using AES-256 decryption';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const encryptedData = params.encryptedData;
            const password = params.password;
            if (!encryptedData) {
                return { success: false, error: 'encryptedData is required' };
            }
            if (!password) {
                return { success: false, error: 'password is required' };
            }
            // Split IV and encrypted data
            const parts = encryptedData.split(':');
            if (parts.length !== 2) {
                return { success: false, error: 'Invalid encrypted data format' };
            }
            const ivHex = parts[0];
            const encryptedHex = parts[1];
            const iv = Buffer.from(ivHex, 'hex');
            const key = crypto.scryptSync(password, 'salt', 32);
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return {
                success: true,
                data: {
                    decryptedData: decrypted,
                    algorithm: 'AES-256-CBC',
                    message: 'Data decrypted successfully'
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`Decryption failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.DecryptTool = DecryptTool;
class HashTool {
    constructor() {
        this.name = 'hash_data';
        this.description = 'Generate hash of data using SHA-256';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const data = params.data;
            const algorithm = params.algorithm || 'sha256';
            if (!data) {
                return { success: false, error: 'data is required' };
            }
            const hash = crypto.createHash(algorithm);
            hash.update(data);
            const hashedData = hash.digest('hex');
            return {
                success: true,
                data: {
                    originalDataLength: data.length,
                    hashedData,
                    algorithm,
                    message: 'Data hashed successfully'
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`Hashing failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.HashTool = HashTool;
