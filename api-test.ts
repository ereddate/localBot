/**
 * API服务测试入口文件
 */
import { ApiService } from './src/api/ApiService';

console.log('🚀 启动LocalBot统一API服务...');
console.log('💡 正在初始化API服务...');

try {
  // 创建并启动API服务
  const apiService = new ApiService(3000);
  apiService.start();
  
  console.log('✅ API服务启动成功！');
} catch (error) {
  console.error('❌ API服务启动失败:', error);
}