import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';

export class TextAnalysisTool implements Tool {
  name = 'text_analysis';
  description = 'Analyze text for various metrics (word count, sentiment, etc.)';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const text = params.text as string;
      const analyzeType = params.analyzeType as string || 'all';

      if (!text) {
        return { success: false, error: 'text is required' };
      }

      // Perform text analysis
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      const charCount = text.length;
      const charCountWithoutSpaces = text.replace(/\s/g, '').length;
      const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
      const paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

      // Simple sentiment analysis (basic implementation)
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'awesome', 'wonderful', 'fantastic', 'brilliant'];
      const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'dislike', 'poor'];
      
      let positiveCount = 0;
      let negativeCount = 0;
      
      const lowerText = text.toLowerCase();
      for (const word of positiveWords) {
        const regex = new RegExp('\\b' + word + '\\b', 'gi');
        positiveCount += (lowerText.match(regex) || []).length;
      }
      
      for (const word of negativeWords) {
        const regex = new RegExp('\\b' + word + '\\b', 'gi');
        negativeCount += (lowerText.match(regex) || []).length;
      }
      
      let sentiment = 'neutral';
      if (positiveCount > negativeCount) sentiment = 'positive';
      else if (negativeCount > positiveCount) sentiment = 'negative';

      const analysis: any = {
        wordCount,
        charCount,
        charCountWithoutSpaces,
        sentenceCount,
        paragraphCount,
        sentiment,
        positiveWordsCount: positiveCount,
        negativeWordsCount: negativeCount
      };

      if (analyzeType === 'wordCount' || analyzeType === 'all') {
        analysis.wordCount = wordCount;
      }
      if (analyzeType === 'sentiment' || analyzeType === 'all') {
        analysis.sentiment = sentiment;
        analysis.positiveWordsCount = positiveCount;
        analysis.negativeWordsCount = negativeCount;
      }

      return {
        success: true,
        data: {
          analysis,
          analyzeType,
          textLength: text.length,
          message: 'Text analysis completed'
        }
      };
    } catch (error) {
      Logger.error(`Text analysis failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class TextSearchTool implements Tool {
  name = 'text_search';
  description = 'Search for patterns or terms within text';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const text = params.text as string;
      const searchTerm = params.searchTerm as string;
      const caseSensitive = params.caseSensitive as boolean || false;

      if (!text) {
        return { success: false, error: 'text is required' };
      }

      if (!searchTerm) {
        return { success: false, error: 'searchTerm is required' };
      }

      // Perform search
      let flags = 'g';
      if (!caseSensitive) {
        flags += 'i';
      }

      const regex = new RegExp(searchTerm, flags);
      const matches = text.match(regex) || [];
      const matchIndices: number[] = [];
      
      let match;
      const globalRegex = new RegExp(searchTerm, flags);
      let lastIndex = 0;
      
      while ((match = globalRegex.exec(text)) !== null) {
        matchIndices.push(match.index);
        if (match.index === globalRegex.lastIndex) {
          globalRegex.lastIndex++;
        }
      }

      return {
        success: true,
        data: {
          searchTerm,
          caseSensitive,
          matchCount: matches.length,
          matches,
          matchPositions: matchIndices,
          contextBefore: matches.map((_, i) => {
            const start = Math.max(0, matchIndices[i] - 20);
            const end = matchIndices[i];
            return text.substring(start, end);
          }),
          contextAfter: matches.map((_, i) => {
            const start = matchIndices[i] + searchTerm.length;
            const end = Math.min(text.length, start + 20);
            return text.substring(start, end);
          }),
          message: 'Text search completed'
        }
      };
    } catch (error) {
      Logger.error(`Text search failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class TextTransformTool implements Tool {
  name = 'text_transform';
  description = 'Transform text using various operations (uppercase, lowercase, etc.)';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const text = params.text as string;
      const operation = params.operation as string;

      if (!text) {
        return { success: false, error: 'text is required' };
      }

      if (!operation) {
        return { success: false, error: 'operation is required (uppercase, lowercase, capitalize, reverse, etc.)' };
      }

      let resultText = text;
      let operationApplied = '';

      switch (operation.toLowerCase()) {
        case 'uppercase':
          resultText = text.toUpperCase();
          operationApplied = 'Converted to uppercase';
          break;
          
        case 'lowercase':
          resultText = text.toLowerCase();
          operationApplied = 'Converted to lowercase';
          break;
          
        case 'capitalize':
          resultText = text.replace(/\b\w/g, l => l.toUpperCase());
          operationApplied = 'Capitalized first letters of words';
          break;
          
        case 'reverse':
          resultText = text.split('').reverse().join('');
          operationApplied = 'Reversed text';
          break;
          
        case 'trim':
          resultText = text.trim();
          operationApplied = 'Trimmed whitespace';
          break;
          
        case 'remove_extra_spaces':
          resultText = text.replace(/\s+/g, ' ');
          operationApplied = 'Removed extra spaces';
          break;
          
        case 'replace':
          const findStr = params.find as string;
          const replaceStr = params.replace as string;
          if (!findStr) {
            return { success: false, error: 'find parameter is required for replace operation' };
          }
          resultText = text.replace(new RegExp(findStr, 'g'), replaceStr || '');
          operationApplied = `Replaced '${findStr}' with '${replaceStr || ''}'`;
          break;
          
        default:
          return { success: false, error: 'Invalid operation. Use: uppercase, lowercase, capitalize, reverse, trim, remove_extra_spaces, replace' };
      }

      return {
        success: true,
        data: {
          originalText: text,
          transformedText: resultText,
          operation,
          operationApplied,
          message: 'Text transformation completed'
        }
      };
    } catch (error) {
      Logger.error(`Text transformation failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}