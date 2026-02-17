/**
 * 税务规划业务流程模型
 * 包括企业和个人税务规划、优化和自动化申报流程
 */

import { WorkflowDefinition } from '../tasks/WorkflowEngine';
import { Tool } from '../types';

export interface TaxPlanningData {
  taxpayerType: 'individual' | 'corporation' | 'partnership' | 'llc';
  income: number;
  deductions: number;
  taxYear: number;
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_of_household' | 'qualifying_widow';
  businessType?: 'sole_proprietorship' | 's_corp' | 'c_corp' | 'partnership' | 'llc';
}

// 企业税务规划流程
export const corporateTaxPlanningProcess: WorkflowDefinition = {
  id: 'corporate-tax-planning-process',
  name: '企业税务规划流程',
  description: '为企业提供全面的税务规划和优化建议',
  steps: [
    {
      id: 'business-profile-assessment',
      tool: 'data_collection',
      params: {
        dataType: 'business_financials',
        requiredFields: [
          'revenue', 'expenses', 'assets', 'liabilities', 
          'depreciation_schedule', 'payroll_costs', 'benefits'
        ]
      },
      description: '企业资料评估'
    },
    {
      id: 'tax-liability-analysis',
      tool: 'tax_calculator',
      params: {
        operation: 'calculate_tax',
        taxType: 'corporate_income_tax',
        income: '{{business-profile-assessment.result.revenue}}',
        deductions: '{{business-profile-assessment.result.allowable_deductions}}',
        taxYear: '{{business-profile-assessment.result.tax_year}}',
        jurisdiction: 'federal_and_state'
      },
      description: '税务负债分析',
      dependsOn: ['business-profile-assessment']
    },
    {
      id: 'deduction-opportunities',
      tool: 'validation_check',
      params: {
        operation: 'identify_deductions',
        businessType: '{{business-profile-assessment.result.business_type}}',
        currentDeductions: '{{tax-liability-analysis.result.deductions}}',
        potentialDeductions: [
          'section_179_depreciation',
          'r_and_d_credit',
          'work_opportunity_tax_credit',
          'charitable_contributions',
          'business_meal_expenses',
          'home_office_deduction'
        ]
      },
      description: '扣除机会识别',
      dependsOn: ['tax-liability-analysis']
    },
    {
      id: 'tax-strategy-recommendation',
      tool: 'analytics_engine',
      params: {
        operation: 'generate_strategy',
        currentLiability: '{{tax-liability-analysis.result.tax_amount}}',
        potentialSavings: '{{deduction-opportunities.result.potential_savings}}',
        recommendationTypes: [
          'entity_structure_optimization',
          'timing_deductions',
          'accelerate_expenses',
          'defer_income',
          'investment_structure'
        ]
      },
      description: '税务策略推荐',
      dependsOn: ['deduction-opportunities']
    },
    {
      id: 'implementation-plan',
      tool: 'document_generation',
      params: {
        template: 'tax_strategy_implementation_plan',
        strategyDetails: '{{tax-strategy-recommendation.result.strategy}}',
        timeline: '12_months',
        responsibleParties: ['business_owner', 'accountant', 'attorney']
      },
      description: '实施计划制定',
      dependsOn: ['tax-strategy-recommendation']
    },
    {
      id: 'quarterly-monitoring',
      tool: 'financial_calculator',
      params: {
        operation: 'monitor_progress',
        baselineLiability: '{{tax-liability-analysis.result.tax_amount}}',
        targetSavings: '{{tax-strategy-recommendation.result.target_savings}}',
        frequency: 'quarterly',
        alerts: ['approaching_deadlines', 'missed_opportunities', 'regulatory_changes']
      },
      description: '季度监控',
      dependsOn: ['implementation-plan']
    }
  ]
};

// 个人税务规划流程
export const individualTaxPlanningProcess: WorkflowDefinition = {
  id: 'individual-tax-planning-process',
  name: '个人税务规划流程',
  description: '为个人提供全面的税务规划和优化建议',
  steps: [
    {
      id: 'personal-financial-assessment',
      tool: 'data_collection',
      params: {
        dataType: 'personal_financials',
        requiredFields: [
          'wages', 'investment_income', 'business_income', 
          'deductible_expenses', 'retirement_contributions', 
          'charitable_donations', 'mortgage_interest'
        ]
      },
      description: '个人财务评估'
    },
    {
      id: 'tax-situation-analysis',
      tool: 'tax_calculator',
      params: {
        operation: 'calculate_tax',
        taxType: 'individual_income_tax',
        income: '{{personal-financial-assessment.result.total_income}}',
        deductions: '{{personal-financial-assessment.result.total_deductions}}',
        taxYear: '{{personal-financial-assessment.result.tax_year}}',
        filingStatus: '{{personal-financial-assessment.result.filing_status}}',
        jurisdiction: 'federal_and_state'
      },
      description: '税务情况分析',
      dependsOn: ['personal-financial-assessment']
    },
    {
      id: 'credit-opportunities',
      tool: 'validation_check',
      params: {
        operation: 'identify_credits',
        filingStatus: '{{personal-financial-assessment.result.filing_status}}',
        dependents: '{{personal-financial-assessment.result.dependents}}',
        age: '{{personal-financial-assessment.result.age}}',
        educationExpenses: '{{personal-financial-assessment.result.education_expenses}}',
        creditTypes: [
          'child_tax_credit',
          'earned_income_tax_credit',
          'american_opportunity_credit',
          'lifetime_learning_credit',
          'saver_tax_credit',
          'residential_energy_credit'
        ]
      },
      description: '税收优惠识别',
      dependsOn: ['tax-situation-analysis']
    },
    {
      id: 'retirement-planning-strategy',
      tool: 'analytics_engine',
      params: {
        operation: 'generate_retirement_strategy',
        currentAge: '{{personal-financial-assessment.result.age}}',
        retirementAge: 65,
        incomeLevel: '{{personal-financial-assessment.result.income_level}}',
        strategyOptions: [
          'traditional_ira_contribution',
          'roth_ira_conversion',
          'hssa_contributions',
          'employer_401k_matching',
          'backdoor_r Roth'
        ]
      },
      description: '退休规划策略',
      dependsOn: ['credit-opportunities']
    },
    {
      id: 'investment-tax-strategy',
      tool: 'analytics_engine',
      params: {
        operation: 'generate_investment_strategy',
        investmentPortfolio: '{{personal-financial-assessment.result.investment_portfolio}}',
        holdingPeriods: '{{personal-financial-assessment.result.investment_holding_periods}}',
        strategyTypes: [
          'tax_loss_harvesting',
          'asset_location_optimization',
          'holding_period_management',
          'dividend_reinvestment_plans'
        ]
      },
      description: '投资税务策略',
      dependsOn: ['retirement-planning-strategy']
    },
    {
      id: 'implementation-timeline',
      tool: 'document_generation',
      params: {
        template: 'personal_tax_strategy_implementation',
        strategies: [
          '{{tax-strategy-recommendation.result.strategy}}',
          '{{retirement-planning-strategy.result.retirement_strategy}}',
          '{{investment-tax-strategy.result.investment_strategy}}'
        ],
        deadlines: [
          'q1_estimated_payments',
          'ira_contribution_deadline',
          'hsa_contribution_deadline',
          'tax_filing_deadline'
        ]
      },
      description: '实施时间表',
      dependsOn: ['investment-tax-strategy']
    }
  ]
};

// 税务自动化申报流程
export const automatedTaxFilingProcess: WorkflowDefinition = {
  id: 'automated-tax-filing-process',
  name: '自动化税务申报流程',
  description: '自动化完成税务申报和缴纳的全流程',
  steps: [
    {
      id: 'document-collection',
      tool: 'file_management',
      params: {
        operation: 'collect_documents',
        documentTypes: [
          'w2', '1099', '1098', 'k1', 'investment_statements',
          'business_income_records', 'expense_receipts', 'charitable_receipts'
        ],
        deadline: '{{tax-season.deadline}}',
        completenessThreshold: 0.95
      },
      description: '文档收集'
    },
    {
      id: 'data-extraction',
      tool: 'ocr_processing',
      params: {
        operation: 'extract_financial_data',
        sourceDocuments: '{{document-collection.result.collected_documents}}',
        confidenceThreshold: 0.9,
        validationChecks: [
          'math_verification',
          'format_validation',
          'cross_reference_check'
        ]
      },
      description: '数据提取',
      dependsOn: ['document-collection']
    },
    {
      id: 'form-population',
      tool: 'tax_software_integration',
      params: {
        operation: 'generate_forms',
        formTypes: ['1040', 'schedule_a', 'schedule_c', 'schedule_d'],
        extractedData: '{{data-extraction.result.extracted_data}}'
      },
      description: '表单填写',
      dependsOn: ['data-extraction']
    },
    {
      id: 'accuracy-validation',
      tool: 'validation_check',
      params: {
        operation: 'validate_return',
        formData: '{{form-population.result.forms}}',
        verificationTypes: [
          'mathematical_accuracy',
          'identity_verification',
          'income_verification',
          'deduction_verification'
        ]
      },
      description: '准确性验证',
      dependsOn: ['form-population']
    },
    {
      id: 'strategic-optimization',
      tool: 'tax_calculator',
      params: {
        operation: 'compare_scenarios',
        scenarios: [
          'standard_deduction',
          'itemized_deduction',
          'different_filing_status',
          'timing_adjustments'
        ],
        formData: '{{form-population.result.forms}}'
      },
      description: '策略优化',
      dependsOn: ['accuracy-validation']
    },
    {
      id: 'final-preparation',
      tool: 'tax_software_integration',
      params: {
        operation: 'prepare_return',
        software: 'turbotax',
        formTypes: ['{{strategic-optimization.result.optimal_forms}}'],
        finalizedData: '{{strategic-optimization.result.optimized_data}}'
      },
      description: '最终准备',
      dependsOn: ['strategic-optimization']
    },
    {
      id: 'electronic-filing',
      tool: 'irs_efile_system',
      params: {
        operation: 'submit_return',
        returnType: '{{final-preparation.result.return_type}}',
        document: '{{final-preparation.result.prepared_return}}',
        payment: '{{final-preparation.result.amount_owed}}'
      },
      description: '电子申报',
      dependsOn: ['final-preparation']
    },
    {
      id: 'payment-processing',
      tool: 'bank_integration',
      params: {
        operation: 'make_tax_payment',
        amount: '{{electronic-filing.result.payment_amount}}',
        dueDate: '{{electronic-filing.result.due_date}}',
        paymentMethod: 'electronic_funds_transfer',
        authorization: '{{electronic-filing.result.authorization_required}}'
      },
      description: '缴款处理',
      dependsOn: ['electronic-filing']
    },
    {
      id: 'confirmation-storage',
      tool: 'document_management',
      params: {
        operation: 'archive',
        documents: [
          '{{electronic-filing.result.confirmation}}',
          '{{payment-processing.result.payment_confirmation}}',
          '{{final-preparation.result.return_copy}}'
        ],
        retentionPeriod: '7_years',
        backupLocations: ['cloud_storage', 'local_backup']
      },
      description: '确认存档',
      dependsOn: ['payment-processing']
    }
  ]
};

// 税务合规监控流程
export const taxComplianceMonitoringProcess: WorkflowDefinition = {
  id: 'tax-compliance-monitoring-process',
  name: '税务合规监控流程',
  description: '持续监控税务合规状况并提供预警',
  steps: [
    {
      id: 'regulatory-monitoring',
      tool: 'web_scraping',
      params: {
        sources: [
          'irs.gov',
          'state_tax_agency',
          'tax_court_decisions',
          'professional_updates'
        ],
        updateFrequency: 'daily',
        alertTypes: [
          'regulation_changes',
          'court_decisions',
          'policy_updates',
          'deadlines'
        ]
      },
      description: '法规监控'
    },
    {
      id: 'transaction-monitoring',
      tool: 'financial_monitoring',
      params: {
        operation: 'track_tax_transactions',
        transactionTypes: [
          'large_cash_payments',
          'foreign_account_transfers',
          'business_expenses',
          'investment_trades'
        ],
        thresholds: {
          cashTransactions: 10000,
          foreignTransfers: 10000,
          businessExpenses: 2000
        }
      },
      description: '交易监控'
    },
    {
      id: 'deadline-alerts',
      tool: 'scheduler',
      params: {
        operation: 'manage_deadlines',
        deadlineTypes: [
          'estimated_tax_payments',
          'extension_requests',
          'form_submissions',
          'payment_due_dates'
        ],
        notificationLeadTimes: {
          primary: '30_days',
          secondary: '7_days',
          urgent: '1_day'
        }
      },
      description: '截止日期提醒',
      dependsOn: ['regulatory-monitoring']
    },
    {
      id: 'audit-preparation',
      tool: 'document_organization',
      params: {
        operation: 'organize_audit_docs',
        docCategories: [
          'income_verification',
          'expense_receipts',
          'investment_records',
          'business_documents'
        ],
        retentionRequirements: {
          federal: '3_years',
          state: '4_years',
          business: '7_years'
        }
      },
      description: '审计准备',
      dependsOn: ['transaction-monitoring']
    },
    {
      id: 'compliance-reporting',
      tool: 'report_generation',
      params: {
        reportType: 'tax_compliance_summary',
        frequency: 'monthly',
        stakeholders: ['tax_professional', 'business_owner'],
        metrics: [
          'compliance_score',
          'upcoming_obligations',
          'potential_issues',
          'recommendations'
        ]
      },
      description: '合规报告',
      dependsOn: ['deadline-alerts', 'audit-preparation']
    }
  ]
};