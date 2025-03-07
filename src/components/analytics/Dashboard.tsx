// src/components/analytics/Dashboard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '@/hooks/useAnalytics';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Clock, Calendar, Award, Zap, TrendingUp, BarChart2 } from 'lucide-react';

interface SessionDay {
  count: number;
  duration: number;
}

const AnalyticsDashboard = () => {
  const { sessions, getStreak } = useAnalytics();
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  
  // Calculate total focus time (in minutes)
  const totalFocusTime = sessions.reduce((total, session) => 
    total + (session.completed ? session.duration / 60 : 0), 0);
  
  // Calculate completion rate
  const completionRate = sessions.length > 0 
    ? (sessions.filter(s => s.completed).length / sessions.length) * 100 
    : 0;
  
  // Calculate current streak
  const currentStreak = getStreak();
  
  // Get best day based on session count and duration
  const sessionsByDay: Record<string, SessionDay> = {};
  sessions.forEach(session => {
    const day = new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' });
    if (!sessionsByDay[day]) {
      sessionsByDay[day] = { count: 0, duration: 0 };
    }
    sessionsByDay[day].count += 1;
    sessionsByDay[day].duration += session.duration / 60;
  });
  
  const bestDay = Object.entries(sessionsByDay).sort((a, b) => 
    b[1].duration - a[1].duration
  )[0] || ['Not enough data', { count: 0, duration: 0 }];
  
  // Filter data based on time range
  const getFilteredData = () => {
    const now = new Date();
    const cutoff = new Date();
    
    switch(timeRange) {
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoff.setDate(now.getDate() - 7);
    }
    
    return sessions.filter(session => new Date(session.date) >= cutoff);
  };
  
  const filteredSessions = getFilteredData();
  
  // Prepare data for charts
  const prepareSessionsByDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const data = days.map(day => ({ 
      name: day, 
      Minutes: 0,
      Sessions: 0
    }));
    
    filteredSessions.forEach(session => {
      const dayIndex = new Date(session.date).getDay();
      data[dayIndex].Minutes += session.duration / 60;
      data[dayIndex].Sessions += 1;
    });
    
    return data;
  };
  
  const prepareSessionsByTime = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const data = hours.map(hour => ({ 
      name: `${hour}:00`, 
      Sessions: 0 
    }));
    
    filteredSessions.forEach(session => {
      const hour = new Date(session.date).getHours();
      data[hour].Sessions += 1;
    });
    
    return data;
  };
  
  const prepareSessionLengths = () => {
    const lengths = [
      { name: '<15 min', value: 0 },
      { name: '15-30 min', value: 0 },
      { name: '30-45 min', value: 0 },
      { name: '45-60 min', value: 0 },
      { name: '>60 min', value: 0 }
    ];
    
    filteredSessions.forEach(session => {
      const durationMinutes = session.duration / 60;
      
      if (durationMinutes < 15) lengths[0].value++;
      else if (durationMinutes < 30) lengths[1].value++;
      else if (durationMinutes < 45) lengths[2].value++;
      else if (durationMinutes < 60) lengths[3].value++;
      else lengths[4].value++;
    });
    
    return lengths;
  };
  
  const prepareDailyTrend = () => {
    const dates: Record<string, number> = {};
    filteredSessions.forEach(session => {
      const dateStr = new Date(session.date).toLocaleDateString();
      if (!dates[dateStr]) {
        dates[dateStr] = 0;
      }
      dates[dateStr] += session.duration / 60;
    });
    
    return Object.entries(dates).map(([date, minutes]) => ({
      date,
      minutes: Number(minutes.toFixed(0))
    }));
  };
  
  // Chart colors with space theme
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
  
  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-lg p-6 w-full max-w-5xl mx-auto my-8 text-white">
      <div className="flex items-center mb-6">
        <BarChart2 className="mr-2 text-blue-400" />
        <h2 className="text-2xl font-bold">Focus Analytics Dashboard</h2>
        
        <div className="ml-auto">
          <select 
            className="bg-gray-800 text-white rounded px-3 py-1 mr-2"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="year">Past Year</option>
          </select>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div 
          className="bg-gray-800 p-4 rounded-lg flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center mr-3">
            <Clock className="text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Focus Time</p>
            <p className="text-xl font-bold">{Math.round(totalFocusTime)} min</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gray-800 p-4 rounded-lg flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mr-3">
            <Zap className="text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Completion Rate</p>
            <p className="text-xl font-bold">{Math.round(completionRate)}%</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gray-800 p-4 rounded-lg flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center mr-3">
            <Award className="text-green-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Current Streak</p>
            <p className="text-xl font-bold">{currentStreak} days</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gray-800 p-4 rounded-lg flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-12 h-12 rounded-full bg-yellow-900 flex items-center justify-center mr-3">
            <Calendar className="text-yellow-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Most Productive Day</p>
            <p className="text-xl font-bold">{bestDay[0]}</p>
          </div>
        </motion.div>
      </div>
      
      {/* Tab navigation */}
      <div className="flex mb-4 border-b border-gray-700">
        <button 
          className={`px-4 py-2 ${activeTab === 'overview' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'patterns' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('patterns')}
        >
          Time Patterns
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'sessions' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
          onClick={() => setActiveTab('sessions')}
        >
          Session Analysis
        </button>
      </div>
      
      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily focus trend */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Daily Focus Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareDailyTrend()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" tick={{ fill: '#ccc' }} />
                    <YAxis tick={{ fill: '#ccc' }} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: '#ccc' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} 
                      formatter={(value) => [`${value} min`, 'Focus Time']}
                    />
                    <Line type="monotone" dataKey="minutes" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Session lengths */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Session Lengths</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareSessionLengths()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {prepareSessionLengths().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} 
                      formatter={(value) => [`${value} sessions`, 'Count']}
                    />
                    <Legend formatter={(value) => <span style={{ color: '#ccc' }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'patterns' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly patterns */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Weekly Patterns</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareSessionsByDay()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
                    <YAxis tick={{ fill: '#ccc' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
                    <Legend formatter={(value) => <span style={{ color: '#ccc' }}>{value}</span>} />
                    <Bar dataKey="Minutes" fill="#8884d8" />
                    <Bar dataKey="Sessions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Time of day patterns */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Time of Day</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareSessionsByTime()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
                    <YAxis tick={{ fill: '#ccc' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: 'white' }} />
                    <Line type="monotone" dataKey="Sessions" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'sessions' && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredSessions.slice(0, 10).map((session, index) => {
                    const sessionDate = new Date(session.date);
                    return (
                      <tr key={session.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {sessionDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {sessionDate.toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {Math.round(session.duration / 60)} min
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${session.completed ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                            {session.completed ? 'Completed' : 'Interrupted'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Info box */}
      <div className="mt-8 bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-800">
        <div className="flex items-start">
          <TrendingUp className="text-blue-400 mr-2 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium">Analytics Insights</h4>
            <p className="text-sm text-gray-300 mt-1">
              Your analytics data helps you understand your focus patterns and productivity trends. 
              Use this information to optimize your focus sessions by identifying your most productive 
              times of day and ideal session durations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;