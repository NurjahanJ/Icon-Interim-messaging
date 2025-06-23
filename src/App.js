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
  const { incrementCount } = usePromptCount();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      <main className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full" style={{ height: 'calc(100vh - 60px)' }}>
        {messages.length === 0 && (
          <div className="flex flex-col flex-grow justify-center items-center mb-24">
            <h2 className="text-[28px] font-normal text-gray-700">Where should we begin?</h2>
          </div>
        )}
        <div className="flex flex-col flex-1 overflow-hidden">
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
