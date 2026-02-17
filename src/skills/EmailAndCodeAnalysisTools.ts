import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';

export class EmailTool implements Tool {
  name = 'email_operations';
  description = 'Send emails via SMTP (simulated)';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const operation = params.operation as string;
      const to = params.to as string;
      const subject = params.subject as string;
      const body = params.body as string;
      const cc = params.cc as string;
      const bcc = params.bcc as string;

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
    } catch (error) {
      Logger.error(`Email operation failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }

  private async sendEmail(
    to: string, 
    subject: string, 
    body: string, 
    cc?: string, 
    bcc?: string
  ): Promise<ToolResult> {
    // Simulate email sending
    Logger.info(`Simulating email sending`, { to, subject, hasCC: !!cc, hasBCC: !!bcc });

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

export class CodeAnalysisTool implements Tool {
  name = 'code_analysis';
  description = 'Analyze code for quality, complexity, and vulnerabilities';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const operation = params.operation as string;
      const filePath = params.filePath as string;
      const directory = params.directory as string;
      const language = params.language as string;

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
    } catch (error) {
      Logger.error(`Code analysis operation failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }

  private async analyzeCode(targetPath: string, language?: string): Promise<ToolResult> {
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
      } else {
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
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async lintCode(targetPath: string, language?: string): Promise<ToolResult> {
    try {
      // Simulate code linting
      const stat = await fs.stat(targetPath);
      let filesToLint: string[] = [];
      
      if (stat.isDirectory()) {
        filesToLint = await this.getCodeFiles(targetPath);
      } else {
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
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async analyzeComplexity(filePath: string): Promise<ToolResult> {
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
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async getCodeFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...await this.getCodeFiles(fullPath));
      } else if (this.isCodeFile(item)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private isCodeFile(filename: string): boolean {
    const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rb', '.php'];
    const ext = path.extname(filename).toLowerCase();
    return codeExtensions.includes(ext);
  }

  private performBasicAnalysis(content: string, filePath: string): any {
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

  private extractFunctions(code: string): Array<{name: string, code: string}> {
    // Simple function extraction (would be more sophisticated in practice)
    const functionRegex = /(function\s+(\w+)|const\s+(\w+)\s*=|let\s+(\w+)\s*=|var\s+(\w+)\s*=|(\w+)\s*=\s*function)/g;
    const functions: Array<{name: string, code: string}> = [];
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

  private calculateFunctionComplexity(code: string): number {
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

  private generateMockIssues(file: string): Array<{line: number, severity: string, message: string}> {
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