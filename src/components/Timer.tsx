import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cn } from "../lib/utils";

// Main Timer component
const Timer = () => {
    // State variables
    const [time, setTime] = useState<number>(0); // Time in seconds
    const [inputTime, setInputTime] = useState<string>(""); // Input in minutes
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

    // Effect to handle timer countdown and sound playing
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        } else if (time === 0 && isRunning && soundEnabled) {
            // Play sound when timer reaches zero
            invoke("play_sound", { path: "./public/sound.mp3" })
                .then(() => console.log("Sound played"))
                .catch((error) => console.error("Failed to play sound:", error));
        }
        return () => clearInterval(interval);
    }, [isRunning, time, soundEnabled]);

    // Timer control functions
    const startTimer = (): void => {
        const minutes = parseInt(inputTime) || 0;
        setTime(minutes * 60);
        setIsRunning(true);
    };

    const stopTimer = (): void => setIsRunning(false);
    const continueTimer = (): void => setIsRunning(true);
    const resetTimer = (): void => {
        setIsRunning(false);
        setTime(0);
        setInputTime("");
    };

    // Format time for display
    const formatTime = (): string => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    };

    // Calculate progress percentage
    const progress = time > 0 ? (time / (parseInt(inputTime) * 60)) * 100 : 0;

    return (
        <TooltipProvider>
            <div className="flex flex-col items-center justify-center h-screen text-white relative z-10">
                {/* Animated timer display */}
                <motion.div
                    className="text-6xl font-bold"
                    animate={{
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
                    {formatTime()}
                </motion.div>

                {/* Timer input and start button */}
                <AnimatePresence>
                    {!isRunning && time === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                            className="mt-4 flex gap-2"
                        >
                            <Input
                                type="number"
                                value={inputTime}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setInputTime(e.target.value)
                                }
                                placeholder="Minutes"
                                className="w-32 text-black bg-white border-gray-300 rounded-md"
                            />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={startTimer}
                                        className="bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        Start
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Start the timer</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsSettingsOpen(true)}
                                        className="bg-gray-500 text-white hover:bg-gray-600"
                                    >
                                        Settings
                                    </motion.button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Adjust timer settings</p>
                                </TooltipContent>
                            </Tooltip>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pause and Reset buttons when timer is running */}
                {isRunning && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex gap-2"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={stopTimer}
                                    className="bg-yellow-500 text-white hover:bg-yellow-600"
                                >
                                    Pause
                                </motion.button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Pause the timer</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={resetTimer}
                                    className="bg-red-500 text-white hover:bg-red-600"
                                >
                                    Reset
                                </motion.button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Reset the timer</p>
                            </TooltipContent>
                        </Tooltip>
                    </motion.div>
                )}

                {/* Continue and Reset buttons when timer is paused */}
                {!isRunning && time > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex gap-2"
                    >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={continueTimer}
                                    className="bg-green-500 text-white hover:bg-green-600"
                                >
                                    Continue
                                </motion.button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Continue the timer</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={resetTimer}
                                    className="bg-red-500 text-white hover:bg-red-600"
                                >
                                    Reset
                                </motion.button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Reset the timer</p>
                            </TooltipContent>
                        </Tooltip>
                    </motion.div>
                )}

                {/* Progress bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    className="mt-6 w-64"
                >
                    <Progress value={progress} className="h-2 bg-gray-200" />
                </motion.div>

                {/* Settings dialog */}
                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                    <DialogContent className="bg-gray-800 text-white border-none">
                        <DialogHeader>
                            <DialogTitle>Timer Settings</DialogTitle>
                            <DialogDescription>
                                Adjust your timer preferences.
                            </DialogDescription>
                        </DialogHeader>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <label className="text-sm">Enable Sound on Completion</label>
                            <input
                                type="checkbox"
                                checked={soundEnabled}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setSoundEnabled(e.target.checked)
                                }
                                className="h-4 w-4 text-blue-600"
                            />
                        </motion.div>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    );
};

// Function to play sound (mock implementation for web)
async function invoke(command: string, args: { path: string }): Promise<void> {
    if (command === "play_sound") {
        const audio = new Audio(args.path);
        try {
            await audio.play();
            console.log("Sound played successfully");
        } catch (error) {
            console.error("Failed to play sound:", error);
        }
    } else {
        console.error("Unknown command:", command);
    }
}

export default Timer;
