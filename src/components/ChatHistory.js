import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

const ChatHistory = ({ messages, loading, messagesEndRef }) => {
  const historyRef = useRef(null);

  // Add effect to ensure scrolling works when messages change
  useEffect(() => {
    // Ensure scroll container is properly set up
    if (historyRef.current?.parentElement) {
      historyRef.current.parentElement.style.overflowY = 'auto';
    }
  }, [messages]);

  return (
    <div className="w-full max-w-[850px] mx-auto px-4" ref={historyRef}>
      <div className="py-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {loading && <LoadingIndicator />}
        <div ref={messagesEndRef} className="h-4" /> {/* Added height to ensure proper scrolling */}
      </div>
    </div>
  );
};

export default ChatHistory;
