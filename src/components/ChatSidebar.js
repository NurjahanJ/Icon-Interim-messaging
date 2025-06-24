import React, { useState } from 'react';

const ChatSidebar = ({ 
  conversations, 
  currentConversationId, 
  onNewConversation, 
  onSelectConversation,
  onUpdateTitle,
  onDeleteConversation
}) => {
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const handleTitleEdit = (conversationId, title) => {
    setEditingTitle(conversationId);
    setNewTitle(title);
  };

  const handleTitleSave = (conversationId) => {
    onUpdateTitle(conversationId, newTitle);
    setEditingTitle(null);
    setNewTitle('');
  };

  const handleTitleCancel = () => {
    setEditingTitle(null);
    setNewTitle('');
  };

  return (
    <div className="flex flex-col h-full bg-[#202123] text-white w-64">
      {/* New chat button */}
      <div className="p-4 border-b border-gray-700">
        <button 
          onClick={onNewConversation}
          className="w-full flex items-center gap-3 rounded-md bg-gray-700 px-3 py-2 text-sm transition-colors duration-200 hover:bg-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New chat
        </button>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto px-2 pt-2 pb-4 space-y-1">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`group w-full rounded-md px-3 py-2 text-sm cursor-pointer transition-colors duration-200 ${
              currentConversationId === conversation.id ? 'bg-gray-600' : 'hover:bg-gray-700'
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            {editingTitle === conversation.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-1 bg-transparent outline-none border-b border-gray-500"
                  autoFocus
                />
                <button onClick={() => handleTitleSave(conversation.id)} className="text-green-400">✓</button>
                <button onClick={handleTitleCancel} className="text-red-400">✕</button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="truncate">{conversation.title}</span>
                {currentConversationId === conversation.id && (
                  <div className="hidden group-hover:flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleTitleEdit(conversation.id, conversation.title); }} className="text-blue-300 hover:text-blue-200">✎</button>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteConversation(conversation.id); }} className="text-red-400 hover:text-red-300">🗑</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center gap-3 text-sm">
          <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white">U</div>
          <span className="truncate">User</span>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
