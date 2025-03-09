// src/components/features/celestial-events/CometPass.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface CometPassProps {
  intensity: 'low' | 'medium' | 'high';
}

const CometPass: React.FC<CometPassProps> = ({ intensity }) => {
  // Adjust parameters based on intensity
  const tailLength = intensity === 'high' ? 300 : intensity === 'medium' ? 200 : 150;
  const cometSize = intensity === 'high' ? 8 : intensity === 'medium' ? 6 : 4;
  const duration = intensity === 'high' ? 10 : intensity === 'medium' ? 8 : 6;
  
  // Random trajectory
  const startX = -20;
  const startY = Math.random() * 40 + 10; // 10% to 50% from top
  const endX = 120;
  const endY = startY + (Math.random() * 30 - 15); // +/- 15% variation
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Event label */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 text-white text-sm font-medium px-3 py-1 rounded-full">
        Comet
      </div>
      
      {/* Comet and tail */}
      <motion.div
        initial={{ left: `${startX}%`, top: `${startY}%` }}
        animate={{ left: `${endX}%`, top: `${endY}%` }}
        transition={{ duration, ease: "linear" }}
        className="absolute"
        style={{ zIndex: 30 }}
      >
        {/* Comet head - bright core */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${cometSize}px`,
            height: `${cometSize}px`,
            backgroundColor: 'white',
            boxShadow: `0 0 ${cometSize * 3}px ${cometSize}px rgba(255, 255, 255, 0.8)`
          }}
        />
        
        {/* Comet tail - gradient that follows behind */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${tailLength}px`,
            height: `${cometSize * 2}px`,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(173,216,230,0.5) 30%, rgba(173,216,230,0.2) 70%, transparent 100%)',
            transform: 'translateX(-100%)',
            transformOrigin: 'right center',
            filter: 'blur(1px)'
          }}
        />
        
        {/* Subtle glow around the whole comet */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${tailLength * 0.7}px`,
            height: `${cometSize * 6}px`,
            background: 'radial-gradient(ellipse at right, rgba(255,255,255,0.3) 0%, transparent 70%)',
            transform: 'translateX(-98%)',
            transformOrigin: 'right center',
            filter: 'blur(3px)'
          }}
        />
      </motion.div>
    </div>
  );
};

export default CometPass;