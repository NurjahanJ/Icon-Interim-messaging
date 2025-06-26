// Serverless function for OpenAI chat API
const axios = require('axios');

// This function will be executed when the endpoint is called
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, modelId } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }
    
    // Use the provided model ID or default to gpt-4o
    const model = modelId || 'gpt-4o';
    
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return res.json(response.data);
  } catch (error) {
    // Enhanced error logging (combined from both branches)
    console.error('Error calling OpenAI API:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      stack: error.stack
    });
    
    // Additional detailed logging from sustainability-ui branch
    if (error.response?.data) {
      console.error('Full error response:', JSON.stringify(error.response.data));
    }
    
    if (error.config) {
      console.error('Request URL:', error.config.url);
      // Log request headers without the Authorization header
      const safeHeaders = { ...error.config.headers };
      if (safeHeaders.Authorization) safeHeaders.Authorization = '[REDACTED]';
      console.error('Request headers:', safeHeaders);
    }
    
    // Check for specific error types
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Authentication error: Invalid API key or unauthorized access',
        details: error.response?.data?.error?.message
      });
    } else if (error.response?.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded: Too many requests to OpenAI API',
        details: error.response?.data?.error?.message
      });
    } else if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'Configuration error: OpenAI API key is not set in environment variables'
      });
    } else {
      return res.status(error.response?.status || 500).json({ 
        error: error.response?.data?.error?.message || 'Failed to get a response from OpenAI',
        details: 'Check server logs for more information'
      });
    }
  }
};

