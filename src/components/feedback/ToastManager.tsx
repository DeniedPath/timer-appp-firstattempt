import { motion } from "framer-motion";
import { Notification } from "../../hooks/useNotifications";

interface ToastManagerProps {
  notification: Notification;
  onRemove: (id: string) => void;
}
/**
 * A ToastManager is a single toast notification that will be removed after
 * its duration has passed. It animates in and out of view, and will
 * automatically remove itself from the list of notifications when its
 * animation is complete.
 * @param notification The notification to display
 * @param onRemove A function that will be called when the toast is removed
 * @returns A single toast notification
 */
export const ToastManager = ({ notification, onRemove }: ToastManagerProps) => {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  }[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`${bgColor} text-white p-4 rounded-lg mb-2`}
      onAnimationComplete={() => {
        setTimeout(() => onRemove(notification.id), notification.duration);
      }}
    >
      {notification.message}
    </motion.div>
  );
};