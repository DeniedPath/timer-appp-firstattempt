// src/components/features/celestial-events/Supernova.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SupernovaProps {
  intensity: 'low' | 'medium' | 'high';
}

const Supernova: React.FC<SupernovaProps> = ({ intensity }) => {
  // Adjust effects based on intensity
  const maxOpacity = intensity === 'high' ? 0.9 : intensity === 'medium' ? 0.7 : 0.5;
  const maxScale = intensity === 'high' ? 1.5 : intensity === 'medium' ? 1.3 : 1.1;
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      {/* Event label */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 text-white text-sm font-medium px-3 py-1 rounded-full z-30">
        Supernova
      </div>
      
      {/* Flash effect */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, maxOpacity, 0.1],
        }}
        transition={{ 
          duration: 1.5,
          times: [0, 0.1, 1],
          ease: "easeOut" 
        }}
      />
      
      {/* Explosion rings */}
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            background: index === 0 
              ? 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,236,173,0.7) 30%, rgba(247,166,91,0.4) 60%, rgba(255,140,107,0) 100%)'
              : index === 1 
                ? 'radial-gradient(circle, rgba(255,236,230,0.7) 0%, rgba(255,140,107,0.3) 50%, rgba(255,140,107,0) 100%)' 
                : 'radial-gradient(circle, rgba(255,213,173,0.5) 0%, rgba(247,166,91,0.2) 50%, rgba(255,140,107,0) 100%)',
            width: '300px',
            height: '300px',
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ 
            scale: [0, maxScale * (index + 1)], 
            opacity: [0.8, 0] 
          }}
          transition={{ 
            duration: 3 + index * 0.8,
            delay: index * 0.3,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Central bright point that fades out */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0) 100%)',
          width: '50px',
          height: '50px',
          boxShadow: '0 0 40px 20px rgba(255,255,255,0.8)'
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ 
          scale: [0, 1, 0.5], 
          opacity: [1, 1, 0] 
        }}
        transition={{ 
          duration: 3,
          times: [0, 0.2, 1],
          ease: "easeOut"
        }}
      />
    </div>
  );
};

export default Supernova;