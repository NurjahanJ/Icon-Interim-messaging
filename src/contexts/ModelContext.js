import React, { createContext, useState, useContext } from 'react';

const ModelContext = createContext();

export const models = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Great for most tasks',
    default: true
  },
  {
    id: 'o3',
    name: 'o3',
    description: 'Uses advanced reasoning',
    default: false
  },
  {
    id: 'o4-mini',
    name: 'o4-mini',
    description: 'Fastest at advanced reasoning',
    default: false
  },
  {
    id: 'o4-mini-high',
    name: 'o4-mini-high',
    description: 'Great at coding and visual reasoning',
    default: false
  }
];

export const ModelProvider = ({ children }) => {
  const [selectedModel, setSelectedModel] = useState(models.find(model => model.default) || models[0]);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const selectModel = (model) => {
    setSelectedModel(model);
    setIsModelMenuOpen(false);
  };

  const toggleModelMenu = () => {
    setIsModelMenuOpen(!isModelMenuOpen);
  };

  const closeModelMenu = () => {
    setIsModelMenuOpen(false);
  };

  return (
    <ModelContext.Provider value={{ 
      models, 
      selectedModel, 
      selectModel, 
      isModelMenuOpen, 
      toggleModelMenu,
      closeModelMenu 
    }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = () => useContext(ModelContext);
