import { MarketAnalysisTool } from './src/skills/MarketAnalysisTool';

async function testMarketAnalysis() {
  const tool = new MarketAnalysisTool();
  
  console.log('Testing market analysis for gold (GC=F)...');
  
  const result = await tool.execute({
    symbol: 'GC=F',  // Gold futures
    period: 'DAILY',
    include_forecast: true
  });
  
  console.log('Result:', JSON.stringify(result, null, 2));
}

testMarketAnalysis().catch(console.error);