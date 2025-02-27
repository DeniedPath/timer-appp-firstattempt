import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { SessionData } from "../../hooks/useAnalytics";

interface SessionStatsProps {
  sessions: SessionData[];
}

/**
 * Displays a line chart of the user's past session durations.
 * @param {{ sessions: SessionData[] }} props
 * @prop {SessionData[]} sessions The user's past sessions.
 */

export const SessionStats = ({ sessions }: SessionStatsProps) => {
  const chartData = sessions.map(session => ({
    date: new Date(session.date).toLocaleDateString(),
    duration: session.duration / 60
  }));

  return (
    <div className="p-4 bg-transparent">
      <h3 className="text-white text-lg font-medium mb-4">Session History</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <XAxis 
            dataKey="date" 
            stroke="#ffffff" 
            tick={{ fill: "#ffffff" }}
            strokeOpacity={0.5}
          />
          <YAxis 
            stroke="#ffffff" 
            tick={{ fill: "#ffffff" }}
            strokeOpacity={0.5}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "rgba(26, 26, 61, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
              color: "#ffffff"
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="duration" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={{ fill: "#8884d8", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};