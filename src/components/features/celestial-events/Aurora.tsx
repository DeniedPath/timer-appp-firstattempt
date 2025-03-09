// src/components/features/celestial-events/Aurora.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface AuroraProps {
  intensity: 'low' | 'medium' | 'high';
}

const Aurora: React.FC<AuroraProps> = ({ intensity }) => {
  // Adjust colors and opacity based on intensity
  const opacity = intensity === 'high' ? 0.4 : intensity === 'medium' ? 0.3 : 0.2;
  const duration = intensity === 'high' ? 12 : intensity === 'medium' ? 10 : 8;
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Event label */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 text-white text-sm font-medium px-3 py-1 rounded-full">
        Aurora
      </div>
      
      {/* Aurora effect */}
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        <motion.div
          className="absolute bottom-0 w-screen h-1/3"
          initial={{ opacity: 0 }}
          animate={{ opacity }}
          transition={{ duration: 3 }}
          style={{
            background: 'linear-gradient(0deg, rgba(32,196,203,0.3) 0%, rgba(124,83,207,0.3) 50%, rgba(34,195,161,0) 100%)',
            filter: 'blur(30px)'
          }}
        ></motion.div>
        
        {/* Aurora waves */}
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute bottom-0 w-screen h-1/4"
            style={{
              background: index % 2 === 0 
                ? 'linear-gradient(0deg, rgba(83,170,207,0.2) 0%, rgba(136,83,207,0.2) 50%, rgba(83,207,195,0) 100%)'
                : 'linear-gradient(0deg, rgba(83,207,134,0.2) 0%, rgba(76,83,207,0.2) 50%, rgba(204,83,207,0) 100%)',
              filter: 'blur(20px)',
              opacity: opacity * 0.8,
              height: `${(index + 4) * 5}%`,
              transformOrigin: 'bottom'
            }}
            animate={{
              scaleX: [1, 1.1, 0.9, 1.05, 1],
              x: [0, `${index * 5}%`, `${-index * 5}%`, 0]
            }}
            transition={{
              duration: duration - index,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
        ))}
      </div>
    </div>
  );
};

export default Aurora;