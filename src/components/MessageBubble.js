import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MessageBubble = ({ message }) => {
  const { darkMode } = useTheme();
  const isUser = message.sender === 'user';
  
  // Format timestamp to a readable format
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${
        isUser
          ? darkMode 
            ? 'bg-blue-600 text-white' 
            : 'bg-blue-500 text-white'
          : darkMode 
            ? 'bg-gray-700 text-white' 
            : 'bg-gray-200 text-gray-800'
      }`}>
        <div className="whitespace-pre-wrap">{message.text}</div>
        <div className={`text-xs mt-1 text-right ${
          isUser
            ? 'text-blue-200'
            : darkMode 
              ? 'text-gray-400' 
              : 'text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
