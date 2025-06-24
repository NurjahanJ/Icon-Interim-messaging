import React, { useState, useEffect, useRef } from 'react';
import { sendConversation, createUserMessage, createAssistantMessage } from './services/api';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import Header from './components/Header';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([
    { id: '1', title: 'New Chat' },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState('1');

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (message, modelId = 'gpt-4o') => {
    if (!message.trim()) return;

    const userMessage = createUserMessage(message);
    userMessage.timestamp = new Date().toISOString();

    const loadingMessage = {
      role: 'assistant',
      content: '',
      isLoading: true,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage, loadingMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const messagesToSend =
        messages.length > 0
          ? [...messages, userMessage]
          : [{ role: 'system', content: 'You are a helpful assistant.' }, userMessage];

      const response = await sendConversation(messagesToSend, modelId);

      const assistantContent =
        response.choices?.[0]?.message?.content ||
        "I apologize, but I couldn't generate a response.";
      const assistantMessage = createAssistantMessage(assistantContent);
      assistantMessage.timestamp = new Date().toISOString();

      setMessages([...messages, userMessage, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = createAssistantMessage("Sorry, something went wrong.");
      errorMessage.timestamp = new Date().toISOString();
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900">
      {/* Sidebar */}
      <div className="flex flex-col bg-[#f7f7f8] text-gray-800" style={{ width: '260px', minWidth: '260px', borderRight: '1px solid #e5e5e5' }}>
        {/* Logo button */}
        <div className="p-3">
          <button 
            onClick={() => {
              setMessages([]);
              setCurrentConversationId('1');
            }}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-200 w-full"
          >
            <img src="/images/logo.png" alt="Logo" width="24" height="24" />
          </button>
        </div>
        
        {/* New chat button */}
        <div className="p-3 pb-1">
          <button 
            onClick={() => {
              setMessages([]);
              setCurrentConversationId('1');
            }}
            className="w-full flex items-center gap-3 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-200"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4V11H11V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 4H13V11H20V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 13H13V20H20V13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 13H4V20H11V13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New chat
          </button>
        </div>
        
        {/* Navigation items */}
        <div className="px-3 py-2">
          <div className="flex flex-col space-y-2">
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
              Search chats
            </button>
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 16V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
              Library
            </button>
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
              Codex
            </button>
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 12L10 16V8L16 12Z" fill="currentColor"/>
            </svg>
              Sora
            </button>
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 21C3 21 6 17 12 17C18 17 21 21 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
              GPTs
            </button>
          </div>
        </div>
        
        {/* Chat history section */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <h3 className="text-xs text-gray-500 font-medium mb-2 px-3">Chats</h3>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-200">
              New chat
            </button>
            <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-200">
              Capitalization vs Expense
            </button>
            <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-200">
              Duplicate publication disclosure
            </button>
            <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-200">
              UI Layout
            </button>
          </div>
        </div>
        
        {/* View plans section */}
        <div className="border-t border-gray-200 p-3">
          <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View plans
          </button>
          <div className="text-xs text-gray-500">Unlimited access, team features, and more</div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center max-w-xl mb-6">
              <h2 className="text-3xl mb-10">What's on the agenda today?</h2>
            </div>
            <div className="w-full max-w-[850px]">
              <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 w-full overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
              <div
                className="h-full overflow-y-auto scroll-smooth pb-4 px-4"
                ref={chatContainerRef}
              >
                <ChatHistory
                  messages={messages}
                  loading={loading}
                  messagesEndRef={messagesEndRef}
                />
              </div>
            </div>
            <div className="p-4 bg-white flex justify-center">
              <div className="w-full max-w-[850px]">
                <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
