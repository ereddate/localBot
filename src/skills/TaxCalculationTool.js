"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxCalculationTool = void 0;
const Logger_1 = require("../utils/Logger");
class TaxCalculationTool {
    constructor() {
        this.name = 'tax_calculator';
        this.description = '税务计算器，支持多种税种的计算和申报';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const taxType = params.taxType;
            const income = parseFloat(params.income) || 0;
            const deductions = parseFloat(params.deductions) || 0;
            const taxYear = parseInt(params.taxYear) || new Date().getFullYear();
            const jurisdiction = params.jurisdiction || 'federal';
            const filingStatus = params.filingStatus || 'single';
            if (!operation) {
                return { success: false, error: 'Operation is required. Available operations: calculate_tax, estimate_tax, compare_brackets, tax_projection' };
            }
            switch (operation.toLowerCase()) {
                case 'calculate_tax':
                    if (!taxType || income === undefined) {
                        return { success: false, error: 'Tax type and income are required for tax calculation' };
                    }
                    return this.calculateTax(taxType, income, deductions, taxYear, jurisdiction, filingStatus);
                case 'estimate_tax':
                    if (!taxType || income === undefined) {
                        return { success: false, error: 'Tax type and income are required for tax estimation' };
                    }
                    return this.estimateTax(taxType, income, deductions, taxYear, jurisdiction, filingStatus);
                case 'compare_brackets':
                    return this.compareTaxBrackets(taxYear, jurisdiction);
                case 'tax_projection':
                    const projectionYears = parseInt(params.projectionYears) || 5;
                    return this.taxProjection(taxType, income, deductions, projectionYears, taxYear, jurisdiction, filingStatus);
                default:
                    return { success: false, error: `Unsupported operation: ${operation}. Available operations: calculate_tax, estimate_tax, compare_brackets, tax_projection` };
            }
        }
        catch (error) {
            Logger_1.Logger.error('Tax calculation tool error', { error: error.message });
            return { success: false, error: `Failed to execute tax calculation: ${error.message}` };
        }
    }
    async calculateTax(taxType, income, deductions, taxYear, jurisdiction, filingStatus) {
        // 验证税种类型
        const validTaxTypes = ['individual_income_tax', 'corporate_income_tax', 'vat', 'payroll_tax', 'property_tax', 'capital_gains_tax'];
        if (!validTaxTypes.includes(taxType)) {
            return { success: false, error: `Invalid tax type: ${taxType}. Valid types: ${validTaxTypes.join(', ')}` };
        }
        // 计算应税收入
        const taxableIncome = Math.max(0, income - deductions);
        // 根据税种和年份计算税率（模拟）
        let taxRate = 0.15; // 默认税率
        let taxAmount = 0;
        let effectiveRate = 0;
        let brackets = [];
        switch (taxType) {
            case 'individual_income_tax':
                // 简化的个人所得税计算
                if (taxableIncome <= 10000) {
                    taxRate = 0.10;
                    taxAmount = taxableIncome * 0.10;
                }
                else if (taxableIncome <= 40000) {
                    taxRate = 0.12;
                    taxAmount = 1000 + (taxableIncome - 10000) * 0.12;
                }
                else if (taxableIncome <= 85000) {
                    taxRate = 0.22;
                    taxAmount = 1000 + 3600 + (taxableIncome - 40000) * 0.22;
                }
                else if (taxableIncome <= 160000) {
                    taxRate = 0.24;
                    taxAmount = 1000 + 3600 + 9900 + (taxableIncome - 85000) * 0.24;
                }
                else {
                    taxRate = 0.32;
                    taxAmount = 1000 + 3600 + 9900 + 18000 + (taxableIncome - 160000) * 0.32;
                }
                brackets = [
                    { bracket: '0-10,000', rate: 0.10, maxTax: 1000 },
                    { bracket: '10,001-40,000', rate: 0.12, maxTax: 4600 },
                    { bracket: '40,001-85,000', rate: 0.22, maxTax: 14500 },
                    { bracket: '85,001-160,000', rate: 0.24, maxTax: 32500 },
                    { bracket: '160,001+', rate: 0.32, maxTax: Infinity }
                ];
                break;
            case 'corporate_income_tax':
                // 简化的公司所得税计算
                taxRate = 0.21;
                taxAmount = taxableIncome * 0.21;
                brackets = [
                    { bracket: 'All', rate: 0.21, maxTax: Infinity }
                ];
                break;
            case 'vat':
                // 简化的增值税计算
                taxRate = 0.13; // 假设增值税率为13%
                taxAmount = income * 0.13;
                brackets = [
                    { bracket: 'Standard Rate', rate: 0.13, maxTax: Infinity }
                ];
                break;
            case 'payroll_tax':
                // 简化的工资税计算
                taxRate = 0.0765; // 假设社保税率为7.65%
                taxAmount = Math.min(income, 160200) * 0.0765; // 有上限
                brackets = [
                    { bracket: 'Below Cap', rate: 0.0765, maxTax: 12255.30 },
                    { bracket: 'Above Cap', rate: 0.0145, maxTax: Infinity } // 额外医疗保险税
                ];
                break;
            case 'property_tax':
                // 简化的房产税计算
                taxRate = 0.012; // 假设房产税率为1.2%
                taxAmount = income * 0.012; // 基于评估价值
                brackets = [
                    { bracket: 'Residential', rate: 0.012, maxTax: Infinity }
                ];
                break;
            case 'capital_gains_tax':
                // 简化的资本利得税计算
                if (taxableIncome <= 44625) {
                    taxRate = 0.00;
                    taxAmount = 0;
                }
                else if (taxableIncome <= 492300) {
                    taxRate = 0.15;
                    taxAmount = (taxableIncome - 44625) * 0.15;
                }
                else {
                    taxRate = 0.20;
                    taxAmount = (492300 - 44625) * 0.15 + (taxableIncome - 492300) * 0.20;
                }
                brackets = [
                    { bracket: '0-44,625', rate: 0.00, maxTax: 0 },
                    { bracket: '44,626-492,300', rate: 0.15, maxTax: 67177.5 },
                    { bracket: '492,301+', rate: 0.20, maxTax: Infinity }
                ];
                break;
        }
        effectiveRate = income > 0 ? taxAmount / income : 0;
        return {
            success: true,
            data: {
                taxType,
                taxYear,
                jurisdiction,
                filingStatus,
                income,
                deductions,
                taxableIncome,
                taxRate: Math.round(taxRate * 10000) / 10000, // 四位小数
                effectiveRate: Math.round(effectiveRate * 10000) / 10000,
                taxAmount: Math.round(taxAmount * 100) / 100, // 两位小数
                brackets,
                savingsOpportunities: this.calculateSavingsOpportunities(taxType, income, deductions)
            }
        };
    }
    async estimateTax(taxType, income, deductions, taxYear, jurisdiction, filingStatus) {
        return this.calculateTax(taxType, income, deductions, taxYear, jurisdiction, filingStatus);
    }
    async compareTaxBrackets(taxYear, jurisdiction) {
        // 返回不同税种的税率对比
        const bracketsComparison = {
            taxYear,
            jurisdiction,
            individualIncomeTax: {
                brackets: [
                    { range: '0-10,275', rate: 0.10 },
                    { range: '10,276-41,775', rate: 0.12 },
                    { range: '41,776-89,450', rate: 0.22 },
                    { range: '89,451-190,750', rate: 0.24 },
                    { range: '190,751-414,700', rate: 0.32 },
                    { range: '414,701+', rate: 0.37 }
                ]
            },
            corporateIncomeTax: {
                flatRate: 0.21
            },
            capitalGainsTax: {
                brackets: [
                    { range: '0-44,625', rate: 0.00 },
                    { range: '44,626-492,300', rate: 0.15 },
                    { range: '492,301+', rate: 0.20 }
                ]
            }
        };
        return {
            success: true,
            data: {
                message: 'Tax brackets comparison for current year',
                bracketsComparison
            }
        };
    }
    async taxProjection(taxType, currentIncome, currentDeductions, years, taxYear, jurisdiction, filingStatus) {
        const projections = [];
        for (let i = 0; i < years; i++) {
            const year = taxYear + i;
            // 假设每年收入增长3%
            const projectedIncome = currentIncome * Math.pow(1.03, i);
            // 假设每年扣除额增长2%
            const projectedDeductions = currentDeductions * Math.pow(1.02, i);
            const taxResult = await this.calculateTax(taxType, projectedIncome, projectedDeductions, year, jurisdiction, filingStatus);
            if (taxResult.success) {
                const taxData = taxResult.data;
                projections.push({
                    year,
                    projectedIncome: Math.round(projectedIncome * 100) / 100,
                    projectedDeductions: Math.round(projectedDeductions * 100) / 100,
                    projectedTaxAmount: taxData.taxAmount,
                    projectedEffectiveRate: taxData.effectiveRate
                });
            }
        }
        return {
            success: true,
            data: {
                taxType,
                currentYear: taxYear,
                projectionYears: years,
                projections,
                summary: {
                    totalProjectedTax: projections.reduce((sum, p) => sum + p.projectedTaxAmount, 0),
                    averageEffectiveRate: projections.reduce((sum, p) => sum + p.projectedEffectiveRate, 0) / projections.length
                }
            }
        };
    }
    calculateSavingsOpportunities(taxType, income, deductions) {
        const opportunities = [];
        // 基于收入水平提供建议
        if (income > 50000) {
            opportunities.push({
                opportunity: '退休账户贡献',
                potentialSavings: Math.min(income * 0.05, 6500), // 假设最大贡献额
                description: '向401(k)或IRA账户贡献可减少应税收入'
            });
        }
        if (income > 200000) {
            opportunities.push({
                opportunity: '慈善捐赠',
                potentialSavings: income * 0.02, // 假设2%的收入用于慈善
                description: '慈善捐赠可享受税收抵扣'
            });
        }
        if (deductions < income * 0.2) {
            opportunities.push({
                opportunity: '增加扣除项',
                potentialSavings: (income * 0.2 - deductions) * 0.22, // 基于22%边际税率估算
                description: '考虑增加房贷利息、医疗费用等可扣除项目'
            });
        }
        return opportunities;
    }
}
exports.TaxCalculationTool = TaxCalculationTool;
