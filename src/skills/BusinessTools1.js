"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpreadsheetTool = exports.FinancialCalculatorTool = void 0;
const Logger_1 = require("../utils/Logger");
const ConsoleLogger_1 = require("../utils/ConsoleLogger");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class FinancialCalculatorTool {
    constructor() {
        this.name = 'financial_calculator';
        this.description = 'Perform financial calculations (NPV, ROI, cash flow, etc.)';
        this.category = 'system';
    }
    async execute(params) {
        try {
            ConsoleLogger_1.ConsoleLogger.logSkillCall(this.name, params);
            const operation = params.operation;
            const principal = params.principal;
            const rate = params.rate;
            const time = params.time;
            const cashFlows = params.cashFlows;
            const discountRate = params.discountRate;
            if (!operation) {
                return { success: false, error: 'operation is required (simple_interest, compound_interest, npv, roi, future_value)' };
            }
            switch (operation.toLowerCase()) {
                case 'simple_interest':
                    if (principal === undefined || rate === undefined || time === undefined) {
                        return { success: false, error: 'principal, rate, and time are required for simple interest calculation' };
                    }
                    console.log(`🧮 执行简单利息计算: P=${principal}, R=${rate}, T=${time}`);
                    return this.calculateSimpleInterest(principal, rate, time);
                case 'compound_interest':
                    if (principal === undefined || rate === undefined || time === undefined) {
                        return { success: false, error: 'principal, rate, and time are required for compound interest calculation' };
                    }
                    console.log(`🧮 执行复利计算: P=${principal}, R=${rate}, T=${time}`);
                    return this.calculateCompoundInterest(principal, rate, time);
                case 'npv':
                    if (!cashFlows || cashFlows.length === 0 || discountRate === undefined) {
                        return { success: false, error: 'cashFlows array and discountRate are required for NPV calculation' };
                    }
                    console.log(`🧮 执行净现值计算: CFs=[${cashFlows.slice(0, 3).join(', ')}${cashFlows.length > 3 ? '...' : ''}], DR=${discountRate}`);
                    return this.calculateNPV(cashFlows, discountRate);
                case 'roi':
                    if (principal === undefined || rate === undefined) {
                        return { success: false, error: 'initialInvestment and finalValue are required for ROI calculation' };
                    }
                    console.log(`🧮 执行投资回报率计算: IV=${principal}, FV=${rate}`);
                    return this.calculateROI(principal, rate); // Note: using principal as initialInvestment and rate as finalValue for this case
                case 'future_value':
                    if (principal === undefined || rate === undefined || time === undefined) {
                        return { success: false, error: 'presentValue, rate, and time are required for future value calculation' };
                    }
                    console.log(`🧮 执行终值计算: PV=${principal}, R=${rate}, T=${time}`);
                    return this.calculateFutureValue(principal, rate, time);
                default:
                    return { success: false, error: 'Invalid operation. Use: simple_interest, compound_interest, npv, roi, future_value' };
            }
        }
        catch (error) {
            ConsoleLogger_1.ConsoleLogger.logSkillError(this.name, error.message);
            Logger_1.Logger.error(`Financial calculation failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
    calculateSimpleInterest(principal, rate, time) {
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
    calculateCompoundInterest(principal, rate, time) {
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
    calculateNPV(cashFlows, discountRate) {
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
    calculateROI(initialInvestment, finalValue) {
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
    calculateFutureValue(presentValue, rate, time) {
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
exports.FinancialCalculatorTool = FinancialCalculatorTool;
class SpreadsheetTool {
    constructor() {
        this.name = 'spreadsheet_operations';
        this.description = 'Perform spreadsheet operations (Excel/Google Sheets)';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const filePath = params.filePath;
            const sheetName = params.sheetName;
            const data = params.data;
            const cellRange = params.cellRange;
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
        }
        catch (error) {
            Logger_1.Logger.error(`Spreadsheet operation failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
    async readSpreadsheet(filePath, sheetName, cellRange) {
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
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async writeToSpreadsheet(filePath, sheetName, data) {
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
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async updateSpreadsheet(filePath, sheetName, data, cellRange) {
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
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
    async applyFormula(filePath, sheetName, cellRange) {
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
        }
        catch (error) {
            return { success: false, error: error.message };
        }
    }
}
exports.SpreadsheetTool = SpreadsheetTool;
