import { Tool, ToolResult } from '../types';
import { Logger } from '../utils/Logger';
import axios from 'axios';

export class ApiGetTool implements Tool {
  name = 'api_get';
  description = 'Make a GET request to an API endpoint';
  category = 'network' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const url = params.url as string;
      const headers = params.headers as Record<string, string> || {};
      const queryParams = params.queryParams as Record<string, string> || {};

      if (!url) {
        return { success: false, error: 'url is required' };
      }

      Logger.info(`Making GET request to: ${url}`);

      const response = await axios.get(url, {
        headers,
        params: queryParams,
        timeout: 10000
      });

      return {
        success: true,
        data: {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers,
          url: response.config.url
        }
      };
    } catch (error: any) {
      Logger.error(`API GET request failed`, { error: error.message });
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }
}

export class ApiPostTool implements Tool {
  name = 'api_post';
  description = 'Make a POST request to an API endpoint';
  category = 'network' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const url = params.url as string;
      const data = params.data as any;
      const headers = params.headers as Record<string, string> || {};

      if (!url) {
        return { success: false, error: 'url is required' };
      }

      if (!data) {
        return { success: false, error: 'data is required' };
      }

      Logger.info(`Making POST request to: ${url}`);

      const response = await axios.post(url, data, {
        headers,
        timeout: 10000
      });

      return {
        success: true,
        data: {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers,
          url: response.config.url
        }
      };
    } catch (error: any) {
      Logger.error(`API POST request failed`, { error: error.message });
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }
}

export class ApiPutTool implements Tool {
  name = 'api_put';
  description = 'Make a PUT request to an API endpoint';
  category = 'network' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const url = params.url as string;
      const data = params.data as any;
      const headers = params.headers as Record<string, string> || {};

      if (!url) {
        return { success: false, error: 'url is required' };
      }

      if (!data) {
        return { success: false, error: 'data is required' };
      }

      Logger.info(`Making PUT request to: ${url}`);

      const response = await axios.put(url, data, {
        headers,
        timeout: 10000
      });

      return {
        success: true,
        data: {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers,
          url: response.config.url
        }
      };
    } catch (error: any) {
      Logger.error(`API PUT request failed`, { error: error.message });
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }
}

export class ApiDeleteTool implements Tool {
  name = 'api_delete';
  description = 'Make a DELETE request to an API endpoint';
  category = 'network' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const url = params.url as string;
      const headers = params.headers as Record<string, string> || {};

      if (!url) {
        return { success: false, error: 'url is required' };
      }

      Logger.info(`Making DELETE request to: ${url}`);

      const response = await axios.delete(url, {
        headers,
        timeout: 10000
      });

      return {
        success: true,
        data: {
          status: response.status,
          statusText: response.statusText,
          data: response.data,
          headers: response.headers,
          url: response.config.url
        }
      };
    } catch (error: any) {
      Logger.error(`API DELETE request failed`, { error: error.message });
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }
}