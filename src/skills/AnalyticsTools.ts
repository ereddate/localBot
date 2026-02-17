import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';

export class HrSystemTool implements Tool {
  name = 'hr_system';
  description = 'Human Resources system operations';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const operation = params.operation as string;
      const employeeId = params.employeeId as string;
      const data = params.data as Record<string, unknown>;

      if (!operation) {
        return { success: false, error: 'Operation is required (create_employee_record, update_employee, get_employee, terminate_employee)' };
      }

      // Create data directory if it doesn't exist
      const hrDataPath = path.join(__dirname, '../../data/hr');
      try {
        await fs.mkdir(hrDataPath, { recursive: true });
      } catch (mkdirErr) {
        Logger.warn(`Could not create HR data directory: ${(mkdirErr as Error).message}`);
      }

      const employeesFile = path.join(hrDataPath, 'employees.json');
      let employees: any[] = [];

      // Load existing employees
      try {
        const fileContent = await fs.readFile(employeesFile, 'utf8');
        employees = JSON.parse(fileContent);
      } catch (err) {
        // File doesn't exist, start with empty array
        employees = [];
      }

      switch (operation.toLowerCase()) {
        case 'create_employee_record':
          if (!data) {
            return { success: false, error: 'Employee data is required' };
          }

          const newEmployee = {
            id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...data,
            createdAt: new Date().toISOString(),
            status: 'active'
          };

          employees.push(newEmployee);
          await fs.writeFile(employeesFile, JSON.stringify(employees, null, 2));

          Logger.info(`New employee record created`, { employeeId: newEmployee.id });

          return {
            success: true,
            data: { employeeId: newEmployee.id, message: 'Employee record created successfully' }
          };

        case 'update_employee':
          if (!employeeId) {
            return { success: false, error: 'Employee ID is required' };
          }

          if (!data) {
            return { success: false, error: 'Update data is required' };
          }

          const employeeIndex = employees.findIndex(emp => emp.id === employeeId);
          if (employeeIndex === -1) {
            return { success: false, error: `Employee with ID ${employeeId} not found` };
          }

          employees[employeeIndex] = {
            ...employees[employeeIndex],
            ...data,
            updatedAt: new Date().toISOString()
          };

          await fs.writeFile(employeesFile, JSON.stringify(employees, null, 2));

          Logger.info(`Employee record updated`, { employeeId });

          return {
            success: true,
            data: { employeeId, message: 'Employee record updated successfully' }
          };

        case 'get_employee':
          if (!employeeId) {
            return { success: false, error: 'Employee ID is required' };
          }

          const employee = employees.find(emp => emp.id === employeeId);
          if (!employee) {
            return { success: false, error: `Employee with ID ${employeeId} not found` };
          }

          Logger.info(`Employee record retrieved`, { employeeId });

          return {
            success: true,
            data: { employee }
          };

        case 'terminate_employee':
          if (!employeeId) {
            return { success: false, error: 'Employee ID is required' };
          }

          const terminateIndex = employees.findIndex(emp => emp.id === employeeId);
          if (terminateIndex === -1) {
            return { success: false, error: `Employee with ID ${employeeId} not found` };
          }

          employees[terminateIndex].status = 'terminated';
          employees[terminateIndex].terminatedAt = new Date().toISOString();

          await fs.writeFile(employeesFile, JSON.stringify(employees, null, 2));

          Logger.info(`Employee record terminated`, { employeeId });

          return {
            success: true,
            data: { employeeId, message: 'Employee record terminated successfully' }
          };

        default:
          return { success: false, error: `Unsupported operation: ${operation}` };
      }
    } catch (error) {
      Logger.error('HR system operation error', { error: (error as Error).message });
      return { success: false, error: `HR system operation failed: ${(error as Error).message}` };
    }
  }
}

export class DocumentManagementTool implements Tool {
  name = 'document_management';
  description = 'Document management system operations';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const operation = params.operation as string;
      const documentId = params.documentId as string;
      const documentType = params.documentType as string;
      const content = params.content as string;

      if (!operation) {
        return { success: false, error: 'Operation is required (upload_document, download_document, search_documents, update_document)' };
      }

      // Create documents directory if it doesn't exist
      const docsPath = path.join(__dirname, '../../documents');
      try {
        await fs.mkdir(docsPath, { recursive: true });
      } catch (mkdirErr) {
        Logger.warn(`Could not create documents directory: ${(mkdirErr as Error).message}`);
      }

      switch (operation.toLowerCase()) {
        case 'upload_document':
          if (!documentType || !content) {
            return { success: false, error: 'Document type and content are required' };
          }

          const newDocId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const fileName = `${newDocId}_${documentType.replace(/\s+/g, '_').toLowerCase()}.txt`;
          const filePath = path.join(docsPath, fileName);

          await fs.writeFile(filePath, content);

          Logger.info(`Document uploaded`, { documentId: newDocId, documentType });

          return {
            success: true,
            data: { 
              documentId: newDocId, 
              fileName, 
              path: filePath, 
              message: 'Document uploaded successfully' 
            }
          };

        case 'download_document':
          if (!documentId) {
            return { success: false, error: 'Document ID is required' };
          }

          // Find the document by ID in the filename
          const files = await fs.readdir(docsPath);
          const matchingFile = files.find(f => f.startsWith(`${documentId}_`));
          
          if (!matchingFile) {
            return { success: false, error: `Document with ID ${documentId} not found` };
          }

          const docPath = path.join(docsPath, matchingFile);
          const docContent = await fs.readFile(docPath, 'utf8');

          Logger.info(`Document downloaded`, { documentId });

          return {
            success: true,
            data: { 
              documentId, 
              content: docContent.substring(0, 500) + (docContent.length > 500 ? '...' : ''), // Truncate for display
              message: 'Document downloaded successfully' 
            }
          };

        case 'search_documents':
          if (!documentType) {
            return { success: false, error: 'Document type is required for search' };
          }

          const allFiles = await fs.readdir(docsPath);
          const matchingDocs = allFiles.filter(f => f.includes(documentType.replace(/\s+/g, '_').toLowerCase()));

          Logger.info(`Documents searched`, { documentType, count: matchingDocs.length });

          return {
            success: true,
            data: { 
              count: matchingDocs.length,
              documents: matchingDocs.map(f => ({
                documentId: f.split('_')[0], // Extract ID from filename
                fileName: f,
                path: path.join(docsPath, f)
              }))
            }
          };

        case 'update_document':
          if (!documentId || !content) {
            return { success: false, error: 'Document ID and content are required' };
          }

          // Find the document by ID in the filename
          const updateFiles = await fs.readdir(docsPath);
          const updateFile = updateFiles.find(f => f.startsWith(`${documentId}_`));
          
          if (!updateFile) {
            return { success: false, error: `Document with ID ${documentId} not found` };
          }

          const updatePath = path.join(docsPath, updateFile);
          await fs.writeFile(updatePath, content);

          Logger.info(`Document updated`, { documentId });

          return {
            success: true,
            data: { 
              documentId, 
              message: 'Document updated successfully' 
            }
          };

        default:
          return { success: false, error: `Unsupported operation: ${operation}` };
      }
    } catch (error) {
      Logger.error('Document management operation error', { error: (error as Error).message });
      return { success: false, error: `Document management operation failed: ${(error as Error).message}` };
    }
  }
}

export class AnalyticsEngineTool implements Tool {
  name = 'analytics_engine';
  description = 'Analytics and reporting engine';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const analysisType = params.analysisType as string;
      const dataSource = params.dataSource as string;
      const filters = params.filters as Record<string, unknown>;

      if (!analysisType) {
        return { success: false, error: 'Analysis type is required' };
      }

      // Simulate analytics by reading data from files and performing calculations
      let data: any[] = [];

      if (dataSource) {
        // Try to load data from the specified source
        const dataPath = path.join(__dirname, `../../data/${dataSource}.json`);
        try {
          const fileContent = await fs.readFile(dataPath, 'utf8');
          data = JSON.parse(fileContent);
        } catch (err) {
          Logger.warn(`Could not load data from source: ${dataSource}`);
          data = [];
        }
      }

      // Apply filters if provided
      if (filters && Object.keys(filters).length > 0 && data.length > 0) {
        data = data.filter(item => {
          return Object.entries(filters).every(([key, value]) => {
            return item[key] === value;
          });
        });
      }

      let result: any;

      switch (analysisType.toLowerCase()) {
        case 'sales_performance':
          // Calculate sales performance metrics
          const totalSales = data.reduce((sum, item) => sum + (item.amount || item.total || 0), 0);
          const avgDealSize = data.length > 0 ? totalSales / data.length : 0;
          const dealsCount = data.length;

          result = {
            totalSales,
            averageDealSize: avgDealSize,
            dealsCount,
            period: filters?.period || 'N/A'
          };
          break;

        case 'demand_forecasting':
          // Simple demand forecasting based on historical data
          const historicalSales = data.map(item => item.sales || item.amount || item.quantity || 0);
          const avgHistoricalSales = historicalSales.length > 0 
            ? historicalSales.reduce((sum, val) => sum + val, 0) / historicalSales.length 
            : 0;
          
          // Apply growth factor and seasonality
          const growthFactor = (filters?.growthRate as number) || 1.05;
          const seasonalityFactor = (filters?.seasonality as number) || 1.0;
          
          result = {
            forecastedDemand: avgHistoricalSales * growthFactor * seasonalityFactor,
            historicalAverage: avgHistoricalSales,
            growthFactor,
            seasonalityFactor
          };
          break;

        case 'inventory_analysis':
          // Analyze inventory levels
          const totalInventoryValue = data.reduce((sum, item) => {
            return sum + ((item.quantity || 0) * (item.unitCost || item.price || 0));
          }, 0);

          const lowStockItems = data.filter(item => {
            const minThreshold = item.minStockLevel || item.reorderPoint || 10;
            return (item.quantity || 0) <= minThreshold;
          });

          result = {
            totalInventoryValue,
            totalItems: data.length,
            lowStockItemsCount: lowStockItems.length,
            lowStockItems: lowStockItems.map(item => item.name || item.id)
          };
          break;

        case 'financial_report':
          // Generate financial report metrics
          const revenues = data.filter(item => item.type === 'revenue' || item.category === 'income')
                              .reduce((sum, item) => sum + (item.amount || 0), 0);
          const expenses = data.filter(item => item.type === 'expense' || item.category === 'cost')
                              .reduce((sum, item) => sum + (item.amount || 0), 0);
          const netIncome = revenues - expenses;

          result = {
            revenue: revenues,
            expenses,
            netIncome,
            profitMargin: revenues > 0 ? (netIncome / revenues) * 100 : 0
          };
          break;

        default:
          // Generic analysis returning basic statistics
          const numericValues = data.map(item => {
            // Look for common numeric fields
            return item.amount || item.value || item.quantity || item.count || item.total || 0;
          }).filter(val => typeof val === 'number');

          const sum = numericValues.reduce((acc, val) => acc + val, 0);
          const avg = numericValues.length > 0 ? sum / numericValues.length : 0;
          const max = numericValues.length > 0 ? Math.max(...numericValues) : 0;
          const min = numericValues.length > 0 ? Math.min(...numericValues) : 0;

          result = {
            count: data.length,
            sum,
            average: avg,
            max,
            min,
            analysisType
          };
      }

      Logger.info(`Analytics performed`, { analysisType, resultCount: Array.isArray(result) ? result.length : 1 });

      return {
        success: true,
        data: result
      };
    } catch (error) {
      Logger.error('Analytics engine operation error', { error: (error as Error).message });
      return { success: false, error: `Analytics operation failed: ${(error as Error).message}` };
    }
  }
}

export class ReportGeneratorTool implements Tool {
  name = 'report_generator';
  description = 'Generate reports from data';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const reportType = params.reportType as string;
      const dataSource = params.dataSource as string;
      const filters = params.filters as Record<string, unknown>;
      const format = params.format as string || 'json';

      if (!reportType) {
        return { success: false, error: 'Report type is required' };
      }

      // Load data from the specified source
      let data: any[] = [];
      if (dataSource) {
        const dataPath = path.join(__dirname, `../../data/${dataSource}.json`);
        try {
          const fileContent = await fs.readFile(dataPath, 'utf8');
          data = JSON.parse(fileContent);
        } catch (err) {
          Logger.warn(`Could not load data from source: ${dataSource}`);
          data = [];
        }
      }

      // Apply filters if provided
      if (filters && Object.keys(filters).length > 0 && data.length > 0) {
        data = data.filter(item => {
          return Object.entries(filters).every(([key, value]) => {
            return item[key] === value;
          });
        });
      }

      let reportContent: string;
      let reportTitle: string;

      switch (reportType.toLowerCase()) {
        case 'sales_summary':
          reportTitle = 'Sales Summary Report';
          const totalSales = data.reduce((sum, item) => sum + (item.amount || item.total || 0), 0);
          const salesCount = data.length;
          const avgSale = salesCount > 0 ? totalSales / salesCount : 0;

          reportContent = `# ${reportTitle}\n\n`;
          reportContent += `- Total Sales: $${totalSales.toFixed(2)}\n`;
          reportContent += `- Number of Sales: ${salesCount}\n`;
          reportContent += `- Average Sale Amount: $${avgSale.toFixed(2)}\n`;
          reportContent += `- Period: ${filters?.period || 'N/A'}\n`;
          break;

        case 'financial_statement':
          reportTitle = 'Financial Statement';
          const revenues = data.filter(item => item.type === 'revenue' || item.category === 'income')
                              .reduce((sum, item) => sum + (item.amount || 0), 0);
          const expenses = data.filter(item => item.type === 'expense' || item.category === 'cost')
                              .reduce((sum, item) => sum + (item.amount || 0), 0);
          const netIncome = revenues - expenses;

          reportContent = `# ${reportTitle}\n\n`;
          reportContent += `## Revenue\n`;
          reportContent += `- Total Revenue: $${revenues.toFixed(2)}\n\n`;
          reportContent += `## Expenses\n`;
          reportContent += `- Total Expenses: $${expenses.toFixed(2)}\n\n`;
          reportContent += `## Net Income\n`;
          reportContent += `- Net Income: $${netIncome.toFixed(2)}\n`;
          break;

        case 'inventory_status':
          reportTitle = 'Inventory Status Report';
          const totalItems = data.length;
          const totalValue = data.reduce((sum, item) => {
            return sum + ((item.quantity || 0) * (item.unitCost || item.price || 0));
          }, 0);
          const lowStockItems = data.filter(item => {
            const minThreshold = item.minStockLevel || item.reorderPoint || 10;
            return (item.quantity || 0) <= minThreshold;
          }).length;

          reportContent = `# ${reportTitle}\n\n`;
          reportContent += `- Total Items: ${totalItems}\n`;
          reportContent += `- Total Value: $${totalValue.toFixed(2)}\n`;
          reportContent += `- Low Stock Items: ${lowStockItems}\n`;
          break;

        default:
          // Generic report
          reportTitle = `Generic Report - ${reportType}`;
          reportContent = `# ${reportTitle}\n\n`;
          reportContent += `Generated on: ${new Date().toISOString()}\n`;
          reportContent += `Data Source: ${dataSource || 'N/A'}\n`;
          reportContent += `Record Count: ${data.length}\n`;
          reportContent += `Filters Applied: ${JSON.stringify(filters || {})}\n`;
      }

      // Create reports directory if it doesn't exist
      const reportsPath = path.join(__dirname, '../../reports');
      try {
        await fs.mkdir(reportsPath, { recursive: true });
      } catch (mkdirErr) {
        Logger.warn(`Could not create reports directory: ${(mkdirErr as Error).message}`);
      }

      // Save report
      const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fileName = `${reportId}_${reportType.replace(/\s+/g, '_').toLowerCase()}.${format}`;
      const filePath = path.join(reportsPath, fileName);

      await fs.writeFile(filePath, reportContent);

      Logger.info(`Report generated`, { reportId, reportType, format });

      return {
        success: true,
        data: {
          reportId,
          title: reportTitle,
          fileName,
          path: filePath,
          contentPreview: reportContent.substring(0, 200) + (reportContent.length > 200 ? '...' : '')
        }
      };
    } catch (error) {
      Logger.error('Report generator operation error', { error: (error as Error).message });
      return { success: false, error: `Report generation failed: ${(error as Error).message}` };
    }
  }
}