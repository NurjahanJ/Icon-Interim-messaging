const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

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
    
    if (!apiKey) {
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
    
    return res.status(500).json({ 
      error: error.response?.data?.error?.message || 'Failed to get a response from OpenAI' 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
