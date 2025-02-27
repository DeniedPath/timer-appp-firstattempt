import { useNotifications } from "../../hooks/useNotifications";
import { ToastManager } from "./ToastManager";

/**
 * NotificationSystem displays all notifications provided by the useNotifications hook.
 * It renders them at the bottom right of the screen as a stack of toasts.
 * When a notification is removed, it is removed from the list of notifications.
 * @returns a div with all the notifications as children.
 */
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