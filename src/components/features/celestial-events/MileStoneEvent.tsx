// src/components/features/celestial-events/MilestoneEvent.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface MilestoneEventProps {
  milestone?: number;
  intensity: 'low' | 'medium' | 'high';
}

const MilestoneEvent: React.FC<MilestoneEventProps> = ({ milestone = 100, intensity }) => {
  // Adjust effects based on intensity and milestone
  const isComplete = milestone === 100;
  const isHalfway = milestone === 50;
  
  // Create different milestone messages
  const message = isComplete 
    ? 'Focus Session Complete!' 
    : isHalfway 
      ? 'Halfway There!'
      : `${milestone}% Complete`;
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      {/* Milestone message with animation */}
      <motion.div
        className="rounded-xl bg-gradient-to-r from-blue-900/70 to-purple-900/70 backdrop-blur-sm border border-blue-400/30 py-4 px-8 flex flex-col items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <motion.div 
          className="text-2xl font-bold text-white mb-2"
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 1.5, 
            repeat: 1, 
            repeatType: "reverse" 
          }}
        >
          {message}
        </motion.div>
        
        {isComplete && (
          <motion.div
            className="text-blue-200 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Great job maintaining focus!
          </motion.div>
        )}
      </motion.div>
      
      {/* Particle effects that emanate from the center */}
      {(isComplete || intensity === 'high') && (
        <motion.div className="absolute inset-0 flex items-center justify-center">
          {[...Array(20)].map((_, index) => {
            const angle = (index / 20) * 360;
            const distance = isComplete ? 150 : 100;
            const delay = index * 0.03;
            const duration = 1.5 + Math.random() * 0.5;
            const size = 3 + Math.random() * 4;
            
            return (
              <motion.div
                key={index}
                className="absolute rounded-full bg-blue-400"
                style={{ width: size, height: size }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: Math.cos(angle * Math.PI / 180) * distance,
                  y: Math.sin(angle * Math.PI / 180) * distance,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration,
                  delay,
                  ease: "easeOut"
                }}
              />
            );
          })}
        </motion.div>
      )}
      
      {/* Light rays for complete milestone */}
      {isComplete && (
        <motion.div
          className="absolute w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ duration: 2, times: [0, 0.3, 1] }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(191,219,254,0.3) 0%, rgba(191,219,254,0) 70%)'
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default MilestoneEvent;