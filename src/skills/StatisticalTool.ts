import { Tool, ToolResult } from '../types';

export class StatisticalTool implements Tool {
  name = 'statistical_analysis_tool';
  category = 'other' as const;
  description = 'Performs statistical analysis on datasets including measures of central tendency, dispersion, and correlation.';
  parameters = {
    type: 'object',
    properties: {
      dataset: {
        type: 'array',
        items: {
          type: 'number'
        },
        description: 'Numerical dataset to analyze'
      },
      operations: {
        type: 'array',
        items: {
          type: 'string',
          enum: [
            'mean', 'median', 'mode', 'std_deviation', 'variance', 
            'min', 'max', 'range', 'quartiles', 'correlation', 
            'regression', 'hypothesis_test', 'confidence_interval'
          ]
        },
        description: 'Statistical operations to perform'
      },
      confidenceLevel: {
        type: 'number',
        description: 'Confidence level for intervals (0-1)'
      }
    },
    required: ['dataset', 'operations']
  };

  async execute(params: any): Promise<any> {
    try {
      const { dataset, operations, confidenceLevel = 0.95 } = params;
      
      if (!Array.isArray(dataset) || dataset.length === 0) {
        throw new Error('Dataset must be a non-empty array of numbers');
      }
      
      // Validate that all elements in dataset are numbers
      for (const item of dataset) {
        if (typeof item !== 'number' || isNaN(item)) {
          throw new Error('All elements in dataset must be valid numbers');
        }
      }
      
      return this.performStatisticalAnalysis(dataset, operations, confidenceLevel);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: `Failed to perform statistical analysis: ${errorMessage}` };
    }
  }

  private async performStatisticalAnalysis(
    dataset: number[], 
    operations: string[], 
    confidenceLevel: number
  ): Promise<any> {
    const results: any = {
      datasetSize: dataset.length,
      operationsPerformed: [],
      summaryStatistics: {}
    };
    
    for (const operation of operations) {
      switch(operation) {
        case 'mean':
          results.summaryStatistics.mean = this.calculateMean(dataset);
          results.operationsPerformed.push({ operation: 'mean', result: results.summaryStatistics.mean });
          break;
          
        case 'median':
          results.summaryStatistics.median = this.calculateMedian(dataset);
          results.operationsPerformed.push({ operation: 'median', result: results.summaryStatistics.median });
          break;
          
        case 'mode':
          results.summaryStatistics.mode = this.calculateMode(dataset);
          results.operationsPerformed.push({ operation: 'mode', result: results.summaryStatistics.mode });
          break;
          
        case 'std_deviation':
          results.summaryStatistics.stdDeviation = this.calculateStdDeviation(dataset);
          results.operationsPerformed.push({ operation: 'std_deviation', result: results.summaryStatistics.stdDeviation });
          break;
          
        case 'variance':
          results.summaryStatistics.variance = this.calculateVariance(dataset);
          results.operationsPerformed.push({ operation: 'variance', result: results.summaryStatistics.variance });
          break;
          
        case 'min':
          results.summaryStatistics.min = this.calculateMin(dataset);
          results.operationsPerformed.push({ operation: 'min', result: results.summaryStatistics.min });
          break;
          
        case 'max':
          results.summaryStatistics.max = this.calculateMax(dataset);
          results.operationsPerformed.push({ operation: 'max', result: results.summaryStatistics.max });
          break;
          
        case 'range':
          results.summaryStatistics.range = this.calculateRange(dataset);
          results.operationsPerformed.push({ operation: 'range', result: results.summaryStatistics.range });
          break;
          
        case 'quartiles':
          results.summaryStatistics.quartiles = this.calculateQuartiles(dataset);
          results.operationsPerformed.push({ operation: 'quartiles', result: results.summaryStatistics.quartiles });
          break;
          
        case 'correlation':
          // For correlation, we need two datasets - this is simplified
          results.summaryStatistics.correlation = this.calculateCorrelation(dataset);
          results.operationsPerformed.push({ operation: 'correlation', result: results.summaryStatistics.correlation });
          break;
          
        case 'confidence_interval':
          results.summaryStatistics.confidenceInterval = this.calculateConfidenceInterval(dataset, confidenceLevel);
          results.operationsPerformed.push({ operation: 'confidence_interval', result: results.summaryStatistics.confidenceInterval });
          break;
          
        default:
          results.operationsPerformed.push({
            operation,
            status: 'skipped',
            reason: 'Unsupported operation'
          });
      }
    }
    
    return {
      statisticalAnalysis: results,
      timestamp: new Date().toISOString()
    };
  }

  private calculateMean(data: number[]): number {
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
  }

  private calculateMedian(data: number[]): number {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      return sorted[mid];
    }
  }

  private calculateMode(data: number[]): number | number[] {
    const frequencyMap: { [key: number]: number } = {};
    let maxFreq = 0;
    let modes: number[] = [];

    for (const num of data) {
      frequencyMap[num] = (frequencyMap[num] || 0) + 1;
      if (frequencyMap[num] > maxFreq) {
        maxFreq = frequencyMap[num];
      }
    }

    for (const num in frequencyMap) {
      if (frequencyMap[num] === maxFreq) {
        modes.push(parseFloat(num));
      }
    }

    return modes.length === Object.keys(frequencyMap).length ? data[0] : modes.length === 1 ? modes[0] : modes;
  }

  private calculateStdDeviation(data: number[]): number {
    const mean = this.calculateMean(data);
    const squaredDiffs = data.map(value => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / data.length;
    return Math.sqrt(avgSquaredDiff);
  }

  private calculateVariance(data: number[]): number {
    return Math.pow(this.calculateStdDeviation(data), 2);
  }

  private calculateMin(data: number[]): number {
    return Math.min(...data);
  }

  private calculateMax(data: number[]): number {
    return Math.max(...data);
  }

  private calculateRange(data: number[]): number {
    return this.calculateMax(data) - this.calculateMin(data);
  }

  private calculateQuartiles(data: number[]): { q1: number; q2: number; q3: number } {
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    
    const q2 = this.calculateMedian(sorted); // Median (Q2)
    
    let q1, q3;
    if (n % 2 === 0) {
      q1 = this.calculateMedian(sorted.slice(0, n / 2));
      q3 = this.calculateMedian(sorted.slice(n / 2));
    } else {
      q1 = this.calculateMedian(sorted.slice(0, Math.floor(n / 2)));
      q3 = this.calculateMedian(sorted.slice(Math.ceil(n / 2)));
    }
    
    return { q1, q2, q3 };
  }

  private calculateCorrelation(data: number[]): number {
    // Simplified correlation calculation assuming we have paired data
    // In reality, correlation requires two variables
    // This is a placeholder implementation
    if (data.length < 2) return 0;
    
    // For demonstration, we'll calculate autocorrelation at lag 1
    const mean = this.calculateMean(data);
    let numerator = 0;
    let sumSquaresX = 0;
    let sumSquaresY = 0;
    
    for (let i = 0; i < data.length - 1; i++) {
      const x = data[i] - mean;
      const y = data[i + 1] - mean;
      
      numerator += x * y;
      sumSquaresX += x * x;
      sumSquaresY += y * y;
    }
    
    const denominator = Math.sqrt(sumSquaresX * sumSquaresY);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateConfidenceInterval(data: number[], confidenceLevel: number): { lower: number; upper: number; marginOfError: number } {
    const mean = this.calculateMean(data);
    const stdDev = this.calculateStdDeviation(data);
    const n = data.length;
    
    // For simplicity, using z-score approximation
    // In practice, t-distribution should be used for small samples
    let zScore;
    if (confidenceLevel === 0.90) zScore = 1.645;
    else if (confidenceLevel === 0.95) zScore = 1.96;
    else if (confidenceLevel === 0.99) zScore = 2.576;
    else zScore = 1.96; // Default to 95%
    
    const standardError = stdDev / Math.sqrt(n);
    const marginOfError = zScore * standardError;
    
    return {
      lower: mean - marginOfError,
      upper: mean + marginOfError,
      marginOfError
    };
  }
}