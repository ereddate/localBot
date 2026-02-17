/**
 * 客户关系管理(CRM)业务流程模型
 * 包括客户获取、关系维护、满意度提升和忠诚度管理等全流程自动化
 */

import { WorkflowDefinition } from '../tasks/WorkflowEngine';
import { Tool } from '../types';

export interface CRMData {
  customerId: string;
  customerSegment: string;
  contactHistory: string[];
  purchaseHistory: string[];
  satisfactionScore: number;
  lifetimeValue: number;
}

// 客户获取流程
export const customerAcquisitionProcess: WorkflowDefinition = {
  id: 'customer-acquisition-process',
  name: '客户获取流程',
  description: '从潜在客户识别到转化成交的完整客户获取流程',
  steps: [
    {
      id: 'lead-generation',
      tool: 'marketing_automation',
      params: {
        operation: 'generate_leads',
        channels: ['digital_ads', 'content_marketing', 'referrals', 'events', 'social_media'],
        targetAudience: '{{ideal_customer_profile.result.profile}}',
        leadScoringCriteria: true
      },
      description: '线索生成'
    },
    {
      id: 'lead-qualification',
      tool: 'data_analysis',
      params: {
        operation: 'qualify_leads',
        leads: '{{lead-generation.result.generated_leads}}',
        qualificationCriteria: ['budget', 'authority', 'need', 'timeline'],
        scoringModel: 'bantd_model'
      },
      description: '线索资格认证',
      dependsOn: ['lead-generation']
    },
    {
      id: 'lead-enrichment',
      tool: 'data_collection',
      params: {
        operation: 'enrich_lead_data',
        qualifiedLeads: '{{lead-qualification.result.qualified_leads}}',
        dataSources: ['public_records', 'social_profiles', 'company_databases', 'news'],
        enrichmentFields: ['role', 'company_size', 'industry', 'decision_process']
      },
      description: '线索丰富化',
      dependsOn: ['lead-qualification']
    },
    {
      id: 'lead-nurturing',
      tool: 'marketing_automation',
      params: {
        operation: 'nurture_leads',
        enrichedLeads: '{{lead-enrichment.result.enriched_leads}}',
        nurtureSequence: ['educational_content', 'case_studies', 'product_demo', 'trial_access'],
        cadence: 'weekly_communication'
      },
      description: '线索培育',
      dependsOn: ['lead-enrichment']
    },
    {
      id: 'sales-handoff',
      tool: 'crm_operations',
      params: {
        operation: 'handoff_to_sales',
        readyLeads: '{{lead-nurturing.result.sales_ready_leads}}',
        salesRep: '{{territory_assignment.result.assigned_rep}}',
        handoffInfo: '{{lead-enrichment.result.lead_profile}}'
      },
      description: '销售移交',
      dependsOn: ['lead-nurturing']
    },
    {
      id: 'conversion-tracking',
      tool: 'analytics_engine',
      params: {
        operation: 'track_conversion_metrics',
        conversionPoints: ['lead_to_mql', 'mql_to_sql', 'sql_to_opportunity', 'opportunity_to_customer'],
        attributionModel: 'multi_touch_attribution',
        roiAnalysis: true
      },
      description: '转化追踪',
      dependsOn: ['sales-handoff']
    }
  ]
};

// 客户关系维护流程
export const customerRelationshipManagementProcess: WorkflowDefinition = {
  id: 'customer-relationship-management-process',
  name: '客户关系维护流程',
  description: '持续维护和发展客户关系的全流程',
  steps: [
    {
      id: 'customer-profiling',
      tool: 'data_analysis',
      params: {
        operation: 'create_customer_profile',
        customerData: '{{customer_acquisition.result.customer_information}}',
        profileAttributes: ['demographics', 'psychographics', 'behavioral_patterns', 'purchase_history'],
        segmentationCriteria: true
      },
      description: '客户画像构建'
    },
    {
      id: 'interaction-history-tracking',
      tool: 'crm_operations',
      params: {
        operation: 'track_interactions',
        interactionTypes: ['calls', 'emails', 'meetings', 'support_tickets', 'web_visits'],
        channels: ['phone', 'email', 'chat', 'social', 'in_person'],
        sentimentAnalysis: true
      },
      description: '互动历史追踪',
      dependsOn: ['customer-profiling']
    },
    {
      id: 'customer-value-analysis',
      tool: 'analytics_engine',
      params: {
        operation: 'analyze_customer_value',
        metrics: ['rfm_analysis', 'clv_calculation', 'profitability_analysis', 'growth_potential'],
        customerSegment: '{{customer-profiling.result.segment}}',
        trendAnalysis: true
      },
      description: '客户价值分析',
      dependsOn: ['interaction-history-tracking']
    },
    {
      id: 'personalized-engagement',
      tool: 'marketing_automation',
      params: {
        operation: 'create_personalized_engagements',
        customerProfile: '{{customer-profiling.result.profile}}',
        engagementChannels: ['email', 'sms', 'push_notifications', 'direct_mail'],
        contentRelevance: '{{customer-value-analysis.result.preferences}}'
      },
      description: '个性化参与',
      dependsOn: ['customer-value-analysis']
    },
    {
      id: 'upselling-crossselling',
      tool: 'recommendation_engine',
      params: {
        operation: 'generate_product_recommendations',
        customerHistory: '{{interaction-history-tracking.result.history}}',
        purchasePatterns: '{{customer-value-analysis.result.patterns}}',
        recommendationAlgorithms: ['collaborative_filtering', 'content_based', 'hybrid_approach']
      },
      description: '交叉销售和追加销售',
      dependsOn: ['personalized-engagement']
    },
    {
      id: 'relationship-health-monitoring',
      tool: 'analytics_engine',
      params: {
        operation: 'monitor_relationship_health',
        indicators: ['engagement_frequency', 'satisfaction_scores', 'churn_risk', 'advocacy_level'],
        earlyWarningSigns: true,
        interventionTriggers: true
      },
      description: '关系健康度监控',
      dependsOn: ['upselling-crossselling']
    }
  ]
};

// 客户满意度提升流程
export const customerSatisfactionImprovementProcess: WorkflowDefinition = {
  id: 'customer-satisfaction-improvement-process',
  name: '客户满意度提升流程',
  description: '系统性提升客户满意度和体验的流程',
  steps: [
    {
      id: 'feedback-collection',
      tool: 'survey_tool',
      params: {
        operation: 'collect_customer_feedback',
        feedbackChannels: ['nps_survey', 'csat_survey', 'ces_survey', 'review_sites', 'support_chats'],
        collectionTiming: ['post_interaction', 'periodic_check-ins', 'milestone_events'],
        multilingualSupport: true
      },
      description: '反馈收集'
    },
    {
      id: 'sentiment-analysis',
      tool: 'nlp_engine',
      params: {
        operation: 'analyze_sentiment',
        feedbackData: '{{feedback-collection.result.raw_feedback}}',
        sentimentCategories: ['positive', 'neutral', 'negative'],
        emotionDetection: true
      },
      description: '情感分析',
      dependsOn: ['feedback-collection']
    },
    {
      id: 'experience-gap-analysis',
      tool: 'data_analysis',
      params: {
        operation: 'identify_experience_gaps',
        expectedExperience: '{{customer_profiling.result.expectations}}',
        actualExperience: '{{feedback-collection.result.experience_data}}',
        gapPrioritization: true
      },
      description: '体验差距分析',
      dependsOn: ['sentiment-analysis']
    },
    {
      id: 'issue-resolution',
      tool: 'ticketing_system',
      params: {
        operation: 'resolve_customer_issues',
        issues: '{{experience-gap-analysis.result.identified_issues}}',
        resolutionPriority: '{{sentiment-analysis.result.sentiment_urgency}}',
        escalationPaths: true
      },
      description: '问题解决',
      dependsOn: ['experience-gap-analysis']
    },
    {
      id: 'service-personalization',
      tool: 'recommendation_engine',
      params: {
        operation: 'customize_service_delivery',
        customerPreferences: '{{customer-profiling.result.preferences}}',
        serviceTouchpoints: ['onboarding', 'support', 'billing', 'communication'],
        customizationRules: true
      },
      description: '服务个性化',
      dependsOn: ['issue-resolution']
    },
    {
      id: 'satisfaction-monitoring',
      tool: 'analytics_engine',
      params: {
        operation: 'monitor_satisfaction_trends',
        metrics: ['nps', 'csat', 'ces', 'retention_rate', 'advocacy_score'],
        benchmarkComparison: true,
        predictiveAnalytics: true
      },
      description: '满意度监控',
      dependsOn: ['service-personalization']
    }
  ]
};

// 客户忠诚度管理流程
export const customerLoyaltyManagementProcess: WorkflowDefinition = {
  id: 'customer-loyalty-management-process',
  name: '客户忠诚度管理流程',
  description: '建立和维护客户忠诚度的全面流程',
  steps: [
    {
      id: 'loyalty-program-design',
      tool: 'program_design_tool',
      params: {
        operation: 'design_loyalty_program',
        programType: ['points_based', 'tiered', 'paid_membership', 'value_added_services'],
        rewardStructure: '{{customer_value_analysis.result.segment_preferences}}',
        gamificationElements: true
      },
      description: '忠诚度计划设计'
    },
    {
      id: 'program-enrollment',
      tool: 'crm_operations',
      params: {
        operation: 'facilitate_program_enrollment',
        eligibleCustomers: '{{customer_segmentation.result.high_value_segments}}',
        enrollmentChannels: ['website', 'mobile_app', 'in_store', 'email_invitation'],
        onboardingProcess: true
      },
      description: '计划注册',
      dependsOn: ['loyalty-program-design']
    },
    {
      id: 'reward-redemption',
      tool: 'loyalty_platform',
      params: {
        operation: 'manage_reward_redemptions',
        customerRewards: '{{program-enrollment.result.earned_rewards}}',
        redemptionOptions: ['discounts', 'products', 'experiences', 'exclusive_access'],
        redemptionTracking: true
      },
      description: '奖励兑换',
      dependsOn: ['program-enrollment']
    },
    {
      id: 'engagement-campaigns',
      tool: 'marketing_automation',
      params: {
        operation: 'run_engagement_campaigns',
        campaignTypes: ['rewards_promotions', 'exclusive_events', 'early_access', 'community_building'],
        targetSegments: '{{loyalty-program-design.result.program_segments}}',
        personalizationLevel: true
      },
      description: '参与活动',
      dependsOn: ['reward-redemption']
    },
    {
      id: 'advocacy-development',
      tool: 'influence_engine',
      params: {
        operation: 'cultivate_brand_advocates',
        potentialAdvocates: '{{satisfaction-monitoring.result.highest_rated_customers}}',
        advocacyActivities: ['referral_programs', 'case_studies', 'reviews', 'social_sharing'],
        incentiveStructures: true
      },
      description: '拥护者发展',
      dependsOn: ['engagement-campaigns']
    },
    {
      id: 'retention-strategy',
      tool: 'churn_prediction_model',
      params: {
        operation: 'implement_retention_strategies',
        atRiskCustomers: '{{relationship-health-monitoring.result.churn_indicators}}',
        retentionTactics: ['winback_campaigns', 'value_proposition_refresh', 'relationship_recovery'],
        successMetrics: true
      },
      description: '留存策略',
      dependsOn: ['advocacy-development']
    },
    {
      id: 'loyalty-analytics',
      tool: 'analytics_engine',
      params: {
        operation: 'analyze_loyalty_metrics',
        metrics: ['retention_rate', 'churn_rate', 'ltv_growth', 'referral_rate', 'engagement_level'],
        cohortAnalysis: true,
        roiOfLoyaltyProgram: true
      },
      description: '忠诚度分析',
      dependsOn: ['retention-strategy']
    }
  ]
};