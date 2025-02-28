import React, { createContext, useContext, useState, useMemo } from 'react';

interface Settings {
  soundEnabled: boolean;
  autoStart: boolean;
  notificationsEnabled: boolean; // New setting
}

interface SettingsContextType extends Settings { // Extend Settings
  updateSettings: (settings: Partial<SettingsContextType>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * The SettingsProvider component wraps your app and provides the settings context to all components.
 * It uses the useState hook to hold the current settings state and the updateSettings function to update it.
 * The value of the context is an object that contains the current settings and the updateSettings function.
 * The children prop is expected to contain your app's components that use the useSettings hook.
 */
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsContextType>({
    soundEnabled: true,
    autoStart: false,
    notificationsEnabled: true,
    updateSettings: (newSettings) => setSettings((prev) => ({ ...prev, ...newSettings })),
  });

  // Memoize the value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    ...settings,
    updateSettings: (newSettings: Partial<SettingsContextType>) => setSettings((prev) => ({ ...prev, ...newSettings })),
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