import React, { useState } from 'react';

const Header = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="py-3 px-4 bg-white">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div 
            className={`flex items-center px-3 py-1.5 rounded-lg transition-colors duration-200 ${isHovered ? 'bg-gray-100' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h1 className="text-base">
              <span className="text-gray-800 font-bold">ChatGPT</span>
              <span className="text-gray-500 ml-1 font-medium">4o</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline-block text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
