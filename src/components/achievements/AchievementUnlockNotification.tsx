import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Trophy } from "lucide-react";

interface AchievementUnlockNotificationProps {
  name: string;
  description: string;
  icon: string;
  isSecret: boolean;
  onComplete: () => void;
}

/**
 * AchievementUnlockNotification displays a temporary, prominent notification
 * when the user unlocks a new achievement. It appears from the top of the screen,
 * stays visible for a few seconds, and then disappears.
 * 
 * Secret achievements get a special visual treatment to make them more exciting.
 */
export const AchievementUnlockNotification = ({
  name,
  description,
  icon,
  isSecret,
  onComplete
}: AchievementUnlockNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Memoize the handleAnimationComplete callback to prevent infinite renders
  const handleAnimationComplete = useCallback(() => {
    if (!isVisible) {
      // Only call onComplete once when the exit animation is done
      onComplete();
    }
  }, [isVisible, onComplete]);

  // Automatically hide the notification after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 
            ${isSecret ? 'bg-gradient-to-r from-purple-900 to-blue-900' : 'bg-gradient-to-r from-blue-900 to-blue-800'} 
            p-4 rounded-lg shadow-lg backdrop-blur-sm border border-opacity-20 
            ${isSecret ? 'border-purple-500' : 'border-blue-500'} 
            w-80 max-w-full`}
        >
          <div className="relative">
            {/* Animated stars for secret achievements */}
            {isSecret && (
              <>
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="absolute -top-2 -right-2 text-lg"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="absolute -bottom-2 -left-2 text-lg"
                >
                  ✨
                </motion.div>
              </>
            )}

            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full 
                ${isSecret ? 'bg-purple-800' : 'bg-blue-700'} text-3xl`}>
                {icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <h3 className={`font-bold ${isSecret ? 'text-purple-200' : 'text-blue-200'}`}>
                    {isSecret ? 'Secret Achievement Unlocked!' : 'Achievement Unlocked!'}
                  </h3>
                </div>
                <p className="font-medium mt-1 text-white">{name}</p>
                <p className="text-sm text-gray-300 mt-1">{description}</p>
              </div>
            </div>
          </div>

          {/* Progress bar that depletes to show time remaining */}
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            className={`h-1 mt-3 ${isSecret ? 'bg-purple-500' : 'bg-blue-500'} rounded-full`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};