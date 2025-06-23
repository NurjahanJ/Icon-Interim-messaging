import React, { useState, useEffect, useRef } from 'react';
import { sendConversation, createUserMessage, createAssistantMessage } from './services/api';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import Header from './components/Header';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
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
    
    // Create a new user message
    const userMessage = createUserMessage(message);
    userMessage.timestamp = new Date().toISOString(); // Add timestamp for UI
    
    // Add user message to state
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);
    
    try {
      // Prepare messages for API (might need to include previous messages for context)
      const messagesToSend = messages.length > 0 ? 
        [...messages, userMessage] : 
        [{ role: 'system', content: 'You are a helpful assistant.' }, userMessage];
      
      // Send conversation to API
      const response = await sendConversation(messagesToSend, modelId);
      
      // Create assistant message
      // The OpenAI API returns response in format: { choices: [{ message: { content: '...' } }] }
      const assistantContent = response.choices?.[0]?.message?.content || 'I apologize, but I couldn\'t generate a response.';
      const assistantMessage = createAssistantMessage(assistantContent);
      assistantMessage.timestamp = new Date().toISOString(); // Add timestamp for UI
      
      // Add assistant message to state
      setMessages([...updatedMessages, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900">
      {/* Header */}
      <Header />
      
      {/* Main content area with flexible layout */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {messages.length === 0 ? (
          // Initial centered view with welcome message and input
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center max-w-xl mb-6">
              <h2 className="text-3xl mb-10">What's on the agenda today?</h2>
            </div>
            <div className="w-full max-w-[850px]">
              <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
            </div>
          </div>
        ) : (
          // Chat view after messages are present
          <>
            {/* Chat container - scrollable area */}
            <div 
              className="flex-1 w-full overflow-hidden" 
              style={{ height: 'calc(100vh - 140px)' }}
            >
              <div
                className="h-full overflow-y-auto scroll-smooth pb-4 px-4"
                ref={chatContainerRef}
                style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
              >
                <ChatHistory 
                  messages={messages} 
                  loading={loading} 
                  messagesEndRef={messagesEndRef} 
                />
              </div>
            </div>
            
            {/* Input area fixed at bottom when messages exist */}
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
