import { useState, useEffect } from "react";
import { useSettings } from "../components/settings/SettingsContext";
import { useAnalytics } from "./useAnalytics";
import { toast } from "sonner"; // Import the toast method from sonner

interface TimerOptions {
  onComplete?: (duration: number) => void;
}

export const useTimer = (options: TimerOptions = {}) => {
  const [time, setTime] = useState<number>(0);
  const [inputTime, setInputTime] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [initialDuration, setInitialDuration] = useState<number>(0);

  const { settings } = useSettings();
  const { addSession } = useAnalytics();

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            handleTimerComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, time]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (settings.soundEnabled) {
      playSound();
    }
    const duration = initialDuration;
    addSession(duration, true);
    if (settings.notificationsEnabled) { // Check setting before showing toast
      toast.success("Timer Done!", {
        duration: 3000,
        style: {
          background: "rgba(26, 26, 61, 0.8)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(4px)",
        },
      });
    }
    if (options.onComplete) options.onComplete(duration);
    if (settings.autoStart && inputTime) {
      startTimer();
    }
  };

  const startTimer = (): void => {
    const minutes = parseInt(inputTime) || 0;
    const seconds = minutes * 60;
    setInitialDuration(seconds);
    setTime(seconds);
    setIsRunning(true);
  };

  const stopTimer = (): void => {
    setIsRunning(false);
  };

  const continueTimer = (): void => {
    if (time > 0) {
      setIsRunning(true);
    }
  };

  const resetTimer = (): void => {
    setIsRunning(false);
    setTime(0);
    setInitialDuration(0);
    setInputTime("");
    if (time > 0) addSession(time, false);
  };

  const formatTime = (): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const progress = initialDuration > 0 
    ? ((initialDuration - time) / initialDuration) * 100 
    : 0;

  const playSound = async (): Promise<void> => {
    try {
      const audio = new Audio("/sound.mp3");
      await audio.play();
    } catch (error) {
      console.error("Failed to play sound:", error);
      if (settings.notificationsEnabled) {
        toast.error("Failed to play sound", {
          duration: 3000,
          style: {
            background: "rgba(26, 26, 61, 0.8)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(4px)",
          },
        });
      }
    }
  };

  return {
    time,
    inputTime,
    setInputTime,
    isRunning,
    soundEnabled: settings.soundEnabled,
    setSoundEnabled: () => {},
    startTimer,
    stopTimer,
    continueTimer,
    resetTimer,
    formatTime,
    progress,
    initialDuration,
  };
};