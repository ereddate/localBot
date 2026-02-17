import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';

export class WorkflowApprovalTool implements Tool {
  name = 'workflow_approve';
  description = 'Handle workflow approval processes';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const document = params.document as string;
      const approvers = params.approvers as string[];
      const approvalCriteria = params.approvalCriteria as string[];

      if (!document) {
        return { success: false, error: 'Document is required' };
      }

      // Simulate workflow approval
      const approvalId = `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();
      
      // Store approval in a JSON file
      const approvalsPath = path.join(__dirname, '../../data/approvals');
      const filePath = path.join(approvalsPath, `${approvalId}.json`);
      
      try {
        await fs.mkdir(approvalsPath, { recursive: true });
      } catch (mkdirErr) {
        Logger.warn(`Could not create approvals directory: ${(mkdirErr as Error).message}`);
      }

      const approvalData = {
        id: approvalId,
        document,
        approvers: approvers || [],
        criteria: approvalCriteria || [],
        status: 'pending',
        createdAt: timestamp,
        responses: []
      };

      await fs.writeFile(filePath, JSON.stringify(approvalData, null, 2));

      Logger.info(`Workflow approval initiated for document '${document}'`, { approvalId });

      return {
        success: true,
        data: { 
          approvalId, 
          message: `Approval workflow initiated for ${document}`,
          status: 'initiated'
        }
      };
    } catch (error) {
      Logger.error('Workflow approval error', { error: (error as Error).message });
      return { success: false, error: `Failed to initiate approval: ${(error as Error).message}` };
    }
  }
}

export class DocumentGeneratorTool implements Tool {
  name = 'document_generator';
  description = 'Generate documents from templates';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const template = params.template as string;
      const data = params.data as Record<string, unknown>;
      const outputFormat = params.outputFormat as string || 'txt';

      if (!template) {
        return { success: false, error: 'Template is required' };
      }

      if (!data) {
        return { success: false, error: 'Data is required' };
      }

      // Generate document content based on template and data
      let content = '';
      
      // Simple template replacement
      if (template.includes('{{') && template.includes('}}')) {
        // Template contains placeholders
        content = template;
        for (const [key, value] of Object.entries(data)) {
          content = content.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
        }
      } else {
        // Use template as filename
        try {
          const templatePath = path.join(__dirname, `../../templates/${template}`);
          content = await fs.readFile(templatePath, 'utf8');
          
          // Replace placeholders with actual data
          for (const [key, value] of Object.entries(data)) {
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
          }
        } catch (err) {
          // If template file doesn't exist, use the template name as content
          content = `Generated document based on template: ${template}\n\n`;
          for (const [key, value] of Object.entries(data)) {
            content += `${key}: ${value}\n`;
          }
        }
      }

      // Save document
      const documentsPath = path.join(__dirname, '../../documents');
      const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const fileName = `${docId}.${outputFormat}`;
      const filePath = path.join(documentsPath, fileName);
      
      try {
        await fs.mkdir(documentsPath, { recursive: true });
      } catch (mkdirErr) {
        Logger.warn(`Could not create documents directory: ${(mkdirErr as Error).message}`);
      }

      await fs.writeFile(filePath, content);

      Logger.info(`Document generated`, { docId, template, outputFormat });

      return {
        success: true,
        data: { 
          docId, 
          fileName, 
          path: filePath, 
          content: content.substring(0, 200) + (content.length > 200 ? '...' : '') // Truncate for display
        }
      };
    } catch (error) {
      Logger.error('Document generation error', { error: (error as Error).message });
      return { success: false, error: `Failed to generate document: ${(error as Error).message}` };
    }
  }
}

export class ValidationCheckTool implements Tool {
  name = 'validation_check';
  description = 'Perform validation checks';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const type = params.type as string;
      const value = params.value;
      const rules = params.rules as Record<string, unknown>;

      if (!type) {
        return { success: false, error: 'Validation type is required' };
      }

      if (value === undefined) {
        return { success: false, error: 'Value to validate is required' };
      }

      let isValid = false;
      let errorMessage = '';

      switch (type.toLowerCase()) {
        case 'email':
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string);
          errorMessage = isValid ? '' : 'Invalid email format';
          break;
          
        case 'phone':
          isValid = /^[\+]?[1-9][\d]{0,15}$/.test(value as string);
          errorMessage = isValid ? '' : 'Invalid phone number format';
          break;
          
        case 'url':
          try {
            new URL(value as string);
            isValid = true;
          } catch {
            isValid = false;
            errorMessage = 'Invalid URL format';
          }
          break;
          
        case 'date':
          const date = new Date(value as string);
          isValid = !isNaN(date.getTime());
          errorMessage = isValid ? '' : 'Invalid date format';
          break;
          
        case 'numeric':
          isValid = !isNaN(Number(value));
          errorMessage = isValid ? '' : 'Value is not numeric';
          break;
          
        case 'custom':
          // Apply custom validation rules
          if (rules?.min !== undefined && Number(value) < Number(rules.min)) {
            isValid = false;
            errorMessage = `Value must be greater than or equal to ${rules.min}`;
          } else if (rules?.max !== undefined && Number(value) > Number(rules.max)) {
            isValid = false;
            errorMessage = `Value must be less than or equal to ${rules.max}`;
          } else {
            isValid = true;
          }
          break;
          
        default:
          isValid = true; // Default to valid for unknown types
      }

      Logger.info(`Validation completed`, { type, value, isValid });

      return {
        success: true,
        data: { 
          type, 
          value, 
          isValid, 
          error: errorMessage 
        }
      };
    } catch (error) {
      Logger.error('Validation check error', { error: (error as Error).message });
      return { success: false, error: `Failed to perform validation: ${(error as Error).message}` };
    }
  }
}

export class NotificationSendTool implements Tool {
  name = 'notification_send';
  description = 'Send notifications';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const recipient = params.recipient as string;
      const message = params.message as string;
      const channel = params.channel as string || 'email';
      const priority = params.priority as string || 'normal';

      if (!recipient) {
        return { success: false, error: 'Recipient is required' };
      }

      if (!message) {
        return { success: false, error: 'Message is required' };
      }

      // Simulate sending notification
      const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();
      
      // Store notification in a JSON file
      const notificationsPath = path.join(__dirname, '../../data/notifications');
      const filePath = path.join(notificationsPath, `${notificationId}.json`);
      
      try {
        await fs.mkdir(notificationsPath, { recursive: true });
      } catch (mkdirErr) {
        Logger.warn(`Could not create notifications directory: ${(mkdirErr as Error).message}`);
      }

      const notificationData = {
        id: notificationId,
        recipient,
        message,
        channel,
        priority,
        sentAt: timestamp,
        status: 'sent'
      };

      await fs.writeFile(filePath, JSON.stringify(notificationData, null, 2));

      Logger.info(`Notification sent`, { notificationId, recipient, channel });

      return {
        success: true,
        data: { 
          notificationId, 
          message: `Notification sent to ${recipient} via ${channel}`
        }
      };
    } catch (error) {
      Logger.error('Notification send error', { error: (error as Error).message });
      return { success: false, error: `Failed to send notification: ${(error as Error).message}` };
    }
  }
}