import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, CalculatorHistoryItem, Theme } from '../types';

interface AppContextType extends AppState {
  setTheme: (theme: Theme) => void;
  addToHistory: (item: CalculatorHistoryItem) => void;
  clearHistory: () => void;
  toggleFavorite: (toolId: string) => void;
  addRecentTool: (toolId: string) => void;
  setDecimalPrecision: (val: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'all_in_one_calc_pro_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      theme: 'light',
      history: [],
      favorites: [],
      recentTools: [],
      decimalPrecision: 2,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const setTheme = (theme: Theme) => setState(prev => ({ ...prev, theme }));
  
  const addToHistory = (item: CalculatorHistoryItem) => {
    setState(prev => ({ ...prev, history: [item, ...prev.history].slice(0, 50) }));
  };

  const clearHistory = () => setState(prev => ({ ...prev, history: [] }));

  const toggleFavorite = (toolId: string) => {
    setState(prev => {
      const isFav = prev.favorites.includes(toolId);
      return {
        ...prev,
        favorites: isFav ? prev.favorites.filter(id => id !== toolId) : [...prev.favorites, toolId]
      };
    });
  };

  const addRecentTool = (toolId: string) => {
    setState(prev => ({
      ...prev,
      recentTools: [toolId, ...prev.recentTools.filter(id => id !== toolId)].slice(0, 8)
    }));
  };

  const setDecimalPrecision = (val: number) => setState(prev => ({ ...prev, decimalPrecision: val }));

  return (
    <AppContext.Provider value={{ 
      ...state, 
      setTheme, 
      addToHistory, 
      clearHistory, 
      toggleFavorite, 
      addRecentTool,
      setDecimalPrecision
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
