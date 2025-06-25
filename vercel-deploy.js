// Script to deploy to Vercel with CI=false
const { execSync } = require('child_process');
const path = require('path');

console.log('Starting Vercel deployment with CI=false...');

try {
  // Set environment variable CI=false for this process
  process.env.CI = 'false';
  
  // Run the Vercel deploy command with automatic confirmation
  execSync('vercel --prod --yes', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname)
  });
  
  console.log('Deployment completed successfully!');
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}
