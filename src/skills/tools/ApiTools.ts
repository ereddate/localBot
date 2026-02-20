import { Tool, ToolResult } from '../../types';
import { Logger } from '../../utils/Logger';
import axios, { AxiosRequestConfig } from 'axios';

export class HttpGetTool implements Tool {
  name = 'http_get';
  description = 'Perform HTTP GET request';
  category = 'network' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const url = params.url as string;
      const headers = params.headers as Record<string, string> | undefined;
      const timeout = params.timeout as number || 10000;
      
      if (!url) {
        return { success: false, error: 'url is required' };
      }

      const config: AxiosRequestConfig = {
        method: 'GET',
        url,
        timeout,
        headers: headers || {}
      };

      Logger.info('HTTP GET request', { url });
      
      const response = await axios(config);
      
      return {
        success: true,
        data: {
          url,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data
        }
      };
    } catch (error: any) {
      Logger.error('HTTP GET failed', { 
        error: error.message,
        url: params.url 
      });
      
      return {
        success: false,
        error: `HTTP GET failed: ${error.message}`,
        data: {
          url: params.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        }
      };
    }
  }
}

export class HttpPostTool implements Tool {
  name = 'http_post';
  description = 'Perform HTTP POST request';
  category = 'network' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const url = params.url as string;
      const data = params.data as any;
      const headers = params.headers as Record<string, string> | undefined;
      const timeout = params.timeout as number || 10000;
      
      if (!url) {
        return { success: false, error: 'url is required' };
      }

      const config: AxiosRequestConfig = {
        method: 'POST',
        url,
        data,
        timeout,
        headers: headers || {}
      };

      Logger.info('HTTP POST request', { url });
      
      const response = await axios(config);
      
      return {
        success: true,
        data: {
          url,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data
        }
      };
    } catch (error: any) {
      Logger.error('HTTP POST failed', { 
        error: error.message,
        url: params.url 
      });
      
      return {
        success: false,
        error: `HTTP POST failed: ${error.message}`,
        data: {
          url: params.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        }
      };
    }
  }
}

export class HttpPutTool implements Tool {
  name = 'http_put';
  description = 'Perform HTTP PUT request';
  category = 'network' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const url = params.url as string;
      const data = params.data as any;
      const headers = params.headers as Record<string, string> | undefined;
      const timeout = params.timeout as number || 10000;
      
      if (!url) {
        return { success: false, error: 'url is required' };
      }

      const config: AxiosRequestConfig = {
        method: 'PUT',
        url,
        data,
        timeout,
        headers: headers || {}
      };

      Logger.info('HTTP PUT request', { url });
      
      const response = await axios(config);
      
      return {
        success: true,
        data: {
          url,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data
        }
      };
    } catch (error: any) {
      Logger.error('HTTP PUT failed', { 
        error: error.message,
        url: params.url 
      });
      
      return {
        success: false,
        error: `HTTP PUT failed: ${error.message}`,
        data: {
          url: params.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        }
      };
    }
  }
}

export class HttpDeleteTool implements Tool {
  name = 'http_delete';
  description = 'Perform HTTP DELETE request';
  category = 'network' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const url = params.url as string;
      const headers = params.headers as Record<string, string> | undefined;
      const timeout = params.timeout as number || 10000;
      
      if (!url) {
        return { success: false, error: 'url is required' };
      }

      const config: AxiosRequestConfig = {
        method: 'DELETE',
        url,
        timeout,
        headers: headers || {}
      };

      Logger.info('HTTP DELETE request', { url });
      
      const response = await axios(config);
      
      return {
        success: true,
        data: {
          url,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data
        }
      };
    } catch (error: any) {
      Logger.error('HTTP DELETE failed', { 
        error: error.message,
        url: params.url 
      });
      
      return {
        success: false,
        error: `HTTP DELETE failed: ${error.message}`,
        data: {
          url: params.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        }
      };
    }
  }
}

export class HttpPatchTool implements Tool {
  name = 'http_patch';
  description = 'Perform HTTP PATCH request';
  category = 'network' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const url = params.url as string;
      const data = params.data as any;
      const headers = params.headers as Record<string, string> | undefined;
      const timeout = params.timeout as number || 10000;
      
      if (!url) {
        return { success: false, error: 'url is required' };
      }

      const config: AxiosRequestConfig = {
        method: 'PATCH',
        url,
        data,
        timeout,
        headers: headers || {}
      };

      Logger.info('HTTP PATCH request', { url });
      
      const response = await axios(config);
      
      return {
        success: true,
        data: {
          url,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          data: response.data
        }
      };
    } catch (error: any) {
      Logger.error('HTTP PATCH failed', { 
        error: error.message,
        url: params.url 
      });
      
      return {
        success: false,
        error: `HTTP PATCH failed: ${error.message}`,
        data: {
          url: params.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        }
      };
    }
  }
}

export class WebFetchTool implements Tool {
  name = 'web_fetch';
  description = 'Fetch and parse web page content';
  category = 'network' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const url = params.url as string;
      const timeout = params.timeout as number || 10000;
      
      if (!url) {
        return { success: false, error: 'url is required' };
      }

      const config: AxiosRequestConfig = {
        method: 'GET',
        url,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      };

      Logger.info('Web fetch', { url });
      
      const response = await axios(config);
      
      const html = response.data;
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';
      
      const textContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        success: true,
        data: {
          url,
          title,
          content: textContent.substring(0, 10000),
          status: response.status
        }
      };
    } catch (error: any) {
      Logger.error('Web fetch failed', { 
        error: error.message,
        url: params.url 
      });
      
      return {
        success: false,
        error: `Web fetch failed: ${error.message}`
      };
    }
  }
}

export class JsonParseTool implements Tool {
  name = 'json_parse';
  description = 'Parse JSON string to object';
  category = 'network' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const jsonString = params.jsonString as string;
      
      if (!jsonString) {
        return { success: false, error: 'jsonString is required' };
      }

      const parsed = JSON.parse(jsonString);
      
      return {
        success: true,
        data: {
          parsed,
          valid: true
        }
      };
    } catch (error) {
      Logger.error('JSON parse failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to parse JSON: ${(error as Error).message}`
      };
    }
  }
}

export class JsonStringifyTool implements Tool {
  name = 'json_stringify';
  description = 'Convert object to JSON string';
  category = 'network' as const;

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    try {
      const obj = params.obj as any;
      const pretty = params.pretty as boolean || false;
      
      if (obj === undefined) {
        return { success: false, error: 'obj is required' };
      }

      const jsonString = pretty 
        ? JSON.stringify(obj, null, 2)
        : JSON.stringify(obj);
      
      return {
        success: true,
        data: {
          jsonString,
          valid: true
        }
      };
    } catch (error) {
      Logger.error('JSON stringify failed', { error: (error as Error).message });
      return {
        success: false,
        error: `Failed to stringify JSON: ${(error as Error).message}`
      };
    }
  }
}
