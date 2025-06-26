// Simple test script for the API endpoint
const http = require('http');
const apiHandler = require('./api/chat');

console.log('Starting API test server...');
console.log('Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('- API Key present:', !!process.env.OPENAI_API_KEY);

// Create a simple server to test the API endpoint
const server = http.createServer((req, res) => {
  if (req.url === '/api/chat' && (req.method === 'POST' || req.method === 'OPTIONS')) {
    console.log(`Received ${req.method} request to /api/chat`);
    
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
      res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
      res.statusCode = 200;
      res.end();
      return;
    }
    
    // Parse request body for POST requests
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        console.log('Parsing request body...');
        req.body = JSON.parse(body);
        console.log('Request body parsed successfully');
        console.log('Messages count:', req.body.messages?.length || 0);
        
        // Call the API handler
        console.log('Calling API handler...');
        apiHandler(req, res);
      } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError.message
        }));
      }
    });
  } else {
    console.log(`Received ${req.method} request to ${req.url} (not handled)`);
    res.statusCode = 404;
    res.end('Not found');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log('To test the API, send a POST request to http://localhost:3001/api/chat');
  console.log('Example with curl:');
  console.log('curl -X POST -H "Content-Type: application/json" -d \'{"messages":[{"role":"user","content":"Hello"}]}\' http://localhost:3001/api/chat');
  console.log('\nPress Ctrl+C to stop the server');
});
