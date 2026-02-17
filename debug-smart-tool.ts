/**
 * 调试智能工具推荐系统
 */

// 工具推荐配置
const TOOL_RECOMMENDATION_RULES: Record<string, any> = {
  location_queries: {
    keywords: ['我在哪', '我的位置', '我在哪里', '当前位置', 'location', 'where am i', '定位', '坐标', '经纬度', '附近', '周围', '地理', '地址', 'place', '位置'],
    recommended_tool: 'advanced_location_service',
    confidence_threshold: 0.3, // 降低阈值便于测试
    description: '当用户询问位置相关信息时，建议使用高级定位服务'
  }
};

function analyzeQueryAndRecommendTools(userQuery: string, availableTools: any[]) {
  const recommendations = [];
  
  console.log(`分析查询: "${userQuery}"`);
  console.log(`可用工具: ${availableTools.map((t: any) => t.name).join(', ')}`);
  
  for (const [ruleName, rule] of Object.entries(TOOL_RECOMMENDATION_RULES)) {
    const { keywords, recommended_tool, confidence_threshold, description } = rule;
    
    console.log(`\n检查规则: ${ruleName}`);
    console.log(`关键词: ${keywords.join(', ')}`);
    console.log(`推荐工具: ${recommended_tool}`);
    console.log(`阈值: ${confidence_threshold}`);
    
    // 计算查询与规则的匹配度
    const matchedKeywords = keywords.filter((keyword: string) => {
      const isMatch = userQuery.toLowerCase().includes(keyword.toLowerCase());
      if (isMatch) console.log(`  匹配到关键词: "${keyword}"`);
      return isMatch;
    });
    
    console.log(`匹配到的关键词数量: ${matchedKeywords.length}`);
    console.log(`总关键词数量: ${keywords.length}`);
    
    const matchRatio = matchedKeywords.length / keywords.length;
    console.log(`匹配比例: ${matchRatio}`);
    
    if (matchRatio >= confidence_threshold) {
      console.log(`匹配比例(${matchRatio}) >= 阈值(${confidence_threshold})`);
      
      // 检查推荐的工具是否可用
      const toolAvailable = availableTools.some((tool: any) => tool.name === recommended_tool);
      console.log(`工具"${recommended_tool}"是否可用: ${toolAvailable}`);
      
      if (toolAvailable) {
        recommendations.push({
          rule: ruleName,
          tool: recommended_tool,
          confidence: matchRatio,
          description,
          matched_keywords: matchedKeywords
        });
      } else {
        console.log(`工具"${recommended_tool}"不可用，跳过推荐`);
      }
    } else {
      console.log(`匹配比例(${matchRatio}) < 阈值(${confidence_threshold})，不符合条件`);
    }
  }
  
  return recommendations;
}

// 测试
console.log('=== 调试智能工具推荐系统 ===\n');

const sampleQuery = '我在哪';
const availableTools = [
  { name: 'advanced_location_service', description: '高级定位服务' },
  { name: 'file_tool', description: '文件操作工具' }
];

const recommendations = analyzeQueryAndRecommendTools(sampleQuery, availableTools);
console.log('\n最终推荐结果:', JSON.stringify(recommendations, null, 2));