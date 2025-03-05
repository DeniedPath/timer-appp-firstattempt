import { TimerState } from "@/components/timer/TimerState";
import { SettingsProvider } from "@/components/context/SettingsContext";
import { AchievementsProvider } from "@/components/achievements/AchievementsContext";
import { useSettings } from "@/components/context/SettingsContext";
import Particles from "@/components/backgrounds/Particles/Particles";
import { useMemo } from "react";
import dynamic from "next/dynamic";

// Dynamically import the SolarSystemBackground with no SSR to prevent hydration issues
const DynamicSolarSystemBackground = dynamic(
  () => import("@/components/backgrounds/SolarSystem/SolarSystemBackground"),
  { ssr: false }
);

/**
 * BackgroundSelector component that renders the appropriate background
 * based on the selected theme in settings
 */
const BackgroundSelector = () => {
  const { settings } = useSettings();
  
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

  // Render the appropriate background based on settings
  if (settings.backgroundTheme === 'Particles') {
    return (
      <div style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}>
        <Particles {...particleProps} />
      </div>
    );
  } else {
    // For Solar System or planet views
    const planetFocus = settings.backgroundTheme;
    return <DynamicSolarSystemBackground planetFocus={planetFocus} />;
  }
};

/**
 * The home page of the application, containing the timer and settings components.
 * It wraps the timer with both the SettingsProvider and AchievementsProvider
 * components to provide the necessary contexts to the timer.
 *
 * Based on the user's settings, it displays either the particle background or
 * the solar system background.
 */
export default function Home() {
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
          
          {/* The BackgroundSelector component will choose the correct background */}
          <BackgroundSelector />
          
          {/* Timer state is rendered above the background */}
          <TimerState />
        </div>
      </AchievementsProvider>
    </SettingsProvider>
  );
}