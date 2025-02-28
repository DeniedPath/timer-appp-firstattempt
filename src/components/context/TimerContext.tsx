import React, { createContext, useContext, useState } from 'react';

interface TimerContextType {
  duration: number;
  setDuration: (duration: number) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [duration, setDuration] = useState(25 * 60); // Default to 25 minutes
  const [isRunning, setIsRunning] = useState(false);

  return (
    <TimerContext.Provider value={{ duration, setDuration, isRunning, setIsRunning }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
