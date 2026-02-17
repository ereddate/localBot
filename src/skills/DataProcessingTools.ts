import { Tool, ToolResult } from '../types';
import * as fs from 'fs/promises';
import { Logger } from '../utils/Logger';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

export class CsvReadTool implements Tool {
  name = 'csv_read';
  description = 'Read and parse a CSV file';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;

      if (!filePath) {
        return { success: false, error: 'filePath is required' };
      }

      Logger.info(`Reading CSV file: ${filePath}`);

      const content = await fs.readFile(filePath, 'utf-8');
      const records = parse(content, { columns: true, skip_empty_lines: true });

      return {
        success: true,
        data: {
          records,
          count: records.length,
          filePath
        }
      };
    } catch (error) {
      Logger.error(`CSV read failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class CsvWriteTool implements Tool {
  name = 'csv_write';
  description = 'Write data to a CSV file';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;
      const data = params.data as any[];

      if (!filePath) {
        return { success: false, error: 'filePath is required' };
      }

      if (!data) {
        return { success: false, error: 'data is required' };
      }

      Logger.info(`Writing CSV file: ${filePath}`);

      // Convert data to CSV string
      const csvString = stringify(data, { header: true });

      await fs.writeFile(filePath, csvString, 'utf-8');

      return {
        success: true,
        data: {
          message: 'CSV file written successfully',
          filePath,
          rows: data.length
        }
      };
    } catch (error) {
      Logger.error(`CSV write failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class JsonReadTool implements Tool {
  name = 'json_read';
  description = 'Read and parse a JSON file';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;

      if (!filePath) {
        return { success: false, error: 'filePath is required' };
      }

      Logger.info(`Reading JSON file: ${filePath}`);

      const content = await fs.readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(content);

      return {
        success: true,
        data: {
          data: jsonData,
          filePath
        }
      };
    } catch (error) {
      Logger.error(`JSON read failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}

export class JsonWriteTool implements Tool {
  name = 'json_write';
  description = 'Write data to a JSON file';
  category = 'file' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const filePath = params.filePath as string;
      const data = params.data as any;
      const pretty = params.pretty as boolean || false;

      if (!filePath) {
        return { success: false, error: 'filePath is required' };
      }

      if (data === undefined) {
        return { success: false, error: 'data is required' };
      }

      Logger.info(`Writing JSON file: ${filePath}`);

      const jsonString = pretty 
        ? JSON.stringify(data, null, 2) 
        : JSON.stringify(data);

      await fs.writeFile(filePath, jsonString, 'utf-8');

      return {
        success: true,
        data: {
          message: 'JSON file written successfully',
          filePath
        }
      };
    } catch (error) {
      Logger.error(`JSON write failed`, { error: (error as Error).message });
      return { success: false, error: (error as Error).message };
    }
  }
}