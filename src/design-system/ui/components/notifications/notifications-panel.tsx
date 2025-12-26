"use client"

// import { useNotificationContext } from "@/design-system/ui/layouts/notification-layout"
import { NotificationIcon } from "@/design-system/icons/layout"
import { useNotificationContext } from "../../layout/notification-layout";

export function NotificationsPanel() {
  const { openNotifications, closeNotifications, toggleNotifications, notifications, unreadCount } = useNotificationContext();

  return (
		<button
			className="relative p-2 transition-colors rounded-full hover:bg-muted dark:hover:bg-muted"
			onClick={toggleNotifications}
		>
			<NotificationIcon className="w-6 h-6 text-muted-foreground" />
			{unreadCount > 0 && (
				<span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse"></span>
			)}
		</button>
	);
}