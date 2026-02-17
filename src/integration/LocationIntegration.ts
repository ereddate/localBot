import { AdvancedLocationServiceTool } from '../skills/AdvancedLocationServiceTool';
import { Tool } from '../types';

/**
 * 位置服务集成模块
 * 用于将高级定位服务集成到AI助手的核心功能中
 */
export class LocationIntegration {
  private locationTool: AdvancedLocationServiceTool;
  
  constructor() {
    this.locationTool = new AdvancedLocationServiceTool();
  }
  
  /**
   * 检测是否为位置相关查询
   */
  public isLocationQuery(query: string): boolean {
    const locationKeywords = [
      '我在哪', '我的位置', '我在哪里', '当前位置', 'location', 'where am i',
      '定位', '坐标', '经纬度', '附近', '周围', '地理', '地址', 'place'
    ];
    
    const normalizedQuery = query.toLowerCase().trim();
    return locationKeywords.some(keyword => 
      normalizedQuery.includes(keyword.toLowerCase())
    );
  }
  
  /**
   * 处理位置查询
   */
  public async handleLocationQuery(query: string): Promise<{ handled: boolean; response: string }> {
    if (!this.isLocationQuery(query)) {
      return { handled: false, response: '' };
    }
    
    try {
      // 获取当前位置
      const result = await this.locationTool.execute({ operation: 'get_current_gps' });
      
      if (result.success && result.data) {
        const { latitude, longitude, accuracy, provider, timestamp } = result.data as any;
        
        // 生成友好的响应
        const friendlyResponse = `
根据定位服务，您当前的位置大约在：
- 纬度: ${latitude.toFixed(6)}°
- 经度: ${longitude.toFixed(6)}°

这是一个基于${provider}的估算位置，精确度约为${accuracy}米。
请注意，实际位置可能会有几米到几十米的误差。

您还可以使用以下功能：
- 查询附近的地点（如"附近有什么餐厅"）
- 设置位置提醒（如"当我到达公司时提醒我"）
- 查看位置历史记录
        `.trim();
        
        return { 
          handled: true, 
          response: friendlyResponse 
        };
      } else {
        return { 
          handled: true, 
          response: '抱歉，暂时无法获取您的精确位置信息。您可以手动输入您所在的城市或地区，我可以为您提供相关服务。' 
        };
      }
    } catch (error) {
      console.error('位置查询处理失败:', error);
      return { 
        handled: true, 
        response: '抱歉，获取位置信息时出现了一些问题。您可以尝试重新询问，或者手动提供您所在的大致位置，我可以为您提供帮助。' 
      };
    }
  }
  
  /**
   * 获取附近地点
   */
  public async getNearbyLocations(
    latitude: number, 
    longitude: number, 
    radius: number, 
    locationType: string
  ): Promise<any> {
    try {
      const result = await this.locationTool.execute({ 
        operation: 'find_nearby_locations',
        latitude,
        longitude,
        radius,
        locationType
      });
      
      return result;
    } catch (error) {
      console.error('获取附近地点失败:', error);
      throw error;
    }
  }
  
  /**
   * 设置位置提醒
   */
  public async setLocationAlert(userId: string, destination: string): Promise<any> {
    try {
      const result = await this.locationTool.execute({
        operation: 'location_alerts',
        userId,
        destination
      });
      
      return result;
    } catch (error) {
      console.error('设置位置提醒失败:', error);
      throw error;
    }
  }
}