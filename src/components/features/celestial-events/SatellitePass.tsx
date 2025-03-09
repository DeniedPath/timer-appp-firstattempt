// src/components/features/celestial-events/SatellitePass.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SatellitePassProps {
  intensity: 'low' | 'medium' | 'high';
}

const SatellitePass: React.FC<SatellitePassProps> = ({ intensity }) => {
  // Adjust parameters based on intensity
  const size = intensity === 'high' ? 4 : intensity === 'medium' ? 3 : 2;
  const duration = intensity === 'high' ? 15 : intensity === 'medium' ? 12 : 10;
  const blinkInterval = intensity === 'high' ? 0.8 : intensity === 'medium' ? 1 : 1.2;
  
  // Random trajectory across the sky
  const startX = -5;
  const startY = 20 + Math.random() * 40; // Random position 20-60% from top
  const endX = 105;
  const endY = startY + (Math.random() * 30 - 15); // +/- 15% variation
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Event label */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 text-white text-sm font-medium px-3 py-1 rounded-full">
        Satellite
      </div>
      
      {/* Satellite */}
      <motion.div
        initial={{ left: `${startX}%`, top: `${startY}%` }}
        animate={{ left: `${endX}%`, top: `${endY}%` }}
        transition={{ duration, ease: "linear" }}
        className="absolute"
      >
        {/* Satellite body - small dot with blinking light */}
        <motion.div
          className="relative"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: 'white',
            borderRadius: '50%'
          }}
          animate={{
            boxShadow: [
              `0 0 ${size}px rgba(255, 255, 255, 0.8)`,
              `0 0 ${size * 3}px rgba(255, 255, 255, 0.9)`,
              `0 0 ${size}px rgba(255, 255, 255, 0.8)`,
            ]
          }}
          transition={{
            duration: blinkInterval,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
        
        {/* Optional: Solar panel reflection flash occasionally */}
        {intensity === 'high' && (
          <motion.div
            className="absolute top-0 left-0"
            style={{
              width: `${size * 2}px`,
              height: `${size * 2}px`,
              borderRadius: '50%',
              filter: 'blur(1px)'
            }}
            animate={{
              backgroundColor: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0)']
            }}
            transition={{
              duration: 0.5,
              repeat: Math.floor(duration / 3),
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default SatellitePass;