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
import { AchievementButton } from "../achievements/AchievementButton";
import { SettingsButton } from "../settings/SettingsButton";
import { AchievementUnlockNotification } from "../achievements/AchievementUnlockNotification";

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

  const handleAchievementsOpen = useCallback(() => {
    console.log("Opening achievements panel");
    setIsAchievementsOpen(true);
  }, []);

  const handleAchievementsClose = useCallback(() => {
    console.log("Closing achievements panel");
    setIsAchievementsOpen(false);
  }, []);

  const handleSettingsOpen = useCallback(() => {
    setIsSettingsOpen(true);
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

      {/* Settings Button */}
      <SettingsButton onClick={handleSettingsOpen} />

      {/* Achievement Button */}
      <AchievementButton onClick={handleAchievementsOpen} />
      
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