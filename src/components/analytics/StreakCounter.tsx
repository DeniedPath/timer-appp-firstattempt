import { Trophy } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export const StreakCounter = ({ streak }: StreakCounterProps) => (
  <div className="flex items-center gap-2 p-4 bg-transparent  ">
    <Trophy className="text-yellow-400 w-6 h-6" />
    <span className="text-white text-lg font-medium">Streak: {streak} days</span>
  </div>
);