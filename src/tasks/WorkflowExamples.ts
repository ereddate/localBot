import { Workflow, WorkflowStep } from '../types';
import { NetworkTool } from '../skills/NetworkTools';
import { FileWriteTool } from '../skills/FileTool';
import { ShellTool } from '../skills/ShellTool';
import { MemoryTool } from '../skills/MemoryTool';
import { MemorySystem } from '../memory/MemorySystem';

export class WorkflowExamples {
  /**
   * Creates a simple backup workflow that backs up a file and sends notification
   */
  static createBackupWorkflow(): Workflow {
    const steps: WorkflowStep[] = [
      {
        id: 'check-file',
        name: 'Check if file exists',
        tool: new FileWriteTool(), // Using file write tool to check if we can access the file
        params: {
          filePath: '{{sourceFilePath}}',
          content: '{{fileContent}}' // This would be the current content
        },
        dependsOn: []
      },
      {
        id: 'create-backup',
        name: 'Create backup of file',
        tool: new FileWriteTool(),
        params: {
          filePath: '{{backupFilePath}}',
          content: '{{originalFileContent}}'
        },
        dependsOn: ['check-file']
      },
      {
        id: 'send-notification',
        name: 'Send notification of backup completion',
        tool: new NetworkTool(), // Using network tool for notifications
        params: {
          operation: 'resolve',
          host: 'notification-service.local'
        },
        dependsOn: ['create-backup']
      }
    ];

    return {
      id: 'backup-workflow',
      name: 'File Backup Workflow',
      description: 'Automated workflow to backup files with notifications',
      steps,
      active: true
    };
  }

  /**
   * Creates a system monitoring workflow
   */
  static createSystemMonitoringWorkflow(): Workflow {
    const steps: WorkflowStep[] = [
      {
        id: 'check-process',
        name: 'Check if critical process is running',
        tool: new ShellTool(), // Using shell to check process status
        params: {
          command: 'ps aux | grep "{{processName}}"'
        },
        dependsOn: []
      },
      {
        id: 'restart-if-needed',
        name: 'Restart process if not running',
        tool: new ShellTool(),
        params: {
          command: 'if [ -z "$(pgrep {{processName}})" ]; then {{startupCommand}}; fi'
        },
        dependsOn: ['check-process'],
        onError: ['send-alert'] // Execute alert if restart fails
      },
      {
        id: 'send-alert',
        name: 'Send alert about process issue',
        tool: new NetworkTool(),
        params: {
          operation: 'resolve',
          host: 'alert-service.local'
        },
        dependsOn: [],
        onError: [] // This is an error handler
      }
    ];

    return {
      id: 'monitoring-workflow',
      name: 'System Process Monitoring Workflow',
      description: 'Monitors critical system processes and restarts them if needed',
      steps,
      active: true
    };
  }

  /**
   * Creates a daily report workflow
   */
  static createDailyReportWorkflow(): Workflow {
    const steps: WorkflowStep[] = [
      {
        id: 'collect-data',
        name: 'Collect daily metrics',
        tool: new ShellTool(),
        params: {
          command: 'df -h && free -m && ps aux --sort=-%cpu | head -10'
        },
        dependsOn: []
      },
      {
        id: 'format-report',
        name: 'Format report data',
        tool: new FileWriteTool(),
        params: {
          filePath: '/tmp/daily_report_{{date}}.txt',
          content: 'Daily Report for {{date}}\n\nSystem Metrics:\n{{collect-data_stdout}}'
        },
        dependsOn: ['collect-data']
      },
      {
        id: 'publish-report',
        name: 'Publish report to network location',
        tool: new NetworkTool(),
        params: {
          operation: 'resolve',
          host: 'report-server.local'
        },
        dependsOn: ['format-report']
      }
    ];

    return {
      id: 'daily-report-workflow',
      name: 'Daily Report Workflow',
      description: 'Collects system metrics and generates daily reports',
      steps,
      active: true
    };
  }

  /**
   * Creates a network monitoring workflow
   */
  static createNetworkMonitoringWorkflow(): Workflow {
    const steps: WorkflowStep[] = [
      {
        id: 'check-hosts',
        name: 'Check if hosts are reachable',
        tool: new NetworkTool(),
        params: {
          operation: 'ping',
          host: '{{hostAddress}}'
        },
        dependsOn: []
      },
      {
        id: 'check-ports',
        name: 'Check if critical ports are open',
        tool: new NetworkTool(),
        params: {
          operation: 'port_check',
          host: '{{hostAddress}}',
          port: '{{portNumber}}'
        },
        dependsOn: ['check-hosts']
      },
      {
        id: 'log-status',
        name: 'Log network status to memory',
        tool: new MemoryTool(new MemorySystem()),
        params: {
          content: 'Network status for {{hostAddress}}: Host={{check-hosts_reachable}}, Port={{portNumber}}={{check-ports_open}}'
        },
        dependsOn: ['check-ports']
      }
    ];

    return {
      id: 'network-monitoring-workflow',
      name: 'Network Monitoring Workflow',
      description: 'Monitors network hosts and ports availability',
      steps,
      active: true
    };
  }
}