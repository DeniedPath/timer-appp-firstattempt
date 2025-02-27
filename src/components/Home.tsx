import { TimerState } from "@/components/timer/TimerState";
import { SettingsProvider } from "@/components/settings/SettingsContext";
import Particles from "@/components/backgrounds/Particles/Particles";

/**
 * Home component serves as the main entry point for the application.
 * It provides the overall layout and context providers needed for the app's functionality.
 * 
 * - Wraps the entire application within the SettingsProvider to supply settings context.
 * - Renders a full-screen div with a black background and a twinkling star effect.
 * - Embeds the Particles component to create a space-themed animated background.
 * - Includes the TimerState component to manage and display the timer functionality.
 */

export default function Home() {
  return (
    <SettingsProvider>
      <div className="relative min-h-screen bg-black overflow-hidden">
        <style jsx global>{`
          @keyframes twinkle {
            0% { opacity: 0.2; }
            50% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}</style>
        <div style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}>
          <Particles
            particleColors={['#ffffff', '#ffffff']}
            particleCount={1000}
            particleSpread={20}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={true}
          />
        </div>
        <TimerState />
      </div>
    </SettingsProvider>
  );
}