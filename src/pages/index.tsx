import Timer from "@/components/Timer";
import { motion } from "framer-motion";

/**
 * Home component that renders a full-screen view.
 * 
 * This component generates a background with 100 randomly positioned and animated stars.
 * It also includes a Timer component.
 * 
 * Each star is an absolutely positioned div with a twinkling animation.
 */

export default function Home() {
  // Generate random stars
  const stars = Array.from({ length: 100 }).map((_, i) => (
    <div
      key={i}
      className="stars"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
      }}
    />
  ));

  return (
    <div className="relative min-h-screen">
      <div className="space-background">{stars}</div>
      {/* Rotating Planet/Comet */}
      <motion.div
        className="absolute w-16 h-16 bg-yellow-500 rounded-full opacity-50"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ top: "20%", left: "20%" }}
      />
      <Timer />
    </div>
  );
}