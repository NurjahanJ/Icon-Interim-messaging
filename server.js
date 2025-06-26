const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Load environment variables from appropriate .env file based on environment
const dotenv = require('dotenv');

// First try to load from .env.production in production
if (process.env.NODE_ENV === 'production') {
  const productionEnvPath = path.resolve(process.cwd(), '.env.production');
  if (fs.existsSync(productionEnvPath)) {
    console.log('Loading environment from .env.production');
    dotenv.config({ path: productionEnvPath });
  }
}

// Then load from .env (will not override existing env vars)
dotenv.config();

// Set NODE_ENV to production by default if not set
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Log important environment variables (without sensitive values)
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`OPENAI_API_KEY configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`); // Don't log the actual key

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// API endpoint to proxy requests to OpenAI
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, modelId } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }
    
    // Use the provided model ID or default to gpt-4o
    const model = modelId || 'gpt-4o';
    
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not configured in environment variables');
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    console.log(`Making OpenAI API request with model: ${model}`);
    
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
    
    console.log('OpenAI API request successful');
    return res.json(response.data);
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response?.data || error.message);
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
    
    return res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error?.message || 'Failed to get a response from OpenAI' 
    });
  }
});

// Serve static files in production
const buildPath = path.join(__dirname, 'build');
const indexPath = path.join(buildPath, 'index.html');

// List build directory contents to help with debugging
if (fs.existsSync(buildPath)) {
  console.log('Build directory found at:', buildPath);
  try {
    const buildFiles = fs.readdirSync(buildPath);
    console.log('Build directory contents:', buildFiles);
    
    // Check for index.html specifically
    if (fs.existsSync(indexPath)) {
      console.log('index.html exists in build directory');
    } else {
      console.error('index.html NOT found in build directory');
    }
  } catch (err) {
    console.error('Error reading build directory:', err);
  }
  
  // Serve static files with proper caching headers
  app.use(express.static(buildPath, {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        // No cache for HTML files
        res.setHeader('Cache-Control', 'no-cache');
      } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
        // Cache for 1 week
        res.setHeader('Cache-Control', 'public, max-age=604800');
      }
    }
  }));
  
  // For all other routes, serve the React app
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      console.log(`404 for API route: ${req.path}`);
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    if (fs.existsSync(indexPath)) {
      console.log(`Serving index.html for path: ${req.path}`);
      res.sendFile(indexPath);
    } else {
      console.error('Error: index.html not found at:', indexPath);
      res.status(500).send('Server Error: index.html not found. Please check the build process.');
    }
  });
} else {
  console.error('Error: Build directory not found at:', buildPath);
  console.error('Current directory:', __dirname);
  console.error('Directory contents:', fs.readdirSync(__dirname));
}

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
  console.log(`Access the app at http://localhost:${port}`);
});
