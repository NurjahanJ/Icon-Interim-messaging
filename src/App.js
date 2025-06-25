import React, { useState, useEffect, useRef } from 'react';
import { sendConversation, createUserMessage, createAssistantMessage } from './services/api';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import logo from './images/logo.png';
import SustainabilityPrompt from './components/SustainabilityPrompt';
import PromptTipsTable from './components/PromptTipsTable';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([
    { id: '1', title: 'New Chat' },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState('1');
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSustainabilityPrompt, setShowSustainabilityPrompt] = useState(false);
  const [showWarningPrompt, setShowWarningPrompt] = useState(false);
  const [showPromptTips, setShowPromptTips] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
    if (messages.filter(m => m.role === 'user').length === 2) {
      setShowSustainabilityPrompt(true);
    }
    if (messages.filter(m => m.role === 'user').length === 8) {
      setShowWarningPrompt(true);
    }
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
      console.error('Error sending message:', {
        message: err.message,
        cause: err.cause,
        stack: err.stack
      });
      
      // Extract a more useful error message if available
      let errorText = "Sorry, something went wrong.";
      
      if (err.message.includes('API key')) {
        errorText = "Error: OpenAI API key is missing or invalid. Please check your server configuration.";
      } else if (err.message.includes('rate limit')) {
        errorText = "Error: OpenAI rate limit exceeded. Please try again later.";
      } else if (err.message.includes('network') || err.message.includes('timeout')) {
        errorText = "Error: Network issue when connecting to the API. Please check your connection.";
      }
      
      const errorMessage = createAssistantMessage(errorText);
      errorMessage.timestamp = new Date().toISOString();
      errorMessage.isError = true; // Flag to style error messages differently
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900">
      {!sidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="fixed top-3 left-3 z-10 p-2 rounded-md hover:bg-gray-100"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="3" stroke="#8e8ea0" strokeWidth="1.5" />
          </svg>
        </button>
      )}

      <div className={`flex flex-col h-full ${sidebarOpen ? 'w-[260px] min-w-[260px]' : 'w-0 min-w-0 overflow-hidden'} bg-gray-50 border-r border-gray-200 overflow-y-auto transition-all duration-300`}>
        <div className="p-3 flex justify-between items-center">
          <button 
            onClick={() => {
              setMessages([]);
              setCurrentConversationId('1');
            }}
            className="p-2 hover:bg-gray-200 rounded-md"
          >
            <img src={logo} alt="Logo" width="24" height="24" />
          </button>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="p-2 hover:bg-gray-200 rounded-md"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="3" stroke="#8e8ea0" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <div className="px-2 py-1">
          <button
            onClick={() => {
              setMessages([]);
              setCurrentConversationId('1');
            }}
            className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4V20H20V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New chat
          </button>
        </div>

        <div className="flex-1"></div>

        <div className="border-t border-gray-200 p-2">
          <button className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View plans
          </button>
        </div>
      </div>

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
            {showSustainabilityPrompt && (
              <div className="w-full flex flex-col items-center px-4">
                <SustainabilityPrompt
                  onRespond={(response) => {
                    setShowSustainabilityPrompt(false);
                    if (response) {
                      setShowPromptTips(true);
                    }
                  }}
                />
                {showPromptTips && <PromptTipsTable />}
              </div>
            )}
            {showWarningPrompt && (
              <div className="w-full flex justify-center px-4">
                <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm rounded-lg px-4 py-3 max-w-[850px] shadow-sm mt-2">
                  <strong className="font-semibold">Whoa there!</strong> This prompt uses more energy than a Google search, and you passed the average daily prompts. Mind taking a break?
                </div>
              </div>
            )}
            <div className="flex-1 w-full overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
              <div className="h-full overflow-y-auto scroll-smooth pb-4 px-4" ref={chatContainerRef}>
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
