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
exports.TaxCalculatorTool = exports.PaymentGatewayTool = exports.AccountingSystemTool = exports.InventoryManagementToolExtended = void 0;
const Logger_1 = require("../utils/Logger");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class InventoryManagementToolExtended {
    constructor() {
        this.name = 'inventory_ops';
        this.description = 'Extended inventory operations';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const itemId = params.itemId;
            const quantity = params.quantity;
            const location = params.location;
            if (!operation) {
                return { success: false, error: 'Operation is required (update_stock, check_stock, reorder_alert, transfer_inventory)' };
            }
            // Create inventory directory if it doesn't exist
            const invPath = path.join(__dirname, '../../data/inventory');
            try {
                await fs.mkdir(invPath, { recursive: true });
            }
            catch (mkdirErr) {
                Logger_1.Logger.warn(`Could not create inventory directory: ${mkdirErr.message}`);
            }
            const inventoryFile = path.join(invPath, 'inventory.json');
            let inventory = [];
            // Load existing inventory
            try {
                const fileContent = await fs.readFile(inventoryFile, 'utf8');
                inventory = JSON.parse(fileContent);
            }
            catch (err) {
                // File doesn't exist, start with empty array
                inventory = [];
            }
            switch (operation.toLowerCase()) {
                case 'update_stock':
                    if (!itemId) {
                        return { success: false, error: 'Item ID is required' };
                    }
                    if (quantity === undefined) {
                        return { success: false, error: 'Quantity is required' };
                    }
                    const itemIndex = inventory.findIndex(item => item.id === itemId);
                    if (itemIndex === -1) {
                        // Add new item if not found
                        const newItem = {
                            id: itemId,
                            quantity,
                            lastUpdated: new Date().toISOString(),
                            location: location || 'default'
                        };
                        inventory.push(newItem);
                    }
                    else {
                        // Update existing item
                        inventory[itemIndex].quantity = quantity;
                        inventory[itemIndex].lastUpdated = new Date().toISOString();
                        if (location) {
                            inventory[itemIndex].location = location;
                        }
                    }
                    await fs.writeFile(inventoryFile, JSON.stringify(inventory, null, 2));
                    Logger_1.Logger.info(`Inventory stock updated`, { itemId, quantity });
                    return {
                        success: true,
                        data: {
                            itemId,
                            newQuantity: quantity,
                            message: `Stock updated for item ${itemId}`
                        }
                    };
                case 'check_stock':
                    if (!itemId) {
                        return { success: false, error: 'Item ID is required' };
                    }
                    const item = inventory.find(i => i.id === itemId);
                    if (!item) {
                        return {
                            success: true,
                            data: {
                                itemId,
                                quantity: 0,
                                message: `Item ${itemId} not found in inventory`
                            }
                        };
                    }
                    // Check if stock is low
                    const minStockLevel = item.minStockLevel || 10;
                    const isLowStock = item.quantity <= minStockLevel;
                    const status = isLowStock ? 'low' : 'adequate';
                    Logger_1.Logger.info(`Inventory checked`, { itemId, quantity: item.quantity, status });
                    return {
                        success: true,
                        data: {
                            itemId,
                            quantity: item.quantity,
                            location: item.location,
                            status,
                            isLowStock
                        }
                    };
                case 'reorder_alert':
                    // Find all items that need reordering
                    const reorderItems = inventory.filter(item => {
                        const minStockLevel = item.minStockLevel || 10;
                        return item.quantity <= minStockLevel;
                    });
                    Logger_1.Logger.info(`Reorder alerts generated`, { alertCount: reorderItems.length });
                    return {
                        success: true,
                        data: {
                            alertCount: reorderItems.length,
                            itemsNeedingReorder: reorderItems.map(item => ({
                                id: item.id,
                                currentQuantity: item.quantity,
                                minQuantity: item.minStockLevel || 10
                            }))
                        }
                    };
                case 'transfer_inventory':
                    if (!itemId) {
                        return { success: false, error: 'Item ID is required' };
                    }
                    if (!location) {
                        return { success: false, error: 'Destination location is required' };
                    }
                    const transferItemIndex = inventory.findIndex(item => item.id === itemId);
                    if (transferItemIndex === -1) {
                        return { success: false, error: `Item ${itemId} not found in inventory` };
                    }
                    // Update location
                    inventory[transferItemIndex].location = location;
                    inventory[transferItemIndex].lastUpdated = new Date().toISOString();
                    await fs.writeFile(inventoryFile, JSON.stringify(inventory, null, 2));
                    Logger_1.Logger.info(`Inventory transferred`, { itemId, destination: location });
                    return {
                        success: true,
                        data: {
                            itemId,
                            destination: location,
                            message: `Item ${itemId} transferred to ${location}`
                        }
                    };
                default:
                    return { success: false, error: `Unsupported operation: ${operation}` };
            }
        }
        catch (error) {
            Logger_1.Logger.error('Inventory management operation error', { error: error.message });
            return { success: false, error: `Inventory operation failed: ${error.message}` };
        }
    }
}
exports.InventoryManagementToolExtended = InventoryManagementToolExtended;
class AccountingSystemTool {
    constructor() {
        this.name = 'accounting_validation';
        this.description = 'Accounting system validation and operations';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const transactionData = params.transactionData;
            const accountType = params.accountType;
            if (!operation) {
                return { success: false, error: 'Operation is required (validate_transaction, post_to_gl, reconcile_accounts, generate_journal_entry)' };
            }
            // Create accounting directory if it doesn't exist
            const accPath = path.join(__dirname, '../../data/accounting');
            try {
                await fs.mkdir(accPath, { recursive: true });
            }
            catch (mkdirErr) {
                Logger_1.Logger.warn(`Could not create accounting directory: ${mkdirErr.message}`);
            }
            switch (operation.toLowerCase()) {
                case 'validate_transaction':
                    if (!transactionData) {
                        return { success: false, error: 'Transaction data is required' };
                    }
                    // Validate transaction data
                    const requiredFields = ['amount', 'debitAccount', 'creditAccount', 'date'];
                    const missingFields = requiredFields.filter(field => !transactionData[field]);
                    if (missingFields.length > 0) {
                        return { success: false, error: `Missing required fields: ${missingFields.join(', ')}` };
                    }
                    const amount = Number(transactionData.amount);
                    if (isNaN(amount) || amount <= 0) {
                        return { success: false, error: 'Transaction amount must be a positive number' };
                    }
                    // Double entry check: debits must equal credits
                    const debitAmount = Number(transactionData.debitAmount) || amount;
                    const creditAmount = Number(transactionData.creditAmount) || amount;
                    if (Math.abs(debitAmount - creditAmount) > 0.01) { // Allow small rounding differences
                        return { success: false, error: 'Debits and credits must be equal' };
                    }
                    Logger_1.Logger.info(`Transaction validated`, {
                        debitAccount: transactionData.debitAccount,
                        creditAccount: transactionData.creditAccount,
                        amount
                    });
                    return {
                        success: true,
                        data: {
                            isValid: true,
                            message: 'Transaction passed validation checks',
                            transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                        }
                    };
                case 'post_to_gl':
                    if (!transactionData) {
                        return { success: false, error: 'Transaction data is required' };
                    }
                    // Create general ledger entry
                    const glEntry = {
                        id: `gl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        ...transactionData,
                        postedDate: new Date().toISOString(),
                        status: 'posted'
                    };
                    // Save to general ledger file
                    const glFile = path.join(accPath, 'general_ledger.json');
                    let glEntries = [];
                    try {
                        const fileContent = await fs.readFile(glFile, 'utf8');
                        glEntries = JSON.parse(fileContent);
                    }
                    catch (err) {
                        // File doesn't exist, start with empty array
                        glEntries = [];
                    }
                    glEntries.push(glEntry);
                    await fs.writeFile(glFile, JSON.stringify(glEntries, null, 2));
                    Logger_1.Logger.info(`Transaction posted to GL`, { entryId: glEntry.id });
                    return {
                        success: true,
                        data: {
                            entryId: glEntry.id,
                            message: 'Transaction successfully posted to General Ledger'
                        }
                    };
                case 'reconcile_accounts':
                    // Simulate account reconciliation
                    const reconciliationReport = {
                        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        accountType: accountType || 'general',
                        startDate: params.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
                        endDate: new Date().toISOString(),
                        openingBalance: params.openingBalance || 0,
                        closingBalance: params.closingBalance || 0,
                        totalDebits: params.totalDebits || 0,
                        totalCredits: params.totalCredits || 0,
                        reconciled: true,
                        variance: 0,
                        status: 'completed'
                    };
                    Logger_1.Logger.info(`Accounts reconciled`, { accountType: reconciliationReport.accountType });
                    return {
                        success: true,
                        data: reconciliationReport
                    };
                case 'generate_journal_entry':
                    if (!transactionData) {
                        return { success: false, error: 'Transaction data is required' };
                    }
                    // Generate journal entry
                    const journalEntry = {
                        id: `je_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        date: new Date().toISOString(),
                        description: transactionData.description || 'Journal Entry',
                        lines: [
                            {
                                account: transactionData.debitAccount,
                                type: 'debit',
                                amount: Number(transactionData.debitAmount) || Number(transactionData.amount) || 0
                            },
                            {
                                account: transactionData.creditAccount,
                                type: 'credit',
                                amount: Number(transactionData.creditAmount) || Number(transactionData.amount) || 0
                            }
                        ],
                        reference: transactionData.reference || '',
                        status: 'draft'
                    };
                    Logger_1.Logger.info(`Journal entry generated`, { entryId: journalEntry.id });
                    return {
                        success: true,
                        data: journalEntry
                    };
                default:
                    return { success: false, error: `Unsupported operation: ${operation}` };
            }
        }
        catch (error) {
            Logger_1.Logger.error('Accounting system operation error', { error: error.message });
            return { success: false, error: `Accounting operation failed: ${error.message}` };
        }
    }
}
exports.AccountingSystemTool = AccountingSystemTool;
class PaymentGatewayTool {
    constructor() {
        this.name = 'payment_gateway';
        this.description = 'Payment processing operations';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const amount = params.amount;
            const currency = params.currency || 'USD';
            const paymentMethod = params.paymentMethod;
            const recipient = params.recipient;
            if (!amount || amount <= 0) {
                return { success: false, error: 'Valid amount is required' };
            }
            if (!paymentMethod) {
                return { success: false, error: 'Payment method is required' };
            }
            if (!recipient) {
                return { success: false, error: 'Recipient is required' };
            }
            // Simulate payment processing
            const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const timestamp = new Date().toISOString();
            const status = 'completed'; // In a real system, this might be 'pending' initially
            // Create payments directory if it doesn't exist
            const payPath = path.join(__dirname, '../../data/payments');
            try {
                await fs.mkdir(payPath, { recursive: true });
            }
            catch (mkdirErr) {
                Logger_1.Logger.warn(`Could not create payments directory: ${mkdirErr.message}`);
            }
            // Save payment record
            const paymentRecord = {
                id: paymentId,
                amount,
                currency,
                paymentMethod,
                recipient,
                status,
                processedAt: timestamp,
                fees: amount * 0.029 + 0.30, // Typical payment processor fees
                netAmount: amount - (amount * 0.029 + 0.30)
            };
            const paymentFile = path.join(payPath, `${paymentId}.json`);
            await fs.writeFile(paymentFile, JSON.stringify(paymentRecord, null, 2));
            Logger_1.Logger.info(`Payment processed`, { paymentId, amount, recipient });
            return {
                success: true,
                data: {
                    paymentId,
                    status,
                    amount,
                    currency,
                    fees: paymentRecord.fees,
                    netAmount: paymentRecord.netAmount,
                    message: `Payment of ${currency} ${amount} processed successfully`
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error('Payment gateway operation error', { error: error.message });
            return { success: false, error: `Payment processing failed: ${error.message}` };
        }
    }
}
exports.PaymentGatewayTool = PaymentGatewayTool;
class TaxCalculatorTool {
    constructor() {
        this.name = 'tax_calculator';
        this.description = 'Tax calculation operations';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const income = params.income;
            const taxType = params.taxType || 'income';
            const jurisdiction = params.jurisdiction || 'default';
            const deductions = params.deductions || 0;
            const taxRate = params.taxRate;
            if (income === undefined || income < 0) {
                return { success: false, error: 'Valid income amount is required' };
            }
            let calculatedTax;
            let effectiveRate;
            // Calculate tax based on jurisdiction and type
            if (taxRate !== undefined) {
                // Use provided tax rate
                calculatedTax = (income - deductions) * (taxRate / 100);
            }
            else {
                // Use default tax rates based on jurisdiction and type
                switch (jurisdiction.toLowerCase()) {
                    case 'us':
                    case 'usa':
                        if (taxType.toLowerCase() === 'income') {
                            // Simplified US federal income tax brackets (single filer, 2023)
                            const taxableIncome = income - deductions;
                            if (taxableIncome <= 11000) {
                                calculatedTax = taxableIncome * 0.10;
                            }
                            else if (taxableIncome <= 44725) {
                                calculatedTax = 1100 + (taxableIncome - 11000) * 0.12;
                            }
                            else if (taxableIncome <= 95375) {
                                calculatedTax = 1100 + 4057.50 + (taxableIncome - 44725) * 0.22;
                            }
                            else {
                                // Higher brackets simplified
                                calculatedTax = (taxableIncome) * 0.25;
                            }
                        }
                        else if (taxType.toLowerCase() === 'sales') {
                            calculatedTax = income * 0.06; // Default 6% sales tax
                        }
                        else {
                            calculatedTax = income * 0.20; // Default rate
                        }
                        break;
                    case 'eu':
                    case 'europe':
                        if (taxType.toLowerCase() === 'vat') {
                            calculatedTax = income * 0.20; // Default VAT rate
                        }
                        else {
                            calculatedTax = income * 0.30; // Default corporate tax
                        }
                        break;
                    default:
                        // Default tax calculation
                        calculatedTax = (income - deductions) * 0.20; // 20% default rate
                }
            }
            // Ensure tax isn't negative
            calculatedTax = Math.max(0, calculatedTax);
            effectiveRate = income > 0 ? (calculatedTax / income) * 100 : 0;
            // Create tax records directory if it doesn't exist
            const taxPath = path.join(__dirname, '../../data/tax');
            try {
                await fs.mkdir(taxPath, { recursive: true });
            }
            catch (mkdirErr) {
                Logger_1.Logger.warn(`Could not create tax records directory: ${mkdirErr.message}`);
            }
            // Save tax calculation record
            const taxRecord = {
                id: `tax_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                income,
                deductions,
                taxType,
                jurisdiction,
                taxRate: taxRate || 'computed',
                calculatedTax,
                effectiveRate,
                calculatedAt: new Date().toISOString()
            };
            const taxFile = path.join(taxPath, `${taxRecord.id}.json`);
            await fs.writeFile(taxFile, JSON.stringify(taxRecord, null, 2));
            Logger_1.Logger.info(`Tax calculated`, { taxRecordId: taxRecord.id, calculatedTax, taxType });
            return {
                success: true,
                data: {
                    taxId: taxRecord.id,
                    income,
                    deductions,
                    taxType,
                    jurisdiction,
                    calculatedTax,
                    effectiveRate: parseFloat(effectiveRate.toFixed(2)),
                    message: `Calculated ${taxType} tax for ${jurisdiction}: ${currencyFormatter(calculatedTax)}`
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error('Tax calculation operation error', { error: error.message });
            return { success: false, error: `Tax calculation failed: ${error.message}` };
        }
    }
}
exports.TaxCalculatorTool = TaxCalculatorTool;
// Helper function for currency formatting
function currencyFormatter(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}
