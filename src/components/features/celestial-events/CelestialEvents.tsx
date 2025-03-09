// src/components/features/celestial-events/CelestialEvents.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/components/context/SettingsContext';
import MeteorShower from './MeteorShower';
import Aurora from './Aurora';
import Supernova from './Supernova';
import CometPass from './CometPass';
import SatellitePass from './SatellitePass';
import MilestoneEvent from './MilestoneEvent';

export type EventType = 'meteorShower' | 'aurora' | 'supernova' | 'cometPass' | 'satellitePass' | 'milestone';

interface CelestialEventsProps {
  isTimerRunning: boolean;
  elapsedTime: number; // in seconds
  totalDuration: number; // in seconds
  milestone?: number; // 0-100 percent
}

export const CelestialEvents: React.FC<CelestialEventsProps> = ({
  isTimerRunning,
  elapsedTime,
  totalDuration,
  milestone
}) => {
  const { settings } = useSettings();
  const [currentEvent, setCurrentEvent] = useState<EventType | null>(null);
  const [eventIntensity, setEventIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const lastEventTime = useRef<number>(0);
  const [showEvent, setShowEvent] = useState(false);

  // Don't show events if disabled in settings
  if (!settings.celestialEventsEnabled) {
    return null;
  }

  // Trigger milestone event when a significant percentage is reached
  useEffect(() => {
    if (milestone && isTimerRunning) {
      if (milestone === 25 || milestone === 50 || milestone === 75 || milestone === 100) {
        setCurrentEvent('milestone');
        setEventIntensity(milestone === 100 ? 'high' : milestone >= 50 ? 'medium' : 'low');
        setShowEvent(true);
        
        // Hide milestone event after 5 seconds
        const timer = setTimeout(() => {
          setShowEvent(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [milestone, isTimerRunning]);

  // Trigger random events during the timer session
  useEffect(() => {
    if (!isTimerRunning || !settings.celestialEventsEnabled) return;

    // Base chance for an event to occur (adjust for desired frequency)
    const baseChancePerMinute = 0.15; // 15% chance per minute
    
    // Increase chance based on session duration (longer sessions = more events)
    const durationMultiplier = Math.min(2, totalDuration / (30 * 60)); // Max 2x for 30+ minute sessions
    
    // Calculate final chance per check (check every 30 seconds)
    const chancePerCheck = baseChancePerMinute * durationMultiplier / 2;
    
    const eventCheck = setInterval(() => {
      // Make sure events are separated by at least 2 minutes
      const timeSinceLastEvent = (Date.now() - lastEventTime.current) / 1000;
      if (timeSinceLastEvent < 120) return;
      
      // Random chance to trigger an event
      if (Math.random() < chancePerCheck) {
        triggerRandomEvent();
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(eventCheck);
  }, [isTimerRunning, settings.celestialEventsEnabled, totalDuration]);

  // Function to trigger a random celestial event
  const triggerRandomEvent = () => {
    // List of possible events with weights
    const events: Array<{ type: EventType, weight: number }> = [
      { type: 'meteorShower', weight: 35 },
      { type: 'aurora', weight: 25 },
      { type: 'cometPass', weight: 20 },
      { type: 'satellitePass', weight: 15 },
      { type: 'supernova', weight: 5 }
    ];
    
    // Calculate total weight
    const totalWeight = events.reduce((sum, event) => sum + event.weight, 0);
    
    // Get a random value between 0 and totalWeight
    let random = Math.random() * totalWeight;
    
    // Find the event based on weights
    let selectedEvent: EventType = 'meteorShower';
    for (const event of events) {
      if (random < event.weight) {
        selectedEvent = event.type;
        break;
      }
      random -= event.weight;
    }
    
    // Determine intensity (rare high intensity events)
    const intensityRoll = Math.random();
    const intensity = intensityRoll > 0.9 ? 'high' : intensityRoll > 0.6 ? 'medium' : 'low';
    
    // Set the event and show it
    setCurrentEvent(selectedEvent);
    setEventIntensity(intensity);
    setShowEvent(true);
    lastEventTime.current = Date.now();
    
    // Events last between 5-20 seconds based on intensity
    const duration = intensity === 'high' ? 20000 : intensity === 'medium' ? 12000 : 5000;
    
    setTimeout(() => {
      setShowEvent(false);
    }, duration);
  };

  // Render the appropriate event component
  const renderEvent = () => {
    if (!currentEvent) return null;
    
    const eventProps = { intensity: eventIntensity };
    
    switch (currentEvent) {
      case 'meteorShower':
        return <MeteorShower {...eventProps} />;
      case 'aurora':
        return <Aurora {...eventProps} />;
      case 'supernova':
        return <Supernova {...eventProps} />;
      case 'cometPass':
        return <CometPass {...eventProps} />;
      case 'satellitePass':
        return <SatellitePass {...eventProps} />;
      case 'milestone':
        return <MilestoneEvent milestone={milestone} {...eventProps} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {showEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 pointer-events-none z-20"
        >
          {renderEvent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelestialEvents;