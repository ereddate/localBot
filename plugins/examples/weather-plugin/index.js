import { Plugin } from '../../plugins/PluginTypes';
import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';

const metadata = {
  name: 'weather-plugin',
  version: '1.0.0',
  description: 'Weather information plugin using external API',
  author: 'LocalBot Team',
  category: 'external',
  permissions: ['network:read']
};

export class WeatherPlugin implements Plugin {
  metadata = metadata;

  private apiKey: string = '';
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';

  async initialize() {
    this.apiKey = process.env.WEATHER_API_KEY || '';
    
    if (!this.apiKey) {
      Logger.warn('WeatherPlugin initialized without API key. Set WEATHER_API_KEY environment variable for full functionality.');
    } else {
      Logger.info('WeatherPlugin initialized with API key');
    }
  }

  getTools() {
    return [
      {
        name: 'get_weather',
        description: 'Get current weather information for a city',
        category: 'external' as const,
        async execute(params: Record<string, unknown>): Promise<ToolResult> {
          try {
            const city = params.city as string;
            const units = params.units as string || 'metric';

            if (!city) {
              return {
                success: false,
                error: 'City parameter is required'
              };
            }

            if (!this.apiKey) {
              return {
                success: false,
                error: 'Weather API key not configured. Set WEATHER_API_KEY environment variable.'
              };
            }

            const url = `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${units}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
              return {
                success: false,
                error: data.message || 'Failed to fetch weather data'
              };
            }

            Logger.info('GetWeather tool executed', { city, units });

            return {
              success: true,
              data: {
                city: data.name,
                country: data.sys.country,
                temperature: data.main.temp,
                feels_like: data.main.feels_like,
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                wind_speed: data.wind.speed,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                timestamp: new Date().toISOString(),
                plugin: 'weather-plugin'
              }
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Logger.error('GetWeather tool error', { error: errorMessage });
            return {
              success: false,
              error: errorMessage
            };
          }
        }
      },
      {
        name: 'get_forecast',
        description: 'Get weather forecast for a city',
        category: 'external' as const,
        async execute(params: Record<string, unknown>): Promise<ToolResult> {
          try {
            const city = params.city as string;
            const days = params.days as number || 3;
            const units = params.units as string || 'metric';

            if (!city) {
              return {
                success: false,
                error: 'City parameter is required'
              };
            }

            if (days < 1 || days > 5) {
              return {
                success: false,
                error: 'Days parameter must be between 1 and 5'
              };
            }

            if (!this.apiKey) {
              return {
                success: false,
                error: 'Weather API key not configured. Set WEATHER_API_KEY environment variable.'
              };
            }

            const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${units}&cnt=${days * 8}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
              return {
                success: false,
                error: data.message || 'Failed to fetch forecast data'
              };
            }

            const forecast = data.list.slice(0, days * 8).map((item: any) => ({
              datetime: new Date(item.dt * 1000).toISOString(),
              temperature: item.main.temp,
              feels_like: item.main.feels_like,
              humidity: item.main.humidity,
              pressure: item.main.pressure,
              wind_speed: item.wind.speed,
              description: item.weather[0].description,
              icon: item.weather[0].icon
            }));

            Logger.info('GetForecast tool executed', { city, days, units });

            return {
              success: true,
              data: {
                city: data.city.name,
                country: data.city.country,
                forecast,
                days,
                timestamp: new Date().toISOString(),
                plugin: 'weather-plugin'
              }
            };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Logger.error('GetForecast tool error', { error: errorMessage });
            return {
              success: false,
              error: errorMessage
            };
          }
        }
      }
    ];
  }

  async destroy() {
    Logger.info('WeatherPlugin destroyed');
  }
}

export default WeatherPlugin;
