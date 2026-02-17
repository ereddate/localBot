import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import * as fs from 'fs/promises';
import * as path from 'path';

export class DatabaseInsertTool implements Tool {
  name = 'database_insert';
  description = 'Insert data into a database table';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const table = params.table as string;
      const data = params.data as Record<string, unknown>;

      if (!table) {
        return { success: false, error: 'Table name is required' };
      }

      if (!data) {
        return { success: false, error: 'Data object is required' };
      }

      // Simulate database insert by storing data in a JSON file
      const dbPath = path.join(__dirname, '../../data');
      const filePath = path.join(dbPath, `${table}.json`);
      
      try {
        await fs.mkdir(dbPath, { recursive: true });
      } catch (mkdirErr) {
        Logger.warn(`Could not create data directory: ${(mkdirErr as Error).message}`);
      }

      let existingData: any[] = [];
      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        existingData = JSON.parse(fileContent);
      } catch (err) {
        // File doesn't exist yet, start with empty array
        existingData = [];
      }

      // Add ID and timestamp
      const newData = {
        id: `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        ...data
      };

      existingData.push(newData);

      await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

      Logger.info(`Data inserted into table '${table}'`, { recordId: newData.id });

      return {
        success: true,
        data: { id: newData.id, message: `Successfully inserted data into table '${table}'` }
      };
    } catch (error) {
      Logger.error('Database insert error', { error: (error as Error).message });
      return { success: false, error: `Failed to insert data: ${(error as Error).message}` };
    }
  }
}

export class DatabaseQueryTool implements Tool {
  name = 'database_query';
  description = 'Query data from a database table';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const table = params.table as string;
      const query = params.query as string;
      const filters = params.filters as Record<string, unknown>;

      if (!table) {
        return { success: false, error: 'Table name is required' };
      }

      // Simulate database query by reading from a JSON file
      const dbPath = path.join(__dirname, '../../data');
      const filePath = path.join(dbPath, `${table}.json`);

      let data: any[] = [];
      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        data = JSON.parse(fileContent);
      } catch (err) {
        // File doesn't exist, return empty array
        data = [];
      }

      // Apply filters if provided
      if (filters && Object.keys(filters).length > 0) {
        data = data.filter(item => {
          return Object.entries(filters).every(([key, value]) => {
            return item[key] === value;
          });
        });
      }

      Logger.info(`Data queried from table '${table}'`, { count: data.length });

      return {
        success: true,
        data: { results: data, count: data.length }
      };
    } catch (error) {
      Logger.error('Database query error', { error: (error as Error).message });
      return { success: false, error: `Failed to query data: ${(error as Error).message}` };
    }
  }
}

export class DatabaseUpdateTool implements Tool {
  name = 'database_update';
  description = 'Update data in a database table';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const table = params.table as string;
      const id = params.id as string;
      const data = params.data as Record<string, unknown>;

      if (!table) {
        return { success: false, error: 'Table name is required' };
      }

      if (!id) {
        return { success: false, error: 'ID is required' };
      }

      if (!data) {
        return { success: false, error: 'Data object is required' };
      }

      // Simulate database update by reading from a JSON file
      const dbPath = path.join(__dirname, '../../data');
      const filePath = path.join(dbPath, `${table}.json`);

      let existingData: any[] = [];
      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        existingData = JSON.parse(fileContent);
      } catch (err) {
        // File doesn't exist, return error
        return { success: false, error: `Table '${table}' does not exist` };
      }

      // Find and update the record
      const recordIndex = existingData.findIndex(item => item.id === id);
      if (recordIndex === -1) {
        return { success: false, error: `Record with ID '${id}' not found` };
      }

      // Update the record
      existingData[recordIndex] = {
        ...existingData[recordIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };

      await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

      Logger.info(`Data updated in table '${table}'`, { recordId: id });

      return {
        success: true,
        data: { id, message: `Successfully updated data in table '${table}'` }
      };
    } catch (error) {
      Logger.error('Database update error', { error: (error as Error).message });
      return { success: false, error: `Failed to update data: ${(error as Error).message}` };
    }
  }
}

export class DatabaseDeleteTool implements Tool {
  name = 'database_delete';
  description = 'Delete data from a database table';
  category = 'system' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const table = params.table as string;
      const id = params.id as string;

      if (!table) {
        return { success: false, error: 'Table name is required' };
      }

      if (!id) {
        return { success: false, error: 'ID is required' };
      }

      // Simulate database delete by reading from a JSON file
      const dbPath = path.join(__dirname, '../../data');
      const filePath = path.join(dbPath, `${table}.json`);

      let existingData: any[] = [];
      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        existingData = JSON.parse(fileContent);
      } catch (err) {
        // File doesn't exist, return error
        return { success: false, error: `Table '${table}' does not exist` };
      }

      // Find and remove the record
      const recordIndex = existingData.findIndex(item => item.id === id);
      if (recordIndex === -1) {
        return { success: false, error: `Record with ID '${id}' not found` };
      }

      const deletedRecord = existingData.splice(recordIndex, 1)[0];

      await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

      Logger.info(`Data deleted from table '${table}'`, { recordId: id });

      return {
        success: true,
        data: { id, message: `Successfully deleted data from table '${table}'` }
      };
    } catch (error) {
      Logger.error('Database delete error', { error: (error as Error).message });
      return { success: false, error: `Failed to delete data: ${(error as Error).message}` };
    }
  }
}