// Enhanced Vercel deployment script with debugging
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

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
