import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";
import { useSettings } from "./SettingsContext";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { settings, updateSettings } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 100 }}
      className="fixed right-0 top-0 h-full w-64 bg-gray-800 p-4 text-white"
    >
      <div className="flex items-center gap-2 mb-4">
        <Settings2 />
        <h2>Settings</h2>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={e => updateSettings({ soundEnabled: e.target.checked })}
          />
          Sound on Completion
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.autoStart}
            onChange={e => updateSettings({ autoStart: e.target.checked })}
          />
          Auto Start Next Session
        </label>
      </div>
      
      <button
        onClick={onClose}
        className="mt-4 bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
      >
        Close
      </button>
    </motion.div>
  );
};