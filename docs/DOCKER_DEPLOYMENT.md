# LocalBot Docker and Cloud Deployment Guide

This guide explains how to deploy LocalBot using Docker containers and in cloud environments.

## Prerequisites

Before deploying LocalBot, ensure you have:

- Docker and Docker Compose installed (for containerized deployment)
- Node.js 18+ (for local development/testing)
- At least 4GB RAM available
- Appropriate API keys for your preferred AI provider (OpenAI, Baidu, Alibaba, etc.)

## Quick Start with Docker

### 1. Build and run with Docker

```bash
# Build the Docker image
docker build -t localbot .

# Run the container
docker run -p 3000:3000 \
  -v ./memory:/app/memory \
  -v ./sessions:/app/sessions \
  -v ./skills:/app/skills \
  -e OPENAI_API_KEY=your_openai_api_key \
  localbot
```

### 2. Use Docker Compose (Recommended)

Create a `.env` file with your configuration:

```env
OPENAI_API_KEY=your_openai_api_key
LLM_PROVIDER=openai
PORT=3000
LOG_LEVEL=info
ENABLE_PERSISTENCE=true
```

Then run:

```bash
# Start the service
docker-compose up -d

# Check the logs
docker-compose logs -f

# Stop the service
docker-compose down
```

## Cloud Deployment Options

### AWS Deployment

1. Push your Docker image to Amazon ECR:
```bash
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account.dkr.ecr.your-region.amazonaws.com
docker tag localbot:latest your-account.dkr.ecr.your-region.amazonaws.com/localbot:latest
docker push your-account.dkr.ecr.your-region.amazonaws.com/localbot:latest
```

2. Deploy to ECS or EKS using the pushed image.

### Azure Deployment

Deploy to Azure Container Instances or AKS:

```bash
az container create \
  --resource-group your-resource-group \
  --name localbot \
  --image your-registry/localbot:latest \
  --dns-name-label your-dns-label \
  --ports 3000 \
  --environment-variables OPENAI_API_KEY=your-key
```

### Google Cloud Platform

Deploy to Google Kubernetes Engine or Cloud Run:

```bash
gcloud run deploy localbot \
  --image gcr.io/your-project/localbot:latest \
  --platform managed \
  --port 3000 \
  --set-env-vars OPENAI_API_KEY=your-key \
  --allow-unauthenticated
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `ALIYUN_API_KEY` | Alibaba Cloud API key | - |
| `BAIDU_API_KEY` | Baidu ERNIE Bot API key | - |
| `BAIDU_SECRET_KEY` | Baidu ERNIE Bot Secret key | - |
| `TENCENT_API_KEY` | Tencent HunYuan API key | - |
| `ZHIPU_API_KEY` | Zhipu ChatGLM API key | - |
| `SILICONCLOUD_API_KEY` | SiliconCloud API key | - |
| `OLLAMA_API_URL` | Ollama API URL | `http://localhost:11434` |
| `OLLAMA_MODEL_NAME` | Ollama model name | `llama3.2` |
| `USE_GPU` | Enable GPU acceleration | `false` |
| `LOG_LEVEL` | Logging level | `info` |
| `MEMORY_DIR` | Memory storage directory | `./memory` |
| `SKILLS_DIR` | Skills directory | `./skills` |
| `ENABLE_PERSISTENCE` | Enable session persistence | `true` |
| `PERSISTENCE_DIR` | Session persistence directory | `./sessions` |

### Volume Mounts

Mount these volumes to persist data:

- `/app/memory`: For storing memory files
- `/app/sessions`: For storing conversation sessions
- `/app/skills`: For custom skills (optional)

## Production Considerations

### Security

1. Never commit API keys to version control
2. Use secrets management (AWS Secrets Manager, Azure Key Vault, etc.)
3. Enable authentication for production deployments
4. Use HTTPS in production

### Scaling

LocalBot can be scaled horizontally in containerized environments:

1. Use external storage for sessions (Redis, PostgreSQL)
2. Implement load balancing
3. Monitor resource usage
4. Set up auto-scaling policies

### Monitoring

The health check endpoint is available at `/health` which returns:

```json
{
  "status": "healthy",
  "timestamp": "2023-12-01T10:00:00.000Z",
  "uptime": 3600.5,
  "version": "1.0.0"
}
```

## API Endpoints

Once deployed, LocalBot provides the following API endpoints:

- `POST /api/message` - Send a message and get a response
- `GET /api/session/:sessionId` - Get session information
- `GET /api/tools` - Get available tools list
- `GET /health` - Health check endpoint

### Example API Call

```bash
curl -X POST http://localhost:3000/api/message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "my-session-123",
    "userId": "user-123",
    "message": "Hello, how can you help me?"
  }'
```

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure mounted volumes have correct permissions
2. **API Keys**: Verify all required environment variables are set
3. **Port Conflicts**: Ensure port 3000 is available
4. **Memory**: Ensure sufficient memory allocation for container

### Logs

Check container logs with:
```bash
docker-compose logs -f localbot
```

## Updating

To update to a new version:

```bash
# Pull latest code
git pull origin main

# Rebuild the image
docker-compose build

# Restart the service
docker-compose up -d
```