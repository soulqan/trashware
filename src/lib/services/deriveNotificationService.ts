import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Bin } from '@/types/database';
import { notificationReadService } from './notificationReadService';

export interface DerivedNotification {
  id: string;
  binId: string;
  gedung: string;
  lantai: string;
  ruang: string;
  location: string;
  title: string;
  description: string;
  capacity: number;
  status: 'baru' | 'dibaca';
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

export const deriveNotificationService = {
  // Subscribe to bins and derive notifications (ONLY FULL BINS - level >= 90)
  subscribeToDerivedNotifications(
    callback: (notifications: DerivedNotification[]) => void
  ) {
    const unsubscribe = onSnapshot(collection(db, 'bins'), (snapshot) => {
      const bins = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Bin[];

      // Derive notifications from FULL bins only (level >= 90)
      const derivedNotifications = bins
        .filter((bin) => bin.level >= 90) // Only full bins
        .map((bin) => {
          // Generate location dari gedung, lantai, ruang
          const location = `${bin.gedung} - ${bin.lantai} - ${bin.ruang}`;
          
          // Convert lastUpdate ke Date jika ada, jika tidak gunakan waktu saat ini
          const timestamp = bin.lastUpdate 
            ? (bin.lastUpdate.toDate ? bin.lastUpdate.toDate() : new Date(bin.lastUpdate))
            : new Date();

          return {
            id: bin.id,
            binId: bin.id,
            gedung: bin.gedung,
            lantai: bin.lantai,
            ruang: bin.ruang,
            location: location,
            title: location,
            description: `${location} penuh (level ${bin.level}) - segera kosongkan`,
            capacity: bin.capacity,
            status: 'baru' as const, // All are new/unread
            type: 'error' as const, // All are error (full)
            timestamp: timestamp,
          } as DerivedNotification;
        })
        .sort((a, b) => b.level - a.level); // Sort by level descending

      callback(derivedNotifications);
    });

    return unsubscribe;
  },

  // Get derived notification counts (ONLY FULL BINS - level >= 90) - Real-time with read status
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
      // Get only FULL bins (level >= 90)
      const fullBins = binsData.filter((b) => b.level >= 90);
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
    let binsData: Bin[] = [];
    let readIds: string[] = [];

    // Subscribe to bins
    const unsubscribeBins = onSnapshot(collection(db, 'bins'), (snapshot) => {
      binsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Bin[];

      updateNotifications();
    });

    // Subscribe to read notifications (real-time)
    const unsubscribeRead = onSnapshot(collection(db, 'notificationRead'), (snapshot) => {
      readIds = snapshot.docs.map((doc) => doc.data().notificationId);
      updateNotifications();
    });

    const updateNotifications = () => {
      // Get only FULL bins (level >= 90)
      const fullBins = binsData.filter((bin) => bin.level >= 90);
      const fullBinIds = new Set(fullBins.map((b) => b.id));

      // Clean up read notifications for bins that are no longer full
      notificationReadService.cleanupReadNotificationsForNonFullBins(
        fullBinIds
      );

      // Derive notifications from FULL bins only (level >= 90)
      const derivedNotifications = fullBins
        .map((bin) => {
          const location = `${bin.gedung} - ${bin.lantai} - ${bin.ruang}`;
          const isRead = readIds.includes(bin.id);
          
          // Convert lastUpdate ke Date jika ada, jika tidak gunakan waktu saat ini
          const timestamp = bin.lastUpdate 
            ? (bin.lastUpdate.toDate ? bin.lastUpdate.toDate() : new Date(bin.lastUpdate))
            : new Date();

          return {
            id: bin.id,
            binId: bin.id,
            gedung: bin.gedung,
            lantai: bin.lantai,
            ruang: bin.ruang,
            location: location,
            title: location,
            description: `${location} penuh (level ${bin.level}) - segera kosongkan`,
            capacity: bin.capacity,
            status: isRead ? 'dibaca' : 'baru',
            type: 'error' as const,
            timestamp: timestamp,
          } as DerivedNotification;
        })
        .filter((notif) => {
          if (!filter || filter === 'semua') return true;
          return notif.status === filter;
        })
        .sort((a, b) => b.level - a.level);

      callback(derivedNotifications);
    };

    return () => {
      unsubscribeBins();
      unsubscribeRead();
    };
  },
};
