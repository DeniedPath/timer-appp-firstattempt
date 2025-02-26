import { motion } from "framer-motion";
import { Progress } from "../ui/progress";

// Define the props interface for TimerDisplay component
interface TimerDisplayProps {
    formattedTime: string;  // The formatted time string to display
    isRunning: boolean;     // Whether the timer is currently running
    progress: number;       // The progress of the timer (0-100)
}

// TimerDisplay component: Displays the current time and progress of the timer
export const TimerDisplay = ({ formattedTime, isRunning, progress }: TimerDisplayProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            {/* Animated time display */}
            <motion.div
                className="text-6xl font-bold"
                animate={{
                    // Scale and rotate animation when the timer is running
                    scale: isRunning ? [1, 1.1, 1] : 1,
                    rotate: isRunning ? [0, 5, -5, 0] : 0,
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                }}
            >
                {formattedTime}
            </motion.div>

            {/* Animated progress bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}  // Initial state (hidden and slightly below)
                animate={{ opacity: 1, y: 0, scale: [1, 1.05, 1] }}  // Fade in, move up, and pulse
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="mt-6 w-64"
            >
                <Progress value={progress} />
            </motion.div>
        </div>
    );
};
