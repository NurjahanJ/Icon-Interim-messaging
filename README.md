# ChatGPT Interface with Dark Mode

A modern, responsive ChatGPT interface built with React and Tailwind CSS featuring dark mode support.

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
- Express server for API proxy
- Environment variables for secure API key storage
