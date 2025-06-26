// Vercel Deployment Checklist Script
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Running Vercel Deployment Checklist...');
console.log('=======================================');

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
} else {
  console.log('\n✅ All critical files are present.');
}

// Check API endpoint structure
console.log('\n📋 Checking API endpoint structure:');
try {
  const apiContent = fs.readFileSync(path.join(__dirname, 'api/chat.js'), 'utf8');
  
  const checks = [
    { pattern: /module\.exports\s*=\s*async.*req,\s*res.*=>/, description: 'Serverless function export' },
    { pattern: /res\.setHeader\('Access-Control-Allow-Origin'/, description: 'CORS headers' },
    { pattern: /axios\.post.*api\.openai\.com/, description: 'OpenAI API call' },
    { pattern: /process\.env\.OPENAI_API_KEY/, description: 'API key from environment' }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(apiContent)) {
      console.log(`✅ ${check.description} - Found`);
    } else {
      console.log(`❌ ${check.description} - MISSING`);
    }
  });
} catch (err) {
  console.log(`❌ Error reading API file: ${err.message}`);
}

// Check vercel.json configuration
console.log('\n📋 Checking vercel.json configuration:');
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));
  
  // Check builds
  if (vercelConfig.builds && Array.isArray(vercelConfig.builds)) {
    console.log(`✅ Builds configuration - Found (${vercelConfig.builds.length} entries)`);
    
    // Check for API build
    const apiBuilds = vercelConfig.builds.filter(build => build.src && build.src.includes('api'));
    if (apiBuilds.length > 0) {
      console.log(`✅ API build configuration - Found`);
    } else {
      console.log(`❌ API build configuration - MISSING`);
    }
    
    // Check for static build
    const staticBuilds = vercelConfig.builds.filter(build => build.src && build.src.includes('package.json'));
    if (staticBuilds.length > 0) {
      console.log(`✅ Static build configuration - Found`);
    } else {
      console.log(`❌ Static build configuration - MISSING`);
    }
  } else {
    console.log(`❌ Builds configuration - MISSING or invalid`);
  }
  
  // Check routes
  if (vercelConfig.routes && Array.isArray(vercelConfig.routes)) {
    console.log(`✅ Routes configuration - Found (${vercelConfig.routes.length} entries)`);
    
    // Check for API route
    const apiRoutes = vercelConfig.routes.filter(route => route.src && route.src.includes('/api/'));
    if (apiRoutes.length > 0) {
      console.log(`✅ API route configuration - Found`);
    } else {
      console.log(`❌ API route configuration - MISSING`);
    }
    
    // Check for catch-all route
    const catchAllRoutes = vercelConfig.routes.filter(route => route.src === '/(.*)'  && route.dest === '/index.html');
    if (catchAllRoutes.length > 0) {
      console.log(`✅ Catch-all route configuration - Found`);
    } else {
      console.log(`❌ Catch-all route configuration - MISSING`);
    }
  } else {
    console.log(`❌ Routes configuration - MISSING or invalid`);
  }
  
  // Check env
  if (vercelConfig.env) {
    console.log(`✅ Environment variables configuration - Found`);
    
    if (vercelConfig.env.NODE_ENV === 'production') {
      console.log(`✅ NODE_ENV=production - Set correctly`);
    } else {
      console.log(`⚠️ NODE_ENV - Not set to 'production'`);
    }
    
    if (vercelConfig.env.CI === 'false') {
      console.log(`✅ CI=false - Set correctly`);
    } else {
      console.log(`⚠️ CI - Not set to 'false'`);
    }
  } else {
    console.log(`⚠️ Environment variables configuration - MISSING`);
  }
} catch (err) {
  console.log(`❌ Error reading vercel.json: ${err.message}`);
}

// Check for .vercel directory
const vercelDir = path.join(__dirname, '.vercel');
if (fs.existsSync(vercelDir)) {
  console.log('\n⚠️ .vercel directory exists. This might cause issues with project linking.');
  console.log('   Consider removing it before deploying: `rm -rf .vercel`');
} else {
  console.log('\n✅ No .vercel directory found (good).');
}

// Check for environment variables
console.log('\n📋 Checking environment variables:');
const envVars = ['OPENAI_API_KEY', 'NODE_ENV', 'CI'];
envVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName} - Set (value hidden)`);
  } else {
    if (varName === 'OPENAI_API_KEY') {
      console.log(`⚠️ ${varName} - NOT SET (must be set in Vercel dashboard)`);
    } else {
      console.log(`⚠️ ${varName} - NOT SET`);
    }
  }
});

// Check package.json
console.log('\n📋 Checking package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  // Check dependencies
  const requiredDeps = ['axios', 'react', 'react-dom'];
  const missingDeps = [];
  
  requiredDeps.forEach(dep => {
    if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
      missingDeps.push(dep);
    }
  });
  
  if (missingDeps.length === 0) {
    console.log(`✅ Required dependencies - All found`);
  } else {
    console.log(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
  }
  
  // Check scripts
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log(`✅ Build script - Found: "${packageJson.scripts.build}"`);
  } else {
    console.log(`❌ Build script - MISSING`);
  }
  
  if (packageJson.scripts && packageJson.scripts.start) {
    console.log(`✅ Start script - Found: "${packageJson.scripts.start}"`);
  } else {
    console.log(`⚠️ Start script - MISSING (not critical for Vercel deployment)`);
  }
} catch (err) {
  console.log(`❌ Error reading package.json: ${err.message}`);
}

console.log('\n=======================================');
console.log('🏁 Checklist complete!');
console.log('\n📝 NEXT STEPS:');
console.log('1. Make sure OPENAI_API_KEY is set in Vercel dashboard');
console.log('2. Deploy to Vercel using: vercel --prod');
console.log('3. Check Vercel logs for any deployment errors');
console.log('4. Test the deployed API endpoint');
