import { useNotifications } from "../../hooks/useNotifications";
import { ToastManager } from "./ToastManager";

export const NotificationSystem = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {notifications.map(notification => (
        <ToastManager
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};