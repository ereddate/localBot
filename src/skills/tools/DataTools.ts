import { Tool, ToolResult } from '../../types';
import { Logger } from '../../utils/Logger';
import { parse as csvParse } from 'csv-parse/sync';
import { stringify as csvStringify } from 'csv-stringify/sync';
import * as fs from 'fs/promises';

export class CsvReadTool implements Tool {
  name = 'csv_read';
  description = 'Read and parse CSV file';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;
      const delimiter = params.delimiter as string || ',';
      const hasHeader = params.hasHeader as boolean ?? true;
      
      if (!filePath) {
        return { success: false, error: 'filePath is required' };
      }

      const content = await fs.readFile(filePath, 'utf-8');
      
      const records = csvParse(content, {
        delimiter,
        columns: hasHeader,
        skip_empty_lines: true
      });

      return {
        success: true,
        data: {
          filePath,
          records,
          count: records.length,
          hasHeader
        }
      };
    } catch (error) {
      Logger.error('CSV read failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to read CSV: ${(error as Error).message}`
      };
    }
  }
}

export class CsvWriteTool implements Tool {
  name = 'csv_write';
  description = 'Write data to CSV file';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;
      const data = params.data as any[];
      const header = params.header as boolean | string[] | undefined;
      
      if (!filePath || !data) {
        return { success: false, error: 'filePath and data are required' };
      }

      const options: any = {
        cast_date: true
      };
      
      if (header !== undefined) {
        options.header = header;
      }

      const output = csvStringify(data, options);

      await fs.writeFile(filePath, output, 'utf-8');
      
      return {
        success: true,
        data: {
          filePath,
          recordsWritten: data.length
        }
      };
    } catch (error) {
      Logger.error('CSV write failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to write CSV: ${(error as Error).message}`
      };
    }
  }
}

export class JsonReadTool implements Tool {
  name = 'json_read';
  description = 'Read and parse JSON file';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;
      
      if (!filePath) {
        return { success: false, error: 'filePath is required' };
      }

      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      return {
        success: true,
        data: {
          filePath,
          data,
          valid: true
        }
      };
    } catch (error) {
      Logger.error('JSON read failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to read JSON: ${(error as Error).message}`
      };
    }
  }
}

export class JsonWriteTool implements Tool {
  name = 'json_write';
  description = 'Write data to JSON file';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;
      const data = params.data as any;
      const pretty = params.pretty as boolean || false;
      
      if (!filePath || data === undefined) {
        return { success: false, error: 'filePath and data are required' };
      }

      const content = pretty 
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);

      await fs.writeFile(filePath, content, 'utf-8');
      
      return {
        success: true,
        data: {
          filePath,
          written: true
        }
      };
    } catch (error) {
      Logger.error('JSON write failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to write JSON: ${(error as Error).message}`
      };
    }
  }
}

export class TextAnalysisTool implements Tool {
  name = 'text_analysis';
  description = 'Analyze text content for patterns and statistics';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const text = params.text as string;
      
      if (!text) {
        return { success: false, error: 'text is required' };
      }

      const words = text.split(/\s+/).filter(w => w.length > 0);
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
      
      const wordCount = words.length;
      const sentenceCount = sentences.length;
      const paragraphCount = paragraphs.length;
      const charCount = text.length;
      const charCountNoSpaces = text.replace(/\s/g, '').length;
      
      const avgWordLength = wordCount > 0 
        ? charCountNoSpaces / wordCount 
        : 0;
      
      const avgSentenceLength = sentenceCount > 0 
        ? wordCount / sentenceCount 
        : 0;

      const wordFrequency: Record<string, number> = {};
      for (const word of words) {
        const lowerWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (lowerWord.length > 0) {
          wordFrequency[lowerWord] = (wordFrequency[lowerWord] || 0) + 1;
        }
      }

      const topWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      return {
        success: true,
        data: {
          wordCount,
          sentenceCount,
          paragraphCount,
          charCount,
          charCountNoSpaces,
          avgWordLength: Math.round(avgWordLength * 100) / 100,
          avgSentenceLength: Math.round(avgSentenceLength * 100) / 100,
          topWords,
          uniqueWords: Object.keys(wordFrequency).length
        }
      };
    } catch (error) {
      Logger.error('Text analysis failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to analyze text: ${(error as Error).message}`
      };
    }
  }
}

export class TextSearchTool implements Tool {
  name = 'text_search';
  description = 'Search for text patterns in content';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const text = params.text as string;
      const pattern = params.pattern as string;
      const caseSensitive = params.caseSensitive as boolean || false;
      const regex = params.regex as boolean || false;
      
      if (!text || !pattern) {
        return { success: false, error: 'text and pattern are required' };
      }

      let matches: Array<{ index: number; match: string; line?: number }> = [];
      
      if (regex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regexPattern = new RegExp(pattern, flags);
        let match;
        
        while ((match = regexPattern.exec(text)) !== null) {
          matches.push({
            index: match.index,
            match: match[0]
          });
        }
      } else {
        const searchText = caseSensitive ? text : text.toLowerCase();
        const searchPattern = caseSensitive ? pattern : pattern.toLowerCase();
        let index = 0;
        
        while ((index = searchText.indexOf(searchPattern, index)) !== -1) {
          matches.push({
            index,
            match: text.substring(index, index + pattern.length)
          });
          index += pattern.length;
        }
      }

      const lines = text.split('\n');
      matches = matches.map(m => ({
        ...m,
        line: this.getLineNumber(text, m.index)
      }));

      return {
        success: true,
        data: {
          pattern,
          matches,
          count: matches.length,
          caseSensitive,
          regex
        }
      };
    } catch (error) {
      Logger.error('Text search failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to search text: ${(error as Error).message}`
      };
    }
  }

  private getLineNumber(text: string, index: number): number {
    const before = text.substring(0, index);
    return before.split('\n').length;
  }
}

export class TextReplaceTool implements Tool {
  name = 'text_replace';
  description = 'Replace text patterns in content';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const text = params.text as string;
      const pattern = params.pattern as string;
      const replacement = params.replacement as string || '';
      const caseSensitive = params.caseSensitive as boolean || false;
      const regex = params.regex as boolean || false;
      const all = params.all as boolean || true;
      
      if (!text || pattern === undefined) {
        return { success: false, error: 'text and pattern are required' };
      }

      let result: string;
      let count = 0;
      
      if (regex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regexPattern = new RegExp(pattern, flags);
        const matches = text.match(regexPattern);
        count = matches ? matches.length : 0;
        result = text.replace(regexPattern, replacement);
      } else {
        const searchText = caseSensitive ? text : text.toLowerCase();
        const searchPattern = caseSensitive ? pattern : pattern.toLowerCase();
        
        if (all) {
          count = (searchText.match(new RegExp(searchPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
          result = text.split(pattern).join(replacement);
        } else {
          const index = searchText.indexOf(searchPattern);
          if (index !== -1) {
            count = 1;
            result = text.substring(0, index) + replacement + text.substring(index + pattern.length);
          } else {
            count = 0;
            result = text;
          }
        }
      }

      return {
        success: true,
        data: {
          pattern,
          replacement,
          result,
          count,
          all,
          caseSensitive,
          regex
        }
      };
    } catch (error) {
      Logger.error('Text replace failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to replace text: ${(error as Error).message}`
      };
    }
  }
}

export class MathCalculateTool implements Tool {
  name = 'math_calculate';
  description = 'Perform mathematical calculations';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const expression = params.expression as string;
      
      if (!expression) {
        return { success: false, error: 'expression is required' };
      }

      const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
      
      if (sanitized !== expression) {
        return { 
          success: false, 
          error: 'Expression contains invalid characters' 
        };
      }

      const result = Function(`"use strict"; return (${sanitized})`)();
      
      if (typeof result !== 'number' || !isFinite(result)) {
        return { 
          success: false, 
          error: 'Invalid calculation result' 
        };
      }

      return {
        success: true,
        data: {
          expression,
          result,
          type: typeof result
        }
      };
    } catch (error) {
      Logger.error('Math calculation failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to calculate: ${(error as Error).message}`
      };
    }
  }
}

export class JsonListTool implements Tool {
  name = 'json_list';
  description = 'List and analyze JSON array data';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const jsonData = params.json_data as string;
      const limit = params.limit as number || 10;
      
      if (!jsonData) {
        return { success: false, error: 'json_data is required' };
      }

      const data = JSON.parse(jsonData);
      
      if (!Array.isArray(data)) {
        return { 
          success: false, 
          error: 'json_data must be an array' 
        };
      }

      const limitedData = data.slice(0, limit);
      
      return {
        success: true,
        data: {
          total: data.length,
          displayed: limitedData.length,
          items: limitedData,
          isArray: true
        }
      };
    } catch (error) {
      Logger.error('JSON list failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to list JSON: ${(error as Error).message}`
      };
    }
  }
}

export class MeanValueTool implements Tool {
  name = 'mean_value';
  description = 'Calculate mean (average) value from an array of numbers';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const data = params.data as string;
      
      if (!data) {
        return { success: false, error: 'data is required' };
      }

      const numbers = JSON.parse(data);
      
      if (!Array.isArray(numbers)) {
        return { 
          success: false, 
          error: 'data must be an array of numbers' 
        };
      }

      const validNumbers = numbers.filter(n => typeof n === 'number' && !isNaN(n));
      
      if (validNumbers.length === 0) {
        return { 
          success: false, 
          error: 'No valid numbers found in data' 
        };
      }

      const sum = validNumbers.reduce((acc, num) => acc + num, 0);
      const mean = sum / validNumbers.length;
      
      const sortedNumbers = [...validNumbers].sort((a, b) => a - b);
      const median = validNumbers.length % 2 === 0
        ? (sortedNumbers[validNumbers.length / 2 - 1] + sortedNumbers[validNumbers.length / 2]) / 2
        : sortedNumbers[Math.floor(validNumbers.length / 2)];

      const variance = validNumbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / validNumbers.length;
      const stdDev = Math.sqrt(variance);

      return {
        success: true,
        data: {
          count: validNumbers.length,
          sum,
          mean,
          median,
          min: Math.min(...validNumbers),
          max: Math.max(...validNumbers),
          variance,
          stdDev
        }
      };
    } catch (error) {
      Logger.error('Mean value calculation failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to calculate mean: ${(error as Error).message}`
      };
    }
  }
}

export class BarChartTool implements Tool {
  name = 'bar_chart';
  description = 'Generate bar chart data for visualization';
  category = 'other' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const xAxis = params.x_axis as string;
      const yAxis = params.y_axis as string;
      const title = params.title as string || 'Bar Chart';
      const data = params.data as any[] || [];
      
      if (!xAxis || !yAxis) {
        return { success: false, error: 'x_axis and y_axis are required' };
      }

      const chartData = data.map(item => ({
        x: item[xAxis] || '',
        y: item[yAxis] || 0
      }));

      const maxValue = Math.max(...chartData.map(d => d.y));
      const minValue = Math.min(...chartData.map(d => d.y));
      const avgValue = chartData.reduce((sum, d) => sum + d.y, 0) / chartData.length;

      return {
        success: true,
        data: {
          title,
          xAxis,
          yAxis,
          chartData,
          statistics: {
            count: chartData.length,
            maxValue,
            minValue,
            avgValue
          }
        }
      };
    } catch (error) {
      Logger.error('Bar chart generation failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to generate bar chart: ${(error as Error).message}`
      };
    }
  }
}
