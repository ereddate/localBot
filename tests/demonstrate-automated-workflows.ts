import { TaskScheduler } from './src/tasks/TaskScheduler';
import { WorkflowEngine } from './src/tasks/WorkflowEngine';
import { MonitoringSystem } from './src/tasks/MonitoringSystem';
import { MemorySystem } from './src/memory/MemorySystem';
import { SkillManager } from './src/skills/SkillManager';

async function demonstrateAutomatedWorkflows() {
  console.log('🤖 LocalBot - Automated Workflows Demonstration\n');

  // 初始化所有系统组件
  const memorySystem = new MemorySystem();
  const skillManager = new SkillManager(memorySystem);
  const taskScheduler = new TaskScheduler();
  const workflowEngine = new WorkflowEngine();
  const monitoringSystem = new MonitoringSystem();

  console.log('✅ All systems initialized\n');

  // 示例1: 创建一个财务报告自动化流程
  console.log('📊 Example 1: Financial Report Automation Workflow');
  
  const financialReportWorkflow = {
    id: 'financial-report-workflow',
    name: 'Monthly Financial Report Generator',
    description: 'Automates monthly financial report generation',
    steps: [
      {
        id: 'step1',
        tool: 'financial_calculator',
        params: {
          operation: 'npv',
          cashFlows: [1000, 1500, 2000, 2500],
          discountRate: 0.05
        },
        description: 'Calculate Net Present Value'
      },
      {
        id: 'step2',
        tool: 'spreadsheet_operations',
        params: {
          operation: 'write',
          filePath: './monthly_financial_report.xlsx',
          data: [
            ['Metric', 'Value'],
            ['NPV', '{{step1.result.data}}'],
            ['ROI', '15%'],
            ['Cash Flow', 'Positive']
          ]
        },
        description: 'Write results to spreadsheet',
        dependsOn: ['step1']
      },
      {
        id: 'step3',
        tool: 'notification_send',
        params: {
          type: 'email',
          recipient: 'finance@company.com',
          subject: 'Monthly Financial Report Ready',
          message: 'The monthly financial report has been generated and is ready for review.'
        },
        description: 'Send notification',
        dependsOn: ['step2']
      }
    ]
  };

  console.log('   Workflow defined:', financialReportWorkflow.name);
  console.log('   Steps:', financialReportWorkflow.steps.length);
  console.log('');

  // 示例2: 创建一个CRM跟进自动化流程
  console.log('💼 Example 2: CRM Follow-up Automation Workflow');

  const crmFollowUpWorkflow = {
    id: 'crm-followup-workflow',
    name: 'Customer Follow-up Automation',
    description: 'Automates customer follow-up process',
    steps: [
      {
        id: 'step1',
        tool: 'crm_operations',
        params: {
          operation: 'get_customers',
          criteria: 'last_contacted > 30 days'
        },
        description: 'Get customers not contacted in 30 days'
      },
      {
        id: 'step2',
        tool: 'email_operations',
        params: {
          operation: 'send_bulk',
          recipients: '{{step1.result.customers}}',
          template: 'follow_up_email_template',
          subject: 'Following Up on Your Recent Inquiry'
        },
        description: 'Send follow-up emails',
        dependsOn: ['step1']
      },
      {
        id: 'step3',
        tool: 'crm_operations',
        params: {
          operation: 'update_customer',
          field: 'last_followup_date',
          value: 'current_date'
        },
        description: 'Update CRM with follow-up date',
        dependsOn: ['step2']
      }
    ]
  };

  console.log('   Workflow defined:', crmFollowUpWorkflow.name);
  console.log('   Steps:', crmFollowUpWorkflow.steps.length);
  console.log('');

  // 示例3: 创建一个库存管理自动化流程
  console.log('📦 Example 3: Inventory Management Automation Workflow');

  const inventoryManagementWorkflow = {
    id: 'inventory-alert-workflow',
    name: 'Inventory Reorder Automation',
    description: 'Automates inventory reordering when levels are low',
    steps: [
      {
        id: 'step1',
        tool: 'inventory_management',
        params: {
          operation: 'check_levels',
          threshold: 10
        },
        description: 'Check inventory levels'
      },
      {
        id: 'step2',
        tool: 'notification_send',
        params: {
          type: 'alert',
          recipient: 'inventory@company.com',
          subject: 'Low Inventory Alert',
          message: 'Products below threshold: {{step1.result.low_items}}'
        },
        description: 'Send low inventory alert',
        dependsOn: ['step1']
      },
      {
        id: 'step3',
        tool: 'erp_operations',
        params: {
          operation: 'create_purchase_order',
          items: '{{step1.result.low_items}}',
          quantities: '{{step1.result.reorder_quantities}}'
        },
        description: 'Create purchase orders for low items',
        dependsOn: ['step1', 'step2']
      }
    ]
  };

  console.log('   Workflow defined:', inventoryManagementWorkflow.name);
  console.log('   Steps:', inventoryManagementWorkflow.steps.length);
  console.log('');

  // 示例4: 设置一个定期执行的任务
  console.log('⏰ Example 4: Scheduled Task - Daily Backup');

  const dailyBackupTask = {
    id: 'daily-backup-task',
    name: 'Daily System Backup',
    schedule: '0 2 * * *', // Every day at 2 AM
    action: async () => {
      console.log('   Running daily backup...');
      
      // Simulate backup operations
      const fileSystemTool = skillManager.getTool('file_list');
      const compressionTool = skillManager.getTool('compress_files');
      const notificationTool = skillManager.getTool('notification_send');
      
      console.log('   - Listing critical files...');
      console.log('   - Compressing files...');
      console.log('   - Sending confirmation...');
      
      return { success: true, message: 'Daily backup completed successfully' };
    }
  };

  console.log('   Task defined:', dailyBackupTask.name);
  console.log('   Schedule: Daily at 2 AM');
  console.log('');

  // 示例5: 创建一个监控和响应流程
  console.log('🔍 Example 5: System Monitoring and Response Workflow');

  const monitoringWorkflow = {
    id: 'system-monitor-workflow',
    name: 'System Health Monitor',
    description: 'Monitors system health and responds to issues',
    triggers: [
      { 
        type: 'cpu_usage', 
        threshold: 80, 
        action: 'alert_admin' 
      },
      { 
        type: 'disk_space', 
        threshold: 90, 
        action: 'cleanup_temp_files' 
      },
      { 
        type: 'memory_usage', 
        threshold: 85, 
        action: 'restart_services' 
      }
    ]
  };

  console.log('   Workflow defined:', monitoringWorkflow.name);
  console.log('   Triggers:', monitoringWorkflow.triggers.length);
  console.log('');

  console.log('🎯 All automated workflows are ready to execute!');
  console.log('');
  console.log('📋 Summary of automation capabilities:');
  console.log('   • Sequential task execution');
  console.log('   • Conditional branching');
  console.log('   • Parallel processing');
  console.log('   • Error handling and retries');
  console.log('   • Scheduled tasks');
  console.log('   • Event-driven responses');
  console.log('   • Cross-tool data passing');
  console.log('   • Workflow persistence');
  console.log('');
  console.log('🚀 LocalBot can execute these workflows offline without external AI models!');
}

// 运行演示
demonstrateAutomatedWorkflows().catch(console.error);