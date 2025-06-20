import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { usePromptCount } from '../contexts/PromptCountContext';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
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
  
  const handleFileUpload = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : '*/*';
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
    <div className={`p-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end">
          {/* Plus button for file uploads */}
          <div className="relative mr-2 mb-2">
            <button
              type="button"
              onClick={handleFileButtonClick}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            {/* File upload menu */}
            {isFileMenuOpen && (
              <div className={`absolute bottom-full left-0 mb-2 rounded-md shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => handleFileUpload('image')}
                    className={`block px-4 py-2 text-sm w-full text-left ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Upload Image
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFileUpload('file')}
                    className={`block px-4 py-2 text-sm w-full text-left ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Upload Document
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
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              hasReachedLimit 
                ? "You've reached your daily limit of prompts" 
                : "Type your message here..."
            }
            disabled={disabled || hasReachedLimit}
            className={`w-full p-3 pr-24 rounded-lg resize-none max-h-[200px] ${
              darkMode 
                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
            } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            rows="1"
          />
          
          {/* Microphone button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            disabled={disabled || hasReachedLimit}
            className={`absolute right-14 bottom-2 p-2 rounded-lg ${
              disabled || hasReachedLimit
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-opacity-80'
            } ${
              isListening
                ? (darkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white')
                : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700')
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          {/* Send button */}
          <button
            type="submit"
            disabled={!message.trim() || disabled || hasReachedLimit}
            className={`absolute right-2 bottom-2 p-2 rounded-lg ${
              !message.trim() || disabled || hasReachedLimit
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-opacity-80'
            } ${
              darkMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-500 text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        <div className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {disabled ? 'Processing your request...' : 'Press Enter to send, Shift+Enter for a new line'}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
