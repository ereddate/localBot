import { LocationIntegration } from './src/integration/LocationIntegration';

async function testLocationIntegration() {
  console.log('开始测试位置服务集成模块...\n');
  
  const locationIntegration = new LocationIntegration();
  
  // 测试位置查询检测
  console.log('1. 测试位置查询检测功能:');
  const testQueries = [
    '我在哪',
    '我的位置在哪里',
    'what is my location',
    '今天天气怎么样',
    '帮我写个报告'
  ];
  
  testQueries.forEach(query => {
    const isLocationQuery = locationIntegration.isLocationQuery(query);
    console.log(`  "${query}" -> ${isLocationQuery ? '是位置查询' : '非位置查询'}`);
  });
  
  console.log('\n2. 测试位置查询处理:');
  
  // 测试位置查询处理
  const locationQuery = '我在哪';
  console.log(`  处理查询: "${locationQuery}"`);
  
  const result = await locationIntegration.handleLocationQuery(locationQuery);
  
  if (result.handled) {
    console.log('  查询已处理，返回响应:');
    console.log(result.response);
  } else {
    console.log('  查询未被处理');
  }
  
  console.log('\n3. 测试附近地点查询:');
  
  // 测试附近地点查询
  try {
    const nearbyResult = await locationIntegration.getNearbyLocations(
      39.9042,  // 北京天安门附近
      116.4074, 
      1000,     // 1公里范围内
      'restaurant' // 餐厅
    );
    
    console.log('  附近餐厅查询结果:', JSON.stringify(nearbyResult, null, 2));
  } catch (error) {
    console.error('  附近地点查询失败:', error);
  }
  
  console.log('\n4. 测试位置提醒设置:');
  
  // 测试位置提醒设置
  try {
    const alertResult = await locationIntegration.setLocationAlert(
      'user123',
      '公司'
    );
    
    console.log('  位置提醒设置结果:', JSON.stringify(alertResult, null, 2));
  } catch (error) {
    console.error('  位置提醒设置失败:', error);
  }
  
  console.log('\n位置服务集成模块测试完成!');
}

// 运行测试
testLocationIntegration().catch(console.error);