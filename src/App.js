import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import { usePromptCount } from './contexts/PromptCountContext';
import { sendMessage as sendApiMessage } from './services/api';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { incrementCount } = usePromptCount();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Function to handle sending a new message
  const handleSendMessage = async (message, modelId = 'gpt-4o') => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      model: modelId // Store which model was used
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setLoading(true);
    
    // Increment the prompt count
    incrementCount();
    
    try {
      // Call the actual OpenAI API with the selected model
      console.log(`Sending message to API with model: ${modelId}`);
      const response = await sendApiMessage(message, modelId);
      
      const assistantMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        model: modelId // Store which model was used
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      
    } catch (error) {
      // Handle API errors
      const errorMessage = {
        id: Date.now() + 1,
        text: `Error: ${error.message || 'Something went wrong. Please try again.'}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header />
      
      {messages.length === 0 ? (
        // Initial empty state with both text and input centered
        <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full justify-center items-center h-[calc(100vh-60px)]">
          <div className="flex flex-col items-center justify-center gap-8">
            <h2 className="text-[28px] font-normal text-gray-700">Where should we begin?</h2>
            <div className="w-full max-w-[600px]">
              <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
            </div>
          </div>
        </main>
      ) : (
        // Chat view with messages
        <main className="flex flex-col max-w-5xl mx-auto w-full h-[calc(100vh-60px)]">
          {/* Scrollable container for messages - absolute positioning to ensure it takes full height */}
          <div 
            className="relative flex-1 w-full" 
            style={{ height: 'calc(100vh - 130px)' }}
          >
            <div
              className="absolute inset-0 overflow-y-auto scroll-smooth pb-4"
              style={{ 
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
              ref={chatContainerRef}
              id="chat-history-container"
            >
              <ChatHistory 
                messages={messages} 
                loading={loading} 
                messagesEndRef={messagesEndRef} 
              />
            </div>
          </div>
          {/* Fixed input at bottom */}
          <div className="p-4 mt-auto bg-white flex justify-center">
            <div className="w-full max-w-[600px]">
              <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
