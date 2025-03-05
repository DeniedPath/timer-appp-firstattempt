import { TimerState } from "@/components/timer/TimerState";
import { SettingsProvider } from "@/components/context/SettingsContext";
import { AchievementsProvider } from "@/components/achievements/AchievementsContext";
import Particles from "@/components/backgrounds/Particles/Particles";
import { useMemo } from "react";

/**
 * The home page of the application, containing the timer and settings components.
 * It wraps the timer with both the SettingsProvider and AchievementsProvider
 * components to provide the necessary contexts to the timer.
 *
 * The space-themed background is created using the Particles component.
 */
export default function Home() {
  // Memoize the particle props to prevent unnecessary re-renders
  const particleProps = useMemo(() => ({
    particleColors: ['#ffffff', '#ffffff'],
    particleCount: 1000,
    particleSpread: 20,
    speed: 0.1,
    particleBaseSize: 100,
    moveParticlesOnHover: true,
    alphaParticles: false,
    disableRotation: true 
  }), []);

  return (
    <SettingsProvider>
      <AchievementsProvider>
        <div className="relative min-h-screen bg-black overflow-hidden">
          <style jsx global>{`
            @keyframes twinkle {
              0% { opacity: 0.2; }
              50% { opacity: 1; }
              100% { opacity: 0.2; }
            }
          `}</style>
          <div style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}>
            <Particles {...particleProps} />
          </div>
          <TimerState />
        </div>
      </AchievementsProvider>
    </SettingsProvider>
  );
}