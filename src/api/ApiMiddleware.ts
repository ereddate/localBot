/**
 * API中间件 - 处理统一的请求和响应格式
 */
import express, { Request, Response, NextFunction } from 'express';
import { ApiResponseFactory } from './ApiResponse';
import { Logger } from '../utils/Logger';

export interface StandardRequest extends Request {
  requestId: string;
}

export class ApiMiddleware {
  /**
   * 生成请求ID
   */
  private static generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 请求ID中间件
   */
  static requestId(req: Request, res: Response, next: NextFunction) {
    const standardReq = req as StandardRequest;
    standardReq.requestId = ApiMiddleware.generateRequestId();
    res.setHeader('X-Request-ID', standardReq.requestId);
    next();
  }

  /**
   * CORS中间件
   */
  static cors(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Request-ID');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  }

  /**
   * 日志中间件
   */
  static logger(req: Request, res: Response, next: NextFunction) {
    const standardReq = req as StandardRequest;
    const startTime = Date.now();
    
    Logger.info('API Request', {
      requestId: standardReq.requestId,
      method: (req.method as string),
      url: (req.url as string),
      ip: (req.ip as string) || '',
      userAgent: req.get('User-Agent') || ''
    });
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      Logger.info('API Response', {
        requestId: standardReq.requestId,
        method: (req.method as string),
        url: (req.url as string),
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });
    });
    
    next();
  }

  /**
   * 错误处理中间件
   */
  static errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const standardReq = req as StandardRequest;
    Logger.error('API Error', {
      error: err.message || err,
      stack: err.stack,
      requestId: standardReq.requestId,
      method: (req.method as string),
      url: (req.url as string)
    });
    
    res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      timestamp: Date.now(),
      requestId: standardReq.requestId
    });
  }

  /**
   * 创建Express应用并设置中间件
   */
  static createApp(): express.Application {
    const app: express.Application = express();
    
    // JSON解析中间件
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // 应用自定义中间件
    app.use(ApiMiddleware.requestId);
    app.use(ApiMiddleware.cors);
    app.use(ApiMiddleware.logger);
    app.use(ApiMiddleware.errorHandler);

    return app;
  }
}