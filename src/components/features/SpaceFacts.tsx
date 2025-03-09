// src/components/features/SpaceFacts.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { Info } from 'lucide-react';

interface SpaceFactsProps {
  isTimerRunning: boolean;
  isBreak: boolean;
  currentPlanet: string;
}

export const SpaceFacts: React.FC<SpaceFactsProps> = ({ isTimerRunning, isBreak, currentPlanet }) => {
  const { settings } = useSettings();
  const [currentFact, setCurrentFact] = useState<string>('');
  const [showFact, setShowFact] = useState(false);

  useEffect(() => {
    if (!settings.spaceFactsEnabled) {
      setShowFact(false);
      return;
    }

    let factInterval: NodeJS.Timeout;
    
    const showRandomFact = () => {
      // Get planet-specific facts if a planet is selected
      const facts = getPlanetFacts(currentPlanet);
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      setCurrentFact(randomFact);
      setShowFact(true);
      
      // Hide fact after 10 seconds
      setTimeout(() => setShowFact(false), 10000);
    };

    // Show facts during breaks or based on frequency
    if (isBreak || isTimerRunning) {
      if (isBreak) {
        // Show fact immediately on break
        showRandomFact();
      }
      
      // Set up interval for showing facts
      factInterval = setInterval(() => {
        showRandomFact();
      }, settings.spaceFactsFrequency * 60 * 1000); // Convert minutes to milliseconds
    }

    return () => {
      if (factInterval) clearInterval(factInterval);
    };
  }, [isTimerRunning, isBreak, settings.spaceFactsEnabled, settings.spaceFactsFrequency, currentPlanet]);

  if (!settings.spaceFactsEnabled || !showFact) return null;

  return (
    <AnimatePresence>
      {showFact && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-auto px-4 z-50"
        >
          <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md text-white p-6 rounded-xl shadow-2xl">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-900 flex-shrink-0 flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-2">Space Fact</h3>
                <p className="text-lg leading-relaxed">{currentFact}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function to get facts based on current planet/theme
function getPlanetFacts(planet: string): string[] {
  const generalFacts = [
    "The solar system is about 4.6 billion years old.",
    "Light from the Sun takes about 8 minutes to reach Earth.",
    "The solar system is moving at about 828,000 km/h around the Milky Way's center.",
    "There are more than 200 known moons in our solar system.",
  ];

  const planetFacts: Record<string, string[]> = {
    Mercury: [
      "Mercury is the smallest planet in our solar system.",
      "Despite being closest to the Sun, Mercury is not the hottest planet.",
      "A year on Mercury is just 88 Earth days.",
      "Mercury has no moons or rings.",
    ],
    Venus: [
      "Venus rotates backwards compared to most other planets.",
      "Venus is the hottest planet in our solar system.",
      "A day on Venus is longer than its year.",
      "Venus has a thick atmosphere of mostly carbon dioxide.",
    ],
    Earth: [
      "Earth is the only known planet with liquid water on its surface.",
      "Earth's atmosphere is 78% nitrogen and 21% oxygen.",
      "Earth's core is about as hot as the Sun's surface.",
      "Earth is the only planet not named after a god or goddess.",
    ],
    Mars: [
      "Mars has the largest volcano in the solar system, Olympus Mons.",
      "Mars has two small moons, Phobos and Deimos.",
      "Mars' red color comes from iron oxide (rust) on its surface.",
      "Mars has seasons like Earth, but they last twice as long.",
    ],
    Jupiter: [
      "Jupiter is the largest planet in our solar system.",
      "Jupiter's Great Red Spot is a storm that's raged for over 400 years.",
      "Jupiter has at least 79 moons.",
      "Jupiter's magnetic field is the strongest of all planets.",
    ],
    Saturn: [
      "Saturn's rings are mostly made of ice and rock.",
      "Saturn has 82 confirmed moons, more than any other planet.",
      "Saturn is the least dense planet and could float in water.",
      "A year on Saturn is about 29.5 Earth years.",
    ],
    Uranus: [
      "Uranus rotates on its side, unlike other planets.",
      "Uranus was the first planet discovered using a telescope.",
      "Uranus has 27 known moons, all named after literary characters.",
      "Uranus appears blue-green due to methane in its atmosphere.",
    ],
    Neptune: [
      "Neptune has the strongest winds in the solar system.",
      "Neptune takes 165 Earth years to orbit the Sun.",
      "Neptune has 14 known moons.",
      "Neptune's blue color comes from methane in its atmosphere.",
    ],
  };

  // Return planet-specific facts or general facts for other themes
  return planetFacts[planet] || generalFacts;
}
