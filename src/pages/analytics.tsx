// src/pages/analytics.tsx
import React from 'react';
import Link from 'next/link';
import AnalyticsDashboard from '@/components/analytics/Dashboard';
import { SettingsProvider } from '@/components/context/SettingsContext';
import { AchievementsProvider } from '@/components/achievements/AchievementsContext';
import Particles from '@/components/backgrounds/Particles/Particles';

export default function AnalyticsPage() {
  return (
    <SettingsProvider>
      <AchievementsProvider>
        <div className="relative min-h-screen bg-black overflow-hidden">
          <style jsx global>{`
            @keyframes twinkle {
              0% { opacity: 0.2; }
              50% { opacity: 1; }
              100% { opacity: 0.2; }
            }
          `}</style>
          <div style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 0 }}>
            <Particles
              particleColors={['#ffffff', '#ffffff']}
              particleCount={500} // Fewer particles for better performance
              particleSpread={20}
              speed={0.05} // Slower for less distraction
              particleBaseSize={100}
              moveParticlesOnHover={true}
              alphaParticles={false}
              disableRotation={true} 
            />
          </div>
          
          <nav className="relative z-10 p-4 bg-gray-900 bg-opacity-60 backdrop-blur-sm">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-white text-xl font-bold">Space Time</Link>
              <div className="flex space-x-4">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">Timer</Link>
                <Link href="/analytics" className="text-white border-b-2 border-blue-400 pb-1">Analytics</Link>
              </div>
            </div>
          </nav>
          
          <main className="relative z-10 container mx-auto px-4 py-8">
            <AnalyticsDashboard />
          </main>
        </div>
      </AchievementsProvider>
    </SettingsProvider>
  );
}