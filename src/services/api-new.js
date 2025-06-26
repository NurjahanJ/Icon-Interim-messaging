import axios from 'axios';

/**
 * Service for interacting with the OpenAI API via Vercel serverless functions
 */

// Simple API endpoint - always use relative path for Vercel compatibility
const API_URL = '/api/chat';

// Log environment info once on load
console.log('API Service initialized:', {
  environment: process.env.NODE_ENV || 'not set',
  apiUrl: API_URL,
  hostname: window.location.hostname,
  isVercel: window.location.hostname.includes('vercel.app')
});

/**
 * Send a conversation to the OpenAI API
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} modelId - The ID of the selected model
 * @returns {Promise<Object>} - A promise that resolves to the API response
 */
export const sendConversation = async (messages, modelId = 'gpt-4o') => {
  try {
    console.log(`Sending request to ${API_URL}`);
    
    // Simple POST request with timeout
    const response = await axios.post(API_URL, 
      { messages, modelId },
      { timeout: 60000 } // 60 second timeout
    );
    
    console.log('API response received');
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Error in API request:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Provide user-friendly error message
    let errorMessage = 'Failed to get a response. Please try again later.';
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timed out. The server might be busy.';
    } else if (error.message.includes('Network Error')) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Format a new user message
 * @param {string} content - The content of the user's message
 * @returns {Object} - A message object with role and content
 */
export const createUserMessage = (content) => ({
  role: 'user',
  content
});

/**
 * Format a system message
 * @param {string} content - The content of the system message
 * @returns {Object} - A message object with role and content
 */
export const createSystemMessage = (content) => ({
  role: 'system',
  content
});

/**
 * Format an assistant message
 * @param {string} content - The content of the assistant's message
 * @returns {Object} - A message object with role and content
 */
export const createAssistantMessage = (content) => ({
  role: 'assistant',
  content
});
