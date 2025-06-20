import axios from 'axios';

/**
 * Service for interacting with the OpenAI API
 * This service handles sending messages to the API and receiving responses
 */

// API endpoint for the server proxy
const API_URL = '/api/chat';

/**
 * Send a message to the OpenAI API
 * @param {string} message - The user's message to send to the API
 * @returns {Promise<string>} - A promise that resolves to the API response text
 */
export const sendMessage = async (message) => {
  try {
    const response = await axios.post(API_URL, { message });
    return response.data.message;
  } catch (error) {
    console.error('Error sending message to API:', error);
    throw new Error(
      error.response?.data?.error || 
      'Failed to get a response. Please try again later.'
    );
  }
};
