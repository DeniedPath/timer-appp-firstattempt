import { useState } from "react";
import { useTimer } from "../../hooks/useTimer";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useNotifications } from "../../hooks/useNotifications";
import { TimerDisplay } from "./TimerDisplay";
import { TimerControls } from "./TimerControls";
import { StreakCounter } from "../analytics/StreakCounter";
import { SessionStats } from "../analytics/SessionStats";
import { ProgressIndicator } from "../analytics/ProgressIndicator";
import { NotificationSystem } from "../feedback/NotificationSystem";
import { SettingsPanel } from "../settings/SettingsPanel";
import { useSettings } from "../settings/SettingsContext";

export const TimerState = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings } = useSettings();
  const { addSession, sessions, getStreak } = useAnalytics();
  const { addNotification } = useNotifications();
  
  const timer = useTimer({
    onComplete: (duration: number) => {
      addSession(duration, true);
      addNotification("Timer completed!", "success");
    },
    soundEnabled: settings.soundEnabled
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
      <NotificationSystem />
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};