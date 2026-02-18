# LocalBot API Documentation

## API Specification

### Base URL
All API endpoints are prefixed with `/api/v1/` where `v1` represents the current version.

### Authentication
Most endpoints require authentication using a Bearer token:
```
Authorization: Bearer {token}
```

Some endpoints like health checks do not require authentication.

### Content Type
All requests and responses use `application/json` format with UTF-8 encoding.

## Response Format

### Success Response
```json
{
  "code": 200,
  "message": "Success message",
  "data": {},
  "timestamp": 1640995200000,
  "requestId": "unique-request-id"
}
```

### Error Response
```json
{
  "code": 400,
  "message": "Error message",
  "details": "Detailed error information (optional)",
  "timestamp": 1640995200000,
  "requestId": "unique-request-id"
}
```

## Available Endpoints

### Health Check
- **GET** `/health`
- No authentication required
- Returns service health status

### Message Processing
- **POST** `/api/v1/message`
- No authentication required
- Process user messages and return AI responses
- **Request Body**:
```json
{
  "sessionId": "string",
  "content": "string"
}
```

### Session Management
- **GET** `/api/v1/session/{sessionId}`
  - No authentication required
  - Retrieve specific session information

- **GET** `/api/v1/sessions`
  - No authentication required
  - Retrieve list of all sessions

- **DELETE** `/api/v1/session/{sessionId}`
  - No authentication required
  - Close specific session

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 422 | Validation Failed |
| 500 | Internal Server Error |

## Rate Limits
- Default rate limiting applied per IP address
- Customizable based on deployment configuration

## Security Considerations
- Input validation on all endpoints
- Output sanitization to prevent XSS
- Request size limits to prevent abuse