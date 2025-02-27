import { createContext, useContext, useState, ReactNode } from "react";

interface Settings {
  soundEnabled: boolean;
  autoStart: boolean;
  notificationsEnabled: boolean; // New setting
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * The SettingsProvider component wraps your app and provides the settings context to all components.
 * It uses the useState hook to hold the current settings state and the updateSettings function to update it.
 * The value of the context is an object that contains the current settings and the updateSettings function.
 * The children prop is expected to contain your app's components that use the useSettings hook.
 */
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: false,
    autoStart: false,
    notificationsEnabled: true, // Default to true
  });

  /**
   * Updates the settings state with the new values provided in `newSettings`.
   * Merges the new values with the current settings state, so you can update just one key.
   * @param newSettings - The new settings values to update.
   */
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};