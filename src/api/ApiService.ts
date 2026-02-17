/**
 * 统一API服务
 */
import express, { Request, Response } from 'express';
import { ApiMiddleware, StandardRequest } from './ApiMiddleware';
import { Gateway } from '../gateway/Gateway';
import { Logger } from '../utils/Logger';

export class ApiService {
  private app: express.Application;
  private gateway: Gateway;
  private port: number;

  constructor(port: number = 3000) {
    this.port = port;
    this.app = ApiMiddleware.createApp();
    this.gateway = new Gateway();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // 健康检查端点
    this.app.get('/health', (req: Request, res: Response) => {
      const standardReq = req as StandardRequest;
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] as string || standardReq.requestId
      });
    });

    // 消息处理端点
    this.app.post('/api/v1/message', async (req: Request, res: Response) => {
      const standardReq = req as StandardRequest;
      try {
        const { sessionId, content } = req.body;
        
        if (!sessionId || !content) {
          return res.status(400).json({
            code: 400,
            message: 'sessionId and content are required',
            timestamp: Date.now(),
            requestId: standardReq.requestId
          });
        }

        const result = await this.gateway.processMessageWithStandardResponse(
          sessionId, 
          content, 
          standardReq.requestId
        );
        
        res.status(result.code).json(result);
      } catch (error) {
        Logger.error('Error in /api/v1/message endpoint', { 
          error: (error as Error).message, 
          requestId: standardReq.requestId 
        });
        
        res.status(500).json({
          code: 500,
          message: 'Internal server error',
          timestamp: Date.now(),
          requestId: standardReq.requestId
        });
      }
    });

    // 会话管理端点
    this.app.get('/api/v1/session/:sessionId', (req: Request, res: Response) => {
      const standardReq = req as StandardRequest;
      const { sessionId } = req.params as { sessionId: string };
      const result = this.gateway.getSessionWithStandardResponse(
        sessionId, 
        standardReq.requestId
      );
      
      res.status(result.code).json(result);
    });

    // 获取所有会话
    this.app.get('/api/v1/sessions', async (req: Request, res: Response) => {
      const standardReq = req as StandardRequest;
      try {
        const result = await this.gateway.getAllSessionsWithStandardResponse(
          standardReq.requestId
        );
        
        res.status(result.code).json(result);
      } catch (error) {
        Logger.error('Error in /api/v1/sessions endpoint', { 
          error: (error as Error).message, 
          requestId: standardReq.requestId 
        });
        
        res.status(500).json({
          code: 500,
          message: 'Internal server error',
          timestamp: Date.now(),
          requestId: standardReq.requestId
        });
      }
    });

    // 关闭会话端点
    this.app.delete('/api/v1/session/:sessionId', async (req: Request, res: Response) => {
      const standardReq = req as StandardRequest;
      const { sessionId } = req.params as { sessionId: string };
      
      try {
        const result = await this.gateway.closeSessionWithStandardResponse(
          sessionId, 
          standardReq.requestId
        );
        
        res.status(result.code).json(result);
      } catch (error) {
        Logger.error('Error in /api/v1/session/:sessionId DELETE endpoint', { 
          error: (error as Error).message, 
          requestId: standardReq.requestId 
        });
        
        res.status(500).json({
          code: 500,
          message: 'Internal server error',
          timestamp: Date.now(),
          requestId: standardReq.requestId
        });
      }
    });

    // 工具执行端点
    this.app.post('/api/v1/tool/:toolName', async (req: Request, res: Response) => {
      const standardReq = req as StandardRequest;
      try {
        const { toolName } = req.params as { toolName: string };
        const params = req.body;
        
        // 注意：这里只是一个框架，实际实现需要访问工具实例
        // 在当前架构中，工具执行通常通过工作流完成
        
        res.status(405).json({
          code: 405,
          message: 'Direct tool execution endpoint not implemented in this version',
          timestamp: Date.now(),
          requestId: standardReq.requestId
        });
      } catch (error) {
        Logger.error('Error in /api/v1/tool endpoint', { 
          error: (error as Error).message, 
          requestId: standardReq.requestId 
        });
        
        res.status(500).json({
          code: 500,
          message: 'Internal server error',
          timestamp: Date.now(),
          requestId: standardReq.requestId
        });
      }
    });

    // 业务流程执行端点
    this.app.post('/api/v1/process/:processType', async (req: Request, res: Response) => {
      const standardReq = req as StandardRequest;
      try {
        const { processType } = req.params as { processType: string };
        const inputData = req.body;
        
        // 注意：这里只是一个框架，实际实现需要接入业务流程管理器
        // 需要根据processType执行相应的业务流程
        
        res.status(405).json({
          code: 405,
          message: 'Process execution endpoint not implemented in this version',
          timestamp: Date.now(),
          requestId: standardReq.requestId
        });
      } catch (error) {
        Logger.error('Error in /api/v1/process endpoint', { 
          error: (error as Error).message, 
          requestId: standardReq.requestId 
        });
        
        res.status(500).json({
          code: 500,
          message: 'Internal server error',
          timestamp: Date.now(),
          requestId: standardReq.requestId
        });
      }
    });
  }

  start(): void {
    this.app.listen(this.port, () => {
      Logger.info(`API Service listening on port ${this.port}`);
      console.log(`🚀 API Service running on http://localhost:${this.port}`);
      console.log(`📋 Available endpoints:`);
      console.log(`   GET  /health - Health check`);
      console.log(`   POST /api/v1/message - Process message`);
      console.log(`   GET  /api/v1/session/:sessionId - Get session`);
      console.log(`   GET  /api/v1/sessions - Get all sessions`);
      console.log(`   DELETE /api/v1/session/:sessionId - Close session`);
    });
  }

  getApp(): express.Application {
    return this.app;
  }
}