import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context type
type StatsContextType = {
  pastStreaks: number[];
  highScore: number;
  updateStats: (streak: number) => void;
};

// Provide a default value for the context
const defaultValue: StatsContextType = {
  pastStreaks: [],
  highScore: 0,
  updateStats: () => {},
};

// Initialize the context with the default value
const StatsContext = createContext<StatsContextType>(defaultValue);

export const StatsProvider = ({ children }: { children: ReactNode }) => {
  const [pastStreaks, setPastStreaks] = useState<number[]>([]);
  const [highScore, setHighScore] = useState(0);

  const updateStats = (streak: number) => {
    setPastStreaks((prev) => [...prev, streak]);
    if (streak > highScore) setHighScore(streak);
  };

  return (
    <StatsContext.Provider value={{ pastStreaks, highScore, updateStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};