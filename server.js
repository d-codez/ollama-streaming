const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const session = require('express-session');
const fs = require('fs');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 12 * 60 * 60 * 1000 }, // 12 hours
  })
);

const loadHistory = (userId) => {
  const filePath = `./history/${userId}.json`;
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading history file:', error);
      return [];
    }
  }
  return [];
};

const saveHistory = (userId, history) => {
  const filePath = `./history/${userId}.json`;
  try {
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error writing history file:', error);
  }
};

wss.on('connection', (ws, req) => {
  console.log('Client connected');

  const userId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('userId');
  if (!userId) {
    ws.send(JSON.stringify({ error: 'User ID is required' }));
    ws.close();
    return;
  }

  const conversationHistory = loadHistory(userId);

  ws.on('message', (message) => {
    const { model, prompt } = JSON.parse(message);
    let concatenatedResponse = '';

    const fullPrompt = createPrompt(conversationHistory, prompt);

    const options = {
      hostname: 'localhost',
      port: 11434,
      path: '/api/generate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      res.on('data', (chunk) => {
        const jsonObject = JSON.parse(chunk);
        concatenatedResponse += jsonObject.response;
        ws.send(JSON.stringify(jsonObject));

        if (jsonObject.done) {
          conversationHistory.push({ role: 'assistant', content: concatenatedResponse.trim() });
          saveHistory(userId, conversationHistory);
        }
      });

      res.on('end', () => {
        ws.send(
          JSON.stringify({
            model,
            created_at: new Date().toISOString(),
            response: '',
            done: true,
          })
        );
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      ws.send(JSON.stringify({ error: e.message }));
    });

    conversationHistory.push({ role: 'user', content: prompt });
    saveHistory(userId, conversationHistory);

    req.write(JSON.stringify({ model, prompt: fullPrompt }));
    req.end();
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const createPrompt = (history, userPrompt) => {
  let prompt = '';
  history.forEach((msg) => {
    prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
  });
  prompt += `User: ${userPrompt}\nAssistant:`;
  return prompt;
};

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
