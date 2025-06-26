// Vercel Deployment Helper Script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel Deployment Helper');
console.log('===================================');

// Check for critical files
const criticalFiles = [
  { path: 'api/chat.js', description: 'API endpoint' },
  { path: 'src/services/api.js', description: 'Frontend API service' },
  { path: 'vercel.json', description: 'Vercel configuration' },
  { path: 'package.json', description: 'Project dependencies' }
];

console.log('\n📋 Checking critical files:');
let allCriticalFilesExist = true;

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file.path} (${file.description}) - Found`);
  } else {
    console.log(`❌ ${file.path} (${file.description}) - MISSING`);
    allCriticalFilesExist = false;
  }
});

if (!allCriticalFilesExist) {
  console.log('\n⚠️ Some critical files are missing! Fix these issues before deploying.');
  process.exit(1);
}

// Check for .vercel directory and remove it if it exists
const vercelDir = path.join(__dirname, '.vercel');
if (fs.existsSync(vercelDir)) {
  console.log('\n🗑️ Found .vercel directory. Removing it to prevent project linking issues...');
  try {
    fs.rmSync(vercelDir, { recursive: true, force: true });
    console.log('✅ .vercel directory removed successfully.');
  } catch (err) {
    console.log(`❌ Failed to remove .vercel directory: ${err.message}`);
    console.log('Please remove it manually before continuing.');
  }
}

// Create a minimal .env.production file if it doesn't exist
const envProdPath = path.join(__dirname, '.env.production');
if (!fs.existsSync(envProdPath)) {
  console.log('\n📝 Creating minimal .env.production file...');
  try {
    fs.writeFileSync(envProdPath, 'CI=false\nNODE_ENV=production\n');
    console.log('✅ .env.production file created successfully.');
  } catch (err) {
    console.log(`❌ Failed to create .env.production file: ${err.message}`);
  }
}

// Verify vercel.json is valid JSON
try {
  const vercelConfigPath = path.join(__dirname, 'vercel.json');
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  console.log('\n✅ vercel.json is valid JSON.');
  
  // Check for minimal required configuration
  let configValid = true;
  
  if (!vercelConfig.builds || !Array.isArray(vercelConfig.builds)) {
    console.log('❌ vercel.json is missing "builds" array.');
    configValid = false;
  }
  
  if (!vercelConfig.routes || !Array.isArray(vercelConfig.routes)) {
    console.log('❌ vercel.json is missing "routes" array.');
    configValid = false;
  }
  
  if (!configValid) {
    console.log('⚠️ vercel.json is missing required configuration. Please fix before deploying.');
  } else {
    console.log('✅ vercel.json has required configuration.');
  }
} catch (err) {
  console.log(`❌ Error reading or parsing vercel.json: ${err.message}`);
  process.exit(1);
}

console.log('\n📋 Deployment Instructions:');
console.log('1. Make sure you have set OPENAI_API_KEY in the Vercel dashboard');
console.log('2. Run the following command to deploy:');
console.log('   vercel --prod');
console.log('\n💡 If you encounter any issues:');
console.log('1. Check the Function Logs in the Vercel dashboard');
console.log('2. Verify your environment variables are set correctly');
console.log('3. Test the API endpoint directly with a tool like Postman');

console.log('\n===================================');
console.log('🏁 Deployment helper complete!');

// Ask if user wants to deploy now
console.log('\nWould you like to attempt deployment now? (y/n)');
process.stdin.once('data', (input) => {
  const answer = input.toString().trim().toLowerCase();
  
  if (answer === 'y' || answer === 'yes') {
    console.log('\n🚀 Attempting deployment...');
    try {
      console.log(execSync('vercel --prod', { stdio: 'inherit' }));
      console.log('✅ Deployment command executed. Check the output above for results.');
    } catch (err) {
      console.log('❌ Deployment failed. Please check the error message above.');
      console.log('You can try deploying manually or through the Vercel dashboard.');
    }
  } else {
    console.log('\n👍 You can deploy manually when ready using: vercel --prod');
  }
  
  process.exit(0);
});
