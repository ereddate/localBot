import { Tool, Skill } from '../types';
import { FileTool, FileWriteTool, FileListTool, FileDeleteTool } from './FileTool';
import { ShellTool } from './ShellTool';
import { MemoryTool, MemorySearchTool } from './MemoryTool';
import { MemorySystem } from '../memory/MemorySystem';
import { 
  DatabaseConnectTool, 
  DatabaseExecuteTool 
} from './DatabaseTools';
import { 
  ApiGetTool, 
  ApiPostTool, 
  ApiPutTool, 
  ApiDeleteTool 
} from './ApiTools';
import { 
  CsvReadTool, 
  CsvWriteTool, 
  JsonReadTool, 
  JsonWriteTool 
} from './DataProcessingTools';
import { 
  NotificationTool, 
  ScheduleNotificationTool 
} from './NotificationTools';
import { 
  SystemInfoTool, 
  ProcessListTool, 
  ResourceMonitorTool 
} from './SystemMonitoringTools';
import { 
  ScheduleTaskTool, 
  CancelTaskTool, 
  ListScheduledTasksTool 
} from './SchedulingTools';
import { 
  EncryptTool, 
  DecryptTool, 
  HashTool 
} from './SecurityTools';
import { 
  ZipTool, 
  UnzipTool, 
  CompressTool, 
  DecompressTool 
} from './CompressionTools';
import { 
  ConversationHistoryTool, 
  ContextManagementTool, 
  SummarizeConversationTool 
} from './ConversationTools';
import { 
  TextAnalysisTool, 
  TextSearchTool, 
  TextTransformTool 
} from './TextTools';
import { 
  DateTimeTool, 
  TimezoneTool, 
  CalendarTool 
} from './DateTimeTools';
import { 
  MathCalculationTool, 
  UnitConversionTool, 
  StatisticsTool 
} from './MathTools';
import { 
  NetworkTool, 
  DnsLookupTool, 
  WhoisTool 
} from './NetworkTools';
import { 
  AiModelTool, 
  ImageGenerationTool, 
  EmbeddingTool 
} from './AiTools';
import { 
  ImageResizeTool, 
  ImageFormatConverterTool, 
  ImageMetadataTool 
} from './ImageTools';
import { 
  PdfReaderTool, 
  PdfWriterTool, 
  PdfMergeTool 
} from './PdfTools';
import { 
  LogManagementTool, 
  ConfigManagementTool 
} from './LogAndConfigTools';
import { 
  EmailTool, 
  CodeAnalysisTool 
} from './EmailAndCodeAnalysisTools';
import { 
  FinancialCalculatorTool, 
  SpreadsheetTool 
} from './BusinessTools1';
import { 
  CrmTool, 
  ErpTool 
} from './BusinessTools2';
import { 
  BusinessIntelligenceTool, 
  InventoryManagementTool 
} from './BusinessTools3';
import { 
  SalesAnalyticsTool, 
  ComplianceCheckerTool 
} from './BusinessTools4';
import { 
  ProjectManagementTool, 
  TimeTrackingTool 
} from './BusinessTools5';
import { 
  DatabaseInsertTool, 
  DatabaseQueryTool, 
  DatabaseUpdateTool, 
  DatabaseDeleteTool 
} from './DatabaseOperationTools';
import { 
  WorkflowApprovalTool, 
  DocumentGeneratorTool, 
  ValidationCheckTool, 
  NotificationSendTool 
} from './UtilityTools';
import { 
  HrSystemTool, 
  DocumentManagementTool, 
  AnalyticsEngineTool, 
  ReportGeneratorTool 
} from './AnalyticsTools';
import { 
  InventoryManagementToolExtended, 
  AccountingSystemTool, 
  PaymentGatewayTool, 
  TaxCalculatorTool 
} from './FinancialTools';
import { 
  TimeTrackingToolExtended, 
  ProjectManagementToolExtended, 
  QualityManagementTool, 
  WorkflowSystemTool 
} from './ProjectAndOperationsTools';
import { 
  IoTDeviceControlTool,
  MaintenanceSchedulerTool,
  FinanceTrackerTool,
  HealthTrackerTool,
  CalendarSchedulerTool
} from './HomeAutomationTools';
import { ChineseAILocalTool } from './ChineseAITools';

export class SkillManager {
  private skills: Map<string, Skill> = new Map();
  private tools: Map<string, Tool> = new Map();
  private memorySystem: MemorySystem;

  constructor(memorySystem?: MemorySystem) {
    this.memorySystem = memorySystem || new MemorySystem();
    this.registerDefaultSkills();
  }

  private registerDefaultSkills(): void {
    // Original tools
    const fileTool = new FileTool();
    const fileWriteTool = new FileWriteTool();
    const fileListTool = new FileListTool();
    const fileDeleteTool = new FileDeleteTool();
    const shellTool = new ShellTool();
    const memoryTool = new MemoryTool(this.memorySystem);
    const memorySearchTool = new MemorySearchTool(this.memorySystem);

    // New tools
    const dbConnectTool = new DatabaseConnectTool();
    const dbQueryTool = new DatabaseQueryTool();
    const dbExecuteTool = new DatabaseExecuteTool();
    
    const apiGetTool = new ApiGetTool();
    const apiPostTool = new ApiPostTool();
    const apiPutTool = new ApiPutTool();
    const apiDeleteTool = new ApiDeleteTool();
    
    const csvReadTool = new CsvReadTool();
    const csvWriteTool = new CsvWriteTool();
    const jsonReadTool = new JsonReadTool();
    const jsonWriteTool = new JsonWriteTool();
    
    const notificationTool = new NotificationTool();
    const scheduleNotificationTool = new ScheduleNotificationTool();
    
    const systemInfoTool = new SystemInfoTool();
    const processListTool = new ProcessListTool();
    const resourceMonitorTool = new ResourceMonitorTool();
    
    const scheduleTaskTool = new ScheduleTaskTool();
    const cancelTaskTool = new CancelTaskTool();
    const listScheduledTasksTool = new ListScheduledTasksTool();

    // Additional new tools
    const encryptTool = new EncryptTool();
    const decryptTool = new DecryptTool();
    const hashTool = new HashTool();
    
    const zipTool = new ZipTool();
    const unzipTool = new UnzipTool();
    const compressTool = new CompressTool();
    const decompressTool = new DecompressTool();
    
    const conversationHistoryTool = new ConversationHistoryTool();
    const contextManagementTool = new ContextManagementTool();
    const summarizeConversationTool = new SummarizeConversationTool();
    
    const textAnalysisTool = new TextAnalysisTool();
    const textSearchTool = new TextSearchTool();
    const textTransformTool = new TextTransformTool();

    // Additional new tools for date/time, math, and network operations
    const dateTimeTool = new DateTimeTool();
    const timezoneTool = new TimezoneTool();
    const calendarTool = new CalendarTool();
    
    const mathCalculationTool = new MathCalculationTool();
    const unitConversionTool = new UnitConversionTool();
    const statisticsTool = new StatisticsTool();
    
    const networkTool = new NetworkTool();
    const dnsLookupTool = new DnsLookupTool();
    const whoisTool = new WhoisTool();

    // Additional new tools for AI, image, and PDF operations
    const aiModelTool = new AiModelTool();
    const imageGenerationTool = new ImageGenerationTool();
    const embeddingTool = new EmbeddingTool();
    
    const imageResizeTool = new ImageResizeTool();
    const imageFormatConverterTool = new ImageFormatConverterTool();
    const imageMetadataTool = new ImageMetadataTool();
    
    const pdfReaderTool = new PdfReaderTool();
    const pdfWriterTool = new PdfWriterTool();
    const pdfMergeTool = new PdfMergeTool();

    // Register all tools
    this.registerTool(fileTool);
    this.registerTool(fileWriteTool);
    this.registerTool(fileListTool);
    this.registerTool(fileDeleteTool);
    this.registerTool(shellTool);
    this.registerTool(memoryTool);
    this.registerTool(memorySearchTool);
    
    // Register new tools
    this.registerTool(dbConnectTool);
    this.registerTool(dbQueryTool);
    this.registerTool(dbExecuteTool);
    this.registerTool(apiGetTool);
    this.registerTool(apiPostTool);
    this.registerTool(apiPutTool);
    this.registerTool(apiDeleteTool);
    this.registerTool(csvReadTool);
    this.registerTool(csvWriteTool);
    this.registerTool(jsonReadTool);
    this.registerTool(jsonWriteTool);
    this.registerTool(notificationTool);
    this.registerTool(scheduleNotificationTool);
    this.registerTool(systemInfoTool);
    this.registerTool(processListTool);
    this.registerTool(resourceMonitorTool);
    this.registerTool(scheduleTaskTool);
    this.registerTool(cancelTaskTool);
    this.registerTool(listScheduledTasksTool);
    
    // Register additional new tools
    this.registerTool(encryptTool);
    this.registerTool(decryptTool);
    this.registerTool(hashTool);
    this.registerTool(zipTool);
    this.registerTool(unzipTool);
    this.registerTool(compressTool);
    this.registerTool(decompressTool);
    this.registerTool(conversationHistoryTool);
    this.registerTool(contextManagementTool);
    this.registerTool(summarizeConversationTool);
    this.registerTool(textAnalysisTool);
    this.registerTool(textSearchTool);
    this.registerTool(textTransformTool);
    
    // Register even more new tools
    this.registerTool(dateTimeTool);
    this.registerTool(timezoneTool);
    this.registerTool(calendarTool);
    this.registerTool(mathCalculationTool);
    this.registerTool(unitConversionTool);
    this.registerTool(statisticsTool);
    this.registerTool(networkTool);
    this.registerTool(dnsLookupTool);
    this.registerTool(whoisTool);
    
    // Register AI, image, and PDF tools
    this.registerTool(aiModelTool);
    this.registerTool(imageGenerationTool);
    this.registerTool(embeddingTool);
    this.registerTool(imageResizeTool);
    this.registerTool(imageFormatConverterTool);
    this.registerTool(imageMetadataTool);
    this.registerTool(pdfReaderTool);
    this.registerTool(pdfWriterTool);
    this.registerTool(pdfMergeTool);
    
    // Additional new tools for log/config management and email/code analysis
    const logManagementTool = new LogManagementTool();
    const configManagementTool = new ConfigManagementTool();
    
    const emailTool = new EmailTool();
    const codeAnalysisTool = new CodeAnalysisTool();

    // Register new tools
    this.registerTool(logManagementTool);
    this.registerTool(configManagementTool);
    this.registerTool(emailTool);
    this.registerTool(codeAnalysisTool);
    
    // Additional business tools
    const financialCalculatorTool = new FinancialCalculatorTool();
    const spreadsheetTool = new SpreadsheetTool();
    const crmTool = new CrmTool();
    const erpTool = new ErpTool();
    const businessIntelligenceTool = new BusinessIntelligenceTool();
    const inventoryManagementTool = new InventoryManagementTool();
    const salesAnalyticsTool = new SalesAnalyticsTool();
    const complianceCheckerTool = new ComplianceCheckerTool();
    const projectManagementTool = new ProjectManagementTool();
    const timeTrackingTool = new TimeTrackingTool();

    // Register business tools
    this.registerTool(financialCalculatorTool);
    this.registerTool(spreadsheetTool);
    this.registerTool(crmTool);
    this.registerTool(erpTool);
    this.registerTool(businessIntelligenceTool);
    this.registerTool(inventoryManagementTool);
    this.registerTool(salesAnalyticsTool);
    this.registerTool(complianceCheckerTool);
    this.registerTool(projectManagementTool);
    this.registerTool(timeTrackingTool);

    // Register database operation tools
    const databaseInsertTool = new DatabaseInsertTool();
    const databaseQueryTool = new DatabaseQueryTool();
    const databaseUpdateTool = new DatabaseUpdateTool();
    const databaseDeleteTool = new DatabaseDeleteTool();

    this.registerTool(databaseInsertTool);
    this.registerTool(databaseQueryTool);
    this.registerTool(databaseUpdateTool);
    this.registerTool(databaseDeleteTool);

    // Register utility tools
    const workflowApprovalTool = new WorkflowApprovalTool();
    const documentGeneratorTool = new DocumentGeneratorTool();
    const validationCheckTool = new ValidationCheckTool();
    const notificationSendTool = new NotificationSendTool();

    this.registerTool(workflowApprovalTool);
    this.registerTool(documentGeneratorTool);
    this.registerTool(validationCheckTool);
    this.registerTool(notificationSendTool);

    // Register analytics tools
    const hrSystemTool = new HrSystemTool();
    const documentManagementTool = new DocumentManagementTool();
    const analyticsEngineTool = new AnalyticsEngineTool();
    const reportGeneratorTool = new ReportGeneratorTool();

    this.registerTool(hrSystemTool);
    this.registerTool(documentManagementTool);
    this.registerTool(analyticsEngineTool);
    this.registerTool(reportGeneratorTool);

    // Register financial tools
    const accountingSystemTool = new AccountingSystemTool();
    const paymentGatewayTool = new PaymentGatewayTool();
    const taxCalculatorTool = new TaxCalculatorTool();

    this.registerTool(accountingSystemTool);
    this.registerTool(paymentGatewayTool);
    this.registerTool(taxCalculatorTool);

    // Register project and operations tools
    const timeTrackingToolExtended = new TimeTrackingToolExtended();
    const projectManagementToolExtended = new ProjectManagementToolExtended();
    const qualityManagementTool = new QualityManagementTool();
    const workflowSystemTool = new WorkflowSystemTool();

    this.registerTool(timeTrackingToolExtended);
    this.registerTool(projectManagementToolExtended);
    this.registerTool(qualityManagementTool);
    this.registerTool(workflowSystemTool);

    // Original skills
    const fileSystemSkill: Skill = {
      name: 'file-system',
      description: 'File system operations',
      tools: [fileTool, fileWriteTool, fileListTool, fileDeleteTool],
      enabled: true,
      permissions: [],
    };

    const shellSkill: Skill = {
      name: 'shell',
      description: 'Shell command execution',
      tools: [shellTool],
      enabled: true,
      permissions: [],
    };

    const memorySkill: Skill = {
      name: 'memory',
      description: 'Memory management',
      tools: [memoryTool, memorySearchTool],
      enabled: true,
      permissions: [],
    };

    // New skills
    const databaseSkill: Skill = {
      name: 'database',
      description: 'Database operations (connect, query, execute)',
      tools: [dbConnectTool, dbQueryTool, dbExecuteTool],
      enabled: true,
      permissions: [],
    };

    const apiSkill: Skill = {
      name: 'api-management',
      description: 'API management operations (GET, POST, PUT, DELETE)',
      tools: [apiGetTool, apiPostTool, apiPutTool, apiDeleteTool],
      enabled: true,
      permissions: [],
    };

    const dataProcessingSkill: Skill = {
      name: 'data-processing',
      description: 'Data processing operations (CSV, JSON)',
      tools: [csvReadTool, csvWriteTool, jsonReadTool, jsonWriteTool],
      enabled: true,
      permissions: [],
    };

    const notificationSkill: Skill = {
      name: 'notifications',
      description: 'Notification operations (send, schedule)',
      tools: [notificationTool, scheduleNotificationTool],
      enabled: true,
      permissions: [],
    };

    const systemMonitoringSkill: Skill = {
      name: 'system-monitoring',
      description: 'System monitoring operations (info, processes, resources)',
      tools: [systemInfoTool, processListTool, resourceMonitorTool],
      enabled: true,
      permissions: [],
    };

    const schedulingSkill: Skill = {
      name: 'task-scheduling',
      description: 'Task scheduling operations (schedule, cancel, list)',
      tools: [scheduleTaskTool, cancelTaskTool, listScheduledTasksTool],
      enabled: true,
      permissions: [],
    };

    // Additional new skills
    const securitySkill: Skill = {
      name: 'security-tools',
      description: 'Security operations (encryption, decryption, hashing)',
      tools: [encryptTool, decryptTool, hashTool],
      enabled: true,
      permissions: [],
    };

    const compressionSkill: Skill = {
      name: 'compression-tools',
      description: 'File and data compression operations',
      tools: [zipTool, unzipTool, compressTool, decompressTool],
      enabled: true,
      permissions: [],
    };

    const conversationSkill: Skill = {
      name: 'conversation-tools',
      description: 'Conversation management and context handling',
      tools: [conversationHistoryTool, contextManagementTool, summarizeConversationTool],
      enabled: true,
      permissions: [],
    };

    const textProcessingSkill: Skill = {
      name: 'text-processing',
      description: 'Text analysis, search, and transformation tools',
      tools: [textAnalysisTool, textSearchTool, textTransformTool],
      enabled: true,
      permissions: [],
    };

    // Additional new skills
    const dateTimeSkill: Skill = {
      name: 'date-time-tools',
      description: 'Date and time operations and calculations',
      tools: [dateTimeTool, timezoneTool, calendarTool],
      enabled: true,
      permissions: [],
    };

    const mathSkill: Skill = {
      name: 'math-tools',
      description: 'Mathematical calculations and unit conversions',
      tools: [mathCalculationTool, unitConversionTool, statisticsTool],
      enabled: true,
      permissions: [],
    };

    const networkSkill: Skill = {
      name: 'network-tools',
      description: 'Network operations and DNS lookups',
      tools: [networkTool, dnsLookupTool, whoisTool],
      enabled: true,
      permissions: [],
    };

    // Additional new skills
    const aiToolsSkill: Skill = {
      name: 'ai-tools',
      description: 'AI model operations (inference, generation, embeddings)',
      tools: [aiModelTool, imageGenerationTool, embeddingTool],
      enabled: true,
      permissions: [],
    };

    const imageToolsSkill: Skill = {
      name: 'image-tools',
      description: 'Image processing operations (resize, format conversion, metadata)',
      tools: [imageResizeTool, imageFormatConverterTool, imageMetadataTool],
      enabled: true,
      permissions: [],
    };

    const pdfToolsSkill: Skill = {
      name: 'pdf-tools',
      description: 'PDF operations (read, write, merge)',
      tools: [pdfReaderTool, pdfWriterTool, pdfMergeTool],
      enabled: true,
      permissions: [],
    };

    // Additional new skills
    const logConfigToolsSkill: Skill = {
      name: 'log-config-tools',
      description: 'Log and configuration management operations',
      tools: [logManagementTool, configManagementTool],
      enabled: true,
      permissions: [],
    };

    const communicationToolsSkill: Skill = {
      name: 'communication-tools',
      description: 'Communication operations (email)',
      tools: [emailTool],
      enabled: true,
      permissions: [],
    };

    const codeQualityToolsSkill: Skill = {
      name: 'code-quality-tools',
      description: 'Code analysis and quality assurance tools',
      tools: [codeAnalysisTool],
      enabled: true,
      permissions: [],
    };

    // Business tools skills
    const financialToolsSkill: Skill = {
      name: 'financial-tools',
      description: 'Financial calculations and business finance operations',
      tools: [financialCalculatorTool],
      enabled: true,
      permissions: [],
    };

    const spreadsheetToolsSkill: Skill = {
      name: 'spreadsheet-tools',
      description: 'Spreadsheet operations (Excel/Google Sheets)',
      tools: [spreadsheetTool],
      enabled: true,
      permissions: [],
    };

    const crmToolsSkill: Skill = {
      name: 'crm-tools',
      description: 'Customer Relationship Management operations',
      tools: [crmTool],
      enabled: true,
      permissions: [],
    };

    const erpToolsSkill: Skill = {
      name: 'erp-tools',
      description: 'Enterprise Resource Planning operations',
      tools: [erpTool],
      enabled: true,
      permissions: [],
    };

    const businessIntelligenceToolsSkill: Skill = {
      name: 'business-intelligence-tools',
      description: 'Business Intelligence and analytics operations',
      tools: [businessIntelligenceTool],
      enabled: true,
      permissions: [],
    };

    const inventoryToolsSkill: Skill = {
      name: 'inventory-tools',
      description: 'Inventory tracking and management operations',
      tools: [inventoryManagementTool],
      enabled: true,
      permissions: [],
    };

    const salesAnalyticsToolsSkill: Skill = {
      name: 'sales-analytics-tools',
      description: 'Sales data analysis and reporting',
      tools: [salesAnalyticsTool],
      enabled: true,
      permissions: [],
    };

    const complianceToolsSkill: Skill = {
      name: 'compliance-tools',
      description: 'Business compliance checking and auditing',
      tools: [complianceCheckerTool],
      enabled: true,
      permissions: [],
    };

    const projectManagementToolsSkill: Skill = {
      name: 'project-management-tools',
      description: 'Project tracking and management operations',
      tools: [projectManagementTool],
      enabled: true,
      permissions: [],
    };

    const timeTrackingToolsSkill: Skill = {
      name: 'time-tracking-tools',
      description: 'Employee time tracking and management',
      tools: [timeTrackingTool],
      enabled: true,
      permissions: [],
    };

    // Register all skills
    this.registerSkill(fileSystemSkill);
    this.registerSkill(shellSkill);
    this.registerSkill(memorySkill);
    this.registerSkill(databaseSkill);
    this.registerSkill(apiSkill);
    this.registerSkill(dataProcessingSkill);
    this.registerSkill(notificationSkill);
    this.registerSkill(systemMonitoringSkill);
    this.registerSkill(schedulingSkill);
    this.registerSkill(securitySkill);
    this.registerSkill(compressionSkill);
    this.registerSkill(conversationSkill);
    this.registerSkill(textProcessingSkill);
    this.registerSkill(dateTimeSkill);
    this.registerSkill(mathSkill);
    this.registerSkill(networkSkill);
    this.registerSkill(aiToolsSkill);
    this.registerSkill(imageToolsSkill);
    this.registerSkill(pdfToolsSkill);
    this.registerSkill(logConfigToolsSkill);
    this.registerSkill(communicationToolsSkill);
    this.registerSkill(codeQualityToolsSkill);
    this.registerSkill(financialToolsSkill);
    this.registerSkill(spreadsheetToolsSkill);
    this.registerSkill(crmToolsSkill);
    this.registerSkill(erpToolsSkill);
    this.registerSkill(businessIntelligenceToolsSkill);
    this.registerSkill(inventoryToolsSkill);
    this.registerSkill(salesAnalyticsToolsSkill);
    this.registerSkill(complianceToolsSkill);
    this.registerSkill(projectManagementToolsSkill);
    this.registerSkill(timeTrackingToolsSkill);
    
    // Register home automation tools
    const ioTDeviceControlTool = new IoTDeviceControlTool();
    const maintenanceSchedulerTool = new MaintenanceSchedulerTool();
    const financeTrackerTool = new FinanceTrackerTool();
    const healthTrackerTool = new HealthTrackerTool();
    const calendarSchedulerTool = new CalendarSchedulerTool();
    
    this.registerTool(ioTDeviceControlTool);
    this.registerTool(maintenanceSchedulerTool);
    this.registerTool(financeTrackerTool);
    this.registerTool(healthTrackerTool);
    this.registerTool(calendarSchedulerTool);
    
    // Home automation skills
    const homeAutomationSkill: Skill = {
      name: 'home-automation-tools',
      description: 'Home automation and smart home control',
      tools: [ioTDeviceControlTool],
      enabled: true,
      permissions: [],
    };
    
    const homeMaintenanceSkill: Skill = {
      name: 'home-maintenance-tools',
      description: 'Home maintenance scheduling and tracking',
      tools: [maintenanceSchedulerTool],
      enabled: true,
      permissions: [],
    };
    
    const homeFinanceSkill: Skill = {
      name: 'home-finance-tools',
      description: 'Personal and family finance management',
      tools: [financeTrackerTool],
      enabled: true,
      permissions: [],
    };
    
    const healthTrackingSkill: Skill = {
      name: 'health-tracking-tools',
      description: 'Health and fitness tracking for family members',
      tools: [healthTrackerTool],
      enabled: true,
      permissions: [],
    };
    
    const calendarSchedulingSkill: Skill = {
      name: 'calendar-scheduling-tools',
      description: 'Family calendar and activity scheduling',
      tools: [calendarSchedulerTool],
      enabled: true,
      permissions: [],
    };
    
    this.registerSkill(homeAutomationSkill);
    this.registerSkill(homeMaintenanceSkill);
    this.registerSkill(homeFinanceSkill);
    this.registerSkill(healthTrackingSkill);
    this.registerSkill(calendarSchedulingSkill);
    
    // Register Chinese AI tools
    const chineseAILocalTool = new ChineseAILocalTool();
    this.registerTool(chineseAILocalTool);
    
    // Chinese AI skills
    const chineseAISkill: Skill = {
      name: 'chinese-ai-tools',
      description: 'Chinese AI models and local deployment tools',
      tools: [chineseAILocalTool],
      enabled: true,
      permissions: [],
    };
    
    this.registerSkill(chineseAISkill);
  }

  registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  registerSkill(skill: Skill): void {
    this.skills.set(skill.name, skill);
  }

  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getSkill(name: string): Skill | undefined {
    return this.skills.get(name);
  }

  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  getEnabledTools(): Tool[] {
    const enabledTools: Tool[] = [];
    for (const skill of this.skills.values()) {
      if (skill.enabled) {
        enabledTools.push(...skill.tools);
      }
    }
    return enabledTools;
  }

  enableSkill(name: string): void {
    const skill = this.skills.get(name);
    if (skill) {
      skill.enabled = true;
    }
  }

  disableSkill(name: string): void {
    const skill = this.skills.get(name);
    if (skill) {
      skill.enabled = false;
    }
  }
}
