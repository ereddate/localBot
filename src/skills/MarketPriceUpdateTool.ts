import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import { ConsoleLogger } from '../utils/ConsoleLogger';
import { DateUtils } from '../utils/DateUtils';

export class MarketPriceUpdateTool implements Tool {
  name = 'market_price_update';
  description = 'Retrieve current market price updates for various assets';
  category = 'system' as const;

  parameters = [
    {
      name: 'symbols',
      type: 'array',
      required: true,
      items: {
        type: 'string'
      },
      description: 'Array of symbols to get price updates for (e.g., ["GC=F", "SI=F", "CL=F"])'
    },
    {
      name: 'include_details',
      type: 'boolean',
      required: false,
      description: 'Whether to include detailed information (default: false)'
    }
  ];

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      ConsoleLogger.logSkillCall(this.name, params);
      
      const symbols = params.symbols as string[] || [];
      const includeDetails = params.include_details as boolean || false;

      if (!symbols || symbols.length === 0) {
        return { success: false, error: 'At least one symbol is required' };
      }

      // Simulate fetching current market prices
      // In a real implementation, this would connect to a financial API
      const prices = this.fetchCurrentMarketPrices(symbols, includeDetails);

      return { 
        success: true, 
        data: {
          timestamp: DateUtils.nowISOString(),
          prices: prices
        }
      };
    } catch (error) {
      Logger.error('Error in MarketPriceUpdateTool', { error, params });
      return { 
        success: false, 
        error: `Market price update failed: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  private fetchCurrentMarketPrices(symbols: string[], includeDetails: boolean) {
    const prices: any[] = [];
    
    for (const symbol of symbols) {
      // Define base prices for different asset types
      const basePrices: Record<string, number> = {
        'GC=F': 2035.40,  // Gold futures
        'SI=F': 22.15,     // Silver futures
        'CL=F': 75.20,     // Crude oil futures
        'ES=F': 4530.75,   // S&P 500 E-mini
        'AAPL': 175.32,    // Apple stock
        'GOOGL': 2750.15,  // Google stock
        'TSLA': 245.67,    // Tesla stock
        'BTC-USD': 43250,  // Bitcoin
        'ETH-USD': 2340,   // Ethereum
      };

      const basePrice = basePrices[symbol] || Math.random() * 500 + 50;
      const changeFactor = (Math.random() - 0.5) * 0.03; // Random change between -1.5% and +1.5%
      const priceChange = basePrice * changeFactor;
      const currentPrice = basePrice + priceChange;

      const priceData: any = {
        symbol: symbol,
        current_price: parseFloat(currentPrice.toFixed(symbol.startsWith('GC=') || symbol.startsWith('SI=') ? 2 : 2)),
        price_change: parseFloat(priceChange.toFixed(2)),
        price_change_percent: parseFloat((changeFactor * 100).toFixed(2)),
        last_updated: DateUtils.nowISOString()
      };

      if (includeDetails) {
        priceData.details = {
          open: parseFloat((basePrice * (0.995 + Math.random() * 0.01)).toFixed(2)),
          high: parseFloat((currentPrice * 1.02).toFixed(2)),
          low: parseFloat((currentPrice * 0.98).toFixed(2)),
          volume: Math.floor(Math.random() * 10000000) + 1000000,
          market_status: 'open'
        };
      }

      prices.push(priceData);
    }
    
    return prices;
  }
}