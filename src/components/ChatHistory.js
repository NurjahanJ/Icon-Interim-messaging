import React from 'react';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

const ChatHistory = ({ messages, loading, messagesEndRef }) => {
  return (
    <div className={`${messages.length > 0 ? 'flex-1' : ''} overflow-y-auto p-4 bg-white`}>
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-600">
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
