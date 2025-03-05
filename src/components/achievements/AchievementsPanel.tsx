import { motion } from "framer-motion";
import { Trophy, Info } from "lucide-react";
import { useAchievements, Achievement } from "./AchievementsContext";
import { Progress } from "../ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useCallback } from "react";

interface AchievementsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AchievementsPanel component displays a panel showing all the user's achievements.
 * It slides in from the right when opened and shows both unlocked and locked achievements.
 * Secret achievements are only shown once they're unlocked.
 *
 * Props:
 * - isOpen (boolean): Determines if the achievements panel is open.
 * - onClose (function): Callback function to close the achievements panel.
 */
export const AchievementsPanel = ({ isOpen, onClose }: AchievementsPanelProps) => {
  const { achievements, totalUnlocked, totalAchievements } = useAchievements();

  // Stable close handler
  const handleClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
  }, [onClose]);

  // Sort achievements: unlocked first (by unlock date), then non-secret locked ones
  const sortedAchievements = [...achievements].sort((a, b) => {
    // Unlocked achievements at the top
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    
    // If both unlocked, sort by unlock date (most recent first)
    if (a.unlocked && b.unlocked) {
      const dateA = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
      const dateB = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;
      return dateB - dateA;
    }
    
    // If both locked, show non-secret ones first
    if (!a.unlocked && !b.unlocked) {
      if (a.isSecret && !b.isSecret) return 1;
      if (!a.isSecret && b.isSecret) return -1;
    }
    
    return 0;
  });

  const AchievementItem = ({ achievement }: { achievement: Achievement }) => {
    // Don't show secret achievements that are still locked
    if (achievement.isSecret && !achievement.unlocked) {
      return (
        <div className="achievement-item p-3 bg-gray-900 bg-opacity-50 rounded-lg flex items-center gap-3 opacity-60">
          <div className="achievement-icon w-10 h-10 flex items-center justify-center text-2xl bg-gray-800 rounded-full">
            ?
          </div>
          <div className="achievement-info flex-1">
            <h3 className="text-sm font-medium">Secret Achievement</h3>
            <p className="text-xs text-gray-400">Keep exploring to unlock this achievement</p>
          </div>
        </div>
      );
    }

    const isLocked = !achievement.unlocked;
    const hasProgress = achievement.progress !== undefined && achievement.maxProgress !== undefined;
    const progressPercentage = hasProgress ? (achievement.progress! / achievement.maxProgress!) * 100 : 0;

    return (
      <div className={`achievement-item p-3 ${isLocked ? 'bg-gray-900 bg-opacity-50' : 'bg-gray-800'} rounded-lg flex items-center gap-3 ${isLocked ? 'opacity-60' : 'opacity-100'}`}>
        <div className={`achievement-icon w-10 h-10 flex items-center justify-center text-2xl ${isLocked ? 'bg-gray-700' : 'bg-blue-800'} rounded-full`}>
          {achievement.icon}
        </div>
        <div className="achievement-info flex-1">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-medium">{achievement.name}</h3>
            {achievement.isSecret && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info size={14} className="text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Secret Achievement</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className="text-xs text-gray-400">{achievement.description}</p>
          {hasProgress && !achievement.unlocked && (
            <div className="mt-1">
              <Progress value={progressPercentage} className="h-1" />
              <p className="text-xs text-gray-400 mt-1">{achievement.progress} / {achievement.maxProgress}</p>
            </div>
          )}
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-blue-400 mt-1">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed right-0 top-0 h-full w-80 bg-gray-800 p-4 text-white overflow-y-auto ${isOpen ? 'block' : 'pointer-events-none'}`}
        style={{ zIndex: 1000 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-yellow-400" />
          <h2 className="text-xl font-bold">Achievements</h2>
        </div>

        <div className="mb-4 bg-gray-900 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span>Progress</span>
            <span className="text-yellow-400">{totalUnlocked} / {totalAchievements}</span>
          </div>
          <Progress value={(totalUnlocked / totalAchievements) * 100} className="h-2" />
        </div>
        
        <div className="achievements-grid space-y-3">
          {sortedAchievements.map(achievement => (
            <AchievementItem key={achievement.id} achievement={achievement} />
          ))}
        </div>
        
        <button
          onClick={handleClose}
          className="mt-6 bg-gray-600 px-4 py-2 rounded w-full hover:bg-gray-700 transition-colors"
          type="button"
        >
          Close
        </button>
      </motion.div>
    </TooltipProvider>
  );
};