# ChatGPT Interface with Dark Mode

A modern, responsive ChatGPT interface built with React and Tailwind CSS featuring dark mode support and serverless deployment capabilities.

## Features

- Clean, minimalist chat interface inspired by ChatGPT
- Integration with OpenAI's API for real AI responses
- Dark mode support with system preference detection
- Persistent theme preference using localStorage
- Responsive design for all device sizes
- Animated message transitions
- Auto-resizing text input

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up your API key:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key to the `.env` file (see `.env.example` for format)
   - Never commit your `.env` file to version control

```
# In your .env file
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Technologies Used

- React.js
- Tailwind CSS
- Context API for state management
- OpenAI API for chat functionality
- Serverless functions for API endpoints
- Environment variables for secure API key storage

## Deploying to Vercel

This project is configured for seamless deployment on Vercel with serverless functions.

1. **Fork or clone this repository to your GitHub account**

2. **Connect your GitHub repository to Vercel**:
   - Sign up or log in to [Vercel](https://vercel.com)
   - Click "New Project" and import your GitHub repository
   - Select the repository and configure as needed

3. **Configure environment variables**:
   - Add your `OPENAI_API_KEY` in the Vercel project settings
   - Go to Settings > Environment Variables
   - Add the key and value, and select all environments (Production, Preview, Development)

4. **Deploy**:
   - Click "Deploy" and wait for the build to complete
   - Your application will be available at the URL provided by Vercel

5. **Verify your deployment**:
   - Check that the UI layout works as expected (centered initially, moves to bottom after sending a message)
   - Test the chat functionality to ensure API calls are working
