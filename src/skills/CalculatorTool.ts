import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

export class CalculatorTool implements Tool {
  name = 'calculator';
  description = '高级计算器，支持基本运算和数学函数';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const expression = params.expression as string;
      const operation = params.operation as string;
      const operands = params.operands as number[];

      if (!expression && !operation) {
        return { success: false, error: 'Either expression or operation with operands is required' };
      }

      let result: number;

      if (expression) {
        // 安全的表达式计算 - 只允许数字和基本运算符
        const sanitizedExpression = expression.replace(/[^0-9+\-*/().\s]/g, '');
        
        if (sanitizedExpression !== expression) {
          return { success: false, error: 'Invalid characters in expression' };
        }

        try {
          // 使用Function构造器的安全替代方案，手动解析表达式
          result = this.evaluateExpression(sanitizedExpression);
        } catch (evalError) {
          return { success: false, error: `Invalid expression: ${evalError}` };
        }
      } else if (operation && operands && operands.length >= 1) {
        switch (operation.toLowerCase()) {
          case 'add':
          case '+':
            result = operands.reduce((sum, num) => sum + num, 0);
            break;
          case 'subtract':
          case '-':
            result = operands.reduce((diff, num, idx) => idx === 0 ? num : diff - num);
            break;
          case 'multiply':
          case '*':
            result = operands.reduce((prod, num) => prod * num, 1);
            break;
          case 'divide':
          case '/':
            if (operands.some(num => num === 0)) {
              return { success: false, error: 'Division by zero' };
            }
            result = operands.reduce((div, num, idx) => idx === 0 ? num : div / num);
            break;
          case 'power':
          case '**':
            if (operands.length !== 2) {
              return { success: false, error: 'Power operation requires exactly 2 operands' };
            }
            result = Math.pow(operands[0], operands[1]);
            break;
          case 'sqrt':
            if (operands.length !== 1) {
              return { success: false, error: 'Square root operation requires exactly 1 operand' };
            }
            if (operands[0] < 0) {
              return { success: false, error: 'Cannot calculate square root of negative number' };
            }
            result = Math.sqrt(operands[0]);
            break;
          case 'percentage':
            if (operands.length !== 2) {
              return { success: false, error: 'Percentage operation requires exactly 2 operands' };
            }
            result = (operands[0] / 100) * operands[1];
            break;
          default:
            return { success: false, error: `Unsupported operation: ${operation}` };
        }
      } else {
        return { success: false, error: 'Invalid parameters' };
      }

      return {
        success: true,
        data: {
          expression: expression || `${operation}(${operands?.join(', ')})`,
          result,
          formattedResult: this.formatNumber(result)
        }
      };
    } catch (error) {
      Logger.error('Calculator tool error', { error: (error as Error).message });
      return { success: false, error: `Calculation failed: ${(error as Error).message}` };
    }
  }

  private evaluateExpression(expr: string): number {
    // 简单的安全表达式求值器
    // 移除空格
    expr = expr.replace(/\s/g, '');
    
    // 检查是否只包含允许的字符
    if (!/^[\d+\-*/.()]+$/.test(expr)) {
      throw new Error('Invalid characters in expression');
    }

    // 检查括号匹配
    const stack: string[] = [];
    for (const char of expr) {
      if (char === '(') {
        stack.push(char);
      } else if (char === ')') {
        if (stack.length === 0) {
          throw new Error('Mismatched parentheses');
        }
        stack.pop();
      }
    }
    if (stack.length !== 0) {
      throw new Error('Mismatched parentheses');
    }

    // 使用Function构造器进行安全评估
    // 注意：在生产环境中应使用更安全的表达式解析器
    try {
      // 禁止使用某些危险函数
      if (/[a-zA-Z]{4,}/.test(expr)) {  // 简单防止函数调用
        throw new Error('Function calls not allowed');
      }
      
      // 限制计算复杂度
      if (expr.length > 100) {
        throw new Error('Expression too complex');
      }

      // 简单的表达式计算实现
      return this.simpleEval(expr);
    } catch (e) {
      throw e;
    }
  }

  private simpleEval(expr: string): number {
    // 简单的递归下降解析器
    let index = 0;

    const parseNumber = (): number => {
      let numStr = '';
      while (index < expr.length && /\d|\./.test(expr[index])) {
        numStr += expr[index];
        index++;
      }
      if (numStr === '') {
        throw new Error('Expected number');
      }
      return parseFloat(numStr);
    };

    const parseFactor = (): number => {
      if (expr[index] === '(') {
        index++; // skip '('
        const result = parseExpression();
        if (expr[index] !== ')') {
          throw new Error('Expected )');
        }
        index++; // skip ')'
        return result;
      } else {
        return parseNumber();
      }
    };

    const parseTerm = (): number => {
      let result = parseFactor();
      while (index < expr.length && (expr[index] === '*' || expr[index] === '/')) {
        const op = expr[index];
        index++; // skip operator
        const factor = parseFactor();
        if (op === '*') {
          result *= factor;
        } else {
          if (factor === 0) {
            throw new Error('Division by zero');
          }
          result /= factor;
        }
      }
      return result;
    };

    const parseExpression = (): number => {
      let result = parseTerm();
      while (index < expr.length && (expr[index] === '+' || expr[index] === '-')) {
        const op = expr[index];
        index++; // skip operator
        const term = parseTerm();
        if (op === '+') {
          result += term;
        } else {
          result -= term;
        }
      }
      return result;
    };

    const result = parseExpression();
    if (index !== expr.length) {
      throw new Error('Unexpected character');
    }
    return result;
  }

  private formatNumber(num: number): string {
    // 格式化数字，避免浮点数精度问题
    return parseFloat(num.toFixed(10)).toString();
  }
}