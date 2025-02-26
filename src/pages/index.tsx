import { TimerState } from "@/components/timer/TimerState";
import { SettingsProvider } from "@/components/settings/SettingsContext";


export default function Home() {
  const stars = Array.from({ length: 100 }).map((_, i) => (
    <div
      key={i}
      className="stars"
      style={{
        position: "absolute",
        width: "2px",
        height: "2px",
        background: "white",
        borderRadius: "50%",
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `twinkle ${Math.random() * 3 + 1}s infinite`,
        animationDelay: `${Math.random() * 3}s`,
      }}
    />
  ));

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
        <div className="absolute inset-0">{stars}</div>
        
        <TimerState />
      </div>
    </SettingsProvider>
  );
}