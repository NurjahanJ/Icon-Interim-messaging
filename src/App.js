import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import { useTheme } from './contexts/ThemeContext';
import { usePromptCount } from './contexts/PromptCountContext';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import { sendMessage as sendApiMessage } from './services/api';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { darkMode } = useTheme();
  const { incrementCount, hasReachedLimit } = usePromptCount();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to handle sending a new message
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setLoading(true);
    
    // Increment the prompt count
    incrementCount();
    
    try {
      // Call the actual OpenAI API
      const response = await sendApiMessage(message);
      
      const assistantMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
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
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900' : 'bg-chatgpt-gray'}`} style={!darkMode ? {backgroundColor: '#FFFFFF'} : {}}>
      <Header />
      <main className={`flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full ${messages.length === 0 ? 'justify-center' : ''}`}>
        {messages.length === 0 && (
          <div className="text-center mb-5">
            <h2 className="text-[28px] font-normal mb-3 text-gray-700 dark:text-gray-200">Where should we begin?</h2>
          </div>
        )}
        <div className={`flex flex-col ${messages.length === 0 ? '' : 'flex-1'}`}>
          <ChatHistory 
            messages={messages} 
            loading={loading} 
            messagesEndRef={messagesEndRef} 
          />
        </div>
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </main>
    </div>
  );
}

export default App;
