import { useState, useEffect } from "react";
import { useSettings } from "../components/settings/SettingsContext";
import { useAnalytics } from "./useAnalytics";
import { useNotifications } from "./useNotifications";

interface TimerOptions {
  onComplete?: (duration: number) => void;
  soundEnabled: boolean;
}

export const useTimer = (options: TimerOptions = { soundEnabled: false }) => {
  // State
  const [time, setTime] = useState<number>(0);
  const [inputTime, setInputTime] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [initialDuration, setInitialDuration] = useState<number>(0);

  // External hooks
  const { settings } = useSettings();
  const { addSession } = useAnalytics();
  const { addNotification } = useNotifications();

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            handleTimerComplete();
          }
          return newTime > 0 ? newTime : 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  
  // Handle timer completion
  const handleTimerComplete = () => {
    setIsRunning(false);
    if (settings.soundEnabled) {
      playSound();
    }
    const duration = initialDuration;
    addSession(duration, true);
    addNotification("Timer completed successfully!", "success");
    options.onComplete?.(duration);
    
    if (settings.autoStart && inputTime) {
      startTimer(); // Auto-start next session
    }
  };

  // Control functions
  const startTimer = (): void => {
    const minutes = parseInt(inputTime) || 0;
    const seconds = minutes * 60;
    setInitialDuration(seconds);
    setTime(seconds);
    setIsRunning(true);
    addNotification("Timer started", "info");
  };

  const stopTimer = (): void => {
    setIsRunning(false);
    addNotification("Timer paused", "info");
  };

  const continueTimer = (): void => {
    if (time > 0) {
      setIsRunning(true);
      addNotification("Timer resumed", "info");
    }
  };

  const resetTimer = (): void => {
    setIsRunning(false);
    setTime(0);
    setInitialDuration(0);
    setInputTime("");
    addSession(time, false); // Record incomplete session
    addNotification("Timer reset", "info");
  };

  // Utility functions
  const formatTime = (): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const progress = initialDuration > 0 
    ? ((initialDuration - time) / initialDuration) * 100 
    : 0;

  // Sound playback
  const playSound = async (): Promise<void> => {
    try {
      const audio = new Audio("./public/sound.mp3");
      await audio.play();
    } catch (error) {
      console.error("Failed to play sound:", error);
      addNotification("Failed to play completion sound", "error");
    }
  };

  return {
    time,
    inputTime,
    setInputTime,
    isRunning,
    soundEnabled: settings.soundEnabled,
    startTimer,
    stopTimer,
    continueTimer,
    resetTimer,
    formatTime,
    progress,
    initialDuration
  };
};
