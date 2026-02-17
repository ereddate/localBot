/**
 * 法律合规业务流程模型
 * 包括法规监控、合规评估、风险管理和合规报告等全流程自动化
 */

import { WorkflowDefinition } from '../tasks/WorkflowEngine';
import { Tool } from '../types';

export interface LegalComplianceData {
  jurisdiction: string;
  industry: string;
  complianceArea: string;
  riskLevel: string;
  lastAuditDate: string;
  complianceStatus: string;
}

// 法规监控与更新流程
export const regulatoryMonitoringProcess: WorkflowDefinition = {
  id: 'regulatory-monitoring-process',
  name: '法规监控与更新流程',
  description: '持续监控法规变化并及时更新合规要求的流程',
  steps: [
    {
      id: 'regulation-tracking',
      tool: 'legal_research_tool',
      params: {
        operation: 'track_regulatory_changes',
        jurisdictions: '{{organization_profile.result.operating_jurisdictions}}',
        industries: '{{organization_profile.result.industry_classifications}}',
        regulationTypes: ['laws', 'regulations', 'guidelines', 'court_decisions'],
        monitoringFrequency: 'daily'
      },
      description: '法规跟踪'
    },
    {
      id: 'impact-assessment',
      tool: 'analytics_engine',
      params: {
        operation: 'assess_regulatory_impact',
        regulatoryChanges: '{{regulation-tracking.result.new_changes}}',
        organizationProfile: '{{organization_profile.result.profile}}',
        impactCategories: ['operational', 'financial', 'reputational', 'legal'],
        urgencyLevels: true
      },
      description: '影响评估',
      dependsOn: ['regulation-tracking']
    },
    {
      id: 'compliance-requirement-update',
      tool: 'compliance_database',
      params: {
        operation: 'update_compliance_requirements',
        newRequirements: '{{impact-assessment.result.identified_requirements}}',
        requirementCategories: ['mandatory', 'best_practice', 'upcoming_deadlines'],
        priorityRanking: true
      },
      description: '合规要求更新',
      dependsOn: ['impact-assessment']
    },
    {
      id: 'stakeholder-notification',
      tool: 'notification_system',
      params: {
        operation: 'notify_relevant_stakeholders',
        notificationRecipients: ['legal_team', 'compliance_officers', 'department_heads', 'executives'],
        notificationContent: '{{compliance-requirement-update.result.updated_requirements}}',
        urgencyLevels: '{{impact-assessment.result.urgency_ratings}}'
      },
      description: '利益相关者通知',
      dependsOn: ['compliance-requirement-update']
    },
    {
      id: 'deadline-calendar-update',
      tool: 'calendar_integration',
      params: {
        operation: 'update_compliance_deadlines',
        newDeadlines: '{{compliance-requirement-update.result.implementation_deadlines}}',
        responsibleParties: '{{stakeholder-notification.result.affected_teams}}',
        reminderSettings: true
      },
      description: '截止日期日历更新',
      dependsOn: ['stakeholder-notification']
    },
    {
      id: 'regulatory-communication',
      tool: 'document_generator',
      params: {
        template: 'regulatory_update_communication_template',
        data: {
          regulatoryChanges: '{{regulation-tracking.result.changes}}',
          impacts: '{{impact-assessment.result.assessments}}',
          actionItems: '{{compliance-requirement-update.result.required_actions}}'
        }
      },
      description: '法规沟通',
      dependsOn: ['deadline-calendar-update']
    }
  ]
};

// 合规评估与审计流程
export const complianceAssessmentProcess: WorkflowDefinition = {
  id: 'compliance-assessment-process',
  name: '合规评估与审计流程',
  description: '系统性的合规状况评估和内部审计流程',
  steps: [
    {
      id: 'compliance-framework-definition',
      tool: 'compliance_framework_tool',
      params: {
        operation: 'define_compliance_framework',
        frameworkStandards: ['iso_19600', 'coso', 'sox', 'gdpr', 'hipaa'],
        industryStandards: '{{organization_profile.result.industry_requirements}}',
        regulatoryRequirements: '{{compliance-requirement-update.result.current_requirements}}'
      },
      description: '合规框架定义'
    },
    {
      id: 'control-inventory',
      tool: 'control_management',
      params: {
        operation: 'inventory_existing_controls',
        controlCategories: ['preventive', 'detective', 'corrective'],
        controlEffectiveness: '{{compliance_framework_definition.result.effectiveness_criteria}}',
        controlDocumentation: true
      },
      description: '控制措施清点',
      dependsOn: ['compliance-framework-definition']
    },
    {
      id: 'gap-analysis',
      tool: 'analytics_engine',
      params: {
        operation: 'perform_gap_analysis',
        requiredControls: '{{compliance_framework_definition.result.framework_controls}}',
        existingControls: '{{control-inventory.result.inventory_results}}',
        gapSeverity: ['critical', 'high', 'medium', 'low'],
        remediationPriorities: true
      },
      description: '差距分析',
      dependsOn: ['control-inventory']
    },
    {
      id: 'risk-assessment',
      tool: 'risk_management_tool',
      params: {
        operation: 'conduct_compliance_risk_assessment',
        riskCategories: ['regulatory', 'reputational', 'financial', 'operational'],
        riskProbability: '{{gap-analysis.result.vulnerability_assessment}}',
        riskImpact: '{{impact-assessment.result.impact_analysis}}'
      },
      description: '风险评估',
      dependsOn: ['gap-analysis']
    },
    {
      id: 'audit-scope-definition',
      tool: 'audit_planning_tool',
      params: {
        operation: 'define_audit_scope',
        highRiskAreas: '{{risk-assessment.result.risk_assessment}}',
        auditResources: '{{audit_team.result.availability}}',
        auditTimeline: '{{deadline-calendar-update.result.upcoming_dates}}',
        auditMethodology: true
      },
      description: '审计范围定义',
      dependsOn: ['risk-assessment']
    },
    {
      id: 'compliance-testing',
      tool: 'testing_tool',
      params: {
        operation: 'execute_compliance_tests',
        testProcedures: '{{audit-scope-definition.result.testing_procedures}}',
        sampleSelection: '{{risk-assessment.result.high_risk_transactions}}',
        evidenceCollection: true
      },
      description: '合规测试',
      dependsOn: ['audit-scope-definition']
    },
    {
      id: 'finding-documentation',
      tool: 'document_generator',
      params: {
        template: 'audit_finding_documentation_template',
        data: {
          testResults: '{{compliance-testing.result.test_outcomes}}',
          controlDeficiencies: '{{compliance-testing.result.deficiency_identifications}}',
          riskExposures: '{{risk-assessment.result.quantified_risks}}'
        }
      },
      description: '发现问题文档化',
      dependsOn: ['compliance-testing']
    }
  ]
};

// 合规风险管理流程
export const complianceRiskManagementProcess: WorkflowDefinition = {
  id: 'compliance-risk-management-process',
  name: '合规风险管理流程',
  description: '识别、评估、缓解和监控合规风险的流程',
  steps: [
    {
      id: 'risk-identification',
      tool: 'risk_identification_tool',
      params: {
        operation: 'identify_compliance_risks',
        identificationMethods: ['brainstorming', 'checklists', 'interviews', 'data_analysis'],
        riskSources: ['regulatory_changes', 'process_failures', 'human_errors', 'system_failures'],
        riskCatalogue: true
      },
      description: '风险识别'
    },
    {
      id: 'risk-analysis',
      tool: 'risk_analysis_tool',
      params: {
        operation: 'analyze_compliance_risks',
        riskProbabilities: '{{risk-identification.result.identified_risks.probabilities}}',
        riskImpacts: '{{risk-identification.result.identified_risks.impacts}}',
        riskMatrix: true,
        riskInterdependencies: true
      },
      description: '风险分析',
      dependsOn: ['risk-identification']
    },
    {
      id: 'risk-evaluation',
      tool: 'analytics_engine',
      params: {
        operation: 'evaluate_risk_significance',
        riskCriteria: ['probability', 'impact', 'velocity', 'reversibility'],
        riskToleranceLevels: '{{organization_profile.result.risk_appetite}}',
        riskPrioritization: true
      },
      description: '风险评价',
      dependsOn: ['risk-analysis']
    },
    {
      id: 'risk-treatment-planning',
      tool: 'risk_management_tool',
      params: {
        operation: 'plan_risk_treatments',
        treatmentOptions: ['avoid', 'mitigate', 'transfer', 'accept'],
        highPriorityRisks: '{{risk-evaluation.result.prioritized_risks}}',
        treatmentStrategies: true
      },
      description: '风险处置规划',
      dependsOn: ['risk-evaluation']
    },
    {
      id: 'control-implementation',
      tool: 'control_management',
      params: {
        operation: 'implement_risk_controls',
        controlMeasures: '{{risk-treatment-planning.result.selected_controls}}',
        implementationTimeline: '{{deadline-calendar-update.result.deadlines}}',
        resourceAllocation: true
      },
      description: '控制措施实施',
      dependsOn: ['risk-treatment-planning']
    },
    {
      id: 'monitoring-and-review',
      tool: 'monitoring_tool',
      params: {
        operation: 'monitor_control_effectiveness',
        monitoredControls: '{{control-implementation.result.implemented_controls}}',
        monitoringMetrics: ['frequency', 'effectiveness', 'efficiency', 'coverage'],
        reviewSchedule: true
      },
      description: '监控与评审',
      dependsOn: ['control-implementation']
    },
    {
      id: 'incident-response',
      tool: 'incident_response_tool',
      params: {
        operation: 'respond_to_compliance_incidents',
        incidentClassifications: '{{finding-documentation.result.non_compliance_finds}}',
        responseProcedures: ['containment', 'investigation', 'remediation', 'reporting'],
        escalationPaths: true
      },
      description: '事件响应',
      dependsOn: ['monitoring-and-review']
    }
  ]
};

// 合规报告与治理流程
export const complianceReportingGovernanceProcess: WorkflowDefinition = {
  id: 'compliance-reporting-governance-process',
  name: '合规报告与治理流程',
  description: '合规状况报告和治理监督的流程',
  steps: [
    {
      id: 'reporting-requirements-analysis',
      tool: 'regulatory_analysis_tool',
      params: {
        operation: 'analyze_reporting_requirements',
        reportTypes: ['regulatory_filings', 'internal_reports', 'board_reports', 'public_disclosures'],
        reportingFrequencies: ['daily', 'weekly', 'monthly', 'quarterly', 'annually'],
        regulatoryStandards: true
      },
      description: '报告要求分析'
    },
    {
      id: 'data-collection',
      tool: 'data_collection_tool',
      params: {
        operation: 'collect_compliance_data',
        dataSources: ['transaction_systems', 'control_testing', 'audit_results', 'monitoring_tools'],
        dataValidation: true,
        dataQualityChecks: true
      },
      description: '数据收集',
      dependsOn: ['reporting-requirements-analysis']
    },
    {
      id: 'compliance-metrics-calculation',
      tool: 'analytics_engine',
      params: {
        operation: 'calculate_compliance_metrics',
        metricTypes: ['compliance_rate', 'defect_rate', 'remediation_time', 'training_compliance'],
        benchmarking: true,
        trendAnalysis: true
      },
      description: '合规指标计算',
      dependsOn: ['data-collection']
    },
    {
      id: 'report-generation',
      tool: 'reporting_tool',
      params: {
        template: 'compliance_report_template',
        data: {
          complianceMetrics: '{{compliance-metrics-calculation.result.calculated_metrics}}',
          riskAssessment: '{{risk-assessment.result.risk_evaluation}}',
          auditFindings: '{{finding-documentation.result.documented_findings}}',
          remediationStatus: '{{incident-response.result.corrective_actions}}'
        },
        targetAudiences: ['executives', 'board', 'regulators', 'departments']
      },
      description: '报告生成',
      dependsOn: ['compliance-metrics-calculation']
    },
    {
      id: 'dashboard-creation',
      tool: 'dashboard_tool',
      params: {
        operation: 'create_compliance_dashboards',
        dashboardTypes: ['executive', 'operational', 'regulatory', 'tactical'],
        kpiVisualizations: ['gauges', 'trend_lines', 'heatmap', 'compliance_scorecards'],
        realTimeMonitoring: true
      },
      description: '仪表板创建',
      dependsOn: ['report-generation']
    },
    {
      id: 'governance-review',
      tool: 'governance_tool',
      params: {
        operation: 'conduct_governance_review',
        reviewTopics: ['compliance_performance', 'risk_exposure', 'control_effectiveness', 'framework_improvements'],
        reviewParticipants: ['compliance_committee', 'audit_committee', 'executives', 'external_advisors'],
        governanceDecisions: true
      },
      description: '治理评审',
      dependsOn: ['dashboard-creation']
    },
    {
      id: 'continuous-improvement',
      tool: 'improvement_tool',
      params: {
        operation: 'implement_continuous_improvement',
        improvementAreas: ['process_efficiency', 'control_effectiveness', 'reporting_accuracy', 'risk_coverage'],
        improvementProjects: '{{governance-review.result.recommendations}}',
        successMetrics: true
      },
      description: '持续改进',
      dependsOn: ['governance-review']
    }
  ]
};