const express = require('express');
const axios = require('axios');
const path = require('path');

// Load environment variables from .env file
const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  console.error('Error loading .env file:', result.error);
}

console.log('Environment loaded, checking for API key...');
console.log('API Key exists:', !!process.env.OPENAI_API_KEY);
// Don't log the full key for security, just the first few chars to verify format
if (process.env.OPENAI_API_KEY) {
  console.log('API Key format check:', process.env.OPENAI_API_KEY.substring(0, 7) + '...');
}

const app = express();
// Use port 3000 for both frontend and backend
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to proxy requests to OpenAI
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    const apiKey = process.env.OPENAI_API_KEY;
    console.log('API request received, API key exists:', !!apiKey);
    
    if (!apiKey) {
      console.error('API key is missing in the request');
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract the assistant's response
    const assistantMessage = response.data.choices[0].message.content;
    
    return res.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response?.data || error.message);
    console.error('Full error details:', error);
    
    return res.status(500).json({ 
      error: error.response?.data?.error?.message || 'Failed to get a response from OpenAI' 
    });
  }
});

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app except for API routes
app.get('*', function(req, res, next) {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

console.log('Serving both API and React frontend on the same port');

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Access the app at http://localhost:${port}`);
});
