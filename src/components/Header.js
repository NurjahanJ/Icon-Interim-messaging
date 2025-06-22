import React from 'react';

const Header = () => {

  return (
    <header className="py-3 px-4 bg-white">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-base font-medium text-gray-800">
            ChatGPT
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
