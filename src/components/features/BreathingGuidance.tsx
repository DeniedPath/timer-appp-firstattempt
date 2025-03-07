// src/components/features/BreathingGuidance.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

interface BreathingGuidanceProps {
  isTimerRunning: boolean;
  isBreak: boolean;
}

export const BreathingGuidance: React.FC<BreathingGuidanceProps> = ({
  isTimerRunning,
  isBreak,
}) => {
  const { settings } = useSettings();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');

  // Different patterns for focus vs break
  const breathingPattern = isBreak 
    ? { inhale: 4, hold: 0, exhale: 4, rest: 0 } // Relaxed breathing during breaks
    : { inhale: 4, hold: 4, exhale: 4, rest: 0 }; // Box breathing during focus

  // Breathing cycle effect
  useEffect(() => {
    if (!isTimerRunning) return;
    
    const runBreathingCycle = () => {
      // Inhale phase
      setBreathingPhase('inhale');
      const inhaleTimer = setTimeout(() => {
        // Hold phase
        setBreathingPhase('hold');
        
        const holdTimer = setTimeout(() => {
          // Exhale phase
          setBreathingPhase('exhale');
          
          const exhaleTimer = setTimeout(() => {
            // Rest phase
            setBreathingPhase('rest');
            
            const restTimer = setTimeout(() => {
              // Restart cycle
              runBreathingCycle();
            }, breathingPattern.rest * 1000);
            
            return () => clearTimeout(restTimer);
          }, breathingPattern.exhale * 1000);
          
          return () => clearTimeout(exhaleTimer);
        }, breathingPattern.hold * 1000);
        
        return () => clearTimeout(holdTimer);
      }, breathingPattern.inhale * 1000);
      
      return () => clearTimeout(inhaleTimer);
    };

    runBreathingCycle();
  }, [isTimerRunning, breathingPhase, breathingPattern]);

  // Optional audio cues
  useEffect(() => {
    if (audioEnabled && settings.soundEnabled) {
      const playBreathingSound = () => {
        const audio = new Audio(`/sounds/breathing-${breathingPhase}.mp3`);
        audio.volume = 0.2; // Subtle volume
        audio.play().catch(error => console.error('Error playing breathing sound:', error));
      };
      
      playBreathingSound();
    }
  }, [breathingPhase, audioEnabled, settings.soundEnabled]);

  // Skip if breathing guidance is disabled
  if (!settings.breathingGuidanceEnabled) {
    return null;
  }

  // Animation variants
  const circleVariants = {
    inhale: {
      scale: 1.5,
      opacity: 0.8,
      transition: { duration: breathingPattern.inhale, ease: "easeInOut" }
    },
    hold: {
      scale: 1.5,
      opacity: 0.8,
      transition: { duration: breathingPattern.hold, ease: "linear" }
    },
    exhale: {
      scale: 1,
      opacity: 0.4,
      transition: { duration: breathingPattern.exhale, ease: "easeInOut" }
    },
    rest: {
      scale: 1,
      opacity: 0.4,
      transition: { duration: breathingPattern.rest, ease: "linear" }
    }
  };

  // Text prompts
  const breathingText = {
    inhale: "Breathe in...",
    hold: "Hold...",
    exhale: "Breathe out...",
    rest: "Rest..."
  };

  return (
    <div className="fixed bottom-10 right-10 z-40 flex flex-col items-center">
      <motion.div
        className="relative w-32 h-32 flex items-center justify-center"
        animate={breathingPhase}
        variants={circleVariants}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.5)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: breathingPhase === 'inhale' ? 1 : 
                         breathingPhase === 'hold' ? 1 : 
                         breathingPhase === 'exhale' ? 0 : 0 
            }}
            transition={{ 
              duration: breathingPhase === 'inhale' ? breathingPattern.inhale : 
                        breathingPhase === 'exhale' ? breathingPattern.exhale : 0.1 
            }}
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="rgba(100, 149, 237, 0.2)"
            stroke="rgba(100, 149, 237, 0.6)"
            strokeWidth="1"
          />
        </svg>
        <motion.div 
          className="absolute text-white text-opacity-80 text-xs font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {breathingText[breathingPhase]}
        </motion.div>
      </motion.div>
      
      <button 
        onClick={() => setAudioEnabled(!audioEnabled)}
        className="mt-2 text-xs text-white text-opacity-60 hover:text-opacity-100 transition-opacity"
      >
        {audioEnabled ? 'Sound On' : 'Sound Off'}
      </button>
    </div>
  );
};