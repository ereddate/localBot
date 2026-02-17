"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextTransformTool = exports.TextSearchTool = exports.TextAnalysisTool = void 0;
const Logger_1 = require("../utils/Logger");
class TextAnalysisTool {
    constructor() {
        this.name = 'text_analysis';
        this.description = 'Analyze text for various metrics (word count, sentiment, etc.)';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const text = params.text;
            const analyzeType = params.analyzeType || 'all';
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
            if (positiveCount > negativeCount)
                sentiment = 'positive';
            else if (negativeCount > positiveCount)
                sentiment = 'negative';
            const analysis = {
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
        }
        catch (error) {
            Logger_1.Logger.error(`Text analysis failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.TextAnalysisTool = TextAnalysisTool;
class TextSearchTool {
    constructor() {
        this.name = 'text_search';
        this.description = 'Search for patterns or terms within text';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const text = params.text;
            const searchTerm = params.searchTerm;
            const caseSensitive = params.caseSensitive || false;
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
            const matchIndices = [];
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
        }
        catch (error) {
            Logger_1.Logger.error(`Text search failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.TextSearchTool = TextSearchTool;
class TextTransformTool {
    constructor() {
        this.name = 'text_transform';
        this.description = 'Transform text using various operations (uppercase, lowercase, etc.)';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const text = params.text;
            const operation = params.operation;
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
                    const findStr = params.find;
                    const replaceStr = params.replace;
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
        }
        catch (error) {
            Logger_1.Logger.error(`Text transformation failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.TextTransformTool = TextTransformTool;
