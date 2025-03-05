import { useEffect, useRef, useCallback } from 'react';
import { useAchievements } from '@/components/achievements/AchievementsContext';

interface UseAchievementTrackerProps {
  isRunning: boolean;
  time: number;
  inputTime: string;
  progress: number;
  streak: number;
}

export const useAchievementTracker = ({
  isRunning,
  time,
  inputTime,
  progress,
  streak,
}: UseAchievementTrackerProps) => {
  const { achievements, unlockAchievement, updateProgress } = useAchievements();
  const clickTimestamps = useRef<number[]>([]);
  const sessionStartTime = useRef<Date | null>(null);
  
  // Store previous values to prevent unnecessary triggers
  const prevInputTime = useRef(inputTime);
  const prevIsRunning = useRef(isRunning);
  const prevProgress = useRef(progress);
  const prevStreak = useRef(streak);
  
  // Memoize achievement unlock function to prevent unnecessary re-renders
  const tryUnlockAchievement = useCallback((id: string) => {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      unlockAchievement(id);
    }
  }, [achievements, unlockAchievement]);
  
  // Track first timer achievement
  useEffect(() => {
    if (isRunning && !prevIsRunning.current) {
      tryUnlockAchievement('first_timer');
    }
    prevIsRunning.current = isRunning;
  }, [isRunning, tryUnlockAchievement]);

  // Track time-based achievements
  useEffect(() => {
    if (isRunning && !prevIsRunning.current) {
      const now = new Date();
      const hours = now.getHours();
      
      // Night Owl (after midnight)
      if (hours >= 0 && hours < 5) {
        tryUnlockAchievement('night_owl');
      }
      
      // Early Bird (before 6 AM)
      if (hours >= 5 && hours < 6) {
        tryUnlockAchievement('early_bird');
      }
      
      // Store session start time for midnight focus achievement
      sessionStartTime.current = now;
    }
    prevIsRunning.current = isRunning;
  }, [isRunning, tryUnlockAchievement]);

  // Track clicks for rapid clicker achievement
  useEffect(() => {
    if (prevIsRunning.current !== isRunning) {
      const now = Date.now();
      clickTimestamps.current.push(now);
      
      // Only keep clicks from the last 3 seconds
      clickTimestamps.current = clickTimestamps.current.filter(timestamp => now - timestamp < 3000);
      
      // Check for 5 clicks in 3 seconds
      if (clickTimestamps.current.length >= 5) {
        tryUnlockAchievement('rapid_clicker');
      }
    }
  }, [isRunning, tryUnlockAchievement]);

  // Track negative time achievement
  useEffect(() => {
    const inputTimeValue = parseInt(inputTime);
    if (inputTime !== prevInputTime.current && inputTimeValue < 0) {
      tryUnlockAchievement('negative_time');
    }
    prevInputTime.current = inputTime;
  }, [inputTime, tryUnlockAchievement]);

  // Track perfect timing achievement (42 minutes)
  useEffect(() => {
    const inputTimeValue = parseInt(inputTime);
    if (inputTime !== prevInputTime.current && inputTimeValue === 42) {
      tryUnlockAchievement('perfect_timing');
    }
    prevInputTime.current = inputTime;
  }, [inputTime, tryUnlockAchievement]);

  // Track streak achievement
  useEffect(() => {
    if (streak !== prevStreak.current && streak > 0) {
      const achievement = achievements.find(a => a.id === 'streak_master');
      if (achievement) {
        updateProgress('streak_master', streak);
      }
    }
    prevStreak.current = streak;
  }, [streak, achievements, updateProgress]);

  // Track marathon session and completed timer sessions
  useEffect(() => {
    // Only run when progress changes to 100%
    if (progress === 100 && prevProgress.current !== 100) {
      // Marathon achievement (60+ minutes)
      const inputMinutes = parseInt(inputTime);
      if (inputMinutes >= 60) {
        tryUnlockAchievement('space_marathoner');
      }
      
      // Time traveler achievement
      const timeTravelerAchievement = achievements.find(a => a.id === 'time_traveler');
      if (timeTravelerAchievement) {
        const newProgress = (timeTravelerAchievement.progress || 0) + 1;
        updateProgress('time_traveler', newProgress);
      }

      // Check for midnight focus achievement
      if (sessionStartTime.current) {
        const sessionStart = sessionStartTime.current;
        const now = new Date();
        const startDay = sessionStart.getDate();
        const endDay = now.getDate();

        if (startDay !== endDay) {
          tryUnlockAchievement('midnight_focus');
        }

        sessionStartTime.current = null;
      }
    }
    prevProgress.current = progress;
  }, [progress, inputTime, achievements, updateProgress, tryUnlockAchievement]);
};