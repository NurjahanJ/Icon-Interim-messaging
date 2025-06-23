import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

const ChatHistory = ({ messages, loading, messagesEndRef }) => {
  const historyRef = useRef(null);

  // Add effect to ensure scrolling works when messages change
  useEffect(() => {
    // Ensure scroll container is properly set up
    const scrollContainer = document.getElementById('chat-history-container');
    if (scrollContainer) {
      scrollContainer.style.overflowY = 'auto';
    }
  }, [messages]);

  return (
    <div className="w-full" ref={historyRef}>
      <div className="space-y-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {loading && <LoadingIndicator />}
        <div ref={messagesEndRef} className="h-4" /> {/* Added height to ensure proper scrolling */}
      </div>
    </div>
  );
};

export default ChatHistory;
