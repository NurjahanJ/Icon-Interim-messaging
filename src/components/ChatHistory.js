import React, { useEffect } from 'react';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

const ChatHistory = ({ messages, loading, messagesEndRef }) => {
  // Add effect to ensure scrolling works when messages change
  useEffect(() => {
    // Ensure scroll container is properly set up
    const scrollContainer = document.getElementById('chat-history-container');
    if (scrollContainer) {
      scrollContainer.style.overflowY = 'auto';
    }
  }, [messages]);

  return (
    <div className="p-4 w-full">
      <div className="space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {loading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatHistory;
