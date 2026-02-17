"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillManager = void 0;
const FileTool_1 = require("./FileTool");
const ShellTool_1 = require("./ShellTool");
const MemoryTool_1 = require("./MemoryTool");
const MemorySystem_1 = require("../memory/MemorySystem");
const DatabaseTools_1 = require("./DatabaseTools");
const ApiTools_1 = require("./ApiTools");
const DataProcessingTools_1 = require("./DataProcessingTools");
const NotificationTools_1 = require("./NotificationTools");
const SystemMonitoringTools_1 = require("./SystemMonitoringTools");
const SchedulingTools_1 = require("./SchedulingTools");
const SecurityTools_1 = require("./SecurityTools");
const CompressionTools_1 = require("./CompressionTools");
const ConversationTools_1 = require("./ConversationTools");
const TextTools_1 = require("./TextTools");
const DateTimeTools_1 = require("./DateTimeTools");
const MathTools_1 = require("./MathTools");
const NetworkTools_1 = require("./NetworkTools");
const AiTools_1 = require("./AiTools");
const ImageTools_1 = require("./ImageTools");
const PdfTools_1 = require("./PdfTools");
const LogAndConfigTools_1 = require("./LogAndConfigTools");
const EmailAndCodeAnalysisTools_1 = require("./EmailAndCodeAnalysisTools");
const BusinessTools1_1 = require("./BusinessTools1");
const BusinessTools2_1 = require("./BusinessTools2");
const BusinessTools3_1 = require("./BusinessTools3");
const BusinessTools4_1 = require("./BusinessTools4");
const BusinessTools5_1 = require("./BusinessTools5");
const DatabaseOperationTools_1 = require("./DatabaseOperationTools");
const UtilityTools_1 = require("./UtilityTools");
const AnalyticsTools_1 = require("./AnalyticsTools");
const FinancialTools_1 = require("./FinancialTools");
const ProjectAndOperationsTools_1 = require("./ProjectAndOperationsTools");
const HomeAutomationTools_1 = require("./HomeAutomationTools");
const ChineseAITools_1 = require("./ChineseAITools");
const WeatherTool_1 = require("./WeatherTool");
const NewsAggregatorTool_1 = require("./NewsAggregatorTool");
const TranslationTool_1 = require("./TranslationTool");
const CalculatorTool_1 = require("./CalculatorTool");
const PasswordGeneratorTool_1 = require("./PasswordGeneratorTool");
const MapLocationTool_1 = require("./MapLocationTool");
const CalendarEventTool_1 = require("./CalendarEventTool");
const ReminderTodoTool_1 = require("./ReminderTodoTool");
const ImageProcessingTool_1 = require("./ImageProcessingTool");
const AudioProcessingTool_1 = require("./AudioProcessingTool");
const TaxCalculationTool_1 = require("./TaxCalculationTool");
const TaxSoftwareIntegrationTool_1 = require("./TaxSoftwareIntegrationTool");
const IRSEfileSystemTool_1 = require("./IRSEfileSystemTool");
class SkillManager {
    constructor(memorySystem) {
        this.skills = new Map();
        this.tools = new Map();
        this.memorySystem = memorySystem || new MemorySystem_1.MemorySystem();
        this.registerDefaultSkills();
    }
    registerDefaultSkills() {
        // Original tools
        const fileTool = new FileTool_1.FileTool();
        const fileWriteTool = new FileTool_1.FileWriteTool();
        const fileListTool = new FileTool_1.FileListTool();
        const fileDeleteTool = new FileTool_1.FileDeleteTool();
        const shellTool = new ShellTool_1.ShellTool();
        const memoryTool = new MemoryTool_1.MemoryTool(this.memorySystem);
        const memorySearchTool = new MemoryTool_1.MemorySearchTool(this.memorySystem);
        // New tools
        const dbConnectTool = new DatabaseTools_1.DatabaseConnectTool();
        const dbQueryTool = new DatabaseOperationTools_1.DatabaseQueryTool();
        const dbExecuteTool = new DatabaseTools_1.DatabaseExecuteTool();
        const apiGetTool = new ApiTools_1.ApiGetTool();
        const apiPostTool = new ApiTools_1.ApiPostTool();
        const apiPutTool = new ApiTools_1.ApiPutTool();
        const apiDeleteTool = new ApiTools_1.ApiDeleteTool();
        const csvReadTool = new DataProcessingTools_1.CsvReadTool();
        const csvWriteTool = new DataProcessingTools_1.CsvWriteTool();
        const jsonReadTool = new DataProcessingTools_1.JsonReadTool();
        const jsonWriteTool = new DataProcessingTools_1.JsonWriteTool();
        const notificationTool = new NotificationTools_1.NotificationTool();
        const scheduleNotificationTool = new NotificationTools_1.ScheduleNotificationTool();
        const systemInfoTool = new SystemMonitoringTools_1.SystemInfoTool();
        const processListTool = new SystemMonitoringTools_1.ProcessListTool();
        const resourceMonitorTool = new SystemMonitoringTools_1.ResourceMonitorTool();
        const scheduleTaskTool = new SchedulingTools_1.ScheduleTaskTool();
        const cancelTaskTool = new SchedulingTools_1.CancelTaskTool();
        const listScheduledTasksTool = new SchedulingTools_1.ListScheduledTasksTool();
        // Additional new tools
        const encryptTool = new SecurityTools_1.EncryptTool();
        const decryptTool = new SecurityTools_1.DecryptTool();
        const hashTool = new SecurityTools_1.HashTool();
        const zipTool = new CompressionTools_1.ZipTool();
        const unzipTool = new CompressionTools_1.UnzipTool();
        const compressTool = new CompressionTools_1.CompressTool();
        const decompressTool = new CompressionTools_1.DecompressTool();
        const conversationHistoryTool = new ConversationTools_1.ConversationHistoryTool();
        const contextManagementTool = new ConversationTools_1.ContextManagementTool();
        const summarizeConversationTool = new ConversationTools_1.SummarizeConversationTool();
        const textAnalysisTool = new TextTools_1.TextAnalysisTool();
        const textSearchTool = new TextTools_1.TextSearchTool();
        const textTransformTool = new TextTools_1.TextTransformTool();
        // Additional new tools for date/time, math, and network operations
        const dateTimeTool = new DateTimeTools_1.DateTimeTool();
        const timezoneTool = new DateTimeTools_1.TimezoneTool();
        const calendarTool = new DateTimeTools_1.CalendarTool();
        const mathCalculationTool = new MathTools_1.MathCalculationTool();
        const unitConversionTool = new MathTools_1.UnitConversionTool();
        const statisticsTool = new MathTools_1.StatisticsTool();
        const networkTool = new NetworkTools_1.NetworkTool();
        const dnsLookupTool = new NetworkTools_1.DnsLookupTool();
        const whoisTool = new NetworkTools_1.WhoisTool();
        // Additional new tools for AI, image, and PDF operations
        const aiModelTool = new AiTools_1.AiModelTool();
        const imageGenerationTool = new AiTools_1.ImageGenerationTool();
        const embeddingTool = new AiTools_1.EmbeddingTool();
        const imageResizeTool = new ImageTools_1.ImageResizeTool();
        const imageFormatConverterTool = new ImageTools_1.ImageFormatConverterTool();
        const imageMetadataTool = new ImageTools_1.ImageMetadataTool();
        const pdfReaderTool = new PdfTools_1.PdfReaderTool();
        const pdfWriterTool = new PdfTools_1.PdfWriterTool();
        const pdfMergeTool = new PdfTools_1.PdfMergeTool();
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
        const logManagementTool = new LogAndConfigTools_1.LogManagementTool();
        const configManagementTool = new LogAndConfigTools_1.ConfigManagementTool();
        const emailTool = new EmailAndCodeAnalysisTools_1.EmailTool();
        const codeAnalysisTool = new EmailAndCodeAnalysisTools_1.CodeAnalysisTool();
        // Register new tools
        this.registerTool(logManagementTool);
        this.registerTool(configManagementTool);
        this.registerTool(emailTool);
        this.registerTool(codeAnalysisTool);
        // Additional business tools
        const financialCalculatorTool = new BusinessTools1_1.FinancialCalculatorTool();
        const spreadsheetTool = new BusinessTools1_1.SpreadsheetTool();
        const crmTool = new BusinessTools2_1.CrmTool();
        const erpTool = new BusinessTools2_1.ErpTool();
        const businessIntelligenceTool = new BusinessTools3_1.BusinessIntelligenceTool();
        const inventoryManagementTool = new BusinessTools3_1.InventoryManagementTool();
        const salesAnalyticsTool = new BusinessTools4_1.SalesAnalyticsTool();
        const complianceCheckerTool = new BusinessTools4_1.ComplianceCheckerTool();
        const projectManagementTool = new BusinessTools5_1.ProjectManagementTool();
        const timeTrackingTool = new BusinessTools5_1.TimeTrackingTool();
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
        const databaseInsertTool = new DatabaseOperationTools_1.DatabaseInsertTool();
        const databaseQueryTool = new DatabaseOperationTools_1.DatabaseQueryTool();
        const databaseUpdateTool = new DatabaseOperationTools_1.DatabaseUpdateTool();
        const databaseDeleteTool = new DatabaseOperationTools_1.DatabaseDeleteTool();
        this.registerTool(databaseInsertTool);
        this.registerTool(databaseQueryTool);
        this.registerTool(databaseUpdateTool);
        this.registerTool(databaseDeleteTool);
        // Register utility tools
        const workflowApprovalTool = new UtilityTools_1.WorkflowApprovalTool();
        const documentGeneratorTool = new UtilityTools_1.DocumentGeneratorTool();
        const validationCheckTool = new UtilityTools_1.ValidationCheckTool();
        const notificationSendTool = new UtilityTools_1.NotificationSendTool();
        this.registerTool(workflowApprovalTool);
        this.registerTool(documentGeneratorTool);
        this.registerTool(validationCheckTool);
        this.registerTool(notificationSendTool);
        // Register analytics tools
        const hrSystemTool = new AnalyticsTools_1.HrSystemTool();
        const documentManagementTool = new AnalyticsTools_1.DocumentManagementTool();
        const analyticsEngineTool = new AnalyticsTools_1.AnalyticsEngineTool();
        const reportGeneratorTool = new AnalyticsTools_1.ReportGeneratorTool();
        const documentGenerationTool = new UtilityTools_1.DocumentGenerationTool(); // 新增文档生成工具
        this.registerTool(hrSystemTool);
        this.registerTool(documentManagementTool);
        this.registerTool(analyticsEngineTool);
        this.registerTool(reportGeneratorTool);
        this.registerTool(documentGenerationTool); // 注册新增工具
        // Register financial tools
        const accountingSystemTool = new FinancialTools_1.AccountingSystemTool();
        const paymentGatewayTool = new FinancialTools_1.PaymentGatewayTool();
        const taxCalculatorTool = new FinancialTools_1.TaxCalculatorTool();
        this.registerTool(accountingSystemTool);
        this.registerTool(paymentGatewayTool);
        this.registerTool(taxCalculatorTool);
        // Register project and operations tools
        const timeTrackingToolExtended = new ProjectAndOperationsTools_1.TimeTrackingToolExtended();
        const projectManagementToolExtended = new ProjectAndOperationsTools_1.ProjectManagementToolExtended();
        const qualityManagementTool = new ProjectAndOperationsTools_1.QualityManagementTool();
        const workflowSystemTool = new ProjectAndOperationsTools_1.WorkflowSystemTool();
        this.registerTool(timeTrackingToolExtended);
        this.registerTool(projectManagementToolExtended);
        this.registerTool(qualityManagementTool);
        this.registerTool(workflowSystemTool);
        // Original skills
        const fileSystemSkill = {
            name: 'file-system',
            description: 'File system operations',
            tools: [fileTool, fileWriteTool, fileListTool, fileDeleteTool],
            enabled: true,
            permissions: [],
        };
        const shellSkill = {
            name: 'shell',
            description: 'Shell command execution',
            tools: [shellTool],
            enabled: true,
            permissions: [],
        };
        const memorySkill = {
            name: 'memory',
            description: 'Memory management',
            tools: [memoryTool, memorySearchTool],
            enabled: true,
            permissions: [],
        };
        // New skills
        const databaseSkill = {
            name: 'database',
            description: 'Database operations (connect, query, execute)',
            tools: [dbConnectTool, dbQueryTool, dbExecuteTool],
            enabled: true,
            permissions: [],
        };
        const apiSkill = {
            name: 'api-management',
            description: 'API management operations (GET, POST, PUT, DELETE)',
            tools: [apiGetTool, apiPostTool, apiPutTool, apiDeleteTool],
            enabled: true,
            permissions: [],
        };
        const dataProcessingSkill = {
            name: 'data-processing',
            description: 'Data processing operations (CSV, JSON)',
            tools: [csvReadTool, csvWriteTool, jsonReadTool, jsonWriteTool],
            enabled: true,
            permissions: [],
        };
        const notificationSkill = {
            name: 'notifications',
            description: 'Notification operations (send, schedule)',
            tools: [notificationTool, scheduleNotificationTool],
            enabled: true,
            permissions: [],
        };
        const systemMonitoringSkill = {
            name: 'system-monitoring',
            description: 'System monitoring operations (info, processes, resources)',
            tools: [systemInfoTool, processListTool, resourceMonitorTool],
            enabled: true,
            permissions: [],
        };
        const schedulingSkill = {
            name: 'task-scheduling',
            description: 'Task scheduling operations (schedule, cancel, list)',
            tools: [scheduleTaskTool, cancelTaskTool, listScheduledTasksTool],
            enabled: true,
            permissions: [],
        };
        // Additional new skills
        const securitySkill = {
            name: 'security-tools',
            description: 'Security operations (encryption, decryption, hashing)',
            tools: [encryptTool, decryptTool, hashTool],
            enabled: true,
            permissions: [],
        };
        const compressionSkill = {
            name: 'compression-tools',
            description: 'File and data compression operations',
            tools: [zipTool, unzipTool, compressTool, decompressTool],
            enabled: true,
            permissions: [],
        };
        const conversationSkill = {
            name: 'conversation-tools',
            description: 'Conversation management and context handling',
            tools: [conversationHistoryTool, contextManagementTool, summarizeConversationTool],
            enabled: true,
            permissions: [],
        };
        const textProcessingSkill = {
            name: 'text-processing',
            description: 'Text analysis, search, and transformation tools',
            tools: [textAnalysisTool, textSearchTool, textTransformTool],
            enabled: true,
            permissions: [],
        };
        // Additional new skills
        const dateTimeSkill = {
            name: 'date-time-tools',
            description: 'Date and time operations and calculations',
            tools: [dateTimeTool, timezoneTool, calendarTool],
            enabled: true,
            permissions: [],
        };
        const mathSkill = {
            name: 'math-tools',
            description: 'Mathematical calculations and unit conversions',
            tools: [mathCalculationTool, unitConversionTool, statisticsTool],
            enabled: true,
            permissions: [],
        };
        const networkSkill = {
            name: 'network-tools',
            description: 'Network operations and DNS lookups',
            tools: [networkTool, dnsLookupTool, whoisTool],
            enabled: true,
            permissions: [],
        };
        // Additional new skills
        const aiToolsSkill = {
            name: 'ai-tools',
            description: 'AI model operations (inference, generation, embeddings)',
            tools: [aiModelTool, imageGenerationTool, embeddingTool],
            enabled: true,
            permissions: [],
        };
        const imageToolsSkill = {
            name: 'image-tools',
            description: 'Image processing operations (resize, format conversion, metadata)',
            tools: [imageResizeTool, imageFormatConverterTool, imageMetadataTool],
            enabled: true,
            permissions: [],
        };
        const pdfToolsSkill = {
            name: 'pdf-tools',
            description: 'PDF operations (read, write, merge)',
            tools: [pdfReaderTool, pdfWriterTool, pdfMergeTool],
            enabled: true,
            permissions: [],
        };
        // Additional new skills
        const logConfigToolsSkill = {
            name: 'log-config-tools',
            description: 'Log and configuration management operations',
            tools: [logManagementTool, configManagementTool],
            enabled: true,
            permissions: [],
        };
        const communicationToolsSkill = {
            name: 'communication-tools',
            description: 'Communication operations (email)',
            tools: [emailTool],
            enabled: true,
            permissions: [],
        };
        const codeQualityToolsSkill = {
            name: 'code-quality-tools',
            description: 'Code analysis and quality assurance tools',
            tools: [codeAnalysisTool],
            enabled: true,
            permissions: [],
        };
        // Business tools skills
        const financialToolsSkill = {
            name: 'financial-tools',
            description: 'Financial calculations and business finance operations',
            tools: [financialCalculatorTool],
            enabled: true,
            permissions: [],
        };
        const spreadsheetToolsSkill = {
            name: 'spreadsheet-tools',
            description: 'Spreadsheet operations (Excel/Google Sheets)',
            tools: [spreadsheetTool],
            enabled: true,
            permissions: [],
        };
        const crmToolsSkill = {
            name: 'crm-tools',
            description: 'Customer Relationship Management operations',
            tools: [crmTool],
            enabled: true,
            permissions: [],
        };
        const erpToolsSkill = {
            name: 'erp-tools',
            description: 'Enterprise Resource Planning operations',
            tools: [erpTool],
            enabled: true,
            permissions: [],
        };
        const businessIntelligenceToolsSkill = {
            name: 'business-intelligence-tools',
            description: 'Business Intelligence and analytics operations',
            tools: [businessIntelligenceTool],
            enabled: true,
            permissions: [],
        };
        const inventoryToolsSkill = {
            name: 'inventory-tools',
            description: 'Inventory tracking and management operations',
            tools: [inventoryManagementTool],
            enabled: true,
            permissions: [],
        };
        const salesAnalyticsToolsSkill = {
            name: 'sales-analytics-tools',
            description: 'Sales data analysis and reporting',
            tools: [salesAnalyticsTool],
            enabled: true,
            permissions: [],
        };
        const complianceToolsSkill = {
            name: 'compliance-tools',
            description: 'Business compliance checking and auditing',
            tools: [complianceCheckerTool],
            enabled: true,
            permissions: [],
        };
        const projectManagementToolsSkill = {
            name: 'project-management-tools',
            description: 'Project tracking and management operations',
            tools: [projectManagementTool],
            enabled: true,
            permissions: [],
        };
        const timeTrackingToolsSkill = {
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
        const ioTDeviceControlTool = new HomeAutomationTools_1.IoTDeviceControlTool();
        const maintenanceSchedulerTool = new HomeAutomationTools_1.MaintenanceSchedulerTool();
        const financeTrackerTool = new HomeAutomationTools_1.FinanceTrackerTool();
        const healthTrackerTool = new HomeAutomationTools_1.HealthTrackerTool();
        const calendarSchedulerTool = new HomeAutomationTools_1.CalendarSchedulerTool();
        this.registerTool(ioTDeviceControlTool);
        this.registerTool(maintenanceSchedulerTool);
        this.registerTool(financeTrackerTool);
        this.registerTool(healthTrackerTool);
        this.registerTool(calendarSchedulerTool);
        // Home automation skills
        const homeAutomationSkill = {
            name: 'home-automation-tools',
            description: 'Home automation and smart home control',
            tools: [ioTDeviceControlTool],
            enabled: true,
            permissions: [],
        };
        const homeMaintenanceSkill = {
            name: 'home-maintenance-tools',
            description: 'Home maintenance scheduling and tracking',
            tools: [maintenanceSchedulerTool],
            enabled: true,
            permissions: [],
        };
        const homeFinanceSkill = {
            name: 'home-finance-tools',
            description: 'Personal and family finance management',
            tools: [financeTrackerTool],
            enabled: true,
            permissions: [],
        };
        const healthTrackingSkill = {
            name: 'health-tracking-tools',
            description: 'Health and fitness tracking for family members',
            tools: [healthTrackerTool],
            enabled: true,
            permissions: [],
        };
        const calendarSchedulingSkill = {
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
        const chineseAILocalTool = new ChineseAITools_1.ChineseAILocalTool();
        this.registerTool(chineseAILocalTool);
        // Chinese AI skills
        const chineseAISkill = {
            name: 'chinese-ai-tools',
            description: 'Chinese AI models and local deployment tools',
            tools: [chineseAILocalTool],
            enabled: true,
            permissions: [],
        };
        this.registerSkill(chineseAISkill);
        // Register new utility tools
        const weatherTool = new WeatherTool_1.WeatherTool();
        const newsAggregatorTool = new NewsAggregatorTool_1.NewsAggregatorTool();
        const translationTool = new TranslationTool_1.TranslationTool();
        const calculatorTool = new CalculatorTool_1.CalculatorTool();
        const passwordGeneratorTool = new PasswordGeneratorTool_1.PasswordGeneratorTool();
        this.registerTool(weatherTool);
        this.registerTool(newsAggregatorTool);
        this.registerTool(translationTool);
        this.registerTool(calculatorTool);
        this.registerTool(passwordGeneratorTool);
        // New utility skills
        const weatherSkill = {
            name: 'weather-tools',
            description: 'Weather information and forecasting tools',
            tools: [weatherTool],
            enabled: true,
            permissions: [],
        };
        const newsSkill = {
            name: 'news-tools',
            description: 'News aggregation and information retrieval tools',
            tools: [newsAggregatorTool],
            enabled: true,
            permissions: [],
        };
        const translationSkill = {
            name: 'translation-tools',
            description: 'Text translation and language processing tools',
            tools: [translationTool],
            enabled: true,
            permissions: [],
        };
        const calculatorSkill = {
            name: 'calculator-tools',
            description: 'Mathematical calculation and expression evaluation tools',
            tools: [calculatorTool],
            enabled: true,
            permissions: [],
        };
        const passwordSkill = {
            name: 'password-tools',
            description: 'Secure password generation and management tools',
            tools: [passwordGeneratorTool],
            enabled: true,
            permissions: [],
        };
        this.registerSkill(weatherSkill);
        this.registerSkill(newsSkill);
        this.registerSkill(translationSkill);
        this.registerSkill(calculatorSkill);
        this.registerSkill(passwordSkill);
        // Register additional utility tools
        const mapLocationTool = new MapLocationTool_1.MapLocationTool();
        const calendarEventTool = new CalendarEventTool_1.CalendarEventTool();
        const reminderTodoTool = new ReminderTodoTool_1.ReminderTodoTool();
        const imageProcessingTool = new ImageProcessingTool_1.ImageProcessingTool();
        const audioProcessingTool = new AudioProcessingTool_1.AudioProcessingTool();
        this.registerTool(mapLocationTool);
        this.registerTool(calendarEventTool);
        this.registerTool(reminderTodoTool);
        this.registerTool(imageProcessingTool);
        this.registerTool(audioProcessingTool);
        // Additional utility skills
        const mapLocationSkill = {
            name: 'map-location-tools',
            description: 'Map and location services including geocoding, directions, and distance calculation',
            tools: [mapLocationTool],
            enabled: true,
            permissions: [],
        };
        const calendarEventSkill = {
            name: 'calendar-event-tools',
            description: 'Calendar and event management tools for scheduling and organizing events',
            tools: [calendarEventTool],
            enabled: true,
            permissions: [],
        };
        const reminderTodoSkill = {
            name: 'reminder-todo-tools',
            description: 'Reminder and to-do list management tools for task organization',
            tools: [reminderTodoTool],
            enabled: true,
            permissions: [],
        };
        const imageProcessingSkill = {
            name: 'image-processing-tools',
            description: 'Image processing tools for resizing, converting, and manipulating images',
            tools: [imageProcessingTool],
            enabled: true,
            permissions: [],
        };
        const audioProcessingSkill = {
            name: 'audio-processing-tools',
            description: 'Audio processing tools for trimming, adjusting, and manipulating audio files',
            tools: [audioProcessingTool],
            enabled: true,
            permissions: [],
        };
        this.registerSkill(mapLocationSkill);
        this.registerSkill(calendarEventSkill);
        this.registerSkill(reminderTodoSkill);
        this.registerSkill(imageProcessingSkill);
        this.registerSkill(audioProcessingSkill);
        // Register tax-related tools
        const taxCalculationTool = new TaxCalculationTool_1.TaxCalculationTool();
        const taxSoftwareIntegrationTool = new TaxSoftwareIntegrationTool_1.TaxSoftwareIntegrationTool();
        const irsEfileSystemTool = new IRSEfileSystemTool_1.IRSEfileSystemTool();
        this.registerTool(taxCalculationTool);
        this.registerTool(taxSoftwareIntegrationTool);
        this.registerTool(irsEfileSystemTool);
        // Tax-related skills
        const taxCalculationSkill = {
            name: 'tax-calculation-tools',
            description: 'Tax calculation and planning tools for individuals and businesses',
            tools: [taxCalculationTool],
            enabled: true,
            permissions: [],
        };
        const taxSoftwareSkill = {
            name: 'tax-software-tools',
            description: 'Tax software integration tools for preparing and filing returns',
            tools: [taxSoftwareIntegrationTool],
            enabled: true,
            permissions: [],
        };
        const irsEfileSkill = {
            name: 'irs-efile-tools',
            description: 'IRS electronic filing system integration tools',
            tools: [irsEfileSystemTool],
            enabled: true,
            permissions: [],
        };
        this.registerSkill(taxCalculationSkill);
        this.registerSkill(taxSoftwareSkill);
        this.registerSkill(irsEfileSkill);
    }
    registerTool(tool) {
        this.tools.set(tool.name, tool);
    }
    registerSkill(skill) {
        this.skills.set(skill.name, skill);
    }
    getTool(name) {
        return this.tools.get(name);
    }
    getSkill(name) {
        return this.skills.get(name);
    }
    getAllTools() {
        return Array.from(this.tools.values());
    }
    getAllSkills() {
        return Array.from(this.skills.values());
    }
    getEnabledTools() {
        const enabledTools = [];
        for (const skill of this.skills.values()) {
            if (skill.enabled) {
                enabledTools.push(...skill.tools);
            }
        }
        return enabledTools;
    }
    enableSkill(name) {
        const skill = this.skills.get(name);
        if (skill) {
            skill.enabled = true;
        }
    }
    disableSkill(name) {
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
                description: 'Validation and compliance checking tools',
                tools: [validationCheckTool],
                enabled: true,
                permissions: [],
            };
            this.registerSkill(validationCheckSkill);
        }
        if (analyticsEngineTool && !this.skills.has('analytics-engine-tools')) {
            const analyticsEngineSkill = {
                name: 'analytics-engine-tools',
                description: 'Analytics and strategy generation tools',
                tools: [analyticsEngineTool],
                enabled: true,
                permissions: [],
            };
            this.registerSkill(analyticsEngineSkill);
        }
        if (documentGenerationTool && !this.skills.has('document-generation-tools')) {
            const documentGenerationSkill = {
                name: 'document-generation-tools',
                description: 'Document and report generation tools',
                tools: [documentGenerationTool],
                enabled: true,
                permissions: [],
            };
            this.registerSkill(documentGenerationSkill);
        }
    }
}
exports.SkillManager = SkillManager;
