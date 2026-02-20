import express, { Request, Response } from 'express';
import { Gateway } from './gateway/Gateway';
import { SkillManager } from './skills/SkillManager';
import { MemorySystem } from './memory/MemorySystem';
import { SessionManager } from './session/SessionManager';
import { BusinessProcessManager } from './business-processes/BusinessProcessManager';
import { WorkflowEngine } from './tasks/WorkflowEngine';
import { ReverseControlEngine } from './engine/ReverseControlEngine';
import { ProactiveEngine } from './engine/ProactiveEngine';
import { DeepThinkingEngine } from './engine/DeepThinkingEngine';
import { PlatformManager } from './platforms/PlatformManager';
import { config } from './config';

// Create Express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS for cloud deployment
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Initialize core components
const memorySystem = new MemorySystem();
const skillManager = new SkillManager();
const sessionManager = new SessionManager();
const workflowEngine = new WorkflowEngine();
const businessProcessManager = new BusinessProcessManager(workflowEngine, skillManager);
const gateway = new Gateway(skillManager, memorySystem);

// Initialize engines
const reverseControlEngine = new ReverseControlEngine(
  config.reverseControl,
  skillManager,
  sessionManager
);

const proactiveEngine = new ProactiveEngine(
  config.proactiveEngine,
  sessionManager,
  businessProcessManager
);

const deepThinkingEngine = new DeepThinkingEngine(
  config.deepThinking,
  memorySystem
);

// Initialize platform manager
const platformManager = new PlatformManager();

// Initialize all components
async function initialize() {
  await reverseControlEngine.initialize();
  await proactiveEngine.initialize();
  await deepThinkingEngine.initialize();
  await platformManager.initialize(config.platforms);
  await platformManager.connect();
}

initialize().catch(console.error);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// API routes
app.post('/api/message', async (req: Request, res: Response) => {
  try {
    const { sessionId, message, userId } = req.body;
    
    if (!sessionId || !message) {
      return res.status(400).json({ 
        error: 'sessionId and message are required' 
      });
    }

    const response = await gateway.processMessage(sessionId, message);
    
    res.json({
      success: true,
      data: {
        response,
        sessionId
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Session management routes
app.get('/api/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const sessionId = typeof req.params.sessionId === 'string' ? req.params.sessionId : req.params.sessionId[0];
    const result = await gateway.getSessionWithStandardResponse(sessionId);
    
    if ('data' in result && result.data) {
      res.json(result);
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Get all available tools
app.get('/api/tools', (req: Request, res: Response) => {
  try {
    const tools = skillManager.getAllTools();
    res.json({
      success: true,
      data: {
        tools: tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          category: tool.category
          // Note: Parameters are not exposed in the Tool interface
        })),
        total: tools.length
      }
    });
  } catch (error) {
    console.error('Error getting tools:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Start server
const PORT = config.port || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`LocalBot server running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check available at: http://${HOST}:${PORT}/health`);
});