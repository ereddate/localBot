/**
 * 人力资源管理流程模型
 * 包含招聘管理、员工入职、绩效评估、培训发展等流程
 */

import { WorkflowDefinition } from '../tasks/WorkflowEngine';
import { Tool } from '../types';

export interface HRProcessData {
  employeeId: string;
  requisitionId: string;
  performanceReviewId: string;
  trainingProgramId: string;
  compensationChangeId: string;
}

// 招聘管理流程
export const recruitmentProcess: WorkflowDefinition = {
  id: 'recruitment-process',
  name: '招聘管理流程',
  description: '从职位需求到候选人入职的完整招聘流程',
  steps: [
    {
      id: 'requisition-approval',
      tool: 'workflow_approve',
      params: {
        document: 'position_requisition_form',
        approvers: ['manager', 'department_head', 'hr_business_partner', 'executive_approval'],
        approvalCriteria: ['budget_availability', 'business_justification', 'succession_planning']
      },
      description: '职位申请审批'
    },
    {
      id: 'job-description-creation',
      tool: 'document_generator',
      params: {
        template: 'job_description_template',
        data: {
          positionTitle: '{{requisition-approval.result.position_title}}',
          responsibilities: '{{requisition-approval.result.role_requirements}}',
          qualifications: '{{requisition-approval.result.qualifications}}',
          salaryRange: '{{compensation_database.result.salary_benchmark}}'
        }
      },
      description: '职位描述创建',
      dependsOn: ['requisition-approval']
    },
    {
      id: 'job-posting-distribution',
      tool: 'posting_system',
      params: {
        jobDescription: '{{job-description-creation.result.job_desc_file}}',
        channels: ['company_website', 'linkedin', 'indeed', 'glassdoor', 'internal_board'],
        distributionStrategy: 'targeted_audience'
      },
      description: '职位发布',
      dependsOn: ['job-description-creation']
    },
    {
      id: 'candidate-screening',
      tool: 'ats_system',
      params: {
        screeningCriteria: '{{job-description-creation.result.qualifications}}',
        keywordMatching: true,
        experienceFilter: '{{job-description-creation.result.years_experience}}',
        educationFilter: '{{job-description-creation.result.education_requirements}}'
      },
      description: '候选人筛选',
      dependsOn: ['job-posting-distribution']
    },
    {
      id: 'initial-interview-scheduling',
      tool: 'calendar_integration',
      params: {
        candidates: '{{candidate-screening.result.shortlisted_candidates}}',
        interviewers: ['hr_representative', 'hiring_manager'],
        availability: 'mutual_convenience',
        format: 'video_call'
      },
      description: '初轮面试安排',
      dependsOn: ['candidate-screening']
    },
    {
      id: 'technical-assessment',
      tool: 'assessment_platform',
      params: {
        assessmentType: 'skills_evaluation',
        role: '{{job-description-creation.result.position_role}}',
        candidates: '{{initial-interview-scheduling.result.interview_passed_candidates}}',
        evaluationCriteria: '{{job-description-creation.result.key_skills}}'
      },
      description: '技术评估',
      dependsOn: ['initial-interview-scheduling']
    },
    {
      id: 'final-round-interviews',
      tool: 'interview_scheduler',
      params: {
        candidates: '{{technical-assessment.result.qualified_candidates}}',
        interviewPanel: ['hiring_manager', 'team_members', 'department_head', 'culture_fit_evaluator'],
        evaluationForms: ['technical_skills', 'leadership_potential', 'cultural_fit', 'communication']
      },
      description: '终轮面试',
      dependsOn: ['technical-assessment']
    },
    {
      id: 'offer-preparation',
      tool: 'offer_letter_generator',
      params: {
        template: 'offer_letter_template',
        candidateInfo: '{{final-round-interviews.result.selected_candidate}}',
        compensation: '{{compensation_evaluation.result.offer_package}}',
        startDate: '{{availability.result.preferred_start_date}}'
      },
      description: '录用通知准备',
      dependsOn: ['final-round-interviews']
    },
    {
      id: 'offer-negotiation',
      tool: 'negotiation_tool',
      params: {
        initialOffer: '{{offer-preparation.result.initial_offer}}',
        candidateCounter: '{{candidate_response.result.counter_offer}}',
        negotiationLimits: '{{compensation_policy.result.bands}}',
        finalTerms: '{{agreement.result.negotiated_terms}}'
      },
      description: '录用谈判',
      dependsOn: ['offer-preparation']
    },
    {
      id: 'offer-acceptance',
      tool: 'document_signing',
      params: {
        document: '{{offer-negotiation.result.final_offer}}',
        signer: '{{selected_candidate.result.candidate_email}}',
        deadline: '5_business_days',
        acceptanceVerification: true
      },
      description: '录用接受',
      dependsOn: ['offer-negotiation']
    }
  ]
};

// 员工入职流程
export const onboardingProcess: WorkflowDefinition = {
  id: 'onboarding-process',
  name: '员工入职流程',
  description: '新员工从接受录用到正式工作的完整入职流程',
  steps: [
    {
      id: 'pre-boarding-setup',
      tool: 'hr_system',
      params: {
        operation: 'create_employee_record',
        basicInfo: '{{offer-acceptance.result.accepted_candidate_info}}',
        startDate: '{{offer-acceptance.result.start_date}}',
        department: '{{offer-acceptance.result.hiring_department}}',
        reportingManager: '{{offer-acceptance.result.manager}}'
      },
      description: '预入职设置'
    },
    {
      id: 'document-collection',
      tool: 'document_management',
      params: {
        requiredDocuments: [
          'employment_contract',
          'tax_forms',
          'benefits_enrollment',
          'background_check_authorization',
          'nda',
          'code_of_conduct_acknowledgment'
        ],
        deliveryMethod: 'secure_portal',
        deadline: '{{pre-boarding-setup.result.start_date_minus_5_days}}'
      },
      description: '文件收集',
      dependsOn: ['pre-boarding-setup']
    },
    {
      id: 'it-provisioning',
      tool: 'it_service_desk',
      params: {
        employeeId: '{{pre-boarding-setup.result.employee_id}}',
        equipment: ['laptop', 'phone', 'email_account', 'access_cards', 'software_licenses'],
        setupDeadline: '{{pre-boarding-setup.result.start_date_minus_1_day}}'
      },
      description: 'IT设备配置',
      dependsOn: ['pre-boarding-setup']
    },
    {
      id: 'workspace-setup',
      tool: 'facilities_management',
      params: {
        workspaceType: '{{job-description-creation.result.work_location}}',
        furniture: '{{role_requirements.result.workspace_needs}}',
        securityAccess: '{{role_requirements.result.access_levels}}',
        equipment: '{{it-provisioning.result.physical_equipment}}'
      },
      description: '工作空间设置',
      dependsOn: ['it-provisioning']
    },
    {
      id: 'first-day-orientation',
      tool: 'orientation_scheduler',
      params: {
        agenda: [
          'welcome_session',
          'company_overview',
          'hr_orientation',
          'it_orientation',
          'department_introduction',
          'meet_the_team'
        ],
        facilitators: ['hr_representative', 'mentor', 'manager'],
        materials: ['employee_handbook', 'org_chart', 'policy_manual']
      },
      description: '首日导向',
      dependsOn: ['workspace-setup', 'document-collection']
    },
    {
      id: 'role-specific-training',
      tool: 'training_system',
      params: {
        trainingModules: '{{job-description-creation.result.role_specific_training}}',
        duration: '{{competency_model.result.required_hours}}',
        trainer: '{{department.training_specialist}}',
        assessment: '{{competency_model.result.proficiency_test}}'
      },
      description: '角色特定培训',
      dependsOn: ['first-day-orientation']
    },
    {
      id: 'probation-monitoring',
      tool: 'performance_tracking',
      params: {
        probationPeriod: '90_days',
        milestones: ['30_day_review', '60_day_check_in', '90_day_evaluation'],
        goals: '{{role_requirements.result.early_objectives}}',
        feedbackMechanism: '{{manager.result.feedback_schedule}}'
      },
      description: '试用期监控',
      dependsOn: ['role-specific-training']
    },
    {
      id: 'probation-evaluation',
      tool: 'evaluation_system',
      params: {
        evaluator: ['manager', 'hr_business_partner'],
        criteria: '{{job-description-creation.result.performance_standards}}',
        feedbackSources: ['self', 'peers', 'subordinates', 'customers'],
        decision: ['confirm', 'extend', 'terminate']
      },
      description: '试用期评估',
      dependsOn: ['probation-monitoring']
    }
  ]
};

// 绩效评估流程
export const performanceEvaluationProcess: WorkflowDefinition = {
  id: 'performance-evaluation-process',
  name: '绩效评估流程',
  description: '员工绩效评估和发展的完整流程',
  steps: [
    {
      id: 'goal-setting-session',
      tool: 'performance_system',
      params: {
        cycle: 'annual',
        participants: ['employee', 'manager'],
        objectiveCategories: ['quantitative_goals', 'qualitative_goals', 'development_goals', 'values_alignment'],
        alignment: 'organizational_objectives'
      },
      description: '目标设定会议'
    },
    {
      id: 'mid-year-check-in',
      tool: 'progress_tracker',
      params: {
        progressAssessment: '{{goal-setting-session.result.agreed_goals}}',
        achievements: 'interim_results',
        challenges: 'obstacles_identified',
        adjustments: 'goal_modifications_if_needed'
      },
      description: '年中检查',
      dependsOn: ['goal-setting-session']
    },
    {
      id: 'self-assessment',
      tool: 'evaluation_form',
      params: {
        formType: 'self_evaluation',
        timePeriod: 'annual',
        competencies: '{{job-description-creation.result.required_competencies}}',
        achievements: '{{progress_tracker.result.annual_achievements}}',
        developmentAreas: '{{reflection.result.improvement_areas}}'
      },
      description: '自我评估',
      dependsOn: ['mid-year-check-in']
    },
    {
      id: 'manager-assessment',
      tool: 'evaluation_form',
      params: {
        formType: 'manager_evaluation',
        employee: '{{self-assessment.result.employee}}',
        performanceRating: '{{observation.result.performance_indicators}}',
        behavioralAssessment: '{{interaction.result.behavioral_competencies}}',
        potentialAssessment: '{{talent_review.result.growth_potential}}'
      },
      description: '管理者评估',
      dependsOn: ['self-assessment']
    },
    {
      id: 'peer-feedback-collection',
      tool: '360_feedback_system',
      params: {
        reviewers: '{{org_chart.result.collaboration_partners}}',
        anonymity: 'maintained',
        competencyFocus: '{{job_requirements.result.key_competencies}}',
        feedbackQuality: 'validated'
      },
      description: '同事反馈收集',
      dependsOn: ['manager-assessment']
    },
    {
      id: 'rating-calibration',
      tool: 'calibration_system',
      params: {
        ratings: ['{{manager-assessment.result.ratings}}', '{{peer-feedback-collection.result.ratings}}'],
        calibrationGroup: '{{department.result.performance_committee}}',
        distributionCurve: 'normal_distribution',
        fairnessCheck: 'bias_detection'
      },
      description: '评级校准',
      dependsOn: ['peer-feedback-collection']
    },
    {
      id: 'development-planning',
      tool: 'development_system',
      params: {
        strengths: '{{rating-calibration.result.high_ratings}}',
        improvementAreas: '{{rating-calibration.result.low_ratings}}',
        careerGoals: '{{employee.result.career_aspirations}}',
        developmentActivities: ['training_programs', 'stretch_assignments', 'mentoring', 'coaching']
      },
      description: '发展计划制定',
      dependsOn: ['rating-calibration']
    },
    {
      id: 'compensation-review',
      tool: 'compensation_system',
      params: {
        performanceRating: '{{rating-calibration.result.final_rating}}',
        marketData: '{{salary_survey.result.benchmark_data}}',
        budgetConstraints: '{{budget.result.allowances}}',
        adjustmentRecommendation: '{{merit_guidelines.result.suggested_increase}}'
      },
      description: '薪酬审查',
      dependsOn: ['rating-calibration']
    },
    {
      id: 'appraisal-meeting',
      tool: 'meeting_scheduler',
      params: {
        participants: ['employee', 'manager', 'hr_business_partner_optional'],
        agenda: ['performance_summary', 'feedback_discussion', 'development_plan', 'compensation_update'],
        documentation: 'signed_appraisal_form'
      },
      description: '评估面谈',
      dependsOn: ['development-planning', 'compensation-review']
    }
  ]
};

// 培训发展流程
export const trainingDevelopmentProcess: WorkflowDefinition = {
  id: 'training-development-process',
  name: '培训发展流程',
  description: '员工培训需求识别到效果评估的完整流程',
  steps: [
    {
      id: 'training-needs-assessment',
      tool: 'needs_analysis',
      params: {
        analysisType: 'gap_analysis',
        sources: ['performance_reviews', 'skill_inventories', 'succession_plans', 'business_needs'],
        methodology: 'competency_based',
        participants: ['individual', 'team', 'department', 'organization']
      },
      description: '培训需求评估'
    },
    {
      id: 'learning-objective-definition',
      tool: 'instructional_design',
      params: {
        objectives: '{{training-needs-assessment.result.gaps_identified}}',
        audience: '{{needs_assessment.result.target_audience}}',
        deliveryMethod: '{{content_library.result.available_formats}}',
        timeline: '{{business_calendar.result.availability}}'
      },
      description: '学习目标定义',
      dependsOn: ['training-needs-assessment']
    },
    {
      id: 'training-program-design',
      tool: 'course_builder',
      params: {
        content: '{{learning-objective-definition.result.objectives}}',
        methodology: '{{adult_learning_principles.result.best_practices}}',
        materials: ['presentations', 'exercises', 'case_studies', 'assessments'],
        duration: '{{time_constraints.result.available_duration}}'
      },
      description: '培训项目设计',
      dependsOn: ['learning-objective-definition']
    },
    {
      id: 'training-delivery',
      tool: 'learning_management_system',
      params: {
        modality: '{{training-program-design.result.preferred_method}}',
        instructors: '{{expertise.result.available_trainers}}',
        logistics: '{{facility_availability.result.schedule}}',
        attendanceTracking: true
      },
      description: '培训实施',
      dependsOn: ['training-program-design']
    },
    {
      id: 'knowledge-assessment',
      tool: 'assessment_system',
      params: {
        assessmentType: 'post_training_evaluation',
        format: '{{training-delivery.result.delivery_method}}_compatible',
        criteria: '{{learning-objective-definition.result.objectives}}',
        passThreshold: 0.8
      },
      description: '知识评估',
      dependsOn: ['training-delivery']
    },
    {
      id: 'behavior-application',
      tool: 'application_tracker',
      params: {
        timeFrame: '30_90_days_post_training',
        behaviors: '{{training-content.result.key_behaviors}}',
        observers: ['manager', 'peers'],
        evidenceCollection: '{{work_output.result.performance_indicators}}'
      },
      description: '行为应用',
      dependsOn: ['knowledge-assessment']
    },
    {
      id: 'roi-evaluation',
      tool: 'roi_calculator',
      params: {
        trainingCosts: '{{training-delivery.result.investment}}',
        benefits: '{{behavior-application.result.performance_improvements}}',
        timeHorizon: '6_12_months',
        calculationMethod: 'benjamin_rothwell_model'
      },
      description: '投资回报评估',
      dependsOn: ['behavior-application']
    },
    {
      id: 'continuous-improvement',
      tool: 'feedback_system',
      params: {
        feedbackSources: ['participants', 'managers', 'trainers', 'customers'],
        improvementAreas: '{{roi-evaluation.result.gap_analysis}}',
        iterationPlan: '{{program_calendar.result.next_offering}}'
      },
      description: '持续改进',
      dependsOn: ['roi-evaluation']
    }
  ]
};