import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { useCallback } from "react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SettingsPanel component displays a panel for user settings configuration.
 * It provides options to enable/disable sound on completion, auto-start the next session,
 * and enable/disable notifications. The panel is animated and slides in from the left
 * when opened. The component uses the `useSettings` hook to access and update settings.
 *
 * Props:
 * - isOpen (boolean): Determines if the settings panel is open.
 * - onClose (function): Callback function to close the settings panel.
 */

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { settings, updateSettings } = useSettings();
  
  const handleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
  }, [onClose]);

  // Toggle handlers for each setting
  const toggleSound = useCallback(() => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  }, [settings.soundEnabled, updateSettings]);

  const toggleAutoStart = useCallback(() => {
    updateSettings({ autoStart: !settings.autoStart });
  }, [settings.autoStart, updateSettings]);

  const toggleNotifications = useCallback(() => {
    updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
  }, [settings.notificationsEnabled, updateSettings]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ 
        opacity: isOpen ? 1 : 0, 
        x: isOpen ? 0 : -100,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      }}
      className={`fixed left-0 top-0 h-full w-64 bg-gray-800 p-4 text-white ${isOpen ? 'block' : 'pointer-events-none'}`}
      style={{ zIndex: 1000 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="text-blue-400" />
        <h2 className="text-xl font-bold">Settings</h2>
      </div>
      
      <div className="space-y-5">
        <label className="flex items-center gap-3 cursor-pointer group" onClick={toggleSound}>
          <div className={`w-10 h-6 rounded-full flex items-center ${settings.soundEnabled ? 'bg-blue-500' : 'bg-gray-600'} transition-colors duration-200 p-1`}>
            <motion.div 
              className="w-4 h-4 bg-white rounded-full" 
              animate={{ x: settings.soundEnabled ? 16 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
          <span className="group-hover:text-blue-300 transition-colors">Sound on Completion</span>
        </label>
        
        <label className="flex items-center gap-3 cursor-pointer group" onClick={toggleAutoStart}>
          <div className={`w-10 h-6 rounded-full flex items-center ${settings.autoStart ? 'bg-blue-500' : 'bg-gray-600'} transition-colors duration-200 p-1`}>
            <motion.div 
              className="w-4 h-4 bg-white rounded-full" 
              animate={{ x: settings.autoStart ? 16 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
          <span className="group-hover:text-blue-300 transition-colors">Auto Start Next Session</span>
        </label>
        
        <label className="flex items-center gap-3 cursor-pointer group" onClick={toggleNotifications}>
          <div className={`w-10 h-6 rounded-full flex items-center ${settings.notificationsEnabled ? 'bg-blue-500' : 'bg-gray-600'} transition-colors duration-200 p-1`}>
            <motion.div 
              className="w-4 h-4 bg-white rounded-full" 
              animate={{ x: settings.notificationsEnabled ? 16 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
          <span className="group-hover:text-blue-300 transition-colors">Enable Notifications</span>
        </label>
      </div>
      
      <div className="absolute bottom-4 left-0 w-full px-4">
        <button
          onClick={handleClose}
          className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-md transition-colors"
          type="button"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};