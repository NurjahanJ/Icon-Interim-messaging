// Serverless function for OpenAI chat API
const axios = require('axios');

// Log to help with debugging
console.log('Serverless function api/chat.js is being executed');

// More detailed environment logging
const envInfo = {
  nodeEnv: process.env.NODE_ENV,
  hasApiKey: !!process.env.OPENAI_API_KEY,
  vercelEnv: process.env.VERCEL_ENV,
  vercelRegion: process.env.VERCEL_REGION,
  isVercel: !!process.env.VERCEL,
  vercelUrl: process.env.VERCEL_URL || 'not set'
};

console.log('Environment variables check:', envInfo);

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
    // Log request details for debugging (without sensitive info)
    console.log('Request received:', {
      method: req.method,
      url: req.url,
      hasBody: !!req.body,
      contentType: req.headers['content-type']
    });
    
    const { messages, modelId } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('Invalid request: Missing or invalid messages array');
      return res.status(400).json({ error: 'Valid messages array is required' });
    }
    
    // Use the provided model ID or default to gpt-4o
    const model = modelId || 'gpt-4o';
    console.log(`Using model: ${model}`);
    
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('API key not configured in environment variables');
      return res.status(500).json({ 
        error: 'API key not configured',
        details: 'The OpenAI API key is missing from environment variables. Please check Vercel environment configuration.'
      });
    }
    
    // Call OpenAI API with improved error handling
    console.log('Sending request to OpenAI API...');
    try {
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
      
      // Log successful response (without sensitive data)
      console.log('OpenAI API response received:', {
        status: response.status,
        hasChoices: !!response.data.choices,
        choicesLength: response.data.choices?.length || 0,
        model: response.data.model,
        usage: response.data.usage
      });
      
      return res.json(response.data);
    } catch (apiError) {
      // Handle API-specific errors separately for better diagnostics
      console.error('Error in OpenAI API call:', {
        message: apiError.message,
        status: apiError.response?.status,
        data: apiError.response?.data
      });
      
      throw apiError; // Let the outer catch block handle the response
    }
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

