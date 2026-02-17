/**
 * 智能工具推荐系统
 * 旨在帮助AI模型更好地识别何时使用特定工具
 * 而不是通过硬编码规则强制执行
 */

// 工具推荐配置
const TOOL_RECOMMENDATION_RULES: Record<string, any> = {
  location_queries: {
    keywords: ['我在哪', '我的位置', '我在哪里', '当前位置', 'location', 'where am i', '定位', '坐标', '经纬度', '附近', '周围', '地理', '地址', 'place', '位置'],
    recommended_tool: 'advanced_location_service',
    confidence_threshold: 0.8, // 置信度阈值
    description: '当用户询问位置相关信息时，建议使用高级定位服务'
  },
  // 其他类型的查询可以在这里添加
  file_queries: {
    keywords: ['文件', 'file', '文档', 'document', '查找', 'search', '查找文件'],
    recommended_tool: 'file_tool',
    confidence_threshold: 0.7,
    description: '当用户询问文件相关操作时，建议使用文件工具'
  }
};

/**
 * 分析用户查询并推荐可能使用的工具
 * 这是一种辅助机制，而不是强制规则
 * AI模型可以选择是否采纳这些建议
 */
function analyzeQueryAndRecommendTools(userQuery: string, availableTools: any[]) {
  const recommendations = [];
  
  for (const [ruleName, rule] of Object.entries(TOOL_RECOMMENDATION_RULES)) {
    const { keywords, recommended_tool, confidence_threshold, description } = rule;
    
    // 计算查询与规则的匹配度
    const matchedKeywords = keywords.filter((keyword: string) => 
      userQuery.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const matchRatio = matchedKeywords.length / keywords.length;
    
    if (matchRatio >= confidence_threshold) {
      // 检查推荐的工具是否可用
      const toolAvailable = availableTools.some((tool: any) => tool.name === recommended_tool);
      
      if (toolAvailable) {
        recommendations.push({
          rule: ruleName,
          tool: recommended_tool,
          confidence: matchRatio,
          description,
          matched_keywords: matchedKeywords
        });
      }
    }
  }
  
  return recommendations;
}

/**
 * 在系统提示词中注入工具推荐信息
 * 这样AI模型就能了解哪些工具可能适用于特定类型的查询
 */
function injectToolRecommendationsToPrompt(basePrompt: string, userQuery: string, availableTools: any[]) {
  const recommendations = analyzeQueryAndRecommendTools(userQuery, availableTools);
  
  if (recommendations.length > 0) {
    const recommendationText = recommendations.map(rec => 
      `- 对于"${rec.description}"，可考虑使用工具: ${rec.tool}`
    ).join('\n');
    
    return `${basePrompt}\n\n## 智能工具推荐\n针对您的查询 "${userQuery}"，以下工具可能有所帮助：\n${recommendationText}\n\n注意：这些仅是建议，您可以根据具体情况决定是否使用这些工具。`;
  }
  
  return basePrompt;
}

// 示例使用
console.log('=== 智能工具推荐系统演示 ===\n');

const sampleQuery = '我在哪';
const availableTools = [
  { name: 'advanced_location_service', description: '高级定位服务，提供GPS坐标获取、附近地点搜索、实时定位等功能' },
  { name: 'file_tool', description: '文件操作工具' },
  { name: 'shell_tool', description: '命令行工具' }
];

console.log(`用户查询: "${sampleQuery}"`);
const recommendations = analyzeQueryAndRecommendTools(sampleQuery, availableTools);
console.log('工具推荐结果:', JSON.stringify(recommendations, null, 2));

console.log('\n--- 系统提示词增强 ---');
const basePrompt = 'You are an intelligent AI assistant with access to local tools.';
const enhancedPrompt = injectToolRecommendationsToPrompt(basePrompt, sampleQuery, availableTools);
console.log(enhancedPrompt);

console.log('\n这种方案的优势：');
console.log('1. 不是硬编码的规则，AI仍可以自主决策');
console.log('2. 提供上下文建议，帮助AI更好理解何时使用特定工具');
console.log('3. 可扩展，可以添加更多类型的查询规则');
console.log('4. 保持了AI的灵活性和智能性');