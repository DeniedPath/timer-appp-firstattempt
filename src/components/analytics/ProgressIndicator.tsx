import { motion } from "framer-motion";
import { Progress } from "../ui/progress";

interface ProgressIndicatorProps {
  value: number;
}

/**
 * ProgressIndicator component displays an animated progress bar using the value provided.
 * The progress bar is animated using the framer-motion library and visually shows the progress
 * as a percentage of completion. It also displays the numeric progress percentage below the bar.
 *
 * @param {ProgressIndicatorProps} props - The properties for the component.
 * @param {number} props.value - The current progress value represented as a percentage (0 to 100).
 */

export const ProgressIndicator = ({ value }: ProgressIndicatorProps) => (
  <div className="w-full p-4">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="h-2 bg-gray-200"
    >
      <Progress value={value} className="h-2 bg-blue-500" />
    </motion.div>
    <p className="text-white text-sm mt-2">Progress: {Math.round(value)}%</p>
  </div>
);