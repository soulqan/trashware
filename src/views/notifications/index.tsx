import { useState, useEffect } from 'react';
import { DerivedNotification } from '@/lib/services/deriveNotificationService';
import { deriveNotificationService } from '@/lib/services/deriveNotificationService';
import { notificationReadService } from '@/lib/services/notificationReadService';
import NotificationList from '@/components/notifications/NotificationList';

interface NotificationFilter {
  semua: number;
  baru: number;
  dibaca: number;
}

export default function NotificationsView() {
  const [notifications, setNotifications] = useState<DerivedNotification[]>([]);
  const [filter, setFilter] = useState<'semua' | 'baru' | 'dibaca'>('semua');
  const [counts, setCounts] = useState<NotificationFilter>({
    semua: 0,
    baru: 0,
    dibaca: 0,
  });
  const [loading, setLoading] = useState(true);

  // Subscribe to derived notifications with read status
  useEffect(() => {
    setLoading(true);
    
    // Subscribe to notifications with status
    const unsubscribeNotifs = deriveNotificationService.subscribeToDerivedNotificationsWithStatus(
      (data) => {
        setNotifications(data);
        setLoading(false);
      },
      filter
    );

    // Subscribe to notification counts
    const unsubscribeCounts = deriveNotificationService.subscribeToNotificationCounts((counts) => {
      setCounts(counts);
    });

    return () => {
      unsubscribeNotifs();
      unsubscribeCounts();
    };
  }, [filter]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationReadService.markAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all current (unread) notifications as read
      const unreadNotifications = notifications.filter((n) => n.status === 'baru');
      
      for (const notif of unreadNotifications) {
        await notificationReadService.markAsRead(notif.id);
      }
      
      console.log('✅ All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  return (
    <NotificationList
      notifications={notifications}
      filter={filter}
      counts={counts}
      onFilterChange={setFilter}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      loading={loading}
    />
  );
}
