import React from 'react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  
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
    <div className={`flex w-full my-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl p-4 ${
        isUser
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-800'
      }`}>
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <div className={`text-xs mt-1 text-right ${
          isUser
            ? 'text-blue-200'
            : 'text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
