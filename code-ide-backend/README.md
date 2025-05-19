# Code IDE Backend

A Node.js + Express backend service that executes code in Docker containers.

## Features

- Executes code in isolated Docker containers
- Supports multiple programming languages:
  - Python (using python:3.10 Docker image)
  - JavaScript (using node:18 Docker image)
  - Java (using openjdk:17 Docker image)
- Secure code execution with timeouts and container cleanup
- Auto deletion of temporary files
- CORS enabled for frontend integration

## Prerequisites

- Node.js 14+
- Docker

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd code-ide-backend

# Install dependencies
npm install
```

## Configuration

No additional configuration needed. The server runs on port 5000 by default.

## Usage

### Start the server

```bash
npm start
```

### Development mode with auto-restart

```bash
npm run dev
```

## API Endpoints

### Execute Code

```
POST /run
```

Request body:

```json
{
  "language": "python", // or "javascript" or "java"
  "code": "print('Hello, World!')"
}
```

Response:

```json
{
  "success": true,
  "output": "Hello, World!\n"
}
```

## Docker Integration

The backend uses Docker to run code in isolated containers. Each language uses a specific Docker image:

- Python: `python:3.10`
- JavaScript: `node:18`
- Java: `openjdk:17`

The code is temporarily stored in a file and mounted into the container using `-v` flag. The container is removed after execution using the `--rm` flag.

## Security

- All code runs in isolated Docker containers
- Execution timeout of 5 seconds to prevent infinite loops
- Temporary files are deleted after execution
- Input validation to prevent malicious requests
