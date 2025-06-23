import React, { useState, useEffect, useRef } from 'react';
import { sendConversation, createUserMessage, createSystemMessage, createAssistantMessage } from './services/api';
import ChatSidebar from './components/ChatSidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ModelSelector from './components/ModelSelector';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Initialize with a system message
  useEffect(() => {
    // Create a new conversation if none exists
    if (conversations.length === 0) {
      const newConversation = {
        id: Date.now().toString(),
        title: 'New conversation',
        messages: [createSystemMessage('You are a helpful assistant.')],
        createdAt: new Date().toISOString(),
      };
      
      setConversations([newConversation]);
      setCurrentConversationId(newConversation.id);
      setMessages(newConversation.messages);
    }
  }, []);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const getCurrentConversation = () => {
    return conversations.find(conv => conv.id === currentConversationId) || conversations[0];
  };
  
  const createNewConversation = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: [createSystemMessage('You are a helpful assistant.')],
      createdAt: new Date().toISOString(),
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setMessages(newConversation.messages);
    setIsMobileSidebarOpen(false);
  };
  
  const switchConversation = (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      setMessages(conversation.messages);
      setIsMobileSidebarOpen(false);
    }
  };
  
  const updateConversationTitle = (id, title) => {
    setConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, title } : conv
    ));
  };
  
  const deleteConversation = (id) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (currentConversationId === id && conversations.length > 1) {
      const newCurrentConv = conversations.find(conv => conv.id !== id);
      if (newCurrentConv) {
        setCurrentConversationId(newCurrentConv.id);
        setMessages(newCurrentConv.messages);
      }
    }
  };
  
  const handleSendMessage = async (content, modelId = 'gpt-4o') => {
    if (!content.trim()) return;
    
    // Get current conversation
    const currentConversation = getCurrentConversation();
    if (!currentConversation) return;
    
    // Create user message
    const userMessage = createUserMessage(content);
    
    // Update UI immediately with user message
    const updatedMessages = [...currentConversation.messages, userMessage];
    
    // Update conversation in state
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? { ...conv, messages: updatedMessages } 
        : conv
    ));
    
    // Update current messages
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);
    
    try {
      // Send conversation to API
      const response = await sendConversation(updatedMessages, modelId);
      
      // Extract assistant's response
      const assistantResponse = response.choices[0].message.content;
      const assistantMessage = createAssistantMessage(assistantResponse);
      
      // Update with assistant's response
      const finalMessages = [...updatedMessages, assistantMessage];
      
      // Update conversation in state
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { 
              ...conv, 
              messages: finalMessages,
              // Update title if this is the first user message
              title: conv.messages.length <= 1 ? content.substring(0, 30) + (content.length > 30 ? '...' : '') : conv.title
            } 
          : conv
      ));
      
      // Update current messages
      setMessages(finalMessages);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to get a response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <div className={`${isMobileSidebarOpen ? 'block' : 'hidden'} md:block md:w-64 bg-gray-900 text-white flex-shrink-0 h-full overflow-y-auto`}>
        <ChatSidebar 
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewConversation={createNewConversation}
          onSelectConversation={switchConversation}
          onUpdateTitle={updateConversationTitle}
          onDeleteConversation={deleteConversation}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button 
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-center flex-1">ChatGPT</h1>
          <ModelSelector />
        </header>
        
        {/* Chat area */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-4 pb-32">
            {messages.length <= 1 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-4">How can I help you today?</h2>
                  <p className="text-gray-600">Ask me anything or start a conversation!</p>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.slice(1).map((message, index) => (
                  <ChatMessage 
                    key={index}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {loading && (
                  <ChatMessage 
                    role="assistant"
                    content="..."
                    isLoading={true}
                  />
                )}
                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
        
        {/* Input area */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              disabled={loading} 
            />
            <div className="text-xs text-gray-500 text-center mt-2">
              ChatGPT can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
