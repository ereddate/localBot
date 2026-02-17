"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordGeneratorTool = void 0;
const Logger_1 = require("../utils/Logger");
class PasswordGeneratorTool {
    constructor() {
        this.name = 'password_generator';
        this.description = '生成安全的密码';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const length = params.length ? parseInt(params.length) : 12;
            const includeUppercase = params.includeUppercase !== undefined ? Boolean(params.includeUppercase) : true;
            const includeLowercase = params.includeLowercase !== undefined ? Boolean(params.includeLowercase) : true;
            const includeNumbers = params.includeNumbers !== undefined ? Boolean(params.includeNumbers) : true;
            const includeSymbols = params.includeSymbols !== undefined ? Boolean(params.includeSymbols) : true;
            const count = params.count ? parseInt(params.count) : 1;
            if (length < 4 || length > 128) {
                return { success: false, error: 'Password length must be between 4 and 128 characters' };
            }
            if (count < 1 || count > 10) {
                return { success: false, error: 'Password count must be between 1 and 10' };
            }
            // 构建字符集
            let charset = '';
            if (includeUppercase)
                charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (includeLowercase)
                charset += 'abcdefghijklmnopqrstuvwxyz';
            if (includeNumbers)
                charset += '0123456789';
            if (includeSymbols)
                charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
            if (!charset) {
                return { success: false, error: 'At least one character type must be selected' };
            }
            const passwords = [];
            for (let i = 0; i < count; i++) {
                let password = '';
                // 确保至少包含每种类型的至少一个字符
                if (includeUppercase)
                    password += this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
                if (includeLowercase)
                    password += this.getRandomChar('abcdefghijklmnopqrstuvwxyz');
                if (includeNumbers)
                    password += this.getRandomChar('0123456789');
                if (includeSymbols)
                    password += this.getRandomChar('!@#$%^&*()_+-=[]{}|;:,.<>?');
                // 填充剩余长度
                for (let j = password.length; j < length; j++) {
                    password += this.getRandomChar(charset);
                }
                // 打乱密码字符顺序
                password = this.shuffleString(password);
                passwords.push(password);
            }
            return {
                success: true,
                data: {
                    passwords,
                    length,
                    options: {
                        includeUppercase,
                        includeLowercase,
                        includeNumbers,
                        includeSymbols,
                        count
                    }
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error('Password generator tool error', { error: error.message });
            return { success: false, error: `Failed to generate password: ${error.message}` };
        }
    }
    getRandomChar(str) {
        const randomIndex = Math.floor(Math.random() * str.length);
        return str[randomIndex];
    }
    shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }
}
exports.PasswordGeneratorTool = PasswordGeneratorTool;
