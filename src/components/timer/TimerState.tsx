import { useState } from "react";
import { Toaster } from "@/components/ui/sonner"; // Import Sonner Toaster
import { useTimer } from "../../hooks/useTimer";
import { useAnalytics } from "../../hooks/useAnalytics";
import { TimerDisplay } from "./TimerDisplay";
import { TimerControls } from "./TimerControls";
import { StreakCounter } from "../analytics/StreakCounter";
import { SessionStats } from "../analytics/SessionStats";
import { ProgressIndicator } from "../analytics/ProgressIndicator";
import { SettingsPanel } from "../settings/SettingsPanel";

export const TimerState = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { addSession, sessions, getStreak } = useAnalytics();

  const timer = useTimer({
    onComplete: (duration: number) => {
      addSession(duration, true);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white relative z-10">
      <div className="w-full max-w-2xl space-y-6">
        <StreakCounter streak={getStreak()} />
        <TimerDisplay
          formattedTime={timer.formatTime()}
          isRunning={timer.isRunning}
          progress={timer.progress}
        />
        <TimerControls
          {...timer}
          setIsSettingsOpen={setIsSettingsOpen}
        />
        <ProgressIndicator value={timer.progress} />
        <SessionStats sessions={sessions} />
      </div>
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
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};