import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

const ChatHistory = ({ messages, loading, messagesEndRef }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-gray-900' : 'bg-chatgpt-gray'}`}>
      {messages.length === 0 ? (
        <div className={`flex flex-col items-center justify-center h-full ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h2 className="text-xl font-medium">How can I help you today?</h2>
          <p className="text-sm mt-2 max-w-md text-center">
            Ask me anything! I'm here to assist with information, answer questions, or just chat.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {loading && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
