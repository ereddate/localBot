/**
 * AI自主决策增强方案
 * 完全让AI大模型自主判断何时使用何种本地技能或自动化模型
 * 不使用任何硬编码规则
 */

/**
 * 增强系统提示词，提供更多上下文信息
 * 让AI自行判断何时使用何种工具
 */
function buildEnhancedSystemPromptWithContext(availableTools: any[], conversationContext: string = '') {
  // 按类别组织工具信息
  const toolsByCategory: Record<string, any[]> = {};
  availableTools.forEach(tool => {
    const category = tool.category || 'general';
    if (!toolsByCategory[category]) {
      toolsByCategory[category] = [];
    }
    toolsByCategory[category].push(tool);
  });

  let toolsInfo = '';
  for (const [category, tools] of Object.entries(toolsByCategory)) {
    toolsInfo += `\n### ${category.toUpperCase()} Tools:\n`;
    tools.forEach(tool => {
      toolsInfo += `- **${tool.name}**: ${tool.description}\n`;
    });
  }

  // 构建增强的系统提示词
  return `You are an intelligent AI assistant with access to local tools and memory systems.

## Available Tools
${toolsInfo || 'No tools available'}

## Context Information
Recent conversation context: ${conversationContext || 'No recent context'}

## Tool Usage Guidelines
- Use tools when they can help fulfill the user's request
- Consider which tool is most appropriate for the current task
- Feel free to chain multiple tools together if needed
- Always explain to the user what you're doing and why
- Prioritize user safety and privacy when selecting tools

## Decision Making
When deciding whether to use a tool:
1. Analyze the user's request carefully
2. Consider which of the available tools could best address the request
3. Make an autonomous decision based on the context and requirements
4. Execute the most appropriate tool(s) to fulfill the request

Remember: You have full autonomy to decide when and how to use these tools based on the user's needs and the conversation context.`;
}

/**
 * 示例：如何使用增强的系统提示词
 */
function demonstrateAIAutonomousDecision() {
  console.log('=== AI自主决策增强方案 ===\n');
  
  // 模拟可用的工具集
  const availableTools = [
    { 
      name: 'advanced_location_service', 
      description: '高级定位服务，提供GPS坐标获取、附近地点搜索、实时定位等功能', 
      category: 'location-services' 
    },
    { 
      name: 'file_tool', 
      description: '文件操作工具，支持文件读写、搜索、管理等操作', 
      category: 'file-system' 
    },
    { 
      name: 'shell_tool', 
      description: '命令行工具，可执行系统命令', 
      category: 'system' 
    },
    { 
      name: 'calendar_event_tool', 
      description: '日历事件工具，可创建、查询、管理日程安排', 
      category: 'productivity' 
    }
  ];
  
  // 模拟不同的用户查询
  const sampleQueries = [
    '我在哪',
    '帮我创建一个会议安排',
    '查找我的文档文件夹里的PDF文件',
    '系统运行状态如何'
  ];
  
  sampleQueries.forEach(query => {
    console.log(`用户查询: "${query}"`);
    const enhancedPrompt = buildEnhancedSystemPromptWithContext(availableTools, query);
    console.log('AI可根据此上下文自主决定使用何种工具...\n');
    
    // 这里实际的AI模型会根据增强的提示词自主决定使用哪个工具
    // 而不是通过硬编码规则强制执行
  });
  
  console.log('方案特点：');
  console.log('1. AI完全自主决策何时使用何种工具');
  console.log('2. 通过丰富的上下文信息帮助AI做出更好的判断');
  console.log('3. 没有任何硬编码的规则或强制执行逻辑');
  console.log('4. AI可以根据具体情境灵活选择最合适的工具');
}

// 运行演示
demonstrateAIAutonomousDecision();