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
      <div className="flex flex-col bg-[#202123] text-white" style={{ width: '260px', minWidth: '260px', borderRight: '1px solid #4d4d4f' }}>
        {/* Logo button */}
        <div className="p-3 border-b border-gray-700">
          <button 
            onClick={() => {
              setMessages([]);
              setCurrentConversationId('1');
            }}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-700 w-full"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-semibold">ChatGPT</span>
          </button>
        </div>
        
        {/* New chat button */}
        <div className="p-3">
          <button 
            onClick={() => {
              setMessages([]);
              setCurrentConversationId('1');
            }}
            className="w-full flex items-center gap-3 rounded-md border border-white/20 px-3 py-2 text-sm hover:bg-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New chat
          </button>
        </div>
        
        {/* Navigation items */}
        <div className="px-3 py-2">
          <div className="flex flex-col space-y-1">
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search chats
            </button>
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" />
              </svg>
              Library
            </button>
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Codex
            </button>
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Sora
            </button>
            <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              GPTs
            </button>
          </div>
        </div>
        
        {/* Chat history section */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <h3 className="text-xs text-gray-500 font-medium mb-2 px-3">Chat History</h3>
          <div className="space-y-1">
            {/* Chat history will be populated here */}
          </div>
        </div>
        
        {/* View plans section */}
        <div className="border-t border-gray-700 p-3">
          <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            View plans
          </button>
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
