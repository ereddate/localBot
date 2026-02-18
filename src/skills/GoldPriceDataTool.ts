import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import { ConsoleLogger } from '../utils/ConsoleLogger';
import { DateUtils } from '../utils/DateUtils';
import axios from 'axios';

export class GoldPriceDataTool implements Tool {
  name = 'historical_gold_price';
  description = 'Retrieve historical gold price data for analysis';
  category = 'system' as const;

  parameters = [
    {
      name: 'start_date',
      type: 'string',
      required: true,
      description: 'Start date in YYYY-MM-DD format'
    },
    {
      name: 'end_date',
      type: 'string',
      required: true,
      description: 'End date in YYYY-MM-DD format'
    },
    {
      name: 'interval',
      type: 'string',
      required: false,
      description: 'Data interval (daily, weekly, monthly)',
      enum: ['daily', 'weekly', 'monthly']
    }
  ];

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      ConsoleLogger.logSkillCall(this.name, params);
      
      const startDate = params.start_date as string;
      const endDate = params.end_date as string;
      const interval = params.interval as string || 'daily';

      if (!startDate || !endDate) {
        return { success: false, error: 'Both start_date and end_date are required' };
      }

      // Simulate fetching historical gold price data
      // In a real implementation, this would connect to a financial API
      const data = this.generateHistoricalGoldData(startDate, endDate, interval);

      return { 
        success: true, 
        data: {
          symbol: 'GC=F',
          asset_type: 'Gold Futures',
          start_date: startDate,
          end_date: endDate,
          interval: interval,
          data: data,
          last_updated: DateUtils.nowISOString()
        }
      };
    } catch (error) {
      Logger.error('Error in HistoricalGoldPriceTool', { error, params });
      return { 
        success: false, 
        error: `Historical gold price retrieval failed: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  private generateHistoricalGoldData(startDate: string, endDate: string, interval: string) {
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Calculate number of data points based on interval
    let dataPoints: any[] = [];
    const currentDate = new Date(start);
    
    // Generate mock historical data
    let currentPrice = 1800 + Math.random() * 200; // Base price between 1800-2000
    
    while (currentDate <= end) {
      // Add some random fluctuation
      const fluctuation = (Math.random() - 0.5) * 20; // Price change between -10 and +10
      currentPrice = Math.max(1500, currentPrice + fluctuation); // Minimum price of 1500
      
      dataPoints.push({
        date: DateUtils.formatDate(currentDate),
        price: parseFloat(currentPrice.toFixed(2)),
        open: parseFloat((currentPrice * (0.99 + Math.random() * 0.02)).toFixed(2)),
        high: parseFloat((currentPrice * (1 + Math.random() * 0.03)).toFixed(2)),
        low: parseFloat((currentPrice * (0.97 + Math.random() * 0.02)).toFixed(2)),
        volume: Math.floor(Math.random() * 500000) + 100000
      });

      // Move to next interval
      if (interval === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (interval === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else { // monthly
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    
    // Return only the last 50 points to avoid overly large responses
    if (dataPoints.length > 50) {
      dataPoints = dataPoints.slice(-50);
    }
    
    return dataPoints;
  }
}