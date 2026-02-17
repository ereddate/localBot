/**
 * API控制器基类
 */
import { Request, Response } from 'express';
import { ApiResponseFactory } from './ApiResponse';
import { StandardRequest } from './ApiMiddleware';

export abstract class BaseController {
  /**
   * 发送成功响应
   */
  protected sendSuccess<T>(res: Response, data?: T, message: string = 'Success', requestId?: string) {
    return res.status(200).json(ApiResponseFactory.success(data, message, requestId));
  }

  /**
   * 发送错误响应
   */
  protected sendError(res: Response, message: string, code: number = 400, details?: string, requestId?: string) {
    return res.status(code).json(ApiResponseFactory.error(message, code, details, requestId));
  }

  /**
   * 发送404响应
   */
  protected sendNotFound(res: Response, message: string = 'Resource not found', requestId?: string) {
    return res.status(404).json(ApiResponseFactory.notFound(message, requestId));
  }

  /**
   * 发送401响应
   */
  protected sendUnauthorized(res: Response, message: string = 'Unauthorized', requestId?: string) {
    return res.status(401).json(ApiResponseFactory.unauthorized(message, requestId));
  }

  /**
   * 发送403响应
   */
  protected sendForbidden(res: Response, message: string = 'Forbidden', requestId?: string) {
    return res.status(403).json(ApiResponseFactory.forbidden(message, requestId));
  }

  /**
   * 发送500响应
   */
  protected sendInternalServerError(res: Response, message: string = 'Internal server error', requestId?: string) {
    return res.status(500).json(ApiResponseFactory.internalError(message, requestId));
  }

  /**
   * 获取请求ID
   */
  protected getRequestId(req: StandardRequest): string {
    return req.requestId;
  }

  /**
   * 从请求中获取数据并验证
   */
  protected validateAndExtract(req: Request, requiredFields: string[]): { valid: boolean; errors: string[]; data?: any } {
    const errors: string[] = [];
    
    for (const field of requiredFields) {
      if (!(field in req.body) || req.body[field] === undefined || req.body[field] === null) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    if (errors.length > 0) {
      return { valid: false, errors };
    }
    
    return { valid: true, errors: [], data: req.body };
  }
}