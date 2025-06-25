import axios from 'axios';

/**
 * Service for interacting with the OpenAI API
 * This service handles sending messages to the API and receiving responses
 */

// Determine the appropriate API URL based on environment
const isVercel = window.location.hostname.includes('vercel.app');

// API endpoint for the serverless function
// In Vercel, we need to use the absolute path to ensure it hits the correct endpoint
const API_URL = isVercel ? '/api/chat' : '/api/chat';

// Add debugging to help troubleshoot API issues
console.log(`Using API URL: ${API_URL} (isVercel: ${isVercel})`);

/**
 * Send a conversation to the OpenAI API
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} modelId - The ID of the selected model
 * @returns {Promise<Object>} - A promise that resolves to the API response
 */
export const sendConversation = async (messages, modelId = 'gpt-4o') => {
  try {
    console.log(`Sending request to ${API_URL} with model: ${modelId}`);
    
    const response = await axios.post(API_URL, { messages, modelId });
    console.log('API response received:', response.status);
    return response.data;
  } catch (error) {
    console.error('Error sending conversation to API:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: API_URL
    });
    
    throw new Error(
      error.response?.data?.error || 
      error.response?.data?.details ||
      'Failed to get a response. Please try again later.'
    );
  }
};

/**
 * Format a new user message and add it to the conversation
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
