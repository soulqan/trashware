import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { notificationReadService } from './notificationReadService';

export interface DerivedNotification {
  id: string;
  binId: string;
  building: string;
  floor: string;
  location: string;
  title: string;
  description: string;
  capacity: number;
  status: 'baru' | 'dibaca';
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

export const deriveNotificationService = {
  // Subscribe to bins and derive notifications (ONLY FULL BINS >= 90%)
  subscribeToDerivedNotifications(
    callback: (notifications: DerivedNotification[]) => void
  ) {
    const unsubscribe = onSnapshot(collection(db, 'bins'), (snapshot) => {
      const bins = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      // Derive notifications from FULL bins only (>= 90%)
      const derivedNotifications = bins
        .filter((bin) => bin.capacity >= 90) // Only full bins
        .map((bin) => {
          // Extract building dan floor dari data yang tersedia
          const location = bin.location || 'Unknown Location';

          return {
            id: bin.id,
            binId: bin.id,
            building: bin.building || 'Tempat Sampah',
            floor: bin.floor || 'Lokasi',
            location: location,
            title: location,
            description: `${location} penuh (${bin.capacity}%) - segera kosongkan`,
            capacity: bin.capacity,
            status: 'baru' as const, // All are new/unread
            type: 'error' as const, // All are error (full)
            timestamp: new Date(),
          } as DerivedNotification;
        })
        .sort((a, b) => b.capacity - a.capacity); // Sort by capacity descending

      callback(derivedNotifications);
    });

    return unsubscribe;
  },

  // Get derived notification counts (ONLY FULL BINS) - Real-time with read status
  subscribeToNotificationCounts(
    callback: (counts: { semua: number; baru: number; dibaca: number }) => void
  ) {
    let binsData: any[] = [];
    let readIds: string[] = [];

    // Subscribe to bins
    const unsubscribeBins = onSnapshot(collection(db, 'bins'), (snapshot) => {
      binsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      updateCounts();
    });

    // Subscribe to read notifications (real-time)
    const unsubscribeRead = onSnapshot(collection(db, 'notificationRead'), (snapshot) => {
      readIds = snapshot.docs.map((doc) => doc.data().notificationId);
      updateCounts();
    });

    const updateCounts = () => {
      // Get only FULL bins (>= 90%)
      const fullBins = binsData.filter((b) => b.capacity >= 90);
      const fullBinIds = new Set(fullBins.map((b) => b.id));

      // Clean up read notifications for bins that are no longer full
      notificationReadService.cleanupReadNotificationsForNonFullBins(
        fullBinIds
      );

      // Only count read IDs that are still full bins
      const validReadIds = readIds.filter((id) => fullBinIds.has(id));

      callback({
        semua: fullBins.length,
        baru: fullBins.length - validReadIds.length, // Full bins minus read ones
        dibaca: validReadIds.length, // Only read notifications that are still full
      });
    };

    return () => {
      unsubscribeBins();
      unsubscribeRead();
    };
  },

  // Subscribe to notifications with read status - Real-time
  subscribeToDerivedNotificationsWithStatus(
    callback: (notifications: DerivedNotification[]) => void,
    filter?: 'semua' | 'baru' | 'dibaca'
  ) {
    let binsData: any[] = [];
    let readIds: string[] = [];

    // Subscribe to bins
    const unsubscribeBins = onSnapshot(collection(db, 'bins'), (snapshot) => {
      binsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      updateNotifications();
    });

    // Subscribe to read notifications (real-time)
    const unsubscribeRead = onSnapshot(collection(db, 'notificationRead'), (snapshot) => {
      readIds = snapshot.docs.map((doc) => doc.data().notificationId);
      updateNotifications();
    });

    const updateNotifications = () => {
      // Get only FULL bins (>= 90%)
      const fullBins = binsData.filter((bin) => bin.capacity >= 90);
      const fullBinIds = new Set(fullBins.map((b) => b.id));

      // Clean up read notifications for bins that are no longer full
      notificationReadService.cleanupReadNotificationsForNonFullBins(
        fullBinIds
      );

      // Derive notifications from FULL bins only (>= 90%)
      const derivedNotifications = fullBins
        .map((bin) => {
          const location = bin.location || 'Unknown Location';
          const isRead = readIds.includes(bin.id);

          return {
            id: bin.id,
            binId: bin.id,
            building: bin.building || 'Tempat Sampah',
            floor: bin.floor || 'Lokasi',
            location: location,
            title: location,
            description: `${location} penuh (${bin.capacity}%) - segera kosongkan`,
            capacity: bin.capacity,
            status: isRead ? 'dibaca' : 'baru',
            type: 'error' as const,
            timestamp: new Date(),
          } as DerivedNotification;
        })
        .filter((notif) => {
          if (!filter || filter === 'semua') return true;
          return notif.status === filter;
        })
        .sort((a, b) => b.capacity - a.capacity);

      callback(derivedNotifications);
    };

    return () => {
      unsubscribeBins();
      unsubscribeRead();
    };
  },
};
