/**
 * API功能测试脚本
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testApi() {
  console.log('🧪 开始测试LocalBot统一API服务...\n');
  
  try {
    // 测试健康检查
    console.log('🔍 测试健康检查端点...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ 健康检查响应:', healthResponse.data);
    console.log('');
    
    // 测试会话管理
    console.log('👥 测试会话管理端点...');
    const sessionId = 'test-session-' + Date.now();
    
    // 获取不存在的会话（应该返回404）
    try {
      const sessionResponse = await axios.get(`${BASE_URL}/api/v1/session/${sessionId}`);
      console.log('✅ 会话获取响应:', sessionResponse.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('✅ 正确返回404错误，会话不存在:', error.response.data);
      } else {
        console.log('❌ 会话获取错误:', error.response?.data || error.message);
      }
    }
    console.log('');
    
    // 测试获取所有会话
    console.log('📋 测试获取所有会话...');
    const sessionsResponse = await axios.get(`${BASE_URL}/api/v1/sessions`);
    console.log('✅ 所有会话响应:', sessionsResponse.data);
    console.log('');
    
    // 测试消息处理（会因为缺少sessionId或content而失败）
    console.log('💬 测试消息处理端点...');
    try {
      const messageResponse = await axios.post(`${BASE_URL}/api/v1/message`, {});
      console.log('❌ 消息处理应该失败但没有:', messageResponse.data);
    } catch (error: any) {
      if (error.response?.status === 400) {
        console.log('✅ 正确返回400错误，缺少必要参数:', error.response.data);
      } else {
        console.log('❌ 消息处理错误:', error.response?.data || error.message);
      }
    }
    console.log('');
    
    // 测试消息处理（提供完整参数）
    console.log('📝 测试消息处理端点（带参数）...');
    try {
      const messageResponse = await axios.post(`${BASE_URL}/api/v1/message`, {
        sessionId: 'test-session-' + Date.now(),
        content: '你好，这是一个测试消息'
      });
      console.log('✅ 消息处理响应:', messageResponse.data);
    } catch (error: any) {
      console.log('⚠️ 消息处理错误（可能是因为AI模型配置）:', error.response?.data || error.message);
    }
    console.log('');
    
    console.log('🎉 API测试完成！');
    
  } catch (error) {
    console.error('❌ API测试失败:', error);
  }
}

// 运行测试
testApi();