import { useState, useEffect } from "react";

export interface SessionData {
  id: string;
  duration: number;
  completed: boolean;
  date: string;
}

export const useAnalytics = () => {
  // Initialize with empty array instead of trying to load from localStorage during SSR
  const [sessions, setSessions] = useState<SessionData[]>([]);
  
  // Initialize to detect client-side rendering
  const [isClient, setIsClient] = useState(false);

  // This effect runs only once after the component mounts on the client
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("timer_sessions");
    setSessions(saved ? JSON.parse(saved) : []);
  }, []);

  // Only save to localStorage after client has loaded and when sessions change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("timer_sessions", JSON.stringify(sessions));
    }
  }, [sessions, isClient]);

  const addSession = (duration: number, completed: boolean) => {
    setSessions(prev => [...prev, {
      id: crypto.randomUUID(),
      duration,
      completed,
      date: new Date().toISOString()
    }]);
  };

  const getStreak = () => {
    // Return 0 if not on client yet
    if (!isClient) return 0;
    
    const sorted = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let lastDate: Date | null = null;

    for (const session of sorted) {
      if (!session.completed) continue;
      const currentDate = new Date(session.date);
      if (!lastDate) {
        streak = 1;
        lastDate = currentDate;
        continue;
      }
      const diff = (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 1) {
        streak++;
        lastDate = currentDate;
      } else {
        break;
      }
    }
    return streak;
  };

  return { sessions, addSession, getStreak };
};