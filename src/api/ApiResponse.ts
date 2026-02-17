/**
 * 统一的API响应格式
 */
export interface ApiResponse<T = any> {
  /** 响应状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data?: T;
  /** 时间戳 */
  timestamp: number;
  /** 请求ID（可选） */
  requestId?: string;
}

/**
 * 标准错误响应
 */
export interface ApiErrorResponse {
  /** 错误状态码 */
  code: number;
  /** 错误消息 */
  message: string;
  /** 错误详情（可选） */
  details?: string;
  /** 时间戳 */
  timestamp: number;
  /** 请求ID（可选） */
  requestId?: string;
}

/**
 * API响应工厂类
 */
export class ApiResponseFactory {
  /**
   * 成功响应
   */
  static success<T>(data?: T, message: string = 'Success', requestId?: string): ApiResponse<T> {
    return {
      code: 200,
      message,
      data,
      timestamp: Date.now(),
      requestId
    };
  }

  /**
   * 错误响应
   */
  static error(message: string, code: number = 400, details?: string, requestId?: string): ApiErrorResponse {
    return {
      code,
      message,
      details,
      timestamp: Date.now(),
      requestId
    };
  }

  /**
   * 404响应
   */
  static notFound(message: string = 'Resource not found', requestId?: string): ApiErrorResponse {
    return {
      code: 404,
      message,
      timestamp: Date.now(),
      requestId
    };
  }

  /**
   * 500响应
   */
  static internalError(message: string = 'Internal server error', requestId?: string): ApiErrorResponse {
    return {
      code: 500,
      message,
      timestamp: Date.now(),
      requestId
    };
  }

  /**
   * 401响应
   */
  static unauthorized(message: string = 'Unauthorized', requestId?: string): ApiErrorResponse {
    return {
      code: 401,
      message,
      timestamp: Date.now(),
      requestId
    };
  }

  /**
   * 403响应
   */
  static forbidden(message: string = 'Forbidden', requestId?: string): ApiErrorResponse {
    return {
      code: 403,
      message,
      timestamp: Date.now(),
      requestId
    };
  }
}