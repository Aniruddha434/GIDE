const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config(); // For loading .env variables
const { GoogleGenerativeAI } = require("@google/generative-ai");
const WebSocket = require('ws'); // Add WebSocket library
const http = require('http'); // Required to share port with Express

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Create temp directory if not exists
const tempDir = path.join(__dirname, 'temp');
fs.ensureDirSync(tempDir);

// Clean up temp files on startup
fs.emptyDirSync(tempDir);

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); // Or your preferred model

// Helper to get the file extension based on language
const getFileExtension = (lang) => {
  switch (lang.toLowerCase()) {
    case 'python':
      return '.py';
    case 'javascript':
      return '.js';
    case 'java':
      return '.java';
    default:
      console.error(`Unsupported language: ${lang}`);
      return '.txt'; // Default or error case
  }
};

// Helper to get the Docker container based on language
const getDockerImage = (lang) => {
  switch (lang.toLowerCase()) {
    case 'python':
      return 'python:3.10';
    case 'javascript':
      return 'node:18';
    case 'java':
      return 'openjdk:17';
    default:
      console.error(`Unsupported language for Docker image: ${lang}`);
      return 'alpine'; // A small default image, or handle error
  }
};

// Helper to get the execution command based on language
const getExecutionCommand = (lang, filename) => {
  const baseFilename = path.basename(filename);
  switch (lang.toLowerCase()) {
    case 'python':
      return ['python', `/code/${baseFilename}`]; // Return as array for spawn
    case 'javascript':
      return ['node', `/code/${baseFilename}`]; // Return as array for spawn
    case 'java':
      const className = baseFilename.replace('.java', '');
      // For Java, spawn needs to handle multi-step commands differently.
      // We might need a shell, or run them sequentially.
      // For now, this is a placeholder; complex Java execution will need refinement.
      return ['sh', '-c', `cd /code && javac ${baseFilename} && java ${className}`];
    default:
      console.error(`Unsupported language for command: ${lang}`);
      return ['echo', `Unsupported language: ${lang}`];
  }
};

// Create HTTP server and integrate Express app
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server }); // Attach to the same HTTP server

console.log('WebSocket server initialized');

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');
  let childProcess = null; // Store the child process reference here
  let tempFileDetails = {}; // To store { fullPath, baseName } for cleanup

  ws.on('message', async (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Received WebSocket message:', parsedMessage);

      if (parsedMessage.type === 'execute') {
        if (childProcess) {
          ws.send(JSON.stringify({ type: 'error', output: 'A process is already running. Please wait or stop it.' }));
          return;
        }

        const { code, language, filename: clientFilename } = parsedMessage;
        if (!code || !language) {
          ws.send(JSON.stringify({ type: 'error', output: 'Code and language are required for execution.' }));
          return;
        }

        ws.send(JSON.stringify({ type: 'status', output: 'Received code. Preparing to execute...' }));

        let effectiveBaseFilename;
        if (language.toLowerCase() === 'java' && clientFilename) {
            effectiveBaseFilename = clientFilename.endsWith('.java') ? clientFilename : `${clientFilename}.java`;
        } else {
            const fileId = uuidv4();
            const fileExt = getFileExtension(language);
            effectiveBaseFilename = `${fileId}${fileExt}`;
        }
        
        const fullPathForFile = path.join(tempDir, effectiveBaseFilename);
        await fs.writeFile(fullPathForFile, code);
        tempFileDetails = { fullPath: fullPathForFile, baseName: effectiveBaseFilename };

        ws.send(JSON.stringify({ type: 'status', output: `Temporary file ${tempFileDetails.baseName} created.` }));

        const dockerImage = getDockerImage(language);
        // Pass the baseName to getExecutionCommand, it will derive classname for Java if needed.
        const [command, ...args] = getExecutionCommand(language, tempFileDetails.baseName);
        const dockerArgs = ['run', '--rm', '-i', '-v', `${tempDir}:/code`, dockerImage, command, ...args];

        ws.send(JSON.stringify({ type: 'status', output: `Spawning Docker process: docker ${dockerArgs.join(' ')}` }));

        childProcess = spawn('docker', dockerArgs);

        childProcess.stdout.on('data', (data) => {
          ws.send(JSON.stringify({ type: 'stdout', output: data.toString() }));
        });

        childProcess.stderr.on('data', (data) => {
          ws.send(JSON.stringify({ type: 'stderr', output: data.toString() }));
        });

        childProcess.on('close', (exitCode) => {
          ws.send(JSON.stringify({ type: 'status', output: `Execution finished with code ${exitCode}.` }));
          if (tempFileDetails.fullPath && fs.existsSync(tempFileDetails.fullPath)) {
            fs.removeSync(tempFileDetails.fullPath);
            ws.send(JSON.stringify({ type: 'status', output: `Temporary file ${tempFileDetails.baseName} deleted.` }));
          }
          childProcess = null; 
          tempFileDetails = {}; 
        });

        childProcess.on('error', (err) => {
          console.error('Failed to start subprocess.', err);
          ws.send(JSON.stringify({ type: 'error', output: `Failed to start execution: ${err.message}` }));
          if (tempFileDetails.fullPath && fs.existsSync(tempFileDetails.fullPath)) {
            fs.removeSync(tempFileDetails.fullPath);
          }
          childProcess = null;
          tempFileDetails = {};
        });

      } else if (parsedMessage.type === 'stdin') {
        if (childProcess && childProcess.stdin && !childProcess.stdin.destroyed) {
          childProcess.stdin.write(parsedMessage.data + '\n');
        } else {
          ws.send(JSON.stringify({ type: 'error', output: 'No active process to send input to, or stdin is not writable.' }));
        }
      } else {
        ws.send(JSON.stringify({ type: 'error', output: 'Unknown message type received.' }));
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
      ws.send(JSON.stringify({ type: 'error', output: `Server error: ${error.message}` }));
      // General cleanup if an error occurs during message processing
      if (childProcess && !childProcess.killed) {
        childProcess.kill();
      }
      if (tempFileDetails.fullPath && fs.existsSync(tempFileDetails.fullPath)) {
        fs.removeSync(tempFileDetails.fullPath);
      }
      childProcess = null;
      tempFileDetails = {};
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected.');
    if (childProcess && !childProcess.killed) {
      console.log('Killing child process due to client disconnect.');
      childProcess.kill();
    }
    if (tempFileDetails.fullPath && fs.existsSync(tempFileDetails.fullPath)) {
      console.log(`Cleaning up temp file ${tempFileDetails.baseName} due to client disconnect.`);
      fs.removeSync(tempFileDetails.fullPath);
    }
    childProcess = null;
    tempFileDetails = {};
  });

  ws.send(JSON.stringify({ type: 'status', output: 'WebSocket connection established. Ready for code.' }));
});

// Modified Run code endpoint (for now, it can be a simple ACK or phase out)
app.post('/run', async (req, res) => {
  console.log('/run endpoint hit, but primary execution is now via WebSocket.');
  // For now, we'll just acknowledge. Frontend should switch to WebSocket.
  res.json({ 
    success: true, 
    output: 'Please use WebSocket for interactive code execution.',
    webSocketInfo: {
        url: `ws://localhost:${PORT}` // Inform client about WebSocket URL
    }
  });
});

// New endpoint for AI hints
app.post('/api/get-gemini-hint', async (req, res) => {
  const { code, language, errorOutput, hintType } = req.body; // hintType can be 'explain' or 'debug'

  if (!code || !language || !hintType) {
    return res.status(400).json({
      success: false,
      hint: 'Code, language, and hint type are required.'
    });
  }

  let prompt = '';

  if (hintType === 'debug' && errorOutput) {
    prompt = `
      The following ${language} code produced an error:
      --- CODE ---
      ${code}
      --- ERROR ---
      ${errorOutput}
      ---
      Please explain the error and suggest a fix.
      Keep your explanation concise and suitable for a beginner.
      If you suggest a code change, provide only the corrected code block.
    `;
  } else if (hintType === 'explain') {
    prompt = `
      Please explain the following ${language} code:
      --- CODE ---
      ${code}
      ---
      Keep your explanation concise and suitable for a beginner.
      Focus on the core concepts.
    `;
  } else {
    return res.status(400).json({
      success: false,
      hint: 'Invalid hint type. Must be "explain" or "debug".'
    });
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({ success: true, hint: text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ 
      success: false, 
      hint: 'Sorry, I encountered an error trying to get a hint from the AI. Please check the backend logs.' 
    });
  }
});

// Add static file serving and SPA fallback for frontend
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
}); 