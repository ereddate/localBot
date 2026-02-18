import { Tool } from '../types';

// 导入所有工具类
import { FileTool, FileWriteTool, FileListTool, FileDeleteTool } from './FileTool';
import { ShellTool } from './ShellTool';
import { MemoryTool, MemorySearchTool } from './MemoryTool';
import { MemorySystem } from '../memory/MemorySystem';
import { DatabaseConnectTool, DatabaseExecuteTool } from './DatabaseTools';
import { DatabaseQueryTool, DatabaseInsertTool, DatabaseUpdateTool, DatabaseDeleteTool } from './DatabaseOperationTools';
import { ApiGetTool, ApiPostTool, ApiPutTool, ApiDeleteTool } from './ApiTools';
import { CsvReadTool, CsvWriteTool, JsonReadTool, JsonWriteTool } from './DataProcessingTools';
import { NotificationTool, ScheduleNotificationTool } from './NotificationTools';
import { SystemInfoTool, ProcessListTool, ResourceMonitorTool } from './SystemMonitoringTools';
import { ScheduleTaskTool, CancelTaskTool, ListScheduledTasksTool } from './SchedulingTools';
import { EncryptTool, DecryptTool, HashTool } from './SecurityTools';
import { ZipTool, UnzipTool, CompressTool, DecompressTool } from './CompressionTools';
import { ConversationHistoryTool, ContextManagementTool, SummarizeConversationTool } from './ConversationTools';
import { TextAnalysisTool, TextSearchTool, TextTransformTool } from './TextTools';
import { DateTimeTool, TimezoneTool, CalendarTool } from './DateTimeTools';
import { MathCalculationTool, UnitConversionTool, StatisticsTool } from './MathTools';
import { NetworkTool, DnsLookupTool, WhoisTool } from './NetworkTools';
import { AiModelTool, ImageGenerationTool, EmbeddingTool } from './AiTools';
import { ImageResizeTool, ImageFormatConverterTool, ImageMetadataTool } from './ImageTools';
import { PdfReaderTool, PdfWriterTool, PdfMergeTool } from './PdfTools';
import { LogManagementTool, ConfigManagementTool } from './LogAndConfigTools';
import { EmailTool, CodeAnalysisTool } from './EmailAndCodeAnalysisTools';
import { FinancialCalculatorTool, SpreadsheetTool } from './BusinessTools1';
import { CrmTool, ErpTool } from './BusinessTools2';
import { BusinessIntelligenceTool, InventoryManagementTool } from './BusinessTools3';
import { SalesAnalyticsTool, ComplianceCheckerTool } from './BusinessTools4';
import { ProjectManagementTool, TimeTrackingTool } from './BusinessTools5';
import { WorkflowApprovalTool, DocumentGeneratorTool, ValidationCheckTool, NotificationSendTool, DocumentGenerationTool } from './UtilityTools';
import { HrSystemTool, DocumentManagementTool, AnalyticsEngineTool, ReportGeneratorTool } from './AnalyticsTools';
import { AccountingSystemTool, PaymentGatewayTool, TaxCalculatorTool } from './FinancialTools';
import { TimeTrackingToolExtended, ProjectManagementToolExtended, QualityManagementTool, WorkflowSystemTool } from './ProjectAndOperationsTools';
import { IoTDeviceControlTool, MaintenanceSchedulerTool, FinanceTrackerTool, HealthTrackerTool, CalendarSchedulerTool } from './HomeAutomationTools';
import { ChineseAILocalTool } from './ChineseAITools';
import { WeatherTool } from './WeatherTool';
import { NewsAggregatorTool } from './NewsAggregatorTool';
import { TranslationTool } from './TranslationTool';
import { CalculatorTool } from './CalculatorTool';
import { PasswordGeneratorTool } from './PasswordGeneratorTool';
import { MapLocationTool } from './MapLocationTool';
import { CalendarEventTool } from './CalendarEventTool';
import { ReminderTodoTool } from './ReminderTodoTool';
import { ImageProcessingTool } from './ImageProcessingTool';
import { AudioProcessingTool } from './AudioProcessingTool';
import { TaxCalculationTool } from './TaxCalculationTool';
import { TaxSoftwareIntegrationTool } from './TaxSoftwareIntegrationTool';
import { IRSEfileSystemTool } from './IRSEfileSystemTool';
import { DataDiscoveryTool } from './DataDiscoveryTool';
import { DataIntegrationTool } from './DataIntegrationTool';
import { ETLTool } from './ETLTool';
import { DataQualityTool } from './DataQualityTool';
import { DataCleaningTool } from './DataCleaningTool';
import { StatisticalTool } from './StatisticalTool';
import { MachineLearningTool } from './MachineLearningTool';
import { DataMiningTool } from './DataMiningTool';
import { VisualizationTool } from './VisualizationTool';
import { DashboardTool } from './DashboardTool';
import { TestingTool } from './TestingTool';
import { ReportingTool } from './ReportingTool';
import { ContactManagementTool } from './ContactManagementTool';
import { SchedulingTool } from './SchedulingTool';
import { LegalResearchTool } from './LegalResearchTool';
import { ComplianceDatabaseTool } from './ComplianceDatabaseTool';
import { StrategicPlanningTool } from './StrategicPlanningTool';
import { AdvancedLocationServiceTool } from './AdvancedLocationServiceTool';
import { SearchTool } from './SearchTool';
import { WebScrapingTool } from './WebScrapingTool';
import { EmailSendingTool } from './EmailSendingTool';
import { CodeInterpreterTool } from './CodeInterpreterTool';
import { MarketAnalysisTool } from './MarketAnalysisTool';

export class SkillManager {
  private skills: Map<string, any>;
  private tools: Map<string, Tool>;
  public memorySystem: MemorySystem;

  constructor(memorySystem?: MemorySystem) {
    this.skills = new Map();
    this.tools = new Map();
    this.memorySystem = memorySystem || new MemorySystem();
    this.registerDefaultSkills();
  }

  private registerDefaultSkills() {
    // 初始化所有工具实例
    const fileTool = new FileTool();
    const fileWriteTool = new FileWriteTool();
    const fileListTool = new FileListTool();
    const fileDeleteTool = new FileDeleteTool();
    const shellTool = new ShellTool();
    const memoryTool = new MemoryTool(this.memorySystem);
    const memorySearchTool = new MemorySearchTool(this.memorySystem);

    // 数据库工具
    const dbConnectTool = new DatabaseConnectTool();
    const dbQueryTool = new DatabaseQueryTool();
    const dbExecuteTool = new DatabaseExecuteTool();

    // API工具
    const apiGetTool = new ApiGetTool();
    const apiPostTool = new ApiPostTool();
    const apiPutTool = new ApiPutTool();
    const apiDeleteTool = new ApiDeleteTool();

    // 数据处理工具
    const csvReadTool = new CsvReadTool();
    const csvWriteTool = new CsvWriteTool();
    const jsonReadTool = new JsonReadTool();
    const jsonWriteTool = new JsonWriteTool();

    // 通知工具
    const notificationTool = new NotificationTool();
    const scheduleNotificationTool = new ScheduleNotificationTool();

    // 系统监控工具
    const systemInfoTool = new SystemInfoTool();
    const processListTool = new ProcessListTool();
    const resourceMonitorTool = new ResourceMonitorTool();

    // 计划任务工具
    const scheduleTaskTool = new ScheduleTaskTool();
    const cancelTaskTool = new CancelTaskTool();
    const listScheduledTasksTool = new ListScheduledTasksTool();

    // 安全工具
    const encryptTool = new EncryptTool();
    const decryptTool = new DecryptTool();
    const hashTool = new HashTool();

    // 压缩工具
    const zipTool = new ZipTool();
    const unzipTool = new UnzipTool();
    const compressTool = new CompressTool();
    const decompressTool = new DecompressTool();

    // 对话工具
    const conversationHistoryTool = new ConversationHistoryTool();
    const contextManagementTool = new ContextManagementTool();
    const summarizeConversationTool = new SummarizeConversationTool();

    // 文本处理工具
    const textAnalysisTool = new TextAnalysisTool();
    const textSearchTool = new TextSearchTool();
    const textTransformTool = new TextTransformTool();

    // 日期时间工具
    const dateTimeTool = new DateTimeTool();
    const timezoneTool = new TimezoneTool();
    const calendarTool = new CalendarTool();

    // 数学工具
    const mathCalculationTool = new MathCalculationTool();
    const unitConversionTool = new UnitConversionTool();
    const statisticsTool = new StatisticsTool();

    // 网络工具
    const networkTool = new NetworkTool();
    const dnsLookupTool = new DnsLookupTool();
    const whoisTool = new WhoisTool();

    // AI工具
    const aiModelTool = new AiModelTool();
    const imageGenerationTool = new ImageGenerationTool();
    const embeddingTool = new EmbeddingTool();

    // 图像工具
    const imageResizeTool = new ImageResizeTool();
    const imageFormatConverterTool = new ImageFormatConverterTool();
    const imageMetadataTool = new ImageMetadataTool();

    // PDF工具
    const pdfReaderTool = new PdfReaderTool();
    const pdfWriterTool = new PdfWriterTool();
    const pdfMergeTool = new PdfMergeTool();

    // 日志和配置工具
    const logManagementTool = new LogManagementTool();
    const configManagementTool = new ConfigManagementTool();

    // 邮件和代码分析工具
    const emailTool = new EmailTool();
    const codeAnalysisTool = new CodeAnalysisTool();

    // 业务工具
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

    // 数据库操作工具
    const databaseInsertTool = new DatabaseInsertTool();
    const databaseQueryTool = new DatabaseQueryTool();
    const databaseUpdateTool = new DatabaseUpdateTool();
    const databaseDeleteTool = new DatabaseDeleteTool();

    // 实用工具
    const workflowApprovalTool = new WorkflowApprovalTool();
    const documentGeneratorTool = new DocumentGeneratorTool();
    const validationCheckTool = new ValidationCheckTool();
    const notificationSendTool = new NotificationSendTool();
    const documentGenerationTool = new DocumentGenerationTool();

    // 分析工具
    const hrSystemTool = new HrSystemTool();
    const documentManagementTool = new DocumentManagementTool();
    const analyticsEngineTool = new AnalyticsEngineTool();
    const reportGeneratorTool = new ReportGeneratorTool();

    // 金融工具
    const accountingSystemTool = new AccountingSystemTool();
    const paymentGatewayTool = new PaymentGatewayTool();
    const taxCalculatorTool = new TaxCalculatorTool();
    const marketAnalysisTool = new MarketAnalysisTool();

    // 项目和运营工具
    const timeTrackingToolExtended = new TimeTrackingToolExtended();
    const projectManagementToolExtended = new ProjectManagementToolExtended();
    const qualityManagementTool = new QualityManagementTool();
    const workflowSystemTool = new WorkflowSystemTool();

    // 家庭自动化工具
    const ioTDeviceControlTool = new IoTDeviceControlTool();
    const maintenanceSchedulerTool = new MaintenanceSchedulerTool();
    const financeTrackerTool = new FinanceTrackerTool();
    const healthTrackerTool = new HealthTrackerTool();
    const calendarSchedulerTool = new CalendarSchedulerTool();

    // 中文AI工具
    const chineseAILocalTool = new ChineseAILocalTool();

    // 新增实用工具
    const weatherTool = new WeatherTool();
    const newsAggregatorTool = new NewsAggregatorTool();
    const translationTool = new TranslationTool();
    const calculatorTool = new CalculatorTool();
    const passwordGeneratorTool = new PasswordGeneratorTool();

    // 位置、日历和提醒工具
    const mapLocationTool = new MapLocationTool();
    const calendarEventTool = new CalendarEventTool();
    const reminderTodoTool = new ReminderTodoTool();
    const imageProcessingTool = new ImageProcessingTool();
    const audioProcessingTool = new AudioProcessingTool();

    // 税务相关工具
    const taxCalculationTool = new TaxCalculationTool();
    const taxSoftwareIntegrationTool = new TaxSoftwareIntegrationTool();
    const irsEfileSystemTool = new IRSEfileSystemTool();

    // 数据科学工具
    const dataDiscoveryTool = new DataDiscoveryTool();
    const dataIntegrationTool = new DataIntegrationTool();
    const etlTool = new ETLTool();
    const dataQualityTool = new DataQualityTool();
    const dataCleaningTool = new DataCleaningTool();
    const statisticalTool = new StatisticalTool();
    const machineLearningTool = new MachineLearningTool();
    const dataMiningTool = new DataMiningTool();
    const visualizationTool = new VisualizationTool();
    const dashboardTool = new DashboardTool();
    const testingTool = new TestingTool();
    const reportingTool = new ReportingTool();
    const contactManagementTool = new ContactManagementTool();
    const schedulingTool = new SchedulingTool();
    const legalResearchTool = new LegalResearchTool();
    const complianceDatabaseTool = new ComplianceDatabaseTool();
    const strategicPlanningTool = new StrategicPlanningTool();
    
    // 高级位置服务工具
    const advancedLocationServiceTool = new AdvancedLocationServiceTool();
    
    // 网络和通信工具
    const searchTool = new SearchTool();
    const webScrapingTool = new WebScrapingTool();
    const emailSendingTool = new EmailSendingTool();
    
    // 代码执行工具
    const codeInterpreterTool = new CodeInterpreterTool();

    // 注册所有工具
    this.registerTool(fileTool);
    this.registerTool(fileWriteTool);
    this.registerTool(fileListTool);
    this.registerTool(fileDeleteTool);
    this.registerTool(shellTool);
    this.registerTool(memoryTool);
    this.registerTool(memorySearchTool);

    // 注册数据库工具
    this.registerTool(dbConnectTool);
    this.registerTool(dbQueryTool);
    this.registerTool(dbExecuteTool);

    // 注册API工具
    this.registerTool(apiGetTool);
    this.registerTool(apiPostTool);
    this.registerTool(apiPutTool);
    this.registerTool(apiDeleteTool);

    // 注册数据处理工具
    this.registerTool(csvReadTool);
    this.registerTool(csvWriteTool);
    this.registerTool(jsonReadTool);
    this.registerTool(jsonWriteTool);

    // 注册通知工具
    this.registerTool(notificationTool);
    this.registerTool(scheduleNotificationTool);

    // 注册系统监控工具
    this.registerTool(systemInfoTool);
    this.registerTool(processListTool);
    this.registerTool(resourceMonitorTool);

    // 注册计划任务工具
    this.registerTool(scheduleTaskTool);
    this.registerTool(cancelTaskTool);
    this.registerTool(listScheduledTasksTool);

    // 注册安全工具
    this.registerTool(encryptTool);
    this.registerTool(decryptTool);
    this.registerTool(hashTool);

    // 注册压缩工具
    this.registerTool(zipTool);
    this.registerTool(unzipTool);
    this.registerTool(compressTool);
    this.registerTool(decompressTool);

    // 注册对话工具
    this.registerTool(conversationHistoryTool);
    this.registerTool(contextManagementTool);
    this.registerTool(summarizeConversationTool);

    // 注册文本处理工具
    this.registerTool(textAnalysisTool);
    this.registerTool(textSearchTool);
    this.registerTool(textTransformTool);

    // 注册日期时间工具
    this.registerTool(dateTimeTool);
    this.registerTool(timezoneTool);
    this.registerTool(calendarTool);

    // 注册数学工具
    this.registerTool(mathCalculationTool);
    this.registerTool(unitConversionTool);
    this.registerTool(statisticsTool);

    // 注册网络工具
    this.registerTool(networkTool);
    this.registerTool(dnsLookupTool);
    this.registerTool(whoisTool);

    // 注册AI工具
    this.registerTool(aiModelTool);
    this.registerTool(imageGenerationTool);
    this.registerTool(embeddingTool);

    // 注册图像工具
    this.registerTool(imageResizeTool);
    this.registerTool(imageFormatConverterTool);
    this.registerTool(imageMetadataTool);

    // 注册PDF工具
    this.registerTool(pdfReaderTool);
    this.registerTool(pdfWriterTool);
    this.registerTool(pdfMergeTool);

    // 注册日志和配置工具
    this.registerTool(logManagementTool);
    this.registerTool(configManagementTool);

    // 注册邮件和代码分析工具
    this.registerTool(emailTool);
    this.registerTool(codeAnalysisTool);

    // 注册业务工具
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

    // 注册数据库操作工具
    this.registerTool(databaseInsertTool);
    this.registerTool(databaseQueryTool);
    this.registerTool(databaseUpdateTool);
    this.registerTool(databaseDeleteTool);

    // 注册实用工具
    this.registerTool(workflowApprovalTool);
    this.registerTool(documentGeneratorTool);
    this.registerTool(validationCheckTool);
    this.registerTool(notificationSendTool);
    this.registerTool(documentGenerationTool);

    // 注册分析工具
    this.registerTool(hrSystemTool);
    this.registerTool(documentManagementTool);
    this.registerTool(analyticsEngineTool);
    this.registerTool(reportGeneratorTool);

    // 注册金融工具
    this.registerTool(accountingSystemTool);
    this.registerTool(paymentGatewayTool);
    this.registerTool(taxCalculatorTool);

    // 注册项目和运营工具
    this.registerTool(timeTrackingToolExtended);
    this.registerTool(projectManagementToolExtended);
    this.registerTool(qualityManagementTool);
    this.registerTool(workflowSystemTool);

    // 注册家庭自动化工具
    this.registerTool(ioTDeviceControlTool);
    this.registerTool(maintenanceSchedulerTool);
    this.registerTool(financeTrackerTool);
    this.registerTool(healthTrackerTool);
    this.registerTool(calendarSchedulerTool);

    // 注册中文AI工具
    this.registerTool(chineseAILocalTool);

    // 注册新增实用工具
    this.registerTool(weatherTool);
    this.registerTool(newsAggregatorTool);
    this.registerTool(translationTool);
    this.registerTool(calculatorTool);
    this.registerTool(passwordGeneratorTool);

    // 注册位置、日历和提醒工具
    this.registerTool(mapLocationTool);
    this.registerTool(calendarEventTool);
    this.registerTool(reminderTodoTool);
    this.registerTool(imageProcessingTool);
    this.registerTool(audioProcessingTool);

    // 注册税务相关工具
    this.registerTool(taxCalculationTool);
    this.registerTool(taxSoftwareIntegrationTool);
    this.registerTool(irsEfileSystemTool);

    // 注册数据科学工具
    this.registerTool(dataDiscoveryTool);
    this.registerTool(dataIntegrationTool);
    this.registerTool(etlTool);
    this.registerTool(dataQualityTool);
    this.registerTool(dataCleaningTool);
    
    // 注册网络和通信工具
    this.registerTool(searchTool);
    this.registerTool(webScrapingTool);
    this.registerTool(emailSendingTool);
    
    // 注册代码执行工具
    this.registerTool(codeInterpreterTool);
    this.registerTool(statisticalTool);
    this.registerTool(machineLearningTool);
    this.registerTool(dataMiningTool);
    this.registerTool(visualizationTool);
    this.registerTool(dashboardTool);
    this.registerTool(testingTool);
    this.registerTool(reportingTool);
    this.registerTool(contactManagementTool);
    this.registerTool(schedulingTool);
    this.registerTool(legalResearchTool);
    this.registerTool(complianceDatabaseTool);
    this.registerTool(strategicPlanningTool);
    
    // 注册高级位置服务工具
    this.registerTool(advancedLocationServiceTool);
    
    // 注册市场分析工具
    this.registerTool(marketAnalysisTool);

    // 原始技能
    const fileSystemSkill = {
      name: 'file-system',
      description: '文件系统操作',
      tools: [fileTool, fileWriteTool, fileListTool, fileDeleteTool],
      enabled: true,
      permissions: [],
    };

    const shellSkill = {
      name: 'shell',
      description: 'Shell命令执行',
      tools: [shellTool],
      enabled: true,
      permissions: [],
    };

    const memorySkill = {
      name: 'memory',
      description: '内存管理',
      tools: [memoryTool, memorySearchTool],
      enabled: true,
      permissions: [],
    };

    // 数据库技能
    const databaseSkill = {
      name: 'database',
      description: '数据库操作 (连接, 查询, 执行)',
      tools: [dbConnectTool, dbQueryTool, dbExecuteTool],
      enabled: true,
      permissions: [],
    };

    // API管理技能
    const apiSkill = {
      name: 'api-management',
      description: 'API管理操作 (GET, POST, PUT, DELETE)',
      tools: [apiGetTool, apiPostTool, apiPutTool, apiDeleteTool],
      enabled: true,
      permissions: [],
    };

    // 数据处理技能
    const dataProcessingSkill = {
      name: 'data-processing',
      description: '数据处理操作 (CSV, JSON)',
      tools: [csvReadTool, csvWriteTool, jsonReadTool, jsonWriteTool],
      enabled: true,
      permissions: [],
    };

    // 通知技能
    const notificationSkill = {
      name: 'notifications',
      description: '通知操作 (发送, 计划)',
      tools: [notificationTool, scheduleNotificationTool],
      enabled: true,
      permissions: [],
    };

    // 系统监控技能
    const systemMonitoringSkill = {
      name: 'system-monitoring',
      description: '系统监控操作 (信息, 进程, 资源)',
      tools: [systemInfoTool, processListTool, resourceMonitorTool],
      enabled: true,
      permissions: [],
    };

    // 任务计划技能
    const schedulingSkill = {
      name: 'task-scheduling',
      description: '任务计划操作 (计划, 取消, 列表)',
      tools: [scheduleTaskTool, cancelTaskTool, listScheduledTasksTool],
      enabled: true,
      permissions: [],
    };

    // 安全工具技能
    const securitySkill = {
      name: 'security-tools',
      description: '安全操作 (加密, 解密, 哈希)',
      tools: [encryptTool, decryptTool, hashTool],
      enabled: true,
      permissions: [],
    };

    // 压缩工具技能
    const compressionSkill = {
      name: 'compression-tools',
      description: '文件和数据压缩操作',
      tools: [zipTool, unzipTool, compressTool, decompressTool],
      enabled: true,
      permissions: [],
    };

    // 对话工具技能
    const conversationSkill = {
      name: 'conversation-tools',
      description: '对话管理和上下文处理',
      tools: [conversationHistoryTool, contextManagementTool, summarizeConversationTool],
      enabled: true,
      permissions: [],
    };

    // 文本处理技能
    const textProcessingSkill = {
      name: 'text-processing',
      description: '文本分析、搜索和转换工具',
      tools: [textAnalysisTool, textSearchTool, textTransformTool],
      enabled: true,
      permissions: [],
    };

    // 日期时间工具技能
    const dateTimeSkill = {
      name: 'date-time-tools',
      description: '日期和时间操作及计算',
      tools: [dateTimeTool, timezoneTool, calendarTool],
      enabled: true,
      permissions: [],
    };

    // 数学工具技能
    const mathSkill = {
      name: 'math-tools',
      description: '数学计算和单位转换',
      tools: [mathCalculationTool, unitConversionTool, statisticsTool],
      enabled: true,
      permissions: [],
    };

    // 网络工具技能
    const networkSkill = {
      name: 'network-tools',
      description: '网络操作和DNS查询',
      tools: [networkTool, dnsLookupTool, whoisTool],
      enabled: true,
      permissions: [],
    };

    // AI工具技能
    const aiToolsSkill = {
      name: 'ai-tools',
      description: 'AI模型操作 (推理, 生成, 嵌入)',
      tools: [aiModelTool, imageGenerationTool, embeddingTool],
      enabled: true,
      permissions: [],
    };

    // 图像工具技能
    const imageToolsSkill = {
      name: 'image-tools',
      description: '图像处理操作 (调整大小, 格式转换, 元数据)',
      tools: [imageResizeTool, imageFormatConverterTool, imageMetadataTool],
      enabled: true,
      permissions: [],
    };

    // PDF工具技能
    const pdfToolsSkill = {
      name: 'pdf-tools',
      description: 'PDF操作 (读取, 写入, 合并)',
      tools: [pdfReaderTool, pdfWriterTool, pdfMergeTool],
      enabled: true,
      permissions: [],
    };

    // 日志和配置工具技能
    const logConfigToolsSkill = {
      name: 'log-config-tools',
      description: '日志和配置管理操作',
      tools: [logManagementTool, configManagementTool],
      enabled: true,
      permissions: [],
    };

    // 通信工具技能
    const communicationToolsSkill = {
      name: 'communication-tools',
      description: '通信操作 (邮件)',
      tools: [emailTool],
      enabled: true,
      permissions: [],
    };

    // 代码质量工具技能
    const codeQualityToolsSkill = {
      name: 'code-quality-tools',
      description: '代码分析和质量保证工具',
      tools: [codeAnalysisTool],
      enabled: true,
      permissions: [],
    };

    // 金融工具技能
    const financialToolsSkill = {
      name: 'financial-tools',
      description: '财务计算和商业金融操作',
      tools: [financialCalculatorTool],
      enabled: true,
      permissions: [],
    };

    // 电子表格工具技能
    const spreadsheetToolsSkill = {
      name: 'spreadsheet-tools',
      description: '电子表格操作 (Excel/Google Sheets)',
      tools: [spreadsheetTool],
      enabled: true,
      permissions: [],
    };

    // CRM工具技能
    const crmToolsSkill = {
      name: 'crm-tools',
      description: '客户关系管理操作',
      tools: [crmTool],
      enabled: true,
      permissions: [],
    };

    // ERP工具技能
    const erpToolsSkill = {
      name: 'erp-tools',
      description: '企业资源计划操作',
      tools: [erpTool],
      enabled: true,
      permissions: [],
    };

    // 商业智能工具技能
    const businessIntelligenceToolsSkill = {
      name: 'business-intelligence-tools',
      description: '商业智能和分析操作',
      tools: [businessIntelligenceTool],
      enabled: true,
      permissions: [],
    };

    // 库存工具技能
    const inventoryToolsSkill = {
      name: 'inventory-tools',
      description: '库存跟踪和管理操作',
      tools: [inventoryManagementTool],
      enabled: true,
      permissions: [],
    };

    // 销售分析工具技能
    const salesAnalyticsToolsSkill = {
      name: 'sales-analytics-tools',
      description: '销售数据分析和报告',
      tools: [salesAnalyticsTool],
      enabled: true,
      permissions: [],
    };

    // 合规工具技能
    const complianceToolsSkill = {
      name: 'compliance-tools',
      description: '商业合规检查和审计',
      tools: [complianceCheckerTool],
      enabled: true,
      permissions: [],
    };

    // 项目管理工具技能
    const projectManagementToolsSkill = {
      name: 'project-management-tools',
      description: '项目跟踪和管理操作',
      tools: [projectManagementTool],
      enabled: true,
      permissions: [],
    };

    // 时间跟踪工具技能
    const timeTrackingToolsSkill = {
      name: 'time-tracking-tools',
      description: '员工时间跟踪和管理',
      tools: [timeTrackingTool],
      enabled: true,
      permissions: [],
    };

    // 家庭自动化工具技能
    const homeAutomationSkill = {
      name: 'home-automation-tools',
      description: '家庭自动化和智能家居控制',
      tools: [ioTDeviceControlTool],
      enabled: true,
      permissions: [],
    };

    const homeMaintenanceSkill = {
      name: 'home-maintenance-tools',
      description: '家庭维护计划和跟踪',
      tools: [maintenanceSchedulerTool],
      enabled: true,
      permissions: [],
    };

    const homeFinanceSkill = {
      name: 'home-finance-tools',
      description: '个人和家庭财务管理',
      tools: [financeTrackerTool],
      enabled: true,
      permissions: [],
    };

    const healthTrackingSkill = {
      name: 'health-tracking-tools',
      description: '家庭成员健康和健身跟踪',
      tools: [healthTrackerTool],
      enabled: true,
      permissions: [],
    };

    const calendarSchedulingSkill = {
      name: 'calendar-scheduling-tools',
      description: '家庭日历和活动计划',
      tools: [calendarSchedulerTool],
      enabled: true,
      permissions: [],
    };

    // 中文AI工具技能
    const chineseAISkill = {
      name: 'chinese-ai-tools',
      description: '中文AI模型和本地部署工具',
      tools: [chineseAILocalTool],
      enabled: true,
      permissions: [],
    };

    // 新增实用工具技能
    const weatherSkill = {
      name: 'weather-tools',
      description: '天气信息和预报工具',
      tools: [weatherTool],
      enabled: true,
      permissions: [],
    };

    const newsSkill = {
      name: 'news-tools',
      description: '新闻聚合和信息检索工具',
      tools: [newsAggregatorTool],
      enabled: true,
      permissions: [],
    };

    const translationSkill = {
      name: 'translation-tools',
      description: '文本翻译和语言处理工具',
      tools: [translationTool],
      enabled: true,
      permissions: [],
    };

    const calculatorSkill = {
      name: 'calculator-tools',
      description: '数学计算和表达式评估工具',
      tools: [calculatorTool],
      enabled: true,
      permissions: [],
    };

    const passwordSkill = {
      name: 'password-tools',
      description: '安全密码生成和管理工具',
      tools: [passwordGeneratorTool],
      enabled: true,
      permissions: [],
    };

    // 位置、日历和提醒工具技能
    const mapLocationSkill = {
      name: 'map-location-tools',
      description: '地图和位置服务，包括地理编码、方向和距离计算',
      tools: [mapLocationTool],
      enabled: true,
      permissions: [],
    };

    const calendarEventSkill = {
      name: 'calendar-event-tools',
      description: '日历和事件管理工具，用于安排和组织事件',
      tools: [calendarEventTool],
      enabled: true,
      permissions: [],
    };

    const reminderTodoSkill = {
      name: 'reminder-todo-tools',
      description: '提醒和待办事项管理工具，用于任务组织',
      tools: [reminderTodoTool],
      enabled: true,
      permissions: [],
    };

    const imageProcessingSkill = {
      name: 'image-processing-tools',
      description: '图像处理工具，用于调整大小、转换和操作图像',
      tools: [imageProcessingTool],
      enabled: true,
      permissions: [],
    };

    const audioProcessingSkill = {
      name: 'audio-processing-tools',
      description: '音频处理工具，用于修剪、调整和操作音频文件',
      tools: [audioProcessingTool],
      enabled: true,
      permissions: [],
    };

    // 税务相关技能
    const taxCalculationSkill = {
      name: 'tax-calculation-tools',
      description: '税务计算和规划工具，适用于个人和企业',
      tools: [taxCalculationTool],
      enabled: true,
      permissions: [],
    };

    const taxSoftwareSkill = {
      name: 'tax-software-tools',
      description: '税务软件集成工具，用于准备和提交申报表',
      tools: [taxSoftwareIntegrationTool],
      enabled: true,
      permissions: [],
    };

    const irsEfileSkill = {
      name: 'irs-efile-tools',
      description: 'IRS电子申报系统集成工具',
      tools: [irsEfileSystemTool],
      enabled: true,
      permissions: [],
    };

    // 数据科学技能
    const dataDiscoverySkill = {
      name: 'data-discovery-tools',
      description: '数据发现和探索工具，用于分析数据源结构和内容',
      tools: [dataDiscoveryTool],
      enabled: true,
      permissions: [],
    };

    const dataIntegrationSkill = {
      name: 'data-integration-tools',
      description: '数据集成工具，用于合并多个数据源',
      tools: [dataIntegrationTool],
      enabled: true,
      permissions: [],
    };

    const etlSkill = {
      name: 'etl-tools',
      description: 'ETL（提取、转换、加载）工具，用于数据管道处理',
      tools: [etlTool],
      enabled: true,
      permissions: [],
    };

    const dataQualitySkill = {
      name: 'data-quality-tools',
      description: '数据质量检查和验证工具',
      tools: [dataQualityTool],
      enabled: true,
      permissions: [],
    };

    const dataCleaningSkill = {
      name: 'data-cleaning-tools',
      description: '数据清洗和预处理工具',
      tools: [dataCleaningTool],
      enabled: true,
      permissions: [],
    };

    const statisticalAnalysisSkill = {
      name: 'statistical-analysis-tools',
      description: '统计分析和推断工具',
      tools: [statisticalTool],
      enabled: true,
      permissions: [],
    };

    const machineLearningSkill = {
      name: 'machine-learning-tools',
      description: '机器学习算法和模型训练工具',
      tools: [machineLearningTool],
      enabled: true,
      permissions: [],
    };

    const dataMiningSkill = {
      name: 'data-mining-tools',
      description: '数据挖掘和模式识别工具',
      tools: [dataMiningTool],
      enabled: true,
      permissions: [],
    };

    const dataVisualizationSkill = {
      name: 'data-visualization-tools',
      description: '数据可视化和图表生成工具',
      tools: [visualizationTool],
      enabled: true,
      permissions: [],
    };

    const dashboardSkill = {
      name: 'dashboard-tools',
      description: '仪表板创建和数据展示工具',
      tools: [dashboardTool],
      enabled: true,
      permissions: [],
    };

    const testingSkill = {
      name: 'testing-tools',
      description: '测试和验证工具',
      tools: [testingTool],
      enabled: true,
      permissions: [],
    };

    const reportingSkill = {
      name: 'reporting-tools',
      description: '报告生成和分析工具',
      tools: [reportingTool],
      enabled: true,
      permissions: [],
    };

    const contactManagementSkill = {
      name: 'contact-management-tools',
      description: '联系人管理和CRM工具',
      tools: [contactManagementTool],
      enabled: true,
      permissions: [],
    };

    const schedulingOptimizationSkill = {
      name: 'scheduling-optimization-tools',
      description: '日程安排和优化工具',
      tools: [schedulingTool],
      enabled: true,
      permissions: [],
    };

    const legalResearchSkill = {
      name: 'legal-research-tools',
      description: '法律研究和法规查询工具',
      tools: [legalResearchTool],
      enabled: true,
      permissions: [],
    };

    const complianceDatabaseSkill = {
      name: 'compliance-database-tools',
      description: '合规数据库和标准查询工具',
      tools: [complianceDatabaseTool],
      enabled: true,
      permissions: [],
    };

    const strategicPlanningSkill = {
      name: 'strategic-planning-tools',
      description: '战略规划和SWOT分析工具',
      tools: [strategicPlanningTool],
      enabled: true,
      permissions: [],
    };

    // 高级位置服务技能
    const advancedLocationServiceSkill = {
      name: 'advanced-location-service-tools',
      description: '高级定位服务，提供GPS坐标获取、附近地点搜索、实时定位等功能',
      tools: [advancedLocationServiceTool],
      enabled: true,
      permissions: [],
    };

    // 注册所有技能
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
    this.registerSkill(homeAutomationSkill);
    this.registerSkill(homeMaintenanceSkill);
    this.registerSkill(homeFinanceSkill);
    this.registerSkill(healthTrackingSkill);
    this.registerSkill(calendarSchedulingSkill);
    this.registerSkill(chineseAISkill);
    this.registerSkill(weatherSkill);
    this.registerSkill(newsSkill);
    this.registerSkill(translationSkill);
    this.registerSkill(calculatorSkill);
    this.registerSkill(passwordSkill);
    this.registerSkill(mapLocationSkill);
    this.registerSkill(calendarEventSkill);
    this.registerSkill(reminderTodoSkill);
    this.registerSkill(imageProcessingSkill);
    this.registerSkill(audioProcessingSkill);
    this.registerSkill(taxCalculationSkill);
    this.registerSkill(taxSoftwareSkill);
    this.registerSkill(irsEfileSkill);
    this.registerSkill(dataDiscoverySkill);
    this.registerSkill(dataIntegrationSkill);
    this.registerSkill(etlSkill);
    this.registerSkill(dataQualitySkill);
    this.registerSkill(dataCleaningSkill);
    this.registerSkill(statisticalAnalysisSkill);
    this.registerSkill(machineLearningSkill);
    this.registerSkill(dataMiningSkill);
    this.registerSkill(dataVisualizationSkill);
    this.registerSkill(dashboardSkill);
    this.registerSkill(testingSkill);
    this.registerSkill(reportingSkill);
    this.registerSkill(contactManagementSkill);
    this.registerSkill(schedulingOptimizationSkill);
    this.registerSkill(legalResearchSkill);
    this.registerSkill(complianceDatabaseSkill);
    this.registerSkill(strategicPlanningSkill);
    this.registerSkill(advancedLocationServiceSkill);
  }

  registerTool(tool: Tool) {
    this.tools.set(tool.name, tool);
  }

  registerSkill(skill: any) {
    this.skills.set(skill.name, skill);
  }

  getTool(name: string) {
    return this.tools.get(name);
  }

  getSkill(name: string) {
    return this.skills.get(name);
  }

  getAllTools() {
    return Array.from(this.tools.values());
  }

  getAllSkills() {
    return Array.from(this.skills.values());
  }

  getEnabledTools() {
    const enabledTools: Tool[] = [];
    for (const skill of this.skills.values()) {
      if (skill.enabled) {
        enabledTools.push(...skill.tools);
      }
    }
    // Also include all individually registered tools
    enabledTools.push(...this.tools.values());
    return enabledTools;
  }

  enableSkill(name: string) {
    const skill = this.skills.get(name);
    if (skill) {
      skill.enabled = true;
    }
  }

  disableSkill(name: string) {
    const skill = this.skills.get(name);
    if (skill) {
      skill.enabled = false;
    }
  }

  // 初始化额外的技能用于工作流完成
  initializeAdditionalSkills() {
    // 获取已注册的工具实例
    const validationCheckTool = this.getTool('validation_check');
    const analyticsEngineTool = this.getTool('analytics_engine');
    const documentGenerationTool = this.getTool('document_generation');

    // 只有当工具存在且尚未注册对应的技能时才注册
    if (validationCheckTool && !this.skills.has('validation-check-tools')) {
      const validationCheckSkill = {
        name: 'validation-check-tools',
        description: '验证和合规检查工具',
        tools: [validationCheckTool],
        enabled: true,
        permissions: [],
      };
      this.registerSkill(validationCheckSkill);
    }

    if (analyticsEngineTool && !this.skills.has('analytics-engine-tools')) {
      const analyticsEngineSkill = {
        name: 'analytics-engine-tools',
        description: '分析和策略生成工具',
        tools: [analyticsEngineTool],
        enabled: true,
        permissions: [],
      };
      this.registerSkill(analyticsEngineSkill);
    }

    if (documentGenerationTool && !this.skills.has('document-generation-tools')) {
      const documentGenerationSkill = {
        name: 'document-generation-tools',
        description: '文档和报告生成工具',
        tools: [documentGenerationTool],
        enabled: true,
        permissions: [],
      };
      this.registerSkill(documentGenerationSkill);
    }
  }
}