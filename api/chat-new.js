// Vercel Serverless Function for OpenAI Chat API
const axios = require('axios');

// This function will be executed when the endpoint is called
module.exports = async (req, res) => {
  // Set CORS headers for all responses
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

  // Log basic request info (without sensitive data)
  console.log(`API request received: ${req.method} ${req.url}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`API Key present: ${!!process.env.OPENAI_API_KEY}`);

  try {
    // Validate request body
    const { messages, modelId } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log('Error: Invalid messages array');
      return res.status(400).json({ error: 'Valid messages array is required' });
    }
    
    // Use the provided model ID or default to gpt-4o
    const model = modelId || 'gpt-4o';
    
    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.log('Error: OpenAI API key is missing');
      return res.status(500).json({ 
        error: 'API key not configured',
        details: 'The OpenAI API key is missing from environment variables'
      });
    }
    
    // Call OpenAI API
    console.log(`Calling OpenAI API with model: ${model}`);
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
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    console.log('OpenAI API response received successfully');
    return res.status(200).json(response.data);
    
  } catch (error) {
    // Handle errors
    console.error('Error in API call:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Return appropriate error response
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Authentication error: Invalid API key',
        details: error.response?.data?.error?.message || 'Check your OpenAI API key'
      });
    } else if (error.response?.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded: Too many requests',
        details: error.response?.data?.error?.message || 'Try again later'
      });
    } else {
      return res.status(error.response?.status || 500).json({ 
        error: error.response?.data?.error?.message || 'Failed to get a response from OpenAI',
        details: 'Check server logs for more information'
      });
    }
  }
};
