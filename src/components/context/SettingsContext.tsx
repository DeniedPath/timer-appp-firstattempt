import React, { createContext, useContext, useState, useMemo } from 'react';

interface Settings {
  soundEnabled: boolean;
  autoStart: boolean;
  notificationsEnabled: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    autoStart: false,
    notificationsEnabled: true,
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const value = useMemo(() => ({
    settings,
    updateSettings,
  }), [settings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
