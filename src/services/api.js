import axios from 'axios';

/**
 * Service for interacting with the OpenAI API
 * This service handles sending messages to the API and receiving responses
 */

// Determine the appropriate API URL based on environment
const isVercel = window.location.hostname.includes('vercel.app');
const isProduction = process.env.NODE_ENV === 'production';

// API endpoint for the serverless function
// In Vercel, we need to ensure we're hitting the correct endpoint
const API_URL = '/api/chat';

// Enhanced environment information logging
const envInfo = {
  isVercel,
  isProduction,
  hostname: window.location.hostname,
  origin: window.location.origin,
  apiUrl: API_URL,
  protocol: window.location.protocol,
  pathname: window.location.pathname,
  reactAppEnv: process.env.REACT_APP_ENV || 'not set',
  nodeEnv: process.env.NODE_ENV || 'not set'
};

console.log('Environment information:', envInfo);
console.log(`Using API URL: ${API_URL} (isVercel: ${isVercel})`);

/**
 * Send a conversation to the OpenAI API
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} modelId - The ID of the selected model
 * @returns {Promise<Object>} - A promise that resolves to the API response
 */
export const sendConversation = async (messages, modelId = 'gpt-4o') => {
  const startTime = Date.now();
  console.log(`Sending message to ${API_URL}`, { 
    messageCount: messages.length, 
    modelId,
    firstMessageContent: messages[0]?.content?.substring(0, 20) + '...',
    timestamp: new Date().toISOString()
  });
  
  try {
    // Add request timeout and better error handling
    const response = await axios.post(API_URL, {
      messages,
      modelId
    }, {
      timeout: 60000, // 60 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const duration = Date.now() - startTime;
    console.log('API response received:', { 
      status: response.status,
      duration: `${duration}ms`,
      hasChoices: !!response.data.choices,
      choicesLength: response.data.choices?.length || 0
    });
    
    return response.data;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Error in sendMessage (after ${duration}ms):`, error);
    
    // Add more detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Add specific error messages for common API errors
      if (error.response.status === 401) {
        error.message = 'Authentication failed: Invalid API key';
      } else if (error.response.status === 429) {
        error.message = 'Rate limit exceeded: Too many requests';
      } else if (error.response.status === 500) {
        error.message = 'Server error: ' + (error.response.data?.error || 'Unknown server error');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      error.message = 'No response from server. Please check your network connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    throw error;
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
