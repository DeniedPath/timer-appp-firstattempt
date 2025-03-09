import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface Settings {
  soundEnabled: boolean;
  autoStart: boolean;
  notificationsEnabled: boolean;
  backgroundTheme: string;
  breathingGuidanceEnabled: boolean;
  spaceFactsEnabled: boolean;      // New setting
  spaceFactsFrequency: number;     // In minutes
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Get settings from localStorage (client-side only)
const getStoredSettings = (): Settings | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('timer_settings');
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

// Default settings
const defaultSettings: Settings = {
  soundEnabled: true,
  autoStart: false,
  notificationsEnabled: true,
  backgroundTheme: 'Particles',
  breathingGuidanceEnabled: false,
  spaceFactsEnabled: true,         // Enabled by default
  spaceFactsFrequency: 5,          // Show a fact every 5 minutes by default
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with default settings, then load from localStorage after mounting
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isClient, setIsClient] = useState(false);

  // After component mounts (client-side only), load from localStorage
  useEffect(() => {
    setIsClient(true);
    const storedSettings = getStoredSettings();
    if (storedSettings) {
      setSettings(storedSettings);
    }
  }, []);

  // Save settings to localStorage when they change (client-side only)
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('timer_settings', JSON.stringify(settings));
    }
  }, [settings, isClient]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      console.log('Updating settings:', { ...prev, ...newSettings });
      return { ...prev, ...newSettings };
    });
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

// Update in src/components/context/SettingsContext.tsx

// Add to Settings interface
interface Settings {
  soundEnabled: boolean;
  autoStart: boolean;
  notificationsEnabled: boolean;
  backgroundTheme: string;
  breathingGuidanceEnabled: boolean; // New setting
}

