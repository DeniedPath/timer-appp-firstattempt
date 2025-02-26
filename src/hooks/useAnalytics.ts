import { useState, useEffect } from "react";

export interface SessionData {
  id: string;
  duration: number;
  completed: boolean;
  date: string;
}

export const useAnalytics = () => {
  const [sessions, setSessions] = useState<SessionData[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("timer_sessions");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("timer_sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  const addSession = (duration: number, completed: boolean) => {
    setSessions(prev => [...prev, {
      id: crypto.randomUUID(),
      duration,
      completed,
      date: new Date().toISOString()
    }]);
  };

  const getStreak = () => {
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