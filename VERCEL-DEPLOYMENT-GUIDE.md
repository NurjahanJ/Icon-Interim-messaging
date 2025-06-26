# Vercel Deployment Guide

This guide will help you deploy your ChatGPT Interface application to Vercel without encountering the "Sorry, something went wrong" error.

## 1. Prerequisites

- Make sure you have a Vercel account
- Ensure you have your OpenAI API key ready

## 2. Pre-Deployment Checklist

Run the vercel-checklist.js script to verify everything is ready:

```bash
node vercel-checklist.js
```

Fix any issues identified by the checklist before proceeding.

## 3. Testing Locally

Before deploying, test your API locally:

1. Start the test API server:
   ```bash
   node test-api.js
   ```

2. Open the API test page in your browser:
   ```
   http://localhost:3001/api-test.html
   ```

3. Send a test message to verify the API works correctly.

## 4. Setting Up Environment Variables

The most critical step is setting up your environment variables in Vercel:

1. Log in to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project (or create a new one)
3. Go to "Settings" → "Environment Variables"
4. Add the following environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: `production`
   - `CI`: `false`

## 5. Deploying to Vercel

### Option 1: Using the Vercel Dashboard

1. Connect your GitHub repository to Vercel
2. Configure the build settings:
   - Framework Preset: Other
   - Build Command: `CI=false npm run build`
   - Output Directory: `build`
3. Click "Deploy"

### Option 2: Using the Vercel CLI

If you have the Vercel CLI installed and working:

1. Run the following command from your project directory:
   ```bash
   vercel --prod
   ```

2. Follow the prompts to link your project

## 6. Verifying Deployment

After deployment:

1. Check the Function Logs in your Vercel dashboard
2. Test the API endpoint directly:
   ```
   https://your-app-name.vercel.app/api/chat
   ```
3. Test the full application in your browser

## 7. Troubleshooting

If you encounter issues:

1. **API Key Issues**: Verify your OPENAI_API_KEY is correctly set in Vercel environment variables
2. **CORS Errors**: Check the browser console for CORS-related errors
3. **Build Failures**: Check the build logs in Vercel
4. **Runtime Errors**: Check the Function Logs in Vercel

## 8. Key Files

These files have been optimized for Vercel deployment:

- `api/chat.js`: Serverless API endpoint
- `src/services/api.js`: Frontend API service
- `vercel.json`: Vercel configuration

## 9. Important Notes

- The `.vercel` directory should be deleted before deploying if you encounter project linking issues
- Always set environment variables through the Vercel dashboard, not in your code
- Use the simplified API configuration we've created to avoid deployment issues

## 10. Next Steps

After successful deployment:

1. Add your custom domain if needed
2. Set up monitoring and alerts
3. Consider adding rate limiting to protect your API key
