import React from 'react';

const ChatSidebar = ({ 
  conversations, 
  currentConversationId, 
  onNewConversation, 
  onSelectConversation,
  onUpdateTitle,
  onDeleteConversation
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* New chat button */}
      <div className="p-4">
        <button 
          onClick={onNewConversation}
          className="w-full flex items-center gap-3 rounded-md border border-white/20 px-3 py-2 text-sm transition-colors duration-200 hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New chat
        </button>
      </div>
      
      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 pb-4 space-y-1">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors duration-200 hover:bg-gray-800 ${
                currentConversationId === conversation.id ? 'bg-gray-800' : ''
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="truncate">{conversation.title}</span>
              </div>
              
              {currentConversationId === conversation.id && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* User section */}
      <div className="border-t border-white/20 pt-2 pb-4 px-4">
        <div className="flex items-center gap-3 rounded-md px-3 py-3 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="grow overflow-hidden text-ellipsis whitespace-nowrap text-sm">User</div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
