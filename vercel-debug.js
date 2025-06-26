// Enhanced Vercel deployment script with debugging for simplified API configuration
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios'); // Make sure axios is installed

console.log('Starting Vercel deployment with debugging...');

// Check if build directory exists and has required files
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  console.log('✅ Build directory exists');
  
  try {
    const files = fs.readdirSync(buildPath);
    console.log(`Build directory contains ${files.length} files/directories`);
    
    // Check for index.html
    if (files.includes('index.html')) {
      console.log('✅ index.html exists in build directory');
    } else {
      console.error('❌ index.html MISSING from build directory');
    }
    
    // Check for static directory
    if (files.includes('static')) {
      console.log('✅ static directory exists');
    } else {
      console.error('❌ static directory MISSING');
    }
    
    console.log('Build directory contents:', files);
  } catch (err) {
    console.error('Error reading build directory:', err);
  }
} else {
  console.error('❌ Build directory does not exist. Running build command...');
  
  try {
    // Set environment variable CI=false for this process
    process.env.CI = 'false';
    
    // Run build command
    execSync('npm run build', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname)
    });
    
    console.log('Build completed. Checking build directory again...');
    
    if (fs.existsSync(buildPath)) {
      const files = fs.readdirSync(buildPath);
      console.log('Build directory now contains:', files);
    } else {
      console.error('❌ Build directory still does not exist after build command');
    }
  } catch (buildError) {
    console.error('Build failed:', buildError.message);
  }
}

// Check for vercel.json
if (fs.existsSync(path.join(__dirname, 'vercel.json'))) {
  console.log('✅ vercel.json exists');
  
  // Validate vercel.json format
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));
    console.log('vercel.json is valid JSON');
    console.log('Routes configuration:', vercelConfig.routes ? `${vercelConfig.routes.length} routes defined` : 'No routes defined');
    console.log('Environment variables:', vercelConfig.env ? 'Defined' : 'Not defined');
  } catch (err) {
    console.error('❌ vercel.json contains invalid JSON:', err.message);
  }
} else {
  console.error('❌ vercel.json MISSING');
}

// Check for API directory
const apiPath = path.join(__dirname, 'api');
if (fs.existsSync(apiPath)) {
  console.log('✅ api directory exists');
  
  try {
    const apiFiles = fs.readdirSync(apiPath);
    console.log('API directory contains:', apiFiles);
  } catch (err) {
    console.error('Error reading API directory:', err);
  }
} else {
  console.error('❌ api directory MISSING');
}

// Check for .env files
const envFiles = ['.env', '.env.production', '.env.build'];
envFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`ℹ️ ${file} does not exist`);
  }
});

// Check Vercel CLI installation
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed');
} catch (err) {
  console.error('❌ Vercel CLI is not installed or not in PATH');
}

// Test the API endpoint locally
console.log('\nTesting API endpoint locally...');
try {
  // Create a test server to run the API endpoint
  const http = require('http');
  const apiHandler = require('./api/chat');
  
  const server = http.createServer((req, res) => {
    if (req.url === '/api/chat' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          req.body = JSON.parse(body);
          apiHandler(req, res);
        } catch (parseError) {
          console.error('Error parsing request body:', parseError);
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid JSON in request body' }));
        }
      });
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  });
  
  const testPort = 3456;
  server.listen(testPort, async () => {
    console.log(`Test server running on port ${testPort}`);
    
    try {
      // Make a test request to the API
      const testMessages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello' }
      ];
      
      console.log('Sending test request to API...');
      const response = await axios.post(`http://localhost:${testPort}/api/chat`, {
        messages: testMessages,
        modelId: 'gpt-4o'
      });
      
      console.log('\u2705 API test successful!');
      console.log('API response status:', response.status);
      console.log('API response has choices:', !!response.data.choices);
      
      server.close();
    } catch (apiError) {
      console.error('\u274c API test failed:', apiError.message);
      if (apiError.response) {
        console.error('API response status:', apiError.response.status);
        console.error('API response data:', apiError.response.data);
      }
      server.close();
    }
  });
} catch (testError) {
  console.error('Error setting up API test:', testError);
}

console.log('\nRunning Vercel deployment with --debug flag...');

try {
  // Set environment variable CI=false for this process
  process.env.CI = 'false';
  
  // Run the Vercel deploy command with debugging enabled
  execSync('vercel --prod --debug', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname)
  });
  
  console.log('Deployment completed successfully!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  console.log('\nTrying alternative deployment method...');
  
  try {
    execSync('vercel --prod', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname)
    });
    console.log('Alternative deployment completed!');
  } catch (altError) {
    console.error('Alternative deployment also failed:', altError.message);
    process.exit(1);
  }
}
