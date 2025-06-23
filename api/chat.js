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
    console.error('Error calling OpenAI API:', error.response?.data || error.message);
    
    return res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error?.message || 'Failed to get a response from OpenAI' 
    });
  }
};
