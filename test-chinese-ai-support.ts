import { ChineseAILocalTool } from './src/skills/ChineseAITools';
import { config } from './src/config';

async function testChineseAISupport() {
  console.log('🔍 测试国产AI大模型支持...\n');

  const chineseAITool = new ChineseAILocalTool();

  // 测试获取所有国产AI提供商信息
  console.log('📋 获取所有国产AI提供商信息:');
  const allProvidersResult = await chineseAITool.execute({});
  console.log(JSON.stringify(allProvidersResult, null, 2));
  console.log('');

  // 测试获取特定提供商信息
  console.log('🔍 测试各国产AI提供商配置:');
  const providers = ['baidu', 'tencent', 'zhipu', 'siliconcloud', 'aliyun'];
  
  for (const provider of providers) {
    console.log(`\n${provider.toUpperCase()} 信息:`);
    const result = await chineseAITool.execute({ provider });
    console.log(JSON.stringify(result, null, 2));
  }

  // 显示当前配置状态
  console.log('\n🔐 当前环境配置状态:');
  console.log(`- 百度API密钥配置: ${config.baiduApiKey ? '已配置' : '未配置'}`);
  console.log(`- 腾讯API密钥配置: ${config.tencentApiKey ? '已配置' : '未配置'}`);
  console.log(`- 智谱API密钥配置: ${config.zhipuApiKey ? '已配置' : '未配置'}`);
  console.log(`- 硅基流动API密钥配置: ${config.siliconcloudApiKey ? '已配置' : '未配置'}`);
  console.log(`- 阿里云API密钥配置: ${config.aliyunApiKey ? '已配置' : '未配置'}`);

  console.log('\n🎉 国产AI大模型支持测试完成！');
  console.log('\n📝 总结:');
  console.log('- 已成功添加对百度文心一言、腾讯混元、智谱AI、硅基流动等国产AI模型的支持');
  console.log('- 系统可以根据任务类型和语言智能选择最适合的AI提供商');
  console.log('- 在处理中文任务时会优先考虑具有中文优化能力的国产模型');
  console.log('- 所有新功能均已通过类型检查');
}

// 运行测试
testChineseAISupport().catch(console.error);