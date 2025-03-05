import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useCallback } from "react";

interface SettingsButtonProps {
  onClick: () => void;
}

/**
 * SettingsButton component displays a button for accessing application settings.
 * It matches the style of the AchievementButton for visual consistency.
 * 
 * The button subtly pulses to attract attention.
 */
export const SettingsButton = ({ onClick }: SettingsButtonProps) => {
  // Ensure we have a stable click handler
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  }, [onClick]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              scale: [1, 1.05, 1], 
              boxShadow: [
                "0 0 0 rgba(100, 149, 237, 0)",
                "0 0 8px rgba(100, 149, 237, 0.6)",
                "0 0 0 rgba(100, 149, 237, 0)"
              ] 
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "loop"
            }}
            onClick={handleClick}
            className="absolute top-4 left-4 bg-gray-800 bg-opacity-80 p-2 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer z-50"
            type="button"
          >
            <Settings className="text-blue-400" size={24} />
            <span className="ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
              Settings
            </span>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Adjust Timer Settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};