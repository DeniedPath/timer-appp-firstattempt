import { TimerState } from "@/components/timer/TimerState";
import { SettingsProvider } from "@/components/settings/SettingsContext";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function Home() {
  const stars = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => (
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
  }, []);

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
        <motion.div
          className="absolute w-16 h-16 bg-yellow-500 rounded-full opacity-50"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ top: "20%", left: "20%", zIndex: 5 }}
        />
        <TimerState />
      </div>
    </SettingsProvider>
  );
}