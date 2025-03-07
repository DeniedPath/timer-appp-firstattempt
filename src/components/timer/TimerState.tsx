import { useState, useCallback, memo } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useTimer } from "@/hooks/useTimer";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAchievementTracker } from "@/hooks/useAchievementTracker";
import { useAchievements } from "../achievements/AchievementsContext";
import { TimerDisplay } from "./TimerDisplay";
import { TimerControls } from "./TimerControls";
import { StreakCounter } from "../analytics/StreakCounter";
import { SessionStats } from "../analytics/SessionStats";
import { ProgressIndicator } from "../analytics/ProgressIndicator";
import { SettingsPanel } from "../settings/SettingsPanel";
import { AchievementsPanel } from "../achievements/AchievementsPanel";
import { AchievementUnlockNotification } from "../achievements/AchievementUnlockNotification";
import { BreathingGuidance } from "../features/BreathingGuidance";
import { BarChart2, Menu, Settings, Trophy } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";

// Memoize components that shouldn't re-render often
const MemoizedSessionStats = memo(SessionStats);
const MemoizedStreakCounter = memo(StreakCounter);

/**
 * TimerState component manages the state and functionality of the timer application.
 * It integrates various sub-components, including TimerDisplay, TimerControls,
 * StreakCounter, ProgressIndicator, SessionStats, and achievements to provide 
 * a comprehensive timer interface. The component utilizes the useTimer hook for 
 * timer operations, the useAnalytics hook for session tracking and streak management,
 * and the useAchievementTracker hook to track and unlock achievements.
 */
export const TimerState = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { addSession, sessions, getStreak } = useAnalytics();

  const timer = useTimer({
    onComplete: (duration: number) => {
      addSession(duration, true);
    },
  });

  const streak = getStreak();
  const { recentUnlock, dismissRecentUnlock } = useAchievements();

  // Use callbacks for handlers to prevent unnecessary re-renders
  const handleSettingsClose = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const handleAchievementsClose = useCallback(() => {
    setIsAchievementsOpen(false);
  }, []);

  const handleDismissUnlock = useCallback(() => {
    dismissRecentUnlock();
  }, [dismissRecentUnlock]);

  // Track achievements with the custom hook
  useAchievementTracker({
    isRunning: timer.isRunning,
    time: timer.time,
    inputTime: timer.inputTime,
    progress: timer.progress,
    streak,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white relative z-10">
      <div className="w-full max-w-2xl space-y-6">
        <MemoizedStreakCounter streak={streak} />
        <TimerDisplay
          formattedTime={timer.formatTime()}
          isRunning={timer.isRunning}
          progress={timer.progress}
        />
        <TimerControls
          {...timer}
        />
        <ProgressIndicator value={timer.progress} />
        <MemoizedSessionStats sessions={sessions} />
      </div>

      {/* Breathing Guidance */}
      <BreathingGuidance 
        isTimerRunning={timer.isRunning} 
        isBreak={false} // You'll need to track break state in your timer
      />

      {/* Menu Button and Dropdown */}
      <div className="absolute top-4 left-4 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-800 bg-opacity-80 p-2 rounded-full flex items-center justify-center backdrop-blur-sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="text-white" size={24} />
        </motion.button>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 top-12 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-2 space-y-2 w-40"
            >
              <button 
                className="w-full flex items-center p-2 hover:bg-gray-700 rounded text-left"
                onClick={() => {
                  setIsSettingsOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <Settings className="text-blue-400 mr-2" size={18} />
                <span className="text-white text-sm">Settings</span>
              </button>
              
              <Link href="/analytics" className="w-full flex items-center p-2 hover:bg-gray-700 rounded text-left">
                <BarChart2 className="text-blue-400 mr-2" size={18} />
                <span className="text-white text-sm">Analytics</span>
              </Link>
              
              <button 
                className="w-full flex items-center p-2 hover:bg-gray-700 rounded text-left"
                onClick={() => {
                  setIsAchievementsOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <Trophy className="text-yellow-400 mr-2" size={18} />
                <span className="text-white text-sm">Achievements</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Achievement Unlock Notification */}
      {recentUnlock && (
        <AchievementUnlockNotification
          name={recentUnlock.achievement.name}
          description={recentUnlock.achievement.description}
          icon={recentUnlock.achievement.icon}
          isSecret={recentUnlock.achievement.isSecret}
          onComplete={handleDismissUnlock}
        />
      )}

      {/* Notifications */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(26, 26, 61, 0.8)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(4px)",
          },
        }}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
      />

      {/* Achievements Panel */}
      <AchievementsPanel 
        isOpen={isAchievementsOpen}
        onClose={handleAchievementsClose}
      />
    </div>
  );
};