import { motion } from "framer-motion";
import { Settings2, Globe, Sun } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { useCallback, useState } from "react";
import { PLANET_OPTIONS } from "../backgrounds/SolarSystem/SolarSystemBackground";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * SettingsPanel component displays a panel for user settings configuration.
 * It provides options to enable/disable sound on completion, auto-start the next session,
 * enable/disable notifications, and select the background theme.
 * The panel is animated and slides in from the left when opened.
 */
export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { settings, updateSettings } = useSettings();
  
  // Track if background section is expanded
  const [isBackgroundExpanded, setIsBackgroundExpanded] = useState(false);

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

  // Set background theme
  const setBackgroundTheme = useCallback((theme: string) => {
    updateSettings({ backgroundTheme: theme });
  }, [updateSettings]);

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
      className={`fixed left-0 top-0 h-full w-72 bg-gray-800 p-4 text-white ${isOpen ? 'block' : 'pointer-events-none'}`}
      style={{ zIndex: 1000 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="text-blue-400" />
        <h2 className="text-xl font-bold">Settings</h2>
      </div>
      
      <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-10rem)]">
        {/* General Settings */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-blue-300">General Settings</h3>
          
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
        
        {/* Background Theme Settings */}
        <div className="space-y-4 border-t border-gray-700 pt-4">
          <div 
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setIsBackgroundExpanded(!isBackgroundExpanded)}
          >
            <div className="flex items-center gap-2">
              <Globe className="text-blue-400" size={18} />
              <h3 className="text-md font-semibold text-blue-300">Background Theme</h3>
            </div>
            <motion.div
              animate={{ rotate: isBackgroundExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isBackgroundExpanded ? 'auto' : 0,
              opacity: isBackgroundExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="space-y-3 p-2">
              {/* Background options */}
              <div 
                className={`p-2 rounded cursor-pointer flex items-center gap-2 ${settings.backgroundTheme === 'Particles' ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                onClick={() => setBackgroundTheme('Particles')}
              >
                <div className={`w-4 h-4 rounded-full border-2 ${settings.backgroundTheme === 'Particles' ? 'border-blue-400 bg-blue-400' : 'border-gray-400'}`} />
                <span>Stars Particles</span>
              </div>
              
              {/* Solar System Overview option */}
              <div 
                className={`p-2 rounded cursor-pointer flex items-center gap-2 ${settings.backgroundTheme === 'Overview' ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                onClick={() => setBackgroundTheme('Overview')}
              >
                <div className={`w-4 h-4 rounded-full border-2 ${settings.backgroundTheme === 'Overview' ? 'border-blue-400 bg-blue-400' : 'border-gray-400'}`} />
                <span>Solar System View</span>
              </div>
              
              {/* Planet options */}
              <div className="ml-4 space-y-2 mt-2">
                <h4 className="text-sm text-gray-400">Planet Focus</h4>
                {PLANET_OPTIONS.slice(1).map((planet) => (
                  <div 
                    key={planet}
                    className={`p-2 rounded cursor-pointer flex items-center gap-2 ${settings.backgroundTheme === planet ? 'bg-blue-900' : 'hover:bg-gray-700'}`}
                    onClick={() => setBackgroundTheme(planet)}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 ${settings.backgroundTheme === planet ? 'border-blue-400 bg-blue-400' : 'border-gray-400'}`} />
                    <span>{planet}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
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