import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useAchievements } from "./AchievementsContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useCallback } from "react";

interface AchievementButtonProps {
  onClick: () => void;
}

/**
 * AchievementButton component displays a button showing the user's achievement progress.
 * When clicked, it opens the achievements panel.
 * 
 * The button subtly pulses when a new achievement is unlocked to attract attention.
 */
export const AchievementButton = ({ onClick }: AchievementButtonProps) => {
  const { totalUnlocked, totalAchievements } = useAchievements();
  
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
              scale: [1, 1.1, 1], 
              boxShadow: [
                "0 0 0 rgba(255, 215, 0, 0)",
                "0 0 8px rgba(255, 215, 0, 0.8)",
                "0 0 0 rgba(255, 215, 0, 0)"
              ] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
            onClick={handleClick}
            className="absolute top-4 right-4 bg-gray-800 bg-opacity-80 p-2 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer z-50"
            type="button"
          >
            <Trophy className="text-yellow-400" size={24} />
            <span className="ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
              {totalUnlocked}/{totalAchievements}
            </span>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Achievements</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};