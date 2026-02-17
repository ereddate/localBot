import { SkillManager } from './src/skills/SkillManager';
import { AdvancedLocationServiceTool } from './src/skills/AdvancedLocationServiceTool';

async function testAdvancedLocationService() {
  console.log('开始测试高级定位服务工具...');
  
  // 创建技能管理器实例
  const skillManager = new SkillManager();
  
  // 直接测试工具
  const locationTool = new AdvancedLocationServiceTool();
  
  console.log('\n1. 测试获取当前GPS坐标:');
  try {
    const gpsResult = await locationTool.execute({ operation: 'get_current_gps' });
    console.log('GPS坐标结果:', JSON.stringify(gpsResult, null, 2));
  } catch (error) {
    console.error('获取GPS坐标失败:', error);
  }
  
  console.log('\n2. 测试查找附近地点:');
  try {
    const nearbyResult = await locationTool.execute({ 
      operation: 'find_nearby_locations',
      latitude: 39.9042,
      longitude: 116.4074,
      radius: 1000,
      locationType: 'restaurant'
    });
    console.log('附近地点结果:', JSON.stringify(nearbyResult, null, 2));
  } catch (error) {
    console.error('查找附近地点失败:', error);
  }
  
  console.log('\n3. 测试位置跟踪:');
  try {
    const trackResult = await locationTool.execute({ 
      operation: 'track_movement',
      userId: 'user123'
    });
    console.log('位置跟踪结果:', JSON.stringify(trackResult, null, 2));
  } catch (error) {
    console.error('位置跟踪失败:', error);
  }
  
  console.log('\n4. 测试地理围栏监控:');
  try {
    const geofenceResult = await locationTool.execute({ 
      operation: 'geofence_monitoring',
      userId: 'user123',
      latitude: 39.9042,
      longitude: 116.4074,
      radius: 500
    });
    console.log('地理围栏监控结果:', JSON.stringify(geofenceResult, null, 2));
  } catch (error) {
    console.error('地理围栏监控失败:', error);
  }
  
  console.log('\n5. 测试位置历史记录:');
  try {
    const historyResult = await locationTool.execute({ 
      operation: 'location_history',
      userId: 'user123'
    });
    console.log('位置历史记录结果:', JSON.stringify(historyResult, null, 2));
  } catch (error) {
    console.error('位置历史记录失败:', error);
  }
  
  console.log('\n6. 测试位置提醒设置:');
  try {
    const alertResult = await locationTool.execute({ 
      operation: 'location_alerts',
      userId: 'user123',
      destination: '北京站'
    });
    console.log('位置提醒结果:', JSON.stringify(alertResult, null, 2));
  } catch (error) {
    console.error('位置提醒设置失败:', error);
  }
  
  console.log('\n高级定位服务工具测试完成!');
}

// 运行测试
testAdvancedLocationService().catch(console.error);