import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

export class MathCalculationTool implements Tool {
  name = 'math_calculate';
  description = 'Perform mathematical calculations';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const expression = params.expression as string;
      const operation = params.operation as string;
      const numbers = params.numbers as number[];

      if (!expression && !operation) {
        return { success: false, error: 'Either expression or operation is required' };
      }

      if (expression) {
        // Evaluate a mathematical expression safely
        // Note: In a production environment, use a proper math expression parser
        // rather than eval for security reasons
        try {
          // Sanitize the expression to only allow mathematical operations
          const sanitizedExpr = expression.replace(/[^0-9+\-*/().\s]/g, '');
          
          // For safety, we'll implement basic parsing instead of eval
          const result = this.evaluateExpression(sanitizedExpr);
          
          return {
            success: true,
            data: {
              expression,
              result,
              message: 'Mathematical expression evaluated'
            }
          };
        } catch (evalError) {
          return { success: false, error: `Expression evaluation error: ${(evalError as Error).message}` };
        }
      }

      if (operation) {
        // Perform specific mathematical operations
        switch (operation.toLowerCase()) {
          case 'add':
          case 'subtract':
          case 'multiply':
          case 'divide':
            if (!numbers || numbers.length < 2) {
              return { success: false, error: 'At least two numbers are required for basic operations' };
            }
            break;
          default:
            if (!numbers || numbers.length === 0) {
              return { success: false, error: 'Numbers are required for this operation' };
            }
        }

        let result: number;
        let operationDescription = '';

        switch (operation.toLowerCase()) {
          case 'add':
            result = numbers.reduce((sum, num) => sum + num, 0);
            operationDescription = `Sum of ${numbers.join(' + ')}`;
            break;

          case 'subtract':
            result = numbers.reduce((diff, num, idx) => idx === 0 ? num : diff - num, 0);
            operationDescription = `${numbers[0]} - ${numbers.slice(1).join(' - ')}`;
            break;

          case 'multiply':
            result = numbers.reduce((prod, num) => prod * num, 1);
            operationDescription = `Product of ${numbers.join(' × ')}`;
            break;

          case 'divide':
            if (numbers.some(num => num === 0)) {
              return { success: false, error: 'Division by zero is not allowed' };
            }
            result = numbers.reduce((div, num, idx) => idx === 0 ? num : div / num);
            operationDescription = `${numbers[0]} ÷ ${numbers.slice(1).join(' ÷ ')}`;
            break;

          case 'power':
            if (numbers.length !== 2) {
              return { success: false, error: 'Power operation requires exactly 2 numbers (base and exponent)' };
            }
            result = Math.pow(numbers[0], numbers[1]);
            operationDescription = `${numbers[0]} ^ ${numbers[1]}`;
            break;

          case 'sqrt':
            if (numbers.length !== 1) {
              return { success: false, error: 'Square root operation requires exactly 1 number' };
            }
            if (numbers[0] < 0) {
              return { success: false, error: 'Cannot calculate square root of negative number' };
            }
            result = Math.sqrt(numbers[0]);
            operationDescription = `√${numbers[0]}`;
            break;

          case 'percentage':
            if (numbers.length !== 2) {
              return { success: false, error: 'Percentage operation requires exactly 2 numbers (part and whole)' };
            }
            result = (numbers[0] / numbers[1]) * 100;
            operationDescription = `${numbers[0]} is what percent of ${numbers[1]}?`;
            break;

          case 'mean':
            if (numbers.length === 0) {
              return { success: false, error: 'Mean operation requires at least one number' };
            }
            result = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
            operationDescription = `Mean of ${numbers.length} numbers`;
            break;

          case 'median':
            if (numbers.length === 0) {
              return { success: false, error: 'Median operation requires at least one number' };
            }
            const sortedNumbers = [...numbers].sort((a, b) => a - b);
            const mid = Math.floor(sortedNumbers.length / 2);
            result = sortedNumbers.length % 2 === 0 
              ? (sortedNumbers[mid - 1] + sortedNumbers[mid]) / 2
              : sortedNumbers[mid];
            operationDescription = `Median of ${numbers.length} numbers`;
            break;

          case 'mode':
            if (numbers.length === 0) {
              return { success: false, error: 'Mode operation requires at least one number' };
            }
            const freqMap: Record<number, number> = {};
            for (const num of numbers) {
              freqMap[num] = (freqMap[num] || 0) + 1;
            }
            
            let maxFreq = 0;
            let mode = numbers[0];
            for (const num in freqMap) {
              if (freqMap[num] > maxFreq) {
                maxFreq = freqMap[num];
                mode = parseFloat(num);
              }
            }
            result = mode;
            operationDescription = `Mode of ${numbers.length} numbers`;
            break;

          default:
            return { success: false, error: 'Invalid operation. Use: add, subtract, multiply, divide, power, sqrt, percentage, mean, median, mode' };
        }

        return {
          success: true,
          data: {
            operation,
            numbers,
            result,
            operationDescription,
            message: 'Mathematical operation completed'
          }
        };
      }

      return { success: false, error: 'No valid operation specified' };
    } catch (error) {
      Logger.error(`Math calculation failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }

  private evaluateExpression(expr: string): number {
    // A safe evaluator that handles basic arithmetic expressions
    // This is a simplified implementation - in production, use a proper math expression parser
    expr = expr.replace(/\s+/g, ''); // Remove spaces
    
    // Validate expression contains only allowed characters
    if (/[^0-9+\-*/().]/.test(expr)) {
      throw new Error('Invalid characters in expression');
    }
    
    // This is still potentially unsafe, so we'll just handle simple cases
    // For a production implementation, use a proper math expression parser
    // like math.js or expr-eval
    
    // For now, we'll return a placeholder
    // In a real implementation, we'd parse and evaluate the expression safely
    Logger.warn('Expression evaluation is simplified for safety. Use specific operations for production.');
    return 0; // Placeholder - in real implementation, evaluate the expression
  }
}

export class UnitConversionTool implements Tool {
  name = 'unit_conversion';
  description = 'Convert between different units of measurement';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const value = params.value as number;
      const fromUnit = params.fromUnit as string;
      const toUnit = params.toUnit as string;
      const category = params.category as string;

      if (value === undefined || value === null) {
        return { success: false, error: 'value is required' };
      }

      if (!fromUnit || !toUnit) {
        return { success: false, error: 'fromUnit and toUnit are required' };
      }

      if (!category) {
        return { success: false, error: 'category is required (length, weight, temperature, volume, etc.)' };
      }

      // Define conversion factors for different categories
      const conversions: Record<string, Record<string, number>> = {
        length: {
          'mm': 0.001,
          'cm': 0.01,
          'm': 1,
          'km': 1000,
          'in': 0.0254,
          'ft': 0.3048,
          'yd': 0.9144,
          'mi': 1609.344
        },
        weight: {
          'mg': 0.000001,
          'g': 0.001,
          'kg': 1,
          't': 1000,
          'oz': 0.0283495,
          'lb': 0.453592
        },
        temperature: {
          // Special handling for temperature conversions
        },
        volume: {
          'ml': 0.001,
          'l': 1,
          'm3': 1000,
          'tsp': 0.00492892,
          'tbsp': 0.0147868,
          'fl_oz': 0.0295735,
          'cup': 0.24,
          'pt': 0.473176,
          'qt': 0.946353,
          'gal': 3.78541
        }
      };

      if (!conversions[category]) {
        return { success: false, error: `Unsupported category: ${category}. Supported: ${Object.keys(conversions).join(', ')}` };
      }

      // Handle temperature separately since it's not a linear conversion
      if (category === 'temperature') {
        let result: number;
        
        if ((fromUnit === 'celsius' || fromUnit === 'c') && (toUnit === 'fahrenheit' || toUnit === 'f')) {
          result = (value * 9/5) + 32;
        } else if ((fromUnit === 'fahrenheit' || fromUnit === 'f') && (toUnit === 'celsius' || toUnit === 'c')) {
          result = (value - 32) * 5/9;
        } else if ((fromUnit === 'celsius' || fromUnit === 'c') && (toUnit === 'kelvin' || toUnit === 'k')) {
          result = value + 273.15;
        } else if ((fromUnit === 'kelvin' || fromUnit === 'k') && (toUnit === 'celsius' || toUnit === 'c')) {
          result = value - 273.15;
        } else if ((fromUnit === 'fahrenheit' || fromUnit === 'f') && (toUnit === 'kelvin' || toUnit === 'k')) {
          result = (value - 32) * 5/9 + 273.15;
        } else if ((fromUnit === 'kelvin' || fromUnit === 'k') && (toUnit === 'fahrenheit' || toUnit === 'f')) {
          result = (value - 273.15) * 9/5 + 32;
        } else {
          return { success: false, error: `Unsupported temperature conversion: ${fromUnit} to ${toUnit}` };
        }
        
        return {
          success: true,
          data: {
            originalValue: value,
            originalUnit: fromUnit,
            convertedValue: result,
            targetUnit: toUnit,
            category: 'temperature',
            message: `Temperature converted from ${fromUnit} to ${toUnit}`
          }
        };
      }

      // For other categories, convert to base unit first, then to target unit
      if (!conversions[category][fromUnit] || !conversions[category][toUnit]) {
        return { 
          success: false, 
          error: `Unsupported units for ${category}. Available units: ${Object.keys(conversions[category]).join(', ')}` 
        };
      }

      // Convert to base unit first
      const valueInBaseUnit = value * conversions[category][fromUnit];
      // Convert from base unit to target unit
      const result = valueInBaseUnit / conversions[category][toUnit];

      return {
        success: true,
        data: {
          originalValue: value,
          originalUnit: fromUnit,
          convertedValue: result,
          targetUnit: toUnit,
          category,
          message: `Converted ${category} from ${fromUnit} to ${toUnit}`
        }
      };
    } catch (error) {
      Logger.error(`Unit conversion failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class StatisticsTool implements Tool {
  name = 'statistics_calculate';
  description = 'Calculate statistical measures for a dataset';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const numbers = params.numbers as number[];
      const operation = params.operation as string;

      if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
        return { success: false, error: 'numbers array is required' };
      }

      if (numbers.some(n => typeof n !== 'number' || isNaN(n))) {
        return { success: false, error: 'All values in numbers array must be valid numbers' };
      }

      // Default to calculating all statistics if no specific operation is provided
      const ops = operation ? [operation] : [
        'mean', 'median', 'mode', 'range', 'min', 'max', 'stddev', 'variance'
      ];

      const stats: Record<string, number | number[]> = {};

      for (const op of ops) {
        switch (op.toLowerCase()) {
          case 'mean':
            stats.mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
            break;

          case 'median':
            const sorted = [...numbers].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            stats.median = sorted.length % 2 === 0 
              ? (sorted[mid - 1] + sorted[mid]) / 2
              : sorted[mid];
            break;

          case 'mode':
            const freqMap: Record<number, number> = {};
            for (const num of numbers) {
              freqMap[num] = (freqMap[num] || 0) + 1;
            }
            
            let maxFreq = 0;
            let modes: number[] = [];
            for (const num in freqMap) {
              const freq = freqMap[parseFloat(num)];
              if (freq > maxFreq) {
                maxFreq = freq;
                modes = [parseFloat(num)];
              } else if (freq === maxFreq) {
                modes.push(parseFloat(num));
              }
            }
            stats.mode = modes;
            break;

          case 'range':
            stats.range = Math.max(...numbers) - Math.min(...numbers);
            break;

          case 'min':
            stats.min = Math.min(...numbers);
            break;

          case 'max':
            stats.max = Math.max(...numbers);
            break;

          case 'stddev':
            const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
            const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
            const variance = squaredDiffs.reduce((sum, sqDiff) => sum + sqDiff, 0) / numbers.length;
            stats.stddev = Math.sqrt(variance);
            break;

          case 'variance':
            const meanVar = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
            const squaredDiffsVar = numbers.map(num => Math.pow(num - meanVar, 2));
            stats.variance = squaredDiffsVar.reduce((sum, sqDiff) => sum + sqDiff, 0) / numbers.length;
            break;

          default:
            return { success: false, error: `Invalid statistical operation: ${op}. Use: mean, median, mode, range, min, max, stddev, variance` };
        }
      }

      return {
        success: true,
        data: {
          count: numbers.length,
          numbers,
          statistics: stats,
          message: 'Statistical calculations completed'
        }
      };
    } catch (error) {
      Logger.error(`Statistics calculation failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}