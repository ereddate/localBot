import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';

export class FinancialCalculatorTool implements Tool {
  name = 'financial_calculator';
  description = 'Perform financial calculations (NPV, ROI, cash flow, etc.)';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const operation = params.operation as string;
      const principal = params.principal as number;
      const rate = params.rate as number;
      const time = params.time as number;
      const cashFlows = params.cashFlows as number[];
      const discountRate = params.discountRate as number;

      if (!operation) {
        return { success: false, error: 'operation is required (simple_interest, compound_interest, npv, roi, future_value)' };
      }

      switch (operation.toLowerCase()) {
        case 'simple_interest':
          if (principal === undefined || rate === undefined || time === undefined) {
            return { success: false, error: 'principal, rate, and time are required for simple interest calculation' };
          }
          return this.calculateSimpleInterest(principal, rate, time);
        case 'compound_interest':
          if (principal === undefined || rate === undefined || time === undefined) {
            return { success: false, error: 'principal, rate, and time are required for compound interest calculation' };
          }
          return this.calculateCompoundInterest(principal, rate, time);
        case 'npv':
          if (!cashFlows || cashFlows.length === 0 || discountRate === undefined) {
            return { success: false, error: 'cashFlows array and discountRate are required for NPV calculation' };
          }
          return this.calculateNPV(cashFlows, discountRate);
        case 'roi':
          if (principal === undefined || rate === undefined) {
            return { success: false, error: 'initialInvestment and finalValue are required for ROI calculation' };
          }
          return this.calculateROI(principal, rate); // Note: using principal as initialInvestment and rate as finalValue for this case
        case 'future_value':
          if (principal === undefined || rate === undefined || time === undefined) {
            return { success: false, error: 'presentValue, rate, and time are required for future value calculation' };
          }
          return this.calculateFutureValue(principal, rate, time);
        default:
          return { success: false, error: 'Invalid operation. Use: simple_interest, compound_interest, npv, roi, future_value' };
      }
    } catch (error) {
      Logger.error(`Financial calculation failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }

  private calculateSimpleInterest(principal: number, rate: number, time: number): ToolResult {
    const interest = principal * rate * time;
    const totalAmount = principal + interest;

    return {
      success: true,
      data: {
        principal,
        rate,
        time,
        interest,
        totalAmount,
        message: 'Simple interest calculated successfully'
      }
    };
  }

  private calculateCompoundInterest(principal: number, rate: number, time: number): ToolResult {
    const totalAmount = principal * Math.pow(1 + rate, time);
    const interest = totalAmount - principal;

    return {
      success: true,
      data: {
        principal,
        rate,
        time,
        interest,
        totalAmount,
        message: 'Compound interest calculated successfully'
      }
    };
  }

  private calculateNPV(cashFlows: number[], discountRate: number): ToolResult {
    let npv = cashFlows[0]; // Initial investment is typically negative
    for (let i = 1; i < cashFlows.length; i++) {
      npv += cashFlows[i] / Math.pow(1 + discountRate, i);
    }

    return {
      success: true,
      data: {
        cashFlows,
        discountRate,
        npv,
        message: 'Net Present Value calculated successfully'
      }
    };
  }

  private calculateROI(initialInvestment: number, finalValue: number): ToolResult {
    const roi = ((finalValue - initialInvestment) / initialInvestment) * 100;

    return {
      success: true,
      data: {
        initialInvestment,
        finalValue,
        roi,
        message: 'Return on Investment calculated successfully'
      }
    };
  }

  private calculateFutureValue(presentValue: number, rate: number, time: number): ToolResult {
    const futureValue = presentValue * Math.pow(1 + rate, time);

    return {
      success: true,
      data: {
        presentValue,
        rate,
        time,
        futureValue,
        message: 'Future value calculated successfully'
      }
    };
  }
}

export class SpreadsheetTool implements Tool {
  name = 'spreadsheet_operations';
  description = 'Perform spreadsheet operations (Excel/Google Sheets)';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const operation = params.operation as string;
      const filePath = params.filePath as string;
      const sheetName = params.sheetName as string;
      const data = params.data as any[];
      const cellRange = params.cellRange as string;

      if (!operation) {
        return { success: false, error: 'operation is required (read, write, update, formula)' };
      }

      if (!filePath) {
        return { success: false, error: 'filePath is required' };
      }

      switch (operation.toLowerCase()) {
        case 'read':
          return await this.readSpreadsheet(filePath, sheetName, cellRange);
        case 'write':
          if (!data) {
            return { success: false, error: 'data is required for write operation' };
          }
          return await this.writeToSpreadsheet(filePath, sheetName, data);
        case 'update':
          if (!data) {
            return { success: false, error: 'data is required for update operation' };
          }
          return await this.updateSpreadsheet(filePath, sheetName, data, cellRange);
        case 'formula':
          if (!cellRange) {
            return { success: false, error: 'cellRange is required for formula operation' };
          }
          return await this.applyFormula(filePath, sheetName, cellRange);
        default:
          return { success: false, error: 'Invalid operation. Use: read, write, update, formula' };
      }
    } catch (error) {
      Logger.error(`Spreadsheet operation failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }

  private async readSpreadsheet(filePath: string, sheetName?: string, cellRange?: string): Promise<ToolResult> {
    try {
      await fs.access(filePath);
      
      // Mock spreadsheet data
      const mockData = [
        { id: 1, name: 'Product A', price: 100, quantity: 5 },
        { id: 2, name: 'Product B', price: 150, quantity: 3 },
        { id: 3, name: 'Product C', price: 200, quantity: 7 }
      ];

      return {
        success: true,
        data: {
          filePath,
          sheetName: sheetName || 'Sheet1',
          cellRange: cellRange || 'A1:D10',
          data: mockData,
          message: 'Spreadsheet read operation completed (simulated)'
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async writeToSpreadsheet(filePath: string, sheetName: string, data: any[]): Promise<ToolResult> {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      
      // In a real implementation, this would write to an actual spreadsheet
      return {
        success: true,
        data: {
          filePath,
          sheetName: sheetName || 'Sheet1',
          recordsWritten: data.length,
          message: 'Data written to spreadsheet successfully (simulated)'
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async updateSpreadsheet(filePath: string, sheetName: string, data: any[], cellRange?: string): Promise<ToolResult> {
    try {
      await fs.access(filePath);
      
      return {
        success: true,
        data: {
          filePath,
          sheetName: sheetName || 'Sheet1',
          cellRange,
          recordsUpdated: data.length,
          message: 'Spreadsheet updated successfully (simulated)'
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  private async applyFormula(filePath: string, sheetName: string, cellRange: string): Promise<ToolResult> {
    try {
      await fs.access(filePath);
      
      // Mock formula result
      const result = Math.random() * 1000;
      
      return {
        success: true,
        data: {
          filePath,
          sheetName: sheetName || 'Sheet1',
          cellRange,
          formulaResult: result,
          message: 'Formula applied successfully (simulated)'
        }
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}