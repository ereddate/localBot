import { AdvancedLocationServiceTool } from './src/skills/AdvancedLocationServiceTool';

/**
 * 示例：如何处理用户询问位置的问题
 * 这段代码展示了如何在AI响应逻辑中集成定位工具
 */
async function handleUserLocationQuery() {
  console.log('用户询问："我在哪"');
  console.log('检测到位置相关查询，正在调用定位工具...');
  
  // 创建定位工具实例
  const locationTool = new AdvancedLocationServiceTool();
  
  try {
    // 执行获取当前GPS坐标的操作
    const result = await locationTool.execute({ operation: 'get_current_gps' });
    
    if (result.success && result.data) {
      const { latitude, longitude, accuracy, provider } = result.data as any;
      
      console.log('\n系统成功获取到您的位置信息：');
      console.log(`- 纬度: ${latitude.toFixed(6)}`);
      console.log(`- 经度: ${longitude.toFixed(6)}`);
      console.log(`- 精确度: ${accuracy}米`);
      console.log(`- 定位方式: ${provider}`);
      
      // 根据位置信息生成友好的响应
      const friendlyResponse = `
根据定位服务，您当前的位置大约在：
- 纬度: ${latitude.toFixed(4)}
- 经度: ${longitude.toFixed(4)}

这是一个基于GPS的估算位置。请注意，实际位置可能会有几米到几十米的误差。
      `.trim();
      
      console.log('\nAI助手可以这样回答用户：');
      console.log(friendlyResponse);
    } else {
      console.log('无法获取位置信息:', result.error);
    }
  } catch (error) {
    console.error('定位工具执行失败:', error);
  }
}

// 运行示例
handleUserLocationQuery().then(() => {
  console.log('\n示例完成：展示了如何集成定位工具来响应用户的位置查询');
});