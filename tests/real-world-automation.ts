import { TaskScheduler } from './src/tasks/TaskScheduler';
import { WorkflowEngine } from './src/tasks/WorkflowEngine';
import { MemorySystem } from './src/memory/MemorySystem';
import { SkillManager } from './src/skills/SkillManager';

/**
 * LocalBot - 实际业务自动化示例
 * 展示如何通过离线技能自动完成用户任务
 */
async function demonstrateRealWorldAutomation() {
  console.log('🤖 LocalBot - Real-World Automation Examples\n');

  // 初始化系统
  const memorySystem = new MemorySystem();
  const skillManager = new SkillManager(memorySystem);
  const taskScheduler = new TaskScheduler();
  const workflowEngine = new WorkflowEngine();

  console.log('✅ Systems initialized\n');

  // 实际示例1: 自动月度销售报告生成
  console.log('📈 实际示例1: 自动月度销售报告生成');
  
  // 模拟销售数据收集和处理的工作流
  const salesReportWorkflow = {
    id: 'monthly-sales-report',
    name: '月度销售报告生成',
    description: '自动化生成月度销售报告',
    steps: [
      {
        id: 'fetch-sales-data',
        tool: 'file_read',
        params: {
          filePath: './data/monthly_sales.csv',
        },
        description: '获取销售数据'
      },
      {
        id: 'calculate-metrics',
        tool: 'financial_calculator',
        params: {
          operation: 'roi',
          principal: 100000, // 投资金额
          rate: 120000       // 收益金额
        },
        description: '计算关键指标',
        dependsOn: ['fetch-sales-data']
      },
      {
        id: 'generate-chart',
        tool: 'spreadsheet_operations',
        params: {
          operation: 'write',
          filePath: './reports/sales_report.xlsx',
          data: [
            ['Month', 'Sales', 'Target', 'Achievement'],
            ['Jan', 50000, 45000, '111%'],
            ['Feb', 55000, 50000, '110%'],
            ['Mar', 60000, 55000, '109%'],
          ]
        },
        description: '生成图表和报告',
        dependsOn: ['calculate-metrics']
      },
      {
        id: 'send-report',
        tool: 'notification_send',
        params: {
          type: 'email',
          recipient: 'sales-manager@company.com',
          subject: '月度销售报告 - {{current_month}}',
          message: '月度销售报告已生成，包含ROI: {{calculate-metrics.result.data}}%'
        },
        description: '发送报告给管理层',
        dependsOn: ['generate-chart']
      }
    ]
  };

  console.log('   已定义工作流:', salesReportWorkflow.name);
  console.log('   步骤数:', salesReportWorkflow.steps.length);
  console.log('');

  // 实际示例2: 客户跟进自动化
  console.log('📧 实际示例2: 客户跟进自动化');
  
  const customerFollowUpWorkflow = {
    id: 'customer-followup',
    name: '客户跟进自动化',
    description: '自动跟进潜在客户',
    steps: [
      {
        id: 'identify-potential-customers',
        tool: 'crm_operations',
        params: {
          operation: 'query',
          filters: {
            status: 'lead',
            lastContacted: '<30days'
          }
        },
        description: '识别需要跟进的潜在客户'
      },
      {
        id: 'prepare-personalized-email',
        tool: 'text_processor',
        params: {
          operation: 'template_fill',
          template: 'follow_up_email_template.txt',
          variables: {
            customerName: '{{identify-potential-customers.result.customers.[0].name}}',
            productName: '{{identify-potential-customers.result.customers.[0].interest}}'
          }
        },
        description: '准备个性化邮件',
        dependsOn: ['identify-potential-customers']
      },
      {
        id: 'send-followup-email',
        tool: 'email_operations',
        params: {
          operation: 'send',
          to: '{{identify-potential-customers.result.customers.[0].email}}',
          subject: '关于{{identify-potential-customers.result.customers.[0].interest}}的跟进',
          body: '{{prepare-personalized-email.result.processed_content}}'
        },
        description: '发送跟进邮件',
        dependsOn: ['prepare-personalized-email']
      },
      {
        id: 'update-crm',
        tool: 'crm_operations',
        params: {
          operation: 'update_lead',
          leadId: '{{identify-potential-customers.result.customers.[0].id}}',
          updates: {
            lastContacted: 'now',
            status: 'contacted'
          }
        },
        description: '更新CRM记录',
        dependsOn: ['send-followup-email']
      }
    ]
  };

  console.log('   已定义工作流:', customerFollowUpWorkflow.name);
  console.log('   步骤数:', customerFollowUpWorkflow.steps.length);
  console.log('');

  // 实际示例3: 库存预警和补货自动化
  console.log('📦 实际示例3: 库存预警和补货自动化');
  
  const inventoryReplenishmentWorkflow = {
    id: 'inventory-replenishment',
    name: '库存补货自动化',
    description: '当库存低于阈值时自动补货',
    steps: [
      {
        id: 'check-inventory-levels',
        tool: 'inventory_management',
        params: {
          operation: 'get_low_stock',
          threshold: 10
        },
        description: '检查低库存商品'
      },
      {
        id: 'get-supplier-info',
        tool: 'erp_operations',
        params: {
          operation: 'get_supplier',
          productId: '{{check-inventory-levels.result.products.[0].id}}'
        },
        description: '获取供应商信息',
        dependsOn: ['check-inventory-levels']
      },
      {
        id: 'create-purchase-order',
        tool: 'erp_operations',
        params: {
          operation: 'create_order',
          supplierId: '{{get-supplier-info.result.supplier.id}}',
          items: [
            {
              productId: '{{check-inventory-levels.result.products.[0].id}}',
              quantity: '{{check-inventory-levels.result.products.[0].reorder_amount}}'
            }
          ],
          totalAmount: '{{check-inventory-levels.result.products.[0].reorder_cost}}'
        },
        description: '创建采购订单',
        dependsOn: ['get-supplier-info']
      },
      {
        id: 'notify-purchasing-team',
        tool: 'notification_send',
        params: {
          type: 'slack',
          channel: '#purchasing',
          message: '已创建新的采购订单 #{{create-purchase-order.result.order_id}} 用于补充库存: {{check-inventory-levels.result.products.[0].name}}'
        },
        description: '通知采购团队',
        dependsOn: ['create-purchase-order']
      }
    ]
  };

  console.log('   已定义工作流:', inventoryReplenishmentWorkflow.name);
  console.log('   步骤数:', inventoryReplenishmentWorkflow.steps.length);
  console.log('');

  // 实际示例4: 项目进度监控自动化
  console.log('📊 实际示例4: 项目进度监控自动化');
  
  const projectMonitoringWorkflow = {
    id: 'project-monitoring',
    name: '项目进度监控',
    description: '监控项目进度并在延误时发出警报',
    steps: [
      {
        id: 'get-active-projects',
        tool: 'project_management',
        params: {
          operation: 'get_projects',
          status: 'active'
        },
        description: '获取活跃项目'
      },
      {
        id: 'check-milestone-due-dates',
        tool: 'project_management',
        params: {
          operation: 'check_milestones',
          projectId: '{{get-active-projects.result.projects.[0].id}}'
        },
        description: '检查里程碑截止日期',
        dependsOn: ['get-active-projects']
      },
      {
        id: 'calculate-project-health',
        tool: 'math_calculator',
        params: {
          operation: 'percentage',
          numerator: '{{get-active-projects.result.projects.[0].completed_tasks}}',
          denominator: '{{get-active-projects.result.projects.[0].total_tasks}}'
        },
        description: '计算项目健康度',
        dependsOn: ['get-active-projects']
      },
      {
        id: 'send-alert-if-delayed',
        tool: 'notification_send',
        params: {
          type: 'email',
          recipient: '{{get-active-projects.result.projects.[0].manager_email}}',
          subject: '项目延误警报: {{get-active-projects.result.projects.[0].name}}',
          message: '项目 {{get-active-projects.result.projects.[0].name}} 已延误，当前完成度: {{calculate-project-health.result.data}}%'
        },
        condition: '{{check-milestone-due-dates.result.is_overdue}}',
        description: '发送延误警报',
        dependsOn: ['check-milestone-due-dates', 'calculate-project-health']
      }
    ]
  };

  console.log('   已定义工作流:', projectMonitoringWorkflow.name);
  console.log('   步骤数:', projectMonitoringWorkflow.steps.length);
  console.log('');

  // 实际示例5: 合规性检查自动化
  console.log('✅ 实际示例5: 合规性检查自动化');
  
  const complianceCheckWorkflow = {
    id: 'compliance-check',
    name: '合规性检查',
    description: '自动执行合规性检查',
    steps: [
      {
        id: 'run-compliance-checks',
        tool: 'compliance_checker',
        params: {
          operation: 'audit',
          scope: 'financial_records',
          period: 'last_quarter'
        },
        description: '运行合规性检查'
      },
      {
        id: 'generate-compliance-report',
        tool: 'document_generator',
        params: {
          template: 'compliance_report_template.docx',
          data: '{{run-compliance-checks.result.audit_data}}'
        },
        description: '生成合规性报告',
        dependsOn: ['run-compliance-checks']
      },
      {
        id: 'flag-violations',
        tool: 'compliance_checker',
        params: {
          operation: 'flag_issues',
          issues: '{{run-compliance-checks.result.violations}}'
        },
        description: '标记违规项',
        dependsOn: ['run-compliance-checks']
      },
      {
        id: 'assign-corrective-actions',
        tool: 'task_scheduler',
        params: {
          operation: 'create_tasks',
          assignee: 'compliance_team',
          tasks: '{{flag-violations.result.corrective_actions}}'
        },
        description: '分配纠正措施',
        dependsOn: ['flag-violations']
      }
    ]
  };

  console.log('   已定义工作流:', complianceCheckWorkflow.name);
  console.log('   步骤数:', complianceCheckWorkflow.steps.length);
  console.log('');

  console.log('🎯 所有实际业务自动化工作流已准备就绪！');
  console.log('');
  console.log('📋 LocalBot自动化能力总结:');
  console.log('   • 顺序任务执行 - 按预定顺序执行多个步骤');
  console.log('   • 条件分支 - 根据条件执行不同路径');
  console.log('   • 并行处理 - 同时执行独立任务');
  console.log('   • 错误处理 - 自动重试和故障恢复');
  console.log('   • 定时任务 - 按计划自动执行');
  console.log('   • 事件驱动 - 响应系统事件');
  console.log('   • 数据传递 - 在工具间传递数据');
  console.log('   • 工作流持久化 - 保存和恢复工作流状态');
  console.log('');
  console.log('🚀 LocalBot可以在无外部AI模型的情况下执行这些复杂的自动化任务！');
  console.log('');
  console.log('💡 实际应用案例:');
  console.log('   • 每月自动生成财务报告');
  console.log('   • 自动跟进销售线索');
  console.log('   • 库存不足时自动下单补货');
  console.log('   • 项目延误时自动发送警报');
  console.log('   • 定期执行合规性检查');
  console.log('   • 自动备份重要数据');
  console.log('   • 系统健康状况监控');
}

// 运行演示
demonstrateRealWorldAutomation().catch(console.error);