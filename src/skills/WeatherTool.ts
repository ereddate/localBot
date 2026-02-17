import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

export class WeatherTool implements Tool {
  name = 'weather_query';
  description = '查询天气信息';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const city = params.city as string;
      const days = params.days ? parseInt(params.days as string) : 1;

      if (!city) {
        return { success: false, error: 'City name is required' };
      }

      // 模拟天气数据 - 在实际应用中这里会调用真实的天气API
      const mockWeatherData = {
        location: city,
        temperature: Math.floor(Math.random() * 35) + 5, // 5-40度之间随机
        humidity: Math.floor(Math.random() * 50) + 30, // 30-80%之间随机
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Partly Cloudy'][Math.floor(Math.random() * 5)],
        forecast: Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          high: Math.floor(Math.random() * 35) + 5,
          low: Math.floor(Math.random() * 20) - 5,
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Partly Cloudy'][Math.floor(Math.random() * 5)]
        }))
      };

      return {
        success: true,
        data: mockWeatherData
      };
    } catch (error) {
      Logger.error('Weather tool error', { error: (error as Error).message });
      return { success: false, error: `Failed to get weather data: ${(error as Error).message}` };
    }
  }
}