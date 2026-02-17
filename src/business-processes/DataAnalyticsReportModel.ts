/**
 * 数据分析和报告业务流程模型
 * 包括数据收集、处理、分析、可视化和报告分发等全流程自动化
 */

import { WorkflowDefinition } from '../tasks/WorkflowEngine';
import { Tool } from '../types';

export interface DataAnalyticsReportData {
  dataSource: string;
  analysisType: string;
  reportFormat: string;
  audience: string[];
  frequency: string;
  dataPeriod: string;
}

// 数据收集与整合流程
export const dataCollectionIntegrationProcess: WorkflowDefinition = {
  id: 'data-collection-integration-process',
  name: '数据收集与整合流程',
  description: '从多个来源收集数据并进行清洗和整合的流程',
  steps: [
    {
      id: 'data-source-identification',
      tool: 'data_discovery_tool',
      params: {
        operation: 'identify_data_sources',
        sourceTypes: ['databases', 'apis', 'files', 'streams', 'external_sources'],
        dataCategories: ['operational', 'financial', 'customer', 'market', 'social'],
        qualityAssessment: true
      },
      description: '数据源识别'
    },
    {
      id: 'data-access-setup',
      tool: 'data_integration_tool',
      params: {
        operation: 'setup_data_access',
        sources: '{{data-source-identification.result.sources}}',
        accessCredentials: '{{security_management.result.credentials}}',
        connectionProtocols: ['rest_api', 'database_connection', 'file_transfer', 'streaming']
      },
      description: '数据访问设置',
      dependsOn: ['data-source-identification']
    },
    {
      id: 'data-extraction',
      tool: 'etl_tool',
      params: {
        operation: 'extract_data',
        sourceSystems: '{{data-access-setup.result.configured_sources}}',
        extractionSchedule: '{{data_requirements.result.frequency_requirements}}',
        extractionMethods: ['full_load', 'incremental', 'cdc']
      },
      description: '数据提取',
      dependsOn: ['data-access-setup']
    },
    {
      id: 'data-quality-assessment',
      tool: 'data_quality_tool',
      params: {
        operation: 'assess_data_quality',
        qualityDimensions: ['accuracy', 'completeness', 'consistency', 'timeliness', 'validity'],
        dataSets: '{{data-extraction.result.extracted_data}}',
        qualityMetrics: true
      },
      description: '数据质量评估',
      dependsOn: ['data-extraction']
    },
    {
      id: 'data-cleaning',
      tool: 'data_cleaning_tool',
      params: {
        operation: 'clean_data',
        dataIssues: '{{data-quality-assessment.result.identified_issues}}',
        cleaningRules: ['remove_duplicates', 'handle_missing_values', 'standardize_formats', 'validate_ranges'],
        transformationSpecifications: true
      },
      description: '数据清洗',
      dependsOn: ['data-quality-assessment']
    },
    {
      id: 'data-transformation',
      tool: 'etl_tool',
      params: {
        operation: 'transform_data',
        transformationRules: '{{data-cleaning.result.applied_rules}}',
        businessLogic: '{{requirements_analysis.result.business_rules}}',
        outputFormat: '{{report_requirements.result.format_specifications}}'
      },
      description: '数据转换',
      dependsOn: ['data-cleaning']
    },
    {
      id: 'data-integration',
      tool: 'data_integration_tool',
      params: {
        operation: 'integrate_data',
        dataSources: '{{data-transformation.result.transformed_data}}',
        integrationMethod: ['union', 'join', 'lookup', 'merge'],
        masterDataManagement: true
      },
      description: '数据整合',
      dependsOn: ['data-transformation']
    },
    {
      id: 'data-validation',
      tool: 'validation_check',
      params: {
        operation: 'validate_integrated_data',
        validationRules: '{{data-integration.result.integration_rules}}',
        integrityChecks: ['referential_integrity', 'constraint_validation', 'cross_table_consistency'],
        accuracyVerification: true
      },
      description: '数据验证',
      dependsOn: ['data-integration']
    }
  ]
};

// 数据分析与挖掘流程
export const dataAnalysisMiningProcess: WorkflowDefinition = {
  id: 'data-analysis-mining-process',
  name: '数据分析与挖掘流程',
  description: '对整合后的数据进行深入分析和挖掘的流程',
  steps: [
    {
      id: 'exploratory-data-analysis',
      tool: 'data_analysis_tool',
      params: {
        operation: 'perform_exploratory_analysis',
        dataSets: '{{data_validation.result.validated_data}}',
        analysisTypes: ['descriptive_statistics', 'distribution_analysis', 'correlation_analysis', 'outlier_detection'],
        visualizationRequirements: true
      },
      description: '探索性数据分析'
    },
    {
      id: 'hypothesis-formulation',
      tool: 'analytics_engine',
      params: {
        operation: 'formulate_analytical_hypotheses',
        businessQuestions: '{{analysis_requirements.result.questions}}',
        dataInsights: '{{exploratory-data-analysis.result.discoveries}}',
        hypothesisStatements: true
      },
      description: '假设形成',
      dependsOn: ['exploratory-data-analysis']
    },
    {
      id: 'statistical-analysis',
      tool: 'statistical_tool',
      params: {
        operation: 'perform_statistical_analysis',
        analysisMethods: ['regression', 'anova', 'chi_square', 'time_series'],
        hypotheses: '{{hypothesis-formulation.result.formulated_hypotheses}}',
        significanceLevels: true
      },
      description: '统计分析',
      dependsOn: ['hypothesis-formulation']
    },
    {
      id: 'predictive-modeling',
      tool: 'machine_learning_tool',
      params: {
        operation: 'build_predictive_models',
        modelTypes: ['classification', 'regression', 'clustering', 'time_series_forecasting'],
        algorithms: ['linear_regression', 'random_forest', 'neural_networks', 'svm'],
        modelEvaluation: true
      },
      description: '预测建模',
      dependsOn: ['statistical-analysis']
    },
    {
      id: 'data-mining',
      tool: 'data_mining_tool',
      params: {
        operation: 'perform_data_mining',
        miningTechniques: ['association_rules', 'sequential_patterns', 'anomaly_detection', 'segmentation'],
        businessContext: '{{business_requirements.result.context}}',
        patternSignificance: true
      },
      description: '数据挖掘',
      dependsOn: ['predictive-modeling']
    },
    {
      id: 'insight-generation',
      tool: 'analytics_engine',
      params: {
        operation: 'generate_actionable_insights',
        analyticalResults: ['{{statistical-analysis.result.outcomes}}', '{{data-mining.result.patterns}}', '{{predictive-modeling.result.predictions}}'],
        businessImplications: true,
        recommendationEngine: true
      },
      description: '洞察生成',
      dependsOn: ['data-mining']
    },
    {
      id: 'model-validation',
      tool: 'validation_check',
      params: {
        operation: 'validate_analytical_models',
        validationMethods: ['cross_validation', 'holdout_validation', 'bootstrapping'],
        performanceMetrics: ['accuracy', 'precision', 'recall', 'f1_score', 'auc'],
        modelStability: true
      },
      description: '模型验证',
      dependsOn: ['insight-generation']
    }
  ]
};

// 数据可视化与仪表板流程
export const dataVisualizationDashboardProcess: WorkflowDefinition = {
  id: 'data-visualization-dashboard-process',
  name: '数据可视化与仪表板流程',
  description: '创建交互式可视化和仪表板以展示分析结果',
  steps: [
    {
      id: 'visualization-requirements',
      tool: 'requirements_analysis_tool',
      params: {
        operation: 'analyze_visualization_requirements',
        audienceTypes: ['executives', 'managers', 'analysts', 'external_stakeholders'],
        dataComplexity: '{{analytical_results.result.complexity_level}}',
        interactivityNeeds: true
      },
      description: '可视化需求分析'
    },
    {
      id: 'chart-type-selection',
      tool: 'visualization_tool',
      params: {
        operation: 'select_appropriate_chart_types',
        dataTypes: ['categorical', 'numerical', 'time_series', 'geospatial', 'hierarchical'],
        messageObjectives: ['comparison', 'composition', 'distribution', 'relationship'],
        audiencePreferences: '{{visualization-requirements.result.preferences}}'
      },
      description: '图表类型选择',
      dependsOn: ['visualization-requirements']
    },
    {
      id: 'dashboard-design',
      tool: 'dashboard_design_tool',
      params: {
        operation: 'design_dashboard_layout',
        designPrinciples: ['clarity', 'focus', 'hierarchy', 'consistency', 'accessibility'],
        layoutRequirements: '{{visualization-requirements.result.layout_needs}}',
        brandingGuidelines: true
      },
      description: '仪表板设计',
      dependsOn: ['chart-type-selection']
    },
    {
      id: 'interactive-features',
      tool: 'dashboard_tool',
      params: {
        operation: 'implement_interactive_features',
        features: ['filters', 'drill_down', 'tooltips', 'highlighting', 'animations'],
        userExperience: '{{visualization-requirements.result.ux_requirements}}',
        responsiveDesign: true
      },
      description: '交互功能实现',
      dependsOn: ['dashboard-design']
    },
    {
      id: 'data-connection',
      tool: 'data_visualization_tool',
      params: {
        operation: 'connect_data_to_visualization',
        dataSources: '{{analytical_results.result.processed_data}}',
        refreshFrequency: '{{reporting_requirements.result.update_schedule}}',
        connectionSecurity: true
      },
      description: '数据连接',
      dependsOn: ['interactive-features']
    },
    {
      id: 'dashboard-creation',
      tool: 'dashboard_tool',
      params: {
        operation: 'create_interactive_dashboard',
        visualElements: '{{chart-type-selection.result.selected_charts}}',
        layout: '{{dashboard-design.result.design_layout}}',
        interactivity: '{{interactive-features.result.implemented_features}}'
      },
      description: '仪表板创建',
      dependsOn: ['data-connection']
    },
    {
      id: 'usability-testing',
      tool: 'testing_tool',
      params: {
        operation: 'test_dashboard_usability',
        testUsers: '{{visualization-requirements.result.target_audience}}',
        usabilityMetrics: ['ease_of_use', 'learnability', 'satisfaction', 'task_completion'],
        feedbackCollection: true
      },
      description: '可用性测试',
      dependsOn: ['dashboard-creation']
    }
  ]
};

// 报告生成与分发流程
export const reportGenerationDistributionProcess: WorkflowDefinition = {
  id: 'report-generation-distribution-process',
  name: '报告生成与分发流程',
  description: '自动生成分析报告并向相关人员分发的流程',
  steps: [
    {
      id: 'report-template-design',
      tool: 'reporting_tool',
      params: {
        operation: 'design_report_templates',
        templateTypes: ['executive_summary', 'detailed_analysis', 'performance_report', 'compliance_report'],
        formattingRequirements: ['branding', 'layout', 'style_guidelines', 'accessibility'],
        dynamicElements: true
      },
      description: '报告模板设计'
    },
    {
      id: 'content-personalization',
      tool: 'content_management_tool',
      params: {
        operation: 'personalize_report_content',
        audienceProfiles: '{{stakeholder_analysis.result.stakeholder_profiles}}',
        informationNeeds: ['high_level_overview', 'detailed_analysis', 'specific_metrics', 'actionable_insights'],
        relevanceScoring: true
      },
      description: '内容个性化',
      dependsOn: ['report-template-design']
    },
    {
      id: 'automated-report-generation',
      tool: 'report_generation_tool',
      params: {
        operation: 'generate_automated_reports',
        dataSources: '{{analytical_results.result.final_outputs}}',
        templates: '{{report-template-design.result.created_templates}}',
        personalizationRules: '{{content-personalization.result.personalization_rules}}'
      },
      description: '自动报告生成',
      dependsOn: ['content-personalization']
    },
    {
      id: 'report-quality-assurance',
      tool: 'qa_tool',
      params: {
        operation: 'ensure_report_quality',
        qualityChecks: ['data_accuracy', 'visual_clarity', 'logical_flow', 'grammar_spelling'],
        validationRules: '{{report_requirements.result.quality_standards}}',
        reviewProcess: true
      },
      description: '报告质量保证',
      dependsOn: ['automated-report-generation']
    },
    {
      id: 'distribution-list-creation',
      tool: 'contact_management_tool',
      params: {
        operation: 'create_distribution_lists',
        stakeholderGroups: ['executives', 'managers', 'analysts', 'external_partners'],
        distributionPreferences: ['email', 'portal_access', 'mobile_app', 'api_integration'],
        accessPermissions: true
      },
      description: '分发列表创建',
      dependsOn: ['report-quality-assurance']
    },
    {
      id: 'scheduling-and-delivery',
      tool: 'scheduling_tool',
      params: {
        operation: 'schedule_and_deliver_reports',
        deliverySchedule: '{{report_requirements.result.frequency_schedule}}',
        deliveryMethods: ['email_attachment', 'secure_portal', 'api_push', 'ftp_transfer'],
        deliveryConfirmation: true
      },
      description: '调度与交付',
      dependsOn: ['distribution-list-creation']
    },
    {
      id: 'feedback-collection',
      tool: 'feedback_tool',
      params: {
        operation: 'collect_report_feedback',
        feedbackChannels: ['rating_system', 'comment_forms', 'usage_analytics', 'direct_feedback'],
        feedbackAnalysis: true,
        continuousImprovement: true
      },
      description: '反馈收集',
      dependsOn: ['scheduling-and-delivery']
    },
    {
      id: 'performance-monitoring',
      tool: 'analytics_engine',
      params: {
        operation: 'monitor_reporting_performance',
        metrics: ['delivery_success_rate', 'user_engagement', 'report_utilization', 'business_impact'],
        performanceTrends: true,
        optimizationRecommendations: true
      },
      description: '性能监控',
      dependsOn: ['feedback-collection']
    }
  ]
};