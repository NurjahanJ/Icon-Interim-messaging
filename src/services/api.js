import axios from 'axios';

/**
 * Simple API service for communicating with the OpenAI API via Vercel serverless functions
 */

/**
 * Send a conversation to the OpenAI API
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} modelId - The ID of the selected model (optional)
 * @returns {Promise<Object>} - A promise that resolves to the API response
 */
export const sendConversation = async (messages, modelId = 'gpt-4o') => {
  try {
    // Always use a relative path for API endpoint in Vercel
    const response = await axios.post('/api/chat', { 
      messages,
      modelId
    });
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    
    // Create a user-friendly error message
    let errorMessage = 'Failed to get a response. Please try again later.';
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.response?.status === 401) {
      errorMessage = 'Authentication failed. Please check your API key.';
    } else if (error.response?.status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
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
