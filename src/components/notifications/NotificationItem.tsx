import { DerivedNotification } from '@/lib/services/deriveNotificationService';
import { FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';

interface NotificationItemProps {
  notification: DerivedNotification;
  onMarkAsRead: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    
    return date.toLocaleDateString('id-ID');
  };

  const getIconStyles = () => {
    if (notification.capacity >= 90) {
      // Penuh - Red
      return {
        icon: FiAlertCircle,
        bgColor: 'bg-red-100',
        iconColor: 'text-red-500',
      };
    } else if (notification.capacity >= 70) {
      // Hampir Penuh - Yellow
      return {
        icon: FiAlertTriangle,
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-500',
      };
    }
    // Normal - Green
    return {
      icon: FiAlertTriangle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500',
    };
  };

  const styles = getIconStyles();
  const IconComponent = styles.icon;

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border-b border-gray-100 transition hover:bg-gray-50 sm:flex-row sm:items-start">
      {/* Icon */}
      <div className={`${styles.bgColor} p-3 rounded-full shrink-0 mt-1`}>
        <IconComponent className={`${styles.iconColor} text-lg`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-sm">
          {notification.gedung} - {notification.lantai} - {notification.ruang}
        </h3>
        <p className="text-gray-600 text-sm mt-1">{notification.description}</p>
        <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
          ⏱ {formatTime(notification.timestamp)}
        </p>
      </div>

      {/* Button - Show only if status is 'baru' (unread) */}
      {notification.status === 'baru' ? (
        <button
          onClick={() => onMarkAsRead(notification.id)}
          className="w-full shrink-0 rounded-lg bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-600 sm:w-auto"
        >
          Baru
        </button>
      ) : (
        <div className="w-full shrink-0 rounded-lg bg-gray-200 px-4 py-1.5 text-sm font-semibold text-gray-600 sm:w-auto">
          Dibaca
        </div>
      )}
    </div>
  );
}
