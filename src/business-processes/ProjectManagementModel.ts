/**
 * 项目管理业务流程模型
 * 包括项目启动、规划、执行、监控和收尾等全流程自动化
 */

import { WorkflowDefinition } from '../tasks/WorkflowEngine';
import { Tool } from '../types';

export interface ProjectManagementData {
  projectId: string;
  projectName: string;
  projectScope: string;
  timeline: string;
  budget: number;
  teamSize: number;
  stakeholders: string[];
}

// 项目启动流程
export const projectInitiationProcess: WorkflowDefinition = {
  id: 'project-initiation-process',
  name: '项目启动流程',
  description: '从项目概念到正式批准的完整启动流程',
  steps: [
    {
      id: 'project-concept-definition',
      tool: 'document_generator',
      params: {
        template: 'project_charter_template',
        data: {
          projectIdea: '{{initial_request.project_idea}}',
          businessCase: '{{initial_request.business_case}}',
          successCriteria: '{{initial_request.success_metrics}}'
        }
      },
      description: '项目概念定义'
    },
    {
      id: 'stakeholder-identification',
      tool: 'data_analysis',
      params: {
        operation: 'identify_stakeholders',
        projectInfo: '{{project-concept-definition.result.project_info}}',
        stakeholderCategories: ['internal', 'external', 'customers', 'regulators']
      },
      description: '利益相关者识别',
      dependsOn: ['project-concept-definition']
    },
    {
      id: 'feasibility-analysis',
      tool: 'analytics_engine',
      params: {
        operation: 'feasibility_assessment',
        analysisTypes: ['technical', 'financial', 'operational', 'legal'],
        projectRequirements: '{{project-concept-definition.result.requirements}}',
        resourceAvailability: true
      },
      description: '可行性分析',
      dependsOn: ['stakeholder-identification']
    },
    {
      id: 'project-charter-approval',
      tool: 'workflow_approve',
      params: {
        document: '{{project-concept-definition.result.charter_document}}',
        approvers: ['executive_sponsor', 'pmo', 'finance_approval', 'legal_review'],
        approvalCriteria: ['business_value', 'resource_feasibility', 'risk_acceptance']
      },
      description: '项目章程审批',
      dependsOn: ['feasibility-analysis']
    },
    {
      id: 'project-team-formation',
      tool: 'hr_operations',
      params: {
        operation: 'assemble_project_team',
        projectRequirements: '{{project-charter-approval.result.project_specs}}',
        requiredSkills: '{{feasibility-analysis.result.skill_requirements}}',
        teamStructure: 'matrix_organization'
      },
      description: '项目团队组建',
      dependsOn: ['project-charter-approval']
    },
    {
      id: 'kickoff-meeting',
      tool: 'calendar_integration',
      params: {
        meetingType: 'project_kickoff',
        attendees: '{{stakeholder-identification.result.primary_stakeholders}}',
        agenda: '{{project-charter-approval.result.project_charter}}',
        communicationPlan: true
      },
      description: '项目启动会议',
      dependsOn: ['project-team-formation']
    }
  ]
};

// 项目规划流程
export const projectPlanningProcess: WorkflowDefinition = {
  id: 'project-planning-process',
  name: '项目规划流程',
  description: '详细的项目规划，包括范围、时间、成本、质量等要素',
  steps: [
    {
      id: 'scope-definition',
      tool: 'document_generator',
      params: {
        template: 'work_breakdown_structure_template',
        data: {
          projectObjectives: '{{project_charter.result.objectives}}',
          deliverables: '{{project_charter.result.deliverables}}',
          acceptanceCriteria: '{{project_charter.result.acceptance_criteria}}'
        }
      },
      description: '范围定义'
    },
    {
      id: 'work-breakdown-structure',
      tool: 'project_management_tool',
      params: {
        operation: 'create_wbs',
        projectScope: '{{scope-definition.result.project_scope}}',
        decompositionLevels: 3,
        responsibilityAssignment: true
      },
      description: '工作分解结构',
      dependsOn: ['scope-definition']
    },
    {
      id: 'resource-planning',
      tool: 'resource_management',
      params: {
        operation: 'allocate_resources',
        projectTasks: '{{work-breakdown-structure.result.tasks}}',
        teamAvailability: '{{project-team-formation.result.team_calendar}}',
        skillMatching: true
      },
      description: '资源规划',
      dependsOn: ['work-breakdown-structure']
    },
    {
      id: 'schedule-development',
      tool: 'project_management_tool',
      params: {
        operation: 'create_schedule',
        tasks: '{{work-breakdown-structure.result.tasks}}',
        dependencies: '{{work-breakdown-structure.result.dependencies}}',
        durations: '{{resource-planning.result.estimated_durations}}',
        criticalPath: true
      },
      description: '进度计划制定',
      dependsOn: ['resource-planning']
    },
    {
      id: 'budget-planning',
      tool: 'financial_calculator',
      params: {
        operation: 'estimate_project_cost',
        projectScope: '{{scope-definition.result.project_scope}}',
        resources: '{{resource-planning.result.allocated_resources}}',
        contingency: 0.1,
        costCategories: ['labor', 'materials', 'equipment', 'overhead']
      },
      description: '预算规划',
      dependsOn: ['schedule-development']
    },
    {
      id: 'risk-assessment',
      tool: 'analytics_engine',
      params: {
        operation: 'project_risk_analysis',
        projectCharacteristics: '{{scope-definition.result.project_characteristics}}',
        riskCategories: ['technical', 'schedule', 'cost', 'resource', 'external'],
        probabilityImpactMatrix: true
      },
      description: '风险评估',
      dependsOn: ['budget-planning']
    },
    {
      id: 'quality-planning',
      tool: 'quality_management',
      params: {
        operation: 'define_quality_standards',
        projectDeliverables: '{{scope-definition.result.deliverables}}',
        industryStandards: true,
        testingProtocols: true
      },
      description: '质量管理规划',
      dependsOn: ['risk-assessment']
    },
    {
      id: 'communication-planning',
      tool: 'document_generator',
      params: {
        template: 'communication_plan_template',
        data: {
          stakeholders: '{{stakeholder-identification.result.all_stakeholders}}',
          informationNeeds: '{{stakeholder-analysis.result.needs}}',
          communicationMethods: ['reports', 'meetings', 'dashboards', 'collaboration_tools']
        }
      },
      description: '沟通管理规划',
      dependsOn: ['quality-planning']
    }
  ]
};

// 项目执行与监控流程
export const projectExecutionMonitoringProcess: WorkflowDefinition = {
  id: 'project-execution-monitoring-process',
  name: '项目执行与监控流程',
  description: '项目执行过程中的任务管理、进度跟踪和绩效监控',
  steps: [
    {
      id: 'task-assignment',
      tool: 'project_management_tool',
      params: {
        operation: 'assign_tasks',
        tasks: '{{schedule-development.result.schedule_tasks}}',
        resources: '{{resource-planning.result.assigned_resources}}',
        deadlines: '{{schedule-development.result.milestones}}'
      },
      description: '任务分配'
    },
    {
      id: 'progress-tracking',
      tool: 'project_management_tool',
      params: {
        operation: 'track_progress',
        assignedTasks: '{{task-assignment.result.assigned_tasks}}',
        trackingFrequency: 'weekly',
        metrics: ['time', 'cost', 'quality', 'scope_completion']
      },
      description: '进度跟踪',
      dependsOn: ['task-assignment']
    },
    {
      id: 'performance-analysis',
      tool: 'analytics_engine',
      params: {
        operation: 'earned_value_analysis',
        plannedValue: '{{schedule-development.result.baseline_schedule}}',
        earnedValue: '{{progress-tracking.result.completed_work}}',
        actualCost: '{{financial-tracking.result.actual_costs}}',
        kpi: ['cv', 'sv', 'cpi', 'spi']
      },
      description: '绩效分析',
      dependsOn: ['progress-tracking']
    },
    {
      id: 'risk-monitoring',
      tool: 'risk_management',
      params: {
        operation: 'monitor_project_risks',
        identifiedRisks: '{{risk-assessment.result.risk_register}}',
        triggerIndicators: true,
        responseEffectiveness: true
      },
      description: '风险监控',
      dependsOn: ['performance-analysis']
    },
    {
      id: 'issue-resolution',
      tool: 'workflow_approve',
      params: {
        document: 'issue_resolution_request',
        issueType: '{{risk-monitoring.result.identified_issues}}',
        resolutionApprover: '{{project-charter-approval.result.project_sponsor}}',
        escalationPath: true
      },
      description: '问题解决',
      dependsOn: ['risk-monitoring']
    },
    {
      id: 'change-management',
      tool: 'change_management',
      params: {
        operation: 'process_change_requests',
        changeRequests: '{{issue-resolution.result.change_needs}}',
        impactAnalysis: true,
        approvalWorkflow: ['pm_review', 'steering_committee', 'sponsor_approval']
      },
      description: '变更管理',
      dependsOn: ['issue-resolution']
    },
    {
      id: 'quality-assurance',
      tool: 'quality_management',
      params: {
        operation: 'conduct_quality_audits',
        projectPhase: '{{progress-tracking.result.current_phase}}',
        standards: '{{quality-planning.result.quality_standards}}',
        auditFrequency: 'bi_weekly'
      },
      description: '质量保证',
      dependsOn: ['change-management']
    },
    {
      id: 'status-reporting',
      tool: 'report_generator',
      params: {
        template: 'project_status_report_template',
        data: {
          progressMetrics: '{{performance-analysis.result.metrics}}',
          risksIssues: '{{risk-monitoring.result.current_status}}',
          forecasts: '{{performance-analysis.result.forecasts}}',
          nextMilestones: '{{schedule-development.result.upcoming_milestones}}'
        },
        recipients: '{{communication-planning.result.stakeholder_list}}'
      },
      description: '状态报告',
      dependsOn: ['quality-assurance']
    }
  ]
};

// 项目收尾流程
export const projectClosureProcess: WorkflowDefinition = {
  id: 'project-closure-process',
  name: '项目收尾流程',
  description: '项目正式结束的全过程，包括成果验收、知识归档和团队解散',
  steps: [
    {
      id: 'deliverable-verification',
      tool: 'quality_management',
      params: {
        operation: 'verify_deliverables',
        projectDeliverables: '{{scope-definition.result.deliverables}}',
        acceptanceCriteria: '{{project_charter.result.acceptance_criteria}}',
        stakeholderReview: true
      },
      description: '可交付成果验证'
    },
    {
      id: 'client-acceptance',
      tool: 'workflow_approve',
      params: {
        document: 'project_acceptance_certificate',
        approvers: ['client', 'end_users', 'product_owner'],
        acceptanceCriteria: ['functionality', 'performance', 'usability', 'documentation']
      },
      description: '客户验收',
      dependsOn: ['deliverable-verification']
    },
    {
      id: 'financial-closeout',
      tool: 'financial_calculator',
      params: {
        operation: 'finalize_project_finances',
        budget: '{{budget-planning.result.estimated_budget}}',
        actualCosts: '{{progress-tracking.result.cumulative_costs}}',
        variances: true,
        finalInvoicing: true
      },
      description: '财务收尾',
      dependsOn: ['client-acceptance']
    },
    {
      id: 'contract-closeout',
      tool: 'contract_management',
      params: {
        operation: 'close_project_contracts',
        vendorContracts: '{{project_initiation.result.vendor_agreements}}',
        serviceLevelAchievements: true,
        finalPayments: true
      },
      description: '合同收尾',
      dependsOn: ['financial-closeout']
    },
    {
      id: 'knowledge-transfer',
      tool: 'document_generator',
      params: {
        template: 'knowledge_transfer_document_template',
        data: {
          projectLearnings: '{{status-reporting.result.lessons_learned}}',
          bestPractices: '{{quality-assurance.result.effective_practices}}',
          improvementAreas: '{{performance-analysis.result.identifed_gaps}}'
        },
        recipients: ['successor_projects', 'pmo', 'organizational_process_assets']
      },
      description: '知识转移',
      dependsOn: ['contract-closeout']
    },
    {
      id: 'team-recognition',
      tool: 'hr_operations',
      params: {
        operation: 'acknowledge_team_performance',
        teamMembers: '{{project-team-formation.result.team_members}}',
        contributions: '{{progress-tracking.result.individual_contributions}}',
        recognitionProgram: true
      },
      description: '团队表彰',
      dependsOn: ['knowledge-transfer']
    },
    {
      id: 'project-retrospective',
      tool: 'data_analysis',
      params: {
        operation: 'conduct_project_retrospective',
        projectMetrics: '{{performance-analysis.result.comprehensive_metrics}}',
        stakeholderFeedback: '{{client-acceptance.result.feedback}}',
        successFactors: true,
        improvementRecommendations: true
      },
      description: '项目回顾',
      dependsOn: ['team-recognition']
    },
    {
      id: 'administrative-closure',
      tool: 'document_generator',
      params: {
        template: 'project_closure_certificate_template',
        data: {
          projectSummary: '{{status-reporting.result.final_report}}',
          achievements: '{{deliverable-verification.result.verified_deliverables}}',
          lessonsLearned: '{{project-retrospective.result.findings}}',
          organizationalUpdates: true
        }
      },
      description: '行政收尾',
      dependsOn: ['project-retrospective']
    }
  ]
};