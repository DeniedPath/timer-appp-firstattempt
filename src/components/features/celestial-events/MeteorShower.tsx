// src/components/features/celestial-events/MeteorShower.tsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface MeteorShowerProps {
  intensity: 'low' | 'medium' | 'high';
}

const MeteorShower: React.FC<MeteorShowerProps> = ({ intensity }) => {
  // Generate meteors based on intensity
  const meteorCount = intensity === 'high' ? 20 : intensity === 'medium' ? 12 : 6;
  
  const meteors = useMemo(() => {
    return Array.from({ length: meteorCount }).map((_, i) => {
      // Random starting position
      const startX = Math.random() * 100;
      const startY = -10;
      
      // Random ending position (diagonal trajectory)
      const endX = startX + 20 + Math.random() * 30;
      const endY = 110;
      
      // Random duration (speed)
      const duration = 0.8 + Math.random() * 2;
      
      // Random delay
      const delay = Math.random() * (intensity === 'high' ? 8 : 5);
      
      // Random thickness/size
      const size = 1 + Math.random() * (intensity === 'high' ? 3 : 2);
      
      // Random brightness
      const brightness = 0.7 + Math.random() * 0.3;
      
      return { startX, startY, endX, endY, duration, delay, size, brightness };
    });
  }, [meteorCount, intensity]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Optional subtle overlay to darken the screen slightly for better contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      
      {/* Event label */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 text-white text-sm font-medium px-3 py-1 rounded-full">
        Meteor Shower
      </div>
      
      {/* Meteors */}
      {meteors.map((meteor, index) => (
        <motion.div
          key={index}
          initial={{ x: `${meteor.startX}vw`, y: `${meteor.startY}vh` }}
          animate={{ x: `${meteor.endX}vw`, y: `${meteor.endY}vh` }}
          transition={{
            duration: meteor.duration,
            delay: meteor.delay,
            ease: "linear"
          }}
          className="absolute"
        >
          <div
            className="relative"
            style={{
              width: `${meteor.size * 30}px`,
              height: `${meteor.size * 2}px`,
              background: `linear-gradient(90deg, rgba(255,255,255,${meteor.brightness}) 0%, rgba(255,255,255,0) 100%)`,
              borderRadius: '50%',
              transform: 'rotate(-30deg)',
              boxShadow: `0 0 ${meteor.size * 5}px rgba(255,255,255,${meteor.brightness / 2})`
            }}
          ></div>
        </motion.div>
      ))}
    </div>
  );
};

export default MeteorShower;