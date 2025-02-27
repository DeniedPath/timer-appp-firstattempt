import { TimerState } from "@/components/timer/TimerState";
import { SettingsProvider } from "@/components/settings/SettingsContext";
import Particles from "@/components/backgrounds/Particles/Particles";

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