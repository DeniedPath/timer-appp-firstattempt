import { motion } from "framer-motion";
import { Notification } from "../../hooks/useNotifications";

interface ToastManagerProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

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