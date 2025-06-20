import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for prompt count management
const PromptCountContext = createContext();

// Custom hook to use the prompt count context
export const usePromptCount = () => useContext(PromptCountContext);

export const PromptCountProvider = ({ children }) => {
  // Get initial count from localStorage or set to 0
  const getInitialCount = () => {
    const savedCount = localStorage.getItem('promptCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  };

  const [count, setCount] = useState(getInitialCount);
  
  // Maximum number of prompts allowed per day
  const MAX_PROMPTS_PER_DAY = 25;
  
  // Get the last reset date from localStorage
  const getLastResetDate = () => {
    return localStorage.getItem('lastResetDate');
  };
  
  // Check if we need to reset the count (new day)
  useEffect(() => {
    const lastResetDate = getLastResetDate();
    const today = new Date().toDateString();
    
    if (lastResetDate !== today) {
      // Reset count for a new day
      setCount(0);
      localStorage.setItem('promptCount', '0');
      localStorage.setItem('lastResetDate', today);
    }
  }, []);
  
  // Update localStorage when count changes
  useEffect(() => {
    localStorage.setItem('promptCount', count.toString());
  }, [count]);
  
  // Increment the prompt count
  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
  };
  
  // Check if user has reached the daily limit
  const hasReachedLimit = count >= MAX_PROMPTS_PER_DAY;
  
  // Get remaining prompts for the day
  const remainingPrompts = MAX_PROMPTS_PER_DAY - count;

  return (
    <PromptCountContext.Provider value={{ 
      count, 
      incrementCount, 
      hasReachedLimit,
      remainingPrompts,
      maxPrompts: MAX_PROMPTS_PER_DAY
    }}>
      {children}
    </PromptCountContext.Provider>
  );
};
