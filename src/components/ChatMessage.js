import React from 'react';

const ChatMessage = ({ role, content, isLoading = false }) => {
  // Determine styling based on role
  const isUser = role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-3xl ${isUser ? 'ml-auto' : 'mr-auto'} w-full`}>
        {/* Avatar */}
        <div className="flex-shrink-0 mr-4">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {isUser ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-1.087c-1.717-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Message content */}
        <div className="flex-1">
          <div className={`rounded-lg px-4 py-3 ${
            isUser ? 'bg-blue-50 text-blue-900' : 'bg-white border border-gray-200'
          }`}>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {content.split('\n').map((paragraph, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
