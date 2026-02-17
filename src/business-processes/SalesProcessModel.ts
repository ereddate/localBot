/**
 * 销售业务流程模型
 * 包含客户管理、销售机会跟踪、报价生成、合同签署等流程
 */

import { WorkflowDefinition } from '../tasks/WorkflowEngine';
import { Tool } from '../types';

export interface SalesProcessData {
  customerId: string;
  opportunityId: string;
  quoteAmount: number;
  contractValue: number;
  closeProbability: number;
}

// 客户开发流程
export const customerDevelopmentProcess: WorkflowDefinition = {
  id: 'customer-development-process',
  name: '客户开发流程',
  description: '从潜在客户到成交客户的完整流程',
  steps: [
    {
      id: 'identify-prospect',
      tool: 'crm_operations',
      params: {
        operation: 'create_lead',
        source: 'marketing',
        initialContact: true
      },
      description: '识别并录入潜在客户'
    },
    {
      id: 'qualification-call',
      tool: 'crm_operations',
      params: {
        operation: 'update_lead',
        status: 'qualified',
        qualificationNotes: '初步沟通完成，符合购买条件'
      },
      description: '资格认证通话',
      dependsOn: ['identify-prospect']
    },
    {
      id: 'needs-analysis',
      tool: 'crm_operations',
      params: {
        operation: 'create_activity',
        activityType: 'meeting',
        subject: '需求分析会议',
        notes: '深入了解客户需求'
      },
      description: '需求分析',
      dependsOn: ['qualification-call']
    },
    {
      id: 'proposal-preparation',
      tool: 'document_generator',
      params: {
        template: 'sales_proposal_template',
        data: {
          clientInfo: '{{needs-analysis.result.client_info}}',
          proposedSolution: '{{needs-analysis.result.solution_requirements}}'
        }
      },
      description: '准备提案',
      dependsOn: ['needs-analysis']
    },
    {
      id: 'quote-generation',
      tool: 'financial_calculator',
      params: {
        operation: 'roi',
        principal: '{{proposal-preparation.result.cost_estimate}}',
        rate: '{{proposal-preparation.result.expected_return}}'
      },
      description: '生成报价',
      dependsOn: ['proposal-preparation']
    },
    {
      id: 'presentation',
      tool: 'crm_operations',
      params: {
        operation: 'schedule_meeting',
        meetingType: 'presentation',
        attendees: ['sales_rep', 'prospect_decision_maker']
      },
      description: '产品演示',
      dependsOn: ['quote-generation']
    },
    {
      id: 'follow-up',
      tool: 'notification_send',
      params: {
        type: 'email',
        recipient: '{{presentation.result.prospect_email}}',
        subject: '感谢您参加我们的产品演示',
        message: '附件是演示文稿和报价单'
      },
      description: '后续跟进',
      dependsOn: ['presentation']
    },
    {
      id: 'close-deal',
      tool: 'crm_operations',
      params: {
        operation: 'convert_lead_to_opportunity',
        probability: 90
      },
      description: '关闭交易',
      dependsOn: ['follow-up']
    }
  ]
};

// 销售机会管理流程
export const opportunityManagementProcess: WorkflowDefinition = {
  id: 'opportunity-management-process',
  name: '销售机会管理流程',
  description: '管理销售机会从创建到关闭的全过程',
  steps: [
    {
      id: 'create-opportunity',
      tool: 'crm_operations',
      params: {
        operation: 'create_opportunity',
        stage: 'prospecting',
        probability: 10
      },
      description: '创建销售机会'
    },
    {
      id: 'qualify-opportunity',
      tool: 'crm_operations',
      params: {
        operation: 'update_opportunity',
        stage: 'qualification',
        probability: 25,
        requirements: '{{create-opportunity.result.customer_requirements}}'
      },
      description: '机会资格认证',
      dependsOn: ['create-opportunity']
    },
    {
      id: 'needs-validation',
      tool: 'crm_operations',
      params: {
        operation: 'create_activity',
        activityType: 'discovery_call',
        subject: '需求验证会议'
      },
      description: '需求验证',
      dependsOn: ['qualify-opportunity']
    },
    {
      id: 'solution-design',
      tool: 'document_generator',
      params: {
        template: 'solution_design_template',
        data: {
          validatedRequirements: '{{needs-validation.result.requirements}}',
          proposedFeatures: '{{needs-validation.result.feature_match}}'
        }
      },
      description: '解决方案设计',
      dependsOn: ['needs-validation']
    },
    {
      id: 'proposal-submission',
      tool: 'spreadsheet_operations',
      params: {
        operation: 'create_quote',
        items: '{{solution-design.result.solution_components}}',
        amounts: '{{solution-design.result.pricing}}'
      },
      description: '提交提案',
      dependsOn: ['solution-design']
    },
    {
      id: 'negotiation',
      tool: 'crm_operations',
      params: {
        operation: 'update_opportunity',
        stage: 'proposal',
        probability: 60,
        negotiationPoints: '{{proposal-submission.result.negotiation_items}}'
      },
      description: '谈判阶段',
      dependsOn: ['proposal-submission']
    },
    {
      id: 'contract-preparation',
      tool: 'document_generator',
      params: {
        template: 'contract_template',
        data: {
          terms: '{{negotiation.result.agreed_terms}}',
          pricing: '{{proposal-submission.result.final_pricing}}'
        }
      },
      description: '准备合同',
      dependsOn: ['negotiation']
    },
    {
      id: 'deal-closing',
      tool: 'crm_operations',
      params: {
        operation: 'close_opportunity',
        status: 'won',
        probability: 100
      },
      description: '关闭交易',
      dependsOn: ['contract-preparation']
    }
  ]
};

// 销售业绩分析流程
export const salesPerformanceAnalysisProcess: WorkflowDefinition = {
  id: 'sales-performance-analysis-process',
  name: '销售业绩分析流程',
  description: '定期分析销售团队和个人的业绩表现',
  steps: [
    {
      id: 'collect-sales-data',
      tool: 'database_query',
      params: {
        query: 'SELECT * FROM sales_records WHERE period = CURRENT_MONTH'
      },
      description: '收集销售数据'
    },
    {
      id: 'calculate-kpis',
      tool: 'financial_calculator',
      params: {
        operation: 'calculate_metrics',
        metrics: ['revenue', 'conversion_rate', 'avg_deal_size', 'sales_cycle']
      },
      description: '计算关键指标',
      dependsOn: ['collect-sales-data']
    },
    {
      id: 'compare-targets',
      tool: 'spreadsheet_operations',
      params: {
        operation: 'compare_values',
        actual: '{{calculate-kpis.result.values}}',
        targets: 'monthly_targets',
        variance: true
      },
      description: '对比目标',
      dependsOn: ['calculate-kpis']
    },
    {
      id: 'generate-insights',
      tool: 'business_intelligence',
      params: {
        analysisType: 'trend_analysis',
        data: '{{compare-targets.result.comparison_data}}'
      },
      description: '生成洞察',
      dependsOn: ['compare-targets']
    },
    {
      id: 'create-dashboard',
      tool: 'business_intelligence',
      params: {
        visualizationType: 'dashboard',
        metrics: ['revenue_by_rep', 'conversion_by_stage', 'pipeline_velocity']
      },
      description: '创建仪表板',
      dependsOn: ['generate-insights']
    },
    {
      id: 'send-reports',
      tool: 'notification_send',
      params: {
        type: 'email',
        recipient: 'sales_managers',
        subject: '月度销售业绩报告',
        attachments: ['{{create-dashboard.result.dashboard_file}}']
      },
      description: '发送报告',
      dependsOn: ['create-dashboard']
    }
  ]
};