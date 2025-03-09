import { useState, useEffect } from "react";
import { useSettings } from "../components/context/SettingsContext";
import { useAnalytics } from "./useAnalytics";
import { toast } from "sonner";

interface TimerOptions {
  onComplete?: (duration: number) => void;
  initialDuration?: number;
}

// Helper function to format time
const formatTimeHelper = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

export const useTimer = ({ onComplete, initialDuration = 0 }: TimerOptions) => {
  const { settings } = useSettings();
  const [time, setTime] = useState<number>(0);
  const [inputTime, setInputTime] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [currentDuration, setCurrentDuration] = useState<number>(0);

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
    
    const duration = currentDuration;
    addSession(duration, true);
    
    // Toggle break mode if auto-break is enabled
    if (settings.autoBreakEnabled && !isBreak) {
      setIsBreak(true);
      const breakMinutes = settings.breakDuration;
      const breakDuration = breakMinutes * 60;
      setCurrentDuration(breakDuration);
      setTime(breakDuration);
      setInputTime(formatTimeHelper(breakDuration));
      
      // Auto-start break timer if enabled
      if (settings.autoStart) {
        setIsRunning(true);
      }
    } else {
      // Reset to focus mode
      setIsBreak(false);
      setCurrentDuration(initialDuration);
      setTime(initialDuration);
      setInputTime(formatTimeHelper(initialDuration));
      
      // Auto-start next focus session if enabled
      if (settings.autoStart) {
        setIsRunning(true);
      }
    }
    
    if (settings.notificationsEnabled) {
      toast.success(isBreak ? "Break time over!" : "Focus session complete!", {
        duration: 3000,
        style: {
          background: "rgba(26, 26, 61, 0.8)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(4px)",
        },
      });
    }
    
    if (onComplete) onComplete(duration);
  };

  const startTimer = (): void => {
    // Parse the input time, handling both "MM" and "MM:SS" formats
    let seconds = 0;
    if (inputTime.includes(':')) {
      const [minutes, secs] = inputTime.split(':').map(num => parseInt(num) || 0);
      seconds = (minutes * 60) + secs;
    } else {
      seconds = (parseInt(inputTime) || 0) * 60;
    }
    
    setTime(seconds);
    setCurrentDuration(seconds);
    setIsRunning(true);
    
    if (settings.notificationsEnabled) {
      toast.info(isBreak ? "Break started" : "Focus session started", {
        duration: 3000,
        style: {
          background: "rgba(26, 26, 61, 0.8)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(4px)",
        },
      });
    }
  };

  const stopTimer = (): void => {
    setIsRunning(false);
    if (settings.notificationsEnabled) {
      toast.info("Timer paused", {
        duration: 3000,
        style: {
          background: "rgba(26, 26, 61, 0.8)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(4px)",
        },
      });
    }
  };

  const continueTimer = (): void => {
    if (time > 0) {
      setIsRunning(true);
      if (settings.notificationsEnabled) {
        toast.info("Timer resumed", {
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

  const resetTimer = (): void => {
    setIsRunning(false);
    setTime(0);
    setInputTime("");
    setCurrentDuration(0);
    if (time > 0) addSession(time, false);
    if (settings.notificationsEnabled) {
      toast.info("Timer reset", {
        duration: 3000,
        style: {
          background: "rgba(26, 26, 61, 0.8)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(4px)",
        },
      });
    }
  };

  const progress = currentDuration > 0 
    ? ((currentDuration - time) / currentDuration) * 100 
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

  if (!settings) {
    throw new Error("Settings context is not available");
  }

  return {
    time,
    inputTime,
    setInputTime,
    isRunning,
    soundEnabled,
    setSoundEnabled: () => setSoundEnabled(prev => !prev),
    startTimer,
    stopTimer,
    continueTimer,
    resetTimer,
    formatTime: () => formatTimeHelper(time),
    progress,
    initialDuration: currentDuration,
    isBreak,
    setIsBreak,
  };
};