import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface TimerControlsProps {
  isRunning: boolean;
  time: number;
  inputTime: string;
  setInputTime: (value: string) => void;
  startTimer: () => void;
  stopTimer: () => void;
  continueTimer: () => void;
  resetTimer: () => void;
  setIsSettingsOpen: (value: boolean) => void;
}

/**
 * TimerControls component: Contains controls for starting, stopping, and continuing a timer.
 * The component is conditionally rendered based on the timer's running state and duration.
 *
 * @param {boolean} isRunning - Whether the timer is currently running.
 * @param {number} time - The current duration of the timer.
 * @param {string} inputTime - The user's input for the timer's duration.
 * @param {function} setInputTime - A function to update the user's input.
 * @param {function} startTimer - A function to start the timer.
 * @param {function} stopTimer - A function to stop the timer.
 * @param {function} continueTimer - A function to continue the timer.
 * @param {function} resetTimer - A function to reset the timer.
 * @param {function} setIsSettingsOpen - A function to open the settings panel.
 */
export const TimerControls = ({
  isRunning,
  time,
  inputTime,
  setInputTime,
  startTimer,
  stopTimer,
  continueTimer,
  resetTimer,
  setIsSettingsOpen,
}: TimerControlsProps) => {
  return (
    <TooltipProvider>
      <AnimatePresence>
        {!isRunning && time === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="mt-4 flex flex-col items-center gap-2"
          >
            <div className="flex gap-2 items-center">
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
                    className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded"
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
                    className="bg-gray-500 text-white hover:bg-gray-600 px-4 py-2 rounded"
                  >
                    Settings
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adjust timer settings</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-col items-center gap-2"
        >
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopTimer}
                  className="bg-yellow-500 text-white hover:bg-yellow-600 px-4 py-2 rounded"
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
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded"
                >
                  Reset
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset the timer</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
      )}

      {!isRunning && time > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-col items-center gap-2"
        >
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={continueTimer}
                  className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded"
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
                  className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded"
                >
                  Reset
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset the timer</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
      )}
    </TooltipProvider>
  );
};