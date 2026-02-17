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
exports.CodeAnalysisTool = exports.EmailTool = void 0;
const Logger_1 = require("../utils/Logger");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class EmailTool {
    constructor() {
        this.name = 'email_operations';
        this.description = 'Send emails via SMTP (simulated)';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const to = params.to;
            const subject = params.subject;
            const body = params.body;
            const cc = params.cc;
            const bcc = params.bcc;
            if (!operation) {
                return { success: false, error: 'operation is required (send)' };
            }
            switch (operation.toLowerCase()) {
                case 'send':
                    if (!to || !subject || !body) {
                        return { success: false, error: 'to, subject, and body are required for send operation' };
                    }
                    return await this.sendEmail(to, subject, body, cc, bcc);
                default:
                    return { success: false, error: 'Invalid operation. Use: send' };
            }
        }
        catch (error) {
            Logger_1.Logger.error(`Email operation failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
    async sendEmail(to, subject, body, cc, bcc) {
        // Simulate email sending
        Logger_1.Logger.info(`Simulating email sending`, { to, subject, hasCC: !!cc, hasBCC: !!bcc });
        // In a real implementation, this would connect to an SMTP server
        const emailId = `email_${Date.now()}`;
        const timestamp = new Date().toISOString();
        return {
            success: true,
            data: {
                emailId,
                to,
                subject,
                bodyPreview: body.substring(0, 100) + (body.length > 100 ? '...' : ''),
                cc,
                bcc,
                timestamp,
                message: 'Email sent successfully (simulated)'
            }
        };
    }
}
exports.EmailTool = EmailTool;
class CodeAnalysisTool {
    constructor() {
        this.name = 'code_analysis';
        this.description = 'Analyze code for quality, complexity, and vulnerabilities';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const filePath = params.filePath;
            const directory = params.directory;
            const language = params.language;
            if (!operation) {
                return { success: false, error: 'operation is required (analyze, lint, complexity)' };
            }
            switch (operation.toLowerCase()) {
                case 'analyze':
                    if (!filePath && !directory) {
                        return { success: false, error: 'Either filePath or directory is required' };
                    }
                    return await this.analyzeCode(filePath || directory, language);
                case 'lint':
                    if (!filePath && !directory) {
                        return { success: false, error: 'Either filePath or directory is required' };
                    }
                    return await this.lintCode(filePath || directory, language);
                case 'complexity':
                    if (!filePath) {
                        return { success: false, error: 'filePath is required for complexity analysis' };
                    }
                    return await this.analyzeComplexity(filePath);
                default:
                    return { success: false, error: 'Invalid operation. Use: analyze, lint, or complexity' };
            }
        }
        catch (error) {
            Logger_1.Logger.error(`Code analysis operation failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
    async analyzeCode(targetPath, language) {
        try {
            const stat = await fs.stat(targetPath);
            if (stat.isDirectory()) {
                // Analyze all code files in directory
                const files = await this.getCodeFiles(targetPath);
                const analysisResults = [];
                for (const file of files) {
                    const content = await fs.readFile(file, 'utf-8');
                    const fileAnalysis = this.performBasicAnalysis(content, file);
                    analysisResults.push({
                        file,
                        ...fileAnalysis
                    });
                }
                return {
                    success: true,
                    data: {
                        targetPath,
                        type: 'directory',
                        filesAnalyzed: files.length,
                        results: analysisResults,
                        message: `Directory analyzed: ${files.length} code files processed`
                    }
                };
            }
            else {
                // Analyze single file
                const content = await fs.readFile(targetPath, 'utf-8');
                const analysis = this.performBasicAnalysis(content, targetPath);
                return {
                    success: true,
                    data: {
                        targetPath,
                        type: 'file',
                        ...analysis,
                        message: 'File analyzed successfully'
                    }
                };
            }
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async lintCode(targetPath, language) {
        try {
            // Simulate code linting
            const stat = await fs.stat(targetPath);
            let filesToLint = [];
            if (stat.isDirectory()) {
                filesToLint = await this.getCodeFiles(targetPath);
            }
            else {
                filesToLint = [targetPath];
            }
            // Mock linting results
            const lintResults = [];
            for (const file of filesToLint) {
                // In a real implementation, this would run a linter like ESLint, Pylint, etc.
                const issues = this.generateMockIssues(file);
                lintResults.push({
                    file,
                    issues,
                    issueCount: issues.length,
                    errorCount: issues.filter(i => i.severity === 'error').length,
                    warningCount: issues.filter(i => i.severity === 'warning').length
                });
            }
            return {
                success: true,
                data: {
                    targetPath,
                    lintResults,
                    totalIssues: lintResults.reduce((sum, r) => sum + r.issueCount, 0),
                    message: 'Code linting completed (simulated)'
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async analyzeComplexity(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            // Calculate basic complexity metrics
            const lines = content.split('\n');
            const functions = this.extractFunctions(content);
            const avgComplexity = functions.length > 0
                ? functions.reduce((sum, fn) => sum + this.calculateFunctionComplexity(fn.code), 0) / functions.length
                : 0;
            return {
                success: true,
                data: {
                    filePath,
                    linesOfCode: lines.length,
                    functionCount: functions.length,
                    averageComplexity: parseFloat(avgComplexity.toFixed(2)),
                    functions: functions.map(f => ({
                        name: f.name,
                        complexity: this.calculateFunctionComplexity(f.code),
                        lines: f.code.split('\n').length
                    })),
                    message: 'Code complexity analysis completed'
                }
            };
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async getCodeFiles(dirPath) {
        const files = [];
        const items = await fs.readdir(dirPath);
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = await fs.stat(fullPath);
            if (stat.isDirectory()) {
                files.push(...await this.getCodeFiles(fullPath));
            }
            else if (this.isCodeFile(item)) {
                files.push(fullPath);
            }
        }
        return files;
    }
    isCodeFile(filename) {
        const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rb', '.php'];
        const ext = path.extname(filename).toLowerCase();
        return codeExtensions.includes(ext);
    }
    performBasicAnalysis(content, filePath) {
        const lines = content.split('\n');
        const wordCount = content.split(/\s+/).length;
        const charCount = content.length;
        return {
            linesOfCode: lines.length,
            wordCount,
            charCount,
            hasComments: content.includes('//') || content.includes('/*') || content.includes('#'),
            hasFunctions: this.extractFunctions(content).length > 0,
            hasClasses: content.includes('class ') || content.includes('function ')
        };
    }
    extractFunctions(code) {
        // Simple function extraction (would be more sophisticated in practice)
        const functionRegex = /(function\s+(\w+)|const\s+(\w+)\s*=|let\s+(\w+)\s*=|var\s+(\w+)\s*=|(\w+)\s*=\s*function)/g;
        const functions = [];
        let match;
        while ((match = functionRegex.exec(code)) !== null) {
            const name = match[2] || match[3] || match[4] || match[5] || match[6];
            if (name) {
                // This is a simplified extraction - in reality, we'd need a proper parser
                functions.push({ name, code: 'function code snippet' });
            }
        }
        return functions;
    }
    calculateFunctionComplexity(code) {
        // Cyclomatic complexity approximation
        let complexity = 1; // Base complexity
        // Increment for control structures
        complexity += (code.match(/\bif\b/g) || []).length;
        complexity += (code.match(/\belse if\b/g) || []).length;
        complexity += (code.match(/\bfor\b/g) || []).length;
        complexity += (code.match(/\bwhile\b/g) || []).length;
        complexity += (code.match(/\bswitch\b/g) || []).length;
        complexity += (code.match(/\bcase\b/g) || []).length;
        complexity += (code.match(/\&\&\b|\|\|/g) || []).length; // Logical operators
        return complexity;
    }
    generateMockIssues(file) {
        // Generate mock linting issues
        const issues = [];
        const possibleIssues = [
            { line: Math.floor(Math.random() * 50) + 1, severity: 'warning', message: 'Variable declared but not used' },
            { line: Math.floor(Math.random() * 50) + 1, severity: 'error', message: 'Missing semicolon' },
            { line: Math.floor(Math.random() * 50) + 1, severity: 'warning', message: 'Function complexity too high' },
            { line: Math.floor(Math.random() * 50) + 1, severity: 'error', message: 'Unexpected token' }
        ];
        // Randomly pick a few issues
        const numIssues = Math.min(3, possibleIssues.length);
        for (let i = 0; i < numIssues; i++) {
            issues.push(possibleIssues[Math.floor(Math.random() * possibleIssues.length)]);
        }
        return issues;
    }
}
exports.CodeAnalysisTool = CodeAnalysisTool;
