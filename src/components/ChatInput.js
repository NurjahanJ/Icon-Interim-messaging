import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePromptCount } from '../contexts/PromptCountContext';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isInputActive, setIsInputActive] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const { darkMode } = useTheme();
  const { hasReachedLimit } = usePromptCount();
  
  // Auto-resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);
  
  // Focus the textarea when clicked
  const handlePlaceholderClick = () => {
    if (!disabled && !hasReachedLimit) {
      setIsInputActive(true);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled && !hasReachedLimit) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  // Speech recognition functionality
  const toggleSpeechRecognition = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setMessage(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
      window.recognition = recognition;
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };
  
  const stopListening = () => {
    if (window.recognition) {
      window.recognition.stop();
      setIsListening(false);
    }
  };
  
  // File upload functionality
  const handleFileButtonClick = () => {
    setIsFileMenuOpen(!isFileMenuOpen);
  };
  
  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*,.pdf,.doc,.docx,.txt';
      fileInputRef.current.click();
    }
    setIsFileMenuOpen(false);
  };
  
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here you would typically upload the file to your server
      // For now, we'll just add a placeholder message
      const fileType = file.type.startsWith('image/') ? 'image' : 'file';
      setMessage(`[Uploaded ${fileType}: ${file.name}]`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className={`relative rounded-full border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} shadow-sm`}>
          {/* Placeholder text at the top - clickable */}
          <div 
            className="px-4 pt-3 pb-1 cursor-text" 
            onClick={handlePlaceholderClick}
          >
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} ${isInputActive || message ? 'opacity-50' : ''}`}>
              {hasReachedLimit ? "You've reached your daily limit of prompts" : "Ask anything"}
            </div>
          </div>
          
          {/* Bottom row with buttons */}
          <div className="flex items-center px-2 py-2">
            {/* Plus button for file uploads */}
            <div className="relative">
              <button
                type="button"
                onClick={handleFileButtonClick}
                className={`p-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              {/* File upload menu */}
              {isFileMenuOpen && (
                <div className={`absolute bottom-full left-0 mb-2 rounded-lg shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`} style={{ minWidth: '220px' }}>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleFileUpload}
                      className={`flex items-center px-5 py-3 text-sm w-full text-left whitespace-nowrap ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l4 4v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                      Add photos and files
                    </button>
                  </div>
                </div>
              )}
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
            
            {/* Tools button */}
            <button
              type="button"
              className={`flex items-center ml-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              <span className="ml-1 text-sm">Tools</span>
            </button>
            
            {/* Textarea for message input - conditionally visible */}
            <div className="flex-grow px-2">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsInputActive(true)}
                onBlur={() => setIsInputActive(message.length > 0)}
                disabled={disabled || hasReachedLimit}
                className={`w-full resize-none bg-transparent border-0 focus:ring-0 focus:outline-none ${darkMode ? 'text-white' : 'text-gray-900'}`}
                rows="1"
                style={{ height: isInputActive || message ? 'auto' : '0px', overflow: 'hidden' }}
              />
            </div>
            
            {/* Spacer to push buttons to the right */}
            <div className="flex-grow"></div>
            
            {/* Microphone button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              disabled={disabled || hasReachedLimit}
              className={`p-2 ${
                disabled || hasReachedLimit
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } ${
                isListening
                  ? (darkMode ? 'text-red-400' : 'text-red-500')
                  : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700')
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            
            {/* Send button - up arrow button */}
            <button
              type="submit"
              disabled={!message.trim() || disabled || hasReachedLimit}
              className={`p-2 ml-1 mr-2 rounded-full ${
                !message.trim() || disabled || hasReachedLimit
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              } ${
                darkMode 
                  ? 'bg-gray-500 text-white hover:bg-gray-400' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <div className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {disabled ? 'Processing your request...' : ''}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
