import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  isSecret: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface UnlockNotification {
  id: string;
  achievement: Achievement;
}

interface AchievementsContextType {
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  resetAchievements: () => void;
  totalUnlocked: number;
  totalAchievements: number;
  recentUnlock: UnlockNotification | null;
  dismissRecentUnlock: () => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

// Initial list of achievements
const initialAchievements: Achievement[] = [
  {
    id: 'first_timer',
    name: 'First Timer',
    description: 'Start your first timer session',
    icon: '🚀',
    unlocked: false,
    isSecret: false,
  },
  {
    id: 'time_traveler',
    name: 'Time Traveler',
    description: 'Complete 10 timer sessions',
    icon: '⏱️',
    unlocked: false,
    isSecret: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'space_marathoner',
    name: 'Space Marathoner',
    description: 'Complete a timer session of at least 60 minutes',
    icon: '🏃',
    unlocked: false,
    isSecret: false,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Start a timer session after midnight',
    icon: '🦉',
    unlocked: false,
    isSecret: false,
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Start a timer session before 6 AM',
    icon: '🐦',
    unlocked: false,
    isSecret: false,
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Achieve a 7-day streak',
    icon: '🔥',
    unlocked: false,
    isSecret: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'negative_time',
    name: 'Quantum Physicist',
    description: 'Tried to bend the laws of physics with a negative timer',
    icon: '⚛️',
    unlocked: false,
    isSecret: true,
  },
  {
    id: 'rapid_clicker',
    name: 'Rapid Clicker',
    description: 'Click the start/pause button 5 times in 3 seconds',
    icon: '👆',
    unlocked: false,
    isSecret: true,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'midnight_focus',
    name: 'Midnight Focus',
    description: 'Complete a timer session that started before midnight and ended after',
    icon: '🌙',
    unlocked: false,
    isSecret: true,
  },
  {
    id: 'perfect_timing',
    name: 'Perfect Timing',
    description: 'Set a timer to exactly 42 minutes',
    icon: '✨',
    unlocked: false,
    isSecret: true,
  }
];

// Helper function for safely accessing localStorage
const getFromLocalStorage = function<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

// Helper function for safely saving to localStorage
const saveToLocalStorage = function<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with initial state, don't try to load from localStorage during SSR
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [recentUnlock, setRecentUnlock] = useState<UnlockNotification | null>(null);
  const [isClient, setIsClient] = useState(false);

  // After component mounts (client-side only), load from localStorage
  useEffect(() => {
    setIsClient(true);
    const saved = getFromLocalStorage<Achievement[]>('timer_achievements');
    if (saved) {
      setAchievements(saved);
    }
  }, []);

  // Only save to localStorage when on client and when achievements change
  useEffect(() => {
    if (isClient) {
      saveToLocalStorage('timer_achievements', achievements);
    }
  }, [achievements, isClient]);

  const totalUnlocked = achievements.filter(a => a.unlocked).length;
  const totalAchievements = achievements.length;

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const updatedAchievements = prev.map(achievement => {
        if (achievement.id === id && !achievement.unlocked) {
          const updatedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date().toISOString()
          };
          
          // Set the recent unlock notification
          setRecentUnlock({
            id: crypto.randomUUID(),
            achievement: updatedAchievement
          });
          
          return updatedAchievement;
        }
        return achievement;
      });
      
      return updatedAchievements;
    });
  };

  const updateProgress = (id: string, progress: number) => {
    setAchievements(prev => {
      const updatedAchievements = prev.map(achievement => {
        if (achievement.id === id) {
          const newProgress = Math.min(progress, achievement.maxProgress || progress);
          const shouldUnlock = achievement.maxProgress && newProgress >= achievement.maxProgress && !achievement.unlocked;
          
          const updatedAchievement: Achievement = {
            ...achievement,
            progress: newProgress,
            unlocked: Boolean(achievement.unlocked || shouldUnlock),
            unlockedAt: shouldUnlock ? new Date().toISOString() : achievement.unlockedAt
          };
          
          if (shouldUnlock) {
            setRecentUnlock({
              id: crypto.randomUUID(),
              achievement: updatedAchievement
            });
          }
          
          return updatedAchievement;
        }
        return achievement;
      });
      
      return updatedAchievements;
    });
  };

  const resetAchievements = () => {
    setAchievements(initialAchievements);
    setRecentUnlock(null);
  };
  
  const dismissRecentUnlock = () => {
    setRecentUnlock(null);
  };

  return (
    <AchievementsContext.Provider value={{
      achievements,
      unlockAchievement,
      updateProgress,
      resetAchievements,
      totalUnlocked,
      totalAchievements,
      recentUnlock,
      dismissRecentUnlock
    }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};