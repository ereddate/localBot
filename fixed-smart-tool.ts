/**
 * 修复智能工具推荐系统
 */

// 工具推荐配置
const TOOL_RECOMMENDATION_RULES: Record<string, any> = {
  location_queries: {
    keywords: ['我在哪', '我的位置', '我在哪里', '当前位置', 'location', 'where am i', '定位', '坐标', '经纬度', '附近', '周围', '地理', '地址', 'place', '位置'],
    recommended_tool: 'advanced_location_service',
    confidence_threshold: 1, // 至少匹配1个关键词就推荐
    description: '当用户询问位置相关信息时，建议使用高级定位服务'
  }
};

function analyzeQueryAndRecommendTools(userQuery: string, availableTools: any[]) {
  const recommendations = [];
  
  for (const [ruleName, rule] of Object.entries(TOOL_RECOMMENDATION_RULES)) {
    const { keywords, recommended_tool, confidence_threshold, description } = rule;
    
    // 计算查询与规则的匹配度 - 修正算法
    const matchedKeywords = keywords.filter((keyword: string) => 
      userQuery.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // 修正：只要匹配到至少一个关键词就认为符合条件
    const matchesFound = matchedKeywords.length;
    
    if (matchesFound >= confidence_threshold) {
      // 检查推荐的工具是否可用
      const toolAvailable = availableTools.some((tool: any) => tool.name === recommended_tool);
      
      if (toolAvailable) {
        recommendations.push({
          rule: ruleName,
          tool: recommended_tool,
          confidence: matchesFound,
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
 */
function injectToolRecommendationsToPrompt(basePrompt: string, userQuery: string, availableTools: any[]) {
  const recommendations = analyzeQueryAndRecommendTools(userQuery, availableTools);
  
  if (recommendations.length > 0) {
    const recommendationText = recommendations.map(rec => 
      `- 对于"${rec.description}"，可考虑使用工具: ${rec.tool} (匹配关键词: ${rec.matched_keywords.join(', ')})`
    ).join('\n');
    
    return `${basePrompt}\n\n## 智能工具推荐\n针对您的查询 "${userQuery}"，以下工具可能有所帮助：\n${recommendationText}\n\n注意：这些仅是建议，您可以根据具体情况决定是否使用这些工具。`;
  }
  
  return basePrompt;
}

// 测试
console.log('=== 修复后的智能工具推荐系统 ===\n');

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