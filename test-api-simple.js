// Simple test script for the API endpoint
const http = require('http');
const axios = require('axios');

// Create a simple server to test the API endpoint
const server = http.createServer(async (req, res) => {
  if (req.url === '/api/chat' && req.method === 'POST') {
    console.log('Received POST request to /api/chat');
    
    // Parse request body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        console.log('Request body:', data);
        
        // Check if OPENAI_API_KEY is set
        if (!process.env.OPENAI_API_KEY) {
          console.log('WARNING: OPENAI_API_KEY is not set');
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'API key not configured',
            message: 'The OpenAI API key is missing from environment variables'
          }));
          return;
        }
        
        // Call OpenAI API directly
        try {
          console.log('Calling OpenAI API...');
          const response = await axios({
            method: 'post',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            data: {
              model: data.modelId || 'gpt-4o',
              messages: data.messages,
              temperature: 0.7,
              max_tokens: 1000
            }
          });
          
          console.log('OpenAI API response received');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response.data));
        } catch (apiError) {
          console.error('Error calling OpenAI API:', apiError.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'OpenAI API error',
            message: apiError.message,
            details: apiError.response?.data || {}
          }));
        }
      } catch (parseError) {
        console.error('Error parsing request body:', parseError);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Invalid JSON',
          message: parseError.message
        }));
      }
    });
  } else {
    // Simple HTML page for testing
    if (req.url === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>API Test</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            textarea { width: 100%; height: 100px; margin-bottom: 10px; }
            button { padding: 10px 20px; background: #4CAF50; color: white; border: none; cursor: pointer; }
            pre { background: #f5f5f5; padding: 10px; overflow-x: auto; }
          </style>
        </head>
        <body>
          <h1>API Test</h1>
          <div>
            <textarea id="message" placeholder="Type a message...">Hello, how are you?</textarea>
            <button id="send">Send</button>
          </div>
          <div>
            <h3>Response:</h3>
            <pre id="response">Response will appear here...</pre>
          </div>
          
          <script>
            document.getElementById('send').addEventListener('click', async () => {
              const message = document.getElementById('message').value;
              const responseElement = document.getElementById('response');
              
              responseElement.textContent = 'Loading...';
              
              try {
                const response = await fetch('/api/chat', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    messages: [
                      { role: 'system', content: 'You are a helpful assistant.' },
                      { role: 'user', content: message }
                    ]
                  })
                });
                
                const data = await response.json();
                responseElement.textContent = JSON.stringify(data, null, 2);
              } catch (error) {
                responseElement.textContent = 'Error: ' + error.message;
              }
            });
          </script>
        </body>
        </html>
      `);
      return;
    }
    
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  console.log('Visit http://localhost:3001/ in your browser to test the API');
  console.log('API Key present:', !!process.env.OPENAI_API_KEY);
});
