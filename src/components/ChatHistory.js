import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

const ChatHistory = ({ messages, loading, messagesEndRef }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-gray-900' : 'bg-chatgpt-gray'}`} style={!darkMode ? {backgroundColor: '#FFFFFF'} : {}}>
      {messages.length === 0 ? (
        <div className={`flex flex-col items-center justify-center h-full ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {/* Empty state with no icon or text */}
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
