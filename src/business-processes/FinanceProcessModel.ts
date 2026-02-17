/**
 * 财务业务流程模型
 * 包含预算管理、费用报销、财务报告、税务处理等流程
 */

import { WorkflowDefinition } from '../tasks/WorkflowEngine';
import { Tool } from '../types';

export interface FinanceProcessData {
  budgetId: string;
  expenseId: string;
  reportPeriod: string;
  taxYear: number;
  amount: number;
}

// 预算管理流程
export const budgetManagementProcess: WorkflowDefinition = {
  id: 'budget-management-process',
  name: '预算管理流程',
  description: '从预算编制到执行监控的完整流程',
  steps: [
    {
      id: 'budget-planning',
      tool: 'spreadsheet_operations',
      params: {
        operation: 'create_sheet',
        template: 'budget_planning_template',
        data: {
          fiscalYear: '2024',
          departments: ['sales', 'marketing', 'engineering', 'hr'],
          previousYearActuals: true
        }
      },
      description: '预算规划'
    },
    {
      id: 'budget-allocation',
      tool: 'financial_calculator',
      params: {
        operation: 'allocate_budget',
        allocationMethod: 'historical_percentage',
        totalBudget: '{{budget-planning.result.total_available}}',
        departmentWeights: '{{budget-planning.result.department_weights}}'
      },
      description: '预算分配',
      dependsOn: ['budget-planning']
    },
    {
      id: 'budget-approval',
      tool: 'workflow_approve',
      params: {
        document: '{{budget-allocation.result.budget_document}}',
        approvers: ['department_head', 'finance_manager', 'cfo']
      },
      description: '预算审批',
      dependsOn: ['budget-allocation']
    },
    {
      id: 'budget-execution-monitoring',
      tool: 'financial_calculator',
      params: {
        operation: 'track_spending',
        budgetId: '{{budget-approval.result.approved_budget_id}}',
        frequency: 'weekly'
      },
      description: '预算执行监控',
      dependsOn: ['budget-approval']
    },
    {
      id: 'variance-analysis',
      tool: 'spreadsheet_operations',
      params: {
        operation: 'calculate_variance',
        planned: '{{budget-allocation.result.planned_amounts}}',
        actual: '{{budget-execution-monitoring.result.actual_spending}}'
      },
      description: '差异分析',
      dependsOn: ['budget-execution-monitoring']
    },
    {
      id: 'budget-adjustment',
      tool: 'workflow_approve',
      params: {
        document: '{{variance-analysis.result.adjustment_recommendations}}',
        approvers: ['department_head', 'finance_manager'],
        adjustmentAmount: '{{variance-analysis.result.required_adjustment}}'
      },
      description: '预算调整',
      dependsOn: ['variance-analysis']
    }
  ]
};

// 费用报销流程
export const expenseReimbursementProcess: WorkflowDefinition = {
  id: 'expense-reimbursement-process',
  name: '费用报销流程',
  description: '员工费用报销的完整流程',
  steps: [
    {
      id: 'expense-entry',
      tool: 'database_insert',
      params: {
        table: 'expenses',
        data: {
          employeeId: '{{employee_id}}',
          amount: '{{expense_amount}}',
          category: '{{expense_category}}',
          receipt: '{{receipt_image}}',
          date: '{{expense_date}}'
        }
      },
      description: '费用录入'
    },
    {
      id: 'expense-validation',
      tool: 'validation_check',
      params: {
        ruleSet: 'expense_policy',
        expenseId: '{{expense-entry.result.expense_id}}',
        validationChecks: ['policy_compliance', 'receipt_quality', 'amount_limits']
      },
      description: '费用验证',
      dependsOn: ['expense-entry']
    },
    {
      id: 'manager-approval',
      tool: 'notification_send',
      params: {
        type: 'workflow_task',
        recipient: '{{expense-entry.result.employee_manager}}',
        task: 'approve_expense',
        expenseDetails: '{{expense-validation.result.validated_expense}}'
      },
      description: '经理审批',
      dependsOn: ['expense-validation']
    },
    {
      id: 'finance-review',
      tool: 'accounting_validation',
      params: {
        expenseId: '{{manager-approval.result.approved_expense_id}}',
        accountingCodes: true,
        taxImplications: true
      },
      description: '财务审核',
      dependsOn: ['manager-approval']
    },
    {
      id: 'payment-processing',
      tool: 'payment_gateway',
      params: {
        operation: 'process_payment',
        amount: '{{finance-review.result.validated_amount}}',
        payee: '{{expense-entry.result.employee_id}}',
        paymentMethod: 'direct_deposit'
      },
      description: '付款处理',
      dependsOn: ['finance-review']
    },
    {
      id: 'accounting-posting',
      tool: 'general_ledger',
      params: {
        operation: 'post_transaction',
        debitAccount: '{{expense-entry.result.expense_category}}',
        creditAccount: 'cash_or_bank',
        amount: '{{payment-processing.result.payment_amount}}'
      },
      description: '会计过账',
      dependsOn: ['payment-processing']
    },
    {
      id: 'report-generation',
      tool: 'report_generator',
      params: {
        template: 'expense_summary_report',
        period: 'monthly',
        filters: {
          department: '{{expense-entry.result.employee_department}}',
          category: '{{expense-entry.result.expense_category}}'
        }
      },
      description: '报告生成',
      dependsOn: ['accounting-posting']
    }
  ]
};

// 财务报告流程
export const financialReportingProcess: WorkflowDefinition = {
  id: 'financial-reporting-process',
  name: '财务报告流程',
  description: '定期财务报告的生成和发布流程',
  steps: [
    {
      id: 'data-collection',
      tool: 'database_query',
      params: {
        queries: [
          'SELECT * FROM general_ledger WHERE period = CURRENT_QUARTER',
          'SELECT * FROM cash_flow WHERE period = CURRENT_QUARTER',
          'SELECT * FROM balance_sheet WHERE period = CURRENT_QUARTER'
        ]
      },
      description: '数据收集'
    },
    {
      id: 'consolidation',
      tool: 'spreadsheet_operations',
      params: {
        operation: 'consolidate_data',
        datasets: ['{{data-collection.result.gl_data}}', '{{data-collection.result.cf_data}}', '{{data-collection.result.bs_data}}'],
        consolidationRules: 'subsidiary_to_parent'
      },
      description: '数据合并',
      dependsOn: ['data-collection']
    },
    {
      id: 'adjusting-entries',
      tool: 'accounting_adjustments',
      params: {
        adjustments: ['accruals', 'deferrals', 'depreciation', 'provisions'],
        period: 'quarterly'
      },
      description: '调整分录',
      dependsOn: ['consolidation']
    },
    {
      id: 'statement-preparation',
      tool: 'document_generator',
      params: {
        templates: ['income_statement', 'balance_sheet', 'cash_flow_statement'],
        data: '{{adjusting-entries.result.adjusted_trial_balance}}'
      },
      description: '报表编制',
      dependsOn: ['adjusting-entries']
    },
    {
      id: 'review-and-verification',
      tool: 'validation_check',
      params: {
        verificationType: 'financial_statements',
        checks: ['mathematical_accuracy', 'accounting_standards_compliance', 'disclosure_requirements']
      },
      description: '复核验证',
      dependsOn: ['statement-preparation']
    },
    {
      id: 'management-review',
      tool: 'notification_send',
      params: {
        type: 'workflow_task',
        recipient: 'cfo',
        task: 'review_financial_statements',
        documents: '{{review-and-verification.result.statements}}'
      },
      description: '管理层复核',
      dependsOn: ['review-and-verification']
    },
    {
      id: 'regulatory-filing',
      tool: 'external_system_integration',
      params: {
        system: 'sec_portal',
        filingType: '10-Q',
        documents: '{{management-review.result.approved_statements}}',
        deadline: '40_days_after_quarter_end'
      },
      description: '监管报送',
      dependsOn: ['management-review']
    },
    {
      id: 'stakeholder-distribution',
      tool: 'notification_send',
      params: {
        type: 'mass_distribution',
        recipients: ['board_members', 'investors', 'creditors', 'employees'],
        documents: '{{regulatory-filing.result.filed_documents}}',
        format: ['pdf', 'excel']
      },
      description: '利益相关方分发',
      dependsOn: ['regulatory-filing']
    }
  ]
};

// 税务处理流程
export const taxProcessingProcess: WorkflowDefinition = {
  id: 'tax-processing-process',
  name: '税务处理流程',
  description: '企业税务申报和缴纳的完整流程',
  steps: [
    {
      id: 'tax-data-gathering',
      tool: 'database_query',
      params: {
        queries: [
          'SELECT * FROM revenue WHERE period = CURRENT_YEAR',
          'SELECT * FROM expenses WHERE period = CURRENT_YEAR',
          'SELECT * FROM assets WHERE period = CURRENT_YEAR',
          'SELECT * FROM liabilities WHERE period = CURRENT_YEAR'
        ]
      },
      description: '税务数据收集'
    },
    {
      id: 'tax-calculation',
      tool: 'tax_calculator',
      params: {
        taxType: 'corporate_income_tax',
        jurisdiction: 'federal_and_state',
        income: '{{tax-data-gathering.result.taxable_income}}',
        deductions: '{{tax-data-gathering.result.allowed_deductions}}'
      },
      description: '税务计算',
      dependsOn: ['tax-data-gathering']
    },
    {
      id: 'tax-provisioning',
      tool: 'financial_calculator',
      params: {
        operation: 'calculate_provision',
        taxLiability: '{{tax-calculation.result.calculated_tax}}',
        timingDifferences: true,
        deferredTax: true
      },
      description: '税务计提',
      dependsOn: ['tax-calculation']
    },
    {
      id: 'return-preparation',
      tool: 'tax_software_integration',
      params: {
        software: 'turbotax_enterprise',
        formTypes: ['1120', 'state_returns'],
        data: '{{tax-provisioning.result.tax_calculation_details}}'
      },
      description: '申报表编制',
      dependsOn: ['tax-provisioning']
    },
    {
      id: 'internal-review',
      tool: 'validation_check',
      params: {
        verificationType: 'tax_return',
        checks: ['mathematical_accuracy', 'form_completeness', 'supporting_documentation']
      },
      description: '内部复核',
      dependsOn: ['return-preparation']
    },
    {
      id: 'signing-authorization',
      tool: 'digital_signature',
      params: {
        document: '{{internal-review.result.completed_return}}',
        signers: ['cfo', 'tax_director'],
        authorizationLevel: 'enterprise'
      },
      description: '签章授权',
      dependsOn: ['internal-review']
    },
    {
      id: 'filing-submission',
      tool: 'irs_efile_system',
      params: {
        operation: 'submit_return',
        returnType: '{{return-preparation.result.return_type}}',
        payment: '{{tax-calculation.result.total_liability}}'
      },
      description: '申报提交',
      dependsOn: ['signing-authorization']
    },
    {
      id: 'payment-processing',
      tool: 'bank_integration',
      params: {
        operation: 'make_tax_payment',
        amount: '{{filing-submission.result.due_amount}}',
        dueDate: '{{filing-submission.result.due_date}}',
        paymentMethod: 'electronic_funds_transfer'
      },
      description: '缴款处理',
      dependsOn: ['filing-submission']
    },
    {
      id: 'documentation-storage',
      tool: 'document_management',
      params: {
        operation: 'archive',
        documents: [
          '{{filing-submission.result.return_copy}}',
          '{{payment-processing.result.payment_confirmation}}',
          '{{signing-authorization.result.signature_record}}'
        ],
        retentionPeriod: '7_years'
      },
      description: '档案存储',
      dependsOn: ['payment-processing']
    }
  ]
};