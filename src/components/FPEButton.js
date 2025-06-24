import React from 'react';

const FPEButton = () => {
  return (
    <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-200 w-full">
      <div className="w-8 h-8 flex items-center justify-center">
        <img src="/images/logo.png" alt="Logo" width="32" height="32" />
      </div>
    </button>
  );
};

export default FPEButton;
