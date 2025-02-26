import { Progress } from "../ui/progress";

interface ProgressIndicatorProps {
  value: number;
}

export const ProgressIndicator = ({ value }: ProgressIndicatorProps) => (
  <div className="w-full p-4">
    <Progress value={value} className="h-2 bg-gray-200" />
    <p className="text-white text-sm mt-2">Progress: {Math.round(value)}%</p>
  </div>
);