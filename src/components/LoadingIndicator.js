import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LoadingIndicator = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`flex justify-start`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${
        darkMode 
          ? 'bg-gray-700 text-white' 
          : 'bg-gray-200 text-gray-800'
      }`}>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '150ms' }}></div>
            <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-gray-400' : 'bg-gray-500'}`} style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
